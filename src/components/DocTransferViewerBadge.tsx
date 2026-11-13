import React, { useState } from 'react';
import { Sparkles, Shield, ArrowRight, X, Lock, Eye, ExternalLink } from 'lucide-react';

export const DocTransferViewerBadge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        zIndex: 9999,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Expanded Popover */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '3.75rem',
            right: 0,
            width: '320px',
            background: 'rgba(15, 23, 42, 0.96)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            color: 'white',
            borderRadius: '18px',
            padding: '1.35rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: '800', fontSize: '1rem', color: '#ffffff' }}>
              <Sparkles size={16} color="#818cf8" />
              <span>DocTransfer Deal Room</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.2rem', display: 'flex' }}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
            This document is secured with <strong>Zero-Knowledge AES-256 client encryption</strong> and live second-by-second reader telemetry.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.2rem', fontSize: '0.76rem', color: '#94a3b8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Eye size={13} color="#818cf8" />
              <span>Page-by-page reader attention heatmaps</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Lock size={13} color="#10b981" />
              <span>Dynamic forensic recipient watermarking</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Shield size={13} color="#38bdf8" />
              <span>Remote active sessions kill switch</span>
            </div>
          </div>

          <a
            href="https://www.doctransfer.app/?utm_source=doc_viewer&utm_medium=viral_popover"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '0.84rem',
              boxShadow: '0 6px 16px rgba(79, 70, 229, 0.45)',
              transition: 'transform 0.15s ease'
            }}
          >
            <span>Create Your Free Deal Room ($0)</span>
            <ArrowRight size={15} />
          </a>
        </div>
      )}

      {/* Floating Pill Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.55rem',
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          padding: '0.45rem 0.95rem',
          borderRadius: '9999px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(99, 102, 241, 0.25)',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          userSelect: 'none'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ display: 'flex', alignItems: 'center', color: '#10b981' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', marginRight: '5px' }}></span>
          <Shield size={13} />
        </span>
        <span style={{ fontSize: '0.76rem', fontWeight: '600', color: 'white', letterSpacing: '0.01em' }}>
          Protected by <strong style={{ color: '#818cf8', fontWeight: '700' }}>DocTransfer</strong>
        </span>
        <span style={{ fontSize: '0.65rem', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: '#ffffff', padding: '0.15rem 0.5rem', borderRadius: '12px', fontWeight: '700', boxShadow: '0 2px 6px rgba(79, 70, 229, 0.4)' }}>
          Track Free →
        </span>
      </div>
    </div>
  );
};

export default DocTransferViewerBadge;
