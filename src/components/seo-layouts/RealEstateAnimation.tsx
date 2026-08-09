import React, { useEffect, useState } from 'react';
import { Home, Key, FileText, CheckCircle2, Shield, Lock, MapPin, DollarSign, Building2, Users, ClipboardCheck, TrendingUp, Landmark, Scale, Search, ArrowRightLeft, Timer } from 'lucide-react';

interface RealEstateAnimationProps {
  slug: string;
}

type REAnimType = 'property-mgmt' | 'title' | 'mortgage' | 'commercial' | 'escrow' | 'default-re';

const RealEstateAnimation: React.FC<RealEstateAnimationProps> = ({ slug }) => {
  const [animType, setAnimType] = useState<REAnimType>('default-re');

  useEffect(() => {
    const s = slug.toLowerCase();
    if (s.includes('property-management')) setAnimType('property-mgmt');
    else if (s.includes('title-company')) setAnimType('title');
    else if (s.includes('mortgage')) setAnimType('mortgage');
    else if (s.includes('commercial-real-estate')) setAnimType('commercial');
    else if (s.includes('escrow')) setAnimType('escrow');
    else setAnimType('default-re');
  }, [slug]);

  const styles = `
    @keyframes reFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    @keyframes rePulse {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.1); opacity: 1; }
    }
    @keyframes reSlideUp {
      0% { transform: translateY(18px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes reGlow {
      0%, 100% { box-shadow: 0 0 15px rgba(16, 185, 129, 0.15); }
      50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.3); }
    }
    @keyframes reProgress {
      0% { width: 0%; }
      100% { width: var(--target-width); }
    }
    @keyframes reSpin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes reWiggle {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-8deg); }
      75% { transform: rotate(8deg); }
    }
    @keyframes reFlowDot {
      0% { left: 0%; opacity: 0; }
      15% { opacity: 1; }
      85% { opacity: 1; }
      100% { left: calc(100% - 8px); opacity: 0; }
    }
    @keyframes reFadeScale {
      0% { transform: scale(0.85); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes reStampIn {
      0% { transform: scale(2) rotate(-20deg); opacity: 0; }
      60% { transform: scale(0.9) rotate(2deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    .re-container {
      position: relative;
      width: 100%;
      height: 380px;
      background: radial-gradient(ellipse 120% 120% at 50% 0%, #0c1a0e 0%, #030712 100%);
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid rgba(16, 185, 129, 0.1);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
      margin-bottom: 3rem;
    }
    .re-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(16, 185, 129, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(16, 185, 129, 0.02) 1px, transparent 1px);
      background-size: 24px 24px;
      pointer-events: none;
    }
    .re-glow-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      pointer-events: none;
    }
    .re-badge {
      position: absolute;
      top: 16px;
      left: 16px;
      background: rgba(16, 185, 129, 0.06);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(16, 185, 129, 0.15);
      color: rgba(16, 185, 129, 0.8);
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
    .re-card {
      background: rgba(31, 41, 55, 0.8);
      border: 1px solid rgba(16, 185, 129, 0.12);
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .re-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(31, 41, 55, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      padding: 8px 14px;
    }
    .re-pill-text {
      font-size: 0.75rem;
      color: #d1d5db;
      font-weight: 600;
    }
    .re-flow-line {
      position: relative;
      width: 180px;
      height: 2px;
      background: rgba(16, 185, 129, 0.1);
      border-radius: 1px;
      overflow: hidden;
    }
    .re-flow-dot {
      position: absolute;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      top: -3px;
      animation: reFlowDot 2.5s linear infinite;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
    }
  `;

  return (
    <div className="re-container">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="re-grid" />

      {/* Glow orbs */}
      <div className="re-glow-orb" style={{ width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)', top: '5%', left: '10%' }} />
      <div className="re-glow-orb" style={{ width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(52, 211, 153, 0.08) 0%, transparent 70%)', bottom: '10%', right: '15%' }} />

      {animType === 'property-mgmt' && <PropertyMgmtAnim />}
      {animType === 'title' && <TitleCompanyAnim />}
      {animType === 'mortgage' && <MortgageBrokerAnim />}
      {animType === 'commercial' && <CommercialREAnim />}
      {animType === 'escrow' && <EscrowAnim />}
      {animType === 'default-re' && <DefaultREAnim />}
    </div>
  );
};

/* ============================================================
   1. PROPERTY MANAGEMENT ANIMATION
   ============================================================ */
const PropertyMgmtAnim: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="re-badge"><Building2 size={10} /> Property Management</div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '35px' }}>
      {/* Multi-unit building card */}
      <div className="re-card" style={{ width: '160px', height: '210px', animation: 'reFloat 4.5s ease-in-out infinite', position: 'relative', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Building2 size={20} style={{ color: '#10b981' }} />
          <span style={{ fontSize: '7px', fontWeight: '800', color: '#10b981', textTransform: 'uppercase' }}>Portfolio</span>
        </div>

        {/* Property units */}
        {[
          { unit: 'Unit 3A', status: 'Lease Signed', color: '#10b981' },
          { unit: 'Unit 5B', status: 'Pending Sign', color: '#f59e0b' },
          { unit: 'Unit 7C', status: 'Renewal Due', color: '#ef4444' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '6px 8px',
            animation: `reSlideUp 0.5s ease forwards`, animationDelay: `${0.3 + i * 0.15}s`, opacity: 0,
          }}>
            <span style={{ fontSize: '8px', color: '#fff', fontWeight: '600' }}>{item.unit}</span>
            <span style={{ fontSize: '7px', color: item.color, fontWeight: '700' }}>{item.status}</span>
          </div>
        ))}

        {/* Occupancy bar */}
        <div style={{ marginTop: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7px', color: 'rgba(255,255,255,0.5)', marginBottom: '3px' }}>
            <span>Occupancy</span>
            <span style={{ color: '#10b981', fontWeight: '700' }}>87%</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: '87%', height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: '2px', animation: 'reProgress 1.5s ease forwards', '--target-width': '87%' } as React.CSSProperties} />
          </div>
        </div>

        {/* Stamp */}
        <div style={{
          position: 'absolute', bottom: '-10px', right: '-10px',
          width: '30px', height: '30px', borderRadius: '50%',
          background: '#10b981', border: '2px solid #030712',
          display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white',
          animation: 'rePulse 2.5s infinite ease-in-out',
        }}>
          <ClipboardCheck size={14} strokeWidth={2.5} />
        </div>
      </div>

      {/* Feature list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { icon: <FileText size={12} style={{ color: '#10b981' }} />, text: 'Bulk Lease Management' },
          { icon: <Users size={12} style={{ color: '#10b981' }} />, text: 'Tenant Onboarding Portal' },
          { icon: <Shield size={12} style={{ color: '#10b981' }} />, text: 'Maintenance Request Tracking' },
        ].map((item, i) => (
          <div key={i} className="re-pill" style={{
            animation: `reSlideUp 0.5s ease forwards`, animationDelay: `${0.5 + i * 0.2}s`, opacity: 0,
          }}>
            {item.icon}
            <span className="re-pill-text">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ============================================================
   2. TITLE COMPANY ANIMATION
   ============================================================ */
const TitleCompanyAnim: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="re-badge"><Search size={10} /> Title & Closing Services</div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '35px' }}>
      {/* Title search document */}
      <div className="re-card" style={{ width: '155px', height: '200px', animation: 'reFloat 5s ease-in-out infinite', position: 'relative', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Landmark size={18} style={{ color: '#10b981' }} />
          <span style={{ fontSize: '7px', fontWeight: '800', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title Clear</span>
        </div>

        <div style={{ width: '50px', height: '4px', background: '#10b981', borderRadius: '2px' }} />

        {/* Chain of title flow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
          {['Title Search', 'Lien Check', 'Survey Review', 'Insurance Issued'].map((step, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              animation: `reSlideUp 0.4s ease forwards`, animationDelay: `${0.2 + i * 0.15}s`, opacity: 0,
            }}>
              <CheckCircle2 size={10} style={{ color: i < 3 ? '#10b981' : '#34d399', flexShrink: 0 }} />
              <span style={{ fontSize: '8px', color: i < 3 ? '#d1d5db' : '#10b981', fontWeight: i === 3 ? '700' : '500' }}>{step}</span>
            </div>
          ))}
        </div>

        {/* Verified stamp */}
        <div style={{
          position: 'absolute', bottom: '-12px', right: '-12px',
          width: '36px', height: '36px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          border: '2px solid #030712',
          display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white',
          animation: 'reStampIn 0.8s ease forwards', animationDelay: '1s', opacity: 0,
          boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
        }}>
          <Shield size={16} />
        </div>
      </div>

      {/* Right side info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { label: 'Chain of Title', val: 'Verified Clean' },
          { label: 'Document Vault', val: 'AES-256 Encrypted' },
          { label: 'Closing Package', val: 'Ready for Signatures' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', gap: '2px',
            background: 'rgba(31, 41, 55, 0.7)', border: '1px solid rgba(16, 185, 129, 0.08)',
            borderRadius: '10px', padding: '8px 14px', width: '185px',
            animation: `reSlideUp 0.5s ease forwards`, animationDelay: `${0.5 + i * 0.2}s`, opacity: 0,
          }}>
            <span style={{ fontSize: '0.72rem', color: '#f3f4f6', fontWeight: '600' }}>{item.label}</span>
            <span style={{ fontSize: '0.6rem', color: '#34d399', fontFamily: 'monospace', fontWeight: '700' }}>{item.val}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ============================================================
   3. MORTGAGE BROKER ANIMATION
   ============================================================ */
const MortgageBrokerAnim: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="re-badge"><DollarSign size={10} /> Mortgage & Lending</div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '35px' }}>
      {/* Mortgage application card */}
      <div className="re-card" style={{ width: '155px', height: '210px', animation: 'reFloat 4.2s ease-in-out infinite', position: 'relative', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <DollarSign size={18} style={{ color: '#10b981' }} />
          <TrendingUp size={14} style={{ color: '#34d399' }} />
        </div>
        <span style={{ fontSize: '7px', fontWeight: '800', color: '#10b981', textTransform: 'uppercase' }}>Loan Application</span>

        {/* Loan details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '8px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Loan Amount</span>
            <span style={{ color: '#fff', fontWeight: '700' }}>$425,000</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Rate</span>
            <span style={{ color: '#10b981', fontWeight: '700' }}>5.75% APR</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Term</span>
            <span style={{ color: '#fff', fontWeight: '700' }}>30 Year Fixed</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Monthly</span>
            <span style={{ color: '#10b981', fontWeight: '700' }}>$2,479</span>
          </div>
        </div>

        {/* Progress tracker */}
        <div style={{ marginTop: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '6px', color: 'rgba(255,255,255,0.4)', marginBottom: '3px' }}>
            <span>Approval Progress</span>
            <span style={{ color: '#10b981' }}>75%</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, #059669, #10b981, #34d399)', borderRadius: '2px', animation: 'reProgress 2s ease forwards', '--target-width': '75%' } as React.CSSProperties} />
          </div>
        </div>

        {/* Stamp */}
        <div style={{
          position: 'absolute', bottom: '-10px', right: '-10px',
          width: '30px', height: '30px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          border: '2px solid #030712',
          display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white',
          animation: 'rePulse 2s infinite ease-in-out',
        }}>
          <Lock size={14} />
        </div>
      </div>

      {/* Feature list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { icon: <Lock size={12} style={{ color: '#10b981' }} />, text: 'Encrypted Loan Docs' },
          { icon: <FileText size={12} style={{ color: '#10b981' }} />, text: 'Pre-Approval Letters' },
          { icon: <CheckCircle2 size={12} style={{ color: '#10b981' }} />, text: 'TRID Compliant Closing' },
        ].map((item, i) => (
          <div key={i} className="re-pill" style={{
            animation: `reSlideUp 0.5s ease forwards`, animationDelay: `${0.5 + i * 0.2}s`, opacity: 0,
          }}>
            {item.icon}
            <span className="re-pill-text">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ============================================================
   4. COMMERCIAL REAL ESTATE ANIMATION
   ============================================================ */
const CommercialREAnim: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="re-badge"><Building2 size={10} /> Commercial Real Estate</div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
      {/* Deal pipeline */}
      <div className="re-card" style={{ width: '155px', height: '200px', animation: 'reFloat 4.8s ease-in-out infinite', position: 'relative', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '8px', fontWeight: '800', color: '#10b981', textTransform: 'uppercase' }}>Deal Pipeline</span>
          <MapPin size={14} style={{ color: '#34d399' }} />
        </div>

        {/* CRE Deal cards */}
        {[
          { name: 'Office Tower 12F', value: '$8.2M', status: 'LOI Sent' },
          { name: 'Retail Center Oak', value: '$3.1M', status: 'Due Diligence' },
          { name: 'Industrial Park N', value: '$12.5M', status: 'Closing' },
        ].map((deal, i) => (
          <div key={i} style={{
            background: 'rgba(16, 185, 129, 0.04)', borderRadius: '8px',
            padding: '6px 8px', border: '1px solid rgba(16, 185, 129, 0.08)',
            animation: `reFadeScale 0.5s ease forwards`, animationDelay: `${0.3 + i * 0.2}s`, opacity: 0,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '7px', color: '#fff', fontWeight: '600' }}>{deal.name}</span>
              <span style={{ fontSize: '7px', color: '#10b981', fontWeight: '700' }}>{deal.value}</span>
            </div>
            <span style={{ fontSize: '6px', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>{deal.status}</span>
          </div>
        ))}

        {/* Stamp */}
        <div style={{
          position: 'absolute', bottom: '-10px', right: '-10px',
          width: '30px', height: '30px', borderRadius: '50%',
          background: '#10b981', border: '2px solid #030712',
          display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white',
          animation: 'rePulse 2.5s infinite ease-in-out',
        }}>
          <TrendingUp size={14} strokeWidth={2.5} />
        </div>
      </div>

      {/* Feature list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { icon: <Scale size={12} style={{ color: '#10b981' }} />, text: 'LOI & Offer Management' },
          { icon: <Lock size={12} style={{ color: '#10b981' }} />, text: 'Secure Data Rooms' },
          { icon: <ArrowRightLeft size={12} style={{ color: '#10b981' }} />, text: 'Multi-Party Deal Signing' },
        ].map((item, i) => (
          <div key={i} className="re-pill" style={{
            animation: `reSlideUp 0.5s ease forwards`, animationDelay: `${0.5 + i * 0.2}s`, opacity: 0,
          }}>
            {item.icon}
            <span className="re-pill-text">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ============================================================
   5. ESCROW OFFICER ANIMATION
   ============================================================ */
const EscrowAnim: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="re-badge"><Timer size={10} /> Escrow & Closing</div>

    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      {/* Escrow flow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Buyer side */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '14px',
          background: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(16, 185, 129, 0.12)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '6px',
          animation: 'reFloat 4s ease-in-out infinite',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        }}>
          <Users size={18} style={{ color: '#10b981' }} />
          <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.5)', fontWeight: '700' }}>BUYER</span>
        </div>

        {/* Flow connector */}
        <div className="re-flow-line">
          <div className="re-flow-dot" />
        </div>

        {/* Escrow center */}
        <div style={{
          width: '70px', height: '70px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          border: '3px solid #030712',
          display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white',
          animation: 'reGlow 3s infinite ease-in-out',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
        }}>
          <Shield size={24} />
        </div>

        {/* Flow connector */}
        <div className="re-flow-line">
          <div className="re-flow-dot" style={{ animationDelay: '1.2s' }} />
        </div>

        {/* Seller side */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '14px',
          background: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(16, 185, 129, 0.12)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '6px',
          animation: 'reFloat 4s ease-in-out infinite', animationDelay: '1s',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        }}>
          <Home size={18} style={{ color: '#34d399' }} />
          <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.5)', fontWeight: '700' }}>SELLER</span>
        </div>
      </div>

      {/* Feature pills row */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {[
          { label: 'Escrow Funds Verified' },
          { label: 'Documents Sealed' },
          { label: 'Closing Completed' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: 'rgba(31, 41, 55, 0.6)', border: '1px solid rgba(16, 185, 129, 0.06)',
            borderRadius: '8px', padding: '6px 10px',
            animation: `reSlideUp 0.5s ease forwards`, animationDelay: `${0.5 + i * 0.15}s`, opacity: 0,
          }}>
            <CheckCircle2 size={10} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '0.68rem', color: '#d1d5db', fontWeight: '600' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ============================================================
   6. DEFAULT REAL ESTATE ANIMATION (used for general RE pages)
   ============================================================ */
const DefaultREAnim: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="re-badge"><Home size={10} /> Real Estate Solutions</div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
      {/* House + contract card */}
      <div className="re-card" style={{ width: '155px', height: '210px', animation: 'reFloat 4.5s ease-in-out infinite', position: 'relative', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <Home size={22} style={{ color: '#10b981' }} />
          <Key size={16} style={{ color: '#34d399', animation: 'reWiggle 3s ease-in-out infinite' }} />
        </div>
        <div style={{ width: '45px', height: '4px', background: '#10b981', borderRadius: '2px', opacity: 0.8 }} />
        <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.06)' }} />

        {/* Contract details */}
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

        {/* Signature box */}
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
          animation: 'rePulse 2.5s infinite ease-in-out',
        }}>
          <CheckCircle2 size={16} strokeWidth={2.5} />
        </div>
      </div>

      {/* Workflow items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {['Secure Disclosures', 'Earnest Money Escrow', 'Instant Digital Closing'].map((text, i) => (
          <div key={i} className="re-pill" style={{
            animation: `reSlideUp 0.5s ease forwards`, animationDelay: `${0.3 + i * 0.2}s`, opacity: 0,
          }}>
            <CheckCircle2 size={12} style={{ color: '#10b981' }} />
            <span className="re-pill-text">{text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default RealEstateAnimation;
