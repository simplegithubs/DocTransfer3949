import React, { useEffect, useState } from 'react';
import { PenTool, CheckCircle, Shield, Lock, Eye, BarChart3, FileText, Send, FolderLock, Smartphone, Droplets } from 'lucide-react';

interface HowToAnimationProps {
  slug: string;
}

type AnimType = 'esign' | 'protect' | 'analytics' | 'sharing';

const HowToAnimation: React.FC<HowToAnimationProps> = ({ slug }) => {
  const [animType, setAnimType] = useState<AnimType>('esign');

  useEffect(() => {
    const s = slug.toLowerCase();
    if (s.includes('restrict') || s.includes('watermark') || s.includes('password')) {
      setAnimType('protect');
    } else if (s.includes('track') || s.includes('read-time') || s.includes('pdf-open')) {
      setAnimType('analytics');
    } else if (s.includes('send') || s.includes('pitch-deck') || s.includes('data-room')) {
      setAnimType('sharing');
    } else {
      setAnimType('esign');
    }
  }, [slug]);

  const styles = `
    @keyframes htFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    @keyframes htPulse {
      0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px rgba(99,102,241,0.3)); }
      50% { transform: scale(1.08); filter: drop-shadow(0 0 12px rgba(99,102,241,0.6)); }
    }
    @keyframes htSignDraw {
      0% { width: 0; }
      100% { width: 70px; }
    }
    @keyframes htFadeUp {
      0% { transform: translateY(12px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes htBarFill {
      0% { width: 0; }
      100% { width: var(--bar-width); }
    }
    @keyframes htScanLine {
      0% { top: 10%; opacity: 0; }
      20% { opacity: 1; }
      80% { opacity: 1; }
      100% { top: 85%; opacity: 0; }
    }
    @keyframes htStream {
      0% { transform: translateX(-100%); opacity: 0; }
      50% { opacity: 1; }
      100% { transform: translateX(100%); opacity: 0; }
    }
    @keyframes htStepPop {
      0% { transform: scale(0.6); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    .ht-container {
      position: relative;
      width: 100%;
      height: 360px;
      background: radial-gradient(120% 120% at 50% 0%, #0f172a 0%, #020617 100%);
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
      margin-bottom: 3rem;
    }
    .ht-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
      background-size: 18px 18px;
      pointer-events: none;
    }
    .ht-glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(45px);
      pointer-events: none;
    }
    .ht-badge {
      position: absolute;
      top: 14px;
      left: 14px;
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.7);
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.6rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      display: flex;
      align-items: center;
      gap: 5px;
    }
  `;

  return (
    <div className="ht-container">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="ht-grid" />

      {animType === 'esign' && (
        <div className="ht-glow" style={{ width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', top: '5%', left: '20%' }} />
      )}
      {animType === 'protect' && (
        <div className="ht-glow" style={{ width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', top: '5%', right: '20%' }} />
      )}
      {animType === 'analytics' && (
        <div className="ht-glow" style={{ width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', top: '10%', left: '25%' }} />
      )}
      {animType === 'sharing' && (
        <div className="ht-glow" style={{ width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', top: '5%', left: '15%' }} />
      )}

      {animType === 'esign' && <ESignAnim />}
      {animType === 'protect' && <ProtectAnim />}
      {animType === 'analytics' && <AnalyticsAnim />}
      {animType === 'sharing' && <SharingAnim />}
    </div>
  );
};

/* ============================================================
   1. E-SIGNATURE STEP-BY-STEP ANIMATION
   ============================================================ */
const ESignAnim: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="ht-badge"><PenTool size={10} /> Step-by-Step Signing</div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
      {/* Document with signature */}
      <div style={{
        width: '140px', height: '180px',
        background: '#1e293b', borderRadius: '14px',
        border: '1.5px solid rgba(255,255,255,0.1)',
        padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px',
        animation: 'htFloat 4s ease-in-out infinite',
        position: 'relative',
        boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ width: '45px', height: '4px', background: '#4f46e5', borderRadius: '2px', opacity: 0.8 }} />
          <FileText size={12} style={{ color: '#6366f1' }} />
        </div>
        <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ width: '90%', height: '2px', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ width: '95%', height: '2px', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ width: '80%', height: '2px', background: 'rgba(255,255,255,0.07)' }} />

        {/* Signature area */}
        <div style={{
          flex: 1, marginTop: '10px', borderRadius: '8px',
          border: '1px dashed rgba(99,102,241,0.4)',
          background: 'rgba(99,102,241,0.03)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '6px',
        }}>
          <PenTool size={14} style={{ color: '#6366f1', opacity: 0.6 }} />
          <div style={{ height: '2px', background: 'linear-gradient(90deg, #4f46e5, #7c3aed)', borderRadius: '1px', animation: 'htSignDraw 2s ease-in-out infinite alternate' }} />
          <span style={{ fontSize: '7px', color: '#64748b', fontWeight: '600' }}>SIGN HERE</span>
        </div>

        {/* Signed badge */}
        <div style={{
          position: 'absolute', bottom: '-12px', right: '-12px',
          width: '28px', height: '28px', borderRadius: '50%',
          background: '#10b981', border: '2px solid #0f172a',
          display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white',
          animation: 'htPulse 2.5s infinite ease-in-out',
          boxShadow: '0 4px 12px rgba(16,185,129,0.4)',
        }}>
          <CheckCircle size={14} strokeWidth={2.5} />
        </div>
      </div>

      {/* Step indicators */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {['Upload Document', 'Place Signature Fields', 'Send & Track'].map((text, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            animation: `htStepPop 0.4s ease forwards`, animationDelay: `${0.3 + i * 0.25}s`, opacity: 0,
          }}>
            <div style={{
              width: '26px', height: '26px', borderRadius: '50%',
              background: i === 2 ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : '#1e293b',
              border: `1.5px solid ${i === 2 ? '#7c3aed' : 'rgba(255,255,255,0.1)'}`,
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              fontSize: '10px', fontWeight: '800', color: i === 2 ? 'white' : '#64748b',
            }}>{i + 1}</div>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ============================================================
   2. PDF PROTECTION ANIMATION
   ============================================================ */
const ProtectAnim: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="ht-badge"><Shield size={10} /> Document Protection</div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
      {/* Protected document */}
      <div style={{
        width: '130px', height: '170px',
        background: '#1e293b', borderRadius: '14px',
        border: '1.5px solid rgba(16,185,129,0.3)',
        padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px',
        animation: 'htFloat 4.5s ease-in-out infinite',
        position: 'relative',
        boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
      }}>
        <div style={{ width: '40px', height: '4px', background: '#10b981', borderRadius: '2px', opacity: 0.7, marginBottom: '4px' }} />
        <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ width: '85%', height: '2px', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ width: '92%', height: '2px', background: 'rgba(255,255,255,0.07)' }} />

        {/* Watermark overlay */}
        <div style={{
          position: 'absolute', inset: '10px', borderRadius: '8px',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          background: 'rgba(16, 185, 129, 0.03)',
          border: '1px solid rgba(16, 185, 129, 0.08)',
        }}>
          <span style={{ fontSize: '22px', fontWeight: '900', color: 'rgba(16,185,129,0.12)', transform: 'rotate(-30deg)', letterSpacing: '3px' }}>
            PROTECTED
          </span>
        </div>

        {/* Shield overlay badge */}
        <div style={{
          position: 'absolute', top: '-14px', right: '-14px',
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          border: '2px solid #0f172a',
          display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white',
          animation: 'htPulse 2s infinite ease-in-out',
          boxShadow: '0 4px 12px rgba(16,185,129,0.4)',
        }}>
          <Lock size={14} strokeWidth={2.5} />
        </div>
      </div>

      {/* Protection features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { icon: Lock, text: 'Password Locked' },
          { icon: Droplets, text: 'Watermark Applied' },
          { icon: Shield, text: 'Download Restricted' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px', padding: '8px 14px',
            animation: `htFadeUp 0.5s ease forwards`, animationDelay: `${0.3 + i * 0.2}s`, opacity: 0,
          }}>
            <item.icon size={12} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ============================================================
   3. ANALYTICS / TRACKING ANIMATION
   ============================================================ */
const AnalyticsAnim: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="ht-badge"><Eye size={10} /> Viewer Analytics</div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '35px' }}>
      {/* Document with scan line */}
      <div style={{
        width: '120px', height: '160px',
        background: '#1e293b', borderRadius: '14px',
        border: '1.5px solid rgba(6,182,212,0.3)',
        padding: '12px', display: 'flex', flexDirection: 'column', gap: '5px',
        animation: 'htFloat 4s ease-in-out infinite',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
      }}>
        <div style={{ width: '35px', height: '3px', background: '#06b6d4', borderRadius: '2px', opacity: 0.7, marginBottom: '4px' }} />
        {[100, 85, 90, 75, 95, 80].map((w, i) => (
          <div key={i} style={{ width: `${w}%`, height: '2px', background: 'rgba(255,255,255,0.06)' }} />
        ))}

        {/* Scan line */}
        <div style={{
          position: 'absolute', left: '8px', right: '8px', height: '2px',
          background: 'linear-gradient(90deg, transparent, #06b6d4, transparent)',
          animation: 'htScanLine 3s linear infinite',
          boxShadow: '0 0 8px rgba(6,182,212,0.5)',
        }} />

        {/* Eye badge */}
        <div style={{
          position: 'absolute', bottom: '-10px', right: '-10px',
          width: '26px', height: '26px', borderRadius: '50%',
          background: '#06b6d4', border: '2px solid #0f172a',
          display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white',
          animation: 'htPulse 2s infinite ease-in-out',
        }}>
          <Eye size={12} strokeWidth={2.5} />
        </div>
      </div>

      {/* Analytics dashboard */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '170px' }}>
        <div style={{ fontSize: '10px', fontWeight: '800', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '4px', letterSpacing: '0.05em' }}>
          PAGE READ TIMES
        </div>
        {[
          { page: 'Page 1', time: '2m 15s', pct: 85 },
          { page: 'Page 2', time: '4m 30s', pct: 100 },
          { page: 'Page 3', time: '0m 45s', pct: 30 },
          { page: 'Page 4', time: '3m 10s', pct: 75 },
        ].map((item, i) => (
          <div key={i} style={{ animation: `htFadeUp 0.5s ease forwards`, animationDelay: `${0.3 + i * 0.15}s`, opacity: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginBottom: '3px' }}>
              <span>{item.page}</span>
              <span style={{ color: '#06b6d4', fontWeight: '700' }}>{item.time}</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '2px',
                background: `linear-gradient(90deg, #06b6d4, ${item.pct > 70 ? '#10b981' : '#f59e0b'})`,
                // @ts-ignore
                '--bar-width': `${item.pct}%`,
                animation: 'htBarFill 1.5s ease forwards',
                animationDelay: `${0.5 + i * 0.2}s`,
                width: 0,
              } as React.CSSProperties} />
            </div>
          </div>
        ))}

        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px',
          fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace',
        }}>
          <BarChart3 size={10} style={{ color: '#06b6d4' }} />
          LIVE TRACKING ACTIVE
        </div>
      </div>
    </div>
  </div>
);

/* ============================================================
   4. SHARING / DATA ROOM ANIMATION
   ============================================================ */
const SharingAnim: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="ht-badge"><Send size={10} /> Secure Sharing</div>

    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      {/* Vault / Data Room Visual */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
        {/* Files flowing in */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {['Pitch Deck.pdf', 'Financials.xlsx', 'Term Sheet.pdf'].map((name, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', padding: '6px 10px',
              animation: `htFadeUp 0.4s ease forwards`, animationDelay: `${0.2 + i * 0.2}s`, opacity: 0,
            }}>
              <FileText size={10} style={{ color: '#8b5cf6' }} />
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>{name}</span>
            </div>
          ))}
        </div>

        {/* Arrow stream */}
        <div style={{ position: 'relative', width: '60px', height: '3px', background: '#1e293b', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', width: '25px', height: '100%',
            background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)',
            animation: 'htStream 1.5s linear infinite',
          }} />
        </div>

        {/* Data Room vault */}
        <div style={{
          width: '90px', height: '100px',
          background: '#1e293b', borderRadius: '16px',
          border: '2px solid rgba(139,92,246,0.4)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '6px',
          animation: 'htFloat 4s ease-in-out infinite',
          boxShadow: '0 10px 30px rgba(139,92,246,0.1)',
          position: 'relative',
        }}>
          <FolderLock size={24} style={{ color: '#8b5cf6' }} />
          <span style={{ fontSize: '7px', fontWeight: '800', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>DATA ROOM</span>

          <div style={{
            position: 'absolute', top: '-10px', right: '-10px',
            width: '24px', height: '24px', borderRadius: '50%',
            background: '#10b981', border: '2px solid #0f172a',
            display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white',
            animation: 'htPulse 2s infinite ease-in-out',
          }}>
            <CheckCircle size={12} strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* Status badges */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { icon: Lock, text: 'E2E Encrypted' },
          { icon: Eye, text: 'View Tracking' },
          { icon: Shield, text: 'Access Control' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px', padding: '5px 10px',
            animation: `htFadeUp 0.5s ease forwards`, animationDelay: `${0.5 + i * 0.15}s`, opacity: 0,
          }}>
            <item.icon size={10} style={{ color: '#8b5cf6' }} />
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default HowToAnimation;
