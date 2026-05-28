import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
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
    Globe,
    Lock,
    ChevronRight,
    RefreshCw,
    Clock,
    CheckCircle2,
    Sparkles,
    Mail,
    Phone
} from 'lucide-react';
import { supabase, createSupabaseClient, getSafeSupabaseToken } from './lib/supabase';

type PaymentGateway = 'razorpay' | 'paypal';

const PAYPAL_PLAN_URLS: Record<string, string> = {
    standard: `https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=${import.meta.env.VITE_PAYPAL_STANDARD_PLAN_ID || 'P-0FL71448PL026300WNIIUAVQ'}`,
    business: `https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=${import.meta.env.VITE_PAYPAL_BUSINESS_PLAN_ID || 'P-53396685LJ841883FNIIUBMY'}`,
};

const PLAN_DETAILS: Record<string, {
    name: string;
    price: string;
    priceNum: number;
    period: string;
    color: string;
    icon: any;
    features: string[];
    gradient: string;
}> = {
    standard: {
        name: 'Standard',
        price: '$25',
        priceNum: 25,
        period: '/month',
        color: '#3b82f6',
        icon: Zap,
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        features: [
            'Unlimited file transfers',
            '50MB file size limit',
            'AES-256 Encryption',
            'Self-Destruct (Time/Views)',
            'Email Verification',
            'Dynamic Watermarking',
            'Allow Downloads',
            'Password Protection'
        ]
    },
    business: {
        name: 'Business',
        price: '$39',
        priceNum: 39,
        period: '/month',
        color: '#8b5cf6',
        icon: Briefcase,
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        features: [
            'Everything in Standard',
            '500MB file size limit',
            'Vault Mode (E2E Encryption)',
            'Audit Trails & Compliance',
            'SSO Integration',
            'Custom Branding',
            'View & Print Limits',
            'Dedicated Support'
        ]
    }
};

const RazorpayMonogram: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M22.436 0l-11.91 7.773-1.174 4.276 6.625-4.297L11.65 24h4.391l6.395-24z"
            fill="#3397F2"
        />
        <path
            d="M14.26 10.098L3.389 17.166 1.564 24h9.008l3.688-13.902Z"
            fill="#0A2540"
        />
    </svg>
);

const PayPalMonogram: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        width="26"
        height="32"
        viewBox="0 0 26 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            fill="#003087"
            d="M7.266,29.154l0.523-3.322l-1.165-0.027H1.061L4.927,1.292C4.939,1.218,4.978,1.149,5.035,1.1 c0.057-0.049,0.13-0.076,0.206-0.076h9.38c3.114,0,5.263,0.648,6.385,1.927c0.526,0.6,0.861,1.227,1.023,1.917 c0.17,0.724,0.173,1.589,0.007,2.644l-0.012,0.077v0.676l0.526,0.298c0.443,0.235,0.795,0.504,1.065,0.812 c0.45,0.513,0.741,1.165,0.864,1.938c0.127,0.795,0.085,1.741-0.123,2.812c-0.24,1.232-0.628,2.305-1.152,3.183 c-0.482,0.809-1.096,1.48-1.825,2c-0.696,0.494-1.523,0.869-2.458,1.109c-0.906,0.236-1.939,0.355-3.072,0.355h-0.73 c-0.522,0-1.029,0.188-1.427,0.525c-0.399,0.344-0.663,0.814-0.744,1.328l-0.055,0.299l-0.924,5.855l-0.042,0.215 c-0.011,0.061-0.03,0.102-0.058,0.125c-0.025,0.021-0.061,0.035-0.096,0.035H7.266z"
        />
        <path
            fill="#0079C1"
            d="M23.048,7.667c-0.028,0.179-0.06,0.362-0.096,0.55 c-1.237,6.351-5.469,8.545-10.874,8.545H9.326c-0.661,0-1.218,0.48-1.321,1.132L6.596,26.83l-0.399,2.533 c-0.067,0.428,0.263,0.814,0.695,0.814h4.881c0.578,0,1.069-0.42,1.16-0.99l0.048-0.248l0.919-5.832l0.059-0.32 c0.09-0.572,0.582-0.992,1.16-0.992h0.73c4.729,0,8.431-1.92,9.513-7.476c0.452-2.321,0.218-4.259-0.978-5.622 C24.022,8.286,23.573,7.945,23.048,7.667z"
        />
        <path
            fill="#00457C"
            d="M21.754,7.151c-0.189-0.055-0.384-0.105-0.584-0.15c-0.201-0.044-0.407-0.083-0.619-0.117 c-0.742-0.12-1.555-0.177-2.426-0.177h-7.352c-0.181,0-0.353,0.041-0.507,0.115C9.927,6.985,9.675,7.306,9.614,7.699L8.05,17.605 l-0.045,0.289c0.103-0.652,0.66-1.132,1.321-1.132h2.752c5.405,0,9.637-2.195,10.874-8.545c0.037-0.188,0.068-0.371,0.096-0.55 c-0.313-0.166-0.652-0.308-1.017-0.429C21.941,7.208,21.848,7.179,21.754,7.151z"
        />
        <path
            fill="#003087"
            d="M9.614,7.699c0.061-0.393,0.313-0.714,0.652-0.876c0.155-0.074,0.326-0.115,0.507-0.115h7.352 c0.871,0,1.684,0.057,2.426,0.177c0.212,0.034,0.418,0.073,0.619,0.117c0.2,0.045,0.395,0.095,0.584,0.15 c0.094,0.028,0.187,0.057,0.278,0.086c0.365,0.121,0.704,0.264,1.017,0.429c0.368-2.347-0.003-3.945-1.272-5.392 C20.378,0.682,17.853,0,14.622,0h-9.38c-0.66,0-1.223,0.48-1.325,1.133L0.01,25.898c-0.077,0.49,0.301,0.932,0.795,0.932h5.791 l1.454-9.225L9.614,7.699z"
        />
    </svg>
);

const Checkout: React.FC = () => {
    const [searchParams] = useSearchParams();
    const planType = searchParams.get('plan') || 'standard';
    const { user } = useUser();
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);
    const [loading, setLoading] = useState(false);
    const [hoveredGateway, setHoveredGateway] = useState<string | null>(null);

    // Contact details for Razorpay — user fills these in themselves
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactErrors, setContactErrors] = useState<{ email?: string; phone?: string }>({});

    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPhone = (phone: string) => /^\+?[\d\s\-()]{7,15}$/.test(phone.trim());
    const isContactFormValid = selectedGateway === 'razorpay'
        ? isValidEmail(contactEmail) && isValidPhone(contactPhone)
        : true;

    const plan = PLAN_DETAILS[planType] || PLAN_DETAILS.standard;
    const PlanIcon = plan.icon;

    useEffect(() => {
        if (!user) {
            navigate('/pricing');
        }
    }, [user, navigate]);

    const [paypalScriptLoaded, setPaypalScriptLoaded] = useState(false);
    const [paypalScriptLoading, setPaypalScriptLoading] = useState(false);

    // Load PayPal SDK dynamically when PayPal is selected (and not standard/business plans using a direct link)
    useEffect(() => {
        if (selectedGateway === 'paypal' && (planType !== 'standard' && planType !== 'business') && !paypalScriptLoaded && !paypalScriptLoading) {
            setPaypalScriptLoading(true);
            const scriptId = 'paypal-sdk-script';
            const existingScript = document.getElementById(scriptId);

            const initializePaypalButtons = () => {
                setPaypalScriptLoaded(true);
                setPaypalScriptLoading(false);
            };

            if (existingScript) {
                if ((window as any).paypal) {
                    initializePaypalButtons();
                } else {
                    existingScript.addEventListener('load', initializePaypalButtons);
                    existingScript.addEventListener('error', () => {
                        setPaypalScriptLoading(false);
                    });
                }
            } else {
                const script = document.createElement('script');
                script.id = scriptId;
                script.src = 'https://www.paypal.com/sdk/js?client-id=BAA2asJ61lTSlNxLdm0Qg-vFm74gvBDUGKPEILzWHRKwZqOkI9z9H1rE0-WZ1JkPI_BWFiE5pcrKiehozo&vault=true&intent=subscription';
                script.setAttribute('data-sdk-integration-source', 'button-factory');
                script.onload = initializePaypalButtons;
                script.onerror = () => {
                    setPaypalScriptLoading(false);
                    alert('Failed to load PayPal SDK. Please try again.');
                };
                document.body.appendChild(script);
            }
        }
    }, [selectedGateway, planType, paypalScriptLoaded, paypalScriptLoading]);

    // Render PayPal Buttons when loaded (and not standard/business plans using a direct link)
    useEffect(() => {
        if (selectedGateway === 'paypal' && (planType !== 'standard' && planType !== 'business') && paypalScriptLoaded && (window as any).paypal) {
            const container = document.getElementById('paypal-button-container');
            if (container) {
                container.innerHTML = '';
                try {
                    (window as any).paypal.Buttons({
                        style: {
                            shape: 'pill',
                            color: 'blue',
                            layout: 'vertical',
                            label: 'subscribe'
                        },
                        createSubscription: function(data: any, actions: any) {
                            return actions.subscription.create({
                                plan_id: planType === 'business'
                                    ? (import.meta.env.VITE_PAYPAL_BUSINESS_PLAN_ID || 'P-53396685LJ841883FNIIUBMY')
                                    : (import.meta.env.VITE_PAYPAL_STANDARD_PLAN_ID || 'P-0FL71448PL026300WNIIUAVQ')
                            });
                        },
                        onApprove: function(data: any, actions: any) {
                            localStorage.setItem('paypal_pending', JSON.stringify({
                                userId: user!.id,
                                planType: planType,
                                timestamp: Date.now()
                            }));
                            navigate(`/payment-success?gateway=paypal&plan=${planType}&session_id=${data.subscriptionID}`);
                        },
                        onError: function(err: any) {
                            console.error('PayPal Buttons error:', err);
                        }
                    }).render('#paypal-button-container');
                } catch (e) {
                    console.error('Error rendering PayPal buttons:', e);
                }
            }
        }
    }, [selectedGateway, paypalScriptLoaded, planType, user, navigate]);


    const loadRazorpay = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if ((window as any).Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!selectedGateway || !user) return;

        if (selectedGateway === 'paypal') {
            if (planType === 'standard' || planType === 'business') {
                const url = planType === 'business'
                    ? (import.meta.env.VITE_PAYPAL_BUSINESS_PAYMENT_LINK || 'https://www.paypal.com/ncp/payment/9HPJ832RLMYCL')
                    : (import.meta.env.VITE_PAYPAL_STANDARD_PAYMENT_LINK || 'https://www.paypal.com/ncp/payment/NDETAF5C5TT9J');
                setLoading(true);

                localStorage.setItem('paypal_pending', JSON.stringify({
                    userId: user.id,
                    planType: planType,
                    timestamp: Date.now()
                }));

                // Redirect in the same tab to ensure checkout completion before redirection back
                window.location.href = url;
            }
        } else if (selectedGateway === 'razorpay') {
            await handleRazorpayPayment();
        }
    };

    const handleRazorpayPayment = async () => {
        if (!user) return;

        // Validate contact details before proceeding
        const errors: { email?: string; phone?: string } = {};
        if (!contactEmail.trim() || !isValidEmail(contactEmail)) {
            errors.email = 'Please enter a valid email address';
        }
        if (!contactPhone.trim() || !isValidPhone(contactPhone)) {
            errors.phone = 'Please enter a valid phone number';
        }
        if (Object.keys(errors).length > 0) {
            setContactErrors(errors);
            return;
        }
        setContactErrors({});

        try {
            setLoading(true);

            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                alert('Failed to load Razorpay SDK. Please check your internet connection.');
                setLoading(false);
                return;
            }

            const token = await getSafeSupabaseToken(getToken);
            const authenticatedSupabase = createSupabaseClient(token || undefined);

            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || ''
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-razorpay-subscription`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ planType, userId: user.id })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to initiate payment');
            }

            if (!data || !data.id) {
                throw new Error('Payment creation returned empty response');
            }

            const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_Sqmswzj0yq1x8N';

            const options: any = {
                key: keyId,
                name: 'DocTransfer',
                description: `${plan.name} Monthly Subscription`,
                prefill: {
                    name: user.fullName || '',
                    email: contactEmail.trim(),
                    contact: contactPhone.trim()
                },
                theme: { color: plan.color },
                modal: {
                    ondismiss: () => setLoading(false)
                },
                subscription_id: data.id,
                handler: async (response: any) => {
                    try {
                        setLoading(true);

                        const { error: verifyError } = await supabase.functions.invoke('verify-razorpay-subscription', {
                            body: {
                                razorpay_subscription_id: response.razorpay_subscription_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                userId: user.id,
                                planType: planType
                            }
                        });

                        if (verifyError) {
                            throw new Error(verifyError.message || 'Verification failed');
                        }

                        navigate(`/payment-success?session_id=${response.razorpay_subscription_id}&gateway=razorpay`);
                    } catch (err: any) {
                        alert(`Payment verification failed: ${err.message}`);
                    } finally {
                        setLoading(false);
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

        } catch (err: any) {
            console.error('Checkout error:', err);
            alert(`Checkout failed: ${err.message}`);
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
                title={`Checkout — ${plan.name} Plan | DocTransfer`}
                description={`Subscribe to DocTransfer ${plan.name} plan for ${plan.price}/month. Secure payment via Razorpay or PayPal.`}
                keywords="DocTransfer checkout, secure payment, subscription"
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
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#0f172a'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                    >
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
                    fontSize: '0.8rem',
                    fontWeight: 500
                }}>
                    <Lock size={14} />
                    Secure Checkout
                </div>
            </header>

            {/* Progress Steps */}
            <div style={{
                background: 'white',
                borderBottom: '1px solid #e2e8f0',
                padding: '1.25rem 2rem'
            }}>
                <div style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0'
                }}>
                    {[
                        { step: 1, label: 'Choose Plan', done: true },
                        { step: 2, label: 'Payment Method', done: false, active: true },
                        { step: 3, label: 'Confirmation', done: false }
                    ].map((s, i) => (
                        <React.Fragment key={s.step}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem'
                            }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    background: s.done
                                        ? '#10b981'
                                        : s.active
                                            ? plan.color
                                            : '#e2e8f0',
                                    color: s.done || s.active ? 'white' : '#94a3b8',
                                    transition: 'all 0.3s'
                                }}>
                                    {s.done ? <Check size={16} strokeWidth={3} /> : s.step}
                                </div>
                                <span style={{
                                    fontSize: '0.85rem',
                                    fontWeight: s.active ? 700 : 500,
                                    color: s.done
                                        ? '#10b981'
                                        : s.active
                                            ? '#0f172a'
                                            : '#94a3b8'
                                }}>{s.label}</span>
                            </div>
                            {i < 2 && (
                                <div style={{
                                    width: '80px',
                                    height: '2px',
                                    background: s.done ? '#10b981' : '#e2e8f0',
                                    margin: '0 1rem',
                                    borderRadius: '1px',
                                    transition: 'background 0.3s'
                                }} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <main style={{
                maxWidth: '1100px',
                margin: '0 auto',
                padding: '3rem 2rem',
                display: 'grid',
                gridTemplateColumns: '1fr 400px',
                gap: '3rem',
                alignItems: 'start'
            }}>
                {/* Left — Payment Method Selection */}
                <div>
                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        marginBottom: '0.5rem'
                    }}>
                        Select Payment Method
                    </h1>
                    <p style={{
                        color: '#64748b',
                        fontSize: '0.95rem',
                        marginBottom: '2.5rem',
                        lineHeight: 1.6
                    }}>
                        Choose how you'd like to pay for your <strong>{plan.name}</strong> subscription.
                        All transactions are encrypted and secure.
                    </p>

                    {/* Payment Gateway Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                        {/* Razorpay Option */}
                        <div
                            onClick={() => setSelectedGateway('razorpay')}
                            onMouseEnter={() => setHoveredGateway('razorpay')}
                            onMouseLeave={() => setHoveredGateway(null)}
                            style={{
                                border: selectedGateway === 'razorpay'
                                    ? '2px solid #3397F2'
                                    : hoveredGateway === 'razorpay'
                                        ? '2px solid #93c5fd'
                                        : '2px solid #e2e8f0',
                                borderRadius: '20px',
                                padding: '1.75rem',
                                cursor: 'pointer',
                                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                                background: selectedGateway === 'razorpay'
                                    ? 'linear-gradient(135deg, rgba(51, 151, 242, 0.04) 0%, rgba(51, 151, 242, 0.08) 100%)'
                                    : 'white',
                                boxShadow: selectedGateway === 'razorpay'
                                    ? '0 12px 30px rgba(51, 151, 242, 0.15), 0 0 0 1px rgba(51, 151, 242, 0.05)'
                                    : hoveredGateway === 'razorpay'
                                        ? '0 8px 20px rgba(0,0,0,0.06)'
                                        : '0 2px 8px rgba(0,0,0,0.02)',
                                transform: selectedGateway === 'razorpay'
                                    ? 'translateY(-2px) scale(1.005)'
                                    : hoveredGateway === 'razorpay'
                                        ? 'translateY(-2px) scale(1.005)'
                                        : 'translateY(0) scale(1)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Selection indicator */}
                            <div style={{
                                position: 'absolute',
                                top: '1.75rem',
                                right: '1.75rem',
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                border: selectedGateway === 'razorpay' ? 'none' : '2px solid #cbd5e1',
                                background: selectedGateway === 'razorpay'
                                    ? 'linear-gradient(135deg, #3397F2 0%, #0052FF 100%)'
                                    : 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}>
                                {selectedGateway === 'razorpay' && <Check size={15} color="white" strokeWidth={3.5} />}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '14px',
                                    background: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                                    flexShrink: 0,
                                    padding: '10px'
                                }}>
                                    <RazorpayMonogram style={{ width: '32px', height: '32px' }} />
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <h3 style={{
                                            fontSize: '1.2rem',
                                            fontWeight: 800,
                                            color: '#0f172a',
                                            margin: 0,
                                            letterSpacing: '-0.01em'
                                        }}>Razorpay</h3>
                                        <span style={{
                                            fontSize: '0.65rem',
                                            fontWeight: 800,
                                            background: '#dbeafe',
                                            color: '#1d4ed8',
                                            padding: '3px 8px',
                                            borderRadius: '6px',
                                            letterSpacing: '0.05em'
                                        }}>🇮🇳 DOMESTIC (INDIA)</span>
                                    </div>
                                    <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0.25rem 0 0', lineHeight: 1.4 }}>
                                        Best for Indian accounts — UPI, Credit/Debit Cards, Netbanking & Wallets
                                    </p>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                gap: '0.5rem',
                                flexWrap: 'wrap',
                                paddingLeft: '72px'
                            }}>
                                {[
                                    { label: 'UPI (GPay/PhonePe)', color: '#16a34a', bg: '#dcfce7' },
                                    { label: 'Visa', color: '#1e40af', bg: '#dbeafe' },
                                    { label: 'Mastercard', color: '#dc2626', bg: '#fee2e2' },
                                    { label: 'RuPay', color: '#7c3aed', bg: '#ede9fe' },
                                    { label: 'Netbanking', color: '#475569', bg: '#f1f5f9' },
                                    { label: 'Wallets', color: '#0891b2', bg: '#cffafe' }
                                ].map(m => (
                                    <span key={m.label} style={{
                                        fontSize: '0.72rem',
                                        fontWeight: 700,
                                        color: m.color,
                                        background: m.bg,
                                        padding: '4px 10px',
                                        borderRadius: '8px',
                                        letterSpacing: '0.01em'
                                    }}>{m.label}</span>
                                ))}
                            </div>
                        </div>

                        {/* PayPal Option */}
                        <div
                            onClick={() => setSelectedGateway('paypal')}
                            onMouseEnter={() => setHoveredGateway('paypal')}
                            onMouseLeave={() => setHoveredGateway(null)}
                            style={{
                                border: selectedGateway === 'paypal'
                                    ? '2px solid #0070ba'
                                    : hoveredGateway === 'paypal'
                                        ? '2px solid #7dc5ed'
                                        : '2px solid #e2e8f0',
                                borderRadius: '20px',
                                padding: '1.75rem',
                                cursor: 'pointer',
                                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                                background: selectedGateway === 'paypal'
                                    ? 'linear-gradient(135deg, rgba(0, 112, 186, 0.04) 0%, rgba(0, 48, 135, 0.08) 100%)'
                                    : 'white',
                                boxShadow: selectedGateway === 'paypal'
                                    ? '0 12px 30px rgba(0, 112, 186, 0.15), 0 0 0 1px rgba(0, 112, 186, 0.05)'
                                    : hoveredGateway === 'paypal'
                                        ? '0 8px 20px rgba(0,0,0,0.06)'
                                        : '0 2px 8px rgba(0,0,0,0.02)',
                                transform: selectedGateway === 'paypal'
                                    ? 'translateY(-2px) scale(1.005)'
                                    : hoveredGateway === 'paypal'
                                        ? 'translateY(-2px) scale(1.005)'
                                        : 'translateY(0) scale(1)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Selection indicator */}
                            <div style={{
                                position: 'absolute',
                                top: '1.75rem',
                                right: '1.75rem',
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                border: selectedGateway === 'paypal' ? 'none' : '2px solid #cbd5e1',
                                background: selectedGateway === 'paypal'
                                    ? 'linear-gradient(135deg, #0079C1 0%, #003087 100%)'
                                    : 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}>
                                {selectedGateway === 'paypal' && <Check size={15} color="white" strokeWidth={3.5} />}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '14px',
                                    background: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                                    flexShrink: 0,
                                    padding: '10px'
                                }}>
                                    <PayPalMonogram style={{ width: '28px', height: '28px' }} />
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <h3 style={{
                                            fontSize: '1.2rem',
                                            fontWeight: 800,
                                            color: '#0f172a',
                                            margin: 0,
                                            letterSpacing: '-0.01em'
                                        }}>PayPal</h3>
                                        <span style={{
                                            fontSize: '0.65rem',
                                            fontWeight: 800,
                                            background: '#e0f0ff',
                                            color: '#003087',
                                            padding: '3px 8px',
                                            borderRadius: '6px',
                                            letterSpacing: '0.05em'
                                        }}>🌍 INTERNATIONAL</span>
                                    </div>
                                    <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0.25rem 0 0', lineHeight: 1.4 }}>
                                        Best for international clients — PayPal account, Credit/Debit Cards worldwide
                                    </p>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                gap: '0.5rem',
                                flexWrap: 'wrap',
                                paddingLeft: '72px'
                            }}>
                                {[
                                    { label: 'PayPal Checkout', color: '#003087', bg: '#e0f0ff' },
                                    { label: 'Visa', color: '#1e40af', bg: '#dbeafe' },
                                    { label: 'Mastercard', color: '#dc2626', bg: '#fee2e2' },
                                    { label: 'Amex', color: '#006fcf', bg: '#e0f0ff' },
                                    { label: 'Discover', color: '#f97316', bg: '#ffedd5' }
                                ].map(m => (
                                    <span key={m.label} style={{
                                        fontSize: '0.72rem',
                                        fontWeight: 700,
                                        color: m.color,
                                        background: m.bg,
                                        padding: '4px 10px',
                                        borderRadius: '8px',
                                        letterSpacing: '0.01em'
                                    }}>{m.label}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Razorpay Contact Details Form */}
                    {selectedGateway === 'razorpay' && (
                        <div style={{
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '16px',
                            padding: '1.5rem 1.75rem',
                            marginBottom: '1.5rem',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                            animation: 'fadeSlideIn 0.35s ease-out'
                        }}>
                            <h3 style={{
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                color: '#0f172a',
                                margin: '0 0 0.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <CreditCard size={18} color={plan.color} />
                                Contact Details for Payment
                            </h3>
                            <p style={{
                                color: '#64748b',
                                fontSize: '0.82rem',
                                margin: '0 0 1.25rem',
                                lineHeight: 1.5
                            }}>
                                Enter the email and phone number for payment receipts & notifications.
                            </p>

                            {/* Email Field */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    color: '#334155',
                                    marginBottom: '0.4rem'
                                }}>
                                    <Mail size={14} color="#64748b" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={contactEmail}
                                    onChange={(e) => {
                                        setContactEmail(e.target.value);
                                        if (contactErrors.email) setContactErrors(prev => ({ ...prev, email: undefined }));
                                    }}
                                    placeholder="you@example.com"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '10px',
                                        border: contactErrors.email ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
                                        fontSize: '0.9rem',
                                        fontWeight: 500,
                                        color: '#0f172a',
                                        outline: 'none',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                        background: '#fafbfc',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = plan.color;
                                        e.currentTarget.style.boxShadow = `0 0 0 3px ${plan.color}18`;
                                        e.currentTarget.style.background = '#fff';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = contactErrors.email ? '#ef4444' : '#e2e8f0';
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.background = '#fafbfc';
                                    }}
                                />
                                {contactErrors.email && (
                                    <p style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 500, margin: '0.3rem 0 0' }}>
                                        {contactErrors.email}
                                    </p>
                                )}
                            </div>

                            {/* Phone Field */}
                            <div>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    color: '#334155',
                                    marginBottom: '0.4rem'
                                }}>
                                    <Phone size={14} color="#64748b" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={contactPhone}
                                    onChange={(e) => {
                                        setContactPhone(e.target.value);
                                        if (contactErrors.phone) setContactErrors(prev => ({ ...prev, phone: undefined }));
                                    }}
                                    placeholder="+91 98765 43210"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '10px',
                                        border: contactErrors.phone ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
                                        fontSize: '0.9rem',
                                        fontWeight: 500,
                                        color: '#0f172a',
                                        outline: 'none',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                        background: '#fafbfc',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = plan.color;
                                        e.currentTarget.style.boxShadow = `0 0 0 3px ${plan.color}18`;
                                        e.currentTarget.style.background = '#fff';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = contactErrors.phone ? '#ef4444' : '#e2e8f0';
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.background = '#fafbfc';
                                    }}
                                />
                                {contactErrors.phone && (
                                    <p style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 500, margin: '0.3rem 0 0' }}>
                                        {contactErrors.phone}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Subscribe Button / PayPal Buttons Container */}
                    {selectedGateway === 'paypal' && (planType !== 'standard' && planType !== 'business') ? (
                        <div style={{ marginTop: '1.5rem', width: '100%' }}>
                            {paypalScriptLoading && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    padding: '1.5rem',
                                    color: '#64748b',
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    background: '#f8fafc',
                                    borderRadius: '14px',
                                    border: '1px dashed #cbd5e1'
                                }}>
                                    <Loader2 className="checkout-spin" size={20} />
                                    Loading secure PayPal checkout...
                                </div>
                            )}
                            <div id="paypal-button-container" style={{ width: '100%', display: paypalScriptLoading ? 'none' : 'block' }}></div>
                        </div>
                    ) : (
                        <button
                            onClick={handlePayment}
                            disabled={!selectedGateway || loading || !isContactFormValid}
                            style={{
                                width: '100%',
                                padding: '1.25rem 2rem',
                                borderRadius: '14px',
                                border: 'none',
                                background: !selectedGateway
                                    ? '#e2e8f0'
                                    : selectedGateway === 'paypal'
                                        ? 'linear-gradient(135deg, #0070ba 0%, #003087 100%)'
                                        : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                color: !selectedGateway ? '#94a3b8' : 'white',
                                fontWeight: 800,
                                fontSize: '1.05rem',
                                cursor: !selectedGateway ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: !selectedGateway
                                    ? 'none'
                                    : selectedGateway === 'paypal'
                                        ? '0 8px 24px rgba(0, 112, 186, 0.35)'
                                        : '0 8px 24px rgba(37, 99, 235, 0.35)',
                                letterSpacing: '0.01em'
                            }}
                            onMouseEnter={(e) => {
                                if (selectedGateway && !loading) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.filter = 'brightness(1.06)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.filter = 'brightness(1)';
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={22} className="checkout-spin" />
                                    Processing...
                                </>
                            ) : !selectedGateway ? (
                                <>Select a payment method to continue</>
                            ) : (
                                <>
                                    <Lock size={18} />
                                    Subscribe Now — {plan.price}/mo
                                    <ChevronRight size={18} />
                                </>
                            )}
                        </button>
                    )}

                    {/* Trust indicators */}
                    <div style={{
                        marginTop: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2rem',
                        flexWrap: 'wrap'
                    }}>
                        {[
                            { icon: Shield, text: '256-bit SSL Encrypted' },
                            { icon: RefreshCw, text: 'Cancel Anytime' },
                            { icon: Clock, text: 'Instant Activation' }
                        ].map(t => (
                            <div key={t.text} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                color: '#64748b',
                                fontSize: '0.78rem',
                                fontWeight: 500
                            }}>
                                <t.icon size={14} color="#94a3b8" />
                                {t.text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right — Order Summary Sidebar */}
                <div style={{
                    position: 'sticky',
                    top: '120px'
                }}>
                    {/* Plan Summary Card */}
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        border: '1px solid #e2e8f0',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                    }}>
                        {/* Header */}
                        <div style={{
                            background: plan.gradient,
                            padding: '1.75rem',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Decorative circle */}
                            <div style={{
                                position: 'absolute',
                                top: '-20px',
                                right: '-20px',
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)'
                            }} />
                            <div style={{
                                position: 'absolute',
                                bottom: '-30px',
                                left: '-10px',
                                width: '70px',
                                height: '70px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.06)'
                            }} />
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '0.25rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    opacity: 0.9,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em'
                                }}>
                                    <Sparkles size={14} />
                                    Order Summary
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    marginTop: '0.75rem'
                                }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <PlanIcon size={22} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                                            {plan.name} Plan
                                        </h3>
                                        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.85 }}>
                                            Monthly subscription
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div style={{ padding: '1.75rem' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingBottom: '1rem',
                                borderBottom: '1px solid #f1f5f9'
                            }}>
                                <span style={{ color: '#475569', fontSize: '0.9rem', fontWeight: 500 }}>
                                    {plan.name} Plan
                                </span>
                                <span style={{ color: '#0f172a', fontSize: '0.95rem', fontWeight: 700 }}>
                                    {plan.price}/mo
                                </span>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem 0',
                                borderBottom: '1px solid #f1f5f9'
                            }}>
                                <span style={{ color: '#475569', fontSize: '0.9rem', fontWeight: 500 }}>
                                    Billing cycle
                                </span>
                                <span style={{ color: '#0f172a', fontSize: '0.9rem', fontWeight: 600 }}>
                                    Monthly
                                </span>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline',
                                paddingTop: '1.25rem',
                                marginTop: '0.25rem'
                            }}>
                                <span style={{ color: '#0f172a', fontSize: '1rem', fontWeight: 800 }}>
                                    Total due today
                                </span>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        fontSize: '1.75rem',
                                        fontWeight: 800,
                                        color: '#0f172a',
                                        letterSpacing: '-0.02em'
                                    }}>
                                        {plan.price}
                                    </span>
                                    <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>
                                        /mo
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
                        padding: '1.5rem',
                        marginTop: '1rem',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                    }}>
                        <h4 style={{
                            margin: '0 0 1rem',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: '#0f172a',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em'
                        }}>
                            What's Included
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {plan.features.map((f, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.6rem'
                                }}>
                                    <CheckCircle2 size={16} color={plan.color} strokeWidth={2.5} />
                                    <span style={{
                                        fontSize: '0.82rem',
                                        color: '#475569',
                                        fontWeight: 500
                                    }}>{f}</span>
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
                    @keyframes fadeSlideIn {
                        from {
                            opacity: 0;
                            transform: translateY(-8px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
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
