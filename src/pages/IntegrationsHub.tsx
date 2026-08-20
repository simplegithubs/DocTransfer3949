import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Layers, ArrowRight, HardDrive, Box, Cloud, Archive, Mail, MailCheck, Briefcase, Zap, Cpu, FileText, MessageSquare, FileCheck, Folder, Shield, Filter } from 'lucide-react';
import SEO from '../components/SEO';
import { integrationsList, type IntegrationPageData } from '../data/integrationsData';

const iconMap: Record<string, React.FC<{ size?: number; color?: string }>> = {
  HardDrive: ({ size = 24, color = '#4f46e5' }) => <HardDrive size={size} color={color} />,
  Box: ({ size = 24, color = '#4f46e5' }) => <Box size={size} color={color} />,
  Cloud: ({ size = 24, color = '#4f46e5' }) => <Cloud size={size} color={color} />,
  Archive: ({ size = 24, color = '#4f46e5' }) => <Archive size={size} color={color} />,
  Mail: ({ size = 24, color = '#4f46e5' }) => <Mail size={size} color={color} />,
  MailCheck: ({ size = 24, color = '#4f46e5' }) => <MailCheck size={size} color={color} />,
  Briefcase: ({ size = 24, color = '#4f46e5' }) => <Briefcase size={size} color={color} />,
  Layers: ({ size = 24, color = '#4f46e5' }) => <Layers size={size} color={color} />,
  Zap: ({ size = 24, color = '#4f46e5' }) => <Zap size={size} color={color} />,
  Cpu: ({ size = 24, color = '#4f46e5' }) => <Cpu size={size} color={color} />,
  FileText: ({ size = 24, color = '#4f46e5' }) => <FileText size={size} color={color} />,
  MessageSquare: ({ size = 24, color = '#4f46e5' }) => <MessageSquare size={size} color={color} />,
  FileCheck: ({ size = 24, color = '#4f46e5' }) => <FileCheck size={size} color={color} />,
  Folder: ({ size = 24, color = '#4f46e5' }) => <Folder size={size} color={color} />,
  Shield: ({ size = 24, color = '#4f46e5' }) => <Shield size={size} color={color} />
};

const categoryLabels: Record<string, string> = {
  all: 'All Integrations',
  'cloud-storage': 'Cloud Storage',
  crm: 'CRM & Sales',
  productivity: 'Productivity & Email',
  automation: 'Workflow Automation'
};

const IntegrationsHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredIntegrations = useMemo(() => {
    return integrationsList.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.keywords.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "name": "DocTransfer Integrations Directory",
        "description": "Connect DocTransfer with Google Drive, Dropbox, Salesforce, HubSpot, Gmail, Zapier, and Microsoft 365 for secure document tracking.",
        "url": "https://www.doctransfer.app/integrations",
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
          { "@type": "ListItem", "position": 2, "name": "Integrations" }
        ]
      }
    ]
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title="Software Integrations Directory — Google Drive, Dropbox, Salesforce | DocTransfer"
        description="Connect DocTransfer with Google Drive, Dropbox, Salesforce, HubSpot, Gmail, Zapier, and Microsoft 365. Add page tracking and e-signatures to your tools."
        keywords="DocSend integrations, Google Drive document tracking, Salesforce proposal tracking, Dropbox secure sharing, Zapier e-sign workflow"
        url="https://www.doctransfer.app/integrations"
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
          <Link to="/integrations" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 600, fontSize: '0.9rem' }}>Integrations</Link>
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
            <Layers size={14} /> Software Ecosystem
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: 1.1, color: '#0f172a', marginBottom: '1rem' }}>
            Connect DocTransfer with Your <span style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Favorite Tools</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#475569', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            Layer page-by-page view tracking, dynamic watermarking, and e-signatures onto your cloud storage, CRM, email, and workflow automation apps.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ maxWidth: '500px', margin: '0 auto 2.5rem auto' }}>
          <input
            type="text"
            placeholder="Search integrations (e.g. Google Drive, Salesforce, Zapier)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.85rem 1.25rem',
              borderRadius: '9999px',
              border: '1px solid #cbd5e1',
              fontSize: '0.95rem',
              outline: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}
          />
        </div>

        {/* Category Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {Object.keys(categoryLabels).map(catKey => (
            <button
              key={catKey}
              onClick={() => setActiveCategory(catKey)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: activeCategory === catKey ? '700' : '500',
                background: activeCategory === catKey ? '#4f46e5' : 'white',
                color: activeCategory === catKey ? 'white' : '#64748b',
                border: activeCategory === catKey ? '1px solid #4f46e5' : '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {categoryLabels[catKey]}
            </button>
          ))}
        </div>

        {/* Integrations Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {filteredIntegrations.map((item) => {
            const IconComp = iconMap[item.icon] || (({ size, color }) => <Layers size={size} color={color} />);

            return (
              <Link
                key={item.slug}
                to={`/integrations/${item.slug}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '24px',
                  padding: '2rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
                }}
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{ background: '#f5f3ff', padding: '0.85rem', borderRadius: '16px' }}>
                    <IconComp size={28} color="#4f46e5" />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#16a34a', background: '#f0fdf4', padding: '0.25rem 0.75rem', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    1-Click Connect
                  </span>
                </div>

                <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                  {item.name}
                </h2>
                <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.6, margin: '0 0 1.5rem 0', flex: 1 }}>
                  {item.tagline}
                </p>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#4f46e5', fontWeight: '700', fontSize: '0.9rem' }}>
                  View Integration Details <ArrowRight size={16} />
                </div>
              </Link>
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
            Don't see your favorite tool?
          </h2>
          <p style={{ opacity: 0.9, marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
            DocTransfer exposes open webhooks and Zapier connectors to integrate with custom in-house software in minutes.
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
            Start Free Integration <ArrowRight size={18} />
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

export default IntegrationsHub;
