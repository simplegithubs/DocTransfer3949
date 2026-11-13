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
  FileSpreadsheet,
  FolderLock,
  Smartphone,
  KeyRound,
  ExternalLink,
  CheckCircle2,
  MessageCircle
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
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
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
                <Link to="/dashboard" style={{ textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
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
          {/* Papermark-style Background Video Carousel - PRESERVED 100% */}
          <HeroVideoBackground activeFeature={activeFeature} />

          <div className="hero-container">
            <div className="hero-content-left">
              <div className="hero-eyebrow-left" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                padding: '0.4rem 0.95rem',
                borderRadius: '30px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#f8fafc',
                marginBottom: '1.35rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)'
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#10b981' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></span>
                  ISO 27001 & SOC 2
                </span>
                <span style={{ opacity: 0.35 }}>·</span>
                <span>Zero-Knowledge AES-256</span>
                <span style={{ opacity: 0.35 }}>·</span>
                <span style={{ color: '#38bdf8' }}>EU GDPR · DIFC · UAE PDPL</span>
              </div>

              <h1 className="hero-title-left">
                The Premier Deal Room for Sharing, Tracking & Protecting Confidential Files.
              </h1>

              <p style={{
                fontSize: 'clamp(1.02rem, 1.3vw, 1.15rem)',
                color: 'rgba(255, 255, 255, 0.88)',
                lineHeight: 1.6,
                maxWidth: '680px',
                margin: '0 0 1.85rem',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.85)'
              }}>
                Distribute M&A dossiers, pitch decks, and luxury real estate offerings with dynamic recipient watermarking, page-by-page dwell telemetry, and instant 1-click remote revocation.
              </p>

              <div className="hero-actions-left" style={{ marginBottom: '1.85rem' }}>
                <Link to="/dataroom" style={{ textDecoration: 'none' }}>
                  <button className="hero-btn-papermark">
                    <Sparkles size={16} color="#4f46e5" />
                    <span>Create a Deal Room — Free ($0 / No Card)</span>
                    <ArrowRight size={16} />
                  </button>
                </Link>
                <Link to="/pricing" style={{ textDecoration: 'none' }}>
                  <button className="hero-btn-secondary-papermark">
                    <span>Explore Pricing</span>
                  </button>
                </Link>
              </div>

              {/* Institutional Deal Metrics Proof Strip */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: '1rem',
                padding: '0.95rem 1.25rem',
                background: 'rgba(15, 23, 42, 0.72)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                maxWidth: '660px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)'
              }}>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>$2.4B+</div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.1rem' }}>Deal Volume Protected</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '-0.02em' }}>140+</div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.1rem' }}>Active Jurisdictions</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981', letterSpacing: '-0.02em' }}>100%</div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.1rem' }}>Zero Leaks Recorded</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#a855f7', letterSpacing: '-0.02em' }}>$0 Core</div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.1rem' }}>No Card Required</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modernized Hero Feature Showcase Section */}
        <section className="hero-showcase-section">
          {/* Section Subtitle & Context */}
          <div style={{ maxWidth: '800px', margin: '0 auto 1.5rem', textAlign: 'center' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#eef2ff',
              color: '#4f46e5',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '0.3rem 0.8rem',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem'
            }}>
              <Sparkles size={13} />
              Interactive Deal Room Showcase
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
              The Dealmaker's Command Center in Action
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>
              Experience bank-grade security, instant pre-flight DRM configuration, and second-by-second reader intelligence.
            </p>
          </div>

          {/* Hero Feature Navigation Bar */}
          <div className="hero-feature-nav">
            <button
              className={`nav-item ${activeFeature === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveFeature('upload')}
            >
              <Upload size={17} /> Deal Dispatch
            </button>
            <button
              className={`nav-item ${activeFeature === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveFeature('documents')}
            >
              <FolderTree size={17} /> VDR Diligence Vault
            </button>
            <button
              className={`nav-item ${activeFeature === 'permissions' ? 'active' : ''}`}
              onClick={() => setActiveFeature('permissions')}
            >
              <Shield size={17} /> Audit Trail & Compliance
            </button>
            <button
              className={`nav-item ${activeFeature === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveFeature('analytics')}
            >
              <BarChart3 size={17} /> Live Telemetry Heatmap
            </button>
            <button
              className={`nav-item ${activeFeature === 'security' ? 'active' : ''}`}
              onClick={() => setActiveFeature('security')}
            >
              <Lock size={17} /> Strict DRM & Kill Switch
            </button>
          </div>

          {/* Hero Feature Showcase Content */}
          <div className="hero-showcase-content" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            {activeFeature === 'upload' && (
              <div className="dashboard-ui-mockup" style={{
                width: '100%',
                maxWidth: '980px',
                borderRadius: '20px',
                backgroundColor: '#ffffff',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.8)',
                margin: '0 auto 2rem',
                position: 'relative',
                zIndex: 10,
                overflow: 'hidden',
                textAlign: 'left'
              }}>
                {/* Header bar */}
                <div style={{
                  padding: '1.25rem 1.75rem',
                  borderBottom: '1px solid #e2e8f0',
                  background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                      <Upload size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Quick Deal Dispatch Dropzone</div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Staged Deal: Project Azure • $120M Luxury Resort Diligence</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#ecfdf5', color: '#059669', padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid #a7f3d0' }}>
                      AES-256 GCM Client-Side
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                      Zero-Knowledge
                    </span>
                  </div>
                </div>

                <div style={{ padding: '1.75rem' }}>
                  {/* Dropzone Container */}
                  <div style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '16px',
                    padding: '2.5rem 2rem',
                    textAlign: 'center',
                    background: '#f8fafc',
                    position: 'relative',
                    transition: 'border-color 0.2s ease',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem',
                      color: '#4f46e5'
                    }}>
                      <Upload size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.4rem' }}>
                      Drag & Drop Confidential Dossiers, Pitch Decks, or CIMs
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: '#64748b', margin: '0 0 1.25rem' }}>
                      Supports PDF, PPTX, XLSX, DOCX up to 500 MB with automated forensic watermarking
                    </p>
                    <Link to="/dataroom" style={{ textDecoration: 'none' }}>
                      <button style={{
                        background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.65rem 1.4rem',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem'
                      }}>
                        <Sparkles size={15} />
                        <span>Select File to Dispatch</span>
                      </button>
                    </Link>
                  </div>

                  {/* Pre-flight Security Configurations Grid */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '0.85rem' }}>
                      Pre-Flight Security Checklist & Enforcement
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
                      {[
                        { title: 'Dynamic Recipient Watermark', desc: 'Viewer email, phone, IP & UTC timestamp stamped on every page', icon: Droplets, color: '#0284c7', bg: '#f0f9ff' },
                        { title: 'Mandatory Click-Through NDA', desc: 'Court-admissible legal sign-off required prior to document access', icon: ScrollText, color: '#7c3aed', bg: '#f5f3ff' },
                        { title: 'Screenshot & DevTools Shield', desc: 'Instant blank screen defense against print screen and DevTools inspection', icon: ShieldAlert, color: '#dc2626', bg: '#fef2f2' },
                        { title: 'Real-Time WhatsApp Alerts', desc: 'Instant notification on WhatsApp the second a VIP buyer opens the teaser', icon: Bell, color: '#059669', bg: '#ecfdf5' },
                      ].map((item, idx) => (
                        <div key={idx} style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '0.9rem 1rem',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem'
                        }}>
                          <div style={{ padding: '0.45rem', borderRadius: '8px', background: item.bg, color: item.color, flexShrink: 0 }}>
                            <item.icon size={16} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
                              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>{item.title}</span>
                              <CheckCircle size={14} color="#10b981" />
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.35, marginTop: '0.2rem' }}>{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Staged Deal Document Dispatch Card */}
                  <div style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                    borderRadius: '14px',
                    padding: '1.25rem 1.5rem',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.25)', border: '1px solid rgba(129, 140, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a5b4fc' }}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>Project_Summit_SeriesA_Teaser_Final.pdf</span>
                          <span style={{ fontSize: '0.65rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.25)', color: '#34d399', padding: '0.1rem 0.45rem', borderRadius: '4px', border: '1px solid rgba(52, 211, 153, 0.4)' }}>
                            READY TO DISPATCH
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                          14.2 MB • Pre-flight DRM verified • 18 VIP Investors targeted
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Link to="/dataroom" style={{ textDecoration: 'none' }}>
                        <button style={{
                          background: '#ffffff',
                          color: '#0f172a',
                          border: 'none',
                          padding: '0.55rem 1.15rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}>
                          <span>Generate Secure Deal Room</span>
                          <ArrowRight size={13} />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFeature === 'documents' && (
              <div className="dashboard-ui-mockup" style={{
                width: '100%',
                maxWidth: '980px',
                borderRadius: '20px',
                backgroundColor: '#ffffff',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.8)',
                margin: '0 auto 2rem',
                position: 'relative',
                zIndex: 10,
                overflow: 'hidden',
                textAlign: 'left'
              }}>
                {/* VDR Vault Header */}
                <div style={{
                  padding: '1.25rem 1.75rem',
                  borderBottom: '1px solid #e2e8f0',
                  background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <FolderTree size={18} color="#4f46e5" />
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        VDR Diligence Vault: Project Azure — $120M Luxury Resort
                      </h3>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                      Virtual Data Room • 4 Diligence Modules • 20 Files • AES-256 Vault Mode Active
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#eef2ff', color: '#4f46e5', padding: '0.25rem 0.65rem', borderRadius: '6px', border: '1px solid #c7d2fe' }}>
                      42 Active Deal Viewers
                    </span>
                    <Link to="/dataroom" style={{ textDecoration: 'none' }}>
                      <button style={{
                        background: '#0f172a',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.45rem 0.85rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}>
                        Open Diligence Vault
                      </button>
                    </Link>
                  </div>
                </div>

                <div style={{ padding: '1.5rem 1.75rem' }}>
                  {/* Structured Diligence Folders Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
                    {[
                      { name: '01. Financial Models & Audits', count: '4 Documents • 18.2 MB', status: 'PE LEAD UNLOCKED', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
                      { name: '02. Legal, Deeds & Zoning', count: '8 Documents • 42.5 MB', status: 'MANDATORY NDA', color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' },
                      { name: '03. Cap Table & Valuation', count: '3 Documents • 6.8 MB', status: 'FORENSIC WATERMARK', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
                      { name: '04. Operator Term Sheets', count: '5 Documents • 21.4 MB', status: 'RESTRICTED ACCESS', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
                    ].map((folder, i) => (
                      <div key={i} style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '1rem',
                        transition: 'transform 0.15s ease',
                        cursor: 'pointer'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                          <FolderLock size={20} color={folder.color} />
                          <span style={{ fontSize: '0.62rem', fontWeight: 800, background: folder.bg, color: folder.color, padding: '0.1rem 0.4rem', borderRadius: '4px', border: `1px solid ${folder.border}` }}>
                            {folder.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.2rem' }}>{folder.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{folder.count}</div>
                      </div>
                    ))}
                  </div>

                  {/* Active Documents Table */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '0.65rem 1rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b' }}>
                      <div>Document Name</div>
                      <div>Diligence Stage</div>
                      <div>Telemetry & Views</div>
                      <div>Security Enforcement</div>
                    </div>
                    {[
                      { name: 'Azure_Resort_Stabilized_Projections_2026.xlsx', size: '12.4 MB', folder: '01. Financial Models', views: '18 PE Views (Avg 6m 12s)', security: 'Watermark + DevTools Shield', statusColor: '#059669' },
                      { name: 'Project_Azure_Confidential_CIM_Dossier.pdf', size: '4.2 MB', folder: '01. Financial Models', views: '42 Institutional Views', security: 'Mandatory NDA Gate', statusColor: '#4f46e5' },
                      { name: 'Freehold_Title_Deed_DLD_Registered.pdf', size: '1.6 MB', folder: '02. Legal & Deeds', views: '9 Diligence Reviews', security: 'View-Only DRM Enforced', statusColor: '#0284c7' },
                      { name: 'Senior_Facility_Term_Sheet_Executed.pdf', size: '3.1 MB', folder: '03. Cap Table & Debt', views: '14 Board Reviews', security: 'Remote Kill Switch Ready', statusColor: '#dc2626' }
                    ].map((doc, idx) => (
                      <div key={idx} style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1fr',
                        padding: '0.85rem 1rem',
                        borderBottom: idx < 3 ? '1px solid #f1f5f9' : 'none',
                        alignItems: 'center',
                        fontSize: '0.82rem',
                        background: '#ffffff'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <FileText size={16} color="#4f46e5" />
                          <div>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{doc.name}</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{doc.size}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#475569' }}>{doc.folder}</div>
                        <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>{doc.views}</div>
                        <div>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: doc.statusColor, background: '#f8fafc', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                            {doc.security}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeFeature === 'permissions' && (
              <div className="dashboard-ui-mockup" style={{
                width: '100%',
                maxWidth: '980px',
                borderRadius: '20px',
                backgroundColor: '#ffffff',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.8)',
                margin: '0 auto 2rem',
                position: 'relative',
                zIndex: 10,
                border: '1px solid #f1f5f9',
                textAlign: 'left'
              }}>
                {/* Header */}
                <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', background: '#f8fafc' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <Shield size={20} color="#6366f1" strokeWidth={2.5} />
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', margin: 0 }}>Compliance & Legal Audit Trail</h3>
                    </div>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.78rem' }}>Tamper-evident, court-admissible electronic activity log for cross-border diligence.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#d1fae5', padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid #a7f3d0' }}>
                      <CheckCircle size={13} /> DIFC / GDPR / eIDAS Verified
                    </span>
                  </div>
                </div>

                {/* Table Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(90px, 1fr) minmax(170px, 1.4fr) minmax(140px, 1.3fr) minmax(130px, 1.2fr) minmax(260px, 2.4fr)', padding: '0.7rem 1.75rem', borderBottom: '1px solid #e2e8f0', fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: '#fafafa' }}>
                  <div>TIMESTAMP (UTC)</div>
                  <div>EVENT TYPE</div>
                  <div>USER & DEVICE</div>
                  <div>LOCATION & IP</div>
                  <div>DOCUMENT & DIGITAL EVIDENCE</div>
                </div>

                {/* Table Body */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {[
                    {
                      date: 'Today, 14:32:09',
                      eventIcon: Eye,
                      eventColor: '#3b82f6',
                      eventBg: '#dbeafe',
                      eventBorder: '#bfdbfe',
                      eventText: 'Teaser Viewed (8m 42s)',
                      user: 'Managing Director, DIFC Fund',
                      device: 'Chrome on MacOS (M3 Max)',
                      location: 'Dubai, UAE (DIFC Gate)',
                      ip: '185.107.56.12',
                      doc: 'Project_Azure_Executive_CIM.pdf',
                      details: 'Watermark Stamped: alex.v@apexcap.ae • Dwell: Page 3 (3m 12s), Page 5 (4m 10s)'
                    },
                    {
                      date: 'Today, 12:15:40',
                      eventIcon: ScrollText,
                      eventColor: '#7c3aed',
                      eventBg: '#f5f3ff',
                      eventBorder: '#ddd6fe',
                      eventText: 'Click-Through NDA Signed',
                      user: 'General Partner, London PE',
                      device: 'Safari on iPad Pro',
                      location: 'London, UK (Mayfair)',
                      ip: '185.125.190.24',
                      doc: 'Mutual_Cross_Border_NDA.pdf',
                      details: 'Digital Signature Hash: 0x8f2a...c41e • OTP Verified via SMS (+44 7911...)'
                    },
                    {
                      date: 'Yesterday, 19:40:11',
                      eventIcon: Download,
                      eventColor: '#10b981',
                      eventBg: '#d1fae5',
                      eventBorder: '#a7f3d0',
                      eventText: 'Authorized Download',
                      user: 'Partner, US Growth Syndicate',
                      device: 'Chrome on Windows 11',
                      location: 'San Francisco, US',
                      ip: '104.28.19.42',
                      doc: 'Azure_Resort_Financial_Model.xlsx',
                      details: 'Forensic Metadata Injected • Dynamic PDF Stamped: partner@summitcap.com'
                    },
                    {
                      date: 'Yesterday, 16:05:22',
                      eventIcon: ShieldAlert,
                      eventColor: '#dc2626',
                      eventBg: '#fef2f2',
                      eventBorder: '#fecaca',
                      eventText: 'DevTools Inspection Defeated',
                      user: 'Anonymous Forward Recipient',
                      device: 'Edge on Windows 10',
                      location: 'Singapore (Raffles Place)',
                      ip: '165.225.112.90',
                      doc: 'Valuation_CapTable_Restricted.pdf',
                      details: 'DevTools triggered • Screen automatically blanked • Link revoked'
                    }
                  ].map((row, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(90px, 1fr) minmax(170px, 1.4fr) minmax(140px, 1.3fr) minmax(130px, 1.2fr) minmax(260px, 2.4fr)', padding: '1rem 1.75rem', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none', alignItems: 'start', background: '#ffffff' }}>
                      <div style={{ color: '#475569', fontSize: '0.8rem', fontWeight: 600 }}>{row.date}</div>

                      <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.55rem', borderRadius: '20px', border: `1px solid ${row.eventBorder}`, backgroundColor: row.eventBg, color: row.eventColor, fontSize: '0.74rem', fontWeight: 700 }}>
                          <row.eventIcon size={12} strokeWidth={2.5} />
                          {row.eventText}
                        </div>
                      </div>

                      <div style={{ fontSize: '0.82rem' }}>
                        <div style={{ fontWeight: 700, color: '#1e293b' }}>{row.user}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748b', marginTop: '0.25rem', fontSize: '0.74rem' }}>
                          <Monitor size={12} /> {row.device}
                        </div>
                      </div>

                      <div style={{ fontSize: '0.82rem' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{row.location}</div>
                        <div style={{ color: '#94a3b8', marginTop: '0.25rem', fontSize: '0.74rem' }}>{row.ip}</div>
                      </div>

                      <div style={{ fontSize: '0.82rem', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: '#4f46e5', marginBottom: '0.35rem' }}>
                          <FileText size={14} />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.doc}</span>
                        </div>
                        <div style={{ backgroundColor: '#f8fafc', padding: '0.35rem 0.55rem', borderRadius: '6px', fontSize: '0.72rem', color: '#64748b', border: '1px solid #e2e8f0', lineHeight: 1.35 }}>
                          {row.details}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeFeature === 'analytics' && (
              <div className="dashboard-ui-mockup" style={{
                width: '100%',
                maxWidth: '980px',
                borderRadius: '20px',
                backgroundColor: '#ffffff',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.8)',
                margin: '0 auto 2rem',
                position: 'relative',
                zIndex: 10,
                border: '1px solid #f1f5f9',
                textAlign: 'left'
              }}>
                {/* Header */}
                <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', background: '#f8fafc' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <BarChart3 size={20} color="#7c3aed" />
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', margin: 0 }}>Unified Investor Telemetry & Heatmap</h3>
                    </div>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.78rem' }}>Live tracking: Project Azure CIM & Financial Model</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4', color: '#16a34a', padding: '0.25rem 0.65rem', borderRadius: '16px', fontSize: '0.72rem', fontWeight: 700 }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 8px #22c55e' }}></div>
                    <span>LIVE TELEMETRY STREAM</span>
                  </div>
                </div>

                <div style={{ padding: '1.75rem' }}>
                  {/* KPI Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    {[
                      { label: 'Total Impressions', val: '4,812', change: '+28% this week', color: '#4f46e5', icon: Eye },
                      { label: 'Institutional Viewers', val: '342', change: 'PE, VC & Family Offices', color: '#059669', icon: Fingerprint },
                      { label: 'Avg. Dwell Time', val: '4m 18s', change: 'High diligence intent', color: '#d97706', icon: Clock },
                      { label: 'Completion Rate', val: '84.2%', change: 'Multi-slide review', color: '#7c3aed', icon: BarChart3 }
                    ].map((kpi, i) => (
                      <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.15rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: kpi.color, fontSize: '0.76rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                          <kpi.icon size={14} />
                          <span>{kpi.label}</span>
                        </div>
                        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>{kpi.val}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{kpi.change}</div>
                      </div>
                    ))}
                  </div>

                  {/* Page-by-Page Attention Heatmap */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                        Page-by-Page Investor Attention Heatmap (Project Azure CIM)
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Second-by-second reader dwell time</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {[
                        { page: 'Page 1: Executive Deal Summary', time: '48s dwell', pct: 45, tag: 'High Interest', tagBg: '#eff6ff', tagColor: '#2563eb' },
                        { page: 'Page 3: Historical RevPAR & Unit Economics', time: '1m 24s dwell', pct: 68, tag: 'High Scrutiny', tagBg: '#f5f3ff', tagColor: '#7c3aed' },
                        { page: 'Page 5: 5-Year Financial Models & Cash Flows', time: '2m 12s dwell', pct: 95, tag: '🔥 PEAK ATTENTION', tagBg: '#fef2f2', tagColor: '#dc2626' },
                        { page: 'Page 8: Debt Structure & Valuation Slabs', time: '1m 45s dwell', pct: 78, tag: 'Deal Terms Focus', tagBg: '#fff7ed', tagColor: '#ea580c' },
                        { page: 'Page 12: Operator Management Agreement', time: '1m 10s dwell', pct: 55, tag: 'Legal Review', tagBg: '#ecfdf5', tagColor: '#059669' }
                      ].map((item, idx) => (
                        <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem 1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', fontSize: '0.78rem' }}>
                            <span style={{ fontWeight: 600, color: '#1e293b' }}>{item.page}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ color: '#64748b', fontWeight: 600 }}>{item.time}</span>
                              <span style={{ fontSize: '0.65rem', fontWeight: 700, background: item.tagBg, color: item.tagColor, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{item.tag}</span>
                            </div>
                          </div>
                          <div style={{ width: '100%', height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${item.pct}%`, height: '100%', background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)', borderRadius: '4px' }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFeature === 'security' && (
              <div className="dashboard-ui-mockup" style={{
                width: '100%',
                maxWidth: '980px',
                borderRadius: '20px',
                backgroundColor: '#0f172a',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
                margin: '0 auto 2rem',
                position: 'relative',
                zIndex: 10,
                padding: '1.5rem',
                fontFamily: "'Inter', sans-serif",
                color: '#f8fafc',
                textAlign: 'left'
              }}>
                {/* Header Navbar */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b',
                  padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid #334155'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
                      Active Zero-Trust DRM Vault: Project_Azure_Acquisition_Teaser.pdf
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.25rem 0.65rem', borderRadius: '6px', fontWeight: 700 }}>
                      AES-256 GCM ZERO-KNOWLEDGE
                    </span>
                  </div>
                </div>

                {/* Main Content Area: Document View + Live Controls */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: '1.5rem', marginTop: '1.5rem', minHeight: '460px' }}>
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
                      opacity: 0.22,
                      fontSize: '0.95rem',
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
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.05em' }}>RESTRICTED DILIGENCE MEMO</span>
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
                          { title: 'Dynamic Recipient Watermark', status: 'ACTIVE', desc: 'Overlays viewer phone, email & IP on every page', color: '#10b981' },
                          { title: 'International Mobile Gate', status: '+971 UAE', desc: 'OTP verification required before viewing', color: '#38bdf8' },
                          { title: 'Strict View-Only DRM Mode', status: 'ENFORCED', desc: 'Downloads, printing & clipboard blocked', color: '#fbbf24' },
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
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>1-Click Remote Kill Switch:</span>
                      <button style={{
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)'
                      }}>
                        Sever Active Viewers
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
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

        {/* Key Features Section - Enterprise Bento Matrix */}
        <section className="features-section" id="features" style={{
          padding: '5rem 2rem',
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
          borderTop: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div className="features-header" style={{ maxWidth: '820px', margin: '0 auto 3.5rem', textAlign: 'center' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#eef2ff',
              color: '#4f46e5',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '0.3rem 0.8rem',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem'
            }}>
              <ShieldAlert size={14} />
              Institutional Feature Matrix
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem', letterSpacing: '-0.025em' }}>
              Built for High-Stakes Deals & Strict Diligence
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
              Zero-knowledge cryptographic protection, second-by-second investor telemetry, and legal access governance combined in one unified platform.
            </p>
          </div>

          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            textAlign: 'left'
          }}>
            {[
              {
                title: 'Dynamic Forensic Watermarking',
                desc: 'Overlay viewer verified email, phone (+971, +44, +1), IP, and exact UTC timestamp diagonally across every page to eliminate leaks.',
                badge: 'Zero-Leak',
                badgeBg: '#fef2f2',
                badgeColor: '#dc2626',
                icon: Droplets,
                iconBg: '#eff6ff',
                iconColor: '#2563eb'
              },
              {
                title: 'Click-Through NDA Gateway',
                desc: 'Enforce court-admissible electronic non-disclosure agreements with digital signature hashes prior to document decryption.',
                badge: 'Legal Gate',
                badgeBg: '#f5f3ff',
                badgeColor: '#7c3aed',
                icon: ScrollText,
                iconBg: '#f5f3ff',
                iconColor: '#7c3aed'
              },
              {
                title: '1-Click Active Sessions Kill Switch',
                desc: 'Instantly sever active viewers, blank running screens, and revoke access tokens remotely with a single emergency click.',
                badge: 'Live Kill',
                badgeBg: '#fff1f2',
                badgeColor: '#e11d48',
                icon: Power,
                iconBg: '#fff1f2',
                iconColor: '#e11d48'
              },
              {
                title: 'Territory Geo-Fencing & IP Lock',
                desc: 'Restrict access to specific countries (UAE, EU, UK, US, SG) and authorized corporate CIDR subnets to prevent unauthorized forwarding.',
                badge: 'Geo-Defense',
                badgeBg: '#eef2ff',
                badgeColor: '#4f46e5',
                icon: Globe,
                iconBg: '#eef2ff',
                iconColor: '#4f46e5'
              },
              {
                title: 'Page-by-Page Attention Heatmaps',
                desc: 'Gain second-by-second visibility into where prospective buyers dwell, which financial models they scrutinize, and where interest drops off.',
                badge: 'Telemetry',
                badgeBg: '#f0fdf4',
                badgeColor: '#16a34a',
                icon: BarChart3,
                iconBg: '#f0fdf4',
                iconColor: '#16a34a'
              },
              {
                title: 'Zero-Knowledge Client Encryption',
                desc: 'Browser-side AES-256-GCM encryption ensures pitch decks, cap tables, and financial audits stay completely unreadable to server hosts.',
                badge: 'AES-256',
                badgeBg: '#f1f5f9',
                badgeColor: '#475569',
                icon: Lock,
                iconBg: '#f1f5f9',
                iconColor: '#475569'
              },
              {
                title: 'Real-Time WhatsApp & Email Alerts',
                desc: 'Receive immediate notifications the exact second a General Partner, VIP investor, or corporate acquirer opens your presentation link.',
                badge: 'Instant Alert',
                badgeBg: '#f0fdf4',
                badgeColor: '#15803d',
                icon: Bell,
                iconBg: '#f0fdf4',
                iconColor: '#15803d'
              },
              {
                title: 'eIDAS & DIFC Compliant Audit Logs',
                desc: 'Maintain court-admissible, tamper-evident digital activity logs with timestamped electronic evidence certificates for cross-border deals.',
                badge: 'eIDAS / DIFC',
                badgeBg: '#ecfeff',
                badgeColor: '#0891b2',
                icon: FileCheck,
                iconBg: '#ecfeff',
                iconColor: '#0891b2'
              }
            ].map((feature, i) => (
              <div key={i} style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.75rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02), 0 1px 3px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px -6px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(99, 102, 241, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.02), 0 1px 3px rgba(0, 0, 0, 0.04)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ padding: '0.55rem', borderRadius: '10px', background: feature.iconBg, color: feature.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <feature.icon size={20} />
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, background: feature.badgeBg, color: feature.badgeColor, padding: '0.15rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.04)' }}>
                      {feature.badge}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem', letterSpacing: '-0.01em' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.55, margin: 0 }}>
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
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
          <div className="cta-card" style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
            borderRadius: '24px',
            padding: '4rem 2rem',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <span style={{
              background: 'rgba(99, 102, 241, 0.25)',
              color: '#c7d2fe',
              border: '1px solid rgba(129, 140, 248, 0.4)',
              padding: '0.35rem 0.95rem',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1.25rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <Sparkles size={14} color="#818cf8" />
              Start For Free • $0 / No Card Required
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.85rem)', fontWeight: 800, color: '#ffffff', margin: '0 0 1rem', letterSpacing: '-0.025em' }}>
              Ready to Protect Your Next High-Stakes Deal?
            </h2>
            <p style={{ maxWidth: '640px', margin: '0 auto 2.25rem', color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Join venture funds, private equity firms, luxury real estate developers, and founders across Dubai, London, Singapore, and New York.
            </p>
            <div className="cta-buttons" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <Link to="/dataroom" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: '#ffffff',
                  color: '#0f172a',
                  border: 'none',
                  padding: '0.85rem 2rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.backgroundColor = '#ffffff'; }}
                >
                  <Sparkles size={16} color="#4f46e5" />
                  <span>Create Deal Room Free</span>
                  <ArrowRight size={16} />
                </button>
              </Link>
              <Link to="/pricing" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  padding: '0.85rem 1.75rem',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; }}
                >
                  Explore Pricing
                </button>
              </Link>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <span>✓ Zero expensive monthly lock-in</span>
              <span>✓ AES-256 client-side encryption</span>
              <span>✓ Instant setup in under 60 seconds</span>
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
