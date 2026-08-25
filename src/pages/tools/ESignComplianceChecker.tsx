import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Scale, CheckCircle2, XCircle, AlertCircle, ArrowRight, ShieldCheck, FileCheck, Download } from 'lucide-react';
import SEO from '../../components/SEO';
import { getToolBySlug } from '../../data/toolsData';
import EmbedToolModal from '../../components/tools/EmbedToolModal';

interface Criterion {
  id: string;
  title: string;
  statute: string;
  description: string;
  passed: boolean;
}

const ESignComplianceChecker: React.FC = () => {
  const toolData = getToolBySlug('esign-compliance-checker');

  const [criteria, setCriteria] = useState<Criterion[]>([
    {
      id: 'intent',
      title: '1. Demonstrable Intent to Sign',
      statute: 'US ESIGN § 7006(5) & UETA § 2(8)',
      description: 'Signers must perform an affirmative action (typing name, drawing signature, clicking "Agree & Sign") demonstrating unambiguous intent.',
      passed: true
    },
    {
      id: 'consent',
      title: '2. Explicit Electronic Business Consent',
      statute: 'US ESIGN § 7001(c) & UETA § 5(b)',
      description: 'Signers must explicitly consent to conduct transactions electronically prior to executing the agreement.',
      passed: true
    },
    {
      id: 'attribution',
      title: '3. Signer Attribution & Authentication',
      statute: 'UETA § 9 & eIDAS Art. 25',
      description: 'The system must capture verifiable signer attributes such as verified email, IP address, timestamp, and device identifiers.',
      passed: true
    },
    {
      id: 'association',
      title: '4. Cryptographic Record Association',
      statute: 'US ESIGN § 7001(a) & eIDAS Art. 26',
      description: 'The signature must be cryptographically bound to the document content (e.g. SHA-256 hash) to prevent post-signature alterations.',
      passed: true
    },
    {
      id: 'audit',
      title: '5. Tamper-Evident Audit Trail & Retention',
      statute: 'US ESIGN § 7001(d) & UETA § 12',
      description: 'A permanent, downloadable audit log containing completion timestamps, signer details, and document hashes must be preserved.',
      passed: true
    }
  ]);

  const toggleCriterion = (id: string) => {
    setCriteria(prev => prev.map(c => c.id === id ? { ...c, passed: !c.passed } : c));
  };

  const results = useMemo(() => {
    const passedCount = criteria.filter(c => c.passed).length;
    const score = Math.round((passedCount / criteria.length) * 100);

    let status = 'Legally Enforceable (Court-Admissible)';
    let color = '#16a34a';
    let bg = '#dcfce7';

    if (score < 60) {
      status = 'High Legal Risk (Non-Compliant)';
      color = '#dc2626';
      bg = '#fee2e2';
    } else if (score < 100) {
      status = 'Partially Compliant (Gaps Present)';
      color = '#d97706';
      bg = '#fef3c7';
    }

    return { passedCount, score, status, color, bg };
  }, [criteria]);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title="Free ESIGN & eIDAS Compliance Checker (2026) | DocTransfer"
        description="Audit digital signature workflows against US ESIGN Act, UETA, and EU eIDAS statutory requirements. 100% Free diagnostic tool."
        keywords="esign act compliance checker, is electronic signature legal, ueta compliance test, eidas signature audit tool"
        url="https://www.doctransfer.app/tools/esign-compliance-checker"
      />

      <header style={{ height: '70px', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#4f46e5', fontWeight: '800', fontSize: '1.25rem' }}>
          <Sparkles size={22} /> DocTransfer
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/tools" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 600, fontSize: '0.95rem' }}>Tools Directory</Link>
          <Link to="/templates" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Templates</Link>
        </nav>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <Link to="/tools" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
            <ArrowLeft size={16} /> Back to Tools Directory
          </Link>
          <EmbedToolModal toolSlug="esign-compliance-checker" toolName="ESIGN & eIDAS Compliance Checker" />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#ede9fe', padding: '0.35rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', marginBottom: '1rem' }}>
            <Scale size={14} /> Statutory Legal Compliance Diagnostic
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            ESIGN & eIDAS Legal Compliance Checker
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '700px', margin: '0 auto' }}>
            Evaluate your digital contract and signature workflows against mandatory statutory requirements under the US ESIGN Act, UETA, and EU eIDAS regulations.
          </p>
        </div>

        {/* Diagnostic Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', marginBottom: '3rem' }}>
          
          {/* Checklist Column */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} color="#4f46e5" /> 5-Point Legal Validity Checklist
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {criteria.map(c => (
                <div
                  key={c.id}
                  onClick={() => toggleCriterion(c.id)}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: `2px solid ${c.passed ? '#a7f3d0' : '#fecaca'}`,
                    background: c.passed ? '#f0fdf4' : '#fff1f2',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: c.passed ? '#065f46' : '#991b1b', margin: 0 }}>
                      {c.title}
                    </h3>
                    {c.passed ? <CheckCircle2 size={20} color="#16a34a" /> : <XCircle size={20} color="#dc2626" />}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', display: 'inline-block', marginBottom: '0.4rem' }}>
                    Statute: {c.statute}
                  </span>
                  <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                    {c.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Results Scorecard Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Legal Admissibility Rating
              </div>
              <div style={{ fontSize: '4rem', fontWeight: '900', color: results.color, lineHeight: 1, marginBottom: '0.75rem' }}>
                {results.score}%
              </div>
              <div style={{ display: 'inline-block', background: results.bg, color: results.color, padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '1.5rem' }}>
                {results.status}
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>US ESIGN Act Compliance:</span>
                  <strong style={{ color: results.score >= 80 ? '#16a34a' : '#dc2626' }}>{results.score >= 80 ? 'Passed' : 'At Risk'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>US UETA (49 States):</span>
                  <strong style={{ color: results.score >= 80 ? '#16a34a' : '#dc2626' }}>{results.score >= 80 ? 'Passed' : 'At Risk'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>EU eIDAS Standard:</span>
                  <strong style={{ color: results.score === 100 ? '#16a34a' : '#d97706' }}>{results.score === 100 ? 'Advanced Valid' : 'Simple Only'}</strong>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px', textAlign: 'left' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileCheck size={14} color="#4f46e5" /> DocTransfer Guarantee
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                  DocTransfer satisfies all 5 statutory criteria by default on every free transaction, providing automated SHA-256 tamper-proof audit certificates.
                </p>
              </div>

              <Link
                to="/signup"
                style={{
                  marginTop: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: '#4f46e5',
                  color: 'white',
                  padding: '0.85rem 1.5rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                }}
              >
                Send Compliant E-Sign Free <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* FAQs */}
        {toolData?.faqs && (
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {toolData.faqs.map((faq, i) => (
                <div key={i} style={{ borderBottom: i < toolData.faqs.length - 1 ? '1px solid #f1f5f9' : 'none', paddingBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>{faq.question}</h3>
                  <p style={{ color: '#64748b', lineHeight: 1.6, margin: 0 }}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ESignComplianceChecker;
