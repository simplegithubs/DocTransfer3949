import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, ShieldCheck, UserCheck, CheckCircle, FileText } from 'lucide-react';
import type { TemplatePageData } from '../../data/seoPages';
import TemplateAnimation from './TemplateAnimation';

interface TemplateLayoutProps {
  data: TemplatePageData;
}

const TemplateLayout: React.FC<TemplateLayoutProps> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="seo-page">
      {/* Breadcrumb */}
      <div className="seo-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span style={{ textTransform: 'capitalize' }}>{data.category}</span>
        <span>/</span>
        <span>{data.slug}</span>
      </div>

      {/* Hero Section */}
      <header className="seo-hero" style={{ paddingBottom: '3rem' }}>
        <div className="seo-hero-content">
          <div className="seo-hero-tag">
            <FileText size={14} /> Ready-to-Use Template
          </div>
          <h1>
            Free <span className="gradient-text">{data.templateName} Template</span> & e-Sign Draft
          </h1>
          <p>{data.description}</p>
        </div>
      </header>

      {/* Main Container */}
      <main className="seo-container" style={{ padding: '2rem 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3rem'
          }}
          className="seo-grid-layout"
        >
          {/* Left Column: Details & Preview */}
          <div>
            <TemplateAnimation slug={data.slug} />
            {/* Quick Stats Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '1rem',
                marginBottom: '2.5rem'
              }}
            >
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Clock size={20} color="var(--primary-color)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Estimated Time</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>{data.estimatedTime}</div>
                </div>
              </div>
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={20} color="#10b981" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Security Grade</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>AES-256 E2EE</div>
                </div>
              </div>
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <UserCheck size={20} color="#8b5cf6" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Audit Ready</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>Full Audit Logs</div>
                </div>
              </div>
            </div>

            {/* Document Content Preview */}
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
              Document Preview & Clauses
            </h2>
            <div
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '3rem',
                maxHeight: '520px',
                overflowY: 'auto',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                fontFamily: '"Times New Roman", Times, serif',
                marginBottom: '3rem'
              }}
            >
              <h1 style={{ fontSize: '1.5rem', textAlign: 'center', fontWeight: 'bold', margin: '0 0 2.5rem 0' }}>
                {data.templateName} Agreement
              </h1>
              {data.clauses.map((clause, idx) => (
                <div key={idx} style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '1.5rem 0 0.5rem 0' }}>
                    {clause.title}
                  </h3>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.6', textAlign: 'justify', margin: '0 0 1rem 0', textIndent: '1.5rem' }}>
                    {clause.text}
                  </p>
                </div>
              ))}
              <div
                style={{
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '1.5rem',
                  marginTop: '3rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-family)'
                }}
              >
                <div>
                  <div style={{ width: '150px', height: '1px', background: '#cbd5e1', marginBottom: '0.5rem' }} />
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Grantor Signature</span>
                </div>
                <div>
                  <div style={{ width: '150px', height: '1px', background: '#cbd5e1', marginBottom: '0.5rem' }} />
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Grantee Signature</span>
                </div>
              </div>
            </div>

            {/* What is Included Section */}
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
              What's Included in This Agreement Draft?
            </h3>
            <ul style={{ margin: '0 0 3rem 0', paddingLeft: '1.25rem', color: 'var(--text-light)', display: 'grid', gap: '0.5rem', fontSize: '0.95rem' }}>
              {data.whatsIncluded.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            {/* How to use */}
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
              How to Prepare and Sign the {data.templateName}
            </h3>
            <div className="seo-steps-container" style={{ gap: '1rem' }}>
              {data.usageSteps.map((step, idx) => (
                <div key={idx} className="seo-step-card" style={{ padding: '1.5rem' }}>
                  <div className="seo-step-number" style={{ width: '35px', height: '35px', fontSize: '1rem' }}>{idx + 1}</div>
                  <div className="seo-step-content">
                    <p style={{ margin: 0, fontWeight: 500, color: '#1e293b' }}>{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: CTA Panel */}
          <div style={{ position: 'sticky', top: '100px', alignSelf: 'start' }} className="seo-sidebar">
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>Get Started</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
                Fill and e-sign this {data.templateName} document digitally via our guided signing workflow. Or store and track view analytics.
              </p>

              <button
                onClick={() => navigate(`/dataroom?useTemplate=${data.slug}`)}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  border: 'none',
                  borderRadius: '14px',
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginBottom: '2rem',
                  boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.2)'
                }}
              >
                Use & Sign This Template <ArrowRight size={16} />
              </button>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                  <CheckCircle size={14} color="#10b981" /> No credit card required to start
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                  <CheckCircle size={14} color="#10b981" /> 100% legally binding e-Signatures
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                  <CheckCircle size={14} color="#10b981" /> Cryptographic audit trail logs
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Pages */}
        <section style={{ marginTop: '5rem', borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Related Documents & Guides</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {data.relatedSlugs.map((rSlug) => (
              <Link
                key={rSlug}
                to={rSlug.includes('vs') ? `/comparisons/${rSlug}` : rSlug.includes('template') ? `/templates/${rSlug}` : rSlug.includes('sign') ? `/how-to/${rSlug}` : `/alternatives/${rSlug}`}
                style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  color: 'var(--primary-color)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'var(--transition)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-color)';
                  e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.02)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                {rSlug.replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <style>{`
        .seo-grid-layout {
          display: grid;
        }
        @media (min-width: 992px) {
          .seo-grid-layout {
            grid-template-columns: 1.6fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TemplateLayout;
