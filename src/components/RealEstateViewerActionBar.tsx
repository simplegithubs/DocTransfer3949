import React, { useState } from 'react';
import { MessageCircle, Calculator, Maximize2, X, ChevronUp, ChevronDown, Building, Sparkles } from 'lucide-react';

interface RealEstateViewerActionBarProps {
  documentName?: string;
  brokerPhone?: string;
}

export const RealEstateViewerActionBar: React.FC<RealEstateViewerActionBarProps> = ({
  documentName = 'Property Document',
  brokerPhone
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const handleWhatsAppClick = () => {
    const defaultMsg = `Hi! I am currently viewing "${documentName}" on DocTransfer and would like more details regarding pricing, availability, and scheduling a site visit.`;
    const targetNumber = brokerPhone ? brokerPhone.replace(/[^0-9]/g, '') : '';
    const url = targetNumber
      ? `https://api.whatsapp.com/send?phone=${targetNumber}&text=${encodeURIComponent(defaultMsg)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(defaultMsg)}`;

    window.open(url, '_blank');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        left: '1.25rem',
        zIndex: 9998,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#065f46',
            color: '#ffffff',
            border: '1px solid #10b981',
            borderRadius: '9999px',
            padding: '8px 16px',
            fontSize: '0.825rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.2s ease'
          }}
        >
          <Building size={16} /> Property Inquiries <ChevronUp size={14} />
        </button>
      ) : (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '12px 16px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            flexWrap: 'wrap',
            maxWidth: '90vw'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#059669', borderRadius: '8px', padding: '6px', display: 'flex' }}>
              <Building size={16} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Interested in this property?
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                Official PropTech Deal Room
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={handleWhatsAppClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#25d366',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '7px 12px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)'
              }}
            >
              <MessageCircle size={15} /> WhatsApp Broker
            </button>

            <a
              href="/tools/stamp-duty-calculator"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#e2e8f0',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '7px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              <Calculator size={13} style={{ color: '#34d399' }} /> Stamp Duty
            </a>

            <a
              href="/tools/rera-carpet-area-calculator"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#e2e8f0',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '7px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              <Maximize2 size={13} style={{ color: '#34d399' }} /> Carpet Calc
            </a>

            <button
              onClick={() => setIsExpanded(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Minimize"
            >
              <ChevronDown size={16} />
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealEstateViewerActionBar;
