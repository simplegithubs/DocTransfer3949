import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Wrench, ArrowRight, FileSpreadsheet, FileCheck, Calculator, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import SEO from '../../components/SEO';
import { toolsList, type ToolMetadata } from '../../data/toolsData';

const iconMap: Record<string, React.FC<{ size?: number; color?: string }>> = {
  FileSpreadsheet: ({ size = 24, color = '#4f46e5' }) => <FileSpreadsheet size={size} color={color} />,
  FileCheck: ({ size = 24, color = '#4f46e5' }) => <FileCheck size={size} color={color} />,
  Calculator: ({ size = 24, color = '#4f46e5' }) => <Calculator size={size} color={color} />,
  ShieldCheck: ({ size = 24, color = '#4f46e5' }) => <ShieldCheck size={size} color={color} />
};

const ToolsHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredTools = useMemo(() => {
    if (activeCategory === 'all') return toolsList;
    return toolsList.filter(t => t.category === activeCategory);
  }, [activeCategory]);

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "name": "DocTransfer Free Web Tools & Calculators",
        "description": "Free web tools for founders and business teams: Pitch Deck Analyzer, NDA Generator, VDR Cost Calculator, and PDF Watermarker.",
        "url": "https://www.doctransfer.app/tools",
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
          { "@type": "ListItem", "position": 2, "name": "Tools" }
        ]
      }
    ]
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title="Free Tools & Calculators for Founders — Pitch Deck Analyzer, NDA Builder | DocTransfer"
        description="Free web tools for founders: Pitch Deck Analyzer, Interactive NDA Generator, Virtual Data Room Cost Calculator, and PDF Watermarking Tool."
        keywords="free web tools, pitch deck analyzer, free NDA generator, VDR cost calculator, PDF watermark tool online, founder resources"
        url="https://www.doctransfer.app/tools"
        schema={schemaGraph}
      />

      {/* Header / Navbar */}
      <header style={{ height: '70px', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#4f46e5', fontWeight: '800', fontSize: '1.25rem' }}>
          <Sparkles size={22} /> DocTransfer
        </Link>
        <nav style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <Link to="/research" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>Research</Link>
          <Link to="/tools" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 600, fontSize: '0.9rem' }}>Tools</Link>
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
            <Wrench size={14} /> Free Web Tools
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: 1.1, color: '#0f172a', marginBottom: '1rem' }}>
            Interactive Tools for <span style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Founders & Teams</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#475569', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            Free, browser-based web tools to analyze pitch decks, generate legal NDAs, calculate data room ROI, and watermark sensitive documents.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Tools' },
            { id: 'fundraising', label: 'Fundraising' },
            { id: 'legal', label: 'Legal' },
            { id: 'calculators', label: 'Calculators' },
            { id: 'security', label: 'Security' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: activeCategory === cat.id ? '700' : '500',
                background: activeCategory === cat.id ? '#4f46e5' : 'white',
                color: activeCategory === cat.id ? 'white' : '#64748b',
                border: activeCategory === cat.id ? '1px solid #4f46e5' : '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          {filteredTools.map((tool) => {
            const IconComponent = iconMap[tool.icon] || (({ size, color }) => <Wrench size={size} color={color} />);

            return (
              <div
                key={tool.slug}
                style={{
                  background: 'white',
                  border: tool.popular ? '2px solid #c7d2fe' : '1px solid #e2e8f0',
                  borderRadius: '24px',
                  padding: '2rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(79, 70, 229, 0.12)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.02)';
                }}
              >
                {tool.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '1.5rem',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    color: 'white',
                    padding: '0.25rem 0.85rem',
                    borderRadius: '9999px',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    ★ Most Popular Tool
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{ background: '#f5f3ff', padding: '0.85rem', borderRadius: '16px' }}>
                    <IconComponent size={28} color="#4f46e5" />
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#64748b', background: '#f8fafc', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid #f1f5f9' }}>
                    <Clock size={12} /> {tool.estimatedTime}
                  </span>
                </div>

                <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                  {tool.name}
                </h2>
                <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.6, margin: '0 0 1.5rem 0', flex: 1 }}>
                  {tool.tagline}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.75rem' }}>
                  {tool.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                      <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to={tool.ctaRoute}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    color: 'white',
                    padding: '0.85rem 1.5rem',
                    borderRadius: '14px',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    textAlign: 'center',
                    boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)'
                  }}
                >
                  {tool.ctaText} <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <section style={{
          marginTop: '5rem',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          borderRadius: '24px',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem' }}>
            Need full document sharing & e-signatures?
          </h2>
          <p style={{ opacity: 0.9, marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
            Combine all these tools with DocTransfer's secure data rooms and page-by-page view tracking.
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
              textDecoration: 'none'
            }}
          >
            Create Free Account <ArrowRight size={18} />
          </Link>
        </section>
      </main>

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

export default ToolsHub;
