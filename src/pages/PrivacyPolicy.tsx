import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import {
  Shield,
  Lock,
  FileText,
  CheckCircle2,
  Mail,
  Globe,
  ArrowLeft,
  ArrowRight,
  Eye,
  Server,
  UserCheck,
  CreditCard,
  Key,
  Scale
} from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1d',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <SEO
        title="Privacy Policy & Global Data Protection (GDPR, UAE PDPL, DPDP Act 2023, CCPA) | DocTransfer"
        description="Learn how DocTransfer protects confidential documents with client-side Zero-Knowledge AES-256 encryption in compliance with the EU GDPR, UAE Federal Decree-Law No. 45/2021, DIFC/ADGM rules, DPDP Act 2023, and CCPA."
        keywords="DocTransfer privacy policy, GDPR compliance, UAE PDPL, DIFC data protection, ADGM, DPDP Act 2023, zero-knowledge encryption, client-side encryption, cross-border data transfer, SCCs, viewer analytics privacy"
        url="https://www.doctransfer.app/privacy"
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
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Logo size={28} light={true} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.2s' }}>
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <Link to="/pricing">
              <button style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}>
                View Pricing
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section style={{
        padding: '4.5rem 2rem 3rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.12) 0%, transparent 60%)'
      }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            padding: '0.35rem 0.95rem',
            borderRadius: '20px',
            color: '#34d399',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '1.25rem'
          }}>
            <Shield size={14} /> GDPR (EU/UK), UAE PDPL, DIFC/ADGM & Global Standards Compliant
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 1rem', letterSpacing: '-0.02em', color: 'white' }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.6', maxWidth: '650px', margin: '0 auto' }}>
            Last Updated: February 2026 • Effective Date: January 1, 2026
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '0 2rem 6rem' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '2.5rem',
          color: '#cbd5e1',
          lineHeight: '1.8',
          fontSize: '0.98rem'
        }}>

          {/* Zero-Knowledge Commitment Banner */}
          <div style={{
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(129, 140, 248, 0.25)',
            borderRadius: '14px',
            padding: '1.35rem 1.6rem',
            marginBottom: '2.5rem',
            color: '#e0e7ff'
          }}>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.4rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={18} /> Zero-Knowledge Architecture Commitment
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#cbd5e1', lineHeight: '1.65' }}>
              DocTransfer is engineered so that when you utilize <strong>Vault Mode</strong>, your files are encrypted on your local client machine before transmission using AES-256-GCM encryption. <strong>DocTransfer does not hold your decryption keys and cannot read, inspect, or decrypt your confidential document contents.</strong>
            </p>
          </div>

          <h2 style={{ color: 'white', fontSize: '1.35rem', marginTop: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            1. Overview & Multi-Jurisdictional Framework
          </h2>
          <p>
            This Privacy Policy details how DocTransfer Inc. ("DocTransfer", "we", "us", or "our") collects, uses, processes, and protects personal data and confidential materials when you access our website, utilize our document sharing engine and virtual deal rooms, and interact with our viewer analytics.
          </p>
          <p>
            We operate in strict adherence to primary international data privacy statutes across our operational regions:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><strong>European Union & United Kingdom:</strong> General Data Protection Regulation (Regulation (EU) 2016/679 - GDPR) and the UK Data Protection Act 2018 (UK GDPR).</li>
            <li><strong>United Arab Emirates & Middle East:</strong> UAE Federal Decree-Law No. 45/2021 on Personal Data Protection (UAE PDPL), Dubai International Financial Centre Data Protection Law (DIFC Law No. 5 of 2020), and Abu Dhabi Global Market Data Protection Regulations 2021 (ADGM).</li>
            <li><strong>Asia-Pacific:</strong> Singapore Personal Data Protection Act 2012 (PDPA) and Hong Kong Personal Data (Privacy) Ordinance (PDPO).</li>
            <li><strong>India:</strong> Digital Personal Data Protection (DPDP) Act 2023 and Information Technology Act 2000.</li>
            <li><strong>United States:</strong> California Consumer Privacy Act as amended by the California Privacy Rights Act (CCPA/CPRA).</li>
          </ul>

          <h3 style={{ color: '#e2e8f0', fontSize: '1.15rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            Legal Bases for Processing (GDPR Art. 6 & UAE PDPL Art. 4)
          </h3>
          <p>
            We process your personal information only when lawful legal grounds exist:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><strong>Contractual Performance:</strong> Processing necessary to provide link creation, deal rooms, access authentication, and billing.</li>
            <li><strong>Legitimate Interests:</strong> Processing necessary to protect document senders against unauthorized leakage, detect fraudulent activity, maintain security audit logs, and prevent unauthorized scraping.</li>
            <li><strong>Legal Compliance:</strong> Satisfying statutory recordkeeping, tax compliance, and anti-fraud mandates.</li>
            <li><strong>Consent:</strong> Where you have granted explicit consent, such as opting into lead capture alerts or optional notifications.</li>
          </ul>

          <h2 style={{ color: 'white', fontSize: '1.35rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            2. Information We Collect
          </h2>
          <p>We collect only the information strictly necessary to provide secure document sharing and verification services:</p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>
              <strong>Account Information:</strong> Full name, verified email address, organization name, and encrypted authentication tokens.
            </li>
            <li>
              <strong>Document Metadata:</strong> File name, file format, page count, file size, and cryptographic SHA-256 checksums used to guarantee document integrity. Unencrypted file contents in Vault Mode are never accessible to DocTransfer.
            </li>
            <li>
              <strong>Viewer Analytics & Forensics:</strong> When recipients open a document link, we log access timestamps, per-page dwell time, completion percentages, viewer IP address, country/region, browser type, and operating system. This data powers our page-by-page analytics, forensic watermarking, and tamper-evident audit trails.
            </li>
            <li>
              <strong>Recipient Verification Information:</strong> When document senders enforce Email Verification or Mobile Number Gates (supporting +971, +44, +1, +65, +33, +91), we process the recipient’s input email or mobile number strictly to deliver one-time verification passcodes (OTP) and record authorized access.
            </li>
            <li>
              <strong>Payment & Billing Data:</strong> When subscribing to paid tiers, payments are processed directly by certified Level 1 PCI-DSS payment gateways (Stripe, Razorpay). DocTransfer <strong>never stores full credit card numbers, CVVs, or bank credentials</strong> on its servers.
            </li>
          </ul>

          <h2 style={{ color: 'white', fontSize: '1.35rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            3. Purpose of Processing
          </h2>
          <p>DocTransfer processes your personal and document data exclusively to:</p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>Operate, maintain, and deliver secure document link sharing, virtual deal rooms, and dwell analytics.</li>
            <li>Enforce sender-configured security controls, including passcode gates, download restrictions, and dynamic anti-leak watermarks.</li>
            <li>Generate tamper-evident, court-admissible audit trails for cross-border transactions and investor diligence.</li>
            <li>Facilitate instant link sharing to external communication channels (e.g., WhatsApp, Email).</li>
            <li>Process plan subscriptions, calculate applicable local taxes (VAT, GST), and prevent fraudulent abuse.</li>
          </ul>

          <h2 style={{ color: 'white', fontSize: '1.35rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            4. Cross-Border Data Transfers & Standard Contractual Clauses (SCCs)
          </h2>
          <p>
            DocTransfer serves customers across Dubai/UAE, Europe, North America, and Asia. When personal data originates within the European Economic Area (EEA), United Kingdom, or UAE and is processed globally:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>
              <strong>Standard Contractual Clauses:</strong> We execute the European Commission’s Standard Contractual Clauses (SCCs) and UK International Data Transfer Addendum to safeguard cross-border transfers in compliance with Chapter V of the GDPR.
            </li>
            <li>
              <strong>UAE PDPL Compliance:</strong> In accordance with Articles 22 and 23 of UAE Federal Decree-Law No. 45/2021, transfers of personal data outside the UAE are conducted under approved contractual guarantees ensuring an adequate level of statutory data protection.
            </li>
            <li>
              <strong>Technical Measures:</strong> All data in transit is encrypted using TLS 1.3 with forward secrecy. Data at rest is encrypted using AES-256 standards, with zero-knowledge keys isolated to client devices in Vault Mode.
            </li>
          </ul>

          <h2 style={{ color: 'white', fontSize: '1.35rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            5. Data Retention, Auto-Purge & Burn After Reading
          </h2>
          <p>
            We retain information only as long as required to deliver our services or fulfill statutory legal requirements:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><strong>Burn After Reading:</strong> Documents configured with self-destruct or "Burn After Reading" modes are permanently purged from active storage immediately following the configured view threshold.</li>
            <li><strong>Standard Files:</strong> Documents remain available in your account until you delete them or your link expiration timer triggers.</li>
            <li><strong>Audit Logs:</strong> Security audit logs and viewer dwell timestamps are retained for the duration of the sender’s active subscription to provide historical diligence records.</li>
          </ul>

          <h2 style={{ color: 'white', fontSize: '1.35rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            6. Data Subject Rights (GDPR, UAE PDPL, DPDP Act & CCPA)
          </h2>
          <p>
            Depending on your jurisdiction, you possess the following statutory rights regarding your personal data:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><strong>Right to Access (GDPR Art. 15 / UAE PDPL Art. 13):</strong> You may request confirmation of whether we process your personal data and obtain a copy in an accessible format.</li>
            <li><strong>Right to Rectification (GDPR Art. 16 / UAE PDPL Art. 14):</strong> You may request correction of inaccurate, incomplete, or outdated personal information.</li>
            <li><strong>Right to Erasure / "To Be Forgotten" (GDPR Art. 17 / UAE PDPL Art. 15):</strong> You may request the deletion of your personal data where retention is no longer necessary or lawful.</li>
            <li><strong>Right to Restriction of Processing (GDPR Art. 18 / UAE PDPL Art. 16):</strong> You may request the restriction of processing under contested accuracy or verification periods.</li>
            <li><strong>Right to Data Portability (GDPR Art. 20):</strong> You may request an export of your account information in a structured, commonly used, machine-readable format.</li>
            <li><strong>Right to Object (GDPR Art. 21 / UAE PDPL Art. 18):</strong> You may object at any time to the processing of your personal data based on legitimate interests or automated evaluation.</li>
            <li><strong>Right to Withdraw Consent:</strong> Where processing is predicated on consent, you may withdraw your consent at any time without retroactive invalidation.</li>
            <li><strong>Right to Lodge a Complaint:</strong> You have the right to lodge a complaint with your competent supervisory authority (e.g., your national EU Data Protection Authority, the UK Information Commissioner's Office, or the UAE Data Office).</li>
            <li><strong>No Sale of Personal Data:</strong> DocTransfer does not sell, rent, or trade your personal data or document materials to any third party or data aggregator.</li>
          </ul>

          <h2 style={{ color: 'white', fontSize: '1.35rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            7. Cookies & Tracking Technologies
          </h2>
          <p>
            DocTransfer utilizes strictly necessary first-party cookies to manage secure session state, maintain authentication, and preserve user preferences (e.g., billing cycle and currency selection). We do not deploy intrusive third-party cross-site advertising pixels or sell viewer behavioral tracking to ad networks.
          </p>

          <h2 style={{ color: 'white', fontSize: '1.35rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            8. Data Protection Officer (DPO) & Regulatory Inquiries
          </h2>
          <p>
            For privacy inquiries, Data Subject Access Requests (DSARs), or regulatory communications under GDPR, UAE PDPL, or the DPDP Act, please reach our dedicated compliance desk:
          </p>
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            marginTop: '1rem'
          }}>
            <div><strong>Data Protection Officer (DPO):</strong> Roushan Kumar</div>
            <div><strong>Department:</strong> Global Privacy & Data Protection Office</div>
            <div><strong>Email:</strong> <a href="mailto:privacy@doctransfer.online" style={{ color: '#818cf8' }}>privacy@doctransfer.online</a></div>
            <div><strong>Company:</strong> DocTransfer Inc.</div>
            <div><strong>International Response SLA:</strong> Initial response within 48 hours; substantive resolution within 30 calendar days in compliance with GDPR Art. 12 and UAE PDPL mandates.</div>
          </div>

          {/* Quick links to other legal pages */}
          <div style={{
            marginTop: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
              Related Legal Agreements:
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <Link to="/terms" style={{ color: '#818cf8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
                Terms of Service &rarr;
              </Link>
              <Link to="/refund-policy" style={{ color: '#f87171', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
                Refund Policy &rarr;
              </Link>
              <Link to="/pricing" style={{ color: '#34d399', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
                Pricing Plans &rarr;
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
