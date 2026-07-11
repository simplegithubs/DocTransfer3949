import React, { useEffect, useState } from 'react';
import { Smartphone, PenTool, CheckCircle, FileText, Handshake, Shield, Lock, Link2, Zap, Layers } from 'lucide-react';

interface GenZAnimationProps {
  slug: string;
}

type AnimType = 'mobile' | 'creator' | 'freelance' | 'secure';

const GenZAnimation: React.FC<GenZAnimationProps> = ({ slug }) => {
  const [animType, setAnimType] = useState<AnimType>('secure');

  useEffect(() => {
    const s = slug.toLowerCase();
    if (s.includes('mobile') || s.includes('phone') || s.includes('brand-deal') || s.includes('no-account') || s.includes('pdf-signer')) {
      setAnimType('mobile');
    } else if (s.includes('creator') || s.includes('influencer') || s.includes('sponsor') || s.includes('nda')) {
      setAnimType('creator');
    } else if (s.includes('freelance') || s.includes('gig-worker') || s.includes('agreement-builder')) {
      setAnimType('freelance');
    } else {
      setAnimType('secure');
    }
  }, [slug]);

  const styles = `
    @keyframes gzFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    @keyframes gzPulse {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.1); opacity: 1; }
    }
    @keyframes gzSignDraw {
      0% { width: 0; }
      100% { width: 80px; }
    }
    @keyframes gzSlideUp {
      0% { transform: translateY(15px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes gzGlow {
      0%, 100% { box-shadow: 0 0 8px rgba(168, 85, 247, 0.3); }
      50% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.7); }
    }
    @keyframes gzStream {
      0% { transform: translateX(-100%); opacity: 0; }
      50% { opacity: 1; }
      100% { transform: translateX(100%); opacity: 0; }
    }
    @keyframes gzClauseStack {
      0% { transform: translateY(20px) scaleY(0.8); opacity: 0; }
      100% { transform: translateY(0) scaleY(1); opacity: 1; }
    }
    @keyframes gzLinkPulse {
      0%, 100% { letter-spacing: 0.05em; }
      50% { letter-spacing: 0.15em; }
    }
    .gz-container {
      position: relative;
      width: 100%;
      height: 360px;
      background: radial-gradient(ellipse 120% 100% at 50% 0%, #1a0a2e 0%, #090514 100%);
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #23153c;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
    }
    .gz-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(168, 85, 247, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(168, 85, 247, 0.03) 1px, transparent 1px);
      background-size: 18px 18px;
      pointer-events: none;
    }
    .gz-glow-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(50px);
      pointer-events: none;
    }
    .gz-badge {
      position: absolute;
      top: 14px;
      left: 14px;
      background: rgba(168, 85, 247, 0.1);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(168, 85, 247, 0.2);
      color: #d8b4fe;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.6rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      display: flex;
      align-items: center;
      gap: 5px;
    }
  `;

  return (
    <div className="gz-container">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="gz-grid" />

      {/* Glow orbs */}
      <div className="gz-glow-orb" style={{ width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)', top: '5%', left: '15%' }} />
      <div className="gz-glow-orb" style={{ width: '140px', height: '140px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)', bottom: '10%', right: '15%' }} />

      {animType === 'mobile' && <MobileSigningAnim />}
      {animType === 'creator' && <CreatorContractAnim />}
      {animType === 'freelance' && <FreelanceBuilderAnim />}
      {animType === 'secure' && <SecureSharingAnim />}
    </div>
  );
};

/* ============================================================
   1. MOBILE SIGNING ANIMATION
   ============================================================ */
const MobileSigningAnim: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="gz-badge"><Smartphone size={10} /> Mobile-First Signing</div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
      {/* Phone Mockup */}
      <div style={{
        width: '140px',
        height: '240px',
        background: '#120b24',
        borderRadius: '20px',
        border: '2px solid #3b2272',
        padding: '12px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        animation: 'gzFloat 4s ease-in-out infinite',
        position: 'relative',
        boxShadow: '0 15px 40px rgba(168, 85, 247, 0.15)',
      }}>
        {/* Notch */}
        <div style={{ width: '50px', height: '4px', background: '#23153c', borderRadius: '2px', margin: '0 auto 6px' }} />

        {/* Doc header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ width: '50px', height: '4px', background: '#a855f7', borderRadius: '2px', opacity: 0.7 }} />
          <FileText size={12} style={{ color: '#7c3aed' }} />
        </div>

        {/* Body lines */}
        <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '1px' }} />
        <div style={{ width: '90%', height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '1px' }} />
        <div style={{ width: '95%', height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '1px' }} />
        <div style={{ width: '85%', height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '1px' }} />

        {/* Signature area */}
        <div style={{
          flex: 1,
          marginTop: '8px',
          borderRadius: '10px',
          border: '1px dashed rgba(168, 85, 247, 0.4)',
          background: 'rgba(168, 85, 247, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '6px',
          padding: '8px',
        }}>
          <PenTool size={14} style={{ color: '#a855f7', opacity: 0.7 }} />
          {/* Animated signature line */}
          <div style={{
            height: '2px',
            background: 'linear-gradient(90deg, #a855f7, #ec4899)',
            borderRadius: '2px',
            animation: 'gzSignDraw 2s ease-in-out infinite alternate',
          }} />
          <span style={{ fontSize: '7px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Sign Here</span>
        </div>

        {/* Signed badge */}
        <div style={{
          position: 'absolute',
          bottom: '-14px',
          right: '-14px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #a855f7, #ec4899)',
          border: '2px solid #090514',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          animation: 'gzPulse 2s infinite ease-in-out',
          boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
        }}>
          <CheckCircle size={16} strokeWidth={2.5} />
        </div>
      </div>

      {/* Status Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {['Tap to Sign', 'No App Required', 'Works on Any Phone'].map((text, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(18, 11, 36, 0.8)', border: '1px solid #23153c',
            borderRadius: '10px', padding: '8px 14px',
            animation: `gzSlideUp 0.5s ease forwards`, animationDelay: `${0.2 + i * 0.2}s`, opacity: 0,
          }}>
            <CheckCircle size={12} style={{ color: '#a855f7' }} />
            <span style={{ fontSize: '0.75rem', color: '#d8b4fe', fontWeight: '600' }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ============================================================
   2. CREATOR CONTRACT ANIMATION
   ============================================================ */
const CreatorContractAnim: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="gz-badge"><Handshake size={10} /> Creator Deal Flow</div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
      {/* Two overlapping deal documents */}
      <div style={{ position: 'relative', width: '160px', height: '180px', animation: 'gzFloat 5s ease-in-out infinite' }}>
        {/* Brand doc */}
        <div style={{
          position: 'absolute', width: '100px', height: '130px',
          background: '#120b24', borderRadius: '12px',
          border: '1.5px solid #3b2272', padding: '10px',
          left: 0, top: 0, transform: 'rotate(-5deg)', zIndex: 1,
          boxShadow: '-4px 4px 15px rgba(0,0,0,0.3)',
        }}>
          <div style={{ width: '35px', height: '4px', background: '#a855f7', borderRadius: '2px', marginBottom: '8px' }} />
          <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.06)', marginBottom: '4px' }} />
          <div style={{ width: '80%', height: '2px', background: 'rgba(255,255,255,0.06)', marginBottom: '4px' }} />
          <div style={{ width: '90%', height: '2px', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', bottom: '8px', right: '8px', fontSize: '7px', color: '#64748b', fontWeight: '700' }}>BRAND</div>
        </div>

        {/* Creator doc */}
        <div style={{
          position: 'absolute', width: '100px', height: '130px',
          background: '#120b24', borderRadius: '12px',
          border: '1.5px solid rgba(236, 72, 153, 0.4)', padding: '10px',
          right: 0, bottom: 0, transform: 'rotate(5deg)', zIndex: 2,
          boxShadow: '4px 4px 15px rgba(0,0,0,0.3)',
        }}>
          <div style={{ width: '35px', height: '4px', background: '#ec4899', borderRadius: '2px', marginBottom: '8px' }} />
          <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.06)', marginBottom: '4px' }} />
          <div style={{ width: '85%', height: '2px', background: 'rgba(255,255,255,0.06)', marginBottom: '4px' }} />
          <div style={{ width: '95%', height: '2px', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', bottom: '8px', right: '8px', fontSize: '7px', color: '#64748b', fontWeight: '700' }}>CREATOR</div>
        </div>

        {/* Center handshake emblem */}
        <div style={{
          position: 'absolute', zIndex: 10,
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '44px', height: '44px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
          border: '2px solid #090514',
          display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white',
          animation: 'gzGlow 2s infinite ease-in-out',
        }}>
          <Handshake size={20} />
        </div>
      </div>

      {/* Deal terms streaming in */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '160px' }}>
        <div style={{ fontSize: '10px', fontWeight: '800', color: '#d8b4fe', textTransform: 'uppercase', borderBottom: '1px solid #23153c', paddingBottom: '4px', letterSpacing: '0.05em' }}>Deal Terms</div>
        {[
          { label: 'Deliverables', val: '3 Reels + 1 Story' },
          { label: 'Usage Rights', val: '6 Months' },
          { label: 'Payment', val: 'Net-30' },
          { label: 'NDA Status', val: 'Active' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '9px', color: 'rgba(255,255,255,0.5)',
            animation: `gzSlideUp 0.5s ease forwards`, animationDelay: `${0.3 + i * 0.15}s`, opacity: 0,
          }}>
            <span>{item.label}</span>
            <span style={{ color: '#ec4899', fontWeight: '700' }}>{item.val}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ============================================================
   3. FREELANCE / GIG WORKER BUILDER ANIMATION
   ============================================================ */
const FreelanceBuilderAnim: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="gz-badge"><Layers size={10} /> Contract Builder</div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '35px' }}>
      {/* Contract builder card */}
      <div style={{
        width: '160px', height: '220px',
        background: '#120b24', borderRadius: '16px',
        border: '1.5px solid #3b2272', padding: '14px',
        display: 'flex', flexDirection: 'column', gap: '6px',
        animation: 'gzFloat 4.5s ease-in-out infinite',
        position: 'relative',
        boxShadow: '0 15px 40px rgba(168, 85, 247, 0.1)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '9px', fontWeight: '800', color: '#a855f7', textTransform: 'uppercase' }}>Agreement</span>
          <Layers size={12} style={{ color: '#7c3aed' }} />
        </div>

        {/* Clauses stacking in */}
        {['Scope of Work', 'Payment Terms', 'IP Assignment', 'Termination', 'Confidentiality'].map((clause, i) => (
          <div key={i} style={{
            background: 'rgba(168, 85, 247, 0.06)',
            border: '1px solid rgba(168, 85, 247, 0.15)',
            borderRadius: '6px', padding: '5px 8px',
            fontSize: '8px', color: '#d8b4fe', fontWeight: '600',
            display: 'flex', alignItems: 'center', gap: '5px',
            animation: `gzClauseStack 0.4s ease forwards`, animationDelay: `${0.2 + i * 0.25}s`, opacity: 0,
          }}>
            <CheckCircle size={8} style={{ color: '#a855f7', flexShrink: 0 }} />
            {clause}
          </div>
        ))}

        {/* Verified seal */}
        <div style={{
          position: 'absolute', bottom: '-12px', right: '-12px',
          width: '30px', height: '30px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          border: '2px solid #090514',
          display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white',
          animation: 'gzPulse 2.5s infinite ease-in-out',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
        }}>
          <CheckCircle size={14} strokeWidth={2.5} />
        </div>
      </div>

      {/* Info stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {['Auto-fill Clauses', 'Legally Binding', 'Zero Cost'].map((text, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(18, 11, 36, 0.8)', border: '1px solid #23153c',
            borderRadius: '10px', padding: '8px 14px',
            animation: `gzSlideUp 0.5s ease forwards`, animationDelay: `${0.4 + i * 0.2}s`, opacity: 0,
          }}>
            <Zap size={12} style={{ color: '#a855f7' }} />
            <span style={{ fontSize: '0.75rem', color: '#d8b4fe', fontWeight: '600' }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ============================================================
   4. SECURE LINK SHARING ANIMATION
   ============================================================ */
const SecureSharingAnim: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="gz-badge"><Shield size={10} /> Encrypted Link Sharing</div>

    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      {/* Encrypted link bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        background: '#120b24', border: '1.5px solid #3b2272',
        borderRadius: '14px', padding: '12px 20px',
        animation: 'gzFloat 4s ease-in-out infinite',
        boxShadow: '0 10px 30px rgba(168, 85, 247, 0.1)',
      }}>
        <Lock size={16} style={{ color: '#a855f7' }} />
        <div style={{
          fontFamily: 'monospace', fontSize: '0.7rem',
          color: '#d8b4fe', letterSpacing: '0.02em',
          background: 'rgba(168, 85, 247, 0.06)',
          padding: '4px 10px', borderRadius: '6px',
          border: '1px solid rgba(168, 85, 247, 0.15)',
        }}>
          doctransfer.app/s/<span style={{ color: '#ec4899' }}>x7k9m2...</span>
        </div>
        <Link2 size={14} style={{ color: '#7c3aed' }} />
      </div>

      {/* Data stream visualization */}
      <div style={{ position: 'relative', width: '280px', height: '3px', background: '#23153c', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', width: '60px', height: '100%',
          background: 'linear-gradient(90deg, transparent, #a855f7, transparent)',
          animation: 'gzStream 2s linear infinite',
        }} />
      </div>

      {/* Feature row */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { icon: Lock, text: 'E2E Encrypted' },
          { icon: Shield, text: 'Zero-Knowledge' },
          { icon: CheckCircle, text: 'Link Copied ✓' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(18, 11, 36, 0.8)', border: '1px solid #23153c',
            borderRadius: '10px', padding: '6px 12px',
            animation: `gzSlideUp 0.5s ease forwards`, animationDelay: `${0.3 + i * 0.2}s`, opacity: 0,
          }}>
            <item.icon size={11} style={{ color: '#a855f7' }} />
            <span style={{ fontSize: '0.7rem', color: '#d8b4fe', fontWeight: '600' }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Bottom monospace status */}
      <div style={{
        fontFamily: 'monospace', fontSize: '0.6rem',
        color: 'rgba(168, 85, 247, 0.5)', textTransform: 'uppercase',
        animation: 'gzLinkPulse 3s ease-in-out infinite',
      }}>
        ENCRYPTED TRANSFER ACTIVE — NO SERVER KEYS
      </div>
    </div>
  </div>
);

export default GenZAnimation;
