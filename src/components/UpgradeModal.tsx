import React from 'react';
import { X, Crown, Check, Zap, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    featureName?: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, featureName }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSelectPlan = (plan: 'standard' | 'business') => {
        onClose();
        navigate(`/checkout?plan=${plan}`);
    };

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
            padding: '2rem',
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(12px)',
            animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            fontFamily: "'Inter', sans-serif"
        }}
            onClick={onClose}
        >
            <div style={{
                background: 'white',
                borderRadius: '32px',
                width: '100%',
                maxWidth: '920px',
                boxShadow: '0 30px 70px -10px rgba(15, 23, 42, 0.3), 0 0 0 1px rgba(15, 23, 42, 0.05)',
                position: 'relative',
                overflow: 'hidden',
                animation: 'scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                maxHeight: 'calc(100vh - 4rem)',
                display: 'flex',
                flexDirection: 'column'
            }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Visual Header Background Pattern */}
                <div style={{
                    position: 'absolute',
                    top: '-150px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '600px',
                    height: '250px',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0
                }}></div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1.5rem',
                        right: '1.5rem',
                        width: '40px',
                        height: '40px',
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
                    <X size={20} />
                </button>

                {/* Content Container (Scrollable if viewport is tiny) */}
                <div style={{ padding: '3.5rem 3rem 3rem 3rem', zIndex: 1, overflowY: 'auto' }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '64px',
                            height: '64px',
                            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                            borderRadius: '20px',
                            color: '#d97706',
                            marginBottom: '1.5rem',
                            boxShadow: '0 10px 20px -5px rgba(217, 119, 6, 0.2)'
                        }}>
                            <Crown size={32} fill="currentColor" strokeWidth={1.5} />
                        </div>
                        <h2 style={{
                            fontSize: '2.25rem',
                            fontWeight: 800,
                            color: '#0f172a',
                            marginBottom: '0.5rem',
                            letterSpacing: '-0.02em'
                        }}>
                            Upgrade to Premium
                        </h2>
                        <p style={{
                            color: '#64748b',
                            fontSize: '1.1rem',
                            maxWidth: '560px',
                            margin: '0 auto',
                            lineHeight: 1.5
                        }}>
                            {featureName ? (
                                <span>
                                    ✨ <strong style={{ color: '#4f46e5' }}>{featureName}</strong> is a premium feature. Upgrade to standard or business to unlock it instantly.
                                </span>
                            ) : (
                                "Unlock ultimate security, custom branding, unlimited transfers, and advanced compliance options."
                            )}
                        </p>
                    </div>

                    {/* Comparative Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                        gap: '2rem',
                        justifyContent: 'center'
                    }}>
                        {/* Standard Plan Card */}
                        <div style={{
                            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '24px',
                            padding: '2.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            position: 'relative'
                        }}
                            className="plan-card-hover"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px -15px rgba(59, 130, 246, 0.12)';
                                e.currentTarget.style.borderColor = '#93c5fd';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.borderColor = '#e2e8f0';
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    background: '#eff6ff',
                                    color: '#3b82f6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Zap size={22} fill="currentColor" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Standard</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>Best for growing professional needs</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>$25</span>
                                <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>/month</span>
                            </div>

                            {/* Features list */}
                            <div style={{ flex: 1, marginBottom: '2rem' }}>
                                {[
                                    'Unlimited Secure Transfers',
                                    'Up to 50MB file size limit',
                                    'Advanced Password Protection',
                                    'Time/View Link Expirations',
                                    'Require Email Verification',
                                    'Dynamic Forensic Watermarking',
                                    'Interactive E-Signatures (5/mo)'
                                ].map((feat, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                        <div style={{
                                            width: '18px',
                                            height: '18px',
                                            borderRadius: '50%',
                                            background: '#dcfce7',
                                            color: '#15803d',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        <span style={{ fontSize: '0.875rem', color: '#334155', fontWeight: 500 }}>{feat}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleSelectPlan('standard')}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: '14px',
                                    border: 'none',
                                    background: '#3b82f6',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 16px -4px rgba(59, 130, 246, 0.3)',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.08)'}
                                onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                            >
                                Get Standard Plan <Zap size={16} fill="currentColor" />
                            </button>
                        </div>

                        {/* Business Plan Card */}
                        <div style={{
                            background: 'linear-gradient(180deg, #ffffff 0%, #faf5ff 100%)',
                            border: '2px solid #a855f7',
                            borderRadius: '24px',
                            padding: '2.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            position: 'relative'
                        }}
                            className="plan-card-hover"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.boxShadow = '0 20px 45px -12px rgba(168, 85, 247, 0.18)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {/* POPULAR BADGE */}
                            <div style={{
                                position: 'absolute',
                                top: '1.25rem',
                                right: '1.25rem',
                                background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
                                color: 'white',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '100px',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                Best Value
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    background: '#faf5ff',
                                    color: '#a855f7',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Briefcase size={22} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Business</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>Ultimate security and branding suite</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>$39</span>
                                <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>/month</span>
                            </div>

                            {/* Features list */}
                            <div style={{ flex: 1, marginBottom: '2rem' }}>
                                {[
                                    'Everything in Standard, plus:',
                                    'Up to 500MB file size limit',
                                    'Full Custom Domain & Branding',
                                    'E2E Vault Encryption Mode',
                                    'SSO Integration Support',
                                    'Compliance-Ready Audit Trails',
                                    'Unlimited E-Signatures'
                                ].map((feat, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                        <div style={{
                                            width: '18px',
                                            height: '18px',
                                            borderRadius: '50%',
                                            background: '#f3e8ff',
                                            color: '#6b21a8',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        <span style={{
                                            fontSize: '0.875rem',
                                            color: '#334155',
                                            fontWeight: idx === 0 ? 700 : 500
                                        }}>{feat}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleSelectPlan('business')}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: '14px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 20px -4px rgba(168, 85, 247, 0.4)',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.08)'}
                                onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                            >
                                Get Business Plan <Briefcase size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Injected CSS keyframes */}
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
