import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import {
  Mail,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Shield,
  FileText,
  Lock,
  BarChart3,
  PenTool,
  Droplets,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface FooterProps {
  light?: boolean;
}

const Footer: React.FC<FooterProps> = ({ light = false }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: light ? '#f8fafc' : '#0a0f1d',
      color: light ? '#1e293b' : '#f8fafc',
      borderTop: light ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
      padding: '5rem 2rem 2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Top Feature Highlights Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          paddingBottom: '3.5rem',
          marginBottom: '3.5rem',
          borderBottom: light ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '0.75rem', borderRadius: '12px' }}>
              <Lock size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: light ? '#0f172a' : 'white' }}>Zero-Knowledge E2EE</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Client-side AES-256 encrypted vaults</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.75rem', borderRadius: '12px' }}>
              <BarChart3 size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: light ? '#0f172a' : 'white' }}>Page-by-Page Tracking</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Real-time dwell time & engagement</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '0.75rem', borderRadius: '12px' }}>
              <PenTool size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: light ? '#0f172a' : 'white' }}>Legally Binding E-Sign</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>eIDAS & ESIGN compliant signatures</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', padding: '0.75rem', borderRadius: '12px' }}>
              <Droplets size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: light ? '#0f172a' : 'white' }}>Dynamic Watermarking</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Traceable recipient email overlays</div>
            </div>
          </div>
        </div>

        {/* Master Navigation Link Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2.5rem',
          marginBottom: '4rem'
        }}>
          
          {/* Col 1: Product */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#818cf8', marginBottom: '1.25rem' }}>
              Product
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/pricing" style={linkStyle(light)}>Pricing Plans</Link></li>
              <li><Link to="/dataroom" style={linkStyle(light)}>Virtual Data Room</Link></li>
              <li><Link to="/document-sharing" style={linkStyle(light)}>Document Sharing</Link></li>
              <li><a href="/#features" style={linkStyle(light)}>Security Features</a></li>
              <li><a href="/#security" style={linkStyle(light)}>Compliance & Audit</a></li>
              <li><Link to="/integrations" style={linkStyle(light)}>Integrations</Link></li>
            </ul>
          </div>

          {/* Col 2: Competitor Alternatives */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#38bdf8', marginBottom: '1.25rem' }}>
              Alternatives
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/docsend-alternative" style={linkStyle(light)}>DocSend Alternative</Link></li>
              <li><Link to="/alternatives/docusign-alternative" style={linkStyle(light)}>DocuSign Alternative</Link></li>
              <li><Link to="/alternatives/pandadoc-alternative" style={linkStyle(light)}>PandaDoc Alternative</Link></li>
              <li><Link to="/comparisons/docsend-vs-doctransfer" style={linkStyle(light)}>DocSend vs DocTransfer</Link></li>
              <li><Link to="/comparisons/docusign-vs-doctransfer" style={linkStyle(light)}>DocuSign vs DocTransfer</Link></li>
              <li><Link to="/alternatives" style={{ ...linkStyle(light), color: '#818cf8', fontWeight: 600 }}>Browse All Alternatives →</Link></li>
            </ul>
          </div>

          {/* Col 3: Free Interactive Tools */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#34d399', marginBottom: '1.25rem' }}>
              Free Tools
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/tools/pitch-deck-analyzer" style={linkStyle(light)}>Pitch Deck Analyzer</Link></li>
              <li><Link to="/tools/nda-generator" style={linkStyle(light)}>Free NDA Generator</Link></li>
              <li><Link to="/tools/vdr-cost-calculator" style={linkStyle(light)}>VDR Cost Calculator</Link></li>
              <li><Link to="/tools/pdf-watermarking-tool" style={linkStyle(light)}>PDF Watermark Tool</Link></li>
              <li><Link to="/tools" style={{ ...linkStyle(light), color: '#34d399', fontWeight: 600 }}>Explore All Free Tools →</Link></li>
            </ul>
          </div>

          {/* Col 4: Popular Templates */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fbbf24', marginBottom: '1.25rem' }}>
              Legal Templates
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/templates/nda" style={linkStyle(light)}>Standard NDA Template</Link></li>
              <li><Link to="/templates/offer-letter" style={linkStyle(light)}>Employment Offer Letter</Link></li>
              <li><Link to="/templates/llc-operating" style={linkStyle(light)}>LLC Operating Agreement</Link></li>
              <li><Link to="/templates/sublease" style={linkStyle(light)}>Commercial Sublease</Link></li>
              <li><Link to="/templates/sales-contract" style={linkStyle(light)}>Sales Contract Template</Link></li>
              <li><Link to="/templates" style={{ ...linkStyle(light), color: '#fbbf24', fontWeight: 600 }}>View 100+ Templates →</Link></li>
            </ul>
          </div>

          {/* Col 5: Solutions by Industry */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#f472b6', marginBottom: '1.25rem' }}>
              Solutions
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/solutions/fundraising" style={linkStyle(light)}>Startups & VC Fundraising</Link></li>
              <li><Link to="/solutions/legal" style={linkStyle(light)}>Law Firms & Legal Intake</Link></li>
              <li><Link to="/solutions/real-estate" style={linkStyle(light)}>Real Estate Closings</Link></li>
              <li><Link to="/solutions/healthcare" style={linkStyle(light)}>Healthcare HIPAA Sharing</Link></li>
              <li><Link to="/solutions" style={{ ...linkStyle(light), color: '#f472b6', fontWeight: 600 }}>Browse All Solutions →</Link></li>
            </ul>
          </div>

          {/* Col 6: Resources & Directory */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a78bfa', marginBottom: '1.25rem' }}>
              Resources & SEO
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/sitemap-directory" style={{ ...linkStyle(light), fontWeight: 700, color: '#818cf8' }}>📁 Master Site Directory</Link></li>
              <li><Link to="/comparisons" style={linkStyle(light)}>Comparisons Hub</Link></li>
              <li><Link to="/glossary" style={linkStyle(light)}>Glossary of Terms (50+)</Link></li>
              <li><Link to="/blog" style={linkStyle(light)}>Document Security Blog</Link></li>
              <li><Link to="/research" style={linkStyle(light)}>Research & Benchmarks</Link></li>
              <li><Link to="/press" style={linkStyle(light)}>Press Kit & Trust Badges</Link></li>
            </ul>
          </div>
        </div>

        {/* Master Directory Jump Bar */}
        <div style={{
          background: light ? 'white' : 'rgba(255, 255, 255, 0.03)',
          border: light ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1.5rem 2rem',
          marginBottom: '3.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: light ? '#0f172a' : 'white', marginBottom: '0.25rem' }}>
              Looking for a specific agreement, competitor comparison, or compliance hub?
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Explore our complete indexed directory of 500+ free resources, legal templates, and comparison matrices.
            </div>
          </div>
          <Link
            to="/sitemap-directory"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
            }}
          >
            Open Resource Directory <ArrowRight size={16} />
          </Link>
        </div>

        {/* Bottom Social & Copyright Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '2rem',
          borderTop: light ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Logo size={28} light={!light} />
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              © {currentYear} DocTransfer Inc. All rights reserved. Secure, private & client-encrypted.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
            <a href="mailto:roushan@doctransfer.online" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Mail size={14} /> roushan@doctransfer.online
            </a>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href="https://x.com/Roushan71262" target="_blank" rel="noopener noreferrer" style={socialIconStyle}><Twitter size={15} /></a>
              <a href="https://www.linkedin.com/in/doctransfer-0a2291314/" target="_blank" rel="noopener noreferrer" style={socialIconStyle}><Linkedin size={15} /></a>
              <a href="https://www.youtube.com/@doctransfer144" target="_blank" rel="noopener noreferrer" style={socialIconStyle}><Youtube size={15} /></a>
              <a href="https://www.instagram.com/doctransfer2227/" target="_blank" rel="noopener noreferrer" style={socialIconStyle}><Instagram size={15} /></a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

const linkStyle = (light: boolean): React.CSSProperties => ({
  color: light ? '#64748b' : '#94a3b8',
  textDecoration: 'none',
  transition: 'color 0.2s ease',
  display: 'inline-block'
});

const socialIconStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '0.45rem',
  borderRadius: '8px',
  color: 'white',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none'
};

export default Footer;
