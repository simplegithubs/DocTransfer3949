import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
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
    Linkedin
} from 'lucide-react';
import { supabase } from './lib/supabase';

const Pricing: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<string | null>(null);
    const [currentPlan, setCurrentPlan] = useState<string | null>(null);

    useEffect(() => {
        const fetchCurrentPlan = async () => {
            if (user) {
                const { data } = await supabase
                    .from('subscriptions')
                    .select('plan_type')
                    .eq('user_id', user.id)
                    .single();
                if (data) setCurrentPlan(data.plan_type);
            }
        };
        fetchCurrentPlan();
    }, [user]);

    const handleUpgrade = async (planType: string) => {
        if (!user) {
            alert('Please sign in to get started.');
            return;
        }

        // Since everything is free and unlocked in the code, we don't strictly need to hit the DB
        // especially if the user hasn't set up the tables yet in their new Supabase project.
        setLoading(planType);
        setTimeout(() => {
            setLoading(null);
            navigate('/dataroom');
        }, 500);
    };

    const plans = [
        {
            name: 'Free Forever',
            planType: 'free',
            icon: Rocket,
            price: '$0',
            period: '/forever',
            description: 'All premium features are now free for everyone.',
            features: [
                'Unlimited document uploads',
                'Unlimited E-signatures',
                '1GB File size limit',
                'Vault Mode (E2E Encryption)',
                'Advanced Analytics',
                'Dynamic Watermarking',
                'Audit Trails',
                'SSO Integration',
                'Custom Branding'
            ],
            cta: 'Get Started Now',
            popular: true,
            color: '#4f46e5'
        }
    ];

    const comparisons = [
        { feature: 'Daily Uploads', standard: 'Unlimited', business: 'Unlimited' },
        { feature: 'E-Signatures', standard: 'Unlimited', business: 'Unlimited' },
        { feature: 'File Size Limit', standard: '100MB', business: '200MB' },
        { feature: 'Storage Duration', standard: '1 Year', business: 'Unlimited' },
        { feature: 'Analytics', standard: 'Advanced', business: 'Deep Insights' },
        { feature: 'Dynamic Watermark', standard: true, business: true },
        { feature: 'Vault Mode (E2E)', standard: false, business: true },
        { feature: 'Biometric Auth', standard: false, business: true },
        { feature: 'Custom Branding', standard: true, business: true },
        { feature: 'Audit Trails', standard: true, business: true },
        { feature: 'SSO Integration', standard: false, business: true },
    ];

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            <SEO 
                title="Pricing - DocTransfer" 
                description="Choose the plan that fits your needs. Now all premium plans are free for everyone." 
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
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: '#dcfce7',
                        color: '#166534',
                        padding: '0.4rem 1rem',
                        borderRadius: '100px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        marginBottom: '1.5rem'
                    }}>
                        <Sparkles size={16} /> All Premium Plans Now Free
                    </div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                        The Future of Secure Sharing is <span style={{ color: '#3b82f6' }}>Free</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
                        We've unlocked all our professional and enterprise features for everyone. 
                        No credit card required, no hidden fees. Just secure document sharing.
                    </p>
                </div>

                {/* Plan Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '2rem',
                    marginBottom: '8rem',
                    justifyContent: 'center'
                }}>
                    {plans.map((plan) => (
                        <div key={plan.name} style={{
                            background: 'white',
                            borderRadius: '24px',
                            padding: '2.5rem',
                            border: plan.popular ? `2px solid ${plan.color}` : '1px solid #e2e8f0',
                            boxShadow: plan.popular ? `0 20px 40px -10px ${plan.color}20` : '0 10px 30px -10px rgba(0,0,0,0.05)',
                            position: 'relative',
                            transition: 'transform 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            {plan.popular && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-12px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: plan.color,
                                    color: 'white',
                                    padding: '0.25rem 1rem',
                                    borderRadius: '100px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase'
                                }}>Most Popular</div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ 
                                    padding: '0.75rem', 
                                    background: `${plan.color}10`, 
                                    borderRadius: '12px',
                                    color: plan.color 
                                }}>
                                    <plan.icon size={24} />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{plan.name}</h3>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a' }}>{plan.price}</span>
                                <span style={{ color: '#64748b', fontSize: '1rem' }}>{plan.period}</span>
                            </div>
                            <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.5 }}>{plan.description}</p>
                            
                            <div style={{ flex: 1, marginBottom: '2.5rem' }}>
                                {plan.features.map((feature, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: '#475569' }}>
                                        <div style={{ background: '#dcfce7', borderRadius: '50%', padding: '2px' }}>
                                            <Check size={14} color="#166534" strokeWidth={3} />
                                        </div>
                                        <span style={{ fontSize: '0.925rem' }}>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => handleUpgrade(plan.planType as any)}
                                disabled={currentPlan === plan.planType || loading === plan.planType}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: currentPlan === plan.planType ? '#f1f5f9' : (plan.popular ? plan.color : '#0f172a'),
                                    color: currentPlan === plan.planType ? '#94a3b8' : 'white',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    cursor: currentPlan === plan.planType ? 'default' : 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}>
                                {loading === plan.planType ? <Loader2 size={20} className="animate-spin" /> : (currentPlan === plan.planType ? 'Active Plan' : plan.cta)}
                                {currentPlan !== plan.planType && <Zap size={18} fill="currentColor" />}
                            </button>
                        </div>
                    ))}
                </div>



                {/* FAQ */}
                <div style={{ marginTop: '10rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '4rem' }}>Frequently Asked Questions</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', textAlign: 'left' }}>
                        {[
                            { q: "Is it really free?", a: "Yes, completely. We've unlocked all our professional and enterprise features for everyone. No credit card required, no limits." },
                            { q: "Do I need a credit card?", a: "No. You don't even need to enter payment information. Just sign up and start sharing securely." },
                            { q: "What is included?", a: "Everything. From E2E encryption and e-signatures to deep analytics and audit trails. It's all free." },
                            { q: "What is Vault Mode?", a: "Vault Mode is our most secure sharing option, using client-side encryption so that even we can't see your files." }
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
                                <Link to="/blog" style={{ color: '#94a3b8', textDecoration: 'none' }}>Blog</Link>
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
        </div>
    );
};

export default Pricing;
