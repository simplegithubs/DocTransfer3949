import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, HeartHandshake, Award, Scale, Zap, type LucideIcon } from 'lucide-react';
import SEO from '../components/SEO';

interface AlternativeSummary {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  badge: string;
  verdict: string;
}

const ALTERNATIVES_LIST: AlternativeSummary[] = [
  {
    slug: 'docusign-alternatives-legal',
    title: '10 Best DocuSign Alternatives for Legal (2026)',
    description: 'Compare security, compliance logs, and E2EE for law firms and legal departments.',
    icon: Scale,
    badge: 'Legal Focus',
    verdict: 'Best for Attorneys'
  },
  {
    slug: 'pandadoc-alternatives-startups',
    title: 'Top 15 PandaDoc Alternatives for Startups',
    description: 'Track VC pitch deck study habits and send founder contracts at zero cost.',
    icon: HeartHandshake,
    badge: 'Startups & VCs',
    verdict: 'Best for VC Pitching'
  },
  {
    slug: 'free-docusign-alternatives',
    title: 'Best Free DocuSign Alternatives (No Credit Card)',
    description: 'Collect unlimited digital signatures legally without credit cards or hidden upgrades.',
    icon: Zap,
    badge: 'Free Forever',
    verdict: 'Best for Individuals'
  },
  {
    slug: 'enterprise-docusign-alternatives',
    title: 'Enterprise DocuSign Alternatives (Fortune 500)',
    description: 'Client-side zero-knowledge vaults, compliance logs, and custom DRM for large companies.',
    icon: Award,
    badge: 'Enterprise Compliance',
    verdict: 'Best for Large Scale'
  },
  {
    slug: 'docusign-alternatives-gen-z',
    title: 'DocuSign Alternatives for Gen Z (Easy & Cheap)',
    description: 'Skip the print-and-scan boomer portals. Tap-to-sign on mobile, fast and cost-free.',
    icon: Shield,
    badge: 'Gen-Z & Creators',
    verdict: 'Best for Freelancers'
  }
];

const AlternativesDirectory: React.FC = () => {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title="DocTransfer Alternatives - Build Alternative Pages (20 pages)"
        description="Compare DocTransfer with top e-signature alternatives including DocuSign, PandaDoc, Adobe Sign, and more. Built for startups, creators, and legal teams."
        keywords="docusign alternatives, pandadoc alternatives, free e-signature alternatives, startup pitch deck sharing, legal e-sign"
        url="https://www.doctransfer.app/alternatives"
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
            <Award size={14} /> Alternative Directory
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: 1.1, color: '#0f172a', marginBottom: '1rem' }}>
            DocTransfer Alternatives
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#475569', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            Explore the best alternatives to legacy electronic signature providers, proposal builders, and document delivery channels.
          </p>
        </div>

        {/* Alternatives Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {ALTERNATIVES_LIST.map((alt) => {
            const AltIcon = alt.icon;
            return (
              <div 
                key={alt.slug} 
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
                className="alternative-card"
                onClick={() => window.location.href = `/alternatives/${alt.slug}`}
              >
                <div>
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '0.6rem', background: '#f5f3ff', borderRadius: '12px', color: '#7c3aed' }}>
                      <AltIcon size={20} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', background: '#f1f5f9', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
                      {alt.badge}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.75rem 0', lineHeight: 1.3 }}>
                    {alt.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
                    {alt.description}
                  </p>
                </div>

                {/* Card Footer */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#4f46e5' }}>
                    {alt.verdict}
                  </span>
                  <Link 
                    to={`/alternatives/${alt.slug}`} 
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
                    View Alternatives <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <style>{`
        .alternative-card:hover {
          transform: translateY(-4px);
          border-color: #c7d2fe !important;
          box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default AlternativesDirectory;
