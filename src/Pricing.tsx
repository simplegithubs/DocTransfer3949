import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser, useAuth } from '@clerk/clerk-react';
import Logo from './components/Logo';
import SEO from './components/SEO';
import {
    Check,
    X,
    Briefcase,
    Rocket,
    Sparkles,
    Zap,
    Loader2,
    Lock,
    BarChart3,
    PenTool,
    UploadCloud,
    HardDrive,
    History,
    Mail,
    ShieldCheck,
    Type,
    LineChart,
    Calendar,
    ShieldAlert,
    Fingerprint,
    Layers,
    Bomb,
    Timer,
    Eye,
    Twitter,
    Instagram,
    Youtube,
    Linkedin,
    Globe,
    CreditCard
} from 'lucide-react';
import { supabase, createSupabaseClient, getSafeSupabaseToken } from './lib/supabase';

const Pricing: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [currentPlan, setCurrentPlan] = useState<string | null>(null);
    const [hasUsedTrial, setHasUsedTrial] = useState<boolean>(false);
    const [isTrialing, setIsTrialing] = useState<boolean>(false);
    const { getToken } = useAuth();
    const [startingTrial, setStartingTrial] = useState<string | null>(null);

    useEffect(() => {
        const fetchCurrentPlan = async () => {
            if (user) {
                const { data } = await supabase
                    .from('subscriptions')
                    .select('plan_type, status, trial_end')
                    .eq('user_id', user.id)
                    .single();
                if (data) {
                    setCurrentPlan(data.plan_type);
                    setHasUsedTrial(!!data.trial_end);
                    setIsTrialing(data.status === 'trialing');
                }
            }
        };
        fetchCurrentPlan();
    }, [user]);

    const handleUpgrade = async (planType: string) => {
        if (!user) {
            alert('Please sign in to get started.');
            return;
        }

        if (planType === 'free') {
            navigate('/dataroom');
            return;
        }

        if (!hasUsedTrial) {
            try {
                setStartingTrial(planType);
                const token = await getToken({ template: 'supabase' });
                const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
                
                const response = await fetch(`${supabaseUrl}/functions/v1/start-free-trial`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ userId: user.id, planType })
                });
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || 'Failed to start trial');
                }
                
                navigate('/dataroom?trial_started=true');
            } catch (err: any) {
                console.error(err);
                alert(`Error starting free trial: ${err.message || 'Please try again'}`);
            } finally {
                setStartingTrial(null);
            }
            return;
        }

        navigate(`/checkout?plan=${planType}`);
    };

    const plans = [
        {
            name: 'Free',
            planType: 'free',
            icon: Rocket,
            price: '$0',
            period: '/month',
            description: 'Perfect for individuals getting started with secure sharing.',
            features: [
                { text: '30 Links Sent Per Year', enabled: true },
                { text: '30 Document Uploads Per Year', enabled: true },
                { text: '10MB File Size Limit', enabled: true },
                { text: 'Unlimited Visitors', enabled: true },
                { text: 'Page-by-Page Analytics', enabled: true },
                { text: 'Password Protection', enabled: true },
                { text: 'Allow / Block Downloads', enabled: true }
            ],
            cta: 'Get Started',
            popular: false,
            color: '#64748b',
            gradient: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        },
        {
            name: 'Standard',
            planType: 'standard',
            icon: Zap,
            price: '$25',
            period: '/month',
            description: 'Advanced security and analytics for growing teams.',
            features: [
                { text: 'Unlimited transfers', enabled: true },
                { text: '50MB File size limit', enabled: true },
                { text: 'Password Protection', enabled: true },
                { text: 'AES-256 Encryption', enabled: true },
                { text: 'Self-Destruct (Time/Views)', enabled: true },
                { text: 'Email Verification', enabled: true },
                { text: 'Dynamic Watermarking', enabled: true },
                { text: 'Allow Downloads', enabled: true },
                { text: 'Page-by-Page Analytics', enabled: true },
                { text: 'Audit Trail', enabled: true },
                { text: 'Unlimited E-Signature', enabled: true }
            ],
            cta: 'Upgrade to Standard',
            popular: true,
            color: '#3b82f6',
            gradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'
        },
        {
            name: 'Business',
            planType: 'business',
            icon: Briefcase,
            price: '$39',
            period: '/month',
            description: 'Full enterprise suite with maximum security controls.',
            features: [
                { text: 'Everything in Standard', enabled: true },
                { text: '500MB File size limit', enabled: true },
                { text: 'Vault Mode (E2E)', enabled: true },
                { text: 'Audit Trails & Compliance', enabled: true },
                { text: 'SSO Integration', enabled: true },
                { text: 'Custom Branding', enabled: true },
                { text: 'View & Print Limits', enabled: true },
                { text: 'Dedicated Support', enabled: true }
            ],
            cta: 'Upgrade to Business',
            popular: false,
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)'
        }
    ];

    const comparisons = [
        { feature: 'Document Uploads', free: '30/year', standard: 'Unlimited', business: 'Unlimited' },
        { feature: 'E-Signatures', free: '-', standard: 'Unlimited', business: 'Unlimited' },
        { feature: 'File Size Limit', free: '10MB', standard: '50MB', business: '500MB' },
        { feature: 'Password Protection', free: false, standard: true, business: true },
        { feature: 'Vault Mode (E2E)', free: false, standard: false, business: true },
        { feature: 'Audit Trails', free: false, standard: true, business: true },
        { feature: 'Custom Branding', free: false, standard: false, business: true },
        { feature: 'View & Print Limits', free: false, standard: false, business: true },
        { feature: 'SSO Integration', free: false, standard: false, business: true },
    ];

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            <SEO
                title="Pricing — Professional Document Sharing for Free"
                description="Get all enterprise-grade security features for free. Unlimited document sharing, page-by-page analytics, and E2E encryption without the premium price tag."
                keywords="free DocSend alternative, free virtual data room, document sharing pricing, secure file sharing free"
            />

            {/* Navbar */}
            <header style={{
                padding: '1.5rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                borderBottom: '1px solid #e2e8f0'
            }}>
                <Link to="/" style={{ textDecoration: 'none' }}><Logo size={32} /></Link>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link to="/" style={{ color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
                    <SignedIn>
                        <Link to="/dataroom" style={{ color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Dashboard</Link>
                        <UserButton afterSignOutUrl="/pricing" />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button style={{
                                padding: '0.6rem 1.2rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#3b82f6',
                                color: 'white',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}>Sign In</button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </header>

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
                {/* Hero */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: '#dbeafe',
                        color: '#1e40af',
                        padding: '0.4rem 1rem',
                        borderRadius: '100px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        marginBottom: '1.5rem'
                    }}>
                        <Sparkles size={16} /> Scalable Security for Every Need
                    </div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                        Simple, <span style={{ color: '#3b82f6' }}>Transparent</span> Pricing
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6, marginBottom: '2rem' }}>
                        Choose the perfect plan for your document sharing needs. 
                        Start for free and upgrade as you grow.
                    </p>
                </div>



                {/* Plan Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '2.5rem',
                    marginBottom: '8rem',
                    justifyContent: 'center'
                }}>
                    {plans.map((plan) => (
                        <div key={plan.name} style={{
                            background: 'white',
                            borderRadius: '32px',
                            padding: '3rem',
                            border: plan.popular ? `2px solid ${plan.color}` : '1px solid #e2e8f0',
                            boxShadow: plan.popular ? `0 30px 60px -15px ${plan.color}25` : '0 15px 45px -15px rgba(0,0,0,0.08)',
                            position: 'relative',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                            e.currentTarget.style.boxShadow = plan.popular ? `0 40px 80px -20px ${plan.color}35` : '0 25px 60px -20px rgba(0,0,0,0.12)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = plan.popular ? `0 30px 60px -15px ${plan.color}25` : '0 15px 45px -15px rgba(0,0,0,0.08)';
                        }}
                        >
                            {plan.popular && (
                                <div style={{
                                    position: 'absolute',
                                    top: '24px',
                                    right: '-35px',
                                    transform: 'rotate(45deg)',
                                    background: plan.color,
                                    color: 'white',
                                    padding: '0.4rem 3rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    zIndex: 1
                                }}>Popular</div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
                                <div style={{ 
                                    width: '56px',
                                    height: '56px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: plan.gradient || `${plan.color}10`, 
                                    borderRadius: '16px',
                                    color: plan.color 
                                }}>
                                    <plan.icon size={28} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>{plan.name}</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Best for {plan.name === 'Free' ? 'Personal' : (plan.name === 'Standard' ? 'Growth' : 'Scale')}</p>
                                </div>
                            </div>

                            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                                <span style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0f172a' }}>{plan.price}</span>
                                <span style={{ color: '#64748b', fontSize: '1.125rem', fontWeight: 500 }}>{plan.period}</span>
                            </div>
                            
                            <p style={{ color: '#64748b', marginBottom: '2.5rem', fontSize: '1rem', lineHeight: 1.6, minHeight: '3em' }}>{plan.description}</p>
                            
                            <div style={{ flex: 1, marginBottom: '3rem' }}>
                                {plan.features.map((feature: any, i) => (
                                    <div key={i} style={{ 
                                        display: 'flex', 
                                        alignItems: 'flex-start', 
                                        gap: '1rem', 
                                        marginBottom: '1rem', 
                                        color: feature.enabled ? '#334155' : '#94a3b8',
                                        opacity: feature.enabled ? 1 : 0.6
                                    }}>
                                        <div style={{ 
                                            marginTop: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '20px',
                                            height: '20px',
                                            background: feature.enabled ? '#dcfce7' : '#f1f5f9', 
                                            borderRadius: '50%' 
                                        }}>
                                            {feature.enabled ? (
                                                <Check size={12} color="#166534" strokeWidth={4} />
                                            ) : (
                                                <Lock size={10} color="#94a3b8" />
                                            )}
                                        </div>
                                        <span style={{ 
                                            fontSize: '0.95rem', 
                                            fontWeight: 500,
                                            textDecoration: feature.enabled ? 'none' : 'line-through' 
                                        }}>{feature.text}</span>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => handleUpgrade(plan.planType as any)}
                                disabled={currentPlan === plan.planType}
                                style={{
                                    width: '100%',
                                    padding: '1.25rem',
                                    borderRadius: '16px',
                                    border: 'none',
                                    background: currentPlan === plan.planType 
                                        ? '#f1f5f9' 
                                        : plan.planType === 'free'
                                            ? '#3b82f6'
                                            : plan.color,
                                    color: currentPlan === plan.planType 
                                        ? '#94a3b8' 
                                        : 'white',
                                    fontWeight: 800,
                                    fontSize: '1.1rem',
                                    cursor: currentPlan === plan.planType ? 'default' : 'pointer',
                                    transition: 'all 0.3s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    boxShadow: currentPlan === plan.planType 
                                        ? 'none' 
                                        : `0 10px 20px -5px ${plan.color}50`
                                }}
                                onMouseEnter={(e) => {
                                    if (currentPlan !== plan.planType) {
                                        e.currentTarget.style.filter = 'brightness(1.08)';
                                        e.currentTarget.style.transform = 'scale(1.01)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentPlan !== plan.planType) {
                                        e.currentTarget.style.filter = 'brightness(1)';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }
                                }}
                                >
                                {startingTrial === plan.planType ? (
                                    <><Loader2 size={20} className="animate-spin" /> Starting Trial...</>
                                ) : currentPlan === plan.planType ? (
                                    'Current Plan'
                                ) : plan.planType !== 'free' && !hasUsedTrial ? (
                                    'Start 14-Day Free Trial'
                                ) : (
                                    plan.cta
                                )}
                                {currentPlan !== plan.planType && startingTrial !== plan.planType && (
                                    <Zap size={20} fill="currentColor" />
                                )}
                            </button>

                            {plan.planType !== 'free' && (
                                <div style={{
                                    marginTop: '1.25rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    opacity: 0.95
                                }}>
                                    <div style={{
                                        fontSize: '0.78rem',
                                        color: '#64748b',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}>
                                        🔒 Secure Checkout
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        gap: '0.4rem',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: '#f8fafc',
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        flexWrap: 'wrap',
                                        width: '100%',
                                        boxSizing: 'border-box'
                                    }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0070ba', background: '#e0f0ff', padding: '2px 6px', borderRadius: '4px' }}>PayPal</span>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563eb', background: '#dbeafe', padding: '2px 6px', borderRadius: '4px' }}>Credit/Debit Cards</span>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#dc2626', background: '#fee2e2', padding: '2px 6px', borderRadius: '4px' }}>Visa/MC/Amex</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>



                {/* FAQ */}
                <div style={{ marginTop: '10rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '4rem' }}>Frequently Asked Questions</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', textAlign: 'left' }}>
                        {[
                            { q: "Is DocTransfer really free?", a: "Yes, absolutely! We've made the strategic decision to unlock all our premium, professional, and enterprise features for everyone. No credit card required, no limits." },
                            { q: "What is Vault Mode?", a: "Vault Mode is our most secure sharing option, using client-side E2E encryption so that even we can't see your files. You hold the keys." },
                            { q: "What is 'Burn After Reading'?", a: "This feature allows you to set documents to automatically delete themselves after a single view, ensuring your sensitive data doesn't persist." },
                            { q: "Is it compliant?", a: "Yes! With features like Audit Trails and E2E encryption, we help businesses maintain compliance with HIPAA, GDPR, and NIST standards." },
                            { q: "Can I add my logo?", a: "Absolutely. Our White-Labeling feature allows you to add your own company logo and colors for a professional experience." },
                            { q: "What payment methods are supported?", a: "We support payments via PayPal, which accepts all major international credit & debit cards (Visa, MasterCard, American Express, Discover) as well as PayPal accounts." }
                        ].map((faq, i) => (
                            <div key={i}>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>{faq.q}</h4>
                                <p style={{ color: '#64748b', lineHeight: 1.6 }}>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer style={{ background: '#0f172a', color: 'white', padding: '5rem 2rem 2rem', marginTop: '5rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
                        <div>
                            <Logo size={28} light />
                            <p style={{ marginTop: '1.5rem', color: '#94a3b8', lineHeight: 1.6 }}>
                                Secure document sharing and analytics for modern professionals.
                            </p>
                        </div>
                        <div>
                            <h5 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Product</h5>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
                                <Link to="/pricing" style={{ color: '#94a3b8', textDecoration: 'none' }}>Pricing</Link>
                            </div>
                        </div>
                        <div>
                            <h5 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Connect</h5>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <a href="https://x.com/Roushan71262" target="_blank" style={{ color: '#94a3b8' }}><Twitter size={20} /></a>
                                <a href="https://www.instagram.com/doctransfer2227/" target="_blank" style={{ color: '#94a3b8' }}><Instagram size={20} /></a>
                                <a href="https://www.youtube.com/@doctransfer144" target="_blank" style={{ color: '#94a3b8' }}><Youtube size={20} /></a>
                                <a href="https://www.linkedin.com/in/doctransfer-0a2291314/" target="_blank" style={{ color: '#94a3b8' }}><Linkedin size={20} /></a>
                            </div>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid #1e293b', paddingTop: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
                        © 2025 DocTransfer. All rights reserved.
                    </div>
                </div>
            </footer>

            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .animate-spin {
                        animation: spin 1s linear infinite;
                    }
                `}
            </style>
        </div>
    );
};

export default Pricing;
