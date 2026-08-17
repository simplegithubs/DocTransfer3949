import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
    User as UserIcon, 
    LogOut, 
    Settings, 
    LayoutDashboard, 
    CreditCard, 
    Shield, 
    ChevronDown 
} from 'lucide-react';

interface UserButtonProps {
    afterSignOutUrl?: string;
    appearance?: any; // Compatibility prop
}

export const UserButton: React.FC<UserButtonProps> = ({ afterSignOutUrl = '/' }) => {
    const { user, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (!user) return null;

    const initials = (user.fullName || user.email || 'U')
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const handleSignOut = async () => {
        setIsOpen(false);
        await signOut();
        navigate(afterSignOutUrl);
    };

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'transparent',
                    border: 'none',
                    padding: '0.25rem',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'opacity 0.2s ease'
                }}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                {user.imageUrl ? (
                    <img
                        src={user.imageUrl}
                        alt={user.fullName || 'User'}
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid #e2e8f0',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.08)'
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
                        }}
                    >
                        {initials}
                    </div>
                )}
                <ChevronDown size={14} color="#64748b" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 'calc(100% + 8px)',
                        width: '240px',
                        background: '#ffffff',
                        borderRadius: '16px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e2e8f0',
                        overflow: 'hidden',
                        zIndex: 1000,
                        animation: 'fadeIn 0.15s ease-out'
                    }}
                >
                    {/* User Info Header */}
                    <div style={{
                        padding: '1rem',
                        borderBottom: '1px solid #f1f5f9',
                        background: '#f8fafc'
                    }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user.fullName || 'User'}
                        </p>
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user.email}
                        </p>
                    </div>

                    {/* Navigation Items */}
                    <div style={{ padding: '0.5rem' }}>
                        <Link
                            to="/dataroom"
                            onClick={() => setIsOpen(false)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.65rem 0.75rem',
                                borderRadius: '10px',
                                textDecoration: 'none',
                                color: '#334155',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <LayoutDashboard size={16} color="#6366f1" />
                            <span>Dashboard</span>
                        </Link>

                        <Link
                            to="/settings"
                            onClick={() => setIsOpen(false)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.65rem 0.75rem',
                                borderRadius: '10px',
                                textDecoration: 'none',
                                color: '#334155',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <Settings size={16} color="#64748b" />
                            <span>Settings & Branding</span>
                        </Link>

                        <Link
                            to="/pricing"
                            onClick={() => setIsOpen(false)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.65rem 0.75rem',
                                borderRadius: '10px',
                                textDecoration: 'none',
                                color: '#334155',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <CreditCard size={16} color="#10b981" />
                            <span>Subscription Plans</span>
                        </Link>
                    </div>

                    {/* Divider & Sign Out */}
                    <div style={{ padding: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                        <button
                            type="button"
                            onClick={handleSignOut}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.65rem 0.75rem',
                                borderRadius: '10px',
                                border: 'none',
                                background: 'transparent',
                                color: '#dc2626',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <LogOut size={16} color="#dc2626" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
