import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Wrench, FileText, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface RelatedContentSiloProps {
  category: string;
  relatedSlugs?: string[];
  currentSlug?: string;
}

export const RelatedContentSilo: React.FC<RelatedContentSiloProps> = ({
  category,
  relatedSlugs = [],
  currentSlug = ''
}) => {
  const freeTools = [
    { title: 'Pitch Deck Analyzer', path: '/tools/pitch-deck-analyzer', desc: 'Simulate investor reading time & engagement scores' },
    { title: '1-Click NDA Generator', path: '/tools/nda-generator', desc: 'Generate & e-sign mutual or unilateral NDAs' },
    { title: 'Confidential PDF Watermarker', path: '/tools/pdf-watermarking-tool', desc: 'Client-side dynamic watermark protection' },
    { title: 'Virtual Data Room ROI Calculator', path: '/tools/vdr-cost-calculator', desc: 'Calculate savings on M&A data rooms' }
  ];

  const popularTemplates = [
    { title: 'SAFE Note Agreement Template', path: '/templates/safe-agreement-template' },
    { title: 'Commercial Lease Agreement', path: '/templates/lease-agreement-template' },
    { title: 'Subcontractor Services Agreement', path: '/templates/subcontractor-agreement-template' },
    { title: 'Employee Non-Disclosure Agreement', path: '/templates/nda' }
  ];

  return (
    <section style={{
      margin: '4rem 0 2rem 0',
      padding: '2.5rem',
      background: '#f8fafc',
      borderRadius: '24px',
      border: '1px solid #e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: '#4f46e5',
          fontSize: '0.85rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.5rem'
        }}>
          <Layers size={16} /> Topical Authority Hub
        </div>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Explore Related Tools & Workflows
        </h3>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem'
      }}>
        {/* Column 1: Free Interactive Micro-Tools */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
            <Wrench size={18} color="#4f46e5" /> Free Interactive Tools
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {freeTools.map((tool, idx) => (
              <Link
                key={idx}
                to={tool.path}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #f1f5f9',
                  display: 'block',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontWeight: 700, color: '#4f46e5', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                  {tool.title} &rarr;
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  {tool.desc}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Column 2: Free Legal & Business Document Templates */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
            <FileText size={18} color="#10b981" /> High-Intent Legal Templates
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {popularTemplates.map((tmpl, idx) => (
              <Link
                key={idx}
                to={tmpl.path}
                style={{
                  textDecoration: 'none',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#1e293b'
                }}
              >
                <span>{tmpl.title}</span>
                <ArrowRight size={14} color="#10b981" />
              </Link>
            ))}
          </div>
        </div>

        {/* Column 3: Category Hubs & Alternatives Directory */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
            <Sparkles size={18} color="#f59e0b" /> Master Directories
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <Link
              to="/alternatives"
              style={{
                textDecoration: 'none',
                padding: '0.75rem',
                borderRadius: '10px',
                background: '#f8fafc',
                border: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#1e293b'
              }}
            >
              <span>Competitor Alternatives Hub</span>
              <ArrowRight size={14} color="#f59e0b" />
            </Link>
            <Link
              to="/comparisons"
              style={{
                textDecoration: 'none',
                padding: '0.75rem',
                borderRadius: '10px',
                background: '#f8fafc',
                border: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#1e293b'
              }}
            >
              <span>Side-by-Side Comparisons Hub</span>
              <ArrowRight size={14} color="#f59e0b" />
            </Link>
            <Link
              to="/sitemap-directory"
              style={{
                textDecoration: 'none',
                padding: '0.75rem',
                borderRadius: '10px',
                background: '#f8fafc',
                border: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#1e293b'
              }}
            >
              <span>Full 500+ Resource Directory</span>
              <ArrowRight size={14} color="#f59e0b" />
            </Link>
            <Link
              to="/pricing"
              style={{
                textDecoration: 'none',
                padding: '0.75rem',
                borderRadius: '10px',
                background: '#f8fafc',
                border: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#1e293b'
              }}
            >
              <span>Compare Pricing & Limits</span>
              <ArrowRight size={14} color="#f59e0b" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RelatedContentSilo;
