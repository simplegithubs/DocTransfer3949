import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Sparkles, CheckCircle2, ArrowRight, Shield } from 'lucide-react';

interface EmbeddedNDAGeneratorProps {
  title?: string;
  defaultDisclosingParty?: string;
}

const EmbeddedNDAGenerator: React.FC<EmbeddedNDAGeneratorProps> = ({
  title = "Free Interactive NDA Generator",
  defaultDisclosingParty = ""
}) => {
  const [disclosingParty, setDisclosingParty] = useState(defaultDisclosingParty);
  const [receivingParty, setReceivingParty] = useState('');
  const [governingState, setGoverningState] = useState('California');
  const [durationYears, setDurationYears] = useState('2');
  const [ndaType, setNdaType] = useState<'unilateral' | 'mutual'>('unilateral');
  const [copied, setCopied] = useState(false);

  const effectiveDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const generatedNDA = `NON-DISCLOSURE AGREEMENT (${ndaType.toUpperCase()})

This Non-Disclosure Agreement ("Agreement") is entered into as of ${effectiveDate} ("Effective Date"), by and between:

DISCLOSING PARTY: ${disclosingParty || '[Disclosing Party Legal Name]'}
RECEIVING PARTY: ${receivingParty || '[Receiving Party Legal Name]'}

1. PURPOSE OF DISCLOSURE
The Disclosing Party agrees to share certain confidential business, technical, and proprietary information ("Confidential Information") solely for the purpose of evaluating a potential business relationship or transaction between the Parties.

2. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party agrees to hold all Confidential Information in strict confidence and shall not disclose, copy, reproduce, or distribute such Information to any third party without the prior written consent of the Disclosing Party.

3. TERM AND DURATION
The obligations of confidentiality set forth in this Agreement shall remain in effect for a period of ${durationYears} (${durationYears === '1' ? 'one' : durationYears === '2' ? 'two' : 'three'}) years from the Effective Date.

4. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of the State of ${governingState}, without regard to its conflict of law principles.

IN WITNESS WHEREOF, the Parties have executed this Non-Disclosure Agreement as of the Effective Date.

Disclosing Party Signature: _______________________ Date: ______________
Receiving Party Signature:  _______________________ Date: ______________`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedNDA);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div style={{
      background: '#0a0f1d',
      color: 'white',
      borderRadius: '24px',
      padding: '2.5rem 2rem',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      boxShadow: '0 20px 40px -15px rgba(99, 102, 241, 0.25)',
      marginBottom: '3rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Widget Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            <Sparkles size={14} /> Interactive Legal Tool
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', margin: 0 }}>
            {title}
          </h3>
        </div>
        <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={16} color="#34d399" /> eIDAS & ESIGN Compliant
        </div>
      </div>

      {/* Form Controls & Live Preview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        
        {/* Controls Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>
              Agreement Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setNdaType('unilateral')}
                style={{
                  padding: '0.6rem',
                  borderRadius: '10px',
                  border: ndaType === 'unilateral' ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                  background: ndaType === 'unilateral' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.03)',
                  color: ndaType === 'unilateral' ? 'white' : '#94a3b8',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                1-Way (Unilateral)
              </button>
              <button
                type="button"
                onClick={() => setNdaType('mutual')}
                style={{
                  padding: '0.6rem',
                  borderRadius: '10px',
                  border: ndaType === 'mutual' ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                  background: ndaType === 'mutual' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.03)',
                  color: ndaType === 'mutual' ? 'white' : '#94a3b8',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                2-Way (Mutual)
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>
              Disclosing Party (Company / Individual)
            </label>
            <input
              type="text"
              placeholder="e.g. Acme Corp Inc."
              value={disclosingParty}
              onChange={(e) => setDisclosingParty(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>
              Receiving Party (Recipient / Contractor)
            </label>
            <input
              type="text"
              placeholder="e.g. Jane Doe"
              value={receivingParty}
              onChange={(e) => setReceivingParty(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>
                Governing State
              </label>
              <select
                value={governingState}
                onChange={(e) => setGoverningState(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: '#1e293b',
                  color: 'white',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                <option value="California">California</option>
                <option value="Delaware">Delaware</option>
                <option value="New York">New York</option>
                <option value="Texas">Texas</option>
                <option value="Florida">Florida</option>
                <option value="United Kingdom">United Kingdom</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>
                Term Length
              </label>
              <select
                value={durationYears}
                onChange={(e) => setDurationYears(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: '#1e293b',
                  color: 'white',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3 Years</option>
                <option value="5">5 Years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Document Preview Column */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Live Document Preview
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Updates dynamically</span>
          </div>

          <textarea
            readOnly
            value={generatedNDA}
            style={{
              width: '100%',
              flex: 1,
              minHeight: '220px',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: '#030712',
              color: '#38bdf8',
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: '0.78rem',
              lineHeight: 1.5,
              resize: 'none',
              marginBottom: '1rem',
              outline: 'none'
            }}
          />

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: copied ? '#059669' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                padding: '0.75rem 1.25rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {copied ? <><CheckCircle2 size={16} /> Copied to Clipboard!</> : <><FileText size={16} /> Copy Legal Text</>}
            </button>

            <Link
              to="/dataroom"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                padding: '0.75rem 1.25rem',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.15)'
              }}
            >
              Send for E-Sign <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmbeddedNDAGenerator;
