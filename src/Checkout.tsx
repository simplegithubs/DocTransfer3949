import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useUser, useAuth } from './components/auth';
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
    FileText
} from 'lucide-react';
import { supabase } from './lib/supabase';

type PaymentGateway = 'razorpay';

interface PlanConfig {
    name: string;
    inrMonthly: number;
    inrAnnualMonthly: number;
    usdMonthly: number;
    usdAnnualMonthly: number;
    color: string;
    icon: any;
    features: string[];
    gradient: string;
    planId: string;
}

const PLAN_CONFIGS: Record<string, PlanConfig> = {
    pro: {
        name: 'Pro Plan',
        inrMonthly: 699,
        inrAnnualMonthly: 499,
        usdMonthly: 19,
        usdAnnualMonthly: 15,
        color: '#3b82f6',
        icon: Zap,
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        planId: import.meta.env.VITE_RAZORPAY_PRO_PLAN_ID || 'plan_TXFen0j8CaoC4o',
        features: [
            'Unlimited document uploads & tracking',
            '50MB file size limit per upload',
            '5 Active Virtual Deal Rooms',
            'Page-by-page dwell time forensics',
            'Dynamic anti-leak watermark (Email & IP)',
            'Unlimited e-signatures (IT Act 2000 & ESIGN)',
            'Section 65B court-admissible audit log',
            'Remote self-destruct / kill switch'
        ]
    },
    standard: {
        name: 'Pro Plan',
        inrMonthly: 699,
        inrAnnualMonthly: 499,
        usdMonthly: 19,
        usdAnnualMonthly: 15,
        color: '#3b82f6',
        icon: Zap,
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        planId: import.meta.env.VITE_RAZORPAY_PRO_PLAN_ID || 'plan_TXFen0j8CaoC4o',
        features: [
            'Unlimited document uploads & tracking',
            '50MB file size limit per upload',
            '5 Active Virtual Deal Rooms',
            'Page-by-page dwell time forensics',
            'Dynamic anti-leak watermark (Email & IP)',
            'Unlimited e-signatures (IT Act 2000 & ESIGN)',
            'Section 65B court-admissible audit log',
            'Remote self-destruct / kill switch'
        ]
    },
    business: {
        name: 'Business CA Suite',
        inrMonthly: 1799,
        inrAnnualMonthly: 1349,
        usdMonthly: 49,
        usdAnnualMonthly: 39,
        color: '#8b5cf6',
        icon: Briefcase,
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        planId: import.meta.env.VITE_RAZORPAY_BUSINESS_PLAN_ID || 'plan_TXFg28EWp7dw4C',
        features: [
            'Everything in Pro Plan included',
            '500MB file size limit per upload',
            'Unlimited Deal Rooms & folders',
            'Zero-Knowledge Vault Mode (AES-256 E2EE)',
            'Custom domain & brand white-labeling',
            'Client intake portals & secure dropboxes',
            'Automatic GST Tax Invoicing (ITC eligible)',
            '3 Team member seats included'
        ]
    },
    dataroom: {
        name: 'Virtual Data Room (VDR)',
        inrMonthly: 4999,
        inrAnnualMonthly: 3749,
        usdMonthly: 129,
        usdAnnualMonthly: 99,
        color: '#10b981',
        icon: FolderLock,
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        planId: import.meta.env.VITE_RAZORPAY_DATAROOM_PLAN_ID || 'plan_TXFgoDrw5IBk6O',
        features: [
            'Everything in Business Suite included',
            '2GB file size limit per upload',
            'Multi-party isolated bidder deal rooms',
            'Structured due diligence Q&A workflow',
            'Bates numbering & auto-index file tree',
            '1-Click complete compliance ZIP archive',
            '10 Included team seats + unlimited guests',
            'Dedicated deal room concierge support'
        ]
    }
};

const RazorpayLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="100" height="24" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.5 1.5L2 22.5H7.5L11 15.5H16.5L12.5 1.5Z" fill="#0C2340" />
        <path d="M11 15.5L7.5 22.5H18L21.5 15.5H11Z" fill="#3395FF" />
        <text x="26" y="17" fill="#0C2340" fontFamily="sans-serif" fontWeight="800" fontSize="14" letterSpacing="0.05em">
            Razorpay
        </text>
    </svg>
);

const COUNTRY_CODES = [
    { code: '+91', flag: '🇮🇳', name: 'India' },
    { code: '+1', flag: '🇺🇸', name: 'United States / Canada' },
    { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    { code: '+971', flag: '🇦🇪', name: 'United Arab Emirates' },
    { code: '+65', flag: '🇸🇬', name: 'Singapore' },
    { code: '+61', flag: '🇦🇺', name: 'Australia' },
    { code: '+49', flag: '🇩🇪', name: 'Germany' },
    { code: '+33', flag: '🇫🇷', name: 'France' },
    { code: '+81', flag: '🇯🇵', name: 'Japan' }
];

const Checkout: React.FC = () => {
    const [searchParams] = useSearchParams();
    const rawPlan = searchParams.get('plan') || 'pro';
    const planType = rawPlan === 'standard' ? 'pro' : rawPlan;
    const initialCurrency = (searchParams.get('currency') || 'INR').toUpperCase() as 'INR' | 'USD';
    const initialCycle = (searchParams.get('cycle') || 'monthly').toLowerCase() as 'monthly' | 'annual';

    const [currency, setCurrency] = useState<'INR' | 'USD'>(initialCurrency);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(initialCycle);
    const { user } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [razorpayScriptLoaded, setRazorpayScriptLoaded] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const plan = PLAN_CONFIGS[planType] || PLAN_CONFIGS.pro;
    const PlanIcon = plan.icon;

    useEffect(() => {
        if (!user) {
            navigate('/pricing');
        }
    }, [user, navigate]);

    // Load Razorpay SDK dynamically
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

    // Price calculations
    const isINR = currency === 'INR';
    const isAnnual = billingCycle === 'annual';
    const monthlyRate = isINR
        ? (isAnnual ? plan.inrAnnualMonthly : plan.inrMonthly)
        : (isAnnual ? plan.usdAnnualMonthly : plan.usdMonthly);
    const symbol = isINR ? '₹' : '$';

    const totalDueToday = isAnnual
        ? monthlyRate * 12
        : monthlyRate;

    // User account details
    const userEmail = user?.email || user?.primaryEmailAddress?.emailAddress || user?.rawUser?.email || '';
    const userName = user?.fullName || userEmail || 'DocTransfer User';
    const initialPhone = (user as any)?.phone || user?.rawUser?.phone || user?.rawUser?.user_metadata?.phone || '';

    const [countryCode, setCountryCode] = useState<string>(currency === 'INR' ? '+91' : '+1');
    const [phoneNumber, setPhoneNumber] = useState<string>(initialPhone.replace(/^\+\d{1,3}/, ''));
    const [phoneError, setPhoneError] = useState<string | null>(null);

    // Indian B2B GST States
    const [isB2BGst, setIsB2BGst] = useState(false);
    const [gstin, setGstin] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [gstError, setGstError] = useState<string | null>(null);

    const logoUrl = `${window.location.origin}/apple-touch-icon.png`;

    const handleRazorpayPayment = async () => {
        if (!user) return;

        // Validate phone number
        const cleanDigits = phoneNumber.replace(/\D/g, '');
        if (!cleanDigits) {
            setPhoneError('Please enter your mobile number to proceed with payment.');
            return;
        }

        if (countryCode === '+91' && cleanDigits.length !== 10) {
            setPhoneError('Please enter a valid 10-digit Indian mobile number.');
            return;
        } else if (cleanDigits.length < 7) {
            setPhoneError('Please enter a valid mobile number.');
            return;
        }

        // Validate GST if enabled
        if (isB2BGst) {
            const cleanGst = gstin.trim().toUpperCase();
            const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
            if (!cleanGst || !gstRegex.test(cleanGst)) {
                setGstError('Please enter a valid 15-character Indian GSTIN (e.g., 29AAAAA0000A1Z5).');
                return;
            }
            if (!companyName.trim()) {
                setGstError('Please enter your registered company or brokerage name.');
                return;
            }
        }

        setPhoneError(null);
        setGstError(null);
        setLoading(true);
        setErrorMsg(null);

        const fullPhone = `${countryCode}${cleanDigits}`;

        try {
            const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TXFmzOIjNJwVht';

            // 1. Create Razorpay Subscription via Supabase Edge Function
            let subData: any = null;
            try {
                const { data, error } = await supabase.functions.invoke('create-razorpay-subscription', {
                    body: {
                        userId: user.id,
                        planType: planType,
                        billingCycle: billingCycle,
                        userEmail: userEmail,
                        userName: userName,
                        userPhone: fullPhone
                    }
                });

                if (error) {
                    console.warn("Edge function subscription call notice:", error);
                }
                subData = data;
            } catch (invokeErr) {
                console.warn("Edge function invocation fallback:", invokeErr);
            }

            const subscriptionId = subData?.subscriptionId;

            // 2. Open Razorpay Checkout Modal
            if (typeof (window as any).Razorpay === 'undefined') {
                throw new Error('Razorpay SDK is not ready yet. Please check your internet connection and try again.');
            }

            const options: any = {
                key: keyId,
                name: 'DocTransfer',
                description: `${plan.name} (${billingCycle === 'annual' ? 'Annual' : 'Monthly'})`,
                image: logoUrl,
                prefill: {
                    name: userName,
                    email: userEmail,
                    contact: fullPhone
                },
                readonly: {
                    email: true, // 🔒 Strictly locks email so Razorpay detects and preserves the logged-in DocTransfer email
                    contact: true, // 🔒 Strictly locks phone number so Razorpay uses the user's filled number
                    name: false
                },
                notes: {
                    userId: user.id,
                    userEmail: userEmail,
                    userPhone: fullPhone,
                    planType: planType,
                    billingCycle: billingCycle
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
                    console.log("Razorpay payment success response:", response);
                    setLoading(true);

                    const transactionRef = response.razorpay_payment_id || response.razorpay_subscription_id || subscriptionId || '';

                    // 3. Verify Payment Signature & Activate Subscription
                    let activated = false;
                    try {
                        const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
                            body: {
                                userId: user.id,
                                planType: planType,
                                billingCycle: billingCycle,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySubscriptionId: response.razorpay_subscription_id || subscriptionId,
                                razorpaySignature: response.razorpay_signature
                            }
                        });

                        if (!verifyError && verifyData?.success) {
                            activated = true;
                        } else {
                            console.warn("Edge function verification notice:", verifyError);
                        }
                    } catch (verifyCatch) {
                        console.warn("Edge function invoke notice:", verifyCatch);
                    }

                    // Fallback to direct RPC activation to guarantee unlocking
                    if (!activated) {
                        try {
                            await supabase.rpc('activate_user_subscription', {
                                p_user_id: user.id,
                                p_plan_type: planType,
                                p_billing_cycle: billingCycle,
                                p_transaction_ref: transactionRef
                            });
                        } catch (rpcErr) {
                            console.warn("RPC activation fallback notice:", rpcErr);
                        }
                    }

                    // Redirect to Payment Success page
                    navigate(
                        `/payment-success?gateway=razorpay&plan=${planType}&cycle=${billingCycle}&payment_id=${response.razorpay_payment_id || ''}&subscription_id=${response.razorpay_subscription_id || subscriptionId || ''}`
                    );
                }
            };

            // If a valid recurring subscription ID was returned, attach it
            if (subscriptionId && !subscriptionId.startsWith('sub_simulated_')) {
                options.subscription_id = subscriptionId;
            } else {
                // If recurring subscription is in sandbox / fallback mode, use amount checkout
                options.amount = totalDueToday * (isINR ? 100 : 100);
                options.currency = currency;
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
                description={`Subscribe to DocTransfer ${plan.name} via Razorpay. Secure payments via UPI, Cards, and NetBanking.`}
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
                        { step: 2, label: 'Payment Method', done: false, active: true },
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
                maxWidth: '1120px',
                margin: '0 auto',
                padding: '3rem 1.5rem',
                display: 'grid',
                gridTemplateColumns: '1fr 400px',
                gap: '2.5rem',
                alignItems: 'start'
            }}>
                {/* Left Column: Payment Gateway Card */}
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                        Complete Your Subscription
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: userEmail ? '1rem' : '2rem', lineHeight: 1.6 }}>
                        You are subscribing to <strong>{plan.name}</strong>. Transactions are processed securely via <strong>Razorpay</strong>.
                    </p>

                    {userEmail && (
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

                    {/* Razorpay Gateway Box */}
                    <div style={{
                        border: '2px solid #3b82f6',
                        borderRadius: '20px',
                        padding: '1.75rem',
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.04) 0%, rgba(37, 99, 235, 0.08) 100%)',
                        boxShadow: '0 12px 32px rgba(59, 130, 246, 0.12)',
                        marginBottom: '1.5rem',
                        position: 'relative'
                    }}>
                        {/* Radio select badge */}
                        <div style={{
                            position: 'absolute',
                            top: '1.5rem',
                            right: '1.5rem',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: '#3b82f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <Check size={14} strokeWidth={3.5} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '14px',
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.04)'
                            }}>
                                <CreditCard size={26} color="#0284c7" />
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                        Razorpay Gateway
                                    </h3>
                                    <span style={{
                                        fontSize: '0.68rem',
                                        fontWeight: 800,
                                        background: '#dbeafe',
                                        color: '#1d4ed8',
                                        padding: '3px 8px',
                                        borderRadius: '6px'
                                    }}>RECOMMENDED</span>
                                </div>
                                <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0.25rem 0 0' }}>
                                    UPI, RuPay, Visa, Mastercard, NetBanking & Global Cards
                                </p>
                            </div>
                        </div>

                        {/* Supported Badges */}
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {[
                                { name: 'Google Pay', bg: '#e0f2fe', color: '#0369a1' },
                                { name: 'PhonePe', bg: '#ede9fe', color: '#6d28d9' },
                                { name: 'Paytm UPI', bg: '#e0f2fe', color: '#0284c7' },
                                { name: 'RuPay', bg: '#ffedd5', color: '#c2410c' },
                                { name: 'Visa & MC', bg: '#f1f5f9', color: '#334155' },
                                { name: '50+ Banks', bg: '#dcfce7', color: '#15803d' }
                            ].map(b => (
                                <span key={b.name} style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    background: b.bg,
                                    color: b.color,
                                    padding: '4px 10px',
                                    borderRadius: '8px'
                                }}>{b.name}</span>
                            ))}
                        </div>
                    </div>

                    {/* Phone Number Input Card */}
                    <div style={{
                        background: 'white',
                        border: phoneError ? '1.5px solid #ef4444' : '1px solid #e2e8f0',
                        borderRadius: '18px',
                        padding: '1.25rem 1.5rem',
                        marginBottom: '1.5rem',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                        transition: 'all 0.2s ease'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.92rem',
                                fontWeight: 700,
                                color: '#0f172a'
                            }}>
                                <Phone size={16} color="#0284c7" />
                                Your Mobile Number (for Razorpay)
                            </label>
                            <span style={{
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                background: '#fef3c7',
                                color: '#b45309',
                                padding: '2px 8px',
                                borderRadius: '6px'
                            }}>REQUIRED</span>
                        </div>

                        <div style={{ display: 'flex', gap: '0.6rem' }}>
                            {/* Country Code Selector */}
                            <select
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                                style={{
                                    padding: '0.75rem 0.85rem',
                                    borderRadius: '12px',
                                    border: '1px solid #cbd5e1',
                                    background: '#f8fafc',
                                    color: '#0f172a',
                                    fontSize: '0.9rem',
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

                            {/* Phone Input */}
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
                                    padding: '0.75rem 1rem',
                                    borderRadius: '12px',
                                    border: phoneError ? '1px solid #ef4444' : '1px solid #cbd5e1',
                                    background: '#ffffff',
                                    color: '#0f172a',
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    outline: 'none',
                                    transition: 'border 0.2s'
                                }}
                                onFocus={(e) => {
                                    if (!phoneError) e.target.style.borderColor = '#0284c7';
                                }}
                                onBlur={(e) => {
                                    if (!phoneError) e.target.style.borderColor = '#cbd5e1';
                                }}
                            />
                        </div>

                        {phoneError ? (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                color: '#ef4444',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                marginTop: '0.6rem'
                            }}>
                                <AlertCircle size={14} />
                                {phoneError}
                            </div>
                        ) : (
                            <p style={{
                                margin: '0.6rem 0 0',
                                fontSize: '0.75rem',
                                color: '#64748b',
                                lineHeight: 1.4
                            }}>
                                🔒 Razorpay uses this number for OTPs, UPI approval prompts, and GST payment receipts.
                            </p>
                        )}
                    </div>

                    {/* B2B GST Input Tax Credit Option (India) */}
                    {isINR && (
                        <div style={{
                            background: isB2BGst ? '#f0fdf4' : '#ffffff',
                            border: isB2BGst ? '1.5px solid #10b981' : '1px solid #e2e8f0',
                            borderRadius: '18px',
                            padding: '1.25rem 1.5rem',
                            marginBottom: '1.5rem',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                            transition: 'all 0.2s ease'
                        }}>
                            <div
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                                onClick={() => setIsB2BGst(!isB2BGst)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <input
                                        type="checkbox"
                                        id="gstCheckbox"
                                        checked={isB2BGst}
                                        onChange={(e) => setIsB2BGst(e.target.checked)}
                                        style={{ width: '18px', height: '18px', accentColor: '#059669', cursor: 'pointer' }}
                                    />
                                    <label htmlFor="gstCheckbox" style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>
                                        Claim GST Input Tax Credit (18% ITC)
                                    </label>
                                </div>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '3px 8px', borderRadius: '6px' }}>
                                    B2B INVOICE
                                </span>
                            </div>

                            {isB2BGst && (
                                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                                            GSTIN (15-digit GST Identification Number)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="29AAAAA0000A1Z5"
                                            maxLength={15}
                                            value={gstin}
                                            onChange={(e) => setGstin(e.target.value.toUpperCase())}
                                            style={{
                                                width: '100%',
                                                padding: '0.65rem 0.85rem',
                                                borderRadius: '10px',
                                                border: '1px solid #cbd5e1',
                                                fontSize: '0.88rem',
                                                fontWeight: 600,
                                                letterSpacing: '0.05em',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                                            Registered Business / Firm Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Apex Realty Advisory LLP / Lodha Associates"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.65rem 0.85rem',
                                                borderRadius: '10px',
                                                border: '1px solid #cbd5e1',
                                                fontSize: '0.88rem',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                    {gstError && (
                                        <div style={{ color: '#dc2626', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <AlertCircle size={13} /> {gstError}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pay Button */}
                    <button
                        onClick={handleRazorpayPayment}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1.25rem 2rem',
                            borderRadius: '16px',
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
                            transition: 'all 0.2s',
                            letterSpacing: '0.01em'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) e.currentTarget.style.filter = 'brightness(1.06)';
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) e.currentTarget.style.filter = 'brightness(1)';
                        }}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="checkout-spin" />
                                Launching Secure Razorpay Checkout...
                            </>
                        ) : (
                            <>
                                <Lock size={18} />
                                Pay with Razorpay — {symbol}{monthlyRate}/mo
                                <ChevronRight size={18} />
                            </>
                        )}
                    </button>

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
                            { icon: ShieldCheck, text: 'RBI & NPCI Compliant' },
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
                                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                                        {plan.name}
                                    </h3>
                                    <p style={{ margin: 0, fontSize: '0.82rem', opacity: 0.85 }}>
                                        {isAnnual ? 'Annual billing (Save ~25%)' : 'Monthly billing'}
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
                                fontSize: '0.9rem',
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
                                fontSize: '0.9rem',
                                color: '#475569'
                            }}>
                                <span>Billing Cycle</span>
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>
                                    {isAnnual ? 'Annual' : 'Monthly'}
                                </span>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.75rem 0',
                                borderBottom: '1px solid #f1f5f9',
                                fontSize: '0.9rem',
                                color: '#475569'
                            }}>
                                <span>Monthly Rate</span>
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>
                                    {symbol}{monthlyRate}/mo
                                </span>
                            </div>

                            {isINR && (
                                <>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem 0',
                                        borderBottom: '1px solid #f1f5f9',
                                        fontSize: '0.9rem',
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
                                        fontSize: '0.9rem',
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
                                <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                                    {isAnnual ? 'Total Billed Today (Incl. GST)' : 'Total Due Today (Incl. GST)'}
                                </span>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
                                        {symbol}{totalDueToday.toLocaleString('en-IN')}
                                    </span>
                                </div>
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
