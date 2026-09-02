import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Check, Sparkles, ArrowRight, Loader2, CreditCard, ShieldCheck, Zap, Calendar, CheckCircle2 } from 'lucide-react';
import { useUser } from './components/auth';
import { supabase } from './lib/supabase';

const PaymentSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const gatewayParam = searchParams.get('gateway') || 'razorpay';
    const rawPlan = searchParams.get('plan') || 'pro';
    const planParam = rawPlan === 'standard' ? 'pro' : rawPlan;
    const cycleParam = (searchParams.get('cycle') || 'monthly').toLowerCase();
    const paymentId = searchParams.get('payment_id') || searchParams.get('razorpay_payment_id');
    const subscriptionId = searchParams.get('subscription_id') || searchParams.get('razorpay_subscription_id');

    const { user } = useUser();
    const [isVerified, setIsVerified] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [periodEndFormatted, setPeriodEndFormatted] = useState<string>('');
    const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
    const navigate = useNavigate();

    const isAnnual = cycleParam === 'annual' || cycleParam === 'yearly';
    const durationText = isAnnual ? '1 Year' : '1 Month';
    const daysCount = isAnnual ? 365 : 30;

    const planDisplayName = planParam === 'dataroom'
        ? 'Virtual Data Room (VDR)'
        : planParam === 'business'
            ? 'Business CA Suite'
            : 'Pro Plan';

    useEffect(() => {
        const activateAndVerify = async () => {
            if (!user) return;

            // Calculate expected end date
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + daysCount);
            const endDateString = endDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            setPeriodEndFormatted(endDateString);

            let attempts = 0;
            const maxAttempts = 10;

            const poll = async () => {
                try {
                    // Check database subscriptions table
                    const { data } = await supabase
                        .from('subscriptions')
                        .select('status, plan_type, current_period_end')
                        .eq('user_id', user.id)
                        .single();

                    const isMatch = data &&
                        (data.plan_type === planParam || (data.plan_type === 'pro' && planParam === 'standard')) &&
                        (data.status === 'active' || data.status === 'trialing') &&
                        (!data.current_period_end || new Date(data.current_period_end) > new Date());

                    if (isMatch) {
                        // Cache locally for instant UI responsiveness
                        localStorage.setItem('doctransfer_active_sub', JSON.stringify({
                            user_id: user.id,
                            plan_type: planParam,
                            status: 'active',
                            current_period_end: data.current_period_end || endDate.toISOString()
                        }));

                        setIsVerified(true);
                        setVerifying(false);
                        return;
                    }
                } catch (err) {
                    console.error("Error checking subscription:", err);
                }

                attempts++;

                // If after 2 attempts DB is not updated, trigger direct activation RPC fallback
                if (attempts === 2) {
                    try {
                        const { data: rpcData, error: rpcError } = await supabase.rpc('activate_user_subscription', {
                            p_user_id: user.id,
                            p_plan_type: planParam,
                            p_billing_cycle: cycleParam,
                            p_transaction_ref: paymentId || subscriptionId || 'razorpay_paid'
                        });
                        console.log("Direct activation result:", rpcData, rpcError);
                    } catch (e) {
                        console.warn("Direct RPC invocation notice:", e);
                    }
                }

                if (attempts < maxAttempts) {
                    setTimeout(poll, 1500);
                } else {
                    // Fallback to verified if paymentId exists
                    if (paymentId) {
                        localStorage.setItem('doctransfer_active_sub', JSON.stringify({
                            user_id: user.id,
                            plan_type: planParam,
                            status: 'active',
                            current_period_end: endDate.toISOString()
                        }));
                        setIsVerified(true);
                    }
                    setVerifying(false);
                }
            };

            poll();
        };

        if (user) {
            activateAndVerify();
        }
    }, [user, paymentId, subscriptionId, planParam, cycleParam, daysCount]);

    // Automatic redirection countdown
    useEffect(() => {
        if (isVerified) {
            setRedirectCountdown(4);
            const timer = setInterval(() => {
                setRedirectCountdown(prev => {
                    if (prev && prev > 1) return prev - 1;
                    clearInterval(timer);
                    navigate('/dataroom');
                    return 0;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isVerified, navigate]);

    const gatewayGradient = 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)';

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                background: 'white',
                borderRadius: '28px',
                padding: '3rem 2.5rem',
                maxWidth: '600px',
                width: '100%',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.04)',
                textAlign: 'center'
            }}>
                {/* Gateway Badge */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#e0f2fe',
                    color: '#0369a1',
                    padding: '0.4rem 1.1rem',
                    borderRadius: '100px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    marginBottom: '1.75rem',
                    letterSpacing: '0.02em'
                }}>
                    <CreditCard size={15} />
                    Razorpay Payment Confirmed
                </div>

                {/* Success Icon */}
                <div style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    background: verifying ? '#f1f5f9' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.75rem',
                    boxShadow: verifying ? 'none' : '0 12px 28px rgba(16, 185, 129, 0.35)',
                    transition: 'all 0.4s ease'
                }}>
                    {verifying ? (
                        <Loader2 size={40} color="#0284c7" className="payment-spin" />
                    ) : (
                        <Check size={44} color="white" strokeWidth={3.5} />
                    )}
                </div>

                {/* Success Message */}
                <h1 style={{
                    fontSize: '2.25rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    marginBottom: '0.75rem',
                    letterSpacing: '-0.02em'
                }}>
                    {verifying ? 'Activating Your Subscription...' : 'Payment Successful! 🎉'}
                </h1>

                {/* Duration Badge */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#dcfce7',
                    color: '#15803d',
                    padding: '0.45rem 1.25rem',
                    borderRadius: '100px',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    marginBottom: '1.5rem'
                }}>
                    <Zap size={16} fill="currentColor" />
                    {planDisplayName} Unlocked for {durationText}
                </div>

                <p style={{
                    color: '#64748b',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    marginBottom: '2rem'
                }}>
                    {verifying ? (
                        <>We are confirming your payment and setting up your <strong>{planDisplayName}</strong> workspace.</>
                    ) : (
                        <>
                            All features for <strong>{planDisplayName}</strong> have been unlocked for your account.
                            {periodEndFormatted && (
                                <span style={{ display: 'block', marginTop: '0.35rem', fontWeight: 600, color: '#334155' }}>
                                    📅 Active until: <strong>{periodEndFormatted}</strong>
                                </span>
                            )}
                            {redirectCountdown !== null && (
                                <span style={{ display: 'block', marginTop: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                                    Redirecting to dashboard in {redirectCountdown}s...
                                </span>
                            )}
                        </>
                    )}
                </p>

                {/* Unlocked Features Box */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.04) 0%, rgba(3, 105, 161, 0.07) 100%)',
                    borderRadius: '16px',
                    padding: '1.25rem 1.5rem',
                    marginBottom: '2rem',
                    border: '1px solid rgba(2, 132, 199, 0.15)',
                    textAlign: 'left'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <Sparkles size={18} color="#0284c7" />
                        <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                            Unlocked Features for {durationText}:
                        </h4>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        {[
                            'Unlimited Document Uploads',
                            'Page-by-Page Dwell Analytics',
                            'Court Sec 65B Audit Trail',
                            'Unlimited E-Signatures',
                            'Dynamic Watermarking',
                            planParam === 'dataroom' ? 'Multi-Party Diligence Rooms' : 'Virtual Deal Rooms'
                        ].map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <CheckCircle2 size={14} color="#10b981" strokeWidth={2.5} />
                                <span style={{ fontSize: '0.78rem', color: '#334155', fontWeight: 600 }}>{f}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <Link to="/dataroom" style={{ textDecoration: 'none' }}>
                        <button style={{
                            width: '100%',
                            padding: '1rem 1.5rem',
                            borderRadius: '14px',
                            border: 'none',
                            background: gatewayGradient,
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 8px 24px rgba(2, 132, 199, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.08)'}
                            onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                        >
                            Go to Dashboard Now
                            <ArrowRight size={18} />
                        </button>
                    </Link>

                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <button style={{
                            width: '100%',
                            padding: '0.85rem 1.5rem',
                            borderRadius: '14px',
                            border: '1px solid #e2e8f0',
                            background: 'white',
                            color: '#64748b',
                            fontSize: '0.92rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#cbd5e1';
                                e.currentTarget.style.color = '#0f172a';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#e2e8f0';
                                e.currentTarget.style.color = '#64748b';
                            }}
                        >
                            Back to Home
                        </button>
                    </Link>
                </div>

                {/* Transaction Reference info */}
                {(paymentId || subscriptionId) && (
                    <p style={{
                        marginTop: '1.75rem',
                        fontSize: '0.72rem',
                        color: '#94a3b8',
                        fontFamily: 'monospace'
                    }}>
                        Ref: {paymentId || subscriptionId}
                    </p>
                )}
            </div>

            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .payment-spin {
                        animation: spin 1s linear infinite;
                    }
                `}
            </style>
        </div>
    );
};

export default PaymentSuccess;
