import { useState, useEffect } from 'react';
import { useUser, useAuth } from '../components/auth';
import { supabase, createSupabaseClient, getSafeSupabaseToken } from '../lib/supabase';

export interface Subscription {
    id: string;
    user_id: string;
    plan_type: 'free' | 'pro' | 'standard' | 'business' | 'dataroom';
    status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
    current_period_start: string | null;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
    trial_end: string | null;
    created_at: string;
    updated_at: string;
}

export interface SubscriptionUsage {
    documents_uploaded: number;
    storage_used: number; // in bytes
    month: string;
}

/**
 * Helper to process subscription status and strictly enforce 'free' limits
 * if the user has not paid successfully or the plan has expired.
 */
const processSub = (sub: Subscription | null): Subscription | null => {
    if (!sub) return null;
    
    // Check if the plan is paid and active
    const isPaidPlan = ['pro', 'standard', 'business', 'dataroom'].includes(sub.plan_type);
    const hasValidPeriod = !sub.current_period_end || new Date(sub.current_period_end) > new Date();
    const isPaid = isPaidPlan &&
        (sub.status === 'active' || sub.status === 'trialing') &&
        hasValidPeriod;
        
    // If the plan type is paid but expired or inactive, demote to free!
    if (sub.plan_type !== 'free' && !isPaid) {
        try {
            localStorage.removeItem('doctransfer_active_sub');
        } catch (e) {}
        return {
            ...sub,
            plan_type: 'free',
            status: 'canceled' // force status to show as inactive/canceled
        };
    }
    return sub;
};

/**
 * Custom hook to fetch and manage user subscription data
 */
export const useSubscription = () => {
    const { user } = useUser();
    const { getToken } = useAuth();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [usage, setUsage] = useState<SubscriptionUsage | null>(null);
    const [dailyUploadCount, setDailyUploadCount] = useState<number>(0);
    const [yearlyUploadCount, setYearlyUploadCount] = useState<number>(0);
    const [activeDocCount, setActiveDocCount] = useState<number>(0);
    const [monthlyUploadCount, setMonthlyUploadCount] = useState<number>(0);
    const [dailyESignatureCount, setDailyESignatureCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Refresh trigger
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshSubscription = () => {
        setRefreshKey(prev => prev + 1);
    };

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        const fetchSubscription = async () => {
            try {
                setIsLoading(true);

                // Get Supabase session token
                const token = await getSafeSupabaseToken(getToken);
                const authenticatedSupabase = createSupabaseClient(token || undefined);

                // Fetch subscription
                const { data: subData, error: subError } = await authenticatedSupabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (subError && subError.code !== 'PGRST116') { // PGRST116 = no rows returned
                    // If the table doesn't exist, we'll get an error.
                    // Instead of crashing, we'll just fall through to the default plan.
                    console.warn('Subscription table might be missing or inaccessible:', subError.message);
                }

                // If no subscription found, try to create one, or just use default
                if (!subData) {
                    try {
                        const { data: newSub, error: createError } = await authenticatedSupabase
                            .from('subscriptions')
                            .insert({
                                user_id: user.id,
                                plan_type: 'free',
                                status: 'active'
                            })
                            .select()
                            .single();

                        if (!createError) {
                            setSubscription(processSub(newSub));
                        } else {
                            // Fallback to local default if table is missing
                            setSubscription({
                                id: 'default',
                                user_id: user.id,
                                plan_type: 'free',
                                status: 'active',
                                current_period_start: null,
                                current_period_end: null,
                                cancel_at_period_end: false,
                                trial_end: null,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString()
                            });
                        }
                    } catch (e) {
                        // Fallback
                        setSubscription({
                            id: 'default',
                            user_id: user.id,
                            plan_type: 'free',
                            status: 'active',
                            current_period_start: null,
                            current_period_end: null,
                            cancel_at_period_end: false,
                            trial_end: null,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        });
                    }
                } else {
                    const processed = processSub(subData);
                    let finalSub = processed;
                    
                    // If DB returned free, purge any stale simulated or cached paid sub from localStorage
                    if (processed?.plan_type === 'free') {
                        try {
                            localStorage.removeItem('doctransfer_active_sub');
                        } catch (e) {}
                        finalSub = processed;
                    } else if (processed?.plan_type) {
                        // Persist verified active sub
                        try {
                            localStorage.setItem('doctransfer_active_sub', JSON.stringify({
                                user_id: user.id,
                                plan_type: processed.plan_type,
                                status: processed.status,
                                current_period_end: processed.current_period_end
                            }));
                        } catch (e) {}
                    }
                    setSubscription(finalSub);
                }

                // Fetch current month usage
                const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
                try {
                    const { data: usageData, error: usageError } = await supabase
                        .from('subscription_usage')
                        .select('documents_uploaded, storage_used, month')
                        .eq('user_id', user.id)
                        .eq('month', currentMonth)
                        .single();

                    if (!usageError || usageError.code === 'PGRST116') {
                        setUsage(usageData || {
                            documents_uploaded: 0,
                            storage_used: 0,
                            month: currentMonth
                        });
                    } else {
                        setUsage({
                            documents_uploaded: 0,
                            storage_used: 0,
                            month: currentMonth
                        });
                    }
                } catch (e) {
                    setUsage({
                        documents_uploaded: 0,
                        storage_used: 0,
                        month: currentMonth
                    });
                }

                // Fetch Active, Monthly, Daily & Yearly document tracking
                try {
                    const now = new Date();
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                    const startOfMonthISO = startOfMonth.toISOString();

                    // Total Active Document Links (Owned by user)
                    const { count: activeCount } = await supabase
                        .from('documents')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', user.id);
                    setActiveDocCount(activeCount || 0);

                    // Monthly Upload Count (Created this calendar month)
                    const { count: monthCount } = await supabase
                        .from('documents')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', user.id)
                        .gte('created_at', startOfMonthISO);
                    setMonthlyUploadCount(monthCount || 0);
                } catch (e) {
                    console.warn('Error fetching active/monthly document counts:', e);
                }

                // Fetch DAILY & YEARLY tracking
                try {
                    const todayStart = new Date();
                    todayStart.setHours(0, 0, 0, 0);
                    const todayISO = todayStart.toISOString();

                    const oneYearAgo = new Date();
                    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                    const oneYearAgoISO = oneYearAgo.toISOString();

                    // 1. Daily Upload Count
                    const { count: uploadCount, error: uploadCountError } = await supabase
                        .from('documents')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', user.id)
                        .gte('created_at', todayISO);

                    if (!uploadCountError) {
                        setDailyUploadCount(uploadCount || 0);
                    }

                    // 2. Yearly Upload Count
                    const { count: yearlyCount, error: yearlyCountError } = await supabase
                        .from('documents')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', user.id)
                        .gte('created_at', oneYearAgoISO);

                    if (!yearlyCountError) {
                        setYearlyUploadCount(yearlyCount || 0);
                    }

                    // 3. Daily E-Signature Count
                    const { count: esignCount, error: esignCountError } = await supabase
                        .from('documents')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', user.id)
                        .eq('requires_signature', true)
                        .gte('created_at', todayISO);

                    if (!esignCountError) {
                        setDailyESignatureCount(esignCount || 0);
                    }
                } catch (e) {
                    // Ignore tracking fetch errors
                }

                setError(null);
            } catch (err) {
                console.error('Error in fetchSubscription:', err);
                // Don't set error state to avoid blocking the UI, just use defaults
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubscription();

        // Set up real-time subscription to subscription changes
        const channel = supabase
            .channel(`subscription-changes-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'subscriptions',
                    filter: `user_id=eq.${user.id}`
                },
                (payload) => {
                    setSubscription(processSub(payload.new as Subscription));
                }
            )
            .subscribe();

        // Subscribe to usage changes
        const usageChannel = supabase
            .channel(`usage-changes-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'subscription_usage',
                    filter: `user_id=eq.${user.id}`
                },
                (payload) => {
                    // Only update if it's for the current month
                    const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
                    const newData = payload.new as SubscriptionUsage;
                    if (newData && newData.month === currentMonth) {
                        setUsage(newData);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
            supabase.removeChannel(usageChannel);
        };
    }, [user, refreshKey]);

    /**
     * Check if user can upload based on their plan and usage
     */
    const canUpload = (): boolean => {
        if (!user) return true;
        const plan = subscription?.plan_type || 'free';
        const isPaid = isPaidActive;

        if (!isPaid || plan === 'free') {
            return (activeDocCount || 0) < 5; // Max 5 active document links for Free tier
        }
        if (plan === 'pro' || plan === 'standard') {
            return (monthlyUploadCount || 0) < 100; // 100 links/month for Pro
        }
        if (plan === 'business') {
            return (monthlyUploadCount || 0) < 1000; // 1,000 links/month for Business
        }
        return true; // Unlimited for Data Room
    };

    /**
     * Check if user can create a new e-signature request
     */
    const canCreateESignature = (): boolean => {
        if (!subscription || subscription.plan_type === 'free' || !isPaidActive) return false;
        return true;
    };

    /**
     * Get max file size for user's plan (in bytes)
     */
    const getMaxFileSize = (): number => {
        const plan = subscription?.plan_type;
        const isPaid = isPaidActive;

        if (!isPaid || !plan || plan === 'free') {
            return 10 * 1024 * 1024; // 10MB limit for Free tier
        }
        if (plan === 'pro' || plan === 'standard') {
            return 50 * 1024 * 1024; // 50MB for Pro / Standard
        }
        if (plan === 'business') {
            return 250 * 1024 * 1024; // 250MB for Business (matching pricing page)
        }
        if (plan === 'dataroom') {
            return 2048 * 1024 * 1024; // 2GB for Data Room / VDR
        }
        return 10 * 1024 * 1024; // Safe fallback MUST be 10MB (Free tier limit)
    };

    /**
     * Check if user has access to a specific feature
     */
    const hasFeature = (feature: string): boolean => {
        const isPaid = isPaidActive;
        const plan = subscription?.plan_type;

        // Free plan features
        if (!isPaid || !plan || plan === 'free') {
            return ['basic_view_count', 'unlimited_visitors', 'password_protection'].includes(feature);
        }

        // Pro & Standard plan features
        if (plan === 'pro' || plan === 'standard') {
            const proFeatures = [
                'page_by_page_analytics',
                'unlimited_visitors',
                'password_protection',
                'link_expiration',
                'aes_encryption',
                'email_verification',
                'phone_otp',
                'phone_verification',
                'mobile_number_gate',
                'watermarking',
                'audit_trails',
                'esignature',
                'allow_downloads',
                'screenshot_protection',
                'burn_after_reading',
                'document_bundles',
                'advanced_analytics',
                'deal_rooms',
                'strict_drm',
                'nda_gate',
                'sector_presets',
                'custom_slug'
            ];
            return proFeatures.includes(feature);
        }

        // Business plan features
        if (plan === 'business') {
            const businessFeatures = [
                'page_by_page_analytics',
                'unlimited_visitors',
                'password_protection',
                'link_expiration',
                'aes_encryption',
                'email_verification',
                'phone_otp',
                'phone_verification',
                'mobile_number_gate',
                'watermarking',
                'audit_trails',
                'esignature',
                'allow_downloads',
                'screenshot_protection',
                'burn_after_reading',
                'document_bundles',
                'advanced_analytics',
                'deal_rooms',
                'strict_drm',
                'nda_gate',
                'sector_presets',
                'custom_slug',
                'geo_fencing',
                'lead_alerts',
                'vdr_folders',
                'active_sessions',
                'white_label',
                'custom_branding',
                'client_intake',
                'gst_invoicing',
                'team_seats'
            ];
            return businessFeatures.includes(feature);
        }

        // Data Room (VDR) gets all features including enterprise diligence tools
        return true;
    };

    /**
     * Check if a feature is locked for the current plan
     */
    const isFeatureLocked = (feature: string): boolean => {
        return !hasFeature(feature);
    };

    /**
     * Get remaining uploads for the current period
     */
    const getRemainingUploads = (): number => {
        if (!user || isLoading) return 5;
        const plan = subscription?.plan_type || 'free';
        const isPaid = isPaidActive;

        if (!isPaid || plan === 'free') {
            return Math.max(0, 5 - (activeDocCount || 0)); // 5 active document links
        }
        if (plan === 'pro' || plan === 'standard') {
            return Math.max(0, 100 - (monthlyUploadCount || 0)); // 100 links/month
        }
        if (plan === 'business') {
            return Math.max(0, 1000 - (monthlyUploadCount || 0)); // 1,000 links/month
        }
        return Infinity; // Unlimited for Data Room
    };

    /**
     * Get remaining e-signatures for the current period
     */
    const getRemainingESignatures = (): number => {
        if (!subscription || subscription.plan_type === 'free' || !isPaidActive) return 0;
        return Infinity;
    };

    /**
     * Get storage duration in days
     */
    const getStorageDurationDays = (): number => {
        return 36500;
    };

    const isPaidActive = ['pro', 'standard', 'business', 'dataroom'].includes(subscription?.plan_type || '') &&
        (subscription?.status === 'active' || subscription?.status === 'trialing') &&
        (!subscription?.current_period_end || new Date(subscription.current_period_end) > new Date());

    return {
        subscription,
        usage,
        dailyUploadCount,
        yearlyUploadCount,
        activeDocCount,
        monthlyUploadCount,
        dailyESignatureCount,
        isLoading,
        error,
        canUpload,
        canCreateESignature,
        getMaxFileSize,
        hasFeature,
        isFeatureLocked,
        refreshSubscription,

        getRemainingUploads,
        getRemainingESignatures,
        getStorageDurationDays,
        isPaid: isPaidActive,
        isPro: (subscription?.plan_type === 'pro' || subscription?.plan_type === 'standard') && isPaidActive,
        isStandard: subscription?.plan_type === 'standard' && isPaidActive,
        isBusiness: subscription?.plan_type === 'business' && isPaidActive,
        isDataRoom: subscription?.plan_type === 'dataroom' && isPaidActive,
        isSingleDeal: false,
    };
};

export default useSubscription;
