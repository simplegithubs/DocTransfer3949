import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../lib/supabase';

export interface Subscription {
    id: string;
    user_id: string;
    plan_type: 'free' | 'standard' | 'business';
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
 * Custom hook to fetch and manage user subscription data
 */
export const useSubscription = () => {
    const { user } = useUser();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [usage, setUsage] = useState<SubscriptionUsage | null>(null);
    const [dailyUploadCount, setDailyUploadCount] = useState<number>(0);
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

                // Fetch subscription
                const { data: subData, error: subError } = await supabase
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
                        const { data: newSub, error: createError } = await supabase
                            .from('subscriptions')
                            .insert({
                                user_id: user.id,
                                plan_type: 'free',
                                status: 'active'
                            })
                            .select()
                            .single();

                        if (!createError) {
                            setSubscription(newSub);
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
                    setSubscription(subData);
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

                // Fetch DAILY tracking
                try {
                    const todayStart = new Date();
                    todayStart.setHours(0, 0, 0, 0);
                    const todayISO = todayStart.toISOString();

                    // 1. Daily Upload Count
                    const { count: uploadCount, error: uploadCountError } = await supabase
                        .from('documents')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', user.id)
                        .gte('created_at', todayISO);

                    if (!uploadCountError) {
                        setDailyUploadCount(uploadCount || 0);
                    }

                    // 2. Daily E-Signature Count
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
                    // Ignore daily fetch errors
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
            .channel('subscription-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'subscriptions',
                    filter: `user_id=eq.${user.id}`
                },
                (payload) => {
                    setSubscription(payload.new as Subscription);
                }
            )
            .subscribe();

        // Subscribe to usage changes
        const usageChannel = supabase
            .channel('usage-changes')
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
        return true; // Unlimited uploads for everyone
    };

    /**
     * Check if user can create a new e-signature request
     */
    const canCreateESignature = (): boolean => {
        return true; // Unlimited e-signatures for everyone
    };

    /**
     * Get max file size for user's plan (in bytes)
     */
    const getMaxFileSize = (): number => {
        return 1024 * 1024 * 1024; // 1GB limit for everyone
    };

    /**
     * Check if user has access to a specific feature
     */
    const hasFeature = (feature: string): boolean => {
        return true; // All features unlocked for everyone
    };

    /**
     * Check if a feature is locked for the current plan
     */
    const isFeatureLocked = (feature: string): boolean => {
        return !hasFeature(feature);
    };

    /**
     * Get remaining uploads for the current period (Today for Free, Unlimited for Paid)
     */
    const getRemainingUploads = (): number => {
        if (!subscription || subscription.plan_type !== 'free') return Infinity; // Unlimited for paid plans

        return Math.max(0, 10 - dailyUploadCount);
    };

    /**
     * Get remaining e-signatures for the current period
     */
    const getRemainingESignatures = (): number => {
        if (!subscription || subscription.plan_type !== 'free') return Infinity;

        return Math.max(0, 10 - dailyESignatureCount);
    };

    /**
     * Get storage duration in days
     */
    const getStorageDurationDays = (): number => {
        return 36500; // Unlimited for everyone
    };

    return {
        subscription,
        usage,
        dailyUploadCount,
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
        isPaid: (subscription?.plan_type === 'standard' || subscription?.plan_type === 'business') &&
            (subscription.status === 'active' || subscription.status === 'trialing') &&
            (!subscription.current_period_end || new Date(subscription.current_period_end) > new Date()),
        isStandard: subscription?.plan_type === 'standard' &&
            (subscription.status === 'active' || subscription.status === 'trialing') &&
            (!subscription.current_period_end || new Date(subscription.current_period_end) > new Date()),
        isBusiness: subscription?.plan_type === 'business' &&
            (subscription.status === 'active' || subscription.status === 'trialing') &&
            (!subscription.current_period_end || new Date(subscription.current_period_end) > new Date()),
    };
};

export default useSubscription;
