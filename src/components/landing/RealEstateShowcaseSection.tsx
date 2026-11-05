import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  ShieldCheck,
  FolderLock,
  Building2,
  Users2,
  Scale,
  Globe2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Smartphone,
  BarChart3
} from 'lucide-react';

export const RealEstateShowcaseSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'watermark' | 'vdr'>('whatsapp');

  const personas = [
    {
      role: 'Luxury Developers & Brokerages',
      icon: Building2,
      color: '#059669',
      bg: '#ecfdf5',
      border: '#a7f3d0',
      headline: 'Accelerate Sales Velocity & Off-Plan Launches',
      points: [
        'Stop unit pricing, VIP payment plans, and floor plan leaks to rival brokers',
        'Track buyer dwell time on penthouse layouts, payment milestones, and amenities',
        'Maintain an immutable audit trail of all investor disclosures across Dubai, Europe & Asia'
      ]
    },
    {
      role: 'Hospitality & Resort Groups',
      icon: Users2,
      color: '#0284c7',
      bg: '#f0f9ff',
      border: '#bae6fd',
      headline: 'Confidential Hotel Diligence & Operator Tenders',
      points: [
        'Safeguard RevPAR models, historical occupancy data, and P&L financial audits',
        'Distribute RFP dossiers and management agreements to international hotel operators',
        'Get notified the exact second a private equity or hospitality fund opens your teaser'
      ]
    },
    {
      role: 'M&A Counsel & Diligence Teams',
      icon: Scale,
      color: '#7c3aed',
      bg: '#f5f3ff',
      border: '#ddd6fe',
      headline: 'Cross-Border Property & Asset Diligence',
      points: [
        'Organize 500+ page scans: title deeds, environmental permits, zoning, and leases',
        'Institutional data rooms prepared for European, GCC (DIFC/ADGM), and Asian financing',
        'Generate tamper-proof electronic audit certificates compliant with global e-evidence'
      ]
    },
    {
      role: 'Global Family Offices & HNI Investors',
      icon: Globe2,
      color: '#d97706',
      bg: '#fffbeb',
      border: '#fde68a',
      headline: 'Frictionless Cross-Border Asset Acquisitions',
      points: [
        'Zero app installation — view ultra-high-res architectural masterplans on any device',
        'Execute provisional acquisition LOIs and NDAs securely from London, Dubai, or Singapore',
        'Client-side AES-256 encryption protects passport KYC, proof of funds, and cap tables'
      ]
    }
  ];

  return (
    <section style={{
      padding: '5.5rem 2rem',
      background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f0fdf4 100%)',
      borderTop: '1px solid #e2e8f0',
      borderBottom: '1px solid #e2e8f0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Accent Gradients */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(6, 95, 70, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            padding: '0.4rem 1rem',
            borderRadius: '30px',
            color: '#065f46',
            fontWeight: 700,
            fontSize: '0.82rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '1rem'
          }}>
            <span>🌍</span> Luxury Real Estate & Hospitality Deal Rooms
          </div>
          <h2 style={{
            fontSize: '2.4rem',
            fontWeight: 800,
            color: '#0f172a',
            margin: '0 0 1rem',
            letterSpacing: '-0.025em',
            lineHeight: 1.2
          }}>
            Stop Price Leaks. Track WhatsApp Brochures.<br />
            Run Institutional Asset Diligence Deal Rooms.
          </h2>
          <p style={{
            maxWidth: '780px',
            margin: '0 auto',
            color: '#475569',
            fontSize: '1.1rem',
            lineHeight: 1.6
          }}>
            Cross-border real estate and hotel deals run on confidential presentations, private teasers, and high-stakes asset dossiers. DocTransfer gives luxury developers, hotel groups, brokers, and family offices bank-grade control, live view telemetry, and dynamic leak prevention.
          </p>
        </div>

        {/* Interactive Feature Demo Tabs */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08)',
          overflow: 'hidden',
          marginBottom: '4.5rem'
        }}>
          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e2e8f0',
            background: '#f8fafc',
            overflowX: 'auto'
          }}>
            {[
              { id: 'whatsapp', label: '1-Click WhatsApp Tracking', icon: MessageCircle, badge: 'Popular' },
              { id: 'watermark', label: 'Anti-Leak Phone Watermark', icon: ShieldCheck, badge: 'Zero Leaks' },
              { id: 'vdr', label: 'Asset Diligence Deal Room', icon: FolderLock, badge: 'M&A Ready' }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    flex: 1,
                    minWidth: '220px',
                    padding: '1.25rem 1.5rem',
                    border: 'none',
                    borderBottom: isActive ? '3px solid #059669' : '3px solid transparent',
                    background: isActive ? '#ffffff' : 'transparent',
                    color: isActive ? '#065f46' : '#64748b',
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon size={18} color={isActive ? '#059669' : '#94a3b8'} />
                  {tab.label}
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    background: isActive ? '#ecfdf5' : '#e2e8f0',
                    color: isActive ? '#047857' : '#64748b',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '12px'
                  }}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab Content 1: WhatsApp Brochure Tracking */}
          {activeTab === 'whatsapp' && (
            <div style={{ padding: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#059669', letterSpacing: '0.05em' }}>
                  No App Required for International Investors
                </span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem', marginBottom: '1rem', lineHeight: 1.3 }}>
                  Share Luxury Project Brochures on WhatsApp with Instant View Telemetry
                </h3>
                <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  When you send a 60MB PDF on WhatsApp or email, it clogs the investor's device and gives you zero feedback. With DocTransfer, send a lightweight link that opens instantly with high-definition rendering and dynamic access protection.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: '#ecfdf5', padding: '0.35rem', borderRadius: '50%', color: '#059669' }}>
                      <CheckCircle2 size={16} />
                    </div>
                    <span style={{ fontSize: '0.92rem', color: '#334155', fontWeight: 500 }}>
                      <strong>Page Dwell Analytics:</strong> See if they reviewed penthouse floor plans, payment schedules, or ROI projections
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: '#ecfdf5', padding: '0.35rem', borderRadius: '50%', color: '#059669' }}>
                      <CheckCircle2 size={16} />
                    </div>
                    <span style={{ fontSize: '0.92rem', color: '#334155', fontWeight: 500 }}>
                      <strong>Live Read Notifications:</strong> Call or message the investor the moment your presentation is being viewed
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: '#ecfdf5', padding: '0.35rem', borderRadius: '50%', color: '#059669' }}>
                      <CheckCircle2 size={16} />
                    </div>
                    <span style={{ fontSize: '0.92rem', color: '#334155', fontWeight: 500 }}>
                      <strong>Instant File Replacement:</strong> Update pricing or inventory without breaking active shared links
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Mockup: WhatsApp Share Card */}
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.1)'
              }}>
                <div style={{ background: '#25D366', color: 'white', padding: '0.75rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem' }}>
                  <MessageCircle size={20} /> Pre-formatted WhatsApp Message
                </div>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
                  <p style={{ margin: '0 0 0.5rem' }}>
                    👋 <em>"Hi Mr. Sterling, here is the confidential off-plan brochure, master layout & payment milestone plan for <strong>Palm Jumeirah Luxury Residences (Dubai)</strong>:"</em>
                  </p>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Smartphone size={24} color="#059669" />
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>Palm-Jumeirah-Luxury-Residences-Brochure.pdf</div>
                      <div style={{ color: '#059669', fontSize: '0.75rem', fontWeight: 600 }}>doctransfer.com/view/pjr-dxb-882</div>
                    </div>
                  </div>
                </div>

                {/* Real-time Analytics Preview Pill */}
                <div style={{ marginTop: '1rem', background: 'white', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BarChart3 size={18} color="#059669" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0f172a' }}>Investor Active Right Now</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Spent 2m 15s on Page 5 (Penthouse Private Pool Layout)</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                    LIVE 🔥
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 2: Anti-Rate-Leak Watermarking */}
          {activeTab === 'watermark' && (
            <div style={{ padding: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#dc2626', letterSpacing: '0.05em' }}>
                  Protect Pricing Margins & Exclusivity
                </span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem', marginBottom: '1rem', lineHeight: 1.3 }}>
                  Stop Broker Price Leaks with Recipient Mobile & Email Watermarking
                </h3>
                <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Developers and funds lose millions when private inventory sheets, hotel operator forecasts, or off-market discounts get circulated. DocTransfer dynamically stamps the viewer's phone number or email across every sheet.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: '#fee2e2', padding: '0.35rem', borderRadius: '50%', color: '#dc2626' }}>
                      <CheckCircle2 size={16} />
                    </div>
                    <span style={{ fontSize: '0.92rem', color: '#334155', fontWeight: 500 }}>
                      <strong>Recipient Identity Overlay:</strong> Semi-transparent dynamic watermark on every page
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: '#fee2e2', padding: '0.35rem', borderRadius: '50%', color: '#dc2626' }}>
                      <CheckCircle2 size={16} />
                    </div>
                    <span style={{ fontSize: '0.92rem', color: '#334155', fontWeight: 500 }}>
                      <strong>Download & Print Blocking:</strong> Enforce strict view-only mode in web browser
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: '#fee2e2', padding: '0.35rem', borderRadius: '50%', color: '#dc2626' }}>
                      <CheckCircle2 size={16} />
                    </div>
                    <span style={{ fontSize: '0.92rem', color: '#334155', fontWeight: 500 }}>
                      <strong>1-Click Revocation:</strong> Kill link access immediately once exclusivity ends or offer expires
                    </span>
                  </div>
                </div>
              </div>

              {/* Watermark Simulation Box */}
              <div style={{
                position: 'relative',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)',
                overflow: 'hidden'
              }}>
                {/* Diagonal Watermark Layer */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotate(-25deg)',
                  pointerEvents: 'none',
                  zIndex: 2,
                  opacity: 0.22,
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: '#dc2626',
                  textAlign: 'center',
                  lineHeight: 1.4,
                  letterSpacing: '0.05em'
                }}>
                  CONFIDENTIAL • FOR APEX GLOBAL INVESTMENTS<br />
                  (+971 50 123 4567) • 10-OCT-2026
                </div>

                <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>PALM SUITES & VILLAS — INVENTORY & PRICING</span>
                  <span style={{ fontSize: '0.75rem', background: '#fee2e2', color: '#dc2626', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>STRICTLY CONFIDENTIAL</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Unit 2102 (4BHK Sky Villa - 4,850 sq. ft.):</span>
                    <strong style={{ color: '#0f172a' }}>AED 14,850,000 / $4,050,000</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Private Marina Berth & Parking:</span>
                    <strong style={{ color: '#0f172a' }}>Allocated Bay 12 (Included)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Institutional Broker Advisory Fee:</span>
                    <strong style={{ color: '#059669' }}>2.0% on Net Acquisition Value</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem' }}>
                    <span>Limited Launch Incentive:</span>
                    <strong style={{ color: '#dc2626' }}>AED 250,000 Furnishing Credit (Valid 48h)</strong>
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.72rem', background: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '6px', color: '#64748b' }}>🚫 Downloads Disabled</span>
                  <span style={{ fontSize: '0.72rem', background: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '6px', color: '#64748b' }}>🔒 Phone & Email Verified</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 3: Asset Diligence Deal Room */}
          {activeTab === 'vdr' && (
            <div style={{ padding: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#4f46e5', letterSpacing: '0.05em' }}>
                  Modern Alternative to Outdated $10,000 VDRs
                </span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem', marginBottom: '1rem', lineHeight: 1.3 }}>
                  Pre-Structured Real Estate & Resort Acquisition Deal Rooms
                </h3>
                <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Stop sorting hundreds of property and hotel records across chaotic cloud links. Create an encrypted, permission-gated Virtual Data Room with pre-set folders for global property & hospitality acquisitions.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: '#eef2ff', padding: '0.35rem', borderRadius: '50%', color: '#4f46e5' }}>
                      <CheckCircle2 size={16} />
                    </div>
                    <span style={{ fontSize: '0.92rem', color: '#334155', fontWeight: 500 }}>
                      <strong>Pre-built Asset Folders:</strong> Title deeds, environmental audits, permits, and operator agreements
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: '#eef2ff', padding: '0.35rem', borderRadius: '50%', color: '#4f46e5' }}>
                      <CheckCircle2 size={16} />
                    </div>
                    <span style={{ fontSize: '0.92rem', color: '#334155', fontWeight: 500 }}>
                      <strong>Institutional Due Diligence:</strong> Ready for European, GCC (DIFC/ADGM), and Asian legal advisors
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: '#eef2ff', padding: '0.35rem', borderRadius: '50%', color: '#4f46e5' }}>
                      <CheckCircle2 size={16} />
                    </div>
                    <span style={{ fontSize: '0.92rem', color: '#334155', fontWeight: 500 }}>
                      <strong>Immutable Audit Log:</strong> Complete tamper-proof timeline of who accessed which confidential file
                    </span>
                  </div>
                </div>
              </div>

              {/* VDR Folder Explorer Mockup */}
              <div style={{
                background: '#0f172a',
                borderRadius: '16px',
                padding: '1.5rem',
                color: '#f8fafc',
                boxShadow: '0 15px 30px -5px rgba(15, 23, 42, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FolderLock size={18} color="#10b981" />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Project Palm Royal — Acquisition Due Diligence VDR</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', background: '#1e293b', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    AES-256 GCM
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem' }}>
                  {[
                    { folder: '01_Title_Deed_&_Zoning_Dossier', files: '12 files (Freehold Title, Municipality Decrees)', color: '#38bdf8' },
                    { folder: '02_Hotel_Operator_&_Franchise_Agreements', files: '6 files (Operator Term Sheet, PIP, Brand Standards)', color: '#34d399' },
                    { folder: '03_Financial_Audit_&_RevPAR_Models', files: '8 files (5-Yr Historical P&L, STR Reports, CapEx)', color: '#fbbf24' },
                    { folder: '04_Government_Sanctions_&_Permits', files: '7 files (Civil Defense, Environmental Approvals)', color: '#a78bfa' }
                  ].map((f, i) => (
                    <div key={i} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: f.color }}>📁</span>
                        <span style={{ fontWeight: 600 }}>{f.folder}</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{f.files}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                  <Link to="/dataroom" style={{ fontSize: '0.78rem', color: '#34d399', textDecoration: 'none', fontWeight: 600 }}>
                    Create Diligence Room →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4 Stakeholder Persona Cards Grid */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
            Built for Global Dealmakers in Luxury Real Estate, Resorts & Private Equity
          </h3>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            From prime Dubai developers and European hotel groups to Singapore family offices and institutional funds.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3.5rem'
        }}>
          {personas.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} style={{
                background: '#ffffff',
                border: `1px solid ${p.border}`,
                borderRadius: '20px',
                padding: '1.75rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: p.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}>
                    <Icon size={24} color={p.color} />
                  </div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>
                    {p.role}
                  </h4>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: p.color, marginBottom: '1rem' }}>
                    {p.headline}
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {p.points.map((pt, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', fontSize: '0.82rem', color: '#475569', lineHeight: 1.4 }}>
                        <span style={{ color: p.color, fontWeight: 700 }}>•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Free Deal Room Utilities Strip */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem 2rem',
          marginBottom: '2.5rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Sparkles size={16} color="#059669" />
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Free Interactive Deal Room Utilities for Asset Acquirers & Brokers
              </h4>
            </div>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem' }}>
              Calculate Virtual Data Room cost savings, test dynamic PDF watermarking, and audit transaction due diligence readiness.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/tools/vdr-cost-calculator" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #a7f3d0',
              padding: '0.55rem 1.1rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}>
              📊 VDR Cost Calculator →
            </Link>
            <Link to="/tools/pdf-watermarking-tool" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#eff6ff',
              color: '#1e40af',
              border: '1px solid #bfdbfe',
              padding: '0.55rem 1.1rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}>
              🛡️ Test Watermarking Tool →
            </Link>
          </div>
        </div>

        {/* Action Callout Bar */}
        <div style={{
          background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #0d9488 100%)',
          borderRadius: '20px',
          padding: '2rem 2.5rem',
          color: 'white',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          boxShadow: '0 15px 30px -5px rgba(6, 95, 70, 0.25)'
        }}>
          <div>
            <h4 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.25rem' }}>
              Ready to Upgrade Your Real Estate & Hospitality Deal Rooms?
            </h4>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>
              Zero-knowledge client-side encryption, WhatsApp tracked links, and dynamic watermarking included free.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/dataroom">
              <button style={{
                background: 'white',
                color: '#065f46',
                border: 'none',
                padding: '0.75rem 1.4rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}>
                Launch Free Deal Room <ArrowRight size={16} />
              </button>
            </Link>
            <Link to="/pricing">
              <button style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '0.75rem 1.4rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}>
                View Global Plans
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealEstateShowcaseSection;
