import React, { useState } from 'react';
import { Code, Copy, Check, X, ExternalLink, Sparkles } from 'lucide-react';

interface EmbedToolModalProps {
  toolSlug: string;
  toolName: string;
}

export const EmbedToolModal: React.FC<EmbedToolModalProps> = ({ toolSlug, toolName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [height, setHeight] = useState(650);

  const embedUrl = `https://www.doctransfer.app/tools/${toolSlug}`;
  const embedCode = `<iframe src="${embedUrl}" width="100%" height="${height}" frameborder="0" style="border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" title="${toolName}"></iframe>
<p style="font-size: 12px; color: #64748b; margin-top: 6px; text-align: right; font-family: sans-serif;">
  Free Tool powered by <a href="https://www.doctransfer.app" target="_blank" rel="noopener" style="color: #4f46e5; font-weight: 600; text-decoration: none;">DocTransfer Free Document Tracking & E-Sign</a>
</p>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'white',
          border: '1px solid #cbd5e1',
          color: '#475569',
          padding: '0.4rem 0.85rem',
          borderRadius: '8px',
          fontSize: '0.8rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
        onMouseOver={e => e.currentTarget.style.borderColor = '#4f46e5'}
        onMouseOut={e => e.currentTarget.style.borderColor = '#cbd5e1'}
      >
        <Code size={14} color="#4f46e5" /> Embed on Your Site
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1.5rem'
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative',
              textAlign: 'left',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', fontSize: '1.2rem', color: '#0f172a' }}>
                <Code size={20} color="#4f46e5" /> Embed {toolName}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
              Embed this free interactive calculator on your blog, startup resource directory, university portal, or newsletter. Free for commercial and non-commercial use.
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                Embed Code (HTML iframe)
              </label>
              <textarea
                readOnly
                value={embedCode}
                rows={5}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  color: '#0f172a',
                  boxSizing: 'border-box',
                  resize: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Includes canonical attribution link
              </span>
              <button
                onClick={handleCopy}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: copied ? '#16a34a' : '#4f46e5',
                  color: 'white',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
              >
                {copied ? <><Check size={16} /> Copied to Clipboard!</> : <><Copy size={16} /> Copy Embed Code</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmbedToolModal;
