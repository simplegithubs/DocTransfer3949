import React, { useEffect, useState } from 'react';
import { Shield, Lock, Eye, Check, Activity, Award } from 'lucide-react';

interface AlternativeAnimationProps {
  slug: string;
}

const AlternativeAnimation: React.FC<AlternativeAnimationProps> = ({ slug }) => {
  const [animationType, setAnimationType] = useState<'signature' | 'analytics' | 'encryption'>('signature');

  useEffect(() => {
    const slugLower = slug.toLowerCase();
    if (
      slugLower.includes('docsend') ||
      slugLower.includes('proposal') ||
      slugLower.includes('pandadoc')
    ) {
      setAnimationType('analytics');
    } else if (
      slugLower.includes('encrypt') ||
      slugLower.includes('virtual-data-room') ||
      slugLower.includes('vdr')
    ) {
      setAnimationType('encryption');
    } else {
      setAnimationType('signature');
    }
  }, [slug]);

  // CSS Styles for Keyframes and Interactive Effects
  const animationStyles = `
    @keyframes drawPath {
      to {
        stroke-dashoffset: 0;
      }
    }
    @keyframes pulseGlow {
      0%, 100% {
        opacity: 0.2;
        transform: scale(1);
      }
      50% {
        opacity: 0.4;
        transform: scale(1.05);
      }
    }
    @keyframes stampIn {
      0% {
        transform: scale(3) rotate(-15deg);
        opacity: 0;
      }
      70% {
        transform: scale(0.9) rotate(-8deg);
        opacity: 0.9;
      }
      100% {
        transform: scale(1) rotate(-10deg);
        opacity: 1;
      }
    }
    @keyframes slideBar {
      0% {
        width: 0%;
      }
      100% {
        width: var(--target-width);
      }
    }
    @keyframes eyeScan {
      0%, 100% {
        transform: translateY(-5px);
      }
      50% {
        transform: translateY(5px);
      }
    }
    @keyframes lockRotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    @keyframes shieldPulse {
      0%, 100% {
        transform: scale(1);
        filter: drop-shadow(0 0 5px rgba(99, 102, 241, 0.4));
      }
      50% {
        transform: scale(1.03);
        filter: drop-shadow(0 0 15px rgba(99, 102, 241, 0.8));
      }
    }
    @keyframes floatElement {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-8px);
      }
    }
    @keyframes signalPulse {
      0% {
        r: 4px;
        opacity: 1;
      }
      100% {
        r: 16px;
        opacity: 0;
      }
    }
    @keyframes codeRain {
      0% {
        stroke-dashoffset: 200;
      }
      100% {
        stroke-dashoffset: 0;
      }
    }
    .anim-container {
      position: relative;
      width: 100%;
      height: 380px;
      background: radial-gradient(120% 120% at 50% 0%, #0f172a 0%, #020617 100%);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 3rem;
    }
    .anim-grid {
      position: absolute;
      inset: 0;
      background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 20px 20px;
      background-position: center;
      pointer-events: none;
    }
    .anim-glow {
      position: absolute;
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%);
      filter: blur(40px);
      pointer-events: none;
      animation: pulseGlow 6s infinite ease-in-out;
    }
    .anim-glow-alt {
      position: absolute;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, rgba(236, 72, 153, 0) 70%);
      filter: blur(30px);
      pointer-events: none;
      animation: pulseGlow 8s infinite ease-in-out;
      animation-delay: -2s;
    }
    .interactive-badge {
      position: absolute;
      bottom: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.07);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: rgba(255, 255, 255, 0.85);
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .interactive-badge-left {
      position: absolute;
      top: 20px;
      left: 20px;
      background: rgba(99, 102, 241, 0.2);
      border: 1px solid rgba(99, 102, 241, 0.4);
      color: #a5b4fc;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  `;

  return (
    <div className="anim-container">
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <div className="anim-grid" />
      <div className="anim-glow" style={{ top: '10%', left: '15%' }} />
      <div className="anim-glow-alt" style={{ bottom: '10%', right: '15%' }} />

      {/* RENDER ANIMATION BASED ON TYPE */}
      {animationType === 'signature' && <SignatureAnimationComponent />}
      {animationType === 'analytics' && <AnalyticsAnimationComponent />}
      {animationType === 'encryption' && <EncryptionAnimationComponent />}
    </div>
  );
};

/* ============================================================
   1. SIGNATURE / CONTRACT ANIMATION COMPONENT
   ============================================================ */
const SignatureAnimationComponent: React.FC = () => {
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setResetKey((prev) => prev + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div key={resetKey} style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="interactive-badge-left">Secure E-Sign</div>
      <div className="interactive-badge"><Award size={14} className="text-indigo-400" /> ESIGN & eIDAS Compliant</div>

      <div style={{ animation: 'floatElement 4s infinite ease-in-out', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Document SVG */}
        <svg width="240" height="220" viewBox="0 0 240 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Back Shadow Sheet */}
          <rect x="50" y="25" width="140" height="170" rx="16" fill="rgba(99, 102, 241, 0.05)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          
          {/* Main Sheet */}
          <rect x="40" y="15" width="140" height="170" rx="16" fill="#1e293b" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          
          {/* Document Lines */}
          <rect x="60" y="40" width="100" height="6" rx="3" fill="rgba(255, 255, 255, 0.3)" />
          <rect x="60" y="56" width="70" height="6" rx="3" fill="rgba(255, 255, 255, 0.3)" />
          <rect x="60" y="72" width="100" height="4" rx="2" fill="rgba(255, 255, 255, 0.15)" />
          <rect x="60" y="84" width="85" height="4" rx="2" fill="rgba(255, 255, 255, 0.15)" />
          <rect x="60" y="96" width="95" height="4" rx="2" fill="rgba(255, 255, 255, 0.15)" />

          {/* Agreement Boxes */}
          <rect x="60" y="115" width="16" height="16" rx="4" fill="rgba(16, 185, 129, 0.1)" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1" />
          <path d="M64 123L67 126L72 120" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="84" y="121" width="76" height="4" rx="2" fill="rgba(255, 255, 255, 0.2)" />

          {/* Signature Line */}
          <line x1="60" y1="155" x2="160" y2="155" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="60" y="148" fill="rgba(255, 255, 255, 0.4)" fontSize="8" fontWeight="bold">SIGN HERE</text>

          {/* E-Signature Path (Animated) */}
          <path
            d="M65 158 C 75 145, 80 142, 90 153 C 100 164, 110 145, 125 150 C 135 153, 140 142, 155 152"
            stroke="#6366f1"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="300"
            strokeDashoffset="300"
            style={{
              animation: 'drawPath 2.5s ease-out forwards',
              animationDelay: '0.8s'
            }}
          />

          {/* Floating Stylus/Pen */}
          <g 
            style={{
              transition: 'transform 0.1s ease',
              animation: 'drawPath 2.5s ease-out forwards',
              animationDelay: '0.8s'
            }}
          >
            <path
              d="M145 125L152 148L158 142L185 115C188 112 188 107 185 104L180 99C177 96 172 96 169 99L145 125Z"
              fill="url(#pen-grad)"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.5"
              style={{
                transformOrigin: '152px 148px',
                animation: 'drawPath 2.5s ease-out forwards',
                opacity: 0,
                animationDelay: '0.8s',
                animationName: 'penMove'
              }}
            />
          </g>

          <defs>
            <linearGradient id="pen-grad" x1="145" y1="125" x2="185" y2="99" gradientUnits="userSpaceOnUse">
              <stop stopColor="#818cf8" />
              <stop offset="1" stopColor="#c084fc" />
            </linearGradient>
          </defs>
        </svg>

        {/* Verification Shield Seal (Stamps down in corner) */}
        <div
          style={{
            position: 'absolute',
            top: '75px',
            right: '25px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            borderRadius: '50%',
            width: '64px',
            height: '64px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
            animation: 'stampIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
            animationDelay: '3.3s',
            opacity: 0,
            border: '2px solid rgba(255,255,255,0.4)',
          }}
        >
          <Shield size={24} strokeWidth={2} />
          <span style={{ fontSize: '8px', fontWeight: '800', marginTop: '2px', letterSpacing: '0.5px' }}>SECURED</span>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes penMove {
            0% {
              transform: translate(-90px, 15px) rotate(15deg);
              opacity: 0;
            }
            5% {
              opacity: 1;
            }
            15% {
              transform: translate(-75px, -5px) rotate(18deg);
            }
            30% {
              transform: translate(-55px, -10px) rotate(14deg);
            }
            45% {
              transform: translate(-40px, 3px) rotate(16deg);
            }
            60% {
              transform: translate(-25px, 12px) rotate(19deg);
            }
            75% {
              transform: translate(-10px, -2px) rotate(15deg);
            }
            90% {
              transform: translate(5px, 3px) rotate(12deg);
            }
            98% {
              transform: translate(12px, 8px) rotate(15deg);
              opacity: 1;
            }
            100% {
              transform: translate(25px, 0px) rotate(20deg);
              opacity: 0;
            }
          }
        ` }} />
      </div>
    </div>
  );
};

/* ============================================================
   2. ANALYTICS / PITCH DECK TRACKING ANIMATION COMPONENT
   ============================================================ */
const AnalyticsAnimationComponent: React.FC = () => {
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setResetKey((prev) => prev + 1);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div key={resetKey} style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="interactive-badge-left">Viewer Analytics</div>
      <div className="interactive-badge"><Eye size={14} className="text-indigo-400" /> Page-by-Page Tracking</div>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'center', width: '80%', maxWidth: '550px' }}>
        
        {/* Left Side: Document Deck View */}
        <div style={{ position: 'relative', flex: '1.1', height: '200px', background: '#1e293b', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', animation: 'floatElement 5s infinite ease-in-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
            </div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>pitch-deck-v2.pdf</div>
          </div>

          {/* Active slide view */}
          <div style={{ position: 'relative', flex: '1', background: '#0f172a', borderRadius: '8px', padding: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#818cf8', marginBottom: '4px' }}>FINANCIAL MODEL</div>
            <div style={{ width: '60%', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', marginBottom: '14px' }} />
            
            {/* Fake Graph */}
            <svg width="100%" height="50" viewBox="0 0 160 50">
              <path
                d="M 10 40 Q 40 10, 70 30 T 130 15 T 150 5"
                fill="none"
                stroke="url(#line-grad-2)"
                strokeWidth="2.5"
                strokeDasharray="200"
                strokeDashoffset="200"
                style={{ animation: 'drawPath 2s ease-out forwards', animationDelay: '0.5s' }}
              />
              <circle cx="130" cy="18" r="4" fill="#ec4899" style={{ opacity: 0, animation: 'stampIn 0.3s ease-out forwards', animationDelay: '2.5s' }} />
              <circle cx="130" cy="18" r="4" fill="none" stroke="#ec4899" strokeWidth="2" style={{ animation: 'signalPulse 1.5s infinite ease-out' }} />
              <defs>
                <linearGradient id="line-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>

            {/* Scanning Laser Line */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.8), transparent)',
              boxShadow: '0 0 10px rgba(99, 102, 241, 0.8)',
              animation: 'eyeScan 3s infinite ease-in-out'
            }} />
          </div>

          {/* Active Reader Tag */}
          <div style={{
            position: 'absolute',
            bottom: '22px',
            left: '22px',
            backgroundColor: '#ec4899',
            color: 'white',
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '9px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 4px 10px rgba(236, 72, 153, 0.3)',
            animation: 'stampIn 0.4s ease-out forwards',
            animationDelay: '2s',
            opacity: 0
          }}>
            <Activity size={10} /> VC Reading Now
          </div>
        </div>

        {/* Right Side: Page Analytics Dashboard Panel */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.5px' }}>AUDIENCE RETENTION</div>
          
          {/* Slide 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>
              <span>Page 1: Problem Slide</span>
              <span style={{ color: '#a5b4fc', fontWeight: 'bold' }}>45 seconds</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1, #818cf8)',
                borderRadius: '9999px',
                animation: 'slideBar 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                animationDelay: '1s',
                width: '0%',
                '--target-width': '75%'
              } as React.CSSProperties} />
            </div>
          </div>

          {/* Slide 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>
              <span>Page 2: Financial Model</span>
              <span style={{ color: '#ec4899', fontWeight: 'bold' }}>3m 45s (HOT! 🔥)</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #ec4899, #f43f5e)',
                borderRadius: '9999px',
                animation: 'slideBar 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                animationDelay: '1.3s',
                width: '0%',
                '--target-width': '95%'
              } as React.CSSProperties} />
            </div>
          </div>

          {/* Slide 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>
              <span>Page 3: Founder Team</span>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>12 seconds</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #10b981, #34d399)',
                borderRadius: '9999px',
                animation: 'slideBar 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                animationDelay: '1.6s',
                width: '0%',
                '--target-width': '25%'
              } as React.CSSProperties} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* ============================================================
   3. VAULT / ENCRYPTION / SECURITY ANIMATION COMPONENT
   ============================================================ */
const EncryptionAnimationComponent: React.FC = () => {
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setResetKey((prev) => prev + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div key={resetKey} style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="interactive-badge-left">Zero-Knowledge VDR</div>
      <div className="interactive-badge"><Lock size={14} className="text-indigo-400" /> AES-256 Client-Side E2EE</div>

      <div style={{ animation: 'floatElement 4s infinite ease-in-out', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
        
        {/* Animated Vault Shield */}
        <div style={{
          position: 'relative',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'rgba(30, 41, 59, 0.4)',
          border: '2px solid rgba(99, 102, 241, 0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          animation: 'shieldPulse 3s infinite ease-in-out',
        }}>
          {/* Outer rotating ring */}
          <div style={{
            position: 'absolute',
            inset: '10px',
            border: '2px dashed rgba(165, 180, 252, 0.2)',
            borderRadius: '50%',
            animation: 'lockRotate 20s linear infinite'
          }} />

          {/* Inner ring */}
          <div style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            border: '4px dotted rgba(236, 72, 153, 0.15)',
            borderRadius: '50%',
            animation: 'lockRotate 10s linear infinite reverse'
          }} />

          {/* Center Lock Core */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.5), inset 0 2px 4px rgba(255,255,255,0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            border: '2px solid rgba(255,255,255,0.2)'
          }}>
            <Lock size={32} className="text-white" style={{ animation: 'stampIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.2) forwards', animationDelay: '0.5s', opacity: 0 }} />
          </div>

          {/* Shield particles */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 180 180">
            <path
              d="M 90 10 A 80 80 0 0 1 170 90"
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="40 200"
              style={{ animation: 'lockRotate 8s linear infinite' }}
            />
            <path
              d="M 90 170 A 80 80 0 0 1 10 90"
              fill="none"
              stroke="#ec4899"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="40 200"
              style={{ animation: 'lockRotate 8s linear infinite reverse' }}
            />
          </svg>
        </div>

        {/* Encrypted status panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '10px', color: 'rgba(255,255,255,0.4)', background: 'rgba(30, 41, 59, 0.6)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(5px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 'bold' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            VAULT STATUS: ACTIVE
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#a5b4fc' }}>AES_256_GCM_OK</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ width: '80px', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '1.5px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '100%', background: '#10b981', animation: 'drawPath 2s infinite linear' }} />
            </div>
            <div style={{ width: '60px', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '1.5px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '100%', background: '#6366f1', animation: 'drawPath 1.5s infinite linear' }} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AlternativeAnimation;
