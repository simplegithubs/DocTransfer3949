import React, { useState } from 'react';
import { useUser } from '../components/auth';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BrandingSettings from '../components/BrandingSettings';
import GSTBillingSettings from '../components/GSTBillingSettings';
import NotificationSettings from '../components/NotificationSettings';
import RERAComplianceSettings from '../components/RERAComplianceSettings';
import SLASettings from '../components/SLASettings';
import {
    ArrowLeft,
    Loader2,
    Palette,
    ShieldCheck,
    CreditCard,
    Bell,
    Scale,
    Lock,
    Sparkles,
    Building2,
    ArrowUpRight
} from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

type SettingsTab = 'branding' | 'billing' | 'notifications' | 'compliance' | 'sla';

const SettingsPage: React.FC = () => {
    const { user } = useUser();
    const { openAuthModal } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { subscription, isFeatureLocked } = useSubscription();

    const tabFromUrl = searchParams.get('tab') as SettingsTab | null;
    const validTabs: SettingsTab[] = ['branding', 'billing', 'notifications', 'compliance', 'sla'];
    const activeTab: SettingsTab = tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : 'branding';
    const setActiveTab = (tab: SettingsTab) => {
        setSearchParams({ tab });
    };

    const effectiveUserId = user?.id || 'agency_admin_local';

    const isSLALocked = isFeatureLocked('sla_guarantee');

    const menuItems = [
        { id: 'branding', label: 'White-Label & Agency', icon: Palette, badge: 'RERA Ready' },
        { id: 'billing', label: 'Billing & 18% GST', icon: CreditCard, badge: 'ITC Tax' },
        { id: 'notifications', label: 'WhatsApp & Lead Alerts', icon: Bell, badge: 'Instant' },
        { id: 'compliance', label: 'RERA & Legal Defaults', icon: Scale, badge: 'Sec 65B' },
        { id: 'sla', label: 'SLA & Uptime Guarantee', icon: ShieldCheck, locked: isSLALocked },
    ];

    const planType = subscription?.plan_type || 'free';
    const planNames: Record<string, string> = {
        free: 'Free Forever',
        pro: 'Pro Plan (₹499/mo)',
        standard: 'Pro Plan (₹499/mo)',
        business: 'Business Suite (₹1,349/mo)',
        dataroom: 'Virtual Data Room (₹3,749/mo)'
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <header style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid #e2e8f0',
                padding: '1rem 2rem',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={() => navigate('/dataroom')}
                            style={{
                                background: '#f1f5f9',
                                border: '1px solid #e2e8f0',
                                cursor: 'pointer',
                                padding: '0.45rem',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                color: '#334155',
                                transition: 'all 0.2s'
                            }}
                            title="Back to Deal Room"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Agency & Account Settings</h1>
                                <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: '800',
                                    background: '#ecfdf5',
                                    color: '#065f46',
                                    border: '1px solid #a7f3d0',
                                    padding: '0.15rem 0.55rem',
                                    borderRadius: '6px'
                                }}>
                                    🇮🇳 RERA & PropTech Suite
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button
                            onClick={() => navigate('/dataroom')}
                            style={{
                                padding: '0.45rem 1rem',
                                background: '#059669',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem'
                            }}
                        >
                            <Building2 size={14} /> Back to Deal Room
                        </button>
                    </div>
                </div>
            </header>

            {!user && (
                <div style={{
                    background: 'linear-gradient(90deg, #f0fdf4 0%, #eff6ff 100%)',
                    borderBottom: '1px solid #bbf7d0',
                    padding: '0.65rem 2rem',
                    fontSize: '0.85rem',
                    color: '#166534',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Sparkles size={16} color="#10b981" />
                        <span><strong>Real Estate Agency Workspace:</strong> Customizations save instantly to your browser. Sign in anytime to sync across all brokers on your team.</span>
                    </div>
                    <button
                        onClick={() => openAuthModal('sign-in')}
                        style={{
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.35rem 0.9rem',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                        }}
                    >
                        Sign In / Register
                    </button>
                </div>
            )}

            <main style={{ maxWidth: '1400px', margin: '2rem auto', padding: '0 1.5rem' }}>
                <div className="settings-grid-layout" style={{
                    display: 'grid',
                    gridTemplateColumns: '320px 1fr',
                    gap: '2rem',
                    alignItems: 'start'
                }}>
                    {/* Sidebar Navigation */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <nav style={{
                            background: 'white',
                            padding: '0.75rem',
                            borderRadius: '20px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.35rem'
                        }}>
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id as SettingsTab)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '12px',
                                        border: activeTab === item.id ? '1px solid #a7f3d0' : '1px solid transparent',
                                        background: activeTab === item.id ? '#ecfdf5' : 'transparent',
                                        color: activeTab === item.id ? '#065f46' : '#4b5563',
                                        fontWeight: activeTab === item.id ? 700 : 500,
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                        <item.icon size={18} color={activeTab === item.id ? '#059669' : '#9ca3af'} />
                                        <span>{item.label}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        {item.badge && (
                                            <span style={{
                                                fontSize: '0.68rem',
                                                fontWeight: 800,
                                                padding: '2px 7px',
                                                borderRadius: '6px',
                                                background: activeTab === item.id ? '#a7f3d0' : '#f3f4f6',
                                                color: activeTab === item.id ? '#064e3b' : '#6b7280'
                                            }}>
                                                {item.badge}
                                            </span>
                                        )}
                                        {item.locked && <Lock size={12} color="#9ca3af" />}
                                    </div>
                                </button>
                            ))}
                        </nav>

                        {/* Plan Summary Card */}
                        <div style={{
                            padding: '1.5rem',
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #064e3b 100%)',
                            borderRadius: '20px',
                            color: 'white',
                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
                            border: '1px solid #334155',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '120px',
                                height: '120px',
                                background: 'rgba(16, 185, 129, 0.12)',
                                borderRadius: '50%',
                                filter: 'blur(30px)'
                            }}></div>

                            <div style={{ position: 'relative', zIndex: 10 }}>
                                <span style={{
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: '#34d399',
                                    background: 'rgba(6, 78, 59, 0.8)',
                                    border: '1px solid #047857',
                                    padding: '2px 8px',
                                    borderRadius: '9999px',
                                    display: 'inline-block',
                                    marginBottom: '0.6rem'
                                }}>
                                    Subscription Status
                                </span>
                                <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white', margin: '0 0 0.35rem 0' }}>
                                    {planNames[planType] || 'Free Plan'}
                                </h3>
                                <p style={{ color: '#94a3b8', fontSize: '0.78rem', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                                    {planType === 'free'
                                        ? 'Upgrade to claim 18% GST ITC, WhatsApp open tracking, and custom broker watermarking.'
                                        : 'Includes 18% GST B2B tax invoice and unlimited client deal rooms.'}
                                </p>
                                <button
                                    onClick={() => navigate('/pricing')}
                                    style={{
                                        width: '100%',
                                        padding: '0.65rem',
                                        background: '#059669',
                                        border: 'none',
                                        borderRadius: '10px',
                                        color: 'white',
                                        fontSize: '0.8rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.4rem',
                                        boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Sparkles size={14} />
                                    {planType === 'free' ? 'Upgrade Plan' : 'Manage Plans'}
                                    <ArrowUpRight size={13} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div>
                        <div className="settings-content" style={{
                            background: 'white',
                            borderRadius: '24px',
                            minHeight: '650px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                            overflow: 'hidden'
                        }}>
                            {activeTab === 'branding' && <BrandingSettings userId={effectiveUserId} />}
                            {activeTab === 'billing' && <GSTBillingSettings />}
                            {activeTab === 'notifications' && <NotificationSettings />}
                            {activeTab === 'compliance' && <RERAComplianceSettings />}
                            {activeTab === 'sla' && <SLASettings />}
                        </div>
                    </div>
                </div>

                <style>{`
                    @media (max-width: 960px) {
                        .settings-grid-layout {
                            grid-template-columns: 1fr !important;
                        }
                    }
                `}</style>
            </main>
        </div>
    );
};

export default SettingsPage;
