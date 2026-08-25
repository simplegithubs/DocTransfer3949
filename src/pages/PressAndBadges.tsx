import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Check, Copy, Download, ArrowRight, Lock, FileCheck, ExternalLink, Code } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/Footer';

interface BadgeItem {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  color: string;
  iconName: string;
}

const badges: BadgeItem[] = [
  {
    id: 'protected',
    title: 'Protected by DocTransfer',
    subtitle: 'For pitch decks, shared contracts, and confidential proposals',
    badgeText: '🔒 Secured by DocTransfer',
    color: '#4f46e5',
    iconName: 'Shield'
  },
  {
    id: 'esign-verified',
    title: 'ESIGN & eIDAS Verified',
    subtitle: 'For legal agreements and court-admissible audit trails',
    badgeText: '✓ ESIGN & eIDAS Verified',
    color: '#16a34a',
    iconName: 'FileCheck'
  },
  {
    id: 'zero-knowledge',
    title: 'Zero-Knowledge Encrypted (AES-256)',
    subtitle: 'For proprietary source code, IP, and cap table models',
    badgeText: '🛡️ Zero-Knowledge AES-256',
    color: '#7c3aed',
    iconName: 'Lock'
  },
  {
    id: 'vdr-secured',
    title: 'Verified Virtual Data Room',
    subtitle: 'For Series Seed/A fundraising and M&A due diligence vaults',
    badgeText: '📁 DocTransfer Secure VDR',
    color: '#0284c7',
    iconName: 'Folder'
  }
];

const PressAndBadges: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getMarkdownSnippet = (b: BadgeItem) => {
    return `[![${b.title}](https://img.shields.io/badge/DocTransfer-${encodeURIComponent(b.badgeText)}-${b.color.replace('#', '')}?style=flat-square&logo=shield)](https://www.doctransfer.app)`;
  };

  const getHtmlSnippet = (b: BadgeItem) => {
    return `<a href="https://www.doctransfer.app" target="_blank" rel="noopener"><img src="https://img.shields.io/badge/DocTransfer-${encodeURIComponent(b.badgeText)}-${b.color.replace('#', '')}?style=for-the-badge" alt="${b.title}" /></a>`;
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title="Press Kit & Official Trust Badges | DocTransfer"
        description="Download official DocTransfer trust badges, logos, and media resources. Embed verified e-signature and encryption badges on your site."
        keywords="doctransfer press kit, trust badges, esign badge, secured by doctransfer badge, startup media kit"
        url="https://www.doctransfer.app/press"
      />

      {/* Header */}
      <header style={{ height: '70px', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#4f46e5', fontWeight: '800', fontSize: '1.25rem' }}>
          <Sparkles size={22} /> DocTransfer
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/tools" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Tools</Link>
          <Link to="/templates" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Templates</Link>
          <Link to="/comparisons" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Comparisons</Link>
        </nav>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#ede9fe', padding: '0.35rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', marginBottom: '1rem' }}>
            <Shield size={14} /> Brand Assets & Media Kit
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
            Press Kit & Official Trust Badges
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
            Showcase document security, zero-knowledge encryption, and ESIGN statutory compliance on your investor portals, GitHub READMEs, and pitch decks.
          </p>
        </div>

        {/* Factsheet Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Company Name</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginTop: '0.25rem' }}>DocTransfer</div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.5rem 0 0' }}>The #1 Free DocSend & DocU-Sign Alternative.</p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Security Standard</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#16a34a', marginTop: '0.25rem' }}>Zero-Knowledge</div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.5rem 0 0' }}>Client-side AES-256-GCM browser cryptography.</p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Legal Admissibility</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#4f46e5', marginTop: '0.25rem' }}>ESIGN & eIDAS</div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.5rem 0 0' }}>Statutory compliance in US courts and EU member states.</p>
          </div>
        </div>

        {/* Badges Grid */}
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>
          Embeddable Security & Compliance Badges
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {badges.map(b => (
            <div
              key={b.id}
              style={{
                background: 'white',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '2rem',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: b.color, color: 'white', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '1rem' }}>
                  {b.badgeText}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', margin: '0 0 0.25rem 0' }}>{b.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1.5rem 0' }}>{b.subtitle}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => handleCopy(`${b.id}-md`, getMarkdownSnippet(b))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: copiedId === `${b.id}-md` ? '#16a34a' : '#f8fafc',
                    color: copiedId === `${b.id}-md` ? 'white' : '#334155',
                    border: '1px solid #cbd5e1',
                    padding: '0.65rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {copiedId === `${b.id}-md` ? <><Check size={14} /> Copied Markdown!</> : <><Copy size={14} /> Copy Markdown Badge</>}
                </button>

                <button
                  onClick={() => handleCopy(`${b.id}-html`, getHtmlSnippet(b))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: copiedId === `${b.id}-html` ? '#16a34a' : '#f8fafc',
                    color: copiedId === `${b.id}-html` ? 'white' : '#334155',
                    border: '1px solid #cbd5e1',
                    padding: '0.65rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {copiedId === `${b.id}-html` ? <><Check size={14} /> Copied HTML!</> : <><Code size={14} /> Copy HTML Badge</>}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Media Inquiries Box */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '20px', padding: '3rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>Media & Press Inquiries</h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '550px', margin: 0, lineHeight: 1.5 }}>
              Writing a story on modern document security, zero-knowledge architecture, or the shift away from legacy per-seat document tools? Our founders and security engineers are available for interviews.
            </p>
          </div>
          <a
            href="mailto:press@doctransfer.app"
            style={{
              background: '#4f46e5',
              color: 'white',
              padding: '0.85rem 1.75rem',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '0.95rem',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)'
            }}
          >
            Contact Press Team
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PressAndBadges;
