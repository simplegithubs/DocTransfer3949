import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Search,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Home,
  Scale,
  Activity,
  Layers,
  Target,
  Users,
  Shield,
  PieChart,
  Rocket,
  DollarSign,
  Filter,
  CheckCircle2
} from 'lucide-react';
import SEO from '../components/SEO';
import { solutionsData, type SolutionPage } from '../data/solutionsData';

const iconMap: Record<string, React.FC<{ size?: number; color?: string }>> = {
  TrendingUp: ({ size = 22, color = '#4f46e5' }) => <TrendingUp size={size} color={color} />,
  Briefcase: ({ size = 22, color = '#4f46e5' }) => <Briefcase size={size} color={color} />,
  Home: ({ size = 22, color = '#4f46e5' }) => <Home size={size} color={color} />,
  Scale: ({ size = 22, color = '#4f46e5' }) => <Scale size={size} color={color} />,
  Activity: ({ size = 22, color = '#4f46e5' }) => <Activity size={size} color={color} />,
  Layers: ({ size = 22, color = '#4f46e5' }) => <Layers size={size} color={color} />,
  Target: ({ size = 22, color = '#4f46e5' }) => <Target size={size} color={color} />,
  Users: ({ size = 22, color = '#4f46e5' }) => <Users size={size} color={color} />,
  Shield: ({ size = 22, color = '#4f46e5' }) => <Shield size={size} color={color} />,
  PieChart: ({ size = 22, color = '#4f46e5' }) => <PieChart size={size} color={color} />,
  Rocket: ({ size = 22, color = '#4f46e5' }) => <Rocket size={size} color={color} />,
  DollarSign: ({ size = 22, color = '#4f46e5' }) => <DollarSign size={size} color={color} />
};

const categoryLabels: Record<string, string> = {
  all: 'All Solutions',
  'deals-capital': 'Deals & Capital',
  industry: 'Industry Specific',
  workflow: 'Team Workflows'
};

const SolutionsHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSolutions = useMemo(() => {
    return solutionsData.filter(item => {
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
        'name': 'DocTransfer Solutions & Use Cases Directory',
        'description': 'Tailored document sharing, e-signature, and data room solutions for fundraising, M&A, legal, healthcare, real estate, VC, and sales teams.',
        'url': 'https://www.doctransfer.app/solutions',
        'publisher': {
          '@type': 'Organization',
          'name': 'DocTransfer',
          'url': 'https://www.doctransfer.app'
        }
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.doctransfer.app' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Solutions' }
        ]
      }
    ]
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title="Solutions & Use Cases Hub — Document Security & Tracking | DocTransfer"
        description="Explore tailored solutions for fundraising, M&A due diligence, legal teams, healthcare HIPAA compliance, real estate closings, VC funds, and sales."
        keywords="document sharing solutions, startup fundraising software, M&A data room solution, HIPAA file sharing, real estate e-signature platform"
        url="https://www.doctransfer.app/solutions"
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
          <Link to="/solutions" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 600, fontSize: '0.9rem' }}>Solutions</Link>
          <Link to="/docsend-alternative" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>DocSend Alternative</Link>
          <Link to="/templates" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>Templates</Link>
        </nav>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.4rem 1.25rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            <Sparkles size={14} /> Tailored Workflows
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: 1.1, color: '#0f172a', marginBottom: '1rem' }}>
            Built for Your Specific Industry & Workflow
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#475569', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6 }}>
            Whether you are closing a Series A fundraising round, conducting M&A due diligence, or sending patient records, DocTransfer delivers bank-grade document security and page tracking tailored to your needs.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%' }}>
              <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
              <input
                type="text"
                placeholder="Search solutions by keyword, industry, or feature (e.g., Fundraising, HIPAA, M&A, Legal)..."
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
                const count = key === 'all' ? solutionsData.length : solutionsData.filter(s => s.category === key).length;
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

        {/* Grid of Solutions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {filteredSolutions.map(solution => {
            const IconComponent = iconMap[solution.icon] || (({ size, color }: any) => <Sparkles size={size} color={color} />);

            return (
              <Link
                key={solution.slug}
                to={`/solutions/${solution.slug}`}
                className="solution-card"
                style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  padding: '2rem',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '260px',
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
                      {categoryLabels[solution.category] || solution.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem', lineHeight: 1.25 }}>
                    {solution.title}
                  </h3>

                  <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {solution.subheadline}
                  </p>
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {solution.stats.slice(0, 2).map((st, i) => (
                      <span key={i} style={{ fontSize: '0.75rem', fontWeight: '700', color: '#059669', background: '#ecfdf5', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                        {st.value} {st.label.split(' ')[0]}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#4f46e5', fontSize: '0.88rem', fontWeight: 600 }}>
                    Explore <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredSolutions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <Sparkles size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>No solutions found</h3>
            <p style={{ color: '#64748b', margin: 0 }}>Try adjusting your search query or selecting another filter category.</p>
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
          <Link to="/sitemap-directory" style={{ color: '#64748b', textDecoration: 'none' }}>Directory</Link>
        </div>
      </footer>

      <style>{`
        .solution-card:hover {
          transform: translateY(-3px);
          border-color: #cbd5e1 !important;
          box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.06) !important;
        }
      `}</style>
    </div>
  );
};

export default SolutionsHub;
