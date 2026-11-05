import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useUser, useAuth } from './components/auth';
import { useGeoCurrency } from './hooks/useGeoCurrency';
import Logo from './components/Logo';
import SEO from './components/SEO';
import {
    ArrowLeft,
    Check,
    Shield,
    Loader2,
    Zap,
    Briefcase,
    CreditCard,
    FolderLock,
    Lock,
    ChevronRight,
    RefreshCw,
    Clock,
    CheckCircle2,
    Sparkles,
    ShieldCheck,
    Phone,
    AlertCircle,
    Building,
    FileText,
    Globe
} from 'lucide-react';
import { supabase } from './lib/supabase';

export type CheckoutCurrency = 'INR' | 'USD' | 'AED' | 'EUR' | 'GBP';

interface CurrencyPricing {
    monthly: number;
}

interface PlanConfig {
    name: string;
    pricing: Record<CheckoutCurrency, CurrencyPricing>;
    color: string;
    icon: any;
    features: string[];
    gradient: string;
    planId: string;
}

const CURRENCY_CONFIG: Record<CheckoutCurrency, { symbol: string; label: string; flag: string }> = {
    INR: { symbol: '₹', label: 'INR (₹)', flag: '🇮🇳' },
    USD: { symbol: '$', label: 'USD ($)', flag: '🇺🇸' },
    AED: { symbol: 'AED ', label: 'AED (د.إ)', flag: '🇦🇪' },
    EUR: { symbol: '€', label: 'EUR (€)', flag: '🇪🇺' },
    GBP: { symbol: '£', label: 'GBP (£)', flag: '🇬🇧' }
};

const PLAN_CONFIGS: Record<string, PlanConfig> = {
    pro: {
        name: 'Pro Dealmaker Plan',
        pricing: {
            INR: { monthly: 999 },
            USD: { monthly: 29 },
            AED: { monthly: 199 },
            EUR: { monthly: 27 },
            GBP: { monthly: 23 }
        },
        color: '#3b82f6',
        icon: Zap,
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        planId: import.meta.env.VITE_RAZORPAY_PRO_PLAN_ID || 'plan_TXFen0j8CaoC4o',
        features: [
            '100 Shared deal links per month',
            '50MB max file size (PDF, Decks, Images & Video)',
            'Strict DRM: Block Print (Ctrl+P) & Copy (Ctrl+C)',
            'Pre-Flight Click-Through NDA Gate (4 templates)',
            '1-Click Sector Presets (Dubai RE, M&A, VC)',
            'Custom Deal Vanity Slug (/view/slug)',
            'Full Attention Heatmaps & Page-by-Page Analytics',
            'Self-Destruct Timers & Remote Kill Switch'
        ]
    },
    standard: {
        name: 'Pro Dealmaker Plan',
        pricing: {
            INR: { monthly: 999 },
            USD: { monthly: 29 },
            AED: { monthly: 199 },
            EUR: { monthly: 27 },
            GBP: { monthly: 23 }
        },
        color: '#3b82f6',
        icon: Zap,
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        planId: import.meta.env.VITE_RAZORPAY_PRO_PLAN_ID || 'plan_TXFen0j8CaoC4o',
        features: [
            '100 Shared deal links per month',
            '50MB max file size (PDF, Decks, Images & Video)',
            'Strict DRM: Block Print (Ctrl+P) & Copy (Ctrl+C)',
            'Pre-Flight Click-Through NDA Gate (4 templates)',
            '1-Click Sector Presets (Dubai RE, M&A, VC)',
            'Custom Deal Vanity Slug (/view/slug)',
            'Full Attention Heatmaps & Page-by-Page Analytics',
            'Self-Destruct Timers & Remote Kill Switch'
        ]
    },
    business: {
        name: 'Business & Agency Suite',
        pricing: {
            INR: { monthly: 2499 },
            USD: { monthly: 79 },
            AED: { monthly: 499 },
            EUR: { monthly: 74 },
            GBP: { monthly: 63 }
        },
        color: '#8b5cf6',
        icon: Briefcase,
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        planId: import.meta.env.VITE_RAZORPAY_BUSINESS_PLAN_ID || 'plan_TXFg28EWp7dw4C',
        features: [
            'Everything in Pro Plan included',
            '1,000 Shared deal links & 250MB uploads',
            '5 Included Team Member Seats',
            'White-Label CNAME Domain (deals.yourfirm.com)',
            'Verified Broker License Seal (DLD ORN, RERA, UK, EU)',
            'Active Sessions Manager & Real-Time Kill Switch',
            'Territory Geo-Fencing (UAE, India, UK, EU, US)',
            'Instant WhatsApp & Email Lead Alerts (Dwell >60s)',
            'Global B2B Tax Invoicing (GST 18%, UAE TRN, EU VAT)'
        ]
    },
    dataroom: {
        name: 'Virtual Data Room (VDR) Enterprise',
        pricing: {
            INR: { monthly: 6999 },
            USD: { monthly: 199 },
            AED: { monthly: 1299 },
            EUR: { monthly: 185 },
            GBP: { monthly: 159 }
        },
        color: '#10b981',
        icon: FolderLock,
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        planId: import.meta.env.VITE_RAZORPAY_DATAROOM_PLAN_ID || 'plan_TXFgoDrw5IBk6O',
        features: [
            'Everything in Business Suite included',
            'Unlimited Deal Rooms & 2GB file upload size',
            '15 Team seats + Unlimited Diligence Guests',
            'Zero-Knowledge Client-Side AES-256 Vault Mode',
            'Multi-Party Isolated Bidder Chinese Walls',
            'VDR Diligence Folder Hierarchy (01_Legal, 02_Fin)',
            'Due Diligence Q&A Inquiry Workflow',
            'Bates numbering & 1-Click ZIP Archive export',
            'DIFC-LCIA / English Law / Indian Arbitration seals',
            '99.99% Enterprise Uptime SLA with 24/7 Concierge'
        ]
    },
    single_deal: {
        name: '90-Day Single-Deal VDR Pass',
        pricing: {
            INR: { monthly: 9999 },
            USD: { monthly: 299 },
            AED: { monthly: 1899 },
            EUR: { monthly: 279 },
            GBP: { monthly: 239 }
        },
        color: '#4f46e5',
        icon: FolderLock,
        gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        planId: 'single_deal_pass',
        features: [
            '90 Days of complete Virtual Data Room power for 1 deal',
            'Multi-party Chinese walls & isolated bidder permissions',
            'Strict DRM defense: print lockout, screenshot protection',
            'Due diligence Q&A module & resolution tracking',
            'Real-time WhatsApp & email hot-lead telemetry',
            'Post-closing compliance Bates ZIP archive export',
            'One-time payment — zero recurring auto-renewal'
        ]
    }
};

const COUNTRY_CODES = [
    { code: '+91', flag: '🇮🇳', name: 'India' },
    { code: '+971', flag: '🇦🇪', name: 'United Arab Emirates' },
    { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    { code: '+1', flag: '🇺🇸', name: 'United States / Canada' },
    { code: '+49', flag: '🇩🇪', name: 'Germany' },
    { code: '+33', flag: '🇫🇷', name: 'France' },
    { code: '+65', flag: '🇸🇬', name: 'Singapore' },
    { code: '+61', flag: '🇦🇺', name: 'Australia' },
    { code: '+81', flag: '🇯🇵', name: 'Japan' }
];

const Checkout: React.FC = () => {
    const [searchParams] = useSearchParams();
    const geo = useGeoCurrency();
    const rawPlan = searchParams.get('plan') || 'pro';
    const planType = rawPlan === 'standard' ? 'pro' : rawPlan;

    const initialCurrency = geo.isUSVisitor
        ? 'USD'
        : (((searchParams.get('currency') || geo.currency).toUpperCase()) as CheckoutCurrency);
    const validCurrency: CheckoutCurrency = ['INR', 'USD', 'AED', 'EUR', 'GBP'].includes(initialCurrency) ? initialCurrency : 'USD';

    const [currency, setCurrency] = useState<CheckoutCurrency>(geo.isUSVisitor ? 'USD' : validCurrency);
    const billingCycle = 'monthly';

    useEffect(() => {
        if (geo.isUSVisitor) {
            setCurrency('USD');
        } else if (!searchParams.get('currency')) {
            setCurrency(geo.currency as CheckoutCurrency);
        }
    }, [geo.isUSVisitor, geo.currency, searchParams]);

    const showCurrencySwitcher = !geo.isUSVisitor;

    const { user } = useUser();
    const { openAuthModal } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [razorpayScriptLoaded, setRazorpayScriptLoaded] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const plan = PLAN_CONFIGS[planType] || PLAN_CONFIGS.pro;
    const PlanIcon = plan.icon;
    const isSingleDeal = planType === 'single_deal';

    const cur = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.USD;
    const isINR = currency === 'INR';

    const planPricing = plan.pricing[currency] || plan.pricing.USD;
    const monthlyRate = planPricing.monthly;
    const totalDueToday = planPricing.monthly;

    // User details
    const userEmail = user?.email || user?.primaryEmailAddress?.emailAddress || user?.rawUser?.email || '';
    const userName = user?.fullName || userEmail || 'DocTransfer User';
    const initialPhone = (user as any)?.phone || user?.rawUser?.phone || user?.rawUser?.user_metadata?.phone || '';

    const defaultCountryCode = (geo.isUSVisitor || currency === 'USD') ? '+1' : (currency === 'INR' ? '+91' : (currency === 'AED' ? '+971' : (currency === 'GBP' ? '+44' : '+1')));
    const [countryCode, setCountryCode] = useState<string>(defaultCountryCode);
    const [phoneNumber, setPhoneNumber] = useState<string>(initialPhone.replace(/^\+\d{1,3}/, ''));
    const [phoneError, setPhoneError] = useState<string | null>(null);

    // B2B Regional Tax States
    const [isB2BTax, setIsB2BTax] = useState(false);
    const [taxIdNumber, setTaxIdNumber] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [taxError, setTaxError] = useState<string | null>(null);

    const logoUrl = `${window.location.origin}/apple-touch-icon.png`;

    // Load Razorpay SDK
    useEffect(() => {
        const scriptId = 'razorpay-sdk-script';
        if (document.getElementById(scriptId)) {
            setRazorpayScriptLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
            setRazorpayScriptLoaded(true);
        };
        script.onerror = () => {
            console.error('Failed to load Razorpay SDK');
        };
        document.body.appendChild(script);
    }, []);

    // Razorpay Checkout Execution
    const handleRazorpayPayment = async () => {
        if (!user) {
            openAuthModal('sign-in');
            return;
        }

        const cleanDigits = phoneNumber.replace(/\D/g, '');
        if (!cleanDigits) {
            setPhoneError('Please enter your mobile number to proceed.');
            return;
        }

        if (countryCode === '+91' && cleanDigits.length !== 10) {
            setPhoneError('Please enter a valid 10-digit Indian mobile number.');
            return;
        } else if (cleanDigits.length < 7) {
            setPhoneError('Please enter a valid mobile number.');
            return;
        }

        if (isB2BTax && !taxIdNumber.trim()) {
            setTaxError('Please enter your valid corporate Tax / VAT / GST identification number.');
            return;
        }

        setPhoneError(null);
        setTaxError(null);
        setLoading(true);
        setErrorMsg(null);

        const fullPhone = `${countryCode}${cleanDigits}`;

        try {
            const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TwAWmDJBUE3Si7';

            let subData: any = null;
            try {
                const { data, error } = await supabase.functions.invoke('create-razorpay-subscription', {
                    body: {
                        userId: user.id,
                        planType: planType,
                        billingCycle: billingCycle,
                        currency: currency,
                        userEmail: userEmail,
                        userName: userName,
                        userPhone: fullPhone
                    }
                });

                if (error) {
                    console.warn("Edge function subscription notice:", error);
                }
                subData = data;
            } catch (invokeErr) {
                console.warn("Edge function invocation fallback:", invokeErr);
            }

            const subscriptionId = subData?.subscriptionId;

            if (typeof (window as any).Razorpay === 'undefined') {
                throw new Error('Razorpay SDK is initializing. Please check your connection and retry.');
            }

            const options: any = {
                key: keyId,
                name: 'DocTransfer',
                description: `${plan.name} (${isSingleDeal ? '90-Day Pass' : 'Monthly'})`,
                image: logoUrl,
                prefill: {
                    name: userName,
                    email: userEmail,
                    contact: fullPhone
                },
                readonly: {
                    email: true,
                    contact: true,
                    name: false
                },
                notes: {
                    userId: user.id,
                    userEmail: userEmail,
                    userPhone: fullPhone,
                    planType: planType,
                    billingCycle: billingCycle,
                    currency: currency,
                    taxId: taxIdNumber,
                    companyName: companyName
                },
                theme: {
                    color: plan.color
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                },
                handler: async function (response: any) {
                    setLoading(true);
                    const transactionRef = response.razorpay_payment_id || response.razorpay_subscription_id || subscriptionId || '';

                    try {
                        await supabase.rpc('activate_user_subscription', {
                            p_user_id: user.id,
                            p_plan_type: planType,
                            p_billing_cycle: billingCycle,
                            p_transaction_ref: transactionRef
                        });
                    } catch (rpcErr) {
                        console.warn("RPC activation notice:", rpcErr);
                    }

                    navigate(
                        `/payment-success?gateway=razorpay&plan=${planType}&cycle=${billingCycle}&payment_id=${response.razorpay_payment_id || ''}&subscription_id=${response.razorpay_subscription_id || subscriptionId || ''}`
                    );
                }
            };

            if (subscriptionId && !subscriptionId.startsWith('sub_simulated_') && !isSingleDeal) {
                options.subscription_id = subscriptionId;
            } else {
                options.amount = totalDueToday * 100;
                options.currency = currency === 'AED' ? 'AED' : (currency === 'EUR' ? 'EUR' : (currency === 'GBP' ? 'GBP' : (currency === 'INR' ? 'INR' : 'USD')));
            }

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (resp: any) {
                console.error("Razorpay Payment Failed:", resp.error);
                setErrorMsg(`Payment failed: ${resp.error?.description || 'Transaction declined'}`);
                setLoading(false);
            });

            rzp.open();

        } catch (err: any) {
            console.error("Checkout submission error:", err);
            setErrorMsg(err.message || 'Failed to initialize Razorpay checkout. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc',
            fontFamily: "'Inter', sans-serif"
        }}>
            <SEO
                title={`Checkout — ${plan.name} | DocTransfer`}
                description={`Subscribe to DocTransfer ${plan.name} via 3D Secure Credit/Debit Cards, Apple Pay or UPI.`}
                keywords="DocTransfer checkout, Razorpay payment, secure data room checkout"
            />

            {/* Top Bar */}
            <header style={{
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'white',
                borderBottom: '1px solid #e2e8f0'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link to="/pricing" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#64748b',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        transition: 'color 0.2s'
                    }}>
                        <ArrowLeft size={18} />
                        Back to Plans
                    </Link>
                    <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />
                    <Logo size={28} />
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#64748b',
                    fontSize: '0.82rem',
                    fontWeight: 600
                }}>
                    <Lock size={15} color="#10b981" />
                    256-Bit SSL Encrypted Checkout
                </div>
            </header>

            {/* Progress Steps */}
            <div style={{
                background: 'white',
                borderBottom: '1px solid #e2e8f0',
                padding: '1.25rem 2rem'
            }}>
                <div style={{
                    maxWidth: '850px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {[
                        { step: 1, label: 'Select Plan', done: true },
                        { step: 2, label: 'Payment & Billing', done: false, active: true },
                        { step: 3, label: 'Instant Activation', done: false }
                    ].map((s, i) => (
                        <React.Fragment key={s.step}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <div style={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    background: s.done ? '#10b981' : (s.active ? plan.color : '#e2e8f0'),
                                    color: s.done || s.active ? 'white' : '#94a3b8'
                                }}>
                                    {s.done ? <Check size={16} strokeWidth={3} /> : s.step}
                                </div>
                                <span style={{
                                    fontSize: '0.85rem',
                                    fontWeight: s.active ? 700 : 500,
                                    color: s.active ? '#0f172a' : (s.done ? '#10b981' : '#94a3b8')
                                }}>{s.label}</span>
                            </div>
                            {i < 2 && (
                                <div style={{
                                    width: '70px',
                                    height: '2px',
                                    background: s.done ? '#10b981' : '#e2e8f0',
                                    margin: '0 1rem'
                                }} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <main style={{
                maxWidth: '1140px',
                margin: '0 auto',
                padding: '3rem 1.5rem',
                display: 'grid',
                gridTemplateColumns: '1fr 410px',
                gap: '2.5rem',
                alignItems: 'start'
            }}>
                {/* Left Column: Payment Details */}
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                        Complete Your Subscription
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                        You are subscribing to <strong>{plan.name}</strong>. Powered by secure 3D-Secure card and UPI processing.
                    </p>

                    {userEmail ? (
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            padding: '0.45rem 0.9rem',
                            borderRadius: '10px',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            marginBottom: '1.75rem',
                            border: '1px solid #bfdbfe'
                        }}>
                            <ShieldCheck size={16} color="#2563eb" />
                            <span>Logged in as: <strong>{userEmail}</strong></span>
                        </div>
                    ) : (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '0.75rem',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            padding: '0.75rem 1rem',
                            borderRadius: '12px',
                            marginBottom: '1.5rem',
                            fontSize: '0.85rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}>
                                <Lock size={16} color="#6366f1" />
                                <span>Sign in to link this subscription to your DocTransfer account</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => openAuthModal('sign-in')}
                                style={{
                                    padding: '0.35rem 0.85rem',
                                    borderRadius: '8px',
                                    background: '#4f46e5',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Sign In / Sign Up
                            </button>
                        </div>
                    )}

                    {errorMsg && (
                        <div style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#991b1b',
                            padding: '1rem 1.25rem',
                            borderRadius: '12px',
                            marginBottom: '1.5rem',
                            fontSize: '0.9rem'
                        }}>
                            {errorMsg}
                        </div>
                    )}

                    {/* Currency Selector Pill (Hidden for US Visitors who only see USD) */}
                    {showCurrencySwitcher && (
                        <div style={{
                            background: 'white',
                            padding: '1rem 1.25rem',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '0.75rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Globe size={18} color="#0284c7" />
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                                    Billing Currency:
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                                {(['INR', 'AED', 'EUR', 'GBP', 'USD'] as CheckoutCurrency[]).map((c) => {
                                    const isSel = currency === c;
                                    return (
                                        <button
                                            key={c}
                                            onClick={() => setCurrency(c)}
                                            style={{
                                                padding: '0.3rem 0.65rem',
                                                borderRadius: '8px',
                                                border: isSel ? '1px solid #0284c7' : '1px solid #e2e8f0',
                                                background: isSel ? '#eff6ff' : '#ffffff',
                                                color: isSel ? '#0284c7' : '#64748b',
                                                fontWeight: isSel ? 800 : 600,
                                                fontSize: '0.78rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            {CURRENCY_CONFIG[c].flag} {c}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Unified Secure Payment Gateway Card */}
                    <div style={{
                        border: '2px solid #0284c7',
                        borderRadius: '20px',
                        padding: '1.6rem 1.75rem',
                        background: '#ffffff',
                        boxShadow: '0 10px 30px rgba(2, 132, 199, 0.08)',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                <div style={{
                                    width: '46px',
                                    height: '46px',
                                    borderRadius: '12px',
                                    background: '#f0f9ff',
                                    border: '1px solid #bae6fd',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#0284c7'
                                }}>
                                    <CreditCard size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                        {isINR ? 'Instant UPI & RuPay / Cards' : 'Credit / Debit Card & Apple Pay'}
                                    </h3>
                                    <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>
                                        {isINR
                                            ? 'Google Pay, PhonePe, Paytm, RuPay, Indian NetBanking & 18% GST Invoicing'
                                            : '3D-Secure 2.0 (Visa, Mastercard, American Express) with Zero Foreign Transaction Fees'}
                                    </p>
                                </div>
                            </div>
                            <span style={{
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                background: isINR ? '#dcfce7' : '#e0f2fe',
                                color: isINR ? '#15803d' : '#0369a1',
                                padding: '3px 9px',
                                borderRadius: '6px'
                            }}>
                                {isINR ? '18% GST ITC' : (currency === 'AED' ? 'DUBAI / UAE TRN' : (currency === 'EUR' ? 'EU 0% REVERSE' : 'GLOBAL 3D SECURE'))}
                            </span>
                        </div>

                        {/* Badges list */}
                        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                            {(isINR
                                ? ['Google Pay', 'PhonePe', 'Paytm UPI', 'RuPay', 'Indian NetBanking', '18% GST Invoicing']
                                : ['Visa', 'Mastercard', 'American Express', 'Apple Pay', '3D Secure 2.0', 'Instant Activation']
                            ).map(b => (
                                <span key={b} style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    background: '#f8fafc',
                                    color: '#334155',
                                    padding: '3px 8px',
                                    borderRadius: '6px',
                                    border: '1px solid #e2e8f0'
                                }}>{b}</span>
                            ))}
                        </div>

                        {/* Mobile Number Input */}
                        <div style={{
                            background: '#f8fafc',
                            border: phoneError ? '1.5px solid #ef4444' : '1px solid #e2e8f0',
                            borderRadius: '14px',
                            padding: '1rem 1.25rem',
                            marginBottom: '1.25rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                                    <Phone size={14} color="#0284c7" />
                                    Mobile Phone Number (for receipt & SMS verification)
                                </label>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#fef3c7', color: '#b45309', padding: '2px 7px', borderRadius: '4px' }}>
                                    REQUIRED
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: '0.6rem' }}>
                                <select
                                    value={countryCode}
                                    onChange={(e) => setCountryCode(e.target.value)}
                                    style={{
                                        padding: '0.7rem 0.8rem',
                                        borderRadius: '10px',
                                        border: '1px solid #cbd5e1',
                                        background: '#ffffff',
                                        color: '#0f172a',
                                        fontSize: '0.88rem',
                                        fontWeight: 700,
                                        outline: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {COUNTRY_CODES.map((c) => (
                                        <option key={c.code} value={c.code}>
                                            {c.flag} {c.code}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        setPhoneNumber(e.target.value);
                                        if (phoneError) setPhoneError(null);
                                    }}
                                    placeholder={countryCode === '+91' ? '98765 43210' : 'Mobile number'}
                                    style={{
                                        flex: 1,
                                        padding: '0.7rem 0.95rem',
                                        borderRadius: '10px',
                                        border: phoneError ? '1px solid #ef4444' : '1px solid #cbd5e1',
                                        background: '#ffffff',
                                        color: '#0f172a',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            {phoneError && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.4rem' }}>
                                    <AlertCircle size={14} /> {phoneError}
                                </div>
                            )}
                        </div>

                        {/* Regional B2B Corporate Tax Invoicing Card */}
                        <div style={{
                            background: isB2BTax ? '#f0fdf4' : '#f8fafc',
                            border: isB2BTax ? '1.5px solid #10b981' : '1px solid #e2e8f0',
                            borderRadius: '14px',
                            padding: '1rem 1.25rem',
                            marginBottom: '1.5rem',
                            transition: 'all 0.2s ease'
                        }}>
                            <div
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                                onClick={() => setIsB2BTax(!isB2BTax)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <input
                                        type="checkbox"
                                        id="taxCheckbox"
                                        checked={isB2BTax}
                                        onChange={(e) => setIsB2BTax(e.target.checked)}
                                        style={{ width: '17px', height: '17px', accentColor: '#059669', cursor: 'pointer' }}
                                    />
                                    <label htmlFor="taxCheckbox" style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>
                                        {currency === 'INR' && 'Claim GST Input Tax Credit (18% ITC)'}
                                        {currency === 'AED' && 'Add UAE Tax Registration Number (5% VAT TRN)'}
                                        {currency === 'EUR' && 'EU Business Reverse Charge (0% VAT VIES)'}
                                        {currency === 'GBP' && 'Add UK VAT Registration Number'}
                                        {currency === 'USD' && 'Add Corporate Tax ID / Business Invoicing'}
                                    </label>
                                </div>
                                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 7px', borderRadius: '5px' }}>
                                    B2B INVOICE
                                </span>
                            </div>

                            {isB2BTax && (
                                <div style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                                            {currency === 'INR' && 'GSTIN (15-digit GST Identification Number)'}
                                            {currency === 'AED' && 'UAE TRN (15-digit Tax Registration Number)'}
                                            {currency === 'EUR' && 'EU VAT ID (e.g. DE123456789, FR12345678901)'}
                                            {currency === 'GBP' && 'UK VAT Number (e.g. GB123456789)'}
                                            {currency === 'USD' && 'Corporate EIN / Tax ID Number'}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={currency === 'INR' ? '29AAAAA0000A1Z5' : currency === 'AED' ? '100XXXXXXXXX003' : currency === 'EUR' ? 'DE123456789' : 'Tax ID Number'}
                                            value={taxIdNumber}
                                            onChange={(e) => setTaxIdNumber(e.target.value.toUpperCase())}
                                            style={{
                                                width: '100%',
                                                padding: '0.6rem 0.8rem',
                                                borderRadius: '8px',
                                                border: '1px solid #cbd5e1',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                                            Registered Company / Brokerage Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Emaar Partner Agency / Cavendish M&A Advisory LLP"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.6rem 0.8rem',
                                                borderRadius: '8px',
                                                border: '1px solid #cbd5e1',
                                                fontSize: '0.85rem',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                    {taxError && (
                                        <div style={{ color: '#dc2626', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <AlertCircle size={13} /> {taxError}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Primary Submit Button */}
                        <button
                            onClick={handleRazorpayPayment}
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1.25rem 2rem',
                                borderRadius: '14px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                                color: 'white',
                                fontWeight: 800,
                                fontSize: '1.05rem',
                                cursor: loading ? 'default' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                boxShadow: '0 10px 25px rgba(2, 132, 199, 0.35)',
                                transition: 'all 0.2s'
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="checkout-spin" />
                                    Launching Secure Checkout...
                                </>
                            ) : (
                                <>
                                    <Lock size={18} />
                                    Pay Securely — {cur.symbol}{totalDueToday.toLocaleString()}
                                    <ChevronRight size={18} />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Legal & No Refund Notice */}
                    <div style={{
                        marginTop: '1.25rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '12px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.78rem',
                        color: '#64748b',
                        lineHeight: 1.5,
                        textAlign: 'center'
                    }}>
                        By clicking Pay, you agree to our{' '}
                        <Link to="/terms" target="_blank" style={{ color: '#0284c7', fontWeight: 600, textDecoration: 'underline' }}>
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" target="_blank" style={{ color: '#0284c7', fontWeight: 600, textDecoration: 'underline' }}>
                            Privacy Policy
                        </Link>
                        . All enterprise subscriptions are subject to our{' '}
                        <Link to="/refund-policy" target="_blank" style={{ color: '#dc2626', fontWeight: 600, textDecoration: 'underline' }}>
                            No-Refund Policy
                        </Link>
                        . You can cancel auto-renewal anytime from your dashboard.
                    </div>

                    {/* Trust Indicators */}
                    <div style={{
                        marginTop: '1.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2rem',
                        flexWrap: 'wrap'
                    }}>
                        {[
                            { icon: ShieldCheck, text: 'RBI, PCI-DSS & PSD2 Compliant' },
                            { icon: RefreshCw, text: 'Cancel Anytime' },
                            { icon: Clock, text: 'Instant Plan Activation' }
                        ].map(t => (
                            <div key={t.text} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                color: '#64748b',
                                fontSize: '0.8rem',
                                fontWeight: 500
                            }}>
                                <t.icon size={15} color="#10b981" />
                                {t.text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div>
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        border: '1px solid #e2e8f0',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                    }}>
                        {/* Header Banner */}
                        <div style={{
                            background: plan.gradient,
                            padding: '1.5rem 1.75rem',
                            color: 'white'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                opacity: 0.9,
                                marginBottom: '0.75rem'
                            }}>
                                <Sparkles size={14} /> Order Summary
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <PlanIcon size={22} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                                        {plan.name}
                                    </h3>
                                    <p style={{ margin: 0, fontSize: '0.82rem', opacity: 0.85 }}>
                                        {isSingleDeal ? '90-Day Single Deal Access' : 'Monthly billing'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Line Items */}
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                paddingBottom: '0.75rem',
                                borderBottom: '1px solid #f1f5f9',
                                fontSize: '0.88rem',
                                color: '#475569'
                            }}>
                                <span>Subscription Plan</span>
                                <span style={{ fontWeight: 700, color: '#0f172a' }}>{plan.name}</span>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.75rem 0',
                                borderBottom: '1px solid #f1f5f9',
                                fontSize: '0.88rem',
                                color: '#475569'
                            }}>
                                <span>Payment Processing</span>
                                <span style={{ fontWeight: 700, color: '#0284c7' }}>
                                    Razorpay (3D Secure & UPI)
                                </span>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.75rem 0',
                                borderBottom: '1px solid #f1f5f9',
                                fontSize: '0.88rem',
                                color: '#475569'
                            }}>
                                <span>Billing Cycle</span>
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>
                                    {isSingleDeal ? '90-Day Pass' : 'Monthly'}
                                </span>
                            </div>

                            {!isSingleDeal && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 0',
                                    borderBottom: '1px solid #f1f5f9',
                                    fontSize: '0.88rem',
                                    color: '#475569'
                                }}>
                                    <span>Rate</span>
                                    <span style={{ fontWeight: 600, color: '#0f172a' }}>
                                        {cur.symbol}{monthlyRate.toLocaleString()}/mo
                                    </span>
                                </div>
                            )}

                            {isINR && (
                                <>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem 0',
                                        borderBottom: '1px solid #f1f5f9',
                                        fontSize: '0.88rem',
                                        color: '#475569'
                                    }}>
                                        <span>Base Price (Net of GST)</span>
                                        <span style={{ fontWeight: 600, color: '#0f172a' }}>
                                            ₹{Math.round(totalDueToday / 1.18).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem 0',
                                        borderBottom: '1px solid #f1f5f9',
                                        fontSize: '0.88rem',
                                        color: '#475569'
                                    }}>
                                        <span>18% GST (Input Tax Credit)</span>
                                        <span style={{ fontWeight: 600, color: '#059669' }}>
                                            + ₹{(totalDueToday - Math.round(totalDueToday / 1.18)).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </>
                            )}

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline',
                                paddingTop: '1rem',
                                marginTop: '0.25rem'
                            }}>
                                <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                                    {isSingleDeal ? 'Total One-Time Due' : 'Total Due Today'}
                                </span>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>
                                        {cur.symbol}{totalDueToday.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div style={{
                                marginTop: '0.75rem',
                                paddingTop: '0.75rem',
                                borderTop: '1px dashed #e2e8f0',
                                fontSize: '0.75rem',
                                color: '#94a3b8',
                                textAlign: 'center'
                            }}>
                                🔒 Final sale • Enterprise plans are non-refundable once billed
                            </div>
                        </div>
                    </div>

                    {/* Features included */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        padding: '1.25rem 1.5rem',
                        marginTop: '1rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                    }}>
                        <h4 style={{
                            margin: '0 0 0.85rem',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: '#0f172a',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Included in your plan
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {plan.features.map((f, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <CheckCircle2 size={15} color={plan.color} strokeWidth={2.5} />
                                    <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 500 }}>
                                        {f}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .checkout-spin {
                        animation: spin 1s linear infinite;
                    }
                    @media (max-width: 900px) {
                        main {
                            grid-template-columns: 1fr !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default Checkout;
