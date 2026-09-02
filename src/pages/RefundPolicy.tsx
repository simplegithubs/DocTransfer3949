import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import { CreditCard, CheckCircle2, ArrowLeft, RefreshCw, HelpCircle } from 'lucide-react';

const RefundPolicy: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1d',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <SEO
        title="Refund & Cancellation Policy | DocTransfer"
        description="Review DocTransfer's transparent refund, cancellation, and billing policies for our free core tier and premium enterprise data room upgrades."
        keywords="DocTransfer refund policy, cancellation policy, billing terms, money-back guarantee, SaaS refund policy"
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
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            padding: '0.35rem 0.9rem',
            borderRadius: '20px',
            color: '#fbbf24',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '1.25rem'
          }}>
            <CreditCard size={14} /> Transparent & Fair Billing Policy
          </div>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, margin: '0 0 1rem', letterSpacing: '-0.02em', color: 'white' }}>
            Refund & Cancellation Policy
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Last Updated: February 2026 • 100% Free Core Tier & Money-Back Guarantee
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
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            marginBottom: '2.5rem',
            color: '#d1fae5'
          }}>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} /> 100% Free Forever Core Tier
            </div>
            DocTransfer's core virtual data room, document link sharing, page tracking, and e-signature features are 100% free with no credit card required. You will never be charged unless you explicitly purchase a Pro add-on or dedicated custom enterprise infrastructure.
          </div>

          <h2 style={{ color: 'white', fontSize: '1.4rem', marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            1. 14-Day Money-Back Guarantee
          </h2>
          <p>
            If you subscribe to any paid Pro plan or enterprise tier and are not completely satisfied with our service, you may request a <strong>100% full refund within 14 days</strong> of your initial payment date. No questions asked.
          </p>

          <h2 style={{ color: 'white', fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            2. Cancellation Policy
          </h2>
          <p>
            You can cancel your paid subscription at any time directly from your account settings. Upon cancellation, your account will remain active on the paid plan until the end of your current billing period, after which it will automatically revert to our generous Free tier with zero billing.
          </p>

          <h2 style={{ color: 'white', fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            3. How to Request a Refund
          </h2>
          <p>To request a refund under our 14-day guarantee:</p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>Email our billing team at <a href="mailto:roushan@doctransfer.online" style={{ color: '#818cf8' }}>roushan@doctransfer.online</a> from your registered account email.</li>
            <li>Include your account email and transaction ID.</li>
            <li>Approved refunds are processed to your original payment method (UPI, NetBanking, Card) within <strong>5-7 business days</strong>.</li>
          </ul>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RefundPolicy;
