import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
    X, 
    Mail, 
    Lock, 
    User as UserIcon, 
    Eye, 
    EyeOff, 
    ArrowRight, 
    Loader2, 
    CheckCircle2, 
    AlertCircle, 
    ShieldCheck, 
    Sparkles 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../Logo';

export const AuthModal: React.FC = () => {
    const { 
        isAuthModalOpen, 
        authModalView, 
        closeAuthModal, 
        openAuthModal, 
        signInWithPassword, 
        signUp, 
        signInWithOAuth, 
        resetPassword 
    } = useAuth();
    
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [oauthLoading, setOauthLoading] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthModalOpen) {
            setErrorMessage(null);
            setSuccessMessage(null);
        }
    }, [isAuthModalOpen, authModalView]);

    // Handle Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isAuthModalOpen) {
                closeAuthModal();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isAuthModalOpen]);

    if (!isAuthModalOpen) return null;

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);
        setLoading(true);

        try {
            const { error } = await signInWithPassword(email.trim(), password);
            if (error) {
                setErrorMessage(error.message);
            } else {
                closeAuthModal();
                navigate('/dataroom');
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'An unexpected error occurred during sign in.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await signUp(email.trim(), password, {
                full_name: fullName.trim() || undefined
            });

            if (error) {
                setErrorMessage(error.message);
            } else {
                if (data?.session) {
                    closeAuthModal();
                    navigate('/dataroom');
                } else {
                    setSuccessMessage('Account created! Please check your email to confirm.');
                }
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'An unexpected error occurred during sign up.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);
        setLoading(true);

        try {
            const { error } = await resetPassword(email.trim());
            if (error) {
                setErrorMessage(error.message);
            } else {
                setSuccessMessage('Password reset link sent to your email.');
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setErrorMessage(null);
        setOauthLoading('google');
        try {
            const { error } = await signInWithOAuth('google');
            if (error) {
                setErrorMessage(error.message);
                setOauthLoading(null);
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'Google authentication failed.');
            setOauthLoading(null);
        }
    };

    return (
        <div 
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.55)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                zIndex: 9999
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) closeAuthModal();
            }}
        >
            <div 
                style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '22px',
                    width: '100%',
                    maxWidth: '390px',
                    boxShadow: '0 20px 50px -10px rgba(99, 102, 241, 0.22), 0 10px 25px -5px rgba(15, 23, 42, 0.08)',
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    overflow: 'hidden',
                    position: 'relative',
                    padding: '1.5rem'
                }}
            >
                {/* Close Button */}
                <button
                    onClick={closeAuthModal}
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
                    aria-label="Close modal"
                >
                    <X size={20} strokeWidth={2.5} />
                </button>

                {/* Compact Header */}
                <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.6rem' }}>
                        <Logo size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                        {authModalView === 'sign-in' && 'Welcome Back'}
                        {authModalView === 'sign-up' && 'Create Account'}
                        {authModalView === 'forgot-password' && 'Reset Password'}
                    </h2>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.825rem', color: '#64748b' }}>
                        {authModalView === 'sign-in' && 'Sign in to access your secure dataroom'}
                        {authModalView === 'sign-up' && 'Start sharing encrypted files with analytics'}
                        {authModalView === 'forgot-password' && 'Enter your email for password recovery'}
                    </p>
                </div>

                {/* Pill-Style Segmented Tab Switcher */}
                {authModalView !== 'forgot-password' && (
                    <div style={{
                        display: 'flex',
                        background: '#f1f5f9',
                        borderRadius: '12px',
                        padding: '3px',
                        marginBottom: '1.25rem'
                    }}>
                        <button
                            type="button"
                            onClick={() => openAuthModal('sign-in')}
                            style={{
                                flex: 1,
                                height: '34px',
                                borderRadius: '9px',
                                border: 'none',
                                background: authModalView === 'sign-in' ? '#ffffff' : 'transparent',
                                color: authModalView === 'sign-in' ? '#4f46e5' : '#64748b',
                                fontWeight: authModalView === 'sign-in' ? 700 : 500,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                boxShadow: authModalView === 'sign-in' ? '0 2px 6px rgba(0, 0, 0, 0.06)' : 'none',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => openAuthModal('sign-up')}
                            style={{
                                flex: 1,
                                height: '34px',
                                borderRadius: '9px',
                                border: 'none',
                                background: authModalView === 'sign-up' ? '#ffffff' : 'transparent',
                                color: authModalView === 'sign-up' ? '#4f46e5' : '#64748b',
                                fontWeight: authModalView === 'sign-up' ? 700 : 500,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                boxShadow: authModalView === 'sign-up' ? '0 2px 6px rgba(0, 0, 0, 0.06)' : 'none',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            Sign Up
                        </button>
                    </div>
                )}

                {/* Alerts */}
                {errorMessage && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '10px',
                        padding: '0.65rem 0.85rem',
                        marginBottom: '1rem',
                        color: '#991b1b',
                        fontSize: '0.8rem',
                        lineHeight: '1.4'
                    }}>
                        <AlertCircle size={16} style={{ flexShrink: 0 }} />
                        <div>{errorMessage}</div>
                    </div>
                )}

                {successMessage && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '10px',
                        padding: '0.65rem 0.85rem',
                        marginBottom: '1rem',
                        color: '#166534',
                        fontSize: '0.8rem',
                        lineHeight: '1.4'
                    }}>
                        <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                        <div>{successMessage}</div>
                    </div>
                )}

                {/* Google OAuth Button */}
                {authModalView !== 'forgot-password' && (
                    <>
                        <button
                            type="button"
                            onClick={handleGoogleAuth}
                            disabled={loading || oauthLoading !== null}
                            style={{
                                width: '100%',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.6rem',
                                borderRadius: '10px',
                                border: '1px solid #cbd5e1',
                                background: '#ffffff',
                                color: '#334155',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8fafc';
                                e.currentTarget.style.borderColor = '#94a3b8';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#ffffff';
                                e.currentTarget.style.borderColor = '#cbd5e1';
                            }}
                        >
                            {oauthLoading === 'google' ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                    />
                                </svg>
                            )}
                            <span>Continue with Google</span>
                        </button>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            margin: '0.85rem 0',
                            color: '#94a3b8',
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                            <span style={{ padding: '0 0.5rem' }}>or email</span>
                            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                        </div>
                    </>
                )}

                {/* Form Forms */}
                {authModalView === 'sign-in' && (
                    <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    style={{
                                        width: '100%',
                                        height: '42px',
                                        padding: '0 0.75rem 0 2.3rem',
                                        borderRadius: '10px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.875rem',
                                        color: '#1e293b',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        transition: 'all 0.15s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#6366f1';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#cbd5e1';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    style={{
                                        width: '100%',
                                        height: '42px',
                                        padding: '0 2.3rem 0 2.3rem',
                                        borderRadius: '10px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.875rem',
                                        color: '#1e293b',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        transition: 'all 0.15s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#6366f1';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#cbd5e1';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        color: '#94a3b8',
                                        cursor: 'pointer'
                                    }}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <div style={{ textAlign: 'right', marginTop: '0.35rem' }}>
                                <button
                                    type="button"
                                    onClick={() => openAuthModal('forgot-password')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        fontSize: '0.775rem',
                                        fontWeight: 600,
                                        color: '#6366f1',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Forgot password?
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: '0.25rem',
                                height: '42px',
                                borderRadius: '10px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                color: 'white',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem',
                                transition: 'all 0.15s ease',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
                        </button>
                    </form>
                )}

                {authModalView === 'sign-up' && (
                    <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div>
                            <div style={{ position: 'relative' }}>
                                <UserIcon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Full Name"
                                    style={{
                                        width: '100%',
                                        height: '42px',
                                        padding: '0 0.75rem 0 2.3rem',
                                        borderRadius: '10px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.875rem',
                                        color: '#1e293b',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        transition: 'all 0.15s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#6366f1';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#cbd5e1';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    style={{
                                        width: '100%',
                                        height: '42px',
                                        padding: '0 0.75rem 0 2.3rem',
                                        borderRadius: '10px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.875rem',
                                        color: '#1e293b',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        transition: 'all 0.15s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#6366f1';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#cbd5e1';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password (min 6 chars)"
                                    style={{
                                        width: '100%',
                                        height: '42px',
                                        padding: '0 2.3rem 0 2.3rem',
                                        borderRadius: '10px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.875rem',
                                        color: '#1e293b',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        transition: 'all 0.15s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#6366f1';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#cbd5e1';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        color: '#94a3b8',
                                        cursor: 'pointer'
                                    }}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: '0.25rem',
                                height: '42px',
                                borderRadius: '10px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                color: 'white',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem',
                                transition: 'all 0.15s ease',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <>Create Account <Sparkles size={16} /></>}
                        </button>
                    </form>
                )}

                {authModalView === 'forgot-password' && (
                    <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        <div>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your registered email"
                                    style={{
                                        width: '100%',
                                        height: '42px',
                                        padding: '0 0.75rem 0 2.3rem',
                                        borderRadius: '10px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.875rem',
                                        color: '#1e293b',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        transition: 'all 0.15s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#6366f1';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#cbd5e1';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                height: '42px',
                                borderRadius: '10px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                color: 'white',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem'
                            }}
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Send Recovery Link'}
                        </button>

                        <button
                            type="button"
                            onClick={() => openAuthModal('sign-in')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#6366f1',
                                fontSize: '0.825rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textAlign: 'center',
                                marginTop: '0.1rem'
                            }}
                        >
                            ← Back to Sign In
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
