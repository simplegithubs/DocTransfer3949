import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface SignInButtonProps {
    mode?: 'modal' | 'redirect';
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
}

export const SignInButton: React.FC<SignInButtonProps> = ({ children, style, className }) => {
    const { openAuthModal } = useAuth();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        openAuthModal('sign-in');
    };

    if (React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            onClick: (e: React.MouseEvent) => {
                const childOnClick = (children as React.ReactElement<any>).props.onClick;
                if (childOnClick) childOnClick(e);
                handleClick(e);
            }
        });
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className={className}
            style={style || {
                padding: '0.65rem 1.25rem',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.2s ease'
            }}
        >
            {children || 'Sign In'}
        </button>
    );
};

export const SignUpButton: React.FC<SignInButtonProps> = ({ children, style, className }) => {
    const { openAuthModal } = useAuth();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        openAuthModal('sign-up');
    };

    if (React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            onClick: (e: React.MouseEvent) => {
                const childOnClick = (children as React.ReactElement<any>).props.onClick;
                if (childOnClick) childOnClick(e);
                handleClick(e);
            }
        });
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className={className}
            style={style || {
                padding: '0.65rem 1.25rem',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.2s ease'
            }}
        >
            {children || 'Sign Up'}
        </button>
    );
};
