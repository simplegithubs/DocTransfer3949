import React from 'react';
import { Lock, Eye, Flame, ShieldCheck, PenTool } from 'lucide-react';

interface USPSecurityBannerProps {
  title?: string;
  subtitle?: string;
}

const USPSecurityBanner: React.FC<USPSecurityBannerProps> = ({
  title = "Powered by Enterprise Security & Page Analytics",
  subtitle = "DocTransfer combines zero-knowledge encryption, page-by-page engagement tracking, and legally binding e-signatures into one unified platform."
}) => {
  const usps = [
    {
      icon: Lock,
      color: '#3b82f6',
      bgColor: '#eff6ff',
      title: 'Zero-Knowledge Vault Mode',
      desc: 'Client-side AES-256 browser encryption. Only authorized key holders can decrypt files.'
    },
    {
      icon: Eye,
      color: '#8b5cf6',
      bgColor: '#f5f3ff',
      title: 'Page-Level Analytics',
      desc: 'Track exact viewing duration down to the second per page with instant drop-off metrics.'
    },
    {
      icon: ShieldCheck,
      color: '#10b981',
      bgColor: '#ecfdf5',
      title: 'Forensic Watermarking',
      desc: 'Dynamic overlay of recipient email, IP address, and timestamp to prevent leaks.'
    },
    {
      icon: Flame,
      color: '#f59e0b',
      bgColor: '#fffbeb',
      title: 'Burn-After-Reading',
      desc: 'Self-destructing links automatically purge documents after specified views or timeouts.'
    },
    {
      icon: PenTool,
      color: '#ec4899',
      bgColor: '#fdf2f8',
      title: 'Legally Binding E-Sign',
      desc: 'Compliant with US ESIGN, UETA, and EU eIDAS with cryptographically sealed audit logs.'
    }
  ];

  return (
    <section style={{
      margin: '4rem 0',
      padding: '3rem 2rem',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      borderRadius: '24px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.03)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
          {title}
        </h2>
        <p style={{ fontSize: '1.05rem', color: '#64748b', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
          {subtitle}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem'
      }}>
        {usps.map((usp, idx) => {
          const Icon = usp.icon;
          return (
            <div key={idx} style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: usp.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: usp.color
              }}>
                <Icon size={22} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                {usp.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                {usp.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default USPSecurityBanner;
