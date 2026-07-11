import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import type { GenZPageData } from '../../data/seoPages';
import GenZAnimation from './GenZAnimation';

interface GenZLayoutProps {
  data: GenZPageData;
}

const GenZLayout: React.FC<GenZLayoutProps> = ({ data }) => {
  return (
    <div className="seo-page" style={{ background: '#090514', color: '#f8fafc' }}>
      {/* Breadcrumb */}
      <div className="seo-breadcrumb" style={{ color: '#94a3b8' }}>
        <Link to="/" style={{ color: '#a855f7' }}>Home</Link>
        <span>/</span>
        <span style={{ textTransform: 'capitalize' }}>{data.category}</span>
        <span>/</span>
        <span>{data.slug}</span>
      </div>

      {/* Hero Section */}
      <header className="seo-hero" style={{ background: 'radial-gradient(100% 100% at 50% 0%, rgba(168, 85, 247, 0.15) 0%, rgba(0, 0, 0, 0) 100%)', borderBottom: '1px solid #1e1b4b', padding: '6rem 1.5rem' }}>
        <div className="seo-hero-content">
          <div className="seo-hero-tag" style={{ background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.25)', color: '#d8b4fe' }}>
            <Zap size={14} /> {data.tagline}
          </div>
          <h1 style={{ color: 'white', fontSize: '3.5rem', letterSpacing: '-0.05em' }}>
            {data.headline.split(' ').map((word, i) => {
              if (word.toLowerCase().includes('boomer') || word.toLowerCase().includes('energy.') || word.toLowerCase().includes('clean')) {
                return <span key={i} style={{ background: 'linear-gradient(to right, #c084fc, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{word} </span>;
              }
              return <span key={i}>{word} </span>;
            })}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.25rem' }}>{data.description}</p>
        </div>
      </header>

      {/* Main Container */}
      <main className="seo-container" style={{ padding: '5rem 1.5rem' }}>
        <GenZAnimation slug={data.slug} />
        {/* Benefit Cards Grid */}
        <section style={{ marginBottom: '5rem' }}>
          <div className="seo-benefit-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {data.cards.map((card, idx) => (
              <div
                key={idx}
                className="seo-benefit-card"
                style={{
                  background: '#120b24',
                  border: '1px solid #23153c',
                  padding: '2.5rem',
                  borderRadius: '24px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#a855f7';
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(168, 85, 247, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#23153c';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.2)';
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{card.emoji}</div>
                <h3 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.75rem' }}>{card.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9375rem', lineHeight: 1.6 }}>{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Social Proof */}
        <section style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <h3 style={{ color: '#e2e8f0', fontSize: '1.1rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 700 }}>
            {data.socialProof}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', opacity: 0.6 }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Y COMBINATOR</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>TECHSTARS</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>HACKER NEWS</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>PRODUCT HUNT</span>
          </div>
        </section>

        {/* Section 3: Detailed Analysis Body Sections */}
        {data.bodySections && (
          <section className="seo-body-sections" style={{ marginBottom: '5rem', textAlign: 'left' }}>
            {data.bodySections.map((section, idx) => (
              <div key={idx} style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
                  {section.title}
                </h3>
                <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.7 }}>
                  {section.text}
                </p>
              </div>
            ))}
          </section>
        )}

        {/* Section 4: Frequently Asked Questions */}
        {data.faqs && data.faqs.length > 0 && (
          <section style={{ marginBottom: '5rem' }}>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              Frequently Asked Questions
            </h3>
            <div className="seo-faq-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              {data.faqs.map((faq, idx) => (
                <div key={idx} className="seo-faq-item" style={{ background: '#120b24', border: '1px solid #23153c', borderRadius: '16px', padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'white', marginBottom: '0.75rem' }}>{faq.question}</h4>
                  <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{faq.answer}</p>
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

        {/* Section 5: References & Authoritative Sources */}
        {data.externalLinks && data.externalLinks.length > 0 && (
          <section style={{ marginBottom: '5rem', borderTop: '1px solid #23153c', paddingTop: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem' }}>
              References & Authoritative Sources
            </h3>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0 }}>
              {data.externalLinks.map((link, idx) => (
                <li key={idx} style={{ fontSize: '1rem', color: '#cbd5e1' }}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: '#d8b4fe', fontWeight: '600', textDecoration: 'underline' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Call to Action */}
        <section className="seo-cta-section" style={{ background: 'linear-gradient(135deg, #1e113a 0%, #0d051c 100%)', border: '1px solid #3b2272', boxShadow: '0 20px 50px rgba(168, 85, 247, 0.1)' }}>
          <div className="seo-cta-content">
            <h2 style={{ color: 'white' }}>Elevate Your Startup Sharing Experience</h2>
            <p style={{ color: '#cbd5e1' }}>Send pitch decks, close rounds, sign founder stock option agreements instantly. No cost, total vibes.</p>
            <Link to="/dataroom" className="seo-cta-btn" style={{ background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)', boxShadow: '0 10px 25px rgba(168, 85, 247, 0.3)' }}>
              Launch Your Data Room <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* Related Pages */}
        <section style={{ marginTop: '5rem', borderTop: '1px solid #23153c', paddingTop: '3rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '1rem' }}>Related Founder Resources</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {data.relatedSlugs.map((rSlug) => (
              <Link
                key={rSlug}
                to={rSlug.includes('vs') ? `/comparisons/${rSlug}` : rSlug.includes('template') ? `/templates/${rSlug}` : rSlug.includes('sign') ? `/how-to/${rSlug}` : `/alternatives/${rSlug}`}
                style={{
                  background: '#120b24',
                  border: '1px solid #23153c',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  color: '#d8b4fe',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#a855f7';
                  e.currentTarget.style.backgroundColor = '#1d1038';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#23153c';
                  e.currentTarget.style.backgroundColor = '#120b24';
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

export default GenZLayout;
