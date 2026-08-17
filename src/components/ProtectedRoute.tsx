import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, Lock, ArrowRight, Loader2, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading, openAuthModal } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: '#f8fafc',
                gap: '0.75rem'
            }}>
                <Loader2 size={32} color="#6366f1" className="animate-spin" />
                <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>
                    Authenticating session...
                </p>
            </div>
        );
    }

    if (user) {
        return <>{children}</>;
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)',
            padding: '1.5rem'
        }}>
            <div style={{
                maxWidth: '390px',
                width: '100%',
                background: '#ffffff',
                borderRadius: '22px',
                padding: '2rem 1.75rem',
                boxShadow: '0 20px 50px -10px rgba(99, 102, 241, 0.18), 0 10px 25px -5px rgba(15, 23, 42, 0.06)',
                border: '1px solid #e2e8f0',
                textAlign: 'center',
                position: 'relative'
            }}>
                {/* Top Right Cross (Close) Button */}
                <button
                    onClick={() => navigate('/')}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        padding: '0.35rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#000000',
                        zIndex: 30,
                        transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.6';
                        e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                    aria-label="Return home"
                    title="Close and return home"
                >
                    <X size={20} strokeWidth={2.5} />
                </button>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <Logo size={36} />
                </div>

                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                    Authentication Required
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                    Please sign in to your DocTransfer account to view your secure dataroom and files.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <button
                        type="button"
                        onClick={() => openAuthModal('sign-in')}
                        style={{
                            width: '100%',
                            height: '42px',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        <span>Sign In</span>
                        <ArrowRight size={16} />
                    </button>

                    <button
                        type="button"
                        onClick={() => openAuthModal('sign-up')}
                        style={{
                            width: '100%',
                            height: '40px',
                            borderRadius: '10px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#334155',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        Create New Account
                    </button>

                    <Link
                        to="/"
                        style={{
                            marginTop: '0.35rem',
                            color: '#64748b',
                            fontSize: '0.825rem',
                            textDecoration: 'none',
                            fontWeight: 500
                        }}
                    >
                        ← Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProtectedRoute;
