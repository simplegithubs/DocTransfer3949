import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, X, Shield, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import type { AlternativePageData } from '../../data/seoPages';
import AlternativeAnimation from './AlternativeAnimation';

interface AlternativeLayoutProps {
  data: AlternativePageData;
}

const AlternativeLayout: React.FC<AlternativeLayoutProps> = ({ data }) => {
  return (
    <div className="seo-page">
      {/* Breadcrumb */}
      <div className="seo-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/alternatives">Alternatives</Link>
        <span>/</span>
        <span>{data.slug}</span>
      </div>

      {/* Hero Section */}
      <header className="seo-hero">
        <div className="seo-hero-content">
          <div className="seo-hero-tag">
            <Sparkles size={14} /> Free Alternative
          </div>
          <h1>
            Best Free <span className="gradient-text">{data.competitorName} Alternative</span> for Secure E-Signing
          </h1>
          <p>{data.valueProp}</p>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="seo-container">
        <AlternativeAnimation slug={data.slug} />
        {/* Section 1: Introduction */}
        <section style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
            Why Switch from {data.competitorName} to DocTransfer?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.7 }}>
            {data.description} DocTransfer delivers the same robust e-signature capability and global legal compliance, but adds advanced zero-knowledge encryption and page-by-page tracking analytics—completely free for core features.
          </p>
        </section>

        {/* Section 2: Detailed Review of the Alternatives (Detailed List) */}
        {data.alternativesList && (
          <section style={{ marginBottom: '5rem' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '2.5rem', textAlign: 'center' }}>
              Detailed Review of the Top Alternatives
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {data.alternativesList.map((item, idx) => (
                <div 
                  key={idx} 
                  style={{
                    background: item.isFirst ? '#f5f3ff' : 'white',
                    border: item.isFirst ? '2px solid #c7d2fe' : '1px solid #e2e8f0',
                    borderRadius: '24px',
                    padding: '2.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
                    position: 'relative'
                  }}
                >
                  {item.isFirst && (
                    <div style={{
                      position: 'absolute',
                      top: '-15px',
                      left: '2rem',
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                      color: 'white',
                      padding: '0.35rem 1.25rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
                    }}>
                      #1 Recommended Alternative
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                        {idx + 1}. {item.name}
                      </h4>
                      {item.highlightBenefit && (
                        <p style={{ color: '#4f46e5', fontWeight: '700', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                          ★ {item.highlightBenefit}
                        </p>
                      )}
                    </div>
                    <div style={{ background: item.isFirst ? '#ede9fe' : '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '12px', fontWeight: '700', color: item.isFirst ? '#4f46e5' : '#475569', fontSize: '0.9rem' }}>
                      Pricing: {item.pricing}
                    </div>
                  </div>

                  <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#475569', margin: 0 }}>
                    {item.description}
                  </p>

                  {item.isFirst && (
                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-start' }}>
                      <Link 
                        to="/dataroom" 
                        style={{ 
                          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', 
                          color: 'white', 
                          padding: '0.75rem 1.5rem', 
                          borderRadius: '12px', 
                          fontWeight: '700', 
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
                        }}
                      >
                        Start Free Trial <ArrowRight size={16} />
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 3: Comparison Feature Table */}
        <section style={{ marginBottom: '5rem' }}>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', textAlign: 'center' }}>
            Feature Breakdown: DocTransfer vs {data.competitorName}
          </h3>
          <div className="seo-comparison-table-wrapper">
            <table className="seo-comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>DocTransfer</th>
                  <th>{data.competitorName}</th>
                </tr>
              </thead>
              <tbody>
                {data.comparisonFeatures.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, color: '#1e293b' }}>{item.feature}</td>
                    <td>
                      {typeof item.docTransfer === 'boolean' ? (
                        item.docTransfer ? (
                          <span className="seo-badge-check"><Check size={16} /></span>
                        ) : (
                          <span className="seo-badge-cross"><X size={16} /></span>
                        )
                      ) : (
                        <span style={{ color: '#10b981', fontWeight: 600 }}>{item.docTransfer}</span>
                      )}
                    </td>
                    <td>
                      {typeof item.competitor === 'boolean' ? (
                        item.competitor ? (
                          <span className="seo-badge-check" style={{ color: '#64748b', backgroundColor: '#e2e8f0' }}><Check size={16} /></span>
                        ) : (
                          <span className="seo-badge-cross"><X size={16} /></span>
                        )
                      ) : (
                        <span style={{ color: '#ef4444', fontWeight: 600 }}>{item.competitor}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Cost Difference (Only for legacy pages where pricingDocTransfer exists) */}
        {data.pricingDocTransfer && data.pricingCompetitor && (
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>DocTransfer Pricing</h4>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginBottom: '1rem' }}>Free Forever</p>
              <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: 1.6 }}>{data.pricingDocTransfer}</p>
            </div>
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>{data.competitorName} Pricing</h4>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444', marginBottom: '1rem' }}>Paid Tiers</p>
              <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: 1.6 }}>{data.pricingCompetitor}</p>
            </div>
          </section>
        )}

        {/* Section 5: Migration Steps (Only for legacy pages where migrationSteps exists) */}
        {data.migrationSteps && (
          <section style={{ marginBottom: '5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '2rem', textAlign: 'center' }}>
              Switching is Easy: 4 Steps to Migrate
            </h3>
            <div className="seo-steps-container">
              {data.migrationSteps.map((step: any, idx: number) => (
                <div key={idx} className="seo-step-card">
                  <div className="seo-step-number">{idx + 1}</div>
                  <div className="seo-step-content">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 6: Verdict */}
        <section style={{ background: 'rgba(99, 102, 241, 0.03)', border: '1px solid rgba(99, 102, 241, 0.1)', padding: '3rem', borderRadius: '20px', marginBottom: '5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>The Verdict</h3>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-color)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.7, fontStyle: 'italic' }}>
            "{data.verdict}"
          </p>
        </section>

        {/* Section 7: Detailed Analysis Body Sections */}
        {data.bodySections && (
          <section className="seo-body-sections" style={{ marginBottom: '5rem', textAlign: 'left' }}>
            {data.bodySections.map((section, idx) => (
              <div key={idx} style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
                  {section.title}
                </h3>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-light)', lineHeight: 1.7 }}>
                  {section.text}
                </p>
              </div>
            ))}
          </section>
        )}

        {/* Section 8: Frequently Asked Questions */}
        {data.faqs && data.faqs.length > 0 && (
          <section style={{ marginBottom: '5rem' }}>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              Frequently Asked Questions
            </h3>
            <div className="seo-faq-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              {data.faqs.map((faq, idx) => (
                <div key={idx} className="seo-faq-item" style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>{faq.question}</h4>
                  <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 9: References & Authoritative Sources */}
        {data.externalLinks && data.externalLinks.length > 0 && (
          <section style={{ marginBottom: '5rem', borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
              References & Authoritative Sources
            </h3>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0 }}>
              {data.externalLinks.map((link, idx) => (
                <li key={idx} style={{ fontSize: '1rem', color: '#475569' }}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'underline' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Call to Action */}
        <section className="seo-cta-section" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
          <div className="seo-cta-content">
            <h2>Ready to experience DocTransfer?</h2>
            <p>Get full access to E2E encrypted file sharing, custom links, templates, and unlimited signatures without high enterprise cost.</p>
            <Link to="/dataroom" className="seo-cta-btn" style={{ background: 'white', color: '#4f46e5' }}>
              Start Free Trial <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* Related Pages / Links */}
        <section style={{ marginTop: '5rem', borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Related Articles & Alternatives</h4>
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
    </div>
  );
};

export default AlternativeLayout;
