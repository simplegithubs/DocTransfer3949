import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from './components/auth';
import Logo from './components/Logo';
import SEO from './components/SEO';
import UseCaseCards from './components/UseCaseCards';
import ComplianceRoadmapSection from './components/landing/ComplianceRoadmapSection';
import CryptographicSecurityHighlight from './components/landing/CryptographicSecurityHighlight';
import RealEstateShowcaseSection from './components/landing/RealEstateShowcaseSection';
import GlobalAgencySettingsSection from './components/landing/GlobalAgencySettingsSection';
import Footer from './components/Footer';
import HeroVideoBackground from './components/landing/HeroVideoBackground';
import {
  Shield,
  FileText,
  Lock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  File,
  Upload,
  Download,
  Share2,
  Mail,
  Droplets,
  FileCheck,
  ScrollText,
  Activity,
  BarChart3,
  Bell,
  Flame,
  Fingerprint,
  PenTool,
  Clock,
  Filter,
  RefreshCw,
  Eye,
  Monitor,
  Type,
  Calendar,
  CheckSquare,
  ArrowLeft,
  ArrowRight,
  Send,
  Globe,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Menu,
  X,
  Sparkles,
  ShieldAlert,
  Power,
  FolderTree,
  Zap,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
const zeroTrustFeatures = [
  {
    name: 'Strict DRM Defense',
    icon: ShieldAlert,
    badge: 'Hot',
    badgeColor: '#ea580c',
    badgeBg: '#fff7ed',
    badgeBorder: '#fed7aa',
    desc: 'Screenshot blanking, DevTools kill & print lockout',
    href: '/dataroom',
    iconColor: '#dc2626',
    iconBg: '#fef2f2'
  },
  {
    name: 'Click-Through NDA Gate',
    icon: ScrollText,
    badge: 'New',
    badgeColor: '#059669',
    badgeBg: '#ecfdf5',
    badgeBorder: '#a7f3d0',
    desc: 'Mandatory legal sign-off before document opens',
    href: '/dataroom',
    iconColor: '#7c3aed',
    iconBg: '#f5f3ff'
  },
  {
    name: 'Active Sessions Kill Switch',
    icon: Power,
    badge: 'Live',
    badgeColor: '#e11d48',
    badgeBg: '#fff1f2',
    badgeBorder: '#fecdd3',
    desc: 'Instantly revoke access & sever active viewers',
    href: '/dataroom',
    iconColor: '#e11d48',
    iconBg: '#fff1f2'
  },
  {
    name: 'Territory Geo-Fencing',
    icon: Globe,
    badge: 'UAE / EU',
    badgeColor: '#4f46e5',
    badgeBg: '#eef2ff',
    badgeBorder: '#c7d2fe',
    desc: 'Restrict access by country & IP subnet',
    href: '/dataroom',
    iconColor: '#2563eb',
    iconBg: '#eff6ff'
  },
  {
    name: 'Dynamic Forensic Watermark',
    icon: Droplets,
    badge: null,
    desc: 'Overlay viewer email, IP & exact UTC timestamp',
    href: '#features',
    iconColor: '#0284c7',
    iconBg: '#f0f9ff'
  },
  {
    name: 'AES-256 Vault Encryption',
    icon: Lock,
    badge: 'Zero-Trust',
    badgeColor: '#475569',
    badgeBg: '#f1f5f9',
    badgeBorder: '#cbd5e1',
    desc: 'Cryptographic client-side document protection',
    href: '#security',
    iconColor: '#4f46e5',
    iconBg: '#eef2ff'
  },
];

const vdrDiligenceFeatures = [
  {
    name: 'VDR Diligence Folders',
    icon: FolderTree,
    badge: 'VDR',
    badgeColor: '#4338ca',
    badgeBg: '#e0e7ff',
    badgeBorder: '#c7d2fe',
    desc: 'Structured multi-stage folders for deals & M&A',
    href: '/dataroom',
    iconColor: '#4f46e5',
    iconBg: '#eef2ff'
  },
  {
    name: '1-Click Sector Presets',
    icon: Zap,
    badge: 'Popular',
    badgeColor: '#059669',
    badgeBg: '#ecfdf5',
    badgeBorder: '#a7f3d0',
    desc: 'Instant setup for Dubai Real Estate & VC',
    href: '/dataroom',
    iconColor: '#059669',
    iconBg: '#ecfdf5'
  },
  {
    name: 'Real-Time WhatsApp Alerts',
    icon: Bell,
    badge: 'Instant',
    badgeColor: '#16a34a',
    badgeBg: '#f0fdf4',
    badgeBorder: '#bbf7d0',
    desc: 'Live buyer telemetry notifications via WhatsApp',
    href: '/dataroom',
    iconColor: '#16a34a',
    iconBg: '#f0fdf4'
  },
  {
    name: 'Page-by-Page Dwell Analytics',
    icon: BarChart3,
    badge: null,
    desc: 'Second-by-second reader attention heatmaps',
    href: '#features',
    iconColor: '#7c3aed',
    iconBg: '#f5f3ff'
  },
  {
    name: 'eIDAS & DIFC Audit Logs',
    icon: FileCheck,
    badge: 'Legal',
    badgeColor: '#2563eb',
    badgeBg: '#eff6ff',
    badgeBorder: '#bfdbfe',
    desc: 'Court-admissible tamper-evident activity trails',
    href: '#features',
    iconColor: '#0891b2',
    iconBg: '#ecfeff'
  },
  {
    name: 'Self-Destruct Timers',
    icon: Flame,
    badge: null,
    desc: 'Auto-wipe confidential files after viewing or expiry',
    href: '#features',
    iconColor: '#ea580c',
    iconBg: '#fff7ed'
  },
];

const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showProductMenu, setShowProductMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<'upload' | 'documents' | 'permissions' | 'analytics' | 'security' | 'google-drive'>('upload');
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Is DocTransfer really free for dealmakers globally?",
      answer: "Yes, absolutely! We've made the strategic decision to unlock all core deal room, virtual data room, and document tracking features for free. No credit card required, zero monthly paywalls, just world-class AES-256 client-side security at $0."
    },
    {
      question: "How does DocTransfer prevent confidential leaks and unauthorized sharing?",
      answer: "DocTransfer incorporates dynamic recipient watermarking (stamping the viewer's verified email, mobile number, and timestamp), phone OTP gates (+971 UAE, +44 UK, +1 US, +65 SG, +33 FR, +91 IN), download & print blocking, and 1-click revocation. If a document leaks, you know the exact source instantly."
    },
    {
      question: "Can I share documents directly over WhatsApp, Email, or Slack with view tracking?",
      answer: "Yes! You can copy your secure DocTransfer link and share it directly on WhatsApp, Email, Slack, LinkedIn, or SMS. You get instant real-time alerts the second someone opens your link and second-by-second analytics on which pages they read."
    },
    {
      question: "How does End-to-End (E2E) Encryption comply with GDPR (EU) & UAE PDPL?",
      answer: "With our Zero-Knowledge 'Vault Mode', files are encrypted directly in your browser using AES-256-GCM before upload. Since only you and your designated recipient hold the decryption keys, not even database administrators can access confidential client financials or personal data, fully complying with EU/UK GDPR, UAE PDPL, DIFC/ADGM data protection laws, and Singapore PDPA."
    },
    {
      question: "How does DocTransfer protect sensitive pitch decks, cap tables, and financial records?",
      answer: "Beyond client-side encryption, you can enable dynamic watermarking displaying the viewer's email/IP and timestamp, require passcode or phone/email verification, set automated link expiry timers, and disable downloading for view-only security."
    },
    {
      question: "What is 'Burn After Reading'?",
      answer: "This feature allows you to set documents to automatically self-destruct after a single view or a specific number of views, ensuring confidential deal memos, salary figures, or trade secrets never linger online."
    },
    {
      question: "Can I customize international transaction templates like NDAs, SAFE Notes, and LOIs?",
      answer: "Yes! Browse our free Template Hub to access standard cross-border deal templates including International Mutual NDAs, YC Post-Money SAFE Notes, Commercial Property Leases, Exclusive Broker Mandates, and Advisory Agreements."
    }
  ];

  return (
    <div className="landing-page">
      <SEO
        title="DocTransfer — Global Virtual Data Room & Document Security | Dubai, Europe & Asia Deal Rooms"
        description="The premier secure deal room for global luxury real estate, hotel acquisitions, startups, and cross-border finance in Dubai, Europe, and Asia. Share pitch decks, CIMs, and contracts with page-by-page analytics and anti-leak watermarking."
        keywords="virtual data room Dubai, VDR Europe, real estate deal room UAE, hotel acquisition due diligence, DocSend alternative, pitch deck tracking, secure document sharing DIFC ADGM, cross-border M&A data room"
      />
      <header className={`header-wrapper ${isScrolled ? 'is-scrolled' : 'is-transparent'}`}>
        <div className="header-container">
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Logo size={32} light={true} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav">
            <div className="nav-links">
              <div
                className="nav-item-dropdown"
                style={{ position: 'relative', display: 'inline-block' }}
                onMouseEnter={() => setShowProductMenu(true)}
                onMouseLeave={() => setShowProductMenu(false)}
              >
                <button className="nav-dropdown-btn">
                  Product <ChevronDown size={14} />
                </button>

                {showProductMenu && (
                  <div
                    className="product-dropdown"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: '-30px',
                      width: '740px',
                      background: '#ffffff',
                      borderRadius: '16px',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                      padding: '1.5rem',
                      zIndex: 1000,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.25rem',
                      border: '1px solid #e2e8f0',
                      animation: 'fadeIn 0.15s ease-out'
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      {/* Column 1: Zero-Trust DRM & Access Control */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                          <h4 style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.06em', margin: 0 }}>
                            Zero-Trust DRM & Access
                          </h4>
                          <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#dc2626', background: '#fef2f2', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid #fecaca' }}>
                            Strict Defense
                          </span>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                          {zeroTrustFeatures.map((feature, i) => (
                            <li key={i}>
                              {feature.href.startsWith('#') ? (
                                <a
                                  href={feature.href}
                                  onClick={() => setShowProductMenu(false)}
                                  style={{
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'start',
                                    gap: '0.65rem',
                                    padding: '0.45rem 0.5rem',
                                    borderRadius: '8px',
                                    transition: 'all 0.15s ease'
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
                                  <div style={{ padding: '0.4rem', background: feature.iconBg, borderRadius: '7px', color: feature.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                                    <feature.icon size={15} />
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                      <span style={{ fontWeight: '600', fontSize: '0.85rem', color: '#1e293b' }}>{feature.name}</span>
                                      {feature.badge && (
                                        <span style={{ fontSize: '0.6rem', fontWeight: '700', padding: '0.06rem 0.35rem', borderRadius: '4px', background: feature.badgeBg, color: feature.badgeColor, border: `1px solid ${feature.badgeBorder}` }}>
                                          {feature.badge}
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ fontSize: '0.74rem', color: '#64748b', lineHeight: 1.3, marginTop: '0.1rem' }}>{feature.desc}</div>
                                  </div>
                                </a>
                              ) : (
                                <Link
                                  to={feature.href}
                                  onClick={() => setShowProductMenu(false)}
                                  style={{
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'start',
                                    gap: '0.65rem',
                                    padding: '0.45rem 0.5rem',
                                    borderRadius: '8px',
                                    transition: 'all 0.15s ease'
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
                                  <div style={{ padding: '0.4rem', background: feature.iconBg, borderRadius: '7px', color: feature.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                                    <feature.icon size={15} />
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                      <span style={{ fontWeight: '600', fontSize: '0.85rem', color: '#1e293b' }}>{feature.name}</span>
                                      {feature.badge && (
                                        <span style={{ fontSize: '0.6rem', fontWeight: '700', padding: '0.06rem 0.35rem', borderRadius: '4px', background: feature.badgeBg, color: feature.badgeColor, border: `1px solid ${feature.badgeBorder}` }}>
                                          {feature.badge}
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ fontSize: '0.74rem', color: '#64748b', lineHeight: 1.3, marginTop: '0.1rem' }}>{feature.desc}</div>
                                  </div>
                                </Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Column 2: Data Room & Due Diligence */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                          <h4 style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.06em', margin: 0 }}>
                            Data Room & Due Diligence
                          </h4>
                          <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#4f46e5', background: '#eef2ff', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid #c7d2fe' }}>
                            Deal Ready
                          </span>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                          {vdrDiligenceFeatures.map((feature, i) => (
                            <li key={i}>
                              {feature.href.startsWith('#') ? (
                                <a
                                  href={feature.href}
                                  onClick={() => setShowProductMenu(false)}
                                  style={{
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'start',
                                    gap: '0.65rem',
                                    padding: '0.45rem 0.5rem',
                                    borderRadius: '8px',
                                    transition: 'all 0.15s ease'
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
                                  <div style={{ padding: '0.4rem', background: feature.iconBg, borderRadius: '7px', color: feature.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                                    <feature.icon size={15} />
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                      <span style={{ fontWeight: '600', fontSize: '0.85rem', color: '#1e293b' }}>{feature.name}</span>
                                      {feature.badge && (
                                        <span style={{ fontSize: '0.6rem', fontWeight: '700', padding: '0.06rem 0.35rem', borderRadius: '4px', background: feature.badgeBg, color: feature.badgeColor, border: `1px solid ${feature.badgeBorder}` }}>
                                          {feature.badge}
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ fontSize: '0.74rem', color: '#64748b', lineHeight: 1.3, marginTop: '0.1rem' }}>{feature.desc}</div>
                                  </div>
                                </a>
                              ) : (
                                <Link
                                  to={feature.href}
                                  onClick={() => setShowProductMenu(false)}
                                  style={{
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'start',
                                    gap: '0.65rem',
                                    padding: '0.45rem 0.5rem',
                                    borderRadius: '8px',
                                    transition: 'all 0.15s ease'
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
                                  <div style={{ padding: '0.4rem', background: feature.iconBg, borderRadius: '7px', color: feature.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                                    <feature.icon size={15} />
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                      <span style={{ fontWeight: '600', fontSize: '0.85rem', color: '#1e293b' }}>{feature.name}</span>
                                      {feature.badge && (
                                        <span style={{ fontSize: '0.6rem', fontWeight: '700', padding: '0.06rem 0.35rem', borderRadius: '4px', background: feature.badgeBg, color: feature.badgeColor, border: `1px solid ${feature.badgeBorder}` }}>
                                          {feature.badge}
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ fontSize: '0.74rem', color: '#64748b', lineHeight: 1.3, marginTop: '0.1rem' }}>{feature.desc}</div>
                                  </div>
                                </Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Full-Width Strip: White-Label Agency & Diligence */}
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                        borderRadius: '10px',
                        padding: '0.9rem 1.15rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        color: '#ffffff'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                        <div style={{ padding: '0.45rem', background: 'rgba(99, 102, 241, 0.25)', borderRadius: '7px', color: '#a5b4fc', border: '1px solid rgba(129, 140, 248, 0.3)', flexShrink: 0 }}>
                          <Building2 size={18} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <span>White-Label & Global Agency Suite</span>
                            <span style={{ fontSize: '0.62rem', fontWeight: '700', background: 'rgba(16, 185, 129, 0.25)', color: '#34d399', padding: '0.08rem 0.4rem', borderRadius: '4px', border: '1px solid rgba(52, 211, 153, 0.4)' }}>
                              DLD / RERA / VAT Ready
                            </span>
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            Custom CNAME vanity domains, broker stamps, and global multi-currency B2B tax invoicing.
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
                        <Link
                          to="/settings"
                          onClick={() => setShowProductMenu(false)}
                          style={{
                            textDecoration: 'none',
                            fontSize: '0.76rem',
                            fontWeight: '600',
                            padding: '0.4rem 0.75rem',
                            borderRadius: '6px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          <span>Agency Settings</span>
                          <ArrowRight size={12} />
                        </Link>
                        <Link
                          to="/dataroom"
                          onClick={() => setShowProductMenu(false)}
                          style={{
                            textDecoration: 'none',
                            fontSize: '0.76rem',
                            fontWeight: '600',
                            padding: '0.4rem 0.75rem',
                            borderRadius: '6px',
                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                            color: '#ffffff',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.4)'
                          }}
                        >
                          <Sparkles size={12} />
                          <span>Open VDR</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/solutions" className="nav-link">Solutions</Link>
              <Link to="/templates" className="nav-link">Templates</Link>
              <Link to="/tools" className="nav-link">
                Tools
                <span className="nav-badge">New</span>
              </Link>
              <Link to="/pricing" className="nav-link">Pricing</Link>
              <Link to="/comparisons" className="nav-link">Comparisons</Link>
              <Link to="/blog" className="nav-link">Blog</Link>
            </div>
          </nav>

          {/* Action Buttons */}
          <div className="header-actions">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn-signin-ghost">
                  Sign In
                </button>
              </SignInButton>
              <Link to="/dataroom" style={{ textDecoration: 'none' }}>
                <button className="btn-header-cta">
                  <span>Get Started Free</span>
                  <ArrowRight size={14} />
                </button>
              </Link>
            </SignedOut>

            <SignedIn>
              <Link to="/dataroom" style={{ textDecoration: 'none' }}>
                <button className="btn-header-dashboard">
                  <Sparkles size={15} />
                  <span>Dashboard</span>
                </button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            {/* Mobile Menu Toggle Button */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-menu">
            <Link to="/dataroom" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={16} color="#ef4444" />
                <span>Virtual Data Room & Strict DRM</span>
                <span className="nav-badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.4)' }}>VDR</span>
              </span>
              <ArrowRight size={14} color="#94a3b8" />
            </Link>
            <Link to="/settings" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={16} color="#818cf8" />
                <span>White-Label & Agency Settings</span>
                <span className="nav-badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', borderColor: 'rgba(99, 102, 241, 0.4)' }}>Broker</span>
              </span>
              <ArrowRight size={14} color="#94a3b8" />
            </Link>
            <Link to="/solutions" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              <span>Solutions (Real Estate, M&A, VC)</span>
              <ArrowRight size={14} color="#94a3b8" />
            </Link>
            <Link to="/templates" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              <span>Document Templates Hub</span>
              <ArrowRight size={14} color="#94a3b8" />
            </Link>
            <Link to="/tools" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Interactive Tools & Calculators
                <span className="nav-badge">New</span>
              </span>
              <ArrowRight size={14} color="#94a3b8" />
            </Link>
            <Link to="/pricing" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              <span>Pricing & Plans (USD, EUR, AED)</span>
              <ArrowRight size={14} color="#94a3b8" />
            </Link>
            <Link to="/comparisons" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              <span>Competitor Comparisons</span>
              <ArrowRight size={14} color="#94a3b8" />
            </Link>
            <Link to="/blog" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              <span>Blog & Guides</span>
              <ArrowRight size={14} color="#94a3b8" />
            </Link>

            <div className="mobile-nav-actions">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="btn-signin-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                    Sign In
                  </button>
                </SignInButton>
                <Link to="/dataroom" style={{ textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
                  <button className="btn-header-cta" style={{ width: '100%', justifyContent: 'center', padding: '0.7rem' }}>
                    <span>Get Started Free</span>
                    <ArrowRight size={15} />
                  </button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link to="/dataroom" style={{ textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
                  <button className="btn-header-dashboard" style={{ width: '100%', justifyContent: 'center', padding: '0.7rem' }}>
                    <Sparkles size={16} />
                    <span>Go to Dashboard</span>
                  </button>
                </Link>
              </SignedIn>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero">
          {/* Papermark-style Background Video Carousel */}
          <HeroVideoBackground activeFeature={activeFeature} />

          <div className="hero-container">
            <div className="hero-content-left">
              <div className="hero-eyebrow-left">
                <span>ISO 27001 certified</span>
                <span className="dot">·</span>
                <span>SOC 2 Type II</span>
                <span className="dot">·</span>
                <span>GDPR (EU) · UAE PDPL</span>
              </div>

              <h1 className="hero-title-left">
                The secure deal room for sharing, tracking & protecting confidential documents worldwide.
              </h1>

              <div className="hero-actions-left">
                <Link to="/dataroom" style={{ textDecoration: 'none' }}>
                  <button className="hero-btn-papermark">
                    <span>Create a Deal Room — Free ($0 / No Card Required)</span>
                    <ArrowRight size={16} />
                  </button>
                </Link>
                <Link to="/pricing" style={{ textDecoration: 'none' }}>
                  <button className="hero-btn-secondary-papermark">
                    <span>View Pricing</span>
                  </button>
                </Link>
              </div>

              <p className="hero-note-left">
                No credit card or expensive monthly subscription required.
              </p>
            </div>
          </div>
        </section>

        {/* Hero Feature Showcase Section (Clean White Background) */}
        <section className="hero-showcase-section">
          {/* Hero Feature Navigation Bar */}
          <div className="hero-feature-nav">
            <button
              className={`nav-item ${activeFeature === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveFeature('upload')}
            >
              <Upload size={18} /> Upload documents
            </button>
            <button
              className={`nav-item ${activeFeature === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveFeature('documents')}
            >
              <FileText size={18} /> Documents
            </button>
            <button
              className={`nav-item ${activeFeature === 'permissions' ? 'active' : ''}`}
              onClick={() => setActiveFeature('permissions')}
            >
              <Shield size={18} /> Audit Trail
            </button>
            <button
              className={`nav-item ${activeFeature === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveFeature('analytics')}
            >
              <BarChart3 size={18} /> Track visitor analytics
            </button>
            <button
              className={`nav-item ${activeFeature === 'security' ? 'active' : ''}`}
              onClick={() => setActiveFeature('security')}
            >
              <Lock size={18} /> Anti-Leak & DRM
            </button>
          </div>


          {/* Hero Feature Showcase Content */}
          <div className="hero-showcase-content" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            {activeFeature === 'upload' && (
              <div className="dashboard-ui-mockup" style={{
                width: '100%',
                maxWidth: '900px',
                borderRadius: '24px',
                backgroundColor: '#ffffff',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                margin: '0 auto 6rem',
                position: 'relative',
                zIndex: 10,
                overflow: 'hidden',
                border: '1px solid #f3f4f6'
              }}>
                <img
                  src="/dealroom-dashboard.jpg"
                  alt="DocTransfer Deal Room Dashboard"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '24px'
                  }}
                />
              </div>
            )}

            {activeFeature === 'google-drive' && (
              <div className="dashboard-ui-mockup" style={{
                width: '100%',
                maxWidth: '900px',
                borderRadius: '24px',
                backgroundColor: '#ffffff',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                margin: '0 auto 6rem',
                position: 'relative',
                zIndex: 10,
                overflow: 'hidden',
                border: '1px solid #f3f4f6',
                padding: '2rem'
              }}>
                <div style={{
                  width: '100%',
                  height: '400px',
                  border: '2px dashed #4285f4',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f8faff',
                  cursor: 'pointer'
                }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '2rem',
                    boxShadow: '0 4px 12px rgba(66, 133, 244, 0.2)'
                  }}>
                    <Globe size={56} color="#4285f4" strokeWidth={1.5} />
                  </div>
                  <h3 style={{
                    fontSize: '1.6rem',
                    fontWeight: 600,
                    color: '#1e3a5f',
                    marginBottom: '1rem',
                    fontFamily: "'Inter', sans-serif"
                  }}>
                    Import from Google Drive
                  </h3>
                  <p style={{
                    fontSize: '1.2rem',
                    color: '#64748b',
                    marginBottom: '0.8rem',
                    fontWeight: 400
                  }}>
                    Connect your Drive account and share files directly
                  </p>
                  <p style={{
                    fontSize: '1.2rem',
                    color: '#94a3b8',
                    fontWeight: 400
                  }}>
                    Upto 2TB file Transfer using Google Drive links
                  </p>
                </div>
              </div>
            )}

            {activeFeature === 'documents' && (
              <div className="dashboard-ui-mockup" style={{
                width: '100%',
                maxWidth: '900px',
                borderRadius: '20px',
                backgroundColor: '#ffffff',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05), 0 0 0 10px rgba(255,255,255,0.5)',
                margin: '0 auto 6rem',
                position: 'relative',
                zIndex: 10,
                overflow: 'hidden',
                border: '1px solid #f3f4f6'
              }}>
                {/* Header/Banner Section */}
                <div style={{
                  background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
                  padding: '2.5rem',
                  borderBottom: '1px solid #e5e7eb',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '200px'
                }}>
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <div style={{ padding: '0.35rem', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                      </div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4f46e5', margin: 0, fontStyle: 'italic' }}>
                        DocTransfer Dashboard
                      </h2>
                    </div>
                    <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem', marginLeft: '2.5rem' }}>Welcome back! Here's what's happening.</p>
                  </div>

                  {/* Abstract Security Icon Center */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    border: '1px dashed rgba(99, 102, 241, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '140px',
                      height: '140px',
                      borderRadius: '50%',
                      border: '1px solid rgba(99, 102, 241, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.5)'
                      }}>
                        <Lock size={36} color="white" />
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div style={{ position: 'absolute', top: '20%', left: '20%', background: 'white', padding: '0.75rem', borderRadius: '50%', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <FileText size={20} color="#4f46e5" />
                  </div>
                  <div style={{ position: 'absolute', bottom: '20%', left: '30%', background: 'white', padding: '0.5rem', borderRadius: '50%', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <Shield size={16} color="#10b981" />
                  </div>
                  <div style={{ position: 'absolute', top: '30%', right: '25%', background: 'white', padding: '0.6rem', borderRadius: '50%', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <Activity size={18} color="#3b82f6" />
                  </div>
                  <div style={{ position: 'absolute', bottom: '25%', right: '35%', background: 'white', padding: '0.4rem', borderRadius: '50%', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <CheckCircle size={14} color="#f43f5e" />
                  </div>
                </div>

                {/* Sub-navigation bar */}
                <div style={{ padding: '0.75rem 2rem', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', display: 'flex', gap: '0.75rem', overflowX: 'auto' }}>
                  <button onClick={() => setActiveFeature('upload')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: 'none', background: 'transparent', color: '#6b7280', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                    <Upload size={15} /> Upload
                  </button>
                  <button onClick={() => setActiveFeature('google-drive')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: 'none', background: 'transparent', color: '#6b7280', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg> Google Drive
                  </button>
                  <button onClick={() => setActiveFeature('documents')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: 'none', background: '#8b5cf6', color: 'white', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                    <FileText size={15} /> Documents
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: 'none', background: 'transparent', color: '#6b7280', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                    <BarChart3 size={15} /> Analytics <Lock size={11} opacity={0.5} />
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: 'none', background: 'transparent', color: '#6b7280', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                    <Shield size={15} /> Audit Trail
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: 'none', background: 'transparent', color: '#6b7280', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                    <PenTool size={15} /> E-Signature
                  </button>
                </div>

                {/* Main Content Area */}
                <div style={{ padding: '1.5rem 2rem', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>My Documents</h3>
                    <input type="text" placeholder="Search documents..." readOnly style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '0.82rem', width: '200px', background: '#fff' }} />
                  </div>

                  {/* Documents Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {[
                      { name: 'screencapture-doctr...', size: '970.82 KB', date: '1/29/2026' },
                      { name: 'screencapture-doctr...', size: '970.82 KB', date: '1/29/2026' },
                      { name: 'signed-document (...', size: '8522.10 KB', date: '1/16/2026' },
                      { name: 'Screenshot 2023-09...', size: '902.80 KB', date: '1/3/2026' },
                      { name: 'screencapture-local...', size: '727.36 KB', date: '12/28/2025' },
                      { name: 'G5FREV4WkAAInHT...', size: '250.92 KB', date: '12/26/2025' },
                      { name: 'screencapture-local...', size: '727.36 KB', date: '12/26/2025' },
                      { name: 'test-file.txt', size: '0.05 KB', date: '12/22/2025' },
                      { name: 'screencapture-local...', size: '727.36 KB', date: '12/16/2025' }
                    ].map((doc, i) => (
                      <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem', backgroundColor: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '1rem' }}>
                          <div style={{ padding: '0.4rem', background: '#eff6ff', borderRadius: '8px', color: '#4f46e5', flexShrink: 0 }}>
                            <FileText size={15} />
                          </div>
                          <div style={{ flex: 1, overflow: 'hidden' }}>
                            <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</h4>
                            <p style={{ margin: 0, fontSize: '0.68rem', color: '#9ca3af', marginTop: '0.15rem' }}>{doc.size} • {doc.date}</p>
                          </div>
                          <div style={{ color: '#d1d5db', cursor: 'pointer', flexShrink: 0 }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button style={{ flex: 1, padding: '0.35rem', border: '1px solid #f3f4f6', background: '#ffffff', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600, color: '#4b5563', cursor: 'pointer' }}>View</button>
                          <button style={{ flex: 1, padding: '0.35rem', border: '1px solid #dcfce7', background: '#f0fdf4', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600, color: '#166534', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                            <BarChart3 size={11} /> Analytics
                          </button>
                          <button style={{ padding: '0.35rem 0.5rem', border: '1px solid #e0e7ff', background: '#f5f3ff', borderRadius: '6px', color: '#4f46e5', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Shield size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeFeature === 'analytics' && (
              <div className="dashboard-ui-mockup" style={{
                width: '100%',
                maxWidth: '1000px',
                borderRadius: '24px',
                backgroundColor: '#f8fafc',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                margin: '0 auto 6rem',
                position: 'relative',
                zIndex: 10,
                overflow: 'hidden',
                border: '1px solid #f1f5f9',
                fontFamily: "'Inter', sans-serif"
              }}>
                {/* Dashboard Header */}
                <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>Unified Analytics</h2>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4', color: '#16a34a', padding: '0.2rem 0.6rem', borderRadius: '16px', fontSize: '0.7rem', fontWeight: 600 }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }}></div> LIVE
                        </span>
                      </div>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem', marginTop: '0.25rem' }}>Last updated: 2:33:43 PM</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 500, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.3)' }}>
                      <Activity size={16} /> Live Mode
                    </button>
                    <select disabled style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', color: '#4b5563', fontSize: '0.9rem', appearance: 'none', paddingRight: '2rem', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}>
                      <option>Last 30 Days</option>
                    </select>
                    <button style={{ border: 'none', background: '#8b5cf6', color: 'white', padding: '0.6rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.3)' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    </button>
                  </div>
                </div>

                {/* Main Content Area */}
                <div style={{ padding: '2rem' }}>
                  {/* Stats Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    {[
                      { label: 'Total Views', value: '4', change: '+ 12%', color: '#8b5cf6', icon: Activity },
                      { label: 'Unique Viewers', value: '4', change: '+ 5%', color: '#10b981', icon: Fingerprint },
                      { label: 'Avg. Time', value: '10s', change: '↓ 2%', color: '#f59e0b', icon: Clock },
                      { label: 'Engagement', value: '2%', change: 'Scroll & time based', color: '#8b5cf6', icon: BarChart3 },
                    ].map((stat, i) => (
                      <div key={i} style={{ backgroundColor: stat.color, padding: '1.5rem', borderRadius: '16px', color: 'white', boxShadow: `0 10px 15px -3px ${stat.color}40` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.9, marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 500 }}>
                          <stat.icon size={16} /> {stat.label}
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{stat.value}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{stat.change}</div>
                      </div>
                    ))}
                  </div>

                  {/* Filter Toggles */}
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {[
                      { label: 'All Metrics', icon: BarChart3, active: true },
                      { label: 'Views', icon: Activity },
                      { label: 'Devices', icon: Monitor },
                      { label: 'Pages', icon: FileText },
                      { label: 'Locations', icon: Droplets },
                      { label: 'By Hour', icon: Clock },
                      { label: 'Status', icon: CheckCircle },
                    ].map((btn, i) => (
                      <button key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 1.25rem',
                        borderRadius: '24px',
                        border: 'none',
                        backgroundColor: btn.active ? '#6366f1' : '#ffffff',
                        color: btn.active ? 'white' : '#64748b',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        boxShadow: btn.active ? '0 4px 6px -1px rgba(99, 102, 241, 0.4)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)'
                      }}>
                        <btn.icon size={14} /> {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Chart Container */}
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '2.5rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>Complete Analytics Overview</h3>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.85rem' }}>Real-time data visualization</p>
                      </div>
                      <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#4b5563' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#8b5cf6' }}></div> Views
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#4b5563' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></div> Devices
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#4b5563' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div> Locations
                        </div>
                      </div>
                    </div>

                    {/* Stylized Bar Chart */}
                    <div style={{ height: '320px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', paddingBottom: '2.5rem', position: 'relative' }}>
                      {/* Grid Lines */}
                      {[0, 25, 50, 75, 100].map((line, index) => (
                        <div key={line} style={{ position: 'absolute', bottom: `calc(${line}% + 2.5rem)`, left: 0, right: 0, height: '1px', borderBottom: '1px dashed #e5e7eb', zIndex: 0, display: 'flex', alignItems: 'center' }}>
                          <span style={{ position: 'absolute', left: '-2rem', color: '#9ca3af', fontSize: '0.75rem', transform: 'translateY(50%)' }}>{index * 6}</span>
                        </div>
                      ))}

                      {[
                        { label: 'Feb 14', val: 12, col: '#8b5cf6' },
                        { label: 'Desktop', val: 24, col: '#10b981' },
                        { label: 'Page 1', val: 82, col: '#8b5cf6' },
                        { label: '00:00', val: 0, col: '#8b5cf6' },
                        { label: '06:00', val: 0, col: '#8b5cf6' },
                        { label: '12:00', val: 6, col: '#3b82f6' },
                        { label: '18:00', val: 6, col: '#3b82f6' },
                        { label: '21:00', val: 0, col: '#3b82f6' },
                        { label: 'Completed', val: 6, col: '#14b8a6' },
                        { label: 'Pending', val: 6, col: '#14b8a6' },
                        { label: 'Dropped', val: 42, col: '#14b8a6' },
                      ].map((bar, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', zIndex: 1, height: '100%', position: 'relative' }}>
                          {bar.val > 0 && (
                            <div style={{
                              width: '32px',
                              height: `${bar.val}%`,
                              backgroundColor: bar.col,
                              borderRadius: '6px',
                              transition: 'height 1s ease-out'
                            }}></div>
                          )}
                          <span style={{ fontSize: '0.7rem', color: '#6b7280', transform: 'rotate(-45deg)', transformOrigin: 'top left', position: 'absolute', bottom: '-40px', left: '50%', whiteSpace: 'nowrap' }}>{bar.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Summary Footer */}
                    <div style={{ marginTop: '3.5rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                      {[
                        { label: 'Views Over Time', color: '#8b5cf6' },
                        { label: 'Device Distribution', color: '#10b981' },
                        { label: 'Page Attention', color: '#a855f7' },
                        { label: 'Top Locations', color: '#f59e0b' },
                        { label: 'Views by Hour', color: '#3b82f6' },
                        { label: 'Completion Status', color: '#14b8a6' },
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#4b5563', fontWeight: 500 }}>
                          <div style={{ width: '16px', height: '12px', borderRadius: '3px', backgroundColor: item.color }}></div> {item.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Floating Notification */}
                  <div style={{
                    marginTop: '2rem',
                    width: '140px',
                    backgroundColor: '#ffffff',
                    padding: '0.75rem',
                    borderRadius: '16px',
                    border: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    position: 'absolute',
                    bottom: '-2rem',
                    left: '-2rem'
                  }}>
                    <div style={{ width: '30px', height: '40px', borderRadius: '4px', border: '1px solid #8b5cf6', backgroundColor: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
                      <Monitor size={14} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', lineHeight: '1.2' }}>5</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Desktop</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFeature === 'permissions' && (
              <div className="dashboard-ui-mockup" style={{
                width: '100%',
                maxWidth: '960px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                margin: '0 auto 6rem',
                position: 'relative',
                zIndex: 10,
                border: '1px solid #f3f4f6',
                fontFamily: "'Inter', sans-serif"
              }}>
                {/* Header */}
                <div style={{ padding: '1.5rem 2rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <Shield size={22} color="#6366f1" strokeWidth={2.5} />
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: 0 }}>Audit Trail</h2>
                    </div>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>Comprehensive, compliance-ready activity log.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px', background: 'transparent', color: '#4b5563', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}>
                      <Filter size={14} /> Filters
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px', background: 'transparent', color: '#4b5563', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}>
                      <Download size={14} /> Export CSV
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.4rem 0.5rem', border: '1px solid #e5e7eb', borderRadius: '6px', background: 'transparent', color: '#4b5563', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <RefreshCw size={14} />
                    </button>
                  </div>
                </div>

                {/* Table Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, 1fr) minmax(180px, 1.5fr) minmax(150px, 1.5fr) minmax(150px, 1.5fr) minmax(280px, 2.5fr)', padding: '0.75rem 2rem', borderBottom: '1px solid #f3f4f6', borderTop: '1px solid #f3f4f6', fontSize: '0.7rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: '#fafafa' }}>
                  <div>TIMESTAMP (UTC)</div>
                  <div>EVENT</div>
                  <div>USER & DEVICE</div>
                  <div>LOCATION (IP)</div>
                  <div>DOCUMENT / DETAILS</div>
                </div>

                {/* Table Body */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {[
                    {
                      date: 'Feb 16',
                      year: '2026',
                      eventIcon: Download,
                      eventColor: '#10b981',
                      eventBg: '#d1fae5',
                      eventBorder: '#a7f3d0',
                      eventText: 'Document Downloaded',
                      user: 'Investor Partner (US)',
                      device: 'Chrome on MacOS',
                      location: 'San Francisco, US',
                      ip: '104.28.19.42',
                      doc: 'Series-A-PitchDeck-Final.pdf',
                      details: null
                    },
                    {
                      date: 'Feb 16',
                      year: '2026',
                      eventIcon: Eye,
                      eventColor: '#3b82f6',
                      eventBg: '#dbeafe',
                      eventBorder: '#bfdbfe',
                      eventText: 'Document Viewed',
                      user: 'General Partner (UK)',
                      device: 'Safari on iPad',
                      location: 'London, UK',
                      ip: '185.125.190.24',
                      doc: 'M&A-Due-Diligence-Memo.pdf',
                      details: 'viewer_agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...'
                    },
                    {
                      date: 'Feb 16',
                      year: '2026',
                      eventIcon: Eye,
                      eventColor: '#3b82f6',
                      eventBg: '#dbeafe',
                      eventBorder: '#bfdbfe',
                      eventText: 'Document Viewed',
                      user: 'Managing Director, DIFC Fund',
                      device: 'Chrome on Windows',
                      location: 'Dubai, UAE',
                      ip: '185.107.56.12',
                      doc: 'CapTable-Valuation-Q1.pdf',
                      details: 'viewer_agent: Mozilla/5.0 (Windows NT 10.0; Win64)...'
                    },
                    {
                      date: 'Feb 16',
                      year: '2026',
                      eventIcon: FileText,
                      eventColor: '#a855f7',
                      eventBg: '#f3e8ff',
                      eventBorder: '#e9d5ff',
                      eventText: 'Document Uploaded',
                      user: 'Deal Room Admin',
                      device: 'Chrome on MacOS',
                      location: 'Singapore',
                      ip: '165.225.112.90',
                      doc: 'Cross-Border-NDA-Executed.pdf',
                      details: 'bundleId: vdr_global_09, fileName: Cross-Border-NDA...'
                    }
                  ].map((row, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, 1fr) minmax(180px, 1.5fr) minmax(150px, 1.5fr) minmax(150px, 1.5fr) minmax(280px, 2.5fr)', padding: '1.25rem 2rem', borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none', alignItems: 'start' }}>
                      <div style={{ color: '#374151', fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: 500, color: '#4b5563' }}>{row.date}</div>
                        <div style={{ color: '#9ca3af', marginTop: '0.1rem' }}>{row.year}</div>
                      </div>

                      <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.6rem', borderRadius: '20px', border: `1px solid ${row.eventBorder}`, backgroundColor: row.eventBg, color: row.eventColor, fontSize: '0.75rem', fontWeight: 600 }}>
                          <row.eventIcon size={12} strokeWidth={2.5} />
                          {row.eventText}
                        </div>
                      </div>

                      <div style={{ fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: 600, color: '#374151' }}>{row.user}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#6b7280', marginTop: '0.3rem', fontSize: '0.8rem' }}>
                          <Monitor size={12} /> {row.device}
                        </div>
                      </div>

                      <div style={{ fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: 500, color: '#374151' }}>{row.location}</div>
                        <div style={{ color: '#9ca3af', marginTop: '0.3rem', fontSize: '0.8rem' }}>{row.ip}</div>
                      </div>

                      <div style={{ fontSize: '0.85rem', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500, color: '#4f46e5', marginBottom: row.details ? '0.5rem' : '0' }}>
                          <FileText size={14} />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.doc}</span>
                        </div>
                        {row.details && (
                          <div style={{ backgroundColor: '#f9fafb', padding: '0.3rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: '#6b7280', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', border: '1px solid #f3f4f6' }}>
                            {row.details}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div style={{ padding: '1rem 2rem', borderTop: '1px solid #f3f4f6', backgroundColor: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>Showing 4 events</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontSize: '0.8rem', fontWeight: 600, backgroundColor: '#d1fae5', padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #a7f3d0' }}>
                    <Shield size={14} /> HIPAA / NIST Compliant Log
                  </div>
                </div>
              </div>
            )}

            {activeFeature === 'security' && (
              <div className="dashboard-ui-mockup" style={{
                width: '100%',
                maxWidth: '960px',
                borderRadius: '16px',
                backgroundColor: '#0f172a',
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.25)',
                margin: '0 auto 6rem',
                position: 'relative',
                zIndex: 10,
                padding: '1.5rem',
                fontFamily: "'Inter', sans-serif",
                color: '#f8fafc'
              }}>
                {/* Header Navbar */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b',
                  padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid #334155'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                      Active DRM Vault: Confidential_Acquisition_Teaser_Q4.pdf
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.25rem 0.65rem', borderRadius: '6px', fontWeight: 700 }}>
                      AES-256 GCM ZERO-KNOWLEDGE
                    </span>
                  </div>
                </div>

                {/* Main Content Area: Document View + Live Controls */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: '1.5rem', marginTop: '1.5rem', minHeight: '480px' }}>
                  {/* Left: Watermarked Document View */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '2rem',
                    position: 'relative',
                    overflow: 'hidden',
                    color: '#1e293b',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    {/* Dynamic Diagonal Watermark */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: 'rotate(-25deg)',
                      pointerEvents: 'none',
                      zIndex: 10,
                      opacity: 0.18,
                      fontSize: '1rem',
                      fontWeight: 900,
                      color: '#dc2626',
                      textAlign: 'center',
                      lineHeight: 1.5,
                      letterSpacing: '0.04em'
                    }}>
                      CONFIDENTIAL • VIEWED BY alex.v@apexcap.ae<br />
                      (+971 50 123 4567) • IP: 185.107.56.12 • 14:32:09 UTC
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                        <div>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.05em' }}>RESTRICTED ACCESS MEMO</span>
                          <h4 style={{ margin: '0.2rem 0 0', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                            PROJECT AZURE: $120M LUXURY RESORT ACQUISITION
                          </h4>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>PAGE 3 OF 18</span>
                      </div>

                      <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <p style={{ margin: 0 }}>
                          <strong>Target Asset:</strong> 180-Key Freehold Beachfront Resort & Branded Residences (Dubai / Southeast Asia). Historical ADR: $485 with 78% trailing 12-month occupancy.
                        </p>
                        <p style={{ margin: 0 }}>
                          <strong>Current CapEx & Debt Structure:</strong> Unencumbered senior debt facility. Projected Year 3 stabilized NOI: $14.2M representing an 11.8% unlevered IRR.
                        </p>
                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>CONFIDENTIAL BID SUBMISSION DEADLINE:</div>
                          <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>Strict LOI Window Closes: Friday, 17:00 Gulf Standard Time</div>
                        </div>
                      </div>
                    </div>

                    {/* Watermark Security Strip */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', marginTop: '1rem', fontSize: '0.72rem', color: '#64748b' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#dc2626', fontWeight: 600 }}>
                        <Lock size={12} /> Downloads Disabled
                      </span>
                      <span>Screenshots Monitored</span>
                      <span style={{ color: '#059669', fontWeight: 600 }}>Zero-Leak DRM Enforced</span>
                    </div>
                  </div>

                  {/* Right: Security Control Console */}
                  <div style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    border: '1px solid #334155',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                        <Shield size={18} color="#10b981" />
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                          Real-Time Access Controls
                        </h4>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {[
                          { title: 'Dynamic Viewer Watermark', status: 'ACTIVE', desc: 'Overlays viewer phone, email & IP on every page', color: '#10b981' },
                          { title: 'International Mobile Gate', status: '+971 UAE', desc: 'OTP verification required before viewing', color: '#38bdf8' },
                          { title: 'View-Only DRM Mode', status: 'ENFORCED', desc: 'Downloads, printing & clipboard blocked', color: '#fbbf24' },
                          { title: 'Burn-After-Reading Timer', status: '24H AUTO-REVOKE', desc: 'File automatically self-destructs', color: '#f43f5e' }
                        ].map((ctrl, i) => (
                          <div key={i} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0' }}>{ctrl.title}</span>
                              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: ctrl.color, background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>{ctrl.status}</span>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{ctrl.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>1-Click Emergency Kill Switch:</span>
                      <button style={{
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        padding: '0.45rem 0.9rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}>
                        Revoke Access Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>


          <div className="transfer-animation-container">
            <div className="transfer-scene">
              {/* Sender Side */}
              <div className="transfer-node sender-node">
                <div className="node-avatar">
                  <Upload size={32} />
                </div>
                <div className="node-label">Sender</div>
                <div className="node-status">Uploading...</div>
              </div>

              {/* Transfer Path with Animated Documents */}
              <div className="transfer-path">
                <div className="transfer-line">
                  <div className="transfer-pulse"></div>
                </div>

                {/* Animated Flying Documents */}
                <div className="flying-doc doc-1">
                  <FileText size={24} />
                </div>
                <div className="flying-doc doc-2">
                  <File size={22} />
                </div>
                <div className="flying-doc doc-3">
                  <FileCheck size={20} />
                </div>

                {/* Data Particles */}
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
                <div className="particle particle-3"></div>
                <div className="particle particle-4"></div>
                <div className="particle particle-5"></div>
                <div className="particle particle-6"></div>
              </div>

              {/* Receiver Side */}
              <div className="transfer-node receiver-node">
                <div className="node-avatar">
                  <Download size={32} />
                </div>
                <div className="node-label">Receiver</div>
                <div className="node-status">Receiving...</div>
              </div>
            </div>

            {/* Security Badges */}
            <div className="security-badges">
              <div className="security-badge">
                <Lock size={16} />
                <span>Encrypted Storage</span>
              </div>
              <div className="security-badge">
                <Shield size={16} />
                <span>Secure Transfer</span>
              </div>
              <div className="security-badge">
                <CheckCircle size={16} />
                <span>Verified</span>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="security-section" id="security">
          <span className="section-badge">Enterprise-Grade Security</span>
          <h2>Enterprise-Grade Security for Your Files</h2>
          <p style={{ maxWidth: '600px', margin: '1rem auto', color: '#6b7280' }}>
            We take security seriously. Your data is encrypted and protected at every step.
          </p>

          <div className="security-content">
            <div className="security-image">
              <div style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)', padding: '3rem', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={120} color="#6366f1" strokeWidth={1} />
              </div>
            </div>
            <div className="security-details">
              <h3>AES-256 Encryption Standard</h3>
              <p style={{ marginBottom: '2rem', color: '#6b7280' }}>
                Your files are encrypted in your browser using military-grade AES-256-GCM encryption before they ever reach our servers. We can't read your files, and neither can anyone else.
              </p>
              <ul className="security-list">
                <li>
                  <CheckCircle className="check-icon" size={24} />
                  <span>Client-side encryption (Zero-Knowledge)</span>
                </li>
                <li>
                  <CheckCircle className="check-icon" size={24} />
                  <span>Granular access controls and permissions</span>
                </li>
                <li>
                  <CheckCircle className="check-icon" size={24} />
                  <span>Automatic expiration and self-destruct</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <UseCaseCards />

        {/* Indian Real Estate & PropTech Suite Interactive Showcase */}
        <RealEstateShowcaseSection />

        {/* Global Security & Multi-Jurisdictional Legal Standards Showcase */}
        <section style={{
          padding: '4.5rem 2rem',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          borderTop: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#eff6ff',
              color: '#3b82f6',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1rem'
            }}>
              Global Security & Legal Standards
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem', letterSpacing: '-0.02em' }}>
              Engineered for Dealmakers in Dubai, Europe, Asia & Global Hubs
            </h2>
            <p style={{ maxWidth: '680px', margin: '0 auto 3rem', color: '#64748b', fontSize: '1.05rem', lineHeight: '1.6' }}>
              DocTransfer is built to satisfy international data privacy and security frameworks (EU GDPR, UAE PDPL, UK Data Protection Act, Singapore PDPA) while eliminating costly $45/user/mo legacy VDR fees.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.75rem',
              textAlign: 'left'
            }}>
              {[
                {
                  badge: 'GLOBAL VDR & COMPLIANCE',
                  title: 'Bank-Grade Virtual Deal Rooms',
                  desc: 'Granular role-based permissions, instant link revocation, and tamper-proof access audit trails compliant with international corporate governance standards.',
                  color: '#4f46e5',
                  bg: '#eef2ff'
                },
                {
                  badge: 'GDPR (EU) & UAE PDPL',
                  title: 'Zero-Knowledge Privacy Vaults',
                  desc: 'Browser-side AES-256-GCM encryption ensures pitch decks, cap tables, KYC passports, and financial audits stay completely unreadable to server hosts.',
                  color: '#059669',
                  bg: '#ecfdf5'
                },
                {
                  badge: 'CROSS-BORDER & MULTI-CHANNEL',
                  title: 'Instant Link Telemetry & Tracking',
                  desc: 'Share confidential presentations directly via WhatsApp, Email, or Slack. Track investor dwell time page-by-page across London, Dubai, Singapore, and global financial centers.',
                  color: '#0284c7',
                  bg: '#f0f9ff'
                },
                {
                  badge: '100% FREE CORE TIER ($0 / NO CARD)',
                  title: 'Zero Expensive SaaS Paywalls',
                  desc: 'Stop paying $15-$45/user/month for DocSend or thousands for legacy VDRs. Get unlimited deal rooms, page-by-page analytics, and anti-leak watermarking free.',
                  color: '#d97706',
                  bg: '#fffbeb'
                }
              ].map((card, i) => (
                <div key={i} style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '2rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <span style={{
                    display: 'inline-block',
                    background: card.bg,
                    color: card.color,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    width: 'fit-content'
                  }}>
                    {card.badge}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="features-section" id="features">
          <div className="features-header">
            <span className="section-badge">Key Features</span>
            <h2>Enterprise-Grade Document Security</h2>
            <p style={{ maxWidth: '700px', margin: '1rem auto', color: '#6b7280', fontSize: '1.1rem' }}>
              Comprehensive tools to secure, track, and control your sensitive documents with confidence.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card premium-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
                  <Lock size={28} />
                </div>
              </div>
              <h3>Password Protection</h3>
              <p>Secure files with password-protected links. Add an extra layer of security ensuring only authorized recipients can access your sensitive documents.</p>
              <div className="feature-highlight">🔐 Secure password protection</div>
            </div>

            <div className="feature-card premium-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)' }}>
                  <Mail size={28} />
                </div>
              </div>
              <h3>Email Verification</h3>
              <p>Require recipients to verify their email address to access documents. Ensure your files reach the intended recipient and maintain audit compliance.</p>
              <div className="feature-highlight">✉️ Identity assured</div>
            </div>

            <div className="feature-card premium-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}>
                  <Droplets size={28} />
                </div>
              </div>
              <h3>Dynamic Watermarking</h3>
              <p>Apply watermarks with viewer details and custom text. Prevent unauthorized sharing and maintain document traceability with personalized watermarks.</p>
              <div className="feature-highlight">💧 Customizable branding</div>
            </div>

            <div className="feature-card premium-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}>
                  <Download size={28} />
                </div>
              </div>
              <h3>Download Controls</h3>
              <p>Restrict or allow document downloads. Control how recipients interact with your files - view-only mode or full download permissions.</p>
              <div className="feature-highlight">⚙️ Granular permissions</div>
            </div>

            <div className="feature-card premium-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' }}>
                  <FileCheck size={28} />
                </div>
              </div>
              <h3>Audit Trail</h3>
              <p>Maintain a complete log of all user activity for compliance and transparency. Track every view, download, and interaction with detailed timestamps.</p>
              <div className="feature-highlight">📊 Complete visibility</div>
            </div>

            <div className="feature-card premium-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)' }}>
                  <ScrollText size={28} />
                </div>
              </div>
              <h3>NDA Agreements</h3>
              <p>Require recipients to agree to Non-Disclosure Agreements before viewing. Legally protect your confidential information with digital signatures.</p>
              <div className="feature-highlight">📝 Legal protection</div>
            </div>

            <div className="feature-card premium-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)' }}>
                  <Activity size={28} />
                </div>
              </div>
              <h3>Real-time Analytics</h3>
              <p>Track document views and engagement in real-time. Monitor who's viewing your documents as it happens with live dashboard updates.</p>
              <div className="feature-highlight">⚡ Live tracking</div>
            </div>

            <div className="feature-card premium-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
                  <BarChart3 size={28} />
                </div>
              </div>
              <h3>Page-by-Page Analytics</h3>
              <p>Gain detailed insights into how viewers interact with individual pages. See which pages get the most attention and where readers drop off.</p>
              <div className="feature-highlight">📈 Deep insights</div>
            </div>

            <div className="feature-card premium-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)' }}>
                  <Bell size={28} />
                </div>
              </div>
              <h3>Instant Alerts</h3>
              <p>Receive notifications when documents are viewed or shared. Stay informed with real-time alerts via email or in-app notifications.</p>
              <div className="feature-highlight">🔔 Stay notified</div>
            </div>
          </div>
        </section>

        {/* Animated Features Showcase */}
        <section className="animated-showcase">
          <div className="showcase-container">
            {/* Feature Wave 1 */}
            <div className="showcase-item wave-1">
              <div className="showcase-icon">
                <Lock size={32} />
              </div>
              <h3>Password Protection</h3>
              <p>Secure your files with password protection</p>
            </div>

            {/* Feature Wave 2 */}
            <div className="showcase-item wave-2">
              <div className="showcase-icon">
                <Activity size={32} />
              </div>
              <h3>Real-Time Analytics</h3>
              <p>Track views and engagement as it happens</p>
            </div>

            {/* Feature Wave 3 */}
            <div className="showcase-item wave-3">
              <div className="showcase-icon">
                <Bell size={32} />
              </div>
              <h3>Instant Notifications</h3>
              <p>Get alerted when documents are accessed</p>
            </div>

            {/* Feature Wave 4 */}
            <div className="showcase-item wave-4">
              <div className="showcase-icon">
                <Droplets size={32} />
              </div>
              <h3>Custom Watermarks</h3>
              <p>Protect against unauthorized sharing</p>
            </div>

            {/* Animated Background Elements */}
            <div className="showcase-glow glow-1"></div>
            <div className="showcase-glow glow-2"></div>
            <div className="showcase-glow glow-3"></div>
          </div>
        </section>

        {/* Popular Document Templates Section */}
        <section className="popular-templates-section">
          <div className="container">
            <div className="section-header">
              <span className="badge">Document Hub</span>
              <h2>Popular Document Templates</h2>
              <p>Free, legally compliant templates for startups, freelancers, and growing businesses. Open, customize, and sign securely.</p>
            </div>
            
            <div className="templates-grid">
              {[
                { name: 'Cross-Border Mutual NDA', slug: 'nda-template', desc: 'Standard international mutual non-disclosure agreement protecting trade secrets, financial models, and IP.', category: 'Legal' },
                { name: 'Commercial Property Lease Agreement', slug: 'lease-agreement-template', desc: 'Comprehensive commercial lease agreement for prime office, retail, and hospitality spaces.', category: 'Real Estate' },
                { name: 'International Service Agreement', slug: 'service-agreement-template', desc: 'Cross-border B2B service agreement with deliverables, milestone invoicing, and dispute jurisdiction.', category: 'Operations' },
                { name: 'Startup SAFE Investment Note', slug: 'safe-note-india-template', desc: 'Standard convertible equity instrument for early-stage startup fundraising with global angel and VC syndicates.', category: 'Startups' },
                { name: 'Exclusive Broker Mandate Agreement', slug: 'channel-partner-agreement', desc: 'Institutional brokerage mandate covering transaction fee slabs, marketing territory, and buyer exclusivity.', category: 'Real Estate' },
                { name: 'Cross-Border Freelance Agreement', slug: 'freelance-agreement-template', desc: 'Remote consulting and development agreement with full intellectual property assignment and confidentiality.', category: 'Operations' },
                { name: 'Board Resolution & Governance Deed', slug: 'board-resolution-template', desc: 'Formal board resolution for corporate authorizations, banking facilities, and equity issuances.', category: 'Corporate' },
                { name: 'Co-Founder Equity & Vesting Agreement', slug: 'founder-agreement-india-template', desc: 'Founder equity agreement with standard 4-year vesting schedule, 1-year cliff, and IP assignment.', category: 'Startups' }              ].map((template) => (
                <Link to={`/templates/${template.slug}`} key={template.slug} className="template-card">
                  <div className="template-card-header">
                    <span className="template-category">{template.category}</span>
                    <span className="template-arrow">→</span>
                  </div>
                  <h3>{template.name}</h3>
                  <p>{template.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Cryptographic Security Architecture Highlight (AES-256, Zero-Knowledge, Client-Side Cryptography) */}
        <CryptographicSecurityHighlight />

        {/* Global Agency & Enterprise Settings Suite Interactive Showcase */}
        <GlobalAgencySettingsSection />

        {/* Enterprise Compliance Roadmap Section */}
        <ComplianceRoadmapSection />

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-card">
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem', marginBottom: '1rem', display: 'inline-block' }}>Start for free</span>
            <h2>Everything you need to share securely</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
              Join thousands of professionals who trust DocTransfer for their document sharing needs.
            </p>
            <div className="cta-buttons">
              <Link to="/pricing">
                <button style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                  transition: 'transform 0.2s'
                }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >Get Started Now</button>
              </Link>
              <button style={{ background: 'transparent', border: '1px solid white', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Contact Sales</button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${openFaq === index ? 'active' : ''}`} onClick={() => toggleFaq(index)}>
                <div className="faq-question">
                  {faq.question}
                  {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                <div className="faq-answer">
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
