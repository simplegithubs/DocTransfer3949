import React from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight, FileCheck, ExternalLink } from 'lucide-react';

interface SignerCompletionBannerProps {
  documentName?: string;
  auditId?: string;
}

export const SignerCompletionBanner: React.FC<SignerCompletionBannerProps> = ({
  documentName = 'Document',
  auditId = 'DT-AUDIT-' + Math.random().toString(36).substring(2, 9).toUpperCase()
}) => {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        padding: '2.5rem 2rem',
        maxWidth: '580px',
        margin: '2rem auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#dcfce7',
          color: '#16a34a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto'
        }}
      >
        <CheckCircle2 size={32} />
      </div>

      <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
        Document Executed Successfully!
      </h2>
      <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.5 }}>
        Your signature on <strong>{documentName}</strong> has been sealed with SHA-256 cryptographic proof and timestamped audit logs compliant with ESIGN and eIDAS.
      </p>

      {/* Audit Box */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem'
        }}
      >
        <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <ShieldCheck size={16} color="#16a34a" /> Cryptographic Audit ID:
        </span>
        <code style={{ fontWeight: '700', color: '#0f172a', background: '#e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
          {auditId}
        </code>
      </div>

      {/* PLG Growth CTA */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          borderRadius: '16px',
          padding: '1.5rem',
          color: 'white',
          textAlign: 'left'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#c7d2fe', marginBottom: '0.25rem' }}>
          <Sparkles size={14} /> Need to collect signatures yourself?
        </div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0 0 0.5rem 0', color: 'white' }}>
          Get 100% Free Unlimited E-Signatures & Tracking
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#e0e7ff', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
          Send contracts, pitch decks, and proposals with second-by-second analytics and zero per-seat fees.
        </p>

        <a
          href="https://www.doctransfer.app/?utm_source=signature_complete&utm_medium=viral_card"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'white',
            color: '#4f46e5',
            padding: '0.7rem 1.25rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '0.85rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          Create Free DocTransfer Account <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
};

export default SignerCompletionBanner;
