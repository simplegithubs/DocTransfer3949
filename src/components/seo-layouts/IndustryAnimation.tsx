import React, { useEffect, useState } from 'react';
import { Home, Key, FileText, CheckCircle2, Shield, Lock, Award, TrendingUp, BarChart3, Users, UserCheck, Cloud, RefreshCw, Zap } from 'lucide-react';

interface IndustryAnimationProps {
  slug: string;
}

type AnimType = 'realestate' | 'legal' | 'finance' | 'hr' | 'default';

const IndustryAnimation: React.FC<IndustryAnimationProps> = ({ slug }) => {
  const [animType, setAnimType] = useState<AnimType>('default');

  useEffect(() => {
    const s = slug.toLowerCase();
    if (s.includes('real-estate')) {
      setAnimType('realestate');
    } else if (s.includes('legal') || s.includes('law-firm') || s.includes('hipaa') || s.includes('gdpr')) {
      setAnimType('legal');
    } else if (s.includes('financial') || s.includes('investor') || s.includes('pitch-deck')) {
      setAnimType('finance');
    } else if (s.includes('agency') || s.includes('onboarding') || s.includes('hr-confidential')) {
      setAnimType('hr');
    } else {
      setAnimType('default');
    }
  }, [slug]);

  const styles = `
    @keyframes indFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    @keyframes indPulse {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.08); opacity: 1; }
    }
    @keyframes indRotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes indSlideUp {
      0% { transform: translateY(15px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes indChartGrow {
      0% { height: 0%; }
      100% { height: var(--chart-height); }
    }
    @keyframes indKeyWiggle {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(15deg) translateY(-3px); }
    }
    @keyframes indSync {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(-360deg); }
    }
    @keyframes indFlowStream {
      0% { left: 0%; opacity: 0; }
      20% { opacity: 1; }
      80% { opacity: 1; }
      100% { left: 100%; opacity: 0; }
    }
    .ind-container {
      position: relative;
      width: 100%;
      height: 380px;
      background: radial-gradient(ellipse 120% 120% at 50% 0%, #111827 0%, #030712 100%);
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
      margin-bottom: 3rem;
    }
    .ind-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
      background-size: 20px 20px;
      pointer-events: none;
    }
    .ind-glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      pointer-events: none;
    }
    .ind-badge {
      position: absolute;
      top: 16px;
      left: 16px;
      background: rgba(255, 255, 255, 0.04);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.6);
      padding: 4px 14px;
      border-radius: 9999px;
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      display: flex;
      align-items: center;
      gap: 6px;
    }
  `;

  return (
    <div className="ind-container">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="ind-grid" />

      {/* Dynamic colorful blur orbs based on theme */}
      {animType === 'realestate' && (
        <div className="ind-glow" style={{ width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 75%)', top: '10%', left: '15%' }} />
      )}
      {animType === 'legal' && (
        <div className="ind-glow" style={{ width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 75%)', top: '10%', right: '15%' }} />
      )}
      {animType === 'finance' && (
        <div className="ind-glow" style={{ width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 75%)', bottom: '10%', left: '20%' }} />
      )}
      {animType === 'hr' && (
        <div className="ind-glow" style={{ width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 75%)', top: '15%', left: '25%' }} />
      )}
      {animType === 'default' && (
        <div className="ind-glow" style={{ width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 75%)', top: '5%', left: '30%' }} />
      )}

      {animType === 'realestate' && <RealEstateAnim />}
      {animType === 'legal' && <LegalAnim />}
      {animType === 'finance' && <FinanceAnim />}
      {animType === 'hr' && <HRAnim />}
      {animType === 'default' && <DefaultSyncAnim />}
    </div>
  );
};

/* ============================================================
   1. REAL ESTATE SOLUTIONS ANIMATION
   ============================================================ */
const RealEstateAnim: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="ind-badge"><Home size={10} style={{ color: '#10b981' }} /> Real Estate Deal Flow</div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
      {/* Floating Property Card / House Vault */}
      <div style={{
        width: '150px', height: '200px',
        background: '#1f2937', borderRadius: '16px',
        border: '1.5px solid #111827', padding: '14px',
        display: 'flex', flexDirection: 'column', gap: '8px',
        animation: 'indFloat 4.5s ease-in-out infinite',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 15px rgba(16, 185, 129, 0.1)',
      }}>
        {/* House outline */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <Home size={22} style={{ color: '#10b981' }} />
          <Key size={16} style={{ color: '#34d399', animation: 'indKeyWiggle 3s ease-in-out infinite' }} />
        </div>
        <div style={{ width: '45px', height: '4px', background: '#10b981', borderRadius: '2px', opacity: 0.8 }} />
        <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.06)' }} />

        {/* Contract terms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '8px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Sale Price</span>
            <span style={{ color: '#fff', fontWeight: '700' }}>$485,000</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Escrow Deposit</span>
            <span style={{ color: '#fff', fontWeight: '700' }}>$15,000</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Closing Period</span>
            <span style={{ color: '#fff', fontWeight: '700' }}>30 Days</span>
          </div>
        </div>

        {/* Signature Box */}
        <div style={{
          flex: 1, marginTop: '8px', borderRadius: '8px',
          border: '1px dashed rgba(16, 185, 129, 0.3)',
          background: 'rgba(16, 185, 129, 0.03)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        }}>
          <span style={{ fontSize: '7px', color: '#6b7280', fontWeight: '700' }}>BUYER & AGENT SIGN</span>
          <div style={{ width: '60px', height: '1.5px', background: '#10b981', marginTop: '6px', borderRadius: '1px' }} />
        </div>

        {/* Stamp */}
        <div style={{
          position: 'absolute', bottom: '-12px', right: '-12px',
          width: '32px', height: '32px', borderRadius: '50%',
          background: '#10b981', border: '2px solid #030712',
          display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white',
          animation: 'indPulse 2.5s infinite ease-in-out',
        }}>
          <CheckCircle2 size={16} strokeWidth={2.5} />
        </div>
      </div>

      {/* Workflow details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {['Secure Disclosures', 'Earnest Money Escrow', 'Instant Digital Closing'].map((text, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(31, 41, 55, 0.7)', border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '10px', padding: '8px 14px',
            animation: `indSlideUp 0.5s ease forwards`, animationDelay: `${0.3 + i * 0.2}s`, opacity: 0,
          }}>
            <CheckCircle2 size={12} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '0.75rem', color: '#d1d5db', fontWeight: '600' }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ============================================================
   2. LEGAL & COMPLIANCE SOLUTIONS ANIMATION
   ============================================================ */
const LegalAnim: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="ind-badge"><Shield size={10} style={{ color: '#6366f1' }} /> Legal & Compliance</div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
      {/* Encryption shield and document panel */}
      <div style={{ position: 'relative', width: '140px', height: '180px', animation: 'indFloat 5s ease-in-out infinite' }}>
        <div style={{
          width: '120px', height: '160px',
          background: '#1f2937', borderRadius: '16px',
          border: '1.5px solid rgba(99, 102, 241, 0.3)', padding: '14px',
          display: 'flex', flexDirection: 'column', gap: '6px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FileText size={16} style={{ color: '#818cf8' }} />
            <Award size={14} style={{ color: '#6366f1' }} />
          </div>
          <div style={{ width: '40px', height: '4px', background: '#6366f1', borderRadius: '2px' }} />
          <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ width: '90%', height: '2px', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ width: '95%', height: '2px', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ width: '80%', height: '2px', background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* Lock Overlay Shield */}
        <div style={{
          position: 'absolute', bottom: '-12px', right: '-12px',
          width: '48px', height: '48px', borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          border: '2px solid #030712',
          display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white',
          boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
          animation: 'indPulse 2s infinite ease-in-out',
        }}>
          <Lock size={20} />
        </div>
      </div>

      {/* Compliance standards list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { text: 'HIPAA Compliant Sharing', spec: 'AES-256' },
          { text: 'GDPR / EU Residency', spec: 'Zero-Knowledge' },
          { text: 'ESIGN Act Legal Signatures', spec: 'Court-Admissible' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', gap: '2px',
            background: 'rgba(31, 41, 55, 0.7)', border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '10px', padding: '8px 14px',
            animation: `indSlideUp 0.5s ease forwards`, animationDelay: `${0.3 + i * 0.2}s`, opacity: 0,
            width: '190px'
          }}>
            <span style={{ fontSize: '0.72rem', color: '#f3f4f6', fontWeight: '600' }}>{item.text}</span>
            <span style={{ fontSize: '0.6rem', color: '#818cf8', fontFamily: 'monospace', fontWeight: '700' }}>{item.spec}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ============================================================
   3. FINANCE & INVESTOR RELATIONS ANIMATION
   ============================================================ */
const FinanceAnim: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="ind-badge"><TrendingUp size={10} style={{ color: '#f59e0b' }} /> Financial Data Room</div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '35px' }}>
      {/* Chart visualization */}
      <div style={{
        width: '160px', height: '160px',
        background: '#1f2937', borderRadius: '16px',
        border: '1.5px solid rgba(245, 158, 11, 0.2)', padding: '14px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        animation: 'indFloat 4.2s ease-in-out infinite',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '8px', fontWeight: '800', color: '#f59e0b', textTransform: 'uppercase' }}>Investor Access</span>
          <TrendingUp size={12} style={{ color: '#f59e0b' }} />
        </div>

        {/* Growth Bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '80px', padding: '0 6px' }}>
          {[
            { h: '35%', col: '#f59e0b' },
            { h: '50%', col: '#f59e0b' },
            { h: '75%', col: '#f59e0b' },
            { h: '95%', col: '#10b981' },
          ].map((bar, i) => (
            <div key={i} style={{
              width: '20px', borderRadius: '4px',
              backgroundColor: bar.col,
              // @ts-ignore
              '--chart-height': bar.h,
              animation: 'indChartGrow 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
              animationDelay: `${0.3 + i * 0.15}s`,
              height: 0,
            } as React.CSSProperties} />
          ))}
        </div>

        <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>Q3 REPORT READY</div>
      </div>

      {/* Secure Data Room indicators */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { label: 'Investor Audit Log', val: 'Real-time tracking' },
          { label: 'NDAs & Access Gate', val: 'One-click sign' },
          { label: 'Direct Pitch Send', val: 'No attachment limit' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column',
            background: 'rgba(31, 41, 55, 0.7)', border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '10px', padding: '8px 14px',
            animation: `indSlideUp 0.5s ease forwards`, animationDelay: `${0.4 + i * 0.15}s`, opacity: 0,
            width: '180px'
          }}>
            <span style={{ fontSize: '0.72rem', color: '#f3f4f6', fontWeight: '700' }}>{item.label}</span>
            <span style={{ fontSize: '0.62rem', color: '#f59e0b', fontWeight: '500' }}>{item.val}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ============================================================
   4. ONBOARDING & HR ANIMATION
   ============================================================ */
const HRAnim: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="ind-badge"><Users size={10} style={{ color: '#ec4899' }} /> Agency & HR Flow</div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
      {/* Onboarding flowchart */}
      <div style={{
        width: '150px', height: '190px',
        background: '#1f2937', borderRadius: '16px',
        border: '1.5px solid rgba(236, 72, 153, 0.2)', padding: '14px',
        display: 'flex', flexDirection: 'column', gap: '8px',
        animation: 'indFloat 4.6s ease-in-out infinite',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '8px', fontWeight: '800', color: '#ec4899', textTransform: 'uppercase' }}>Onboarding</span>
          <Users size={12} style={{ color: '#ec4899' }} />
        </div>
        <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.06)' }} />

        {/* Nodes and connecting line */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px', position: 'relative' }}>
          {/* Connector vertical line */}
          <div style={{ position: 'absolute', left: '9px', top: '10px', bottom: '10px', width: '1.5px', background: 'rgba(255,255,255,0.1)' }} />

          {/* Node 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2 }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#ec4899', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '9px', fontWeight: '700' }}>1</div>
            <span style={{ fontSize: '8px', color: '#fff', fontWeight: '600' }}>Contract Signed</span>
          </div>

          {/* Node 2 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2 }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#ec4899', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '9px', fontWeight: '700' }}>2</div>
            <span style={{ fontSize: '8px', color: '#fff', fontWeight: '600' }}>ID Verified</span>
          </div>

          {/* Node 3 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2 }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#10b981', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '9px', fontWeight: '700' }}>3</div>
            <span style={{ fontSize: '8px', color: '#10b981', fontWeight: '700' }}>Vibe Check ✓</span>
          </div>
        </div>
      </div>

      {/* HR Stats list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {['Automated Reminders', 'Multi-recipient Signing', 'Secure Employee Records'].map((text, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(31, 41, 55, 0.7)', border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '10px', padding: '8px 14px',
            animation: `indSlideUp 0.5s ease forwards`, animationDelay: `${0.3 + i * 0.2}s`, opacity: 0,
          }}>
            <UserCheck size={12} style={{ color: '#ec4899' }} />
            <span style={{ fontSize: '0.75rem', color: '#d1d5db', fontWeight: '600' }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ============================================================
   5. DEFAULT / REMOTE TEAM SYNC ANIMATION
   ============================================================ */
const DefaultSyncAnim: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="ind-badge"><Cloud size={10} style={{ color: '#8b5cf6' }} /> Remote Team Operations</div>

    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>
      {/* File Cloud Sync Visual */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        {/* Device A */}
        <div style={{
          width: '70px', height: '90px',
          background: '#1f2937', borderRadius: '10px',
          border: '1.5px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '4px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          animation: 'indFloat 4s ease-in-out infinite',
        }}>
          <FileText size={18} style={{ color: '#a78bfa' }} />
          <span style={{ fontSize: '6px', color: 'rgba(255,255,255,0.4)' }}>SENDER</span>
        </div>

        {/* Sync Status Orb */}
        <div style={{
          width: '44px', height: '44px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
          border: '2px solid #030712',
          display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white',
          animation: 'indPulse 2s infinite ease-in-out',
          boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)',
          position: 'relative',
        }}>
          <RefreshCw size={16} style={{ animation: 'indSync 4s linear infinite' }} />
        </div>

        {/* Device B */}
        <div style={{
          width: '70px', height: '90px',
          background: '#1f2937', borderRadius: '10px',
          border: '1.5px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '4px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          animation: 'indFloat 4s ease-in-out infinite',
          animationDelay: '1s',
        }}>
          <FileText size={18} style={{ color: '#10b981' }} />
          <span style={{ fontSize: '6px', color: 'rgba(255,255,255,0.4)' }}>RECIPIENT</span>
        </div>
      </div>

      {/* Sync path horizontal line */}
      <div style={{ position: 'relative', width: '220px', height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '1px', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', width: '50px', height: '100%',
          background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)',
          animation: 'indFlowStream 2s linear infinite',
        }} />
      </div>

      {/* Feature Row */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {[
          { label: 'Instant Sync' },
          { label: 'Audit Trail Logs' },
          { label: 'Cross-border Security' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'rgba(31, 41, 55, 0.6)', border: '1px solid rgba(255, 255, 255, 0.04)',
            borderRadius: '8px', padding: '5px 10px',
            animation: `indSlideUp 0.5s ease forwards`, animationDelay: `${0.4 + i * 0.15}s`, opacity: 0,
          }}>
            <Zap size={10} style={{ color: '#8b5cf6' }} />
            <span style={{ fontSize: '0.68rem', color: '#d1d5db', fontWeight: '600' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default IndustryAnimation;
