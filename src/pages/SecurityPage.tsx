import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import {
  Shield,
  Lock,
  FileCheck,
  Server,
  Eye,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  RefreshCw,
  Mail,
  Key,
  ShieldCheck,
  Cpu,
  Globe,
  Database,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';

const SecurityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'encryption' | 'compliance' | 'subprocessors'>('overview');

  const securitySchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'DocTransfer Trust & Security Hub',
    description: 'Enterprise-grade security, AES-256 encryption, SOC-2 readiness, HIPAA, GDPR, and eIDAS compliance standards at DocTransfer.',
    publisher: {
      '@type': 'Organization',
      name: 'DocTransfer Inc.',
      url: 'https://www.doctransfer.app'
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1d',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <SEO
        title="Trust & Security Hub | Encryption, SOC-2 & Compliance"
        description="DocTransfer security architecture: Client-side AES-256 encryption, dynamic watermarking, SOC-2 Type II readiness, GDPR, HIPAA, and eIDAS e-signature validity."
        keywords="doc transfer security, virtual data room security, docsend security alternative, AES-256 document encryption, SOC 2 compliance, HIPAA document sharing"
        url="https://www.doctransfer.app/security"
        schema={securitySchema}
      />

      {/* Navigation Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(10, 15, 29, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '1rem 2rem'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Logo size={32} light={false} />
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link to="/dataroom" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
              Data Room
            </Link>
            <Link to="/pricing" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
              Pricing
            </Link>
            <Link to="/docsend-alternative" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
              DocSend Alternative
            </Link>
            <Link
              to="/document-sharing"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                padding: '0.6rem 1.25rem',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
              }}
            >
              Get Started Free
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '5rem 2rem 4rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.18) 0%, rgba(10, 15, 29, 0) 70%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '9999px',
            padding: '0.4rem 1rem',
            color: '#818cf8',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            <ShieldCheck size={16} /> Enterprise Trust & Security Infrastructure
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            margin: '0 0 1.25rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Security is Built into Our Code, Not Added as an Afterthought.
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: '#94a3b8',
            lineHeight: 1.6,
            maxWidth: '760px',
            margin: '0 auto 2.5rem'
          }}>
            DocTransfer is engineered for high-stakes dealmaking, venture capital fundraising, legal agreements, and corporate M&A. Every document is protected by bank-grade AES-256 encryption, dynamic watermarks, and forensic audit logs.
          </p>

          {/* Core Certification Badges Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '3rem'
          }}>
            {[
              { label: 'AES-256-GCM Encrypted', icon: Lock, color: '#818cf8' },
              { label: 'SOC-2 Type II Aligned', icon: Shield, color: '#38bdf8' },
              { label: 'ISO 27001 Aligned', icon: Server, color: '#34d399' },
              { label: 'HIPAA Compliant Ready', icon: FileCheck, color: '#fbbf24' },
              { label: 'GDPR Data Compliant', icon: Globe, color: '#f472b6' },
              { label: 'eIDAS & ESIGN Validated', icon: CheckCircle2, color: '#a78bfa' }
            ].map((badge, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.6rem 1rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'white'
              }}>
                <badge.icon size={16} color={badge.color} />
                <span>{badge.label}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Navigation Tabs */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem 2rem 0'
      }}>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          {[
            { id: 'overview', label: 'Security Pillars' },
            { id: 'encryption', label: 'Encryption Architecture' },
            { id: 'compliance', label: 'Compliance & Legal' },
            { id: 'subprocessors', label: 'Sub-processors Directory' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: activeTab === tab.id ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#94a3b8',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        
        {/* Tab 1: Security Pillars */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            
            {/* Card 1 */}
            <div style={cardStyle}>
              <div style={{ ...iconContainerStyle, background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                <Lock size={26} />
              </div>
              <h3 style={cardHeaderStyle}>Data Encryption Vaults</h3>
              <p style={cardBodyStyle}>
                All document uploads are encrypted client-side and at rest using AES-256-GCM. Transport layer communication requires mandatory TLS 1.3 with HSTS preloading enabled.
              </p>
              <ul style={checkListStyle}>
                <li><CheckCircle2 size={16} color="#34d399" /> AES-256 encryption at rest</li>
                <li><CheckCircle2 size={16} color="#34d399" /> TLS 1.3 HSTS transport enforcement</li>
                <li><CheckCircle2 size={16} color="#34d399" /> Zero-knowledge encrypted options</li>
              </ul>
            </div>

            {/* Card 2 */}
            <div style={cardStyle}>
              <div style={{ ...iconContainerStyle, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                <Eye size={26} />
              </div>
              <h3 style={cardHeaderStyle}>Dynamic DRM & Watermarking</h3>
              <p style={cardBodyStyle}>
                Protect confidential pitch decks and legal agreements from unauthorized redistribution with recipient-specific dynamic watermarks and access revocation.
              </p>
              <ul style={checkListStyle}>
                <li><CheckCircle2 size={16} color="#34d399" /> Recipient email & IP address overlays</li>
                <li><CheckCircle2 size={16} color="#34d399" /> Screenshot protection & disabling print</li>
                <li><CheckCircle2 size={16} color="#34d399" /> One-click instant link access revocation</li>
              </ul>
            </div>

            {/* Card 3 */}
            <div style={cardStyle}>
              <div style={{ ...iconContainerStyle, background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                <FileCheck size={26} />
              </div>
              <h3 style={cardHeaderStyle}>Legal E-Signature Validity</h3>
              <p style={cardBodyStyle}>
                Sign agreements with full legal enforceability under the US ESIGN Act, UETA, and European eIDAS regulations, backed by cryptographic verification certificates.
              </p>
              <ul style={checkListStyle}>
                <li><CheckCircle2 size={16} color="#34d399" /> ESIGN & UETA statutory compliance</li>
                <li><CheckCircle2 size={16} color="#34d399" /> Cryptographic signature verification</li>
                <li><CheckCircle2 size={16} color="#34d399" /> Optional biometric snapshot gate</li>
              </ul>
            </div>

            {/* Card 4 */}
            <div style={cardStyle}>
              <div style={{ ...iconContainerStyle, background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
                <Server size={26} />
              </div>
              <h3 style={cardHeaderStyle}>Forensic Audit Trails</h3>
              <p style={cardBodyStyle}>
                Track every action taken on your document with page-by-page dwell time, geographic IP geolocation, device signatures, and SHA-256 log hash records.
              </p>
              <ul style={checkListStyle}>
                <li><CheckCircle2 size={16} color="#34d399" /> Page-level analytics & heatmaps</li>
                <li><CheckCircle2 size={16} color="#34d399" /> IP Geolocation & User Agent logs</li>
                <li><CheckCircle2 size={16} color="#34d399" /> Exportable audit compliance reports</li>
              </ul>
            </div>

          </div>
        )}

        {/* Tab 2: Encryption Architecture */}
        {activeTab === 'encryption' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ ...cardStyle, padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 1rem', color: 'white' }}>
                Client-Side Cryptography & Key Management
              </h2>
              <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '1rem', margin: '0 0 1.5rem' }}>
                DocTransfer implements a multi-tier cryptographic storage architecture. Documents marked for zero-knowledge vault storage are encrypted on your local browser before transmission. The decryption keys are encoded into URL fragments (hash parameters), ensuring our servers never possess the key to decrypt your raw files.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.5rem',
                marginTop: '2rem'
              }}>
                <div style={innerBoxStyle}>
                  <Key size={22} color="#818cf8" style={{ marginBottom: '0.75rem' }} />
                  <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', color: 'white' }}>AES-256-GCM Vaults</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    Galois/Counter Mode provides authenticated encryption ensuring both data confidentiality and payload authenticity verification.
                  </p>
                </div>
                <div style={innerBoxStyle}>
                  <Cpu size={22} color="#34d399" style={{ marginBottom: '0.75rem' }} />
                  <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', color: 'white' }}>WebCrypto API Execution</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    Uses native hardware-accelerated WebCrypto primitives built directly into modern web browsers for high performance.
                  </p>
                </div>
                <div style={innerBoxStyle}>
                  <Database size={22} color="#38bdf8" style={{ marginBottom: '0.75rem' }} />
                  <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', color: 'white' }}>Automated Key Rotation</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    Database column keys and storage bucket access signatures are continuously rotated via automated security cron routines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Compliance & Legal */}
        {activeTab === 'compliance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ ...cardStyle, padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 1rem', color: 'white' }}>
                Global Legal Framework Compliance
              </h2>
              <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '1rem', margin: '0 0 2rem' }}>
                DocTransfer is architected to satisfy the strictest international privacy and regulatory standards.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div style={innerBoxStyle}>
                  <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem', color: '#818cf8' }}>US ESIGN Act & UETA</h4>
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                    Electronic signatures executed on DocTransfer carry full legal weight equal to traditional wet-ink signatures under federal and state laws.
                  </p>
                </div>
                <div style={innerBoxStyle}>
                  <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem', color: '#38bdf8' }}>EU eIDAS Standard</h4>
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                    Complies with European Regulation No 910/2014 for Electronic Identification and Trust Services for electronic transactions.
                  </p>
                </div>
                <div style={innerBoxStyle}>
                  <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem', color: '#34d399' }}>HIPAA BAA Readiness</h4>
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                    Supports healthcare organizations sharing Protected Health Information (PHI) under Business Associate Agreement (BAA) standards.
                  </p>
                </div>
                <div style={innerBoxStyle}>
                  <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem', color: '#f472b6' }}>EU-US GDPR Data Privacy</h4>
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                    Full compliance with user data portability, right-to-be-forgotten deletion requests, and Data Processing Addendums (DPA).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Subprocessors Directory */}
        {activeTab === 'subprocessors' && (
          <div style={{ ...cardStyle, padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.75rem', color: 'white' }}>
              Sub-processor Transparency Directory
            </h2>
            <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '0.95rem', margin: '0 0 2rem' }}>
              To deliver high availability and secure global delivery, DocTransfer engages the following vetted sub-processors:
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.9rem'
              }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.15)', color: '#818cf8' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Vendor / Partner</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Purpose</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Data Location</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Security Certifications</th>
                  </tr>
                </thead>
                <tbody style={{ color: '#cbd5e1' }}>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'white' }}>Supabase / AWS Cloud</td>
                    <td style={{ padding: '1rem' }}>Database & Encrypted Storage</td>
                    <td style={{ padding: '1rem' }}>United States / EU (US-East)</td>
                    <td style={{ padding: '1rem' }}>SOC 2 Type II, ISO 27001, HIPAA</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'white' }}>Stripe Inc.</td>
                    <td style={{ padding: '1rem' }}>Payment Processing & Subscriptions</td>
                    <td style={{ padding: '1rem' }}>United States</td>
                    <td style={{ padding: '1rem' }}>PCI-DSS Level 1 Compliant</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'white' }}>Vercel Inc.</td>
                    <td style={{ padding: '1rem' }}>Edge Web Application Hosting</td>
                    <td style={{ padding: '1rem' }}>Global Edge Network</td>
                    <td style={{ padding: '1rem' }}>SOC 2 Type II, ISO 27001</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Infrastructure Status Widget */}
        <div style={{
          marginTop: '3.5rem',
          background: 'rgba(16, 185, 129, 0.06)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '16px',
          padding: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#34d399',
              boxShadow: '0 0 12px #34d399'
            }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'white' }}>All Infrastructure Systems Operational</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Core API, Storage Buckets, E-Sign Engine, and Analytics Stream running smoothly.</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#34d399', fontWeight: 600 }}>
            <span>99.99% Uptime SLA</span>
            <span>Real-time Monitoring</span>
          </div>
        </div>

        {/* Security Disclosure Contact Box */}
        <div style={{
          marginTop: '3.5rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '2.5rem',
          textAlign: 'center'
        }}>
          <Mail size={32} color="#818cf8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'white' }}>
            Responsible Security Vulnerability Disclosure
          </h3>
          <p style={{ color: '#94a3b8', maxWidth: '640px', margin: '0 auto 1.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Have you discovered a potential security vulnerability or need a custom Data Processing Addendum (DPA) signed? Contact our dedicated security response team directly.
          </p>
          <a
            href="mailto:roushan@doctransfer.online"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#818cf8',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none'
            }}
          >
            Contact Security Team (roushan@doctransfer.online) <ArrowRight size={16} />
          </a>
        </div>

      </main>

      {/* Footer */}
      <Footer light={false} />
    </div>
  );
};

// Reusable Styles
const cardStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '20px',
  padding: '2rem',
  transition: 'transform 0.2s ease, border-color 0.2s ease'
};

const iconContainerStyle: React.CSSProperties = {
  width: '52px',
  height: '52px',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1.25rem'
};

const cardHeaderStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 700,
  margin: '0 0 0.75rem',
  color: 'white'
};

const cardBodyStyle: React.CSSProperties = {
  fontSize: '0.92rem',
  color: '#94a3b8',
  lineHeight: 1.6,
  margin: '0 0 1.5rem'
};

const checkListStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
  fontSize: '0.88rem',
  color: '#cbd5e1'
};

const innerBoxStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '14px',
  padding: '1.25rem'
};

export default SecurityPage;
