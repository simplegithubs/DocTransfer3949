import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import { Shield, Lock, FileText, CheckCircle2, Mail, Globe, ArrowLeft, ArrowRight } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1d',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <SEO
        title="Privacy Policy & DPDP Act 2023 Compliance | DocTransfer"
        description="Learn how DocTransfer protects your data with client-side Zero-Knowledge AES-256 encryption in compliance with the DPDP Act 2023, GDPR, and global data privacy standards."
        keywords="DocTransfer privacy policy, DPDP Act 2023 compliance, zero-knowledge privacy, data fiduciary policy, client-side encryption privacy"
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
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <Link to="/dataroom">
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
                Open Deal Room
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section style={{
        padding: '4.5rem 2rem 3rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            padding: '0.35rem 0.9rem',
            borderRadius: '20px',
            color: '#34d399',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '1.25rem'
          }}>
            <Shield size={14} /> DPDP Act 2023 & GDPR Compliant
          </div>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, margin: '0 0 1rem', letterSpacing: '-0.02em', color: 'white' }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Last Updated: February 2026 • Effective Date: January 1, 2026
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '0 2rem 6rem' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '2.5rem',
          color: '#cbd5e1',
          lineHeight: '1.8',
          fontSize: '0.98rem'
        }}>

          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            marginBottom: '2.5rem',
            color: '#e0e7ff'
          }}>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={18} /> Zero-Knowledge Architecture Commitment
            </div>
            DocTransfer is engineered so that when you use Vault Mode, your files are encrypted client-side in your browser using AES-256-GCM before transmission. <strong>DocTransfer does not hold your decryption keys and cannot read or inspect your confidential document contents.</strong>
          </div>

          <h2 style={{ color: 'white', fontSize: '1.4rem', marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            1. Overview & Data Fiduciary Details
          </h2>
          <p>
            This Privacy Policy describes how DocTransfer Inc. ("DocTransfer", "we", "us", or "our") processes, collects, and protects your information when you visit our website, utilize our virtual data rooms, generate digital signatures, and share files. We operate in strict adherence to the <strong>Digital Personal Data Protection (DPDP) Act 2023</strong> (India), the <strong>General Data Protection Regulation (GDPR)</strong> (EU/UK), and applicable global privacy statutes.
          </p>

          <h2 style={{ color: 'white', fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            2. Information We Collect
          </h2>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><strong>Account Information:</strong> Name, email address, password hashes, and organization profile provided during sign-up.</li>
            <li><strong>Document Metadata:</strong> File names, page counts, file sizes, and cryptographic document hashes (SHA-256) used for tamper-evident verification.</li>
            <li><strong>Viewer Interaction & Audit Logs:</strong> Access timestamps, page dwell time, IP addresses, browser types, and approximate geographic locations required for Section 65B court-admissible audit trails.</li>
            <li><strong>E-Signature Certificates:</strong> Signer email, digital signature drawing vector, IP address, and timestamp record.</li>
          </ul>

          <h2 style={{ color: 'white', fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            3. How We Use Information
          </h2>
          <p>We process collected data exclusively for:</p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>Providing, maintaining, and improving our secure deal rooms and analytics engine.</li>
            <li>Generating legally enforceable signature certificates under the Information Technology Act 2000.</li>
            <li>Enforcing document access controls (passcode gates, dynamic watermarking, and link expiration).</li>
            <li>Complying with statutory reporting, anti-fraud, and cybersecurity mandates.</li>
          </ul>

          <h2 style={{ color: 'white', fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            4. Data Retention & Burn After Reading
          </h2>
          <p>
            Documents shared under "Burn After Reading" mode are automatically purged from our servers immediately following the designated number of views. Standard files remain in your vault until you explicitly delete them or your link expiration timer triggers. Audit logs are preserved for dispute resolution and legal evidentiary compliance.
          </p>

          <h2 style={{ color: 'white', fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            5. Data Principal Rights (DPDP Act & GDPR)
          </h2>
          <p>As a Data Principal, you have the right to:</p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><strong>Right to Access:</strong> Request a summary of your personal data processed by us.</li>
            <li><strong>Right to Correction & Erasure:</strong> Request modification or deletion of personal data no longer necessary for statutory purposes.</li>
            <li><strong>Right to Grievance Redressal:</strong> File a grievance regarding any data processing concern.</li>
            <li><strong>Right to Nominate:</strong> Nominate an individual to exercise rights on your behalf in the event of incapacity.</li>
          </ul>

          <h2 style={{ color: 'white', fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            6. Grievance Officer & Contact (IT Rules 2021)
          </h2>
          <p>
            In accordance with the Information Technology Act 2000 and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules 2021, the contact details of our Grievance Officer are:
          </p>
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginTop: '1rem'
          }}>
            <div><strong>Grievance Officer:</strong> Roushan Kumar</div>
            <div><strong>Designation:</strong> Head of Compliance & Data Protection</div>
            <div><strong>Email:</strong> <a href="mailto:roushan@doctransfer.online" style={{ color: '#818cf8' }}>roushan@doctransfer.online</a></div>
            <div><strong>Response Time:</strong> Within 24-48 hours of receipt</div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
