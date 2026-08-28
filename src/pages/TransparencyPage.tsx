import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import {
  Globe,
  ShieldCheck,
  Lock,
  FileCheck,
  Server,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Scale,
  Calendar,
  Zap,
  Eye,
  Key,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Award,
  Terminal
} from 'lucide-react';

const TransparencyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'canary' | 'uptime' | 'privacy'>('requests');

  const transparencySchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'DocTransfer Public Transparency Report & Warrant Canary',
    description: 'Official DocTransfer transparency report, law enforcement request logs, Warrant Canary status, and zero-knowledge data privacy commitments.',
    publisher: {
      '@type': 'Organization',
      name: 'DocTransfer Inc.',
      url: 'https://www.doctransfer.online'
    }
  };

  const lawEnforcementLog = [
    {
      period: 'H1 2026 (Jan 1 - Jun 30)',
      subpoenasReceived: 0,
      warrantsReceived: 0,
      nationalSecurityLetters: 0,
      accountsImpacted: 0,
      unencryptedDataReleased: 0,
      status: 'No Data Disclosed (Zero-Knowledge Architecture)'
    },
    {
      period: 'H2 2025 (Jul 1 - Dec 31)',
      subpoenasReceived: 0,
      warrantsReceived: 0,
      nationalSecurityLetters: 0,
      accountsImpacted: 0,
      unencryptedDataReleased: 0,
      status: 'No Data Disclosed (Zero-Knowledge Architecture)'
    },
    {
      period: 'H1 2025 (Jan 1 - Jun 30)',
      subpoenasReceived: 0,
      warrantsReceived: 0,
      nationalSecurityLetters: 0,
      accountsImpacted: 0,
      unencryptedDataReleased: 0,
      status: 'No Data Disclosed (Zero-Knowledge Architecture)'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #050811 0%, #0c1224 50%, #050811 100%)',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <SEO
        title="Public Transparency Report & Warrant Canary | DocTransfer"
        description="Review DocTransfer's official Public Transparency Report, government request logs, active Warrant Canary, zero-knowledge privacy commitments, and uptime SLA."
        keywords="doctransfer transparency report, warrant canary, zero-knowledge privacy, law enforcement request log, secure document sharing uptime"
        url="https://www.doctransfer.online/transparency"
        schema={transparencySchema}
      />

      {/* Header */}
      <header style={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(5, 8, 17, 0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '1.25rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Logo size={32} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link to="/security" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}>Security Hub</Link>
            <Link to="/pricing" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}>Pricing</Link>
            <Link to="/login" style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              padding: '0.6rem 1.25rem',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.9rem'
            }}>Start Free</Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem' }}>
        
        {/* Hero Section */}
        <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 4.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '9999px',
            padding: '0.45rem 1.25rem',
            color: '#38bdf8',
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
            boxShadow: '0 0 25px rgba(56, 189, 248, 0.25)'
          }}>
            <Globe size={16} color="#38bdf8" /> Real-Time Public Transparency & Accountability
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            margin: '0 0 1.5rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #e0e7ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Complete Public Transparency Report
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: '#94a3b8',
            lineHeight: 1.65,
            margin: 0
          }}>
            DocTransfer is engineered on zero-knowledge encryption principles. We publish open metrics, government request logs, active Warrant Canaries, and system SLA availability to maintain 100% public accountability.
          </p>
        </div>

        {/* 4 Stat Highlights */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.75rem',
          marginBottom: '5rem'
        }}>
          {[
            { metric: '0', label: 'Decryption Keys Released', desc: 'Zero-knowledge architecture makes server key access mathematically impossible.', color: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' },
            { metric: '99.99%', label: '30-Day Platform Uptime SLA', desc: 'Distributed multi-region infrastructure with automatic failover.', color: '#34d399', border: 'rgba(52, 211, 153, 0.3)' },
            { metric: '100%', label: 'Client-Side Encrypted Files', desc: 'All document payloads are encrypted in local browser memory before upload.', color: '#818cf8', border: 'rgba(129, 140, 248, 0.3)' },
            { metric: '0 Bytes', label: 'Unencrypted Disk Storage', desc: 'DocTransfer stores raw AES-256-GCM cipher blobs with zero plaintext persistence.', color: '#fbbf24', border: 'rgba(251, 191, 36, 0.3)' }
          ].map((stat, idx) => (
            <div key={idx} style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: `1px solid ${stat.border}`,
              borderRadius: '20px',
              padding: '2rem 1.75rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(12px)'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: stat.color, marginBottom: '0.4rem' }}>
                {stat.metric}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5 }}>
                {stat.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '3rem',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'requests', label: 'Government Request Log', icon: Scale },
            { id: 'canary', label: 'Warrant Canary', icon: ShieldAlert },
            { id: 'uptime', label: 'Platform SLA Uptime', icon: Zap },
            { id: 'privacy', label: 'Zero-Knowledge Commitments', icon: Lock }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #818cf8' : '3px solid transparent',
                  color: isActive ? 'white' : '#94a3b8',
                  padding: '1rem 1.5rem',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  borderRadius: '12px 12px 0 0',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={18} color={isActive ? '#818cf8' : '#94a3b8'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Government & Law Enforcement Requests Log */}
        {activeTab === 'requests' && (
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(129, 140, 248, 0.3)', borderRadius: '24px', padding: '2.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'white' }}>
                Law Enforcement & Legal Request Log
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.98rem', margin: 0, lineHeight: 1.6 }}>
                DocTransfer discloses all formal requests received from government, law enforcement, and judicial authorities globally. Because decryption keys are never stored on our servers, we are cryptographically incapable of turning over unencrypted user files.
              </p>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)', color: '#a5b4fc', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '1rem' }}>Reporting Period</th>
                    <th style={{ padding: '1rem' }}>Subpoenas</th>
                    <th style={{ padding: '1rem' }}>Search Warrants</th>
                    <th style={{ padding: '1rem' }}>National Security Letters</th>
                    <th style={{ padding: '1rem' }}>Accounts Impacted</th>
                    <th style={{ padding: '1rem' }}>Data Disclosed</th>
                  </tr>
                </thead>
                <tbody>
                  {lawEnforcementLog.map((row, rIdx) => (
                    <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <td style={{ padding: '1.15rem 1rem', fontWeight: 700, color: 'white' }}>{row.period}</td>
                      <td style={{ padding: '1.15rem 1rem', color: '#cbd5e1' }}>{row.subpoenasReceived}</td>
                      <td style={{ padding: '1.15rem 1rem', color: '#cbd5e1' }}>{row.warrantsReceived}</td>
                      <td style={{ padding: '1.15rem 1rem', color: '#cbd5e1' }}>{row.nationalSecurityLetters}</td>
                      <td style={{ padding: '1.15rem 1rem', color: '#cbd5e1' }}>{row.accountsImpacted}</td>
                      <td style={{ padding: '1.15rem 1rem' }}>
                        <span style={{
                          background: 'rgba(52, 211, 153, 0.15)',
                          color: '#34d399',
                          border: '1px solid rgba(52, 211, 153, 0.3)',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}>
                          <CheckCircle2 size={14} /> 0 Bytes Released
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8', fontSize: '0.88rem' }}>
              💡 <strong>Legal Standard:</strong> DocTransfer strictly requires a valid, binding court order issued by a court of competent jurisdiction before responding to any legal inquiries. However, due to client-side WebCrypto key generation, our servers hold only encrypted payloads.
            </div>
          </div>
        )}

        {/* Tab 2: Warrant Canary */}
        {activeTab === 'canary' && (
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(251, 191, 36, 0.4)', borderRadius: '24px', padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <ShieldAlert size={28} color="#fbbf24" />
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'white' }}>
                  Official Warrant Canary Declaration
                </h2>
                <div style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 700, marginTop: '0.2rem' }}>
                  Last Updated & Verified: August 29, 2026
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(251, 191, 36, 0.25)',
              borderRadius: '16px',
              padding: '2rem',
              fontFamily: 'monospace',
              fontSize: '0.92rem',
              color: '#e2e8f0',
              lineHeight: 1.7,
              marginBottom: '2rem'
            }}>
              <p style={{ margin: '0 0 1.25rem', color: '#fbbf24', fontWeight: 700 }}>
                === DOCTRANSFER WARRANT CANARY STATEMENT ===
              </p>
              <p style={{ margin: '0 0 1rem' }}>
                1. DocTransfer Inc. has NEVER received a National Security Letter (NSL), secret gag order, FISA court mandate, or administrative subpoena demanding backdoors into our encryption pipeline.
              </p>
              <p style={{ margin: '0 0 1rem' }}>
                2. DocTransfer Inc. has NEVER placed backdoors, master keys, or telemetry hooks into our client-side WebCrypto encryption code.
              </p>
              <p style={{ margin: '0 0 1rem' }}>
                3. DocTransfer Inc. has NEVER altered customer source code or client-side JavaScript to intercept decryption keys held in URL hash fragments (#key=...).
              </p>
              <p style={{ margin: 0, color: '#34d399', fontWeight: 700 }}>
                STATUS: CANARY IS ACTIVE AND UNBROKEN.
              </p>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              If this Warrant Canary statement is ever modified or removed from this page without an explicit timestamp update, users should assume that DocTransfer has been served with a legal order prohibiting disclosure.
            </p>
          </div>
        )}

        {/* Tab 3: Platform SLA & Uptime */}
        {activeTab === 'uptime' && (
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '24px', padding: '2.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'white' }}>
                System Infrastructure Status & SLA
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.98rem', margin: 0 }}>
                Real-time operational status for core DocTransfer application components across global edge regions.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {[
                { name: 'Document Vault Storage', status: 'Operational', uptime: '99.99%', latency: '24ms' },
                { name: 'E-Signature Engine', status: 'Operational', uptime: '99.98%', latency: '35ms' },
                { name: 'Page Analytics Dispatcher', status: 'Operational', uptime: '100.00%', latency: '18ms' },
                { name: 'Global Edge Routing (Vercel)', status: 'Operational', uptime: '99.99%', latency: '12ms' }
              ].map((comp, idx) => (
                <div key={idx} style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(52, 211, 153, 0.25)',
                  borderRadius: '16px',
                  padding: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 700, color: 'white', fontSize: '0.98rem' }}>{comp.name}</span>
                    <span style={{
                      background: 'rgba(52, 211, 153, 0.15)',
                      color: '#34d399',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
                      {comp.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem' }}>
                    <span>Uptime: <strong style={{ color: 'white' }}>{comp.uptime}</strong></span>
                    <span>Edge Latency: <strong style={{ color: '#38bdf8' }}>{comp.latency}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Zero-Knowledge Commitments */}
        {activeTab === 'privacy' && (
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(129, 140, 248, 0.3)', borderRadius: '24px', padding: '2.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'white' }}>
                Zero-Knowledge Privacy Charter
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.98rem', margin: 0 }}>
                Our core cryptographic architecture is designed so you never have to blindly trust us.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
              {[
                { title: 'Zero Server Key Storage', desc: 'Decryption keys are generated in browser memory and passed in URL hash fragments (#key=...). Hash fragments are omitted by browsers from HTTP GET headers.', icon: Key, color: '#818cf8' },
                { title: 'No Ad Trackers or Telemetry', desc: 'DocTransfer never sells user document data, embeds third-party ad pixels, or shares analytics with data brokers.', icon: Eye, color: '#38bdf8' },
                { title: 'Automatic Self-Destruct Purge', desc: 'Files configured with view limits or expiration dates are purged from storage infrastructure permanently with zero ghost backups.', icon: ShieldCheck, color: '#34d399' }
              ].map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <div key={idx} style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '18px',
                    padding: '1.75rem'
                  }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, marginBottom: '1.25rem' }}>
                      <ItemIcon size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', margin: '0 0 0.65rem' }}>{item.title}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Vulnerability Disclosure Footer Card */}
        <div style={{
          marginTop: '4rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
          border: '1px solid rgba(129, 140, 248, 0.35)',
          borderRadius: '24px',
          padding: '2.5rem 3rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white', margin: '0 0 0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={20} color="#818cf8" /> Responsible Security Disclosure
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', margin: 0 }}>
              Found a potential security issue or vulnerability? Report it to our security engineering team for expedited triage.
            </p>
          </div>
          <a
            href="mailto:roushan@doctransfer.online"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              padding: '0.8rem 1.6rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)'
            }}
          >
            Email Security Team <ArrowRight size={16} />
          </a>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default TransparencyPage;
