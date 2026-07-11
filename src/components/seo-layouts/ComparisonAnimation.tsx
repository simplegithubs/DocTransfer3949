import React, { useEffect, useState } from 'react';
import { Shield, Lock, Eye, X, Check, Award, Flame } from 'lucide-react';

interface ComparisonAnimationProps {
  slug: string;
  competitorName: string;
}

const ComparisonAnimation: React.FC<ComparisonAnimationProps> = ({ slug, competitorName }) => {
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setResetKey((prev) => prev + 1);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const animationStyles = `
    @keyframes pulseVS {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 0 10px rgba(99, 102, 241, 0.4), inset 0 0 5px rgba(99, 102, 241, 0.4);
      }
      50% {
        transform: scale(1.1);
        box-shadow: 0 0 25px rgba(99, 102, 241, 0.8), inset 0 0 10px rgba(99, 102, 241, 0.6);
      }
    }
    @keyframes slideLeft {
      0% {
        transform: translateX(-40px);
        opacity: 0;
      }
      100% {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideRight {
      0% {
        transform: translateX(40px);
        opacity: 0;
      }
      100% {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes glowLine {
      0% {
        stroke-dashoffset: 100;
      }
      100% {
        stroke-dashoffset: 0;
      }
    }
    @keyframes listFadeIn {
      0% {
        transform: translateY(10px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
    .comp-container {
      position: relative;
      width: 100%;
      height: 380px;
      background: radial-gradient(120% 120% at 50% 0%, #0f172a 0%, #020617 100%);
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .comp-grid {
      position: absolute;
      inset: 0;
      background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 20px 20px;
      background-position: center;
      pointer-events: none;
    }
    .comp-card-left {
      background: rgba(30, 41, 59, 0.3);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 20px;
      padding: 24px;
      width: 220px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      animation: slideLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .comp-card-right {
      background: rgba(30, 41, 59, 0.5);
      border: 1px solid rgba(99, 102, 241, 0.4);
      border-radius: 20px;
      padding: 24px;
      width: 220px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-shadow: 0 10px 30px rgba(99, 102, 241, 0.05), 0 20px 40px rgba(0,0,0,0.3);
      animation: slideRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .vs-emblem {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 1.1rem;
      font-weight: 900;
      font-style: italic;
      z-index: 10;
      border: 2.5px solid #020617;
      animation: pulseVS 2s infinite ease-in-out;
    }
    .vs-line {
      position: absolute;
      width: 2px;
      height: 180px;
      background: linear-gradient(to bottom, transparent, rgba(99,102,241,0.3), transparent);
      z-index: 1;
    }
    .row-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.7);
    }
    .text-red-dot {
      color: #f87171;
    }
    .text-green-dot {
      color: #34d399;
    }
  `;

  return (
    <div className="comp-container" key={resetKey}>
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <div className="comp-grid" />
      
      {/* Background neon glows */}
      <div style={{ position: 'absolute', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0) 70%)', filter: 'blur(30px)', left: '10%' }} />
      <div style={{ position: 'absolute', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%)', filter: 'blur(30px)', right: '10%' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '30px', zIndex: 5 }}>
        
        {/* LEFT: COMPETITOR CARD */}
        <div className="comp-card-left">
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{competitorName}</span>
            <X size={14} className="text-red-dot" strokeWidth={3} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Cost row */}
            <div className="row-item" style={{ animation: 'listFadeIn 0.5s ease forwards', animationDelay: '0.2s', opacity: 0 }}>
              <X size={12} className="text-red-dot" strokeWidth={2.5} />
              <span>High Licensing Costs</span>
            </div>
            {/* Security row */}
            <div className="row-item" style={{ animation: 'listFadeIn 0.5s ease forwards', animationDelay: '0.4s', opacity: 0 }}>
              <X size={12} className="text-red-dot" strokeWidth={2.5} />
              <span>Hosted Encryption Keys</span>
            </div>
            {/* Tracking row */}
            <div className="row-item" style={{ animation: 'listFadeIn 0.5s ease forwards', animationDelay: '0.6s', opacity: 0 }}>
              <X size={12} className="text-red-dot" strokeWidth={2.5} />
              <span>Basic File Statistics</span>
            </div>
            {/* Seats row */}
            <div className="row-item" style={{ animation: 'listFadeIn 0.5s ease forwards', animationDelay: '0.8s', opacity: 0 }}>
              <X size={12} className="text-red-dot" strokeWidth={2.5} />
              <span>Strict Per-Seat Fees</span>
            </div>
          </div>
        </div>

        {/* CENTER: VS EMBLEM */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <div className="vs-line" />
          <div className="vs-emblem">VS</div>
        </div>

        {/* RIGHT: DOCTRANSFER CARD */}
        <div className="comp-card-right" style={{ border: '1.5px solid rgba(99,102,241,0.6)' }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#a5b4fc', letterSpacing: '0.5px' }}>DOCTRANSFER</span>
            <Check size={14} className="text-green-dot" strokeWidth={3} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Cost row */}
            <div className="row-item" style={{ animation: 'listFadeIn 0.5s ease forwards', animationDelay: '0.3s', opacity: 0 }}>
              <Check size={12} className="text-green-dot" strokeWidth={2.5} />
              <span style={{ color: '#fff', fontWeight: '600' }}>Free Core Tier ($0/mo)</span>
            </div>
            {/* Security row */}
            <div className="row-item" style={{ animation: 'listFadeIn 0.5s ease forwards', animationDelay: '0.5s', opacity: 0 }}>
              <Check size={12} className="text-green-dot" strokeWidth={2.5} />
              <span style={{ color: '#fff', fontWeight: '600' }}>Zero-Knowledge E2EE</span>
            </div>
            {/* Tracking row */}
            <div className="row-item" style={{ animation: 'listFadeIn 0.5s ease forwards', animationDelay: '0.7s', opacity: 0 }}>
              <Check size={12} className="text-green-dot" strokeWidth={2.5} />
              <span style={{ color: '#fff', fontWeight: '600' }}>Second-by-Second Analytics</span>
            </div>
            {/* Seats row */}
            <div className="row-item" style={{ animation: 'listFadeIn 0.5s ease forwards', animationDelay: '0.9s', opacity: 0 }}>
              <Check size={12} className="text-green-dot" strokeWidth={2.5} />
              <span style={{ color: '#fff', fontWeight: '600' }}>Unlimited Sends & Signers</span>
            </div>
          </div>

          {/* Secure validation badge overlay */}
          <div style={{
            position: 'absolute',
            bottom: '-12px',
            right: '-12px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 4px 10px rgba(16,185,129,0.3)',
            animation: 'pulseVS 3s infinite ease-in-out',
            border: '1.5px solid #1e293b'
          }}>
            <Award size={16} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ComparisonAnimation;
