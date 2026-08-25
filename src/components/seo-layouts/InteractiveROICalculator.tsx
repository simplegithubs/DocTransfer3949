import React, { useState } from 'react';
import { Calculator, Sparkles, ArrowRight, ShieldCheck, DollarSign, CheckCircle2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface InteractiveROICalculatorProps {
  competitorName?: string;
}

export const InteractiveROICalculator: React.FC<InteractiveROICalculatorProps> = ({
  competitorName = 'DocSend'
}) => {
  const [teamSize, setTeamSize] = useState<number>(3);
  const [docsPerMonth, setDocsPerMonth] = useState<number>(30);

  // Pricing benchmarks:
  // DocSend Starter is $15/user/mo, Advanced is $45/user/mo (avg ~$30/user/mo)
  // DocuSign Standard is $25/user/mo
  // DocTransfer Core Plan: $0/user/mo (Free unlimited sharing & tracking)
  const isDocuSign = competitorName.toLowerCase().includes('docusign');
  const isPandaDoc = competitorName.toLowerCase().includes('pandadoc');
  
  const competitorPerUserRate = isDocuSign ? 25 : (isPandaDoc ? 29 : 35);
  const competitorMonthlyCost = teamSize * competitorPerUserRate;
  const competitorAnnualCost = competitorMonthlyCost * 12;

  const docTransferMonthlyCost = 0; // Free Core Tier
  const annualSavings = competitorAnnualCost - (docTransferMonthlyCost * 12);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      borderRadius: '24px',
      padding: '2.5rem 2rem',
      color: '#ffffff',
      margin: '3.5rem 0',
      boxShadow: '0 20px 40px -15px rgba(79, 70, 229, 0.25)',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(99, 102, 241, 0.2)',
          padding: '0.4rem 1rem',
          borderRadius: '9999px',
          color: '#a5b4fc',
          fontSize: '0.875rem',
          fontWeight: 700,
          marginBottom: '0.75rem',
          border: '1px solid rgba(165, 180, 252, 0.3)'
        }}>
          <Calculator size={15} /> Real-Time Cost & ROI Calculator
        </div>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0 0.5rem 0' }}>
          See How Much You Save vs {competitorName}
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.975rem', maxWidth: '600px', margin: '0 auto' }}>
          Compare the total cost of ownership for secure document sharing, page analytics, and e-signatures.
        </p>
      </div>

      {/* Sliders Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        marginBottom: '2.5rem'
      }}>
        {/* Slider 1: Team Size */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e2e8f0' }}>Active Team Members</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#818cf8' }}>{teamSize} {teamSize === 1 ? 'user' : 'users'}</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={teamSize}
            onChange={(e) => setTeamSize(Number(e.target.value))}
            style={{
              width: '100%',
              height: '8px',
              borderRadius: '4px',
              background: '#334155',
              accentColor: '#6366f1',
              cursor: 'pointer'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '0.4rem' }}>
            <span>1 user</span>
            <span>15 users</span>
            <span>30+ users</span>
          </div>
        </div>

        {/* Slider 2: Documents Sent */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e2e8f0' }}>Monthly Documents Sent</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>{docsPerMonth} docs</span>
          </div>
          <input
            type="range"
            min="5"
            max="200"
            step="5"
            value={docsPerMonth}
            onChange={(e) => setDocsPerMonth(Number(e.target.value))}
            style={{
              width: '100%',
              height: '8px',
              borderRadius: '4px',
              background: '#334155',
              accentColor: '#38bdf8',
              cursor: 'pointer'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '0.4rem' }}>
            <span>5 docs</span>
            <span>100 docs</span>
            <span>200+ docs</span>
          </div>
        </div>
      </div>

      {/* Comparison Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Competitor Cost Card */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '16px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {competitorName} Cost
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#ffffff', margin: '0.5rem 0' }}>
            ${competitorMonthlyCost}<span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 500 }}>/mo</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
            ${competitorAnnualCost.toLocaleString()} billed annually
          </div>
        </div>

        {/* DocTransfer Cost Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.25) 0%, rgba(16, 185, 129, 0.15) 100%)',
          border: '2px solid #10b981',
          borderRadius: '16px',
          padding: '1.5rem',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#10b981',
            color: '#064e3b',
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '2px 10px',
            borderRadius: '9999px',
            textTransform: 'uppercase'
          }}>
            100% Free Core Tier
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            DocTransfer Cost
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#34d399', margin: '0.5rem 0' }}>
            $0<span style={{ fontSize: '1rem', color: '#a7f3d0', fontWeight: 500 }}>/forever</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 700 }}>
            🎉 You save <span style={{ color: '#10b981', fontSize: '1rem' }}>${annualSavings.toLocaleString()}</span> every year!
          </div>
        </div>
      </div>

      {/* Feature Bullet Points */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '1.25rem 1.5rem',
        borderRadius: '14px',
        marginBottom: '2rem',
        fontSize: '0.875rem',
        color: '#cbd5e1'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} color="#10b981" /> Client-Side AES-256 E2EE
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} color="#10b981" /> Page-by-Page Duration Tracking
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} color="#10b981" /> Unlimited Legally Binding e-Signatures
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} color="#10b981" /> Dynamic Scribe Watermarks
        </div>
      </div>

      {/* CTA Button */}
      <div style={{ textAlign: 'center' }}>
        <Link
          to="/signup"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            color: '#ffffff',
            padding: '1rem 2.25rem',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '1.05rem',
            textDecoration: 'none',
            boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.5)',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          Start Saving ${annualSavings.toLocaleString()}/yr Free <ArrowRight size={18} />
        </Link>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.75rem' }}>
          No credit card required • Instant access in 30 seconds
        </div>
      </div>
    </div>
  );
};

export default InteractiveROICalculator;
