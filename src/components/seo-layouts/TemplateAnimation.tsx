import React, { useEffect, useState } from 'react';
import { FileText, CheckCircle2, Shield, Lock, Users, Calendar, ArrowRight, DollarSign, Award } from 'lucide-react';

interface TemplateAnimationProps {
  slug: string;
}

type AnimType = 'nda' | 'service' | 'lease' | 'resolution';

const TemplateAnimation: React.FC<TemplateAnimationProps> = ({ slug }) => {
  const [animType, setAnimType] = useState<AnimType>('resolution');

  useEffect(() => {
    const s = slug.toLowerCase();
    if (s.includes('nda') || s.includes('ip-assignment') || s.includes('non-compete')) {
      setAnimType('nda');
    } else if (s.includes('services') || s.includes('web-design') || s.includes('subcontractor') || s.includes('referral')) {
      setAnimType('service');
    } else if (s.includes('lease') || s.includes('vehicle')) {
      setAnimType('lease');
    } else {
      setAnimType('resolution');
    }
  }, [slug]);

  const styles = `
    @keyframes tmpFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    @keyframes tmpPulse {
      0%, 100% { transform: scale(1); opacity: 0.85; }
      50% { transform: scale(1.06); opacity: 1; }
    }
    @keyframes tmpSlideIn {
      0% { transform: translateX(-15px); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    @keyframes tmpFieldHighlight {
      0%, 100% { background: rgba(99, 102, 241, 0.1); border-color: rgba(99, 102, 241, 0.3); }
      50% { background: rgba(99, 102, 241, 0.25); border-color: rgba(99, 102, 241, 0.6); }
    }
    @keyframes tmpStamp {
      0% { transform: scale(2) rotate(-15deg); opacity: 0; }
      80% { transform: scale(0.9) rotate(-10deg); opacity: 0.9; }
      100% { transform: scale(1) rotate(-8deg); opacity: 1; }
    }
    @keyframes tmpDrawLine {
      0% { width: 0; }
      100% { width: 60px; }
    }
    .tmp-container {
      position: relative;
      width: 100%;
      height: 320px;
      background: radial-gradient(ellipse 120% 120% at 50% 0%, #ffffff 0%, #f8fafc 100%);
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #e2e8f0;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03);
      margin-bottom: 2.5rem;
    }
    .tmp-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(99, 102, 241, 0.015) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99, 102, 241, 0.015) 1px, transparent 1px);
      background-size: 18px 18px;
      pointer-events: none;
    }
    .tmp-glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(50px);
      pointer-events: none;
    }
    .tmp-badge {
      position: absolute;
      top: 14px;
      left: 14px;
      background: rgba(99, 102, 241, 0.05);
      border: 1px solid rgba(99, 102, 241, 0.1);
      color: #4f46e5;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      display: flex;
      align-items: center;
      gap: 5px;
    }
  `;

  return (
    <div className="tmp-container">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="tmp-grid" />

      {/* Decorative Orbs */}
      <div className="tmp-glow" style={{ width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', top: '10%', left: '20%' }} />
      <div className="tmp-glow" style={{ width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)', bottom: '10%', right: '20%' }} />

      {animType === 'nda' && <NDAPageAnim />}
      {animType === 'service' && <ServicePageAnim />}
      {animType === 'lease' && <LeasePageAnim />}
      {animType === 'resolution' && <ResolutionPageAnim />}
    </div>
  );
};

/* ============================================================
   1. NDA / IP ASSIGNMENT DOCUMENT ANIMATION
   ============================================================ */
const NDAPageAnim: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="tmp-badge"><FileText size={10} /> Legal Agreement Template</div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '35px' }}>
      {/* Draft Document Card */}
      <div style={{
        width: '150px', height: '190px',
        background: 'white', borderRadius: '16px',
        border: '1.5px solid #e2e8f0', padding: '14px',
        display: 'flex', flexDirection: 'column', gap: '6px',
        animation: 'tmpFloat 4s ease-in-out infinite',
        position: 'relative',
        boxShadow: '0 10px 25px rgba(99, 102, 241, 0.05)',
      }}>
        {/* Document Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '9px', fontWeight: '800', color: '#4f46e5' }}>MUTUAL NDA</span>
          <Shield size={12} style={{ color: '#4f46e5' }} />
        </div>
        <div style={{ width: '100%', height: '2px', background: '#f1f5f9' }} />

        {/* Dynamic Placeholder Variable Fields */}
        <div style={{
          padding: '4px 6px', borderRadius: '6px', border: '1px solid',
          animation: 'tmpFieldHighlight 2s infinite ease-in-out',
          fontSize: '7px', color: '#4f46e5', fontWeight: '700',
        }}>
          [Disclosing Party Name]
        </div>

        <div style={{
          padding: '4px 6px', borderRadius: '6px', border: '1px solid',
          animation: 'tmpFieldHighlight 2s infinite ease-in-out',
          animationDelay: '1s',
          fontSize: '7px', color: '#4f46e5', fontWeight: '700',
        }}>
          [Effective Date]
        </div>

        <div style={{ width: '90%', height: '2px', background: '#f1f5f9', marginTop: '4px' }} />
        <div style={{ width: '95%', height: '2px', background: '#f1f5f9' }} />

        {/* E-Signature indicator */}
        <div style={{
          flex: 1, borderTop: '1px dashed #e2e8f0', marginTop: '8px',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <div style={{ height: '1px', background: '#94a3b8', width: '50px' }} />
          <span style={{ fontSize: '6px', color: '#64748b', fontWeight: '700' }}>SIGN HERE</span>
        </div>
      </div>

      {/* Checklist list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {['Auto-fill custom placeholders', 'IP protection clauses included', 'One-click sign and lock'].map((text, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'white', border: '1px solid #e2e8f0',
            borderRadius: '10px', padding: '8px 14px',
            animation: `tmpSlideIn 0.5s ease forwards`, animationDelay: `${0.3 + i * 0.2}s`, opacity: 0,
            boxShadow: '0 4px 6px rgba(0,0,0,0.01)',
          }}>
            <CheckCircle2 size={12} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: '600' }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ============================================================
   2. SERVICES / CONTRACTOR TIMELINE ANIMATION
   ============================================================ */
const ServicePageAnim: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="tmp-badge"><FileText size={10} /> Services Agreement Template</div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '35px' }}>
      {/* Service Contract Panel */}
      <div style={{
        width: '160px', height: '180px',
        background: 'white', borderRadius: '16px',
        border: '1.5px solid #e2e8f0', padding: '14px',
        display: 'flex', flexDirection: 'column', gap: '6px',
        animation: 'tmpFloat 4.2s ease-in-out infinite',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '8px', fontWeight: '800', color: '#4f46e5', textTransform: 'uppercase' }}>Scope of Work</span>
          <Calendar size={12} style={{ color: '#4f46e5' }} />
        </div>
        <div style={{ width: '100%', height: '2px', background: '#f1f5f9' }} />

        {/* Milestone Steps */}
        {[
          { label: 'Milestone 1', val: 'Design Approval' },
          { label: 'Milestone 2', val: 'Beta Launch' },
          { label: 'Milestone 3', val: 'Final Handover' },
        ].map((step, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '8px', color: '#475569', background: '#f8fafc',
            border: '1px solid #f1f5f9', borderRadius: '6px', padding: '4px 6px',
          }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#4f46e5', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '6px', fontWeight: 'bold' }}>
              ✓
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: '800', fontSize: '7px' }}>{step.label}</span>
              <span style={{ fontSize: '6px', color: '#94a3b8' }}>{step.val}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Features List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { text: 'Milestone tracking logs' },
          { text: 'IP handover clause pre-built' },
          { text: 'Clear payment schedule setup' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'white', border: '1px solid #e2e8f0',
            borderRadius: '10px', padding: '8px 14px',
            animation: `tmpSlideIn 0.5s ease forwards`, animationDelay: `${0.4 + i * 0.15}s`, opacity: 0,
            boxShadow: '0 4px 6px rgba(0,0,0,0.01)',
          }}>
            <CheckCircle2 size={12} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: '600' }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ============================================================
   3. LEASE / RENTAL AGREEMENT ANIMATION
   ============================================================ */
const LeasePageAnim: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="tmp-badge"><FileText size={10} /> Lease & Rental Agreement</div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '35px' }}>
      {/* Lease agreement paper mockup */}
      <div style={{
        width: '150px', height: '190px',
        background: 'white', borderRadius: '16px',
        border: '1.5px solid #e2e8f0', padding: '14px',
        display: 'flex', flexDirection: 'column', gap: '6px',
        animation: 'tmpFloat 4.5s ease-in-out infinite',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '8px', fontWeight: '800', color: '#4f46e5', textTransform: 'uppercase' }}>Rental Lease</span>
          <DollarSign size={12} style={{ color: '#4f46e5' }} />
        </div>
        <div style={{ width: '100%', height: '2px', background: '#f1f5f9' }} />

        {/* Pricing details */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '6px', color: '#94a3b8', display: 'block' }}>MONTHLY RENT</span>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#1e293b' }}>$1,850</span>
          </div>
          <span style={{ fontSize: '6px', color: '#10b981', fontWeight: '700', background: 'rgba(16,185,129,0.1)', padding: '2px 4px', borderRadius: '4px' }}>ACTIVE</span>
        </div>

        {/* Highlight clause */}
        <div style={{ fontSize: '6px', color: '#64748b', lineHeight: '1.3' }}>
          The Tenant agrees to pay the landlord the monthly amount of $1,850 on the first day of each month.
        </div>

        {/* Signature line animation */}
        <div style={{ flex: 1, borderTop: '1px dashed #e2e8f0', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '6px', color: '#94a3b8' }}>Tenant Sign</span>
          <div style={{ height: '1.5px', background: '#4f46e5', animation: 'tmpDrawLine 2s infinite alternate', borderRadius: '1px' }} />
        </div>
      </div>

      {/* Feature Details list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {['Fixed & periodic leases', 'Security deposit clauses', 'Instantly signed on mobile'].map((text, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'white', border: '1px solid #e2e8f0',
            borderRadius: '10px', padding: '8px 14px',
            animation: `tmpSlideIn 0.5s ease forwards`, animationDelay: `${0.3 + i * 0.2}s`, opacity: 0,
            boxShadow: '0 4px 6px rgba(0,0,0,0.01)',
          }}>
            <CheckCircle2 size={12} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: '600' }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ============================================================
   4. CORPORATE BOARD RESOLUTION ANIMATION
   ============================================================ */
const ResolutionPageAnim: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="tmp-badge"><FileText size={10} /> Corporate Resolution Template</div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '35px' }}>
      {/* Board resolution document with vote stamps */}
      <div style={{
        width: '150px', height: '180px',
        background: 'white', borderRadius: '16px',
        border: '1.5px solid #e2e8f0', padding: '14px',
        display: 'flex', flexDirection: 'column', gap: '6px',
        animation: 'tmpFloat 4.6s ease-in-out infinite',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.04)',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '8px', fontWeight: '800', color: '#4f46e5', textTransform: 'uppercase' }}>Resolution</span>
          <Award size={12} style={{ color: '#4f46e5' }} />
        </div>
        <div style={{ width: '100%', height: '2px', background: '#f1f5f9' }} />

        {/* Vote count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7px', color: '#475569', background: '#f8fafc', padding: '4px 6px', borderRadius: '4px' }}>
          <span>BOARD VOTES</span>
          <span style={{ color: '#10b981', fontWeight: '800' }}>APPROVED (5-0)</span>
        </div>

        <div style={{ width: '100%', height: '2px', background: '#f1f5f9', marginTop: '2px' }} />
        <div style={{ width: '90%', height: '2px', background: '#f1f5f9' }} />

        {/* Corporate Stamp */}
        <div style={{
          position: 'absolute', top: '75px', right: '15px',
          border: '2px solid #10b981', color: '#10b981',
          padding: '2px 6px', borderRadius: '4px', fontSize: '8px', fontWeight: '800',
          animation: 'tmpStamp 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          opacity: 0,
        }}>
          RESOLVED
        </div>

        {/* Board member signatures */}
        <div style={{ flex: 1, borderTop: '1px dashed #e2e8f0', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '5px', color: '#94a3b8' }}>Secretary</span>
          <span style={{ fontSize: '5px', color: '#94a3b8' }}>President</span>
        </div>
      </div>

      {/* Feature list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {['Official corporate templates', 'Multi-director signing room', 'Encrypted cryptographic vault'].map((text, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'white', border: '1px solid #e2e8f0',
            borderRadius: '10px', padding: '8px 14px',
            animation: `tmpSlideIn 0.5s ease forwards`, animationDelay: `${0.3 + i * 0.2}s`, opacity: 0,
            boxShadow: '0 4px 6px rgba(0,0,0,0.01)',
          }}>
            <CheckCircle2 size={12} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: '600' }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default TemplateAnimation;
