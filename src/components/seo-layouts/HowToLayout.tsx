import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, HelpCircle, CheckCircle, Sparkles } from 'lucide-react';
import type { HowToPageData } from '../../data/seoPages';
import HowToAnimation from './HowToAnimation';

interface HowToLayoutProps {
  data: HowToPageData;
}

const HowToLayout: React.FC<HowToLayoutProps> = ({ data }) => {
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
            <Sparkles size={14} /> Step-by-Step Guide
          </div>
          <h1>
            <span className="gradient-text">{data.howToTitle}</span>
          </h1>
          <p>{data.description}</p>
        </div>
      </header>

      {/* Main Container */}
      <main className="seo-container">
        <HowToAnimation slug={data.slug} />
        {/* Section 1: Numbered Steps */}
        <section style={{ marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '2.5rem', textAlign: 'center' }}>
            5 Simple Steps to Sign Online
          </h2>
          <div className="seo-steps-container">
            {data.steps.map((step, idx) => (
              <div key={idx} className="seo-step-card">
                <div className="seo-step-number">{step.stepNumber}</div>
                <div className="seo-step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Benefits */}
        <section style={{ marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '2.5rem', textAlign: 'center' }}>
            Key Benefits of Electronic Contract Executions
          </h2>
          <div className="seo-benefit-grid">
            {data.benefits.map((benefit, idx) => (
              <div key={idx} className="seo-benefit-card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div className="seo-benefit-icon" style={{ marginTop: '0.2rem', width: '36px', height: '36px', flexShrink: 0 }}>
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>Benefit #{idx + 1}</h3>
                  <p style={{ margin: 0, fontSize: '0.9375rem', lineHeight: 1.5 }}>{benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: FAQ */}
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

        {/* Section 5: References & Authoritative Sources */}
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
            <h2>Ready to Sign and Secure Your Documents?</h2>
            <p>Skip the printer. Import, layout signature variables, track, and close agreements online with DocTransfer. 100% Free.</p>
            <Link to="/dataroom" className="seo-cta-btn">
              Get Started Free <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* Related Pages */}
        <section style={{ marginTop: '5rem', borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Related Guides & Resources</h4>
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

export default HowToLayout;
