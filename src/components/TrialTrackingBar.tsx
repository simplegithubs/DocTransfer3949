import React from 'react';

interface TrialTrackingBarProps {
    currentUploads: number;
    maxUploads: number;
}

const TrialTrackingBar: React.FC<TrialTrackingBarProps> = ({ currentUploads, maxUploads }) => {
    const percentage = Math.min((currentUploads / maxUploads) * 100, 100);

    return (
        <div style={{ marginBottom: '1.5rem', marginTop: '0.5rem' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
            }}>
                <span style={{
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: '#0f172a' // Very dark slate color matching screenshot
                }}>
                    {currentUploads} / {maxUploads} documents every day
                </span>
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
                    background: '#0f172a', // Dark filled portion
                    borderRadius: '3px',
                    transition: 'width 0.3s ease'
                }} />
            </div>
        </div>
    );
};

export default TrialTrackingBar;
