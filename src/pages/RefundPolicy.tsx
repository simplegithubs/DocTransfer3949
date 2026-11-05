import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import {
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  HelpCircle,
  ShieldAlert,
  Ban,
  Clock,
  Mail,
  Zap,
  ArrowRight
} from 'lucide-react';

const RefundPolicy: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1d',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <SEO
        title="Refund & Cancellation Policy — No Money Back Policy | DocTransfer"
        description="DocTransfer maintains a strict No-Refund and No Money Back policy for Pro and Business plans. Explore all features risk-free with our 100% Free Plan before upgrading."
        keywords="DocTransfer refund policy, no money back policy, cancellation terms, SaaS no refund policy, Pro plan refund, Business plan cancellation"
        url="https://www.doctransfer.app/refund-policy"
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
        background: 'radial-gradient(circle at 50% 20%, rgba(239, 68, 68, 0.12) 0%, transparent 60%)'
      }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(248, 113, 113, 0.3)',
            padding: '0.35rem 0.95rem',
            borderRadius: '20px',
            color: '#f87171',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '1.25rem'
          }}>
            <Ban size={15} /> Strict No-Refund & Final Sale Policy
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 1rem', letterSpacing: '-0.02em', color: 'white' }}>
            Refund & Cancellation Policy
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

          {/* Core Notice Box: 100% Free Plan Available */}
          <div style={{
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(96, 165, 250, 0.25)',
            borderRadius: '14px',
            padding: '1.35rem 1.6rem',
            marginBottom: '2.5rem',
            color: '#e0e7ff'
          }}>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.4rem', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} /> Test Before You Upgrade: 100% Free Forever Plan
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#cbd5e1', lineHeight: '1.65' }}>
              DocTransfer provides a permanent <strong>Free Plan ($0/month)</strong> with no credit card required. This allows every user to fully evaluate our document sharing, page-by-page dwell tracking, password protection, and WhatsApp link sharing before committing to a paid tier. Because of this open evaluation model, all paid subscriptions are considered final sales.
            </p>
          </div>

          {/* Notice Box: Strict No Money Back */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(248, 113, 113, 0.25)',
            borderRadius: '14px',
            padding: '1.35rem 1.6rem',
            marginBottom: '2.5rem',
            color: '#fee2e2'
          }}>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.4rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={18} /> Strict No Money-Back / No-Refund Policy
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#fca5a5', lineHeight: '1.65' }}>
              <strong>All payments for DocTransfer Pro and Business plans are final and strictly non-refundable.</strong> There is <strong>no money-back guarantee</strong> for Pro ($25/month or $18/month annual) or Business ($59/month or $41/month annual) subscriptions once billed. Please ensure you have tested the Free tier and read our plan specifications prior to purchasing.
            </p>
          </div>

          <h2 style={{ color: 'white', fontSize: '1.35rem', marginTop: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            1. Strict No-Refund Policy for Paid Tiers
          </h2>
          <p>
            By subscribing to any paid plan on DocTransfer, including the <strong>Pro Plan</strong> and <strong>Business Plan</strong>, you explicitly acknowledge and agree that:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><strong>No Money-Back Guarantee:</strong> DocTransfer does not provide money-back guarantees, trial refund windows, or satisfaction-based refunds for any paid plan.</li>
            <li><strong>Immediate Feature Provisioning:</strong> Paid plan benefits (higher file limits, additional monthly links, multi-file sharing, video/image support, e-signatures, and analytics) are provisioned immediately upon successful payment confirmation.</li>
            <li><strong>No Prorated or Partial Refunds:</strong> We do not provide prorated, partial, or retroactive refunds if you cancel mid-billing cycle, if you downgrade to a lower tier, or if you do not use all your allotted links or storage during the period.</li>
            <li><strong>Annual Billing Commitments:</strong> Subscriptions purchased on an annual billing cycle receive a 30% upfront discount in exchange for a full 12-month commitment and are non-refundable in whole or in part.</li>
          </ul>

          <h2 style={{ color: 'white', fontSize: '1.35rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            2. Cancellation & Auto-Renewal Management
          </h2>
          <p>
            You have full control over your subscription at all times. You may cancel recurring billing at any point through your self-serve dashboard:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><strong>How to Cancel:</strong> Navigate to your <strong>Account Settings &rarr; Subscription</strong> and select <em>Cancel Subscription</em>. Alternatively, you may submit a cancellation request by emailing <a href="mailto:roushan@doctransfer.online" style={{ color: '#818cf8' }}>roushan@doctransfer.online</a> from your registered account email.</li>
            <li><strong>Timing of Cancellation:</strong> Cancellation must be completed at least 24 hours prior to your scheduled renewal date to prevent the next recurring charge.</li>
            <li><strong>Access Until Period End:</strong> Once cancelled, you will retain full access to your Pro or Business plan features until the end of your current paid billing period.</li>
            <li><strong>Automatic Downgrade to Free:</strong> At the conclusion of the paid billing period, your account will automatically downgrade to our permanent Free tier. Your existing documents will remain secure in accordance with our storage retention terms.</li>
          </ul>

          <h2 style={{ color: 'white', fontSize: '1.35rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            3. Exceptions for Verified Technical Billing Errors
          </h2>
          <p>
            While subscriptions are strictly non-refundable, DocTransfer will promptly investigate and correct verified technical anomalies, including:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><strong>Duplicate Charges:</strong> If our payment gateway accidentally processes duplicate transactions for the exact same billing period due to network timeout or gateway retry, the duplicate charge will be refunded upon verification.</li>
            <li><strong>Post-Cancellation Charges:</strong> If you successfully cancelled your subscription and received a cancellation confirmation, but were subsequently billed due to a server sync error, the erroneous charge will be refunded in full.</li>
            <li><strong>Reporting Window:</strong> You must notify our billing team at <a href="mailto:roushan@doctransfer.online" style={{ color: '#818cf8' }}>roushan@doctransfer.online</a> within <strong>48 hours</strong> of the transaction with proof of payment (transaction ID and invoice).</li>
          </ul>

          <h2 style={{ color: 'white', fontSize: '1.35rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            4. Chargebacks and Payment Disputes
          </h2>
          <p>
            We strive to maintain fair and transparent billing for all users. You agree to contact DocTransfer customer support at <a href="mailto:roushan@doctransfer.online" style={{ color: '#818cf8' }}>roushan@doctransfer.online</a> to resolve any billing question or discrepancy prior to filing a dispute or chargeback with your credit card issuer, bank, or payment provider (Razorpay / Stripe).
          </p>
          <p>
            If a chargeback or dispute is initiated for a legitimate, authorized transaction covered by this No-Refund Policy:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>DocTransfer reserves the right to immediately suspend or terminate access to your account and associated deal rooms.</li>
            <li>DocTransfer will submit complete evidence of account access, IP logs, page analytics, and accepted terms to the payment dispute processor.</li>
            <li>The account holder may be held liable for any dispute fees or chargeback processing costs incurred.</li>
          </ul>

          <h2 style={{ color: 'white', fontSize: '1.35rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            5. Contact Information & Billing Support
          </h2>
          <p>
            If you have questions regarding this Refund & Cancellation Policy, your current subscription, or plan upgrades, please contact our billing desk:
          </p>
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            marginTop: '1rem'
          }}>
            <div><strong>Company:</strong> DocTransfer Inc.</div>
            <div><strong>Billing Inquiries:</strong> <a href="mailto:roushan@doctransfer.online" style={{ color: '#818cf8' }}>roushan@doctransfer.online</a></div>
            <div><strong>Operating Hours:</strong> Monday – Saturday, 9:00 AM – 7:00 PM IST</div>
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
              <Link to="/terms" style={{ color: '#818cf8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
                Terms of Service &rarr;
              </Link>
              <Link to="/privacy" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
                Privacy Policy &rarr;
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

export default RefundPolicy;
