import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  ShieldCheck,
  EyeOff,
  Cpu,
  Zap,
  Key,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Terminal,
  ShieldAlert,
  FileLock
} from 'lucide-react';

const CryptographicSecurityHighlight: React.FC = () => {
  const [inputText, setInputText] = useState('Confidential Pitch Deck & Financial Valuation: $25,000,000');
  const [encryptedData, setEncryptedData] = useState<{
    ciphertext: string;
    iv: string;
    hashKey: string;
    encryptedAt: string;
  } | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);

  // Real WebCrypto AES-256-GCM encryption demonstration
  const handleSimulateEncryption = async () => {
    setIsEncrypting(true);
    try {
      const key = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );

      const exportedKey = await window.crypto.subtle.exportKey('raw', key);
      const keyHex = Array.from(new Uint8Array(exportedKey))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const ivHex = Array.from(iv)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      const encoder = new TextEncoder();
      const data = encoder.encode(inputText);
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );

      const cipherHex = Array.from(new Uint8Array(encryptedBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      setTimeout(() => {
        setEncryptedData({
          ciphertext: cipherHex.substring(0, 64) + '...',
          iv: ivHex,
          hashKey: keyHex.substring(0, 24) + '...',
          encryptedAt: new Date().toLocaleTimeString()
        });
        setIsEncrypting(false);
      }, 350);
    } catch (err) {
      console.error('Encryption error:', err);
      setIsEncrypting(false);
    }
  };

  return (
    <section style={{
      padding: '6.5rem 2rem',
      background: 'linear-gradient(180deg, #050811 0%, #0a0f24 50%, #050811 100%)',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      borderTop: '1px solid rgba(99, 102, 241, 0.15)',
      borderBottom: '1px solid rgba(99, 102, 241, 0.15)'
    }}>
      
      {/* Radiant Dual Glow Orbs */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '20%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(0, 0, 0, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '15%',
        transform: 'translate(50%, 50%)',
        width: '550px',
        height: '550px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, rgba(0, 0, 0, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Header Eyebrow & Title */}
        <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 4.5rem' }}>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
              border: '1px solid rgba(129, 140, 248, 0.4)',
              borderRadius: '9999px',
              padding: '0.5rem 1.35rem',
              color: '#a5b4fc',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
              boxShadow: '0 0 25px rgba(99, 102, 241, 0.3)'
            }}
          >
            <Lock size={16} color="#818cf8" /> 256-Bit Cryptographic Vault Architecture
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.3rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              margin: '0 0 1.25rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #c7d2fe 50%, #e0e7ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Military-Grade Encryption Meets Zero-Knowledge Privacy.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: '1.15rem',
              color: '#94a3b8',
              lineHeight: 1.65,
              margin: 0
            }}
          >
            DocTransfer encrypts your confidential files inside your local browser using AES-256-GCM before transmission. Your decryption keys stay on your device and are never exposed to HTTP servers.
          </motion.p>
        </div>

        {/* 3 Premium Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2.25rem',
          marginBottom: '5rem'
        }}>
          
          {/* Card 1: AES-256 (Electric Indigo & Violet) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            style={featureCardStyle(
              'rgba(129, 140, 248, 0.4)',
              'linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(168, 85, 247, 0.08) 100%)',
              '0 0 35px rgba(99, 102, 241, 0.25)'
            )}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={iconBoxStyle('#818cf8', 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.2) 100%)')}>
                <ShieldCheck size={28} />
              </div>
              <span style={pillStyle('#a5b4fc', 'rgba(99, 102, 241, 0.25)', 'rgba(129, 140, 248, 0.5)')}>
                AES-256-GCM Authenticated
              </span>
            </div>

            <h3 style={cardHeaderTitleStyle}>AES-256 Military Grade Encryption</h3>
            <p style={cardBodyTextStyle}>
              Uses Galois/Counter Mode (GCM) for authenticated encryption. Takes 3.3 × 10^56 years to brute force. Trusted by military, intelligence agencies, and global financial systems.
            </p>

            <div style={terminalBoxStyle('rgba(99, 102, 241, 0.2)')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a5b4fc', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 700 }}>
                <Terminal size={14} color="#818cf8" /> CIPHERSTREAM (AES-256-GCM)
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#34d399', letterSpacing: '0.05em', wordBreak: 'break-all' }}>
                0x7F9A4B2C8E1D5A3F99B0... [AUTHENTICATED]
              </div>
            </div>
          </motion.div>

          {/* Card 2: Zero-Knowledge (Electric Cyan & Blue) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            style={featureCardStyle(
              'rgba(56, 189, 248, 0.4)',
              'linear-gradient(135deg, rgba(6, 182, 212, 0.18) 0%, rgba(59, 130, 246, 0.08) 100%)',
              '0 0 35px rgba(6, 182, 212, 0.22)'
            )}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={iconBoxStyle('#38bdf8', 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(14, 165, 233, 0.2) 100%)')}>
                <EyeOff size={28} />
              </div>
              <span style={pillStyle('#38bdf8', 'rgba(6, 182, 212, 0.25)', 'rgba(56, 189, 248, 0.5)')}>
                Zero Server Key Access
              </span>
            </div>

            <h3 style={cardHeaderTitleStyle}>Zero-Knowledge Architecture</h3>
            <p style={cardBodyTextStyle}>
              Decryption keys are held strictly in URL hash parameters (<code style={{ color: '#38bdf8' }}>#key=...</code>) which are never transmitted to web servers. DocTransfer cannot read your documents even under subpoena.
            </p>

            <div style={terminalBoxStyle('rgba(6, 182, 212, 0.2)')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 700 }}>
                <Key size={14} color="#38bdf8" /> URL HASH KEY ISOLATION
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#60a5fa', wordBreak: 'break-all' }}>
                https://doctransfer.app/view/doc_123#key=SECRET_LOCAL_ONLY
              </div>
            </div>
          </motion.div>

          {/* Card 3: Client-Side Cryptography (Neon Emerald & Teal) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            style={featureCardStyle(
              'rgba(52, 211, 153, 0.4)',
              'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(20, 184, 166, 0.08) 100%)',
              '0 0 35px rgba(16, 185, 129, 0.22)'
            )}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={iconBoxStyle('#34d399', 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(20, 184, 166, 0.2) 100%)')}>
                <Cpu size={28} />
              </div>
              <span style={pillStyle('#34d399', 'rgba(16, 185, 129, 0.25)', 'rgba(52, 211, 153, 0.5)')}>
                Hardware Acceleration
              </span>
            </div>

            <h3 style={cardHeaderTitleStyle}>Client-Side Cryptography (WebCrypto API)</h3>
            <p style={cardBodyTextStyle}>
              Leverages native browser hardware primitives via the W3C WebCrypto API. Encrypts files in sub-12ms local execution without third-party plugins.
            </p>

            <div style={terminalBoxStyle('rgba(16, 185, 129, 0.2)')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 700 }}>
                <Zap size={14} color="#34d399" /> WEBCRYPTO BENCHMARK
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#34d399' }}>
                crypto.subtle.encrypt() ➔ Sub-12ms Local Execution
              </div>
            </div>
          </motion.div>

        </div>

        {/* Interactive In-Browser Encryption Sandbox / Simulator Widget */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(10, 15, 29, 0.95) 100%)',
            border: '1px solid rgba(129, 140, 248, 0.4)',
            borderRadius: '24px',
            padding: '3.25rem 2.5rem',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.2)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(52, 211, 153, 0.1) 100%)',
              color: '#34d399',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              borderRadius: '9999px',
              padding: '0.4rem 1.15rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: '1rem',
              boxShadow: '0 0 15px rgba(52, 211, 153, 0.2)'
            }}>
              <Sparkles size={15} /> Interactive Live Cryptography Demo
            </div>
            <h3 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 0.65rem', color: 'white' }}>
              Test Client-Side Encryption Live in Your Browser
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.98rem', margin: 0, lineHeight: 1.6 }}>
              Type a sample document message below and watch real W3C WebCrypto AES-256-GCM encryption execute locally in your browser memory right now.
            </p>
          </div>

          {/* Sandbox Controls */}
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.6rem' }}>
                Plaintext Document Content (Unencrypted Input):
              </label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(129, 140, 248, 0.3)',
                  borderRadius: '12px',
                  padding: '0.95rem 1.35rem',
                  color: 'white',
                  fontSize: '0.98rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                }}
              />
            </div>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <button
                onClick={handleSimulateEncryption}
                disabled={isEncrypting}
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.9rem 2.25rem',
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '1.02rem',
                  cursor: isEncrypting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 6px 24px rgba(99, 102, 241, 0.45)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  transition: 'transform 0.2s ease, boxShadow 0.2s ease'
                }}
              >
                {isEncrypting ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" /> Encrypting via WebCrypto...
                  </>
                ) : (
                  <>
                    <FileLock size={19} /> Encrypt in Browser (AES-256-GCM)
                  </>
                )}
              </button>
            </div>

            {/* Results Output */}
            <AnimatePresence>
              {encryptedData && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    background: 'rgba(5, 8, 17, 0.85)',
                    border: '1px solid rgba(52, 211, 153, 0.4)',
                    borderRadius: '18px',
                    padding: '1.85rem',
                    color: '#e2e8f0',
                    fontSize: '0.9rem',
                    boxShadow: '0 0 25px rgba(52, 211, 153, 0.15)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', paddingBottom: '0.85rem' }}>
                    <span style={{ color: '#34d399', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.98rem' }}>
                      <CheckCircle2 size={18} color="#34d399" /> WebCrypto AES-256 Payload Generated
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                      Executed locally at {encryptedData.encryptedAt}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.35rem' }}>
                    <div>
                      <div style={{ color: '#f472b6', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>CIPHERTEXT (ENCRYPTED BLOB):</div>
                      <div style={{ fontFamily: 'monospace', color: '#f472b6', background: 'rgba(244, 114, 182, 0.08)', border: '1px solid rgba(244, 114, 182, 0.25)', padding: '0.6rem 0.85rem', borderRadius: '10px', wordBreak: 'break-all' }}>
                        {encryptedData.ciphertext}
                      </div>
                    </div>

                    <div>
                      <div style={{ color: '#38bdf8', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>INITIALIZATION VECTOR (IV):</div>
                      <div style={{ fontFamily: 'monospace', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '0.6rem 0.85rem', borderRadius: '10px', wordBreak: 'break-all' }}>
                        {encryptedData.iv}
                      </div>
                    </div>

                    <div>
                      <div style={{ color: '#34d399', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>URL HASH FRAGMENT (#KEY):</div>
                      <div style={{ fontFamily: 'monospace', color: '#34d399', background: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.25)', padding: '0.6rem 0.85rem', borderRadius: '10px', wordBreak: 'break-all' }}>
                        #key={encryptedData.hashKey}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px dashed rgba(255, 255, 255, 0.12)', fontSize: '0.85rem', color: '#cbd5e1', textAlign: 'center' }}>
                    🔒 <strong>Zero-Knowledge Guarantee:</strong> Raw unencrypted text never leaves your device. Only the encrypted blob is transmitted.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

// Reusable Style Helpers
const featureCardStyle = (borderColor: string, bgGradient: string, glowShadow: string): React.CSSProperties => ({
  background: bgGradient,
  border: `1px solid ${borderColor}`,
  borderRadius: '22px',
  padding: '2.35rem 2.15rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxShadow: glowShadow
});

const iconBoxStyle = (color: string, bg: string): React.CSSProperties => ({
  width: '56px',
  height: '56px',
  borderRadius: '16px',
  background: bg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color,
  boxShadow: `0 0 20px ${bg}`
});

const pillStyle = (color: string, bg: string, border: string): React.CSSProperties => ({
  background: bg,
  color,
  border: `1px solid ${border}`,
  borderRadius: '9999px',
  padding: '0.4rem 0.95rem',
  fontSize: '0.78rem',
  fontWeight: 700,
  letterSpacing: '0.02em'
});

const cardHeaderTitleStyle: React.CSSProperties = {
  fontSize: '1.35rem',
  fontWeight: 800,
  color: 'white',
  margin: '0 0 0.85rem'
};

const cardBodyTextStyle: React.CSSProperties = {
  fontSize: '0.94rem',
  color: '#94a3b8',
  lineHeight: 1.65,
  margin: '0 0 1.65rem'
};

const terminalBoxStyle = (borderColor: string): React.CSSProperties => ({
  background: 'rgba(0, 0, 0, 0.6)',
  border: `1px solid ${borderColor}`,
  borderRadius: '14px',
  padding: '1.1rem'
});

export default CryptographicSecurityHighlight;
