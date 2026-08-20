import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Search, BookOpen, ArrowRight, Shield, Scale, FileText, TrendingUp, Filter } from 'lucide-react';
import SEO from '../components/SEO';
import { glossaryTerms, type GlossaryTerm } from '../data/glossaryData';

const categoryConfig: Record<GlossaryTerm['category'], { label: string; color: string; icon: React.FC<{ size?: number }> }> = {
  'document-management': { label: 'Document Management', color: '#4f46e5', icon: FileText },
  'e-signature-legal': { label: 'E-Signature & Legal', color: '#06b6d4', icon: Scale },
  'security-compliance': { label: 'Security & Compliance', color: '#10b981', icon: Shield },
  'business-fundraising': { label: 'Business & Fundraising', color: '#f59e0b', icon: TrendingUp }
};

const GlossaryHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeLetter, setActiveLetter] = useState<string>('all');

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    glossaryTerms.forEach(t => letters.add(t.term.charAt(0).toUpperCase()));
    return letters;
  }, []);

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter(term => {
      const matchesCategory = activeCategory === 'all' || term.category === activeCategory;
      const matchesLetter = activeLetter === 'all' || term.term.charAt(0).toUpperCase() === activeLetter;
      const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            term.shortDefinition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            term.keywords.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesLetter && matchesSearch;
    });
  }, [activeCategory, activeLetter, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: glossaryTerms.length };
    glossaryTerms.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, []);

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "name": "Document Management Glossary — 50+ Key Terms Defined",
        "description": "A comprehensive glossary of document management, e-signature, security, and business fundraising terms. Definitions, FAQs, and expert guides.",
        "url": "https://www.doctransfer.app/glossary",
        "publisher": {
          "@type": "Organization",
          "name": "DocTransfer",
          "url": "https://www.doctransfer.app"
        }
      },
      {
        "@type": "DefinedTermSet",
        "name": "DocTransfer Glossary",
        "hasDefinedTerm": glossaryTerms.map(t => ({
          "@type": "DefinedTerm",
          "name": t.term,
          "description": t.shortDefinition,
          "url": `https://www.doctransfer.app/glossary/${t.slug}`
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.doctransfer.app" },
          { "@type": "ListItem", "position": 2, "name": "Glossary" }
        ]
      }
    ]
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title="Document Management Glossary — 50+ Terms Defined | DocTransfer"
        description="Comprehensive glossary covering virtual data rooms, e-signatures, document tracking, encryption, HIPAA, GDPR, venture capital, and fundraising terminology."
        keywords="document management glossary, virtual data room definition, e-signature terms, what is a VDR, NDA definition, HIPAA compliance meaning"
        url="https://www.doctransfer.app/glossary"
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
          <Link to="/glossary" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 600, fontSize: '0.9rem' }}>Glossary</Link>
          <Link to="/solutions" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>Solutions</Link>
          <Link to="/docsend-alternative" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>DocSend Alternative</Link>
          <Link to="/templates" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>Templates</Link>
        </nav>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.4rem 1.25rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            <BookOpen size={14} /> Knowledge Base
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: 1.1, color: '#0f172a', marginBottom: '1rem' }}>
            Document Management Glossary
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#475569', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            50+ expert-written definitions covering virtual data rooms, e-signatures, encryption, compliance, and fundraising terminology.
          </p>
        </div>

        {/* Stats Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {Object.entries(categoryConfig).map(([key, config]) => {
            const CatIcon = config.icon;
            return (
              <div key={key} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${config.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CatIcon size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: config.color }}>{categoryCounts[key] || 0}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{config.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search + Filters */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
            <input
              type="text"
              placeholder="Search terms (e.g. NDA, GDPR, data room, encryption)..."
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <button
              onClick={() => setActiveCategory('all')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                background: activeCategory === 'all' ? '#4f46e5' : '#f1f5f9',
                color: activeCategory === 'all' ? 'white' : '#475569',
                border: 'none', padding: '0.5rem 1rem', borderRadius: '9999px',
                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <Filter size={14} /> All
              <span style={{ fontSize: '0.7rem', background: activeCategory === 'all' ? 'rgba(255,255,255,0.2)' : '#e2e8f0', padding: '0.1rem 0.45rem', borderRadius: '8px', marginLeft: '0.2rem' }}>{categoryCounts.all}</span>
            </button>
            {Object.entries(categoryConfig).map(([key, config]) => {
              const CatIcon = config.icon;
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    background: isActive ? config.color : '#f1f5f9',
                    color: isActive ? 'white' : '#475569',
                    border: 'none', padding: '0.5rem 1rem', borderRadius: '9999px',
                    fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: isActive ? `0 4px 12px ${config.color}33` : 'none'
                  }}
                >
                  <CatIcon size={14} /> {config.label}
                  <span style={{ fontSize: '0.7rem', background: isActive ? 'rgba(255,255,255,0.2)' : '#e2e8f0', padding: '0.1rem 0.45rem', borderRadius: '8px', marginLeft: '0.2rem' }}>{categoryCounts[key] || 0}</span>
                </button>
              );
            })}
          </div>

          {/* Alphabetical Index */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            <button
              onClick={() => setActiveLetter('all')}
              style={{
                width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: activeLetter === 'all' ? '#4f46e5' : 'transparent',
                color: activeLetter === 'all' ? 'white' : '#64748b',
                border: '1px solid', borderColor: activeLetter === 'all' ? '#4f46e5' : '#e2e8f0',
                borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s'
              }}
            >
              ALL
            </button>
            {alphabet.map(letter => {
              const hasTerms = availableLetters.has(letter);
              const isActive = activeLetter === letter;
              return (
                <button
                  key={letter}
                  onClick={() => hasTerms && setActiveLetter(letter)}
                  disabled={!hasTerms}
                  style={{
                    width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isActive ? '#4f46e5' : 'transparent',
                    color: isActive ? 'white' : hasTerms ? '#334155' : '#cbd5e1',
                    border: '1px solid', borderColor: isActive ? '#4f46e5' : '#e2e8f0',
                    borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700,
                    cursor: hasTerms ? 'pointer' : 'default',
                    opacity: hasTerms ? 1 : 0.4,
                    transition: 'all 0.15s'
                  }}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
            Showing {filteredTerms.length} of {glossaryTerms.length} terms
          </span>
        </div>

        {/* Terms Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
          {filteredTerms.map((term) => {
            const config = categoryConfig[term.category];
            return (
              <Link
                key={term.slug}
                to={`/glossary/${term.slug}`}
                className="glossary-card"
                style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '180px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase',
                      letterSpacing: '0.05em', color: config.color,
                      background: `${config.color}12`, padding: '0.25rem 0.6rem', borderRadius: '6px'
                    }}>
                      {config.label}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: '0 0 0.6rem', lineHeight: 1.3 }}>
                    {term.term}
                  </h2>
                  <p style={{
                    fontSize: '0.88rem', color: '#64748b', margin: 0, lineHeight: 1.5,
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                    overflow: 'hidden', textOverflow: 'ellipsis'
                  }}>
                    {term.shortDefinition}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#4f46e5', fontSize: '0.85rem', fontWeight: 600, marginTop: '1rem' }}>
                  Read Full Definition <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>

        {filteredTerms.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <BookOpen size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>No terms found</h3>
            <p style={{ color: '#64748b', margin: 0 }}>Try clearing your search or switching category filters.</p>
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '4rem', padding: '3rem', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', borderRadius: '24px', color: 'white' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>Ready to Secure Your Documents?</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            DocTransfer provides free document tracking, e-signatures, and virtual data rooms with page-level analytics.
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'white', color: '#4f46e5', padding: '0.85rem 2rem',
              borderRadius: '12px', fontWeight: '700', fontSize: '1rem', textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'all 0.2s'
            }}
          >
            Start Free — No Credit Card <ArrowRight size={18} />
          </Link>
        </div>
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
          <Link to="/sitemap-directory" style={{ color: '#64748b', textDecoration: 'none' }}>Directory</Link>
        </div>
      </footer>

      <style>{`
        .glossary-card:hover {
          transform: translateY(-3px);
          border-color: #cbd5e1 !important;
          box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.06) !important;
        }
      `}</style>
    </div>
  );
};

export default GlossaryHub;
