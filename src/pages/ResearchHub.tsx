import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BarChart3, Clock, Calendar, TrendingUp, TrendingDown, Minus, Filter } from 'lucide-react';
import SEO from '../components/SEO';
import { researchReports, type ResearchReport } from '../data/researchData';
import ResearchAnimation from '../components/seo-layouts/ResearchAnimation';

type CategoryFilter = 'all' | ResearchReport['category'];

const categoryLabels: Record<CategoryFilter, string> = {
  all: 'All Reports',
  fundraising: 'Fundraising',
  security: 'Security',
  legal: 'Legal',
  analytics: 'Analytics'
};

const categoryColors: Record<ResearchReport['category'], { bg: string; text: string }> = {
  fundraising: { bg: '#ede9fe', text: '#7c3aed' },
  security: { bg: '#d1fae5', text: '#059669' },
  legal: { bg: '#fef3c7', text: '#d97706' },
  analytics: { bg: '#e0e7ff', text: '#4338ca' }
};

const ResearchHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const filteredReports = useMemo(() => {
    if (activeCategory === 'all') return researchReports;
    return researchReports.filter(r => r.category === activeCategory);
  }, [activeCategory]);

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "name": "DocTransfer Research & Data Reports",
        "description": "Original research reports on document sharing, pitch deck analytics, fundraising trends, and business document security. Backed by real platform data.",
        "url": "https://www.doctransfer.app/research",
        "publisher": {
          "@type": "Organization",
          "name": "DocTransfer",
          "url": "https://www.doctransfer.app"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.doctransfer.app" },
          { "@type": "ListItem", "position": 2, "name": "Research" }
        ]
      }
    ]
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title="Research & Data Reports — Original Insights on Document Sharing | DocTransfer"
        description="Original research reports backed by real platform data. Pitch deck benchmarks, fundraising trends, document security statistics, and engagement analytics."
        keywords="document sharing research, pitch deck benchmarks, startup fundraising data, document analytics, NDA statistics, document security report"
        url="https://www.doctransfer.app/research"
        schema={schemaGraph}
      />

      {/* Header / Navbar */}
      <header style={{ height: '70px', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#4f46e5', fontWeight: '800', fontSize: '1.25rem' }}>
          <Sparkles size={22} /> DocTransfer
        </Link>
        <nav style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <Link to="/research" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 600, fontSize: '0.9rem' }}>Research</Link>
          <Link to="/tools" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>Tools</Link>
          <Link to="/integrations" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>Integrations</Link>
          <Link to="/glossary" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>Glossary</Link>
          <Link to="/solutions" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>Solutions</Link>
          <Link to="/docsend-alternative" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>DocSend Alternative</Link>
          <Link to="/templates" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>Templates</Link>
        </nav>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.4rem 1.25rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            <BarChart3 size={14} /> DocTransfer Research
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: 1.1, color: '#0f172a', marginBottom: '1rem' }}>
            Data-Driven <span style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Research & Insights</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#475569', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            Original research reports backed by real platform data. Benchmark your document sharing, pitch deck engagement, and security practices against industry standards.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {(Object.keys(categoryLabels) as CategoryFilter[]).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: activeCategory === cat ? '700' : '500',
                background: activeCategory === cat ? '#4f46e5' : 'white',
                color: activeCategory === cat ? 'white' : '#64748b',
                border: activeCategory === cat ? '1px solid #4f46e5' : '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat === 'all' && <Filter size={14} />}
              {categoryLabels[cat]}
              <span style={{
                background: activeCategory === cat ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                padding: '0.1rem 0.5rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '700'
              }}>
                {cat === 'all' ? researchReports.length : researchReports.filter(r => r.category === cat).length}
              </span>
            </button>
          ))}
        </div>

        {/* Reports Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          {filteredReports.map((report) => {
            const catColor = categoryColors[report.category];
            return (
              <article
                key={report.slug}
                style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onClick={() => window.location.href = `/research/${report.slug}`}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = '#c7d2fe';
                  e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(79, 70, 229, 0.12)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.02)';
                }}
              >
                {/* Card Animation */}
                <ResearchAnimation slug={report.slug} isCompact={true} />

                {/* Content */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Category Badge */}
                  <span style={{
                    display: 'inline-block',
                    background: catColor.bg,
                    color: catColor.text,
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '1rem',
                    width: 'fit-content'
                  }}>
                    {report.category}
                  </span>

                  <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.75rem 0', lineHeight: 1.3 }}>
                    {report.title}
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: '0 0 1rem 0', flex: 1 }}>
                    {report.excerpt}
                  </p>

                  {/* Key Stats Preview (show first 2) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                    {report.keyFindings.slice(0, 2).map((finding, idx) => (
                      <div key={idx} style={{
                        background: '#f8fafc',
                        borderRadius: '12px',
                        padding: '0.75rem',
                        border: '1px solid #f1f5f9'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#4f46e5' }}>
                            {finding.value}
                          </span>
                          {finding.trend === 'up' && <TrendingUp size={12} color="#22c55e" />}
                          {finding.trend === 'down' && <TrendingDown size={12} color="#ef4444" />}
                          {finding.trend === 'neutral' && <Minus size={12} color="#94a3b8" />}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.3, marginTop: '0.15rem' }}>
                          {finding.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Meta */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} /> {report.readTime}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} /> {new Date(report.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  {/* CTA */}
                  <Link
                    to={`/research/${report.slug}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      color: '#4f46e5',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                      marginTop: '1rem'
                    }}
                  >
                    Read Full Report <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <section style={{
          marginTop: '5rem',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          borderRadius: '24px',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem', position: 'relative' }}>
            Track Your Own Document Engagement
          </h2>
          <p style={{ opacity: 0.9, marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem auto', position: 'relative' }}>
            See exactly who views your documents, how long they spend on each page, and when they return. Free page-level analytics with DocTransfer.
          </p>
          <Link
            to="/dataroom"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'white',
              color: '#4f46e5',
              padding: '0.85rem 1.75rem',
              borderRadius: '14px',
              fontWeight: '700',
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
              position: 'relative'
            }}
          >
            Get Started Free <ArrowRight size={18} />
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e2e8f0', padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
        <Link to="/" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: '700' }}>
          <Sparkles size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
          DocTransfer
        </Link>
        {' '}— Secure Document Sharing & E-Signatures. © 2026 DocTransfer Inc.
      </footer>
    </div>
  );
};

export default ResearchHub;
