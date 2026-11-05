import React from 'react';
import { Link } from 'react-router-dom';

interface TrialTrackingBarProps {
    currentUploads: number;
    maxUploads: number;
    label?: string;
    showUpgradeLink?: boolean;
}

const TrialTrackingBar: React.FC<TrialTrackingBarProps> = ({
    currentUploads,
    maxUploads,
    label,
    showUpgradeLink = true
}) => {
    const percentage = Math.min((currentUploads / Math.max(maxUploads, 1)) * 100, 100);
    const isAtLimit = currentUploads >= maxUploads;

    return (
        <div style={{ marginBottom: '1.5rem', marginTop: '0.5rem' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
            }}>
                <span style={{
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: isAtLimit ? '#dc2626' : '#0f172a'
                }}>
                    {currentUploads} / {maxUploads} {label || 'documents every day'}
                </span>
                {showUpgradeLink && (
                    <Link
                        to="/pricing"
                        style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: '#4f46e5',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        }}
                    >
                        Upgrade for 100 links/mo &rarr;
                    </Link>
                )}
            </div>
            
            {/* Minimalist Progress Bar */}
            <div style={{
                width: '100%',
                height: '6px',
                background: '#f1f5f9', // Light gray background
                borderRadius: '3px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: isAtLimit ? '#dc2626' : '#0f172a', // Red when at limit, dark otherwise
                    borderRadius: '3px',
                    transition: 'width 0.3s ease'
                }} />
            </div>
        </div>
    );
};

export default TrialTrackingBar;
