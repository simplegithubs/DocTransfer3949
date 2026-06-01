import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Check, Sparkles, ArrowRight, Loader2, Globe, CreditCard } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const PaymentSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const gatewayParam = searchParams.get('gateway');
    const planParam = searchParams.get('plan');
    const { user } = useUser();
    const [isVerified, setIsVerified] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
    const navigate = useNavigate();

    const isPayPal = gatewayParam === 'paypal';
    const payPalToken = searchParams.get('token') || 
                        searchParams.get('PayerID') || 
                        searchParams.get('paymentId') || 
                        searchParams.get('payment_id') || 
                        searchParams.get('payer_id') || 
                        searchParams.get('subscription_id');

    useEffect(() => {
        const verifyPayPal = async (token: string) => {
            try {
                const { data, error } = await supabase.functions.invoke('verify-paypal-subscription', {
                    body: {
                        userId: user!.id,
                        planType: planParam || 'standard',
                        paypalToken: token
                    }
                });
                if (error) {
                    throw error;
                }
                console.log("PayPal activation response:", data);
            } catch (err) {
                console.error("PayPal verification error:", err);
            }
        };

        const checkSubscription = async () => {
            if (!user) return; // Wait for user to be loaded

            // Polling logic to wait for webhook to update DB
            let attempts = 0;
            const maxAttempts = 15; // Increased for PayPal which may take longer

            const poll = async () => {
                try {
                    const { data } = await supabase
                        .from('subscriptions')
                        .select('status')
                        .eq('user_id', user.id)
                        .single();

                    if (data && (data.status === 'active' || data.status === 'trialing')) {
                        setIsVerified(true);
                        setVerifying(false);
                        // Clean up PayPal pending data
                        localStorage.removeItem('paypal_pending');
                        return;
                    }
                } catch (err) {
                    console.error("Error checking subscription:", err);
                }

                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(poll, 2000); // Retry every 2 seconds
                } else {
                    setVerifying(false); // Stop verifying after timeout
                }
            };

            poll();
        };

        if (user) {
            if (isPayPal) {
                if (payPalToken) {
                    // For PayPal, call verification edge function with token then check
                    verifyPayPal(payPalToken).then(() => checkSubscription());
                } else {
                    // Tweak: Add fallback subscription polling if token is missing (handles seamless webhook flow)
                    console.log("No PayPal token in URL. Trying subscription check fallback...");
                    checkSubscription();
                }
            } else if (sessionId) {
                checkSubscription();
            } else {
                setVerifying(false);
            }
        }
    }, [sessionId, user, isPayPal, planParam, payPalToken]);

    // Automatic redirection effect
    useEffect(() => {
        if (isVerified) {
            setRedirectCountdown(3);
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

    const gatewayColor = isPayPal ? '#0070ba' : '#667eea';
    const gatewayGradient = isPayPal
        ? 'linear-gradient(135deg, #0070ba 0%, #003087 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '3rem',
                maxWidth: '600px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
            }}>
                {/* Gateway Badge */}
                {isPayPal && (
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: '#e0f0ff',
                        color: '#003087',
                        padding: '0.35rem 1rem',
                        borderRadius: '100px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        marginBottom: '1.5rem',
                        letterSpacing: '0.02em'
                    }}>
                        <Globe size={14} />
                        PayPal Payment
                    </div>
                )}

                {/* Success Icon */}
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: verifying ? '#e2e8f0' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 2rem',
                    boxShadow: verifying ? 'none' : '0 12px 24px rgba(16, 185, 129, 0.3)',
                    animation: verifying ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'successPulse 2s ease-in-out infinite',
                    transition: 'all 0.5s ease'
                }}>
                    {verifying ? (
                        <Loader2 size={50} color="#64748b" className="animate-spin" />
                    ) : (
                        <Check size={50} color="white" strokeWidth={3} />
                    )}
                </div>

                {/* Success Message */}
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    background: gatewayGradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '1rem'
                }}>
                    {verifying ? 'Verifying Payment...' : 'Payment Successful! 🎉'}
                </h1>

                <p style={{
                    color: '#64748b',
                    fontSize: '1.125rem',
                    lineHeight: '1.6',
                    marginBottom: '2rem'
                }}>
                    {verifying ? (
                        isPayPal ? (
                            <>We're confirming your PayPal subscription. This may take a moment — please ensure you completed the payment in the PayPal window.</>
                        ) : (
                            <>We're confirming your subscription details from the bank.</>
                        )
                    ) : isVerified ? (
                        <>
                            Your subscription has been activated successfully. You now have access to all premium features!
                            {redirectCountdown !== null && (
                                <div style={{ marginTop: '1rem', color: '#10b981', fontWeight: '600' }}>
                                    Redirecting to dashboard in {redirectCountdown}s...
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {isPayPal ? (
                                payPalToken ? (
                                    <>Your PayPal payment is being processed. If you completed the subscription on PayPal, your account will be upgraded shortly. Please check back in a few minutes or contact support if needed.</>
                                ) : (
                                    <span style={{ color: '#dc2626', fontWeight: 700 }}>
                                        Verification failed: No valid PayPal transaction token found. Please complete the subscription process on PayPal to activate your plan.
                                    </span>
                                )
                            ) : (
                                <>Your payment was processed, but we're still setting up your account. If this takes longer than a minute, please contact support.</>
                            )}
                        </>
                    )}
                </p>

                {/* PayPal specific helper */}
                {isPayPal && verifying && (
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(0, 112, 186, 0.06) 0%, rgba(0, 48, 135, 0.06) 100%)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        marginBottom: '1.5rem',
                        border: '1px solid rgba(0, 112, 186, 0.15)',
                        textAlign: 'left'
                    }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                            <strong>Didn't complete PayPal checkout?</strong><br />
                            If the PayPal window closed without completing payment, you can try again from the <Link to="/pricing" style={{ color: '#0070ba', fontWeight: 600 }}>pricing page</Link>.
                        </p>
                    </div>
                )}

                {/* Features badge */}
                <div style={{
                    background: `linear-gradient(135deg, ${isPayPal ? 'rgba(0, 112, 186, 0.08)' : 'rgba(102, 126, 234, 0.1)'} 0%, ${isPayPal ? 'rgba(0, 48, 135, 0.08)' : 'rgba(118, 75, 162, 0.1)'} 100%)`,
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    border: `1px solid ${isPayPal ? 'rgba(0, 112, 186, 0.15)' : 'rgba(102, 126, 234, 0.2)'}`
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.75rem'
                    }}>
                        <Sparkles size={20} color="#f59e0b" />
                        <h3 style={{
                            fontSize: '1rem',
                            fontWeight: '700',
                            color: '#1e293b',
                            margin: 0
                        }}>
                            What's Next?
                        </h3>
                    </div>
                    <p style={{
                        color: '#64748b',
                        fontSize: '0.9rem',
                        margin: 0,
                        lineHeight: '1.5'
                    }}>
                        Head to your dashboard to start uploading documents with your new premium features and enhanced limits.
                    </p>
                </div>

                {/* CTA Buttons */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <Link to="/dataroom" style={{ textDecoration: 'none' }}>
                        <button style={{
                            width: '100%',
                            padding: '1rem 1.5rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: gatewayGradient,
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: `0 8px 20px ${isPayPal ? 'rgba(0, 112, 186, 0.3)' : 'rgba(102, 126, 234, 0.3)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            opacity: verifying ? 0.7 : 1,
                            pointerEvents: verifying ? 'none' : 'auto'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = `0 12px 28px ${isPayPal ? 'rgba(0, 112, 186, 0.4)' : 'rgba(102, 126, 234, 0.4)'}`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = `0 8px 20px ${isPayPal ? 'rgba(0, 112, 186, 0.3)' : 'rgba(102, 126, 234, 0.3)'}`;
                            }}>
                            Go to Dashboard
                            <ArrowRight size={20} />
                        </button>
                    </Link>

                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <button style={{
                            width: '100%',
                            padding: '1rem 1.5rem',
                            borderRadius: '12px',
                            border: '2px solid #e2e8f0',
                            background: 'white',
                            color: '#64748b',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#cbd5e1';
                                e.currentTarget.style.color = '#475569';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#e2e8f0';
                                e.currentTarget.style.color = '#64748b';
                            }}>
                            Back to Home
                        </button>
                    </Link>
                </div>

                {/* Session ID (for debugging) */}
                {(sessionId || planParam) && (
                    <p style={{
                        marginTop: '2rem',
                        fontSize: '0.75rem',
                        color: '#94a3b8'
                    }}>
                        {sessionId
                            ? `Session: ${sessionId.substring(0, 20)}...`
                            : `Plan: ${planParam} (via ${gatewayParam})`
                        }
                    </p>
                )}
            </div>

            <style>
                {`
                    @keyframes successPulse {
                        0%, 100% {
                            transform: scale(1);
                        }
                        50% {
                            transform: scale(1.05);
                        }
                    }
                     @keyframes pulse {
                        0%, 100% {
                            opacity: 1;
                        }
                        50% {
                            opacity: .5;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default PaymentSuccess;
