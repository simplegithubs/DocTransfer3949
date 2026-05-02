import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import Logo from './components/Logo';
import SEO from './components/SEO';
import UseCaseCards from './components/UseCaseCards';
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
  Camera,
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
  Send,
  Globe,
  Twitter,
  Instagram,
  Youtube,
  Linkedin
} from 'lucide-react';
const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showProductMenu, setShowProductMenu] = useState(false);
  const [activeFeature, setActiveFeature] = useState<'upload' | 'documents' | 'permissions' | 'analytics' | 'esignature' | 'google-drive'>('upload');


  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Is DocTransfer really free?",
      answer: "Yes, absolutely! We've made the strategic decision to unlock all our premium, professional, and enterprise features for everyone. No credit card, no subscriptions, just world-class security at no cost."
    },
    {
      question: "How does End-to-End (E2E) Encryption protect my files?",
      answer: "With our 'Vault Mode', your files are encrypted directly in your browser using AES-256 before they are uploaded. This means only you and your authorized recipients hold the decryption keys. Even DocTransfer cannot access the content of your encrypted files."
    },
    {
      question: "What is 'Burn After Reading'?",
      answer: "This feature allows you to set documents to automatically delete themselves after a single view or a specific number of views, ensuring your sensitive data doesn't persist longer than necessary."
    },
    {
      question: "Is DocTransfer compliant with industry standards?",
      answer: "Yes! We provide features like comprehensive Audit Trails, E2E encryption, and secure storage that help businesses maintain compliance with standards like HIPAA, GDPR, and NIST."
    },
    {
      question: "Can I add my own branding to the documents?",
      answer: "Absolutely. Our White-Labeling feature allows you to remove DocTransfer branding and add your own company logo and colors, providing a professional and seamless experience for your clients."
    },
    {
      question: "Are E-Signatures legally binding?",
      answer: "Yes, our E-Signature feature is designed to be legally binding and compliant with major electronic signature laws. Every signed document is accompanied by a detailed digital certificate and audit trail."
    },
    {
      question: "What makes file transfers on DocTransfer 'Secure'?",
      answer: "Beyond encryption, we provide granular access controls. You can set expiration dates, limit the number of views, password-protect links, and even restrict access to specific email domains or IP addresses, ensuring your files never fall into the wrong hands."
    }
  ];

  return (
    <div className="landing-page">
      <SEO
        title="DocTransfer - Free DocSend Alternative with E2E Encryption"
        description="Stop paying for DocSend. Get professional document sharing, page-by-page analytics, and dynamic watermarking for free. Secure, encrypted, and legally binding."
        keywords="DocSend alternatives, free DocSend alternative, secure document sharing, virtual data room, pitch deck tracking, document analytics"
      />
      <header className="header">
        <Logo size={32} />
        <nav>
          <div className="nav-links">
            <div
              className="nav-item-dropdown"
              style={{ position: 'relative', display: 'inline-block' }}
              onMouseEnter={() => setShowProductMenu(true)}
              onMouseLeave={() => setShowProductMenu(false)}
            >
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  fontWeight: 500,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0'
                }}
              >
                Product <ChevronDown size={16} />
              </button>

              {showProductMenu && (
                <div
                  className="product-dropdown"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '-50px',
                    width: '600px',
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    padding: '2rem',
                    zIndex: 1000,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '2rem',
                    border: '1px solid #f3f4f6'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '1rem', letterSpacing: '0.05em' }}>Core Security</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {[
                        { name: 'Secure Transfer', icon: Shield, desc: 'Encrypted document sharing' },
                        { name: 'End-to-End Encryption', icon: Lock, desc: 'Zero-knowledge architecture' },
                        { name: 'Password Protection', icon: Lock, desc: 'Access control with passwords' },
                        { name: 'Email Verification', icon: Mail, desc: 'Confirm recipient identity' },
                        { name: 'Link Expiration', icon: Clock, desc: 'Time-limited access' },
                        { name: 'Burn After Reading', icon: Flame, desc: 'Self-destructing files' },
                      ].map((feature, i) => (
                        <li key={i}>
                          <a href="#features" style={{ textDecoration: 'none', display: 'flex', alignItems: 'start', gap: '0.75rem', color: '#1f2937' }}>
                            <div style={{ padding: '0.35rem', background: '#eff6ff', borderRadius: '6px', color: '#4f46e5' }}>
                              <feature.icon size={16} />
                            </div>
                            <div>
                              <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{feature.name}</div>
                              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{feature.desc}</div>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '1rem', letterSpacing: '0.05em' }}>Advanced Features</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {[
                        { name: 'Dynamic Watermarking', icon: Droplets, desc: 'Traceable document overlays' },
                        { name: 'Biometric Lock', icon: Fingerprint, desc: 'Fingerprint & Face ID access' },
                        { name: 'Webcam Snapshot', icon: Camera, desc: 'Photo verification on view' },
                        { name: 'E-Signature', icon: PenTool, desc: 'Legally binding signatures' },
                        { name: 'Deep Analytics', icon: BarChart3, desc: 'Page-level engagement tracking' },
                        { name: 'Audit Trails', icon: FileCheck, desc: 'Complete activity logs' },
                      ].map((feature, i) => (
                        <li key={i}>
                          <a href="#features" style={{ textDecoration: 'none', display: 'flex', alignItems: 'start', gap: '0.75rem', color: '#1f2937' }}>
                            <div style={{ padding: '0.35rem', background: '#f5f3ff', borderRadius: '6px', color: '#7c3aed' }}>
                              <feature.icon size={16} />
                            </div>
                            <div>
                              <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{feature.name}</div>
                              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{feature.desc}</div>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <Link to="/blog" style={{ marginRight: '1.5rem', textDecoration: 'none', color: '#4b5563', fontWeight: 500 }}>Blog</Link>
            <Link to="/pricing" style={{ marginRight: '1.5rem', textDecoration: 'none', color: '#4b5563', fontWeight: 500 }}>Pricing</Link>
            <a href="#security" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: 500 }}>Security</a>
          </div>
          <SignedOut>
            <SignInButton mode="modal">
              <button
                className="btn-primary"
                style={{
                  padding: '0.75rem 1.75rem',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  borderRadius: '14px',
                  boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
                  letterSpacing: '0.025em'
                }}
              >
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/dataroom">
                <button
                  style={{
                    padding: '0.65rem 1.25rem',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(99, 102, 241, 0.4)';
                  }}
                >
                  Dashboard
                </button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero">
          {/* Floating Background Elements */}
          <div className="floating-elements">
            <div className="floating-icon floating-1"><FileText size={40} /></div>
            <div className="floating-icon floating-2"><Upload size={35} /></div>
            <div className="floating-icon floating-3"><Download size={38} /></div>
            <div className="floating-icon floating-4"><Share2 size={32} /></div>
            <div className="floating-icon floating-5"><File size={36} /></div>
            <div className="floating-icon floating-6"><FileText size={34} /></div>

            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
          </div>

          <h1 className="hero-title-animated">Securely Sharing, Tracking and Manage All Document</h1>
          <p className="hero-subtitle-animated">Share documents securely with real-time insights and control. All features free forever.</p>
          <div className="hero-actions">
            <Link to="/pricing">
              <button className="hero-btn-primary">Get Started Free</button>
            </Link>
            <Link to="/pricing">
              <button className="hero-btn-secondary">View Pricing</button>
            </Link>
          </div>

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
              className={`nav-item ${activeFeature === 'esignature' ? 'active' : ''}`}
              onClick={() => setActiveFeature('esignature')}
            >
              <PenTool size={18} /> Esignature
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
                border: '1px solid #f3f4f6',
                padding: '2rem'
              }}>
                <div style={{
                  width: '100%',
                  height: '400px',
                  border: '2px dashed #e2e8f0',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#ffffff',
                  transition: 'background-color 0.2s ease',
                  cursor: 'pointer'
                }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    backgroundColor: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '2rem'
                  }}>
                    <FileText size={56} color="#64748b" strokeWidth={1.5} />
                  </div>
                  <h3 style={{
                    fontSize: '1.6rem',
                    fontWeight: 600,
                    color: '#1e3a5f',
                    marginBottom: '1rem',
                    fontFamily: "'Inter', sans-serif"
                  }}>
                    Click to upload or drag and drop
                  </h3>
                  <p style={{
                    fontSize: '1.2rem',
                    color: '#94a3b8',
                    marginBottom: '0.8rem',
                    fontWeight: 400
                  }}>
                    Supports multiple files (Bundles)
                  </p>
                  <p style={{
                    fontSize: '1.2rem',
                    color: '#94a3b8',
                    fontWeight: 400
                  }}>
                    Maximum file size: 20 MB per file
                  </p>
                </div>
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
                      user: 'Anonymous User',
                      device: 'Chrome',
                      location: 'Patna, India',
                      ip: '106.214.9.54',
                      doc: 'Screenshot 2023-09-24 220453.png',
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
                      user: 'Anonymous User',
                      device: 'Chrome',
                      location: 'Patna, India',
                      ip: '106.214.9.54',
                      doc: 'Screenshot 2023-09-24 220453.png',
                      details: 'viewer_agent: Mozilla/5.0 (Windows NT 10.0; Win64;...'
                    },
                    {
                      date: 'Feb 16',
                      year: '2026',
                      eventIcon: Eye,
                      eventColor: '#3b82f6',
                      eventBg: '#dbeafe',
                      eventBorder: '#bfdbfe',
                      eventText: 'Document Viewed',
                      user: 'Anonymous User',
                      device: 'Chrome',
                      location: 'Patna, India',
                      ip: '106.214.9.54',
                      doc: 'Screenshot 2023-09-24 220453.png',
                      details: 'viewer_agent: Mozilla/5.0 (Windows NT 10.0; Win64;...'
                    },
                    {
                      date: 'Feb 16',
                      year: '2026',
                      eventIcon: FileText,
                      eventColor: '#a855f7',
                      eventBg: '#f3e8ff',
                      eventBorder: '#e9d5ff',
                      eventText: 'Document Uploaded',
                      user: 'Anonymous User',
                      device: 'Chrome',
                      location: 'Patna, India',
                      ip: '106.214.9.54',
                      doc: 'Screenshot 2023-09-24 220453.png',
                      details: 'bundleId: null, fileName: Screenshot 2023-09-24 22...'
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

            {activeFeature === 'esignature' && (
              <div className="dashboard-ui-mockup" style={{
                width: '100%',
                maxWidth: '960px',
                borderRadius: '16px',
                backgroundColor: '#f4f4f5',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                margin: '0 auto 6rem',
                position: 'relative',
                zIndex: 10,
                padding: '1.5rem',
                fontFamily: "'Inter', sans-serif"
              }}>
                {/* Header Navbar */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff',
                  padding: '1rem 1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <button style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.5rem 1rem',
                      color: '#4b5563', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer'
                    }}>
                      <ArrowLeft size={16} /> Back
                    </button>
                    <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb' }}></div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>Prepare Document</h3>
                  </div>

                  <button style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#4f46e5',
                    border: 'none', borderRadius: '8px', padding: '0.6rem 1.25rem',
                    color: '#ffffff', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3)'
                  }}>
                    <Send size={16} /> Send Request
                  </button>
                </div>

                {/* Main Content Area */}
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', height: '520px' }}>
                  {/* Left Sidebar - Drag Fields */}
                  <div style={{
                    width: '260px', backgroundColor: '#ffffff', borderRadius: '12px',
                    padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', position: 'relative',
                    boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)'
                  }}>
                    <h4 style={{ margin: '0 0 1.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.05em' }}>
                      DRAG FIELDS
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
                      {[
                        { label: 'Signature', icon: Type, bg: '#6b46c1', color: '#ffffff' },
                        { label: 'Initials', icon: Type, bg: '#8b5cf6', color: '#ffffff' },
                        { label: 'Date Signed', icon: Calendar, bg: '#059669', color: '#ffffff' },
                        { label: 'Text Box', icon: Type, bg: '#f59e0b', color: '#ffffff' },
                        { label: 'Checkbox', icon: CheckSquare, bg: '#ef4444', color: '#ffffff' },
                      ].map((field, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: '1rem',
                          padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px',
                          backgroundColor: '#ffffff', cursor: 'grab', boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                        }}>
                          <div style={{
                            width: '28px', height: '28px', borderRadius: '6px',
                            backgroundColor: field.bg, color: field.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <field.icon size={14} strokeWidth={2.5} />
                          </div>
                          <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#374151' }}>{field.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Fake scrollbar track */}
                    <div style={{ position: 'absolute', right: '0.5rem', top: '4rem', bottom: '1.5rem', width: '4px', backgroundColor: '#f1f5f9', borderRadius: '2px' }}>
                      <div style={{ width: '100%', height: '40%', backgroundColor: '#cbd5e1', borderRadius: '2px' }}></div>
                    </div>
                  </div>

                  {/* Right Content - Document */}
                  <div style={{
                    flex: 1, backgroundColor: '#ffffff', borderRadius: '12px',
                    padding: '3rem', position: 'relative', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
                    overflow: 'hidden'
                  }}>
                    <div style={{ maxWidth: '600px', margin: '0 auto', color: '#374151', lineHeight: '1.6', fontSize: '0.95rem' }}>
                      <p style={{ marginBottom: '1.25rem' }}>
                        JavaScript is used to add behaviour and interactivity to the web page. It is also possible to manipulate the web page using JavaScript.
                      </p>

                      <p style={{ marginBottom: '1.25rem' }}>
                        Simply we can say that JavaScript can manipulate the HTML & CSS of a web page, and this manipulation is done using <strong style={{ color: '#111827' }}>DOM (Document Object Model)</strong>.
                      </p>

                      <p style={{ marginBottom: '2.5rem' }}>
                        JavaScript <strong style={{ color: '#111827' }}>access the DOM to manipulate the web page</strong>. Using DOM, the JavaScript gets access to <strong style={{ color: '#111827' }}>HTML as well as CSS</strong> of the web page and can also add behaviour to the HTML elements.
                      </p>

                      <h2 style={{ color: '#b91c1c', fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
                        DOM(Document Object Model)
                      </h2>

                      <p style={{ marginBottom: '2.5rem' }}>
                        Document Object Model is an <strong style={{ color: '#111827' }}>API</strong> that represents and <strong style={{ color: '#111827' }}>interacts with HTML document</strong>. When a page is loaded, the browser creates the DOM for the web page. The DOM represents the document as a node tree, where each node represents part of the document. It can be an element, text, etc., just how that web page was written.
                      </p>

                      <h2 style={{ color: '#b91c1c', fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
                        API( Application programming interface )
                      </h2>

                      <p>
                        In simple terms, API is an easy way by which you can use code written by somebody else in your own code.
                      </p>
                    </div>

                    {/* Fake scrollbar track */}
                    <div style={{ position: 'absolute', right: '0.5rem', top: '1rem', bottom: '1rem', width: '6px', backgroundColor: '#f8fafc', borderRadius: '3px' }}>
                      <div style={{ width: '100%', height: '30%', backgroundColor: '#9ca3af', borderRadius: '3px', marginTop: '20%' }}></div>
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

       <footer className="footer">
        <div className="footer-content">
          <div className="footer-col">
            <div style={{ marginBottom: '1.5rem' }}>
              <Logo size={32} />
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '240px' }}>
              Secure document sharing and analytics for modern teams. Built for privacy and speed.
            </p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#security">Security</a></li>
              <li><a href="/pricing">Pricing</a></li>
              <li><a href="#">Enterprise</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                padding: '0.6rem',
                borderRadius: '12px',
                color: '#60a5fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Mail size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Email Support</div>
                <a href="mailto:roushan@doctransfer.online" style={{ color: 'white', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>
                  roushan@doctransfer.online
                </a>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '2rem' }}>
              <a
                href="https://x.com/Roushan71262"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '0.6rem',
                  borderRadius: '12px',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://www.instagram.com/doctransfer2227/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '0.6rem',
                  borderRadius: '12px',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.youtube.com/@doctransfer144"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '0.6rem',
                  borderRadius: '12px',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ff0000';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(255, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Youtube size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/doctransfer-0a2291314/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '0.6rem',
                  borderRadius: '12px',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#0077b5';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(0, 119, 181, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 DocTransfer Inc. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Cookies</a>
          </div>
        </div>
      </footer>
    </div >
  );
};

export default LandingPage;
