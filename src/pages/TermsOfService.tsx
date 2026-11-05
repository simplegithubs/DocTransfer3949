import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import {
  FileText,
  CheckCircle2,
  Shield,
  ArrowLeft,
  CreditCard,
  Ban,
  Lock,
  Scale,
  AlertCircle,
  HelpCircle,
  Clock,
  Mail,
  Zap,
  Globe
} from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1d',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <SEO
        title="Terms of Service — Global Legal Terms, Neutral Arbitration & No-Refund Policy | DocTransfer"
        description="Review the terms, subscription billing, international arbitration framework, and legal standards governing DocTransfer virtual data rooms and document tracking."
        keywords="DocTransfer terms of service, international arbitration, SaaS agreement, GDPR compliance, eIDAS, UAE e-commerce law, no refund policy"
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
        background: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)'
      }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(129, 140, 248, 0.3)',
            padding: '0.35rem 0.95rem',
            borderRadius: '20px',
            color: '#818cf8',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '1.25rem'
          }}>
            <Scale size={14} /> Legally Enforceable Under Global Frameworks (GDPR, UAE, US & International Law)
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 1rem', letterSpacing: '-0.02em', color: 'white' }}>
            Terms of Service
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

          {/* Quick Summary Highlights Box */}
          <div style={{
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: '14px',
            padding: '1.35rem 1.6rem',
            marginBottom: '2.5rem',
            color: '#e0e7ff'
          }}>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.4rem', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} /> Essential Terms Summary
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#cbd5e1', lineHeight: '1.65' }}>
              These Terms constitute a legally binding agreement between you and DocTransfer Inc. We provide secure document link sharing, virtual deal rooms, and viewer analytics. Please note that paid subscriptions (<strong>Pro Plan</strong> and <strong>Business Plan</strong>) are subject to a strict <strong>No-Refund / No Money Back Policy</strong>, as all prospective subscribers may test core capabilities on our permanent Free tier before subscribing.
            </p>
          </div>

          <h2 style={{ color: 'white', fontSize: '1.35rem', marginTop: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            1. Acceptance of Terms & Eligibility
          </h2>
          <p>
            By creating an account, accessing, browsing, or utilizing the services provided by DocTransfer Inc. ("DocTransfer", "we", "us", or "our"), you agree to be bound by these Terms of Service and our related policies. If you are entering into these terms on behalf of a company, partnership, or legal entity, you represent and warrant that you possess lawful authority to bind that entity to these Terms. If you do not agree with any part of these Terms, you must immediately discontinue use of the platform.
          </p>

          <h2 style={{ color: 'white', fontSize: '1.35rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            2. Service Description & Subscription Plans
          </h2>
          <p>
            DocTransfer provides enterprise document link sharing, virtual deal rooms, dynamic anti-leak watermarking, page-by-page dwell tracking, and access security controls. The service is available across three primary tiers:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>
              <strong>Free Plan ($0/month):</strong> Includes 10 file link shares per month, 10 documents, 5MB file size limit per document, <strong>PDF format only</strong>, single-file per share link, unlimited visitors, page-by-page dwell tracking, 1-click WhatsApp sharing, and password protection. Advanced features (Audit trail, analytics dashboard, image/video support, and multi-file bundle links) are locked.
            </li>
            <li>
              <strong>Pro Plan ($25/month or $18/month annual):</strong> Includes 100 file link shares per month, 100 documents, 20MB file size limit per document, multi-file bundle sharing, support for <strong>PDF, images, and videos</strong>, full audit trails, analytics dashboard, and dynamic recipient watermarking.
            </li>
            <li>
              <strong>Business Plan ($59/month or $41/month annual):</strong> Includes 1,000 file link shares per month, 1,000 documents, 100MB file size limit per document, all Pro features unlocked, dedicated deal rooms, team collaboration features, and priority support.
            </li>
          </ul>

          <h2 style={{ color: 'white', fontSize: '1.35rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            3. Subscription Fees, Multi-Currency Billing & Strict No-Refund Policy
          </h2>
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(248, 113, 113, 0.25)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1rem'
          }}>
            <strong style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <Ban size={16} /> Strict No Money-Back / No-Refund Policy
            </strong>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#fee2e2', lineHeight: '1.6' }}>
              All fees and charges paid for DocTransfer Pro and Business subscriptions are <strong>100% non-refundable</strong>. Because DocTransfer provides a permanent Free plan that enables prospective subscribers to thoroughly test document sharing, WhatsApp integration, and viewer tracking without entering credit card details, <strong>we do not offer money-back guarantees, trial refund periods, or prorated refunds</strong> for mid-cycle cancellations or unused allowances.
            </p>
          </div>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><strong>Recurring Billing:</strong> Paid subscriptions automatically renew on a recurring monthly or annual basis unless cancelled at least 24 hours prior to the next renewal billing date.</li>
            <li><strong>Cancellation:</strong> You may cancel your subscription at any time via your self-serve dashboard (<em>Settings &rarr; Subscription &rarr; Cancel</em>). Upon cancellation, your paid plan remains active through the conclusion of your current billing period, after which the account automatically downgrades to the Free tier.</li>
            <li><strong>International Taxes & Invoicing:</strong> Fees are quoted exclusive of statutory indirect taxes. Depending on your billing jurisdiction, statutory taxes (including EU/UK VAT with reverse-charge support, UAE VAT at 5%, US state sales taxes, or Indian GST) will be itemized at checkout. Corporate customers may enter their verified Tax ID (such as EU VAT ID, UAE TRN, or GSTIN) to obtain compliant tax invoices.</li>
            <li><strong>Payment Gateways:</strong> Transactions are securely processed through Level 1 PCI-DSS certified payment processors (Stripe, Razorpay). DocTransfer does not store full credit card numbers or sensitive banking credentials.</li>
          </ul>

          <h2 style={{ color: 'white', fontSize: '1.35rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            4. Zero-Knowledge Architecture & Encryption Keys
          </h2>
          <p>
            DocTransfer incorporates client-side Zero-Knowledge AES-256-GCM encryption in Vault Mode. Under this architecture, cryptographic keys are derived locally within your browser before any ciphertext is transmitted to cloud storage. You acknowledge and accept that:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>DocTransfer does not hold, store, or escrow your client-side private encryption keys or passphrases.</li>
            <li>If you lose or forget your encryption passphrase, <strong>DocTransfer cannot recover, reset, or decrypt your encrypted documents</strong>. DocTransfer shall have zero liability for any data loss resulting from forgotten user passphrases.</li>
          </ul>

          <h2 style={{ color: 'white', fontSize: '1.35rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            5. Cross-Border Document Admissibility & Evidentiary Standards
          </h2>
          <p>
            DocTransfer's cryptographic link generation, viewer verification records, and audit logs are designed to comply with statutory electronic record and evidentiary standards across major international jurisdictions:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><strong>United Arab Emirates & GCC:</strong> Federal Decree-Law No. 46/2021 on Electronic Transactions and Trust Services (UAE E-Commerce Law).</li>
            <li><strong>European Union & United Kingdom:</strong> Regulation (EU) No 910/2014 (eIDAS Regulation) and the UK Electronic Communications Act 2000.</li>
            <li><strong>United States:</strong> The Electronic Signatures in Global and National Commerce Act (ESIGN Act, 15 U.S.C. § 7001) and Uniform Electronic Transactions Act (UETA).</li>
            <li><strong>Singapore & Asia-Pacific:</strong> Singapore Electronic Transactions Act (Cap. 88 - ETA) and Hong Kong Electronic Transactions Ordinance (Cap. 553).</li>
            <li><strong>India:</strong> Section 5 and Section 10A of the Information Technology Act 2000 and Section 65B of the Indian Evidence Act.</li>
          </ul>
          <p style={{ marginTop: '0.75rem' }}>
            Each interaction generates forensic timestamp and IP hash logs capturing document access, dwell time, and verification events. DocTransfer is a software infrastructure provider and does not provide formal legal representation or advice.
          </p>

          <h2 style={{ color: 'white', fontSize: '1.35rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            6. User Content & Intellectual Property
          </h2>
          <p>
            <strong>Your Content Remains 100% Yours:</strong> You retain complete ownership, copyright, and title to all documents, pitch decks, contracts, videos, and media files uploaded to DocTransfer. DocTransfer claims zero ownership or intellectual property rights over your content.
          </p>
          <p>
            <strong>DocTransfer Proprietary Rights:</strong> DocTransfer and its licensors retain all rights, title, and interest in the DocTransfer application, user interface, software source code, trademarks, and algorithms.
          </p>

          <h2 style={{ color: 'white', fontSize: '1.35rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            7. Acceptable Use Policy & Global Sanctions
          </h2>
          <p>You agree not to use DocTransfer to:</p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>Upload or distribute content that infringes any patent, copyright, trademark, trade secret, or privacy right.</li>
            <li>Transmit malicious code, trojans, ransomware, spyware, or security penetration payloads.</li>
            <li>Conduct phishing campaigns, fraudulent investment solicitations, or deceptive credential harvesting.</li>
            <li>Circumvent or attempt to reverse-engineer document access restrictions, rate limits, or watermarks.</li>
            <li>Violate applicable local, national, or international economic sanctions, trade embargoes, or export control regulations (including those administered by the UN Security Council, US OFAC, the European Union, and UAE authorities).</li>
          </ul>
          <p style={{ marginTop: '0.75rem' }}>
            Violation of this section may lead to immediate suspension or termination of your account without notice or refund.
          </p>

          <h2 style={{ color: 'white', fontSize: '1.35rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            8. Limitation of Liability & Disclaimers
          </h2>
          <p>
            To the maximum extent permitted under applicable law, DocTransfer is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express, statutory, or implied.
          </p>
          <p>
            In no event shall DocTransfer, its founders, officers, employees, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, goodwill, or business interruption. DocTransfer's total cumulative liability arising out of or related to these Terms or use of the service shall in no case exceed the total fees actually paid by you to DocTransfer in the twelve (12) months preceding the event giving rise to liability.
          </p>

          <h2 style={{ color: 'white', fontSize: '1.35rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            9. Governing Law & Neutral International Arbitration
          </h2>
          <p>
            <strong>Informal Resolution:</strong> In the event of any controversy, dispute, or claim arising out of or relating to these Terms, the parties agree to first attempt in good faith to resolve the matter informally for a period of not less than thirty (30) days from written notification.
          </p>
          <p>
            <strong>Neutral International Arbitration (For Customers Outside India):</strong> For all users and corporate customers residing or incorporated outside the Republic of India (including customers in Dubai/UAE, the European Union, the United Kingdom, Singapore, the United States, and elsewhere):
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Any dispute, controversy, or claim arising out of or relating to this agreement shall be referred to and finally resolved by binding commercial arbitration administered under the <strong>Rules of Arbitration of the International Chamber of Commerce (ICC)</strong> or the <strong>Singapore International Arbitration Centre (SIAC)</strong>.</li>
            <li><strong>Seat of Arbitration:</strong> The seat of arbitration shall be Singapore or Dubai (DIFC) as a neutral international commercial arbitration forum.</li>
            <li><strong>Language & Tribunal:</strong> The arbitration proceedings shall be conducted entirely in English before a single neutral arbitrator appointed in accordance with the applicable rules.</li>
            <li><strong>Enforceability:</strong> The arbitral award shall be final, non-appealable, and binding on both parties, enforceable in any court of competent jurisdiction under the 1958 New York Convention on the Recognition and Enforcement of Foreign Arbitral Awards.</li>
          </ul>
          <p style={{ marginTop: '0.75rem' }}>
            <strong>Domestic Indian Customers:</strong> For users residing or incorporated within India, these Terms shall be governed by the laws of India, and disputes shall be resolved through binding arbitration in New Delhi under the Arbitration and Conciliation Act 1996.
          </p>
          <p style={{ marginTop: '0.75rem' }}>
            <strong>Class Action Waiver:</strong> You and DocTransfer agree that any dispute resolution proceedings will be conducted solely on an individual basis and not in a class, consolidated, or representative action.
          </p>

          <h2 style={{ color: 'white', fontSize: '1.35rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            10. Legal Notices & Compliance Desk
          </h2>
          <p>
            For legal notices, service queries, or terms clarification, please contact our global compliance desk:
          </p>
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            marginTop: '1rem'
          }}>
            <div><strong>Company:</strong> DocTransfer Inc.</div>
            <div><strong>Global Legal & Compliance Desk:</strong> <a href="mailto:privacy@doctransfer.online" style={{ color: '#818cf8' }}>privacy@doctransfer.online</a></div>
            <div><strong>Compliance Officer:</strong> Roushan Kumar</div>
            <div><strong>Response Time:</strong> Within 24-48 business hours</div>
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
              <Link to="/privacy" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
                Privacy Policy &rarr;
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

export default TermsOfService;
