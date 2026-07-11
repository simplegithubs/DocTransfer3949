import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertCircle, Shield, Award, Sparkles } from 'lucide-react';
import type { IndustryPageData } from '../../data/seoPages';
import IndustryAnimation from './IndustryAnimation';

interface IndustryLayoutProps {
  data: IndustryPageData;
}

const IndustryLayout: React.FC<IndustryLayoutProps> = ({ data }) => {
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
      <header className="seo-hero">
        <div className="seo-hero-content">
          <div className="seo-hero-tag">
            <Shield size={14} /> Industry Solution
          </div>
          <h1>
            Secure Sharing & E-Sign for <span className="gradient-text">{data.industryName}</span>
          </h1>
          <p>{data.description}</p>
        </div>
      </header>

      {/* Main Container */}
      <main className="seo-container">
        <IndustryAnimation slug={data.slug} />
        {/* Stats Grid */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            marginBottom: '5rem'
          }}
        >
          {data.stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--border-radius)',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.01)'
              }}
            >
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 600 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* Section 1: Pain Points */}
        <section style={{ marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '2.5rem', textAlign: 'center' }}>
            Critical Pain Points in {data.industryName} Workflows
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {data.painPoints.map((pain, idx) => (
              <div
                key={idx}
                style={{
                  background: 'white',
                  border: '1px solid rgba(239, 68, 68, 0.15)',
                  borderRadius: 'var(--border-radius)',
                  padding: '2rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.01)'
                }}
              >
                <div style={{ color: '#ef4444', marginTop: '0.2rem' }}>
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Challenge #{idx + 1}</h3>
                  <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9375rem', lineHeight: 1.5 }}>{pain}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Features */}
        <section style={{ marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '2.5rem', textAlign: 'center' }}>
            How DocTransfer Solves These Challenges
          </h2>
          <div className="seo-benefit-grid">
            {data.features.map((feat, idx) => (
              <div key={idx} className="seo-benefit-card">
                <div className="seo-benefit-icon">
                  <Sparkles size={22} />
                </div>
                <h3>{feat.title}</h3>
                <p>{feat.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Compliance Notes */}
        <section
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(168, 85, 247, 0.03) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            padding: '3rem',
            borderRadius: '24px',
            marginBottom: '5rem',
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'center',
            flexDirection: 'column',
            textAlign: 'center'
          }}
          className="compliance-card"
        >
          <div style={{ width: '56px', height: '56px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', boxShadow: '0 4px 10px rgba(99,102,241,0.1)' }}>
            <Award size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Regulatory Compliance</h3>
            <p style={{ margin: 0, color: 'var(--text-color)', maxWidth: '750px', fontSize: '1.05rem', lineHeight: 1.6 }}>
              {data.complianceNotes}
            </p>
          </div>
        </section>

        {/* Section 4: Detailed Analysis Body Sections */}
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

        {/* Section 5: Frequently Asked Questions */}
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
            <style>{`
              @media (min-width: 768px) {
                .seo-faq-grid {
                  grid-template-columns: 1fr 1fr !important;
                }
              }
            `}</style>
          </section>
        )}

        {/* Section 6: References & Authoritative Sources */}
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
        <section className="seo-cta-section">
          <div className="seo-cta-content">
            <h2>Accelerate Your {data.industryName} Operations</h2>
            <p>Ensure legal security, track reader behavior clause-by-clause, and collect signatures instantly. Free forever.</p>
            <Link to="/dataroom" className="seo-cta-btn">
              Get Started Free <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* Related Pages */}
        <section style={{ marginTop: '5rem', borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Related Industry Solutions</h4>
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

export default IndustryLayout;
