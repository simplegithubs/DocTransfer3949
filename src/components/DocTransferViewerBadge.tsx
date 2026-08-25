import React, { useState } from 'react';
import { Sparkles, Shield, ArrowRight, X, Lock, Eye } from 'lucide-react';

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
            bottom: '3.5rem',
            right: 0,
            width: '300px',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(12px)',
            color: 'white',
            borderRadius: '16px',
            padding: '1.25rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '800', fontSize: '0.95rem', color: '#818cf8' }}>
              <Sparkles size={16} /> DocTransfer
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.2rem' }}
            >
              <X size={16} />
            </button>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4, margin: '0 0 1rem 0' }}>
            This document is protected with <strong>Zero-Knowledge AES-256 encryption</strong> and real-time reader telemetry.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Eye size={12} color="#818cf8" /> Second-by-second page analytics
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={12} color="#818cf8" /> Client-side AES-256 encryption
            </div>
          </div>

          <a
            href="https://www.doctransfer.app/?utm_source=doc_viewer&utm_medium=viral_badge"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              background: '#4f46e5',
              color: 'white',
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '0.8rem',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)'
            }}
          >
            Create Free Trackable Link <ArrowRight size={14} />
          </a>
        </div>
      )}

      {/* Floating Pill Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '0.45rem 0.9rem',
          borderRadius: '9999px',
          boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.35)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          userSelect: 'none'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ display: 'flex', alignItems: 'center', color: '#818cf8' }}>
          <Shield size={14} />
        </span>
        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'white', letterSpacing: '0.01em' }}>
          Secured by <strong style={{ color: '#818cf8', fontWeight: '700' }}>DocTransfer</strong>
        </span>
        <span style={{ fontSize: '0.65rem', background: 'rgba(79, 70, 229, 0.4)', color: '#c7d2fe', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: '700' }}>
          FREE
        </span>
      </div>
    </div>
  );
};

export default DocTransferViewerBadge;
