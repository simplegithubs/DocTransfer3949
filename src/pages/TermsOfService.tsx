import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import { FileText, CheckCircle2, Shield, ArrowLeft } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1d',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <SEO
        title="Terms of Service | DocTransfer"
        description="Review the terms, conditions, and legal framework governing the use of DocTransfer's virtual data rooms, document tracking, and IT Act 2000 compliant e-signatures."
        keywords="DocTransfer terms of service, legal terms, e-signature agreement terms, virtual data room terms of use, IT Act 2000 agreement"
        url="https://www.doctransfer.app/terms"
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
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(129, 140, 248, 0.3)',
            padding: '0.35rem 0.9rem',
            borderRadius: '20px',
            color: '#818cf8',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '1.25rem'
          }}>
            <FileText size={14} /> Legally Enforceable Under Indian Law
          </div>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, margin: '0 0 1rem', letterSpacing: '-0.02em', color: 'white' }}>
            Terms of Service
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Last Updated: February 2026 • Governed under the Indian Contract Act 1872 & IT Act 2000
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

          <h2 style={{ color: 'white', fontSize: '1.4rem', marginTop: '1rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing, browsing, or utilizing the services provided by DocTransfer Inc. ("DocTransfer", "we", "us"), you agree to be bound by these Terms of Service. If you are entering into these terms on behalf of a company, organization, or firm, you represent that you possess lawful authority to bind that entity.
          </p>

          <h2 style={{ color: 'white', fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            2. Description of Service & Zero-Knowledge Protocol
          </h2>
          <p>
            DocTransfer provides document sharing, virtual deal rooms, dynamic watermarking, page analytics, and electronic signature workflows. In Vault Mode, encryption keys are derived on the user's client machine. You acknowledge that DocTransfer cannot recover encrypted content if you lose your private encryption passphrase or keys.
          </p>

          <h2 style={{ color: 'white', fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            3. E-Signatures & Section 65B Electronic Evidence
          </h2>
          <p>
            Electronic signatures executed via DocTransfer are valid and legally binding under Section 5 and Section 10A of the Information Technology Act 2000 and the Indian Contract Act 1872. Each completed transaction generates a cryptographic audit record intended to meet admissibility standards under Section 65B of the Indian Evidence Act.
          </p>

          <h2 style={{ color: 'white', fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            4. User Conduct & Acceptable Use
          </h2>
          <p>You agree not to upload, transmit, or share content that:</p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>Infringes any patent, trademark, copyright, or trade secret.</li>
            <li>Contains malicious code, viruses, spyware, or destructive exploits.</li>
            <li>Violates Indian statutory laws, public order, or national security regulations.</li>
            <li>Constitutes unlawful stalking, harassment, or unauthorized commercial spam.</li>
          </ul>

          <h2 style={{ color: 'white', fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            5. Intellectual Property & Ownership
          </h2>
          <p>
            You retain 100% ownership, title, and copyright in all documents, pitch decks, contracts, and media uploaded to DocTransfer. DocTransfer retains all rights, title, and interest in the DocTransfer software, user interface, brand assets, and technology.
          </p>

          <h2 style={{ color: 'white', fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            6. Governing Law & Dispute Resolution
          </h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India. Any dispute, controversy, or claim arising out of or relating to these Terms shall be resolved by binding arbitration in accordance with the Arbitration and Conciliation Act 1996.
          </p>

          <h2 style={{ color: 'white', fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            7. Contact & Notices
          </h2>
          <p>
            For legal notices, service queries, or terms clarification, please contact: <a href="mailto:roushan@doctransfer.online" style={{ color: '#818cf8' }}>roushan@doctransfer.online</a>.
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
