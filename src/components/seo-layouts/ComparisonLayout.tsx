import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, X, Shield, Sparkles, HelpCircle, CheckCircle, AlertCircle } from 'lucide-react';
import type { ComparisonPageData } from '../../data/seoPages';

interface ComparisonLayoutProps {
  data: ComparisonPageData;
}

const ComparisonLayout: React.FC<ComparisonLayoutProps> = ({ data }) => {
  const getRelatedAlternatives = (slug: string, competitor: string) => {
    const compLower = competitor.toLowerCase();
    if (compLower.includes('docusign') || slug.includes('docusign')) {
      return [
        { name: 'DocuSign Alternatives for Legal Teams', slug: 'docusign-alternatives-legal' },
        { name: 'Free DocuSign Alternatives', slug: 'free-docusign-alternatives' },
        { name: 'Enterprise DocuSign Alternatives', slug: 'enterprise-docusign-alternatives' },
        { name: 'DocuSign Alternatives for Gen Z', slug: 'docusign-alternatives-gen-z' }
      ];
    } else if (compLower.includes('pandadoc') || slug.includes('pandadoc')) {
      return [
        { name: 'PandaDoc Alternatives for Startups', slug: 'pandadoc-alternatives-startups' },
        { name: 'Free DocuSign & PandaDoc Alternatives', slug: 'free-docusign-alternatives' }
      ];
    } else {
      return [
        { name: 'Free E-Signature Alternatives', slug: 'free-docusign-alternatives' },
        { name: 'Modern E-Signature Guides for Gen Z', slug: 'docusign-alternatives-gen-z' }
      ];
    }
  };

  return (
    <div className="seo-page">
      {/* Breadcrumb */}
      <div className="seo-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/comparisons">Comparisons</Link>
        <span>/</span>
        <span>{data.slug}</span>
      </div>

      {/* Hero Section */}
      <header className="seo-hero">
        <div className="seo-hero-content">
          <div className="seo-hero-tag">
            <Sparkles size={14} /> Head-to-Head Comparison
          </div>
          <h1>
            DocTransfer vs <span className="gradient-text">{data.competitorName}</span>
          </h1>
          <p>{data.description}</p>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="seo-container">
        {data.imageUrl && (
          <div className="seo-hero-image-wrapper" style={{ marginBottom: '3rem', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <img src={data.imageUrl} alt={data.imageAlt} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
          </div>
        )}
        {/* Section 1: Overview */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', textAlign: 'center' }}>
            Comparison Overview
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.7, textAlign: 'center' }}>
            {data.overview}
          </p>
        </section>

        {/* Section 2: Side-by-Side Detailed Capabilities (Pricing, Features, Integrations) */}
        <section style={{ marginBottom: '5rem' }}>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', textAlign: 'center' }}>
            Side-by-Side Capabilities Details
          </h3>
          <div className="seo-comparison-table-wrapper" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', borderRadius: '20px', overflow: 'hidden' }}>
            <table className="seo-comparison-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '1.25rem', textAlign: 'left', fontWeight: '800', color: '#475569' }}>Capability</th>
                  <th style={{ padding: '1.25rem', textAlign: 'left', fontWeight: '800', color: '#4f46e5' }}>DocTransfer</th>
                  <th style={{ padding: '1.25rem', textAlign: 'left', fontWeight: '800', color: '#64748b' }}>{data.competitorName}</th>
                </tr>
              </thead>
              <tbody>
                {data.sideBySideTable.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.25rem', fontWeight: '700', color: '#1e293b', width: '25%' }}>{row.capability}</td>
                    <td style={{ padding: '1.25rem', color: '#312e81', background: '#f5f3ff', fontWeight: '500', width: '37.5%' }}>{row.docTransferVal}</td>
                    <td style={{ padding: '1.25rem', color: '#334155', width: '37.5%' }}>{row.competitorVal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Pros and Cons */}
        <section style={{ marginBottom: '5rem' }}>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '2rem', textAlign: 'center' }}>
            Pros & Cons Comparison
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="pros-cons-grid">
            
            {/* DocTransfer Column */}
            <div style={{ background: '#f5f3ff', border: '1px solid #e9d5ff', borderRadius: '24px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.01)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.4rem', background: '#c7d2fe', borderRadius: '8px', color: '#4f46e5' }}>
                  <Sparkles size={18} />
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#312e81', margin: 0 }}>DocTransfer</h4>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h5 style={{ color: '#16a34a', fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Pros</h5>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem' }}>
                  {data.prosCons.docTransferPros.map((pro, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', fontSize: '0.95rem', color: '#475569' }}>
                      <CheckCircle size={16} color="#16a34a" style={{ marginTop: '0.15rem', flexShrink: 0 }} /> {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 style={{ color: '#dc2626', fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Cons</h5>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem' }}>
                  {data.prosCons.docTransferCons.map((con, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', fontSize: '0.95rem', color: '#64748b' }}>
                      <AlertCircle size={16} color="#94a3b8" style={{ marginTop: '0.15rem', flexShrink: 0 }} /> {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Competitor Column */}
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.01)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.4rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                  <Shield size={18} />
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{data.competitorName}</h4>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h5 style={{ color: '#16a34a', fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Pros</h5>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem' }}>
                  {data.prosCons.competitorPros.map((pro, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', fontSize: '0.95rem', color: '#475569' }}>
                      <CheckCircle size={16} color="#16a34a" style={{ marginTop: '0.15rem', flexShrink: 0 }} /> {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 style={{ color: '#dc2626', fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Cons</h5>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem' }}>
                  {data.prosCons.competitorCons.map((con, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', fontSize: '0.95rem', color: '#64748b' }}>
                      <X size={16} color="#dc2626" style={{ marginTop: '0.15rem', flexShrink: 0 }} /> {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* Section 4: Direct Feature Checklist Matrix */}
        <section style={{ marginBottom: '5rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', textAlign: 'center' }}>
            Direct Feature Comparison Matrix
          </h3>
          <div className="seo-comparison-table-wrapper">
            <table className="seo-comparison-table">
              <thead>
                <tr>
                  <th style={{ width: '30%' }}>Capability</th>
                  <th style={{ width: '20%' }}>DocTransfer</th>
                  <th style={{ width: '20%' }}>{data.competitorName}</th>
                  <th style={{ width: '30%' }}>Comparison Notes</th>
                </tr>
              </thead>
              <tbody>
                {data.matrix.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, color: '#1e293b' }}>{item.feature}</td>
                    <td>
                      {item.docTransfer ? (
                        <span className="seo-badge-check"><Check size={16} /></span>
                      ) : (
                        <span className="seo-badge-cross"><X size={16} /></span>
                      )}
                    </td>
                    <td>
                      {item.competitor ? (
                        <span className="seo-badge-check" style={{ color: '#64748b', backgroundColor: '#e2e8f0' }}><Check size={16} /></span>
                      ) : (
                        <span className="seo-badge-cross"><X size={16} /></span>
                      )}
                    </td>
                    <td style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Verdict */}
        <section style={{ marginBottom: '5rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)', 
            border: '1px solid #c7d2fe', 
            borderRadius: '24px', 
            padding: '2.5rem',
            textAlign: 'center',
            boxShadow: '0 10px 30px -10px rgba(99, 102, 241, 0.1)'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e1b4b', marginBottom: '1rem' }}>
              The Verdict
            </h3>
            <p style={{ fontSize: '1.2rem', color: '#312e81', fontWeight: '600', lineHeight: 1.6, maxWidth: '800px', margin: '0 auto' }}>
              {data.verdict}
            </p>
          </div>
        </section>

        {/* Section 5b: Recommended Alternative Guides (Internal Linking: Comparisons -> Alternatives) */}
        <section style={{ marginBottom: '5rem', borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', textAlign: 'center' }}>
            Recommended Alternative Guides
          </h3>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-light)', maxWidth: '800px', margin: '0 auto 2rem', lineHeight: 1.7, textAlign: 'center' }}>
            If you are evaluating {data.competitorName}, you might also want to explore our deep-dive analysis on the best platforms tailored to specific use cases, company sizes, and features.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
            {getRelatedAlternatives(data.slug, data.competitorName).map((alt, idx) => (
              <Link
                key={idx}
                to={`/alternatives/${alt.slug}`}
                style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  textDecoration: 'none',
                  color: '#1e293b',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.01)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-color)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(99, 102, 241, 0.08)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.01)';
                }}
              >
                <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#0f172a', lineHeight: 1.4 }}>{alt.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: '600' }}>
                  Read Guide <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 5c: Detailed Analysis Body Sections */}
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

        {/* Section 6: FAQs */}
        <section style={{ marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <HelpCircle size={24} color="var(--primary-color)" /> Frequently Asked Questions
          </h2>
          <div className="seo-faq-grid">
            {data.faqs.map((faq, idx) => (
              <div key={idx} className="seo-faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6b: References & Authoritative Sources */}
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
              Try DocTransfer Free <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* Related Pages */}
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

      <style>{`
        .pros-cons-grid {
          display: grid;
        }
        @media (min-width: 768px) {
          .pros-cons-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ComparisonLayout;
