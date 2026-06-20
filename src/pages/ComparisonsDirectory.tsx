import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Scale, HeartHandshake, Zap, ShieldAlert, Award } from 'lucide-react';
import SEO from '../components/SEO';

interface ComparisonSummary {
  slug: string;
  competitor: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  badge: string;
  verdict: string;
}

const COMPARISONS_LIST: ComparisonSummary[] = [
  {
    slug: 'docusign-vs-doctransfer',
    competitor: 'DocuSign',
    title: 'DocuSign vs DocTransfer: Which is Better for Legal?',
    description: 'A detailed evaluation of security, legal compliance, and page-level read-tracking for law firms and legal departments.',
    icon: Scale,
    badge: 'Legal Focus',
    verdict: 'Best for Legal Teams'
  },
  {
    slug: 'pandadoc-vs-doctransfer',
    competitor: 'PandaDoc',
    title: 'PandaDoc vs DocTransfer: Features, Pricing, Reviews',
    description: 'Compare proposal building capabilities, custom branding restrictions, and page-by-page viewing analytics.',
    icon: HeartHandshake,
    badge: 'Sales & Proposals',
    verdict: 'Best for Sales & Account Management'
  },
  {
    slug: 'adobe-sign-vs-doctransfer',
    competitor: 'Adobe Sign',
    title: 'Adobe Sign vs DocTransfer: E-signature Comparison',
    description: 'A head-to-head comparison of standard digital signing, Acrobat integration, and zero-knowledge encryption.',
    icon: Award,
    badge: 'E-Signatures',
    verdict: 'Best for Remote Teams'
  },
  {
    slug: 'airslate-vs-doctransfer',
    competitor: 'airSlate',
    title: 'AirSlate vs DocTransfer: Document Transfer Tools',
    description: 'Discover how to choose between complex multi-step workflow bots and high-speed secure file transfers.',
    icon: ShieldAlert,
    badge: 'Document Workflows',
    verdict: 'Best for File Security & Speed'
  },
  {
    slug: 'zoho-sign-vs-doctransfer',
    competitor: 'Zoho Sign',
    title: 'Zoho Sign vs DocTransfer: Best for Small Business',
    description: 'Compare Zoho ecosystem integrations against cost-effective end-to-end client encryption vaults.',
    icon: Zap,
    badge: 'Small Business',
    verdict: 'Best for Small Businesses'
  }
];

const ComparisonsDirectory: React.FC = () => {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title="Comparisons - Build Comparison Pages (30 pages)"
        description="Compare DocTransfer with top e-signature and document sharing competitors: DocuSign, PandaDoc, Adobe Sign, airSlate, and Zoho Sign."
        keywords="e-signature comparisons, DocSend alternatives, DocuSign vs DocTransfer, PandaDoc vs DocTransfer, free e-sign comparison"
        url="https://doctransfer.app/comparisons"
      />

      {/* Header / Navbar */}
      <header style={{ height: '70px', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', padding: '0 2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#4f46e5', fontWeight: '800', fontSize: '1.25rem' }}>
          <Sparkles size={22} /> DocTransfer
        </Link>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        {/* Hero Banner */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.4rem 1.25rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            <Scale size={14} /> Competitive Analysis
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: 1.1, color: '#0f172a', marginBottom: '1rem' }}>
            Build Comparison Pages <span style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>(30 pages)</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#475569', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            Understand how DocTransfer matches up against legacy e-signature providers and document sharing systems. Secure, encrypted, and free.
          </p>
        </div>

        {/* Comparison Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {COMPARISONS_LIST.map((comp) => {
            const CompIcon = comp.icon;
            return (
              <div 
                key={comp.slug} 
                style={{ 
                  background: 'white', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '24px', 
                  padding: '2rem', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  cursor: 'pointer'
                }}
                className="comparison-card"
                onClick={() => window.location.href = `/comparisons/${comp.slug}`}
              >
                <div>
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '0.6rem', background: '#f5f3ff', borderRadius: '12px', color: '#7c3aed' }}>
                      <CompIcon size={20} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', background: '#f1f5f9', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
                      {comp.badge}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.75rem 0', lineHeight: 1.3 }}>
                    {comp.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
                    {comp.description}
                  </p>
                </div>

                {/* Card Footer */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#4f46e5' }}>
                    {comp.verdict}
                  </span>
                  <Link 
                    to={`/comparisons/${comp.slug}`} 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.25rem', 
                      color: '#4f46e5', 
                      fontWeight: '700', 
                      fontSize: '0.9rem', 
                      textDecoration: 'none' 
                    }}
                  >
                    Compare <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <style>{`
        .comparison-card:hover {
          transform: translateY(-4px);
          border-color: #c7d2fe !important;
          box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default ComparisonsDirectory;
