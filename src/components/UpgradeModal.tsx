import React, { useState } from 'react';
import { X, Crown, Check, Zap, Briefcase, FolderLock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    featureName?: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, featureName }) => {
    const navigate = useNavigate();
    const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

    if (!isOpen) return null;

    const handleSelectPlan = (plan: 'pro' | 'business' | 'dataroom') => {
        onClose();
        navigate(`/checkout?plan=${plan}&currency=${currency}`);
    };

    const plans = [
        {
            key: 'pro' as const,
            name: 'Pro Plan',
            tagline: 'Forensic analytics, watermarks & e-signatures',
            icon: Zap,
            priceINR: '₹699',
            priceUSD: '$19',
            color: '#3b82f6',
            accentBg: '#eff6ff',
            gradient: 'linear-gradient(180deg, #ffffff 0%, #eff6ff 100%)',
            borderColor: '#93c5fd',
            badge: '🔥 POPULAR',
            features: [
                'Unlimited Document Uploads',
                '50MB File Size Limit',
                '5 Active Deal Rooms',
                'Page-by-Page Dwell Forensics',
                'Dynamic Anti-Leak Watermark',
                'Unlimited E-Signatures (IT Act 2000)',
                'Sec 65B Court-Admissible Audit Trail',
                'Remote Self-Destruct Kill Switch'
            ]
        },
        {
            key: 'business' as const,
            name: 'Business CA Suite',
            tagline: 'Zero-knowledge vault, client portals & GST invoicing',
            icon: Briefcase,
            priceINR: '₹1,799',
            priceUSD: '$49',
            color: '#8b5cf6',
            accentBg: '#f5f3ff',
            gradient: 'linear-gradient(180deg, #ffffff 0%, #faf5ff 100%)',
            borderColor: '#a855f7',
            badge: 'BEST FOR TEAMS',
            features: [
                'Everything in Pro Plan',
                '500MB File Size Limit',
                'Unlimited Deal Rooms & Folders',
                'Zero-Knowledge Vault (AES-256 E2EE)',
                'Custom Domain & Full Branding',
                'Client Intake Portals',
                'GST Tax Invoicing with ITC Credit',
                '3 Team Member Seats Included'
            ]
        },
        {
            key: 'dataroom' as const,
            name: 'Virtual Data Room',
            tagline: 'M&A diligence, multi-party bidding & archives',
            icon: FolderLock,
            priceINR: '₹4,999',
            priceUSD: '$129',
            color: '#10b981',
            accentBg: '#ecfdf5',
            gradient: 'linear-gradient(180deg, #ffffff 0%, #ecfdf5 100%)',
            borderColor: '#34d399',
            badge: 'ENTERPRISE M&A',
            features: [
                'Everything in Business Suite',
                '2GB File Size Limit Per Upload',
                'Multi-Party Isolated Bidder Rooms',
                'Due Diligence Q&A with Approvals',
                'Bates Numbering & Auto-Index',
                '1-Click Compliance ZIP Archive',
                '10 Team Seats + Unlimited Guests',
                'Dedicated Deal Room Concierge'
            ]
        }
    ];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(12px)',
            animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            fontFamily: "'Inter', sans-serif"
        }}
            onClick={onClose}
        >
            <div style={{
                background: 'white',
                borderRadius: '28px',
                width: '100%',
                maxWidth: '1100px',
                boxShadow: '0 30px 70px -10px rgba(15, 23, 42, 0.3), 0 0 0 1px rgba(15, 23, 42, 0.05)',
                position: 'relative',
                overflow: 'hidden',
                animation: 'scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                maxHeight: 'calc(100vh - 3rem)',
                display: 'flex',
                flexDirection: 'column'
            }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decorative gradient */}
                <div style={{
                    position: 'absolute',
                    top: '-120px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '600px',
                    height: '250px',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0
                }}></div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1.25rem',
                        right: '1.25rem',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: '1px solid #f1f5f9',
                        background: 'white',
                        color: '#64748b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        zIndex: 10,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#0f172a';
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                        e.currentTarget.style.transform = 'rotate(90deg)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#64748b';
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.transform = 'rotate(0deg)';
                    }}
                >
                    <X size={18} />
                </button>

                {/* Scrollable Content */}
                <div style={{ padding: '2.75rem 2.5rem 2.5rem', zIndex: 1, overflowY: 'auto' }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '56px',
                            height: '56px',
                            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                            borderRadius: '18px',
                            color: '#d97706',
                            marginBottom: '1.25rem',
                            boxShadow: '0 8px 20px -5px rgba(217, 119, 6, 0.2)'
                        }}>
                            <Crown size={28} fill="currentColor" strokeWidth={1.5} />
                        </div>
                        <h2 style={{
                            fontSize: '2rem',
                            fontWeight: 800,
                            color: '#0f172a',
                            marginBottom: '0.5rem',
                            letterSpacing: '-0.02em'
                        }}>
                            Upgrade to Premium
                        </h2>
                        <p style={{
                            color: '#64748b',
                            fontSize: '1rem',
                            maxWidth: '560px',
                            margin: '0 auto 1.25rem',
                            lineHeight: 1.5
                        }}>
                            {featureName ? (
                                <span>
                                    ✨ <strong style={{ color: '#4f46e5' }}>{featureName}</strong> is a premium feature. Upgrade to Pro, Business, or Data Room to unlock it instantly.
                                </span>
                            ) : (
                                "Unlock forensic analytics, e-signatures, zero-knowledge vault, and advanced compliance."
                            )}
                        </p>

                        {/* Currency Toggle */}
                        <div style={{
                            display: 'inline-flex',
                            background: '#f1f5f9',
                            padding: '0.3rem',
                            borderRadius: '12px'
                        }}>
                            <button
                                onClick={() => setCurrency('INR')}
                                style={{
                                    padding: '0.4rem 1rem',
                                    borderRadius: '9px',
                                    border: 'none',
                                    background: currency === 'INR' ? 'white' : 'transparent',
                                    color: currency === 'INR' ? '#0f172a' : '#64748b',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    boxShadow: currency === 'INR' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                🇮🇳 INR (₹)
                            </button>
                            <button
                                onClick={() => setCurrency('USD')}
                                style={{
                                    padding: '0.4rem 1rem',
                                    borderRadius: '9px',
                                    border: 'none',
                                    background: currency === 'USD' ? 'white' : 'transparent',
                                    color: currency === 'USD' ? '#0f172a' : '#64748b',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    boxShadow: currency === 'USD' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                🌐 USD ($)
                            </button>
                        </div>
                    </div>

                    {/* 3 Plan Cards Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.5rem',
                        justifyContent: 'center'
                    }}>
                        {plans.map((p) => {
                            const PlanIcon = p.icon;
                            return (
                                <div
                                    key={p.key}
                                    style={{
                                        background: p.gradient,
                                        border: `1.5px solid ${p.borderColor}`,
                                        borderRadius: '22px',
                                        padding: '2rem 1.75rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                        position: 'relative'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = `0 20px 40px -15px ${p.color}25`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    {/* Badge */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        background: p.color,
                                        color: 'white',
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '100px',
                                        fontSize: '0.62rem',
                                        fontWeight: 800,
                                        letterSpacing: '0.04em'
                                    }}>
                                        {p.badge}
                                    </div>

                                    {/* Plan Header */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                                        <div style={{
                                            width: '42px',
                                            height: '42px',
                                            borderRadius: '12px',
                                            background: p.accentBg,
                                            color: p.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <PlanIcon size={22} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{p.name}</h3>
                                            <p style={{ color: '#64748b', fontSize: '0.72rem', margin: 0 }}>{p.tagline}</p>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.25rem' }}>
                                        <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a' }}>
                                            {currency === 'INR' ? p.priceINR : p.priceUSD}
                                        </span>
                                        <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>/month</span>
                                    </div>

                                    {/* Features list */}
                                    <div style={{ flex: 1, marginBottom: '1.75rem' }}>
                                        {p.features.map((feat, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.65rem' }}>
                                                <div style={{
                                                    width: '17px',
                                                    height: '17px',
                                                    borderRadius: '50%',
                                                    background: idx === 0 ? p.color : '#dcfce7',
                                                    color: idx === 0 ? 'white' : '#15803d',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0
                                                }}>
                                                    <Check size={10} strokeWidth={3.5} />
                                                </div>
                                                <span style={{
                                                    fontSize: '0.82rem',
                                                    color: '#334155',
                                                    fontWeight: idx === 0 ? 700 : 500
                                                }}>{feat}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <button
                                        onClick={() => handleSelectPlan(p.key)}
                                        style={{
                                            width: '100%',
                                            padding: '0.9rem',
                                            borderRadius: '14px',
                                            border: 'none',
                                            background: p.color,
                                            color: 'white',
                                            fontWeight: 700,
                                            fontSize: '0.92rem',
                                            cursor: 'pointer',
                                            boxShadow: `0 8px 18px -4px ${p.color}45`,
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.08)'}
                                        onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                                    >
                                        Upgrade to {p.name.split(' ')[0]} <ArrowRight size={16} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer link */}
                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <button
                            onClick={() => { onClose(); navigate('/pricing'); }}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#3b82f6',
                                fontSize: '0.88rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                textUnderlineOffset: '3px'
                            }}
                        >
                            Compare all plans in detail →
                        </button>
                    </div>
                </div>
            </div>

            {/* CSS keyframes */}
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes scaleIn {
                        from { transform: scale(0.95); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
};

export default UpgradeModal;
