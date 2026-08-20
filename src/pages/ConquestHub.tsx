import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Search,
  ArrowRight,
  DollarSign,
  Gift,
  BarChart2,
  ShieldAlert,
  FileSignature,
  FolderPlus,
  Rocket,
  Target,
  Scale,
  Home,
  RefreshCw,
  GitBranch,
  FileText,
  Cloud,
  Filter,
  CheckCircle2,
  Zap,
  TrendingUp,
  Shield
} from 'lucide-react';
import SEO from '../components/SEO';
import { conquestData, type ConquestPage } from '../data/conquestData';

const iconMap: Record<string, React.FC<{ size?: number; color?: string }>> = {
  DollarSign: ({ size = 22, color = '#4f46e5' }) => <DollarSign size={size} color={color} />,
  Gift: ({ size = 22, color = '#4f46e5' }) => <Gift size={size} color={color} />,
  BarChart2: ({ size = 22, color = '#4f46e5' }) => <BarChart2 size={size} color={color} />,
  ShieldAlert: ({ size = 22, color = '#4f46e5' }) => <ShieldAlert size={size} color={color} />,
  FileSignature: ({ size = 22, color = '#4f46e5' }) => <FileSignature size={size} color={color} />,
  FolderPlus: ({ size = 22, color = '#4f46e5' }) => <FolderPlus size={size} color={color} />,
  Rocket: ({ size = 22, color = '#4f46e5' }) => <Rocket size={size} color={color} />,
  Target: ({ size = 22, color = '#4f46e5' }) => <Target size={size} color={color} />,
  Scale: ({ size = 22, color = '#4f46e5' }) => <Scale size={size} color={color} />,
  Home: ({ size = 22, color = '#4f46e5' }) => <Home size={size} color={color} />,
  RefreshCw: ({ size = 22, color = '#4f46e5' }) => <RefreshCw size={size} color={color} />,
  GitBranch: ({ size = 22, color = '#4f46e5' }) => <GitBranch size={size} color={color} />,
  FileText: ({ size = 22, color = '#4f46e5' }) => <FileText size={size} color={color} />,
  Cloud: ({ size = 22, color = '#4f46e5' }) => <Cloud size={size} color={color} />
};

const categoryLabels: Record<string, string> = {
  all: 'All DocSend Alternatives',
  pricing: 'Pricing & Free Plans',
  features: 'Feature Comparisons',
  audiences: 'By Team / Industry',
  migration: 'Migration Guides',
  triangulation: 'Software Comparisons'
};

const ConquestHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPages = useMemo(() => {
    return conquestData.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keywords.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'Best DocSend Alternatives & Feature Comparisons Hub (2026)',
        description: 'Explore top DocSend alternatives. Compare pricing, free tiers, dynamic watermarking, e-signatures, and virtual data rooms.',
        url: 'https://www.doctransfer.app/docsend-alternative',
        'publisher': {
          '@type': 'Organization',
          name: 'DocTransfer',
          url: 'https://www.doctransfer.app'
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.doctransfer.app' },
          { '@type': 'ListItem', position: 2, name: 'DocSend Alternative' }
        ]
      }
    ]
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title="Best DocSend Alternative (2026) — Free Unlimited Document Tracking"
        description="Looking for a free alternative to DocSend? Discover why 10,000+ founders and dealmakers use DocTransfer for document analytics, watermarks, and e-signatures."
        keywords="docsend alternative, free docsend alternative, docsend pricing comparison, docsend vs doctransfer, replace docsend"
        url="https://www.doctransfer.app/docsend-alternative"
        schema={schemaGraph}
      />

      {/* Header */}
      <header style={{ height: '70px', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#4f46e5', fontWeight: '800', fontSize: '1.25rem' }}>
          <Sparkles size={22} /> DocTransfer
        </Link>
        <nav style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <Link to="/research" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>Research</Link>
          <Link to="/tools" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>Tools</Link>
          <Link to="/integrations" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>Integrations</Link>
          <Link to="/glossary" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>Glossary</Link>
          <Link to="/solutions" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>Solutions</Link>
          <Link to="/docsend-alternative" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 600, fontSize: '0.9rem' }}>DocSend Alternative</Link>
          <Link to="/templates" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>Templates</Link>
        </nav>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fef2f2', border: '1px solid #fecaca', padding: '0.4rem 1.25rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            <Zap size={14} /> Competitive Conquest Hub
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: 1.1, color: '#0f172a', marginBottom: '1rem' }}>
            Why Thousands of Teams Are Switching from DocSend
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#475569', maxWidth: '780px', margin: '0 auto', lineHeight: 1.6 }}>
            DocSend charges up to $150/user/month and gates basic security features. DocTransfer offers unlimited document tracking, page dwell analytics, dynamic watermarks, and built-in e-signatures with a 100% free core plan.
          </p>
        </div>

        {/* Feature Comparison Snapshot Banner */}
        <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', borderRadius: '24px', padding: '2.5rem', color: 'white', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', textAlign: 'center' }}>DocSend vs DocTransfer Snapshot</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Starting Price</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#34d399' }}>$0 Free Forever</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.2rem' }}>vs DocSend $15-$150/mo</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Tracked Documents</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#60a5fa' }}>Unlimited</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.2rem' }}>vs DocSend Capped Limits</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Dynamic Watermark</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#a78bfa' }}>Included Free</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.2rem' }}>vs DocSend Advanced Only</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>E-Signatures</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f472b6' }}>Built-in Native</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.2rem' }}>vs DocSend Paid Add-on</div>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%' }}>
              <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
              <input
                type="text"
                placeholder="Search DocSend alternatives by feature, industry, or comparison (e.g. Free, Pricing, Watermarking, Founders)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3.5rem',
                  fontSize: '1rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '16px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease',
                  fontFamily: 'inherit'
                }}
                onFocus={e => (e.target.style.borderColor = '#4f46e5')}
                onBlur={e => (e.target.style.borderColor = '#cbd5e1')}
              />
            </div>

            {/* Category Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {Object.entries(categoryLabels).map(([key, label]) => {
                const isActive = activeCategory === key;
                const count = key === 'all' ? conquestData.length : conquestData.filter(c => c.category === key).length;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: isActive ? '#4f46e5' : '#f1f5f9',
                      color: isActive ? 'white' : '#475569',
                      border: 'none',
                      padding: '0.6rem 1.25rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 4px 12px rgba(79, 70, 229, 0.25)' : 'none'
                    }}
                  >
                    <Filter size={14} />
                    {label}
                    <span
                      style={{
                        fontSize: '0.75rem',
                        background: isActive ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                        color: isActive ? 'white' : '#64748b',
                        padding: '0.1rem 0.5rem',
                        borderRadius: '10px',
                        marginLeft: '0.25rem'
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Grid of Pages */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {filteredPages.map(page => {
            const IconComponent = iconMap[page.icon] || (({ size, color }: any) => <Sparkles size={size} color={color} />);

            return (
              <Link
                key={page.slug}
                to={`/docsend-alternative/${page.slug}`}
                className="conquest-card"
                style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  padding: '2rem',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '250px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconComponent size={24} color="#4f46e5" />
                    </div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#4f46e5',
                        background: '#eef2ff',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px'
                      }}
                    >
                      {categoryLabels[page.category] || page.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem', lineHeight: 1.25 }}>
                    {page.title}
                  </h3>

                  <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {page.subheadline}
                  </p>
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#059669', background: '#ecfdf5', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                    Free Switch Option
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#4f46e5', fontSize: '0.88rem', fontWeight: 600 }}>
                    Read Guide <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredPages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <Sparkles size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>No guides found</h3>
            <p style={{ color: '#64748b', margin: 0 }}>Try clearing your search query or switching categories.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#94a3b8', fontSize: '0.85rem', borderTop: '1px solid #e2e8f0', marginTop: '4rem' }}>
        <p>© {new Date().getFullYear()} DocTransfer. All rights reserved.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.75rem' }}>
          <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link>
          <Link to="/pricing" style={{ color: '#64748b', textDecoration: 'none' }}>Pricing</Link>
          <Link to="/research" style={{ color: '#64748b', textDecoration: 'none' }}>Research</Link>
          <Link to="/tools" style={{ color: '#64748b', textDecoration: 'none' }}>Tools</Link>
          <Link to="/integrations" style={{ color: '#64748b', textDecoration: 'none' }}>Integrations</Link>
          <Link to="/glossary" style={{ color: '#64748b', textDecoration: 'none' }}>Glossary</Link>
          <Link to="/solutions" style={{ color: '#64748b', textDecoration: 'none' }}>Solutions</Link>
          <Link to="/docsend-alternative" style={{ color: '#64748b', textDecoration: 'none' }}>DocSend Alternative</Link>
          <Link to="/sitemap-directory" style={{ color: '#64748b', textDecoration: 'none' }}>Directory</Link>
        </div>
      </footer>

      <style>{`
        .conquest-card:hover {
          transform: translateY(-3px);
          border-color: #cbd5e1 !important;
          box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.06) !important;
        }
      `}</style>
    </div>
  );
};

export default ConquestHub;
