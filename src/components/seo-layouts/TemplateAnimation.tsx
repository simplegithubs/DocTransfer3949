import React, { useEffect, useState } from 'react';
import { FileText, Key, CheckCircle2, Shield, Lock, Edit3, Send } from 'lucide-react';

interface TemplateAnimationProps {
  slug: string;
}

const TemplateAnimation: React.FC<TemplateAnimationProps> = ({ slug }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getThemeColor = () => {
    if (slug.includes('purchase') || slug.includes('deed') || slug.includes('agency')) return '#4f46e5'; // Indigo
    if (slug.includes('lease') || slug.includes('sublease') || slug.includes('rental')) return '#10b981'; // Emerald
    return '#8b5cf6'; // Violet
  };

  const getThemeGradient = () => {
    if (slug.includes('purchase') || slug.includes('deed') || slug.includes('agency')) {
      return 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)';
    }
    if (slug.includes('lease') || slug.includes('sublease') || slug.includes('rental')) {
      return 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)';
    }
    return 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)';
  };

  const themeColor = getThemeColor();
  const themeGradient = getThemeGradient();

  const styles = `
    @keyframes drawSignature {
      to {
        stroke-dashoffset: 0;
      }
    }
    @keyframes floatElement {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-8px) rotate(1deg); }
    }
    @keyframes pulseGlow {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.05); }
    }
    .anim-signature {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: drawSignature 2s ease-in-out forwards;
    }
  `;

  return (
    <div style={{
      width: '100%',
      minHeight: '280px',
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      borderRadius: '24px',
      border: '1px solid #e2e8f0',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 10px 30px -10px rgba(0,0,0,0.04)'
    }}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* Background Decorative Rings */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        border: `2px dashed ${themeColor}15`,
        pointerEvents: 'none'
      }} />

      {/* Main Interactive Stage */}
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        gap: '2rem',
        zIndex: 2,
        maxWidth: '500px',
        width: '100%'
      }}>
        {/* Step Indicators */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '1rem',
          borderRight: '1px solid #e2e8f0',
          paddingRight: '1.5rem'
        }}>
          {[
            { label: 'Fill Fields' },
            { label: 'E-Sign' },
            { label: 'Encrypt' },
            { label: 'Share' }
          ].map((item, idx) => {
            const isActive = step === idx;
            return (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                opacity: isActive ? 1 : 0.4,
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: isActive ? themeColor : '#f1f5f9',
                  color: isActive ? 'white' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isActive ? `0 4px 12px ${themeColor}30` : 'none',
                  fontSize: '0.8rem',
                  fontWeight: '800'
                }}>
                  {idx + 1}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: isActive ? '700' : '500', color: isActive ? '#0f172a' : '#64748b' }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Dynamic Animation Canvas */}
        <div style={{
          flex: 1,
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 20px -5px rgba(0,0,0,0.03)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          position: 'relative',
          minHeight: '220px',
          animation: 'floatElement 6s ease-in-out infinite'
        }}>
          {/* Header area of simulated contract */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: themeGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: themeColor }}>
              <FileText size={16} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#1e293b' }}>
                {slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>DocTransfer E-Sign Secure</div>
            </div>
          </div>

          {/* Interactive States based on Active Step */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem' }}>
            {step === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '600' }}>First Party Name</span>
                  <div style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: `1.5px solid ${themeColor}`,
                    background: '#f8fafc',
                    fontSize: '0.75rem',
                    color: '#0f172a',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: `0 0 10px ${themeColor}10`
                  }}>
                    <span>DocTransfer LLC</span>
                    <Edit3 size={12} color={themeColor} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '600' }}>Agreement Date</span>
                  <div style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1.5px solid #e2e8f0',
                    background: '#ffffff',
                    fontSize: '0.75rem',
                    color: '#94a3b8'
                  }}>
                    Select effective date...
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', height: '100%' }}>
                <div style={{
                  width: '100%',
                  height: '70px',
                  border: `2px dashed ${themeColor}`,
                  borderRadius: '12px',
                  background: `${themeColor}05`,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <svg width="120" height="40" style={{ position: 'absolute' }}>
                    <path
                      d="M 10 30 Q 30 10, 60 25 T 110 15"
                      fill="none"
                      stroke={themeColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="anim-signature"
                    />
                  </svg>
                  <span style={{
                    position: 'absolute',
                    bottom: '4px',
                    right: '8px',
                    fontSize: '0.55rem',
                    color: themeColor,
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Draw to Sign
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '500' }}>Touchscreen E-Signature Active</span>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', height: '100%' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                  position: 'relative'
                }}>
                  <Shield size={24} />
                  <div style={{
                    position: 'absolute',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    border: '2px solid #10b981',
                    animation: 'pulseGlow 2s ease-in-out infinite'
                  }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0f172a' }}>AES-256 Encrypted</span>
                <span style={{ fontSize: '0.65rem', color: '#64748b', textAlign: 'center' }}>Client-Side Zero-Knowledge Keys Applied</span>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', height: '100%' }}>
                <div style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#166534' }}>Audit Trail Sealed</span>
                    <span style={{ fontSize: '0.55rem', color: '#15803d' }}>Signed by all parties successfully</span>
                  </div>
                </div>
                <div style={{
                  width: '100%',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: themeColor,
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  textAlign: 'center',
                  boxShadow: `0 4px 10px ${themeColor}30`
                }}>
                  Link Generated & Shared
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateAnimation;
