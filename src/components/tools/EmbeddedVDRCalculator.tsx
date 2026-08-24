import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, DollarSign, ArrowRight, ShieldCheck, Check } from 'lucide-react';

const EmbeddedVDRCalculator: React.FC = () => {
  const [dataGb, setDataGb] = useState<number>(5);
  const [userCount, setUserCount] = useState<number>(10);
  const [durationMonths, setDurationMonths] = useState<number>(3);

  // Legacy VDR Cost Estimates ($ per page/GB pricing models like Intralinks / Ansarada)
  const legacyBaseFee = 1500;
  const legacyStorageFee = dataGb * 120 * durationMonths;
  const legacyUserFee = userCount > 5 ? (userCount - 5) * 150 * durationMonths : 0;
  const legacyTotalCost = legacyBaseFee + legacyStorageFee + legacyUserFee;

  // DocTransfer Pricing ($0 - $19 / mo flat tier)
  const docTransferTotalCost = 0; // Free forever baseline tier
  const totalSavings = legacyTotalCost - docTransferTotalCost;

  return (
    <div style={{
      background: '#0a0f1d',
      color: 'white',
      borderRadius: '24px',
      padding: '2.5rem 2rem',
      border: '1px solid rgba(52, 211, 153, 0.3)',
      boxShadow: '0 20px 40px -15px rgba(52, 211, 153, 0.2)',
      marginBottom: '3rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            <Sparkles size={14} /> Interactive Cost Calculator
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', margin: 0 }}>
            Virtual Data Room (VDR) Cost Comparison Calculator
          </h3>
        </div>
        <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <DollarSign size={16} color="#34d399" /> Save up to $5,000+ per deal
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        
        {/* Controls Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' }}>Deal Storage Size</label>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399' }}>{dataGb} GB</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              value={dataGb}
              onChange={(e) => setDataGb(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#34d399', cursor: 'pointer' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' }}>Invited Deal Room Users</label>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399' }}>{userCount} Users</span>
            </div>
            <input
              type="range"
              min="2"
              max="50"
              value={userCount}
              onChange={(e) => setUserCount(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#34d399', cursor: 'pointer' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' }}>Deal Room Active Duration</label>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399' }}>{durationMonths} Months</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              value={durationMonths}
              onChange={(e) => setDurationMonths(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#34d399', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Results Card Column */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#fca5a5', fontWeight: 700, textTransform: 'uppercase' }}>Legacy VDR Providers</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444', marginTop: '0.25rem' }}>
                  ${legacyTotalCost.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem' }}>Per-page / GB overage fees</div>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#6ee7b7', fontWeight: 700, textTransform: 'uppercase' }}>DocTransfer VDR</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', marginTop: '0.25rem' }}>
                  $0 Free
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem' }}>Unlimited guests & e-signatures</div>
              </div>
            </div>

            <div style={{ padding: '0.85rem 1rem', background: 'rgba(52, 211, 153, 0.1)', border: '1px dashed #34d399', borderRadius: '12px', textAlign: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>YOUR ESTIMATED DEAL SAVINGS: </span>
              <strong style={{ fontSize: '1.1rem', color: '#34d399', marginLeft: '0.25rem' }}>${totalSavings.toLocaleString()} USD</strong>
            </div>
          </div>

          <Link
            to="/dataroom"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              padding: '0.8rem 1.25rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
            }}
          >
            Create Free VDR Data Room <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default EmbeddedVDRCalculator;
