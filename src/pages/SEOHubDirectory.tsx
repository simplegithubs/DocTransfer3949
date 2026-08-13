import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  Layers, 
  Copy, 
  HelpCircle, 
  Briefcase, 
  FileText, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import SEO from '../components/SEO';
import { allSEOPages } from '../data/seoPages';
import { templateSeoData } from '../data/templateSeoData';

const SEOHubDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'alternatives' | 'comparisons' | 'how-to' | 'industry' | 'templates'>('all');

  // Convert templateSeoData object into an array for easier rendering
  const templatesList = useMemo(() => {
    return Object.values(templateSeoData).map(t => ({
      slug: t.slug,
      category: 'templates' as const,
      title: t.pageTitle || `${t.templateName} Template`,
      displayName: t.templateName,
      description: t.metaDescription
    }));
  }, []);

  // Combine regular SEO pages with templates
  const allMergedPages = useMemo(() => {
    const regularPages = allSEOPages.map(p => ({
      slug: p.slug,
      category: p.category,
      title: p.title,
      displayName: p.title
        .replace(/Best Free /g, '')
        .replace(/Alternatives for /g, 'Alternatives - ')
        .replace(/Alternative for /g, 'Alternative - ')
        .replace(/ vs /g, ' vs ')
        .replace(/ (2026)/g, '')
        .replace(/ Template.*$/g, ''),
      description: p.description
    }));

    return [...regularPages, ...templatesList];
  }, [templatesList]);

  // Filter items based on active tab and search query
  const filteredItems = useMemo(() => {
    return allMergedPages.filter(item => {
      const matchesTab = activeTab === 'all' || item.category === activeTab;
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesSearch;
    });
  }, [allMergedPages, activeTab, searchQuery]);

  // Grouped counts for stats
  const stats = useMemo(() => {
    const counts = {
      all: allMergedPages.length,
      alternatives: 0,
      comparisons: 0,
      'how-to': 0,
      industry: 0,
      templates: 0
    };
    allMergedPages.forEach(p => {
      if (p.category in counts) {
        counts[p.category as keyof typeof counts]++;
      }
    });
    return counts;
  }, [allMergedPages]);

  const categories = [
    { id: 'all', label: 'All Pages', count: stats.all, icon: Layers, color: '#4f46e5' },
    { id: 'alternatives', label: 'Alternatives', count: stats.alternatives, icon: Copy, color: '#06b6d4' },
    { id: 'comparisons', label: 'Comparisons', count: stats.comparisons, icon: TrendingUp, color: '#10b981' },
    { id: 'templates', label: 'Templates', count: stats.templates, icon: FileText, color: '#f59e0b' },
    { id: 'how-to', label: 'How-To Guides', count: stats['how-to'], icon: HelpCircle, color: '#ec4899' },
    { id: 'industry', label: 'Industry Hubs', count: stats.industry, icon: Briefcase, color: '#8b5cf6' }
  ];

  const getRoute = (category: string, slug: string) => {
    if (category === 'templates') {
      return `/templates/${slug}`;
    }
    return `/${category}/${slug}`;
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title="DocTransfer Site Directory - Explore All Documents & Tools"
        description="Browse our complete directory of document signing templates, e-signature comparison matrices, and secure workflow solutions by industry."
        keywords="doctransfer sitemap, document templates index, e-signature comparisons directory, secure file sharing guides"
        url="https://www.doctransfer.app/sitemap-directory"
      />

      {/* Header / Navbar */}
      <header style={{ height: '70px', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', padding: '0 2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#4f46e5', fontWeight: '800', fontSize: '1.25rem' }}>
          <Sparkles size={22} /> DocTransfer
        </Link>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: 1.1, color: '#0f172a', marginBottom: '1rem' }}>
            Resource & Document Directory
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#475569', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            Access our complete programmatic repository of legally binding templates, alternative comparisons, and industry compliance hubs.
          </p>
        </div>

        {/* Filters & Search Toolbar */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.01)', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%' }}>
              <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
              <input
                type="text"
                placeholder="Search templates, competitors, or industries (e.g. Healthcare, NDA)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>

            {/* Category Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {categories.map((cat) => {
                const CatIcon = cat.icon;
                const isActive = activeTab === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id as any)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: isActive ? cat.color : '#f1f5f9',
                      color: isActive ? 'white' : '#475569',
                      border: 'none',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? `0 4px 12px ${cat.color}33` : 'none'
                    }}
                  >
                    <CatIcon size={16} />
                    {cat.label}
                    <span style={{ 
                      fontSize: '0.75rem', 
                      background: isActive ? 'rgba(255,255,255,0.2)' : '#e2e8f0', 
                      color: isActive ? 'white' : '#64748b', 
                      padding: '0.1rem 0.5rem', 
                      borderRadius: '10px',
                      marginLeft: '0.25rem'
                    }}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
            Showing {filteredItems.length} of {allMergedPages.length} resources
          </span>
        </div>

        {/* Links Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filteredItems.map((item, index) => {
            const catInfo = categories.find(c => c.id === item.category);
            return (
              <Link
                key={`${item.slug}-${index}`}
                to={getRoute(item.category, item.slug)}
                style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '140px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.01)',
                  transition: 'all 0.2s ease'
                }}
                className="directory-card"
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: '700', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em', 
                      color: catInfo?.color || '#64748b',
                      background: `${catInfo?.color || '#cbd5e1'}12`,
                      padding: '0.25rem 0.6rem',
                      borderRadius: '6px'
                    }}>
                      {item.category}
                    </span>
                  </div>
                  <h3 style={{ 
                    fontSize: '1rem', 
                    fontWeight: '700', 
                    color: '#0f172a', 
                    margin: 0,
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.displayName}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#4f46e5', fontSize: '0.85rem', fontWeight: 600, marginTop: '1rem' }}>
                  Open Resource <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <HelpCircle size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>No pages found</h3>
            <p style={{ color: '#64748b', margin: 0 }}>Try clearing your search query or switching filters to find what you need.</p>
          </div>
        )}
      </main>

      <style>{`
        .directory-card:hover {
          transform: translateY(-2px);
          border-color: #cbd5e1 !important;
          box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.04) !important;
        }
      `}</style>
    </div>
  );
};

export default SEOHubDirectory;
