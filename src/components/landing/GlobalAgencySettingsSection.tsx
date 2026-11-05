import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Palette,
  CreditCard,
  Bell,
  Scale,
  ShieldCheck,
  CheckCircle,
  Globe,
  Sparkles,
  ArrowRight,
  Smartphone,
  Building2,
  Lock,
  Clock,
  Download,
  Activity,
  FileCheck,
  Shield
} from 'lucide-react';

export const GlobalAgencySettingsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'branding' | 'billing' | 'telemetry' | 'compliance' | 'sla'>('branding');

  const tabs = [
    { id: 'branding', label: 'White-Label & Agency', icon: Palette, badge: 'Broker Ready' },
    { id: 'billing', label: 'Billing & Global Tax', icon: CreditCard, badge: 'VAT / Multi-Currency' },
    { id: 'telemetry', label: 'WhatsApp & Lead Alerts', icon: Bell, badge: 'Instant' },
    { id: 'compliance', label: 'International Legal Defaults', icon: Scale, badge: 'DIFC / eIDAS' },
    { id: 'sla', label: 'SLA & 99.99% Uptime', icon: ShieldCheck, badge: 'Enterprise' }
  ];

  return (
    <section style={{
      padding: '6rem 2rem',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      color: '#f8fafc',
      position: 'relative',
      overflow: 'hidden',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      {/* Background ambient lighting */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 3.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
            border: '1px solid rgba(129, 140, 248, 0.4)',
            borderRadius: '9999px',
            padding: '0.45rem 1.25rem',
            color: '#a5b4fc',
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '1.25rem'
          }}>
            <Sparkles size={15} color="#818cf8" /> Institutional Deal Room Administration
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 3.8vw, 3rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            margin: '0 0 1rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #c7d2fe 50%, #e0e7ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Global Agency Settings & Compliance Suite
          </h2>

          <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
            Re-engineered for luxury real estate developers, cross-border M&A advisors, and private family offices operating across Dubai, Europe, and Asia.
          </p>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div style={{
          display: 'flex',
          gap: '0.6rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '3rem'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: '14px',
                  border: isSel ? '1.5px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isSel ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.2) 100%)' : 'rgba(15, 23, 42, 0.6)',
                  color: isSel ? '#ffffff' : '#94a3b8',
                  fontSize: '0.88rem',
                  fontWeight: isSel ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  transition: 'all 0.2s ease',
                  boxShadow: isSel ? '0 0 20px rgba(99, 102, 241, 0.3)' : 'none'
                }}
              >
                <Icon size={17} color={isSel ? '#818cf8' : '#64748b'} />
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '999px',
                  background: isSel ? '#4f46e5' : 'rgba(255, 255, 255, 0.08)',
                  color: isSel ? '#ffffff' : '#64748b'
                }}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Interactive Showcase Card */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(129, 140, 248, 0.25)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.15)'
        }}>

          {/* TAB 1: White-Label & Agency */}
          {activeTab === 'branding' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  <ShieldCheck size={16} /> Global Broker & Agency Accreditation
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', margin: '0 0 1rem' }}>
                  Institutional White-Labeling & Custom Subdomains
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Remove all DocTransfer branding. Present investor decks, confidential sales memos, and luxury property portfolios under your firm’s verified regulatory credentials.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                  {[
                    'Dubai DLD / RERA ORN, UK Estate Agents Act, and EU Broker License verification badge',
                    'Custom branded CNAME subdomain (e.g. deals.sovereignholdings.ae)',
                    'Dynamic anti-bypass tiled watermark with investor email and IP stamp',
                    'Exclusive luxury palettes: Dubai Sovereign Gold, Canary Wharf Navy, Zurich Slate'
                  ].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.88rem', color: '#cbd5e1' }}>
                      <CheckCircle size={17} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/settings?tab=branding"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#4f46e5',
                    color: 'white',
                    padding: '0.75rem 1.4rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textDecoration: 'none'
                  }}
                >
                  Configure White-Labeling <ArrowRight size={15} />
                </Link>
              </div>

              {/* Interactive Mockup Preview */}
              <div style={{ background: '#090d16', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '1.5rem', boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '0.5rem', fontFamily: 'monospace' }}>
                      deals.sovereignholdings.ae/view/palm-skyvilla
                    </span>
                  </div>
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', background: '#ecfdf5', color: '#065f46', fontWeight: 700 }}>
                    DLD ORN: 18429 ✓
                  </span>
                </div>

                <div style={{ background: '#131b2e', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'white' }}>APEX LUXURY ADVISORY</div>
                    <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>VERIFIED BROKER</div>
                  </div>
                  <div style={{ height: '120px', background: '#0b1120', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    <span style={{ transform: 'rotate(-25deg)', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.18)', fontWeight: 800, letterSpacing: '0.1em', textAlign: 'center' }}>
                      CONFIDENTIAL • APEX LUXURY • FOR INVESTOR@GULF-CAPITAL.AE • IP: 185.220.101.4
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Billing & Global Tax */}
          {activeTab === 'billing' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  <Globe size={16} /> Multi-Jurisdiction B2B Invoicing
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', margin: '0 0 1rem' }}>
                  UAE 5% VAT, EU Reverse-Charge & Multi-Currency
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Generate compliant B2B tax receipts with international Tax Registration Numbers (TRN), VIES reverse-charge notations, and corporate W-9 exemptions.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                  {[
                    '🇦🇪 UAE FTA 5% VAT with 15-digit TRN compliance',
                    '🇪🇺 EU VAT VIES validation with automated 0% Reverse-Charge',
                    'Multi-currency settlement & invoicing: $ USD, AED (د.إ), € EUR, £ GBP',
                    '1-Click automated PDF corporate tax invoices with legal entity credentials'
                  ].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.88rem', color: '#cbd5e1' }}>
                      <CheckCircle size={17} color="#38bdf8" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/settings?tab=billing"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#0284c7',
                    color: 'white',
                    padding: '0.75rem 1.4rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textDecoration: 'none'
                  }}
                >
                  Manage Tax & Invoicing <ArrowRight size={15} />
                </Link>
              </div>

              {/* Invoice Preview */}
              <div style={{ background: '#090d16', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Sample International Tax Invoice
                </div>
                <div style={{ background: '#131b2e', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'white' }}>TAX INVOICE #DT-2026-AE</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>TRN: 100492817200003 (DIFC, Dubai)</div>
                    </div>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', background: '#0284c7', color: 'white', fontWeight: 700 }}>
                      PAID ✓
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', padding: '0.5rem 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <span>Virtual Data Room Enterprise (Annual)</span>
                    <span style={{ fontWeight: 700 }}>$4,788.00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', padding: '0.25rem 0' }}>
                    <span>UAE VAT (5%)</span>
                    <span>$239.40</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#38bdf8', fontWeight: 800, paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <span>Total Invoiced</span>
                    <span>$5,027.40 USD</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WhatsApp & Lead Alerts */}
          {activeTab === 'telemetry' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#ec4899', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  <Bell size={16} /> High-Intent Deal Telemetry
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', margin: '0 0 1rem' }}>
                  Instant WhatsApp & Multi-Channel Investor Alerts
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Close transactions faster by striking when buyer engagement is highest. Receive real-time WhatsApp pings the instant institutional investors study your confidential materials.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                  {[
                    'Global country code routing: UAE (+971), UK (+44), USA (+1), Singapore (+65), EU (+33/+49)',
                    '🔥 Hot Lead Dwell Alert: Pinged when an investor spends >60s on financial valuation models',
                    '🚨 Forward & Leak Warning: Alerted if a confidential link is opened from an unexpected country',
                    'Daily 9:00 AM deal pipeline digest delivered to your WhatsApp or corporate email'
                  ].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.88rem', color: '#cbd5e1' }}>
                      <CheckCircle size={17} color="#ec4899" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/settings?tab=notifications"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#db2777',
                    color: 'white',
                    padding: '0.75rem 1.4rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textDecoration: 'none'
                  }}
                >
                  Configure Lead Alerts <ArrowRight size={15} />
                </Link>
              </div>

              {/* WhatsApp Notification Mockup */}
              <div style={{ background: '#090d16', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '1.5rem' }}>
                <div style={{ background: '#075e54', padding: '0.75rem 1rem', borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Smartphone size={18} color="white" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>DocTransfer Telemetry Bot</span>
                </div>
                <div style={{ background: '#0b141a', padding: '1.25rem', borderRadius: '0 0 12px 12px' }}>
                  <div style={{ background: '#1f2c34', padding: '0.85rem 1rem', borderRadius: '10px', color: '#e9edef', fontSize: '0.82rem', lineHeight: 1.5, borderLeft: '3px solid #25d366' }}>
                    <div style={{ fontWeight: 800, color: '#25d366', marginBottom: '0.25rem' }}>🔥 HOT INVESTOR ALERT (DIFC Fund)</div>
                    Managing Director at <em>Gulf Private Equity</em> just spent <strong>85s</strong> reviewing <strong>Page 4 (Financial Model & EBITDA)</strong> of <em>Project Horizon Acquisition Memo</em>.<br /><br />
                    📍 Location: Dubai, UAE (IP: 185.192.x.x)<br />
                    ⏱️ Time: 14:32 GST • NDA Accepted ✓
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: International Legal Defaults */}
          {activeTab === 'compliance' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#a855f7', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  <Scale size={16} /> Cross-Border Enforceability
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', margin: '0 0 1rem' }}>
                  DIFC, eIDAS & International Legal Defaults
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Configure automatic digital evidence seals, neutral arbitration clauses, and cryptographic audit certificates recognized in commercial tribunals worldwide.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                  {[
                    '🏛️ DIFC / ADGM Arbitration Seal (English Law jurisdiction)',
                    '🛡️ GDPR Article 32 & UAE PDPL Data Protection Seal (Federal Decree-Law 45/2021)',
                    '⚖️ eIDAS & US ESIGN Digital Admissibility SHA-256 Audit Certificate',
                    '📜 30-Year Clean Title & Freehold Ownership Verified Covenant'
                  ].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.88rem', color: '#cbd5e1' }}>
                      <CheckCircle size={17} color="#a855f7" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/settings?tab=compliance"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#9333ea',
                    color: 'white',
                    padding: '0.75rem 1.4rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textDecoration: 'none'
                  }}
                >
                  Configure Legal Defaults <ArrowRight size={15} />
                </Link>
              </div>

              {/* Legal Certificate Preview */}
              <div style={{ background: '#090d16', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '1.5rem' }}>
                <div style={{ background: '#1e1b4b', borderRadius: '12px', padding: '1.25rem', border: '1px solid #4338ca' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c7d2fe', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                    <Shield size={18} color="#818cf8" /> eIDAS & DIFC Court-Admissible Audit Certificate
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.6, fontFamily: 'monospace' }}>
                    Document Hash (SHA-256):<br />
                    <span style={{ color: '#a5b4fc' }}>e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span><br /><br />
                    • Cryptographic Timestamp: ISO 8601 UTC<br />
                    • Jurisdiction: DIFC-LCIA Arbitration / English Law<br />
                    • Governing Privacy: UAE PDPL & EU GDPR Art. 32<br />
                    • Tamper-Proof Audit Status: VALIDATED ✓
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SLA & 99.99% Uptime */}
          {activeTab === 'sla' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  <Activity size={16} /> Enterprise Reliability
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', margin: '0 0 1rem' }}>
                  99.99% Uptime SLA & Global Edge Network
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Backed by contractually enforceable service level agreements. Ultra-low latency document decryption across Tier-IV data centers worldwide.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                  {[
                    'Global Edge Cloud: Dubai (UAE), Frankfurt (EU), London (UK), Singapore',
                    'Zero Single-Point-of-Failure multi-cloud failover infrastructure',
                    '24/7 dedicated institutional security engineering hotline',
                    'Contractual SLA credits with automated claim processing'
                  ].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.88rem', color: '#cbd5e1' }}>
                      <CheckCircle size={17} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/settings?tab=sla"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#059669',
                    color: 'white',
                    padding: '0.75rem 1.4rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textDecoration: 'none'
                  }}
                >
                  View Live SLA Status <ArrowRight size={15} />
                </Link>
              </div>

              {/* Edge Network Status Grid */}
              <div style={{ background: '#090d16', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'white', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>GLOBAL EDGE TELEMETRY</span>
                  <span style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '999px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    ALL SYSTEMS OPERATIONAL
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {[
                    { region: 'Dubai (me-central-1)', latency: '12ms', status: '100.0%' },
                    { region: 'Frankfurt (eu-central-1)', latency: '18ms', status: '100.0%' },
                    { region: 'London (eu-west-2)', latency: '22ms', status: '100.0%' },
                    { region: 'Singapore (ap-southeast-1)', latency: '28ms', status: '99.99%' },
                  ].map((node, i) => (
                    <div key={i} style={{ background: '#131b2e', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>{node.region}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem', fontSize: '0.7rem', color: '#94a3b8' }}>
                        <span>Ping: {node.latency}</span>
                        <span style={{ color: '#10b981', fontWeight: 700 }}>{node.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default GlobalAgencySettingsSection;

