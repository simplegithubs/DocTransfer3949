import React, { useEffect, useState } from 'react';
import { Shield, Lock, BookOpen, UserCheck, Layers, GitMerge, FileText } from 'lucide-react';

interface BlogAnimationProps {
  slug: string;
  isCompact?: boolean;
}

const BlogAnimation: React.FC<BlogAnimationProps> = ({ slug, isCompact = false }) => {
  const [blogType, setBlogType] = useState<'ip' | 'nda' | 'subcontracting'>('ip');

  useEffect(() => {
    const slugLower = slug.toLowerCase();
    if (slugLower.includes('ip') || slugLower.includes('intellectual')) {
      setBlogType('ip');
    } else if (slugLower.includes('nda') || slugLower.includes('confidential')) {
      setBlogType('nda');
    } else if (slugLower.includes('subcontract')) {
      setBlogType('subcontracting');
    } else {
      setBlogType('ip');
    }
  }, [slug]);

  // CSS Keyframes and styling
  const animationStyles = `
    @keyframes floatDoc {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
      }
      50% {
        transform: translateY(-6px) rotate(1deg);
      }
    }
    @keyframes pulseShield {
      0%, 100% {
        transform: scale(1);
        filter: drop-shadow(0 0 5px rgba(6, 182, 212, 0.4));
        opacity: 0.8;
      }
      50% {
        transform: scale(1.08);
        filter: drop-shadow(0 0 15px rgba(6, 182, 212, 0.9));
        opacity: 1;
      }
    }
    @keyframes lineDraw {
      0% {
        stroke-dashoffset: 80;
      }
      100% {
        stroke-dashoffset: 0;
      }
    }
    @keyframes nodePulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 0 0 0px rgba(16, 185, 129, 0.4);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
      }
    }
    @keyframes pathFlow {
      0% {
        stroke-dashoffset: 40;
      }
      100% {
        stroke-dashoffset: 0;
      }
    }
    @keyframes lockEngage {
      0% {
        transform: translateY(-4px);
        opacity: 0.5;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
    @keyframes rotateGear {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    .blog-anim-container {
      position: relative;
      width: 100%;
      height: ${isCompact ? '200px' : '380px'};
      background: radial-gradient(120% 120% at 50% 0%, #0f172a 0%, #020617 100%);
      border-radius: ${isCompact ? '24px 24px 0 0' : '24px'};
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .blog-anim-grid {
      position: absolute;
      inset: 0;
      background-image: linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 16px 16px;
      background-position: center;
      pointer-events: none;
    }
    .blog-anim-glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(40px);
      pointer-events: none;
      opacity: 0.6;
    }
    .badge-top-left {
      position: absolute;
      top: 15px;
      left: 15px;
      background: rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.7);
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  `;

  return (
    <div className="blog-anim-container">
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <div className="blog-anim-grid" />

      {/* Dynamic Glow colors based on post category */}
      {blogType === 'ip' && (
        <div className="blog-anim-glow" style={{ width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(6, 182, 212, 0) 70%)', top: '10%', left: '20%' }} />
      )}
      {blogType === 'nda' && (
        <div className="blog-anim-glow" style={{ width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0) 70%)', top: '10%', left: '20%' }} />
      )}
      {blogType === 'subcontracting' && (
        <div className="blog-anim-glow" style={{ width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0) 70%)', top: '10%', left: '20%' }} />
      )}

      {/* RENDER TAILORED ANIMATION */}
      {blogType === 'ip' && <IPAnimationComponent isCompact={isCompact} />}
      {blogType === 'nda' && <NDAAnimationComponent isCompact={isCompact} />}
      {blogType === 'subcontracting' && <SubcontractingAnimationComponent isCompact={isCompact} />}
    </div>
  );
};

/* ============================================================
   1. IP PROTECTION ANIMATION COMPONENT
   ============================================================ */
const IPAnimationComponent: React.FC<{ isCompact: boolean }> = ({ isCompact }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {!isCompact && (
        <div className="badge-top-left">
          <Shield size={10} className="text-cyan-400" /> Intellectual Property Guard
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: isCompact ? '15px' : '40px', transform: isCompact ? 'scale(0.85)' : 'scale(1)' }}>
        {/* Document Sheet */}
        <div style={{
          width: '120px',
          height: '150px',
          background: '#1e293b',
          borderRadius: '12px',
          border: '1.5px solid rgba(255,255,255,0.12)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          animation: 'floatDoc 4s infinite ease-in-out',
          position: 'relative',
        }}>
          {/* Header Line */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ width: '40px', height: '5px', background: 'rgba(255,255,255,0.25)', borderRadius: '2px' }} />
            <div style={{ fontSize: '10px', color: '#06b6d4', fontWeight: 'bold', fontFamily: 'monospace' }}>© IP</div>
          </div>
          
          {/* Body Lines */}
          <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px' }} />
          <div style={{ width: '90%', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px' }} />
          <div style={{ width: '95%', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px' }} />
          
          {/* Copyright Shield Area */}
          <div style={{
            marginTop: '10px',
            flex: '1',
            borderRadius: '6px',
            background: 'rgba(6, 182, 212, 0.05)',
            border: '1px dashed rgba(6, 182, 212, 0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '28px',
            fontWeight: 'bold',
            color: 'rgba(6, 182, 212, 0.8)',
            fontFamily: 'serif'
          }}>
            ©
          </div>

          {/* Secure Seal checkmark */}
          <div style={{
            position: 'absolute',
            bottom: '-10px',
            right: '-10px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#06b6d4',
            border: '1.5px solid #1e293b',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            boxShadow: '0 4px 10px rgba(6, 182, 212, 0.4)',
            animation: 'pulseShield 2s infinite ease-in-out'
          }}>
            <UserCheck size={12} strokeWidth={3} />
          </div>
        </div>

        {/* Protection Parameter Stats (Hidden in compact) */}
        {!isCompact && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
              <Shield size={12} className="text-cyan-400" /> Pre-Existing IP Exclusions
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
              <Lock size={12} className="text-indigo-400" /> Conditional Assignment
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
              <Layers size={12} className="text-cyan-400" /> Work Product Clear Boundaries
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   2. NDA GUIDE ANIMATION COMPONENT
   ============================================================ */
const NDAAnimationComponent: React.FC<{ isCompact: boolean }> = ({ isCompact }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {!isCompact && (
        <div className="badge-top-left">
          <Lock size={10} className="text-violet-400" /> Non-Disclosure Agreement
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: isCompact ? '15px' : '40px', transform: isCompact ? 'scale(0.85)' : 'scale(1)' }}>
        {/* Two overlapping sheets representing Mutual NDA */}
        <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'floatDoc 5s infinite ease-in-out' }}>
          
          {/* Party A Document (Left) */}
          <div style={{
            position: 'absolute',
            width: '90px',
            height: '120px',
            background: '#1e293b',
            borderRadius: '10px',
            border: '1.5px solid rgba(255,255,255,0.08)',
            padding: '10px',
            left: '10px',
            top: '10px',
            transform: 'rotate(-6deg)',
            zIndex: 1,
            boxShadow: '-4px 4px 12px rgba(0,0,0,0.15)'
          }}>
            <div style={{ width: '30px', height: '4px', background: '#8b5cf6', borderRadius: '2px', marginBottom: '8px' }} />
            <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', marginBottom: '4px' }} />
            <div style={{ width: '90%', height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', marginBottom: '4px' }} />
            <div style={{ width: '80%', height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px' }} />
          </div>

          {/* Party B Document (Right) */}
          <div style={{
            position: 'absolute',
            width: '90px',
            height: '120px',
            background: '#1e293b',
            borderRadius: '10px',
            border: '1.5px solid rgba(255,255,255,0.08)',
            padding: '10px',
            right: '10px',
            bottom: '10px',
            transform: 'rotate(6deg)',
            zIndex: 2,
            boxShadow: '4px 4px 12px rgba(0,0,0,0.15)'
          }}>
            <div style={{ width: '30px', height: '4px', background: '#ec4899', borderRadius: '2px', marginBottom: '8px' }} />
            <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', marginBottom: '4px' }} />
            <div style={{ width: '85%', height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', marginBottom: '4px' }} />
            <div style={{ width: '95%', height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px' }} />
          </div>

          {/* Centered Secure Lock Overlay */}
          <div style={{
            position: 'absolute',
            zIndex: 10,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            border: '2px solid rgba(255,255,255,0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
            animation: 'lockEngage 1s ease-out forwards',
          }}>
            <Lock size={18} strokeWidth={2.5} />
          </div>
        </div>

        {/* Informative Stats (Hidden in compact) */}
        {!isCompact && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '180px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '4px' }}>CONFIDENTIALITY RULES</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>
              <span>Mutual Protection</span>
              <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>
              <span>Breach Liability</span>
              <span style={{ color: '#ec4899', fontWeight: 'bold' }}>Enforced</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>
              <span>Audit Trail Seal</span>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>Admissible</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   3. SUBCONTRACTING ANIMATION COMPONENT
   ============================================================ */
const SubcontractingAnimationComponent: React.FC<{ isCompact: boolean }> = ({ isCompact }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {!isCompact && (
        <div className="badge-top-left">
          <GitMerge size={10} className="text-emerald-400" /> Subcontracting Network
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: isCompact ? 'scale(0.8)' : 'scale(1)' }}>
        
        {/* Node Diagram (Startup -> Contractor -> Subcontractor) */}
        <div style={{ position: 'relative', width: '320px', height: '120px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Connection Line Paths (SVG) */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }} viewBox="0 0 320 120">
            <path
              d="M 50 60 L 160 60"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeDasharray="5 5"
              style={{ animation: 'pathFlow 4s linear infinite' }}
            />
            <path
              d="M 160 60 L 270 60"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeDasharray="5 5"
              style={{ animation: 'pathFlow 4s linear infinite', animationDelay: '-2s' }}
            />
          </svg>

          {/* Node 1: CLIENT/STARTUP */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '14px',
            background: '#1e293b',
            border: '1.5px solid #10b981',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            animation: 'nodePulse 3s infinite ease-in-out',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            color: '#10b981'
          }}>
            <BookOpen size={20} />
            <span style={{ fontSize: '8px', fontWeight: 'bold', marginTop: '4px', color: 'rgba(255,255,255,0.6)' }}>CLIENT</span>
          </div>

          {/* Node 2: MAIN CONTRACTOR */}
          <div style={{
            width: '74px',
            height: '74px',
            borderRadius: '18px',
            background: '#1e293b',
            border: '2px solid #8b5cf6',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            boxShadow: '0 8px 20px rgba(139, 92, 246, 0.25)',
            color: '#8b5cf6'
          }}>
            <FileText size={24} />
            <span style={{ fontSize: '9px', fontWeight: 'bold', marginTop: '4px', color: 'rgba(255,255,255,0.7)' }}>CONTRACT</span>
          </div>

          {/* Node 3: SUBCONTRACTOR */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '14px',
            background: '#1e293b',
            border: '1.5px solid #3b82f6',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            animation: 'nodePulse 3s infinite ease-in-out',
            animationDelay: '-1.5s',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            color: '#3b82f6'
          }}>
            <Layers size={20} />
            <span style={{ fontSize: '8px', fontWeight: 'bold', marginTop: '4px', color: 'rgba(255,255,255,0.6)' }}>SUB-CON</span>
          </div>

        </div>

        {/* Dynamic Parameter description */}
        {!isCompact && (
          <div style={{ marginTop: '15px', color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: '500', fontFamily: 'monospace' }}>
            IP CHAIN OF TITLE FLOW: SECURED VIA DOCTRANSFER
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogAnimation;
