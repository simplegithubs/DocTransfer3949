import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Search,
  ArrowRight,
  FileText,
  Scale,
  Users,
  Home,
  TrendingUp,
  Target,
  Activity,
  DollarSign,
  Gift,
  Building,
  GraduationCap,
  Filter,
  CheckCircle2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import SEO from '../components/SEO';
import { templateSeoData } from '../data/templateSeoData';

export interface TemplateCategory {
  id: string;
  label: string;
  color: string;
  icon: React.FC<{ size?: number; color?: string }>;
  slugs: string[];
}

export const templateCategories: TemplateCategory[] = [
  {
    id: 'legal-contracts',
    label: 'Legal & Contracts',
    color: '#4f46e5',
    icon: ({ size = 20, color = '#4f46e5' }) => <Scale size={size} color={color} />,
    slugs: ['nda-template', 'service-agreement-template', 'subcontractor-agreement-template', 'freelance-agreement-template', 'employment-contract-template', 'non-compete-agreement-template', 'memorandum-of-understanding-template', 'power-of-attorney-template', 'liability-release']
  },
  {
    id: 'hr-onboarding',
    label: 'HR & Onboarding',
    color: '#059669',
    icon: ({ size = 20, color = '#059669' }) => <Users size={size} color={color} />,
    slugs: ['offer-letter', 'w4-form', 'i9-form', 'volunteer-agreement-template', 'conflict-of-interest-policy-template']
  },
  {
    id: 'real-estate',
    label: 'Real Estate & Property',
    color: '#06b6d4',
    icon: ({ size = 20, color = '#06b6d4' }) => <Home size={size} color={color} />,
    slugs: ['lease-agreement-template', 'sublease', 'loss-notice-template', 'insurance-binder-template', 'subrogation-letter-template']
  },
  {
    id: 'startup-fundraising',
    label: 'Startup & Fundraising',
    color: '#7c3aed',
    icon: ({ size = 20, color = '#7c3aed' }) => <TrendingUp size={size} color={color} />,
    slugs: ['rofr-template', 'board-resolution-template', 'llc-operating']
  },
  {
    id: 'sales-proposals',
    label: 'Sales & Proposals',
    color: '#f59e0b',
    icon: ({ size = 20, color = '#f59e0b' }) => <Target size={size} color={color} />,
    slugs: ['sow', 'sales-contract', 'purchase-order', 'insurance-proposal-template']
  },
  {
    id: 'healthcare-medical',
    label: 'Healthcare & Medical',
    color: '#0284c7',
    icon: ({ size = 20, color = '#0284c7' }) => <Activity size={size} color={color} />,
    slugs: ['hipaa-authorization-template', 'patient-consent-form-template']
  },
  {
    id: 'finance-accounting',
    label: 'Finance & Accounting',
    color: '#0f766e',
    icon: ({ size = 20, color = '#0f766e' }) => <DollarSign size={size} color={color} />,
    slugs: ['contractor-agreement', 'nda']
  },
  {
    id: 'non-profit-grants',
    label: 'Non-Profit & Grants',
    color: '#ec4899',
    icon: ({ size = 20, color = '#ec4899' }) => <Gift size={size} color={color} />,
    slugs: ['grant-agreement-template', 'donation-receipt-template', 'sponsorship-agreement-template', 'donation-pledge-form-template', 'fiscal-sponsorship-agreement-template', 'in-kind-donation-form-template']
  }
];

const TemplatesHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allTemplates = useMemo(() => {
    return Object.values(templateSeoData).map(t => {
      // Find category
      const matchedCat = templateCategories.find(c => c.slugs.includes(t.slug)) || {
        id: 'general',
        label: 'General Business',
        color: '#64748b'
      };

      return {
        slug: t.slug,
        title: t.templateName,
        pageTitle: t.pageTitle,
        description: t.metaDescription,
        category: matchedCat.id,
        categoryLabel: matchedCat.label,
        categoryColor: matchedCat.color,
        keywords: t.keywords
      };
    });
  }, []);

  const filteredTemplates = useMemo(() => {
    return allTemplates.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keywords.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allTemplates, activeCategory, searchQuery]);

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'Free Document Templates Directory — Legally Binding Contracts | DocTransfer',
        description: 'Download and edit free legal, HR, real estate, startup, and sales document templates. Sign online instantly with legally binding e-signatures.',
        url: 'https://www.doctransfer.app/templates',
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
          { '@type': 'ListItem', position: 2, name: 'Templates' }
        ]
      }
    ]
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title="Free Legal & Business Document Templates — Download & E-Sign | DocTransfer"
        description="Browse 40+ free legally binding document templates for legal, HR, real estate, fundraising, sales, and healthcare. Edit and sign online in seconds."
        keywords="free document templates, legal contract templates, NDA template download, lease agreement template, offer letter template, free e-signature template"
        url="https://www.doctransfer.app/templates"
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
          <Link to="/docsend-alternative" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>DocSend Alternative</Link>
          <Link to="/templates" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 600, fontSize: '0.9rem' }}>Templates</Link>
        </nav>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#f59e0b15', border: '1px solid #f59e0b40', padding: '0.4rem 1.25rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            <FileText size={14} /> Legally Binding Templates
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: 1.1, color: '#0f172a', marginBottom: '1rem' }}>
            Free Legal & Business Document Templates
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#475569', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6 }}>
            Browse 40+ attorney-drafted contracts, agreements, and forms. Edit online, customize clauses, and collect verified electronic signatures instantly.
          </p>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%' }}>
              <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
              <input
                type="text"
                placeholder="Search templates (e.g., NDA, Lease, Offer Letter, Board Resolution, HIPAA)..."
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              <button
                onClick={() => setActiveCategory('all')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: activeCategory === 'all' ? '#4f46e5' : '#f1f5f9',
                  color: activeCategory === 'all' ? 'white' : '#475569',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Filter size={14} /> All Templates
                <span style={{ fontSize: '0.7rem', background: activeCategory === 'all' ? 'rgba(255,255,255,0.2)' : '#e2e8f0', padding: '0.1rem 0.45rem', borderRadius: '8px', marginLeft: '0.2rem' }}>
                  {allTemplates.length}
                </span>
              </button>

              {templateCategories.map(cat => {
                const CatIcon = cat.icon;
                const isActive = activeCategory === cat.id;
                const count = allTemplates.filter(t => t.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: isActive ? cat.color : '#f1f5f9',
                      color: isActive ? 'white' : '#475569',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '9999px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? `0 4px 12px ${cat.color}33` : 'none'
                    }}
                  >
                    <CatIcon size={14} color={isActive ? 'white' : cat.color} />
                    {cat.label}
                    <span style={{ fontSize: '0.7rem', background: isActive ? 'rgba(255,255,255,0.2)' : '#e2e8f0', padding: '0.1rem 0.45rem', borderRadius: '8px', marginLeft: '0.2rem' }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {filteredTemplates.map(tmpl => (
            <Link
              key={tmpl.slug}
              to={`/templates/${tmpl.slug}`}
              className="template-card"
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '1.75rem',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '220px',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: tmpl.categoryColor,
                      background: `${tmpl.categoryColor}12`,
                      padding: '0.25rem 0.6rem',
                      borderRadius: '6px'
                    }}
                  >
                    {tmpl.categoryLabel}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                  {tmpl.title}
                </h3>

                <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {tmpl.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669', background: '#ecfdf5', padding: '0.2rem 0.55rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ShieldCheck size={12} /> ESIGN Compliant
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#4f46e5', fontSize: '0.85rem', fontWeight: 600 }}>
                  Edit & Sign <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <FileText size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>No templates found</h3>
            <p style={{ color: '#64748b', margin: 0 }}>Try clearing your search query or switching category filters.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#94a3b8', fontSize: '0.85rem', borderTop: '1px solid #e2e8f0', marginTop: '4rem' }}>
        <p>© {new Date().getFullYear()} DocTransfer. All rights reserved.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.75rem' }}>
          <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link>
          <Link to="/pricing" style={{ color: '#64748b', textDecoration: 'none' }}>Pricing</Link>
          <Link to="/templates" style={{ color: '#64748b', textDecoration: 'none' }}>Templates</Link>
          <Link to="/research" style={{ color: '#64748b', textDecoration: 'none' }}>Research</Link>
          <Link to="/tools" style={{ color: '#64748b', textDecoration: 'none' }}>Tools</Link>
          <Link to="/integrations" style={{ color: '#64748b', textDecoration: 'none' }}>Integrations</Link>
          <Link to="/glossary" style={{ color: '#64748b', textDecoration: 'none' }}>Glossary</Link>
          <Link to="/solutions" style={{ color: '#64748b', textDecoration: 'none' }}>Solutions</Link>
          <Link to="/sitemap-directory" style={{ color: '#64748b', textDecoration: 'none' }}>Directory</Link>
        </div>
      </footer>

      <style>{`
        .template-card:hover {
          transform: translateY(-3px);
          border-color: #cbd5e1 !important;
          box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.06) !important;
        }
      `}</style>
    </div>
  );
};

export default TemplatesHub;
