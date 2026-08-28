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
      // Generate a cryptographic AES-256 key
      const key = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );

      // Export raw key bytes to hex
      const exportedKey = await window.crypto.subtle.exportKey('raw', key);
      const keyHex = Array.from(new Uint8Array(exportedKey))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      // Generate random 12-byte Initialization Vector (IV)
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const ivHex = Array.from(iv)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      // Encrypt the text
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
      }, 400);
    } catch (err) {
      console.error('Encryption error:', err);
      setIsEncrypting(false);
    }
  };

  return (
    <section style={{
      padding: '6rem 2rem',
      background: 'radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.15) 0%, rgba(10, 15, 29, 1) 75%)',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      
      {/* Background Animated Energy Grid */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(rgba(99, 102, 241, 0.15) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
        opacity: 0.4,
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Header Eyebrow & Title */}
        <div style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto 4.5rem' }}>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              borderRadius: '9999px',
              padding: '0.45rem 1.25rem',
              color: '#818cf8',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
              boxShadow: '0 0 24px rgba(99, 102, 241, 0.25)'
            }}
          >
            <Lock size={16} /> 256-Bit Cryptographic Vault Architecture
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              margin: '0 0 1.25rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
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

        {/* 3 Animated Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '5rem'
        }}>
          
          {/* Card 1: AES-256 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            style={featureCardStyle('rgba(99, 102, 241, 0.3)', 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.04) 100%)')}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={iconBoxStyle('#818cf8', 'rgba(99, 102, 241, 0.15)')}>
                <ShieldCheck size={26} />
              </div>
              <span style={pillStyle('#818cf8', 'rgba(99, 102, 241, 0.2)')}>
                AES-256-GCM Authenticated
              </span>
            </div>

            <h3 style={cardHeaderTitleStyle}>AES-256 Military Grade Encryption</h3>
            <p style={cardBodyTextStyle}>
              Uses Galois/Counter Mode (GCM) for authenticated encryption. Takes 3.3 × 10^56 years to brute force. Trusted by military, intelligence agencies, and global financial systems.
            </p>

            {/* Animated Hex Cipher Stream Mock */}
            <div style={terminalBoxStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#818cf8', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 600 }}>
                <Terminal size={14} /> CIPHERSTREAM (AES-256-GCM)
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#34d399', letterSpacing: '0.05em', wordBreak: 'break-all' }}>
                0x7F9A4B2C8E1D5A3F99B0... [AUTHENTICATED]
              </div>
            </div>
          </motion.div>

          {/* Card 2: Zero-Knowledge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            style={featureCardStyle('rgba(56, 189, 248, 0.3)', 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(14, 165, 233, 0.04) 100%)')}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={iconBoxStyle('#38bdf8', 'rgba(56, 189, 248, 0.15)')}>
                <EyeOff size={26} />
              </div>
              <span style={pillStyle('#38bdf8', 'rgba(56, 189, 248, 0.2)')}>
                Zero Server Key Access
              </span>
            </div>

            <h3 style={cardHeaderTitleStyle}>Zero-Knowledge Architecture</h3>
            <p style={cardBodyTextStyle}>
              Decryption keys are held strictly in URL hash parameters (<code style={{ color: '#38bdf8' }}>#key=...</code>) which are never transmitted to web servers. DocTransfer cannot read your documents even under subpoena.
            </p>

            <div style={terminalBoxStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 600 }}>
                <Key size={14} /> URL HASH KEY ISOLATION
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#60a5fa', wordBreak: 'break-all' }}>
                https://doctransfer.app/view/doc_123#key=SECRET_LOCAL_ONLY
              </div>
            </div>
          </motion.div>

          {/* Card 3: Client-Side Cryptography */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            style={featureCardStyle('rgba(52, 211, 153, 0.3)', 'linear-gradient(135deg, rgba(52, 211, 153, 0.12) 0%, rgba(16, 185, 129, 0.04) 100%)')}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={iconBoxStyle('#34d399', 'rgba(52, 211, 153, 0.15)')}>
                <Cpu size={26} />
              </div>
              <span style={pillStyle('#34d399', 'rgba(52, 211, 153, 0.2)')}>
                Hardware Acceleration
              </span>
            </div>

            <h3 style={cardHeaderTitleStyle}>Client-Side Cryptography (WebCrypto API)</h3>
            <p style={cardBodyTextStyle}>
              Leverages native browser hardware primitives via the W3C WebCrypto API. Encrypts files in sub-12ms local execution without third-party plugins.
            </p>

            <div style={terminalBoxStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 600 }}>
                <Zap size={14} /> WEBCRYPTO BENCHMARK
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
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            borderRadius: '24px',
            padding: '3rem 2.5rem',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4), 0 0 30px rgba(99, 102, 241, 0.15)',
            backdropFilter: 'blur(16px)'
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(52, 211, 153, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              borderRadius: '9999px',
              padding: '0.35rem 1rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '1rem'
            }}>
              <Sparkles size={14} /> Interactive Live Demo
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'white' }}>
              Test Client-Side Encryption Live in Your Browser
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>
              Type a sample document message below and watch real WebCrypto AES-256-GCM encryption execute locally in your browser memory right now.
            </p>
          </div>

          {/* Sandbox Controls */}
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>
                Plaintext Document Content (Unencrypted Input):
              </label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '0.85rem 1.25rem',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
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
                  padding: '0.85rem 2rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: isEncrypting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  transition: 'transform 0.2s ease'
                }}
              >
                {isEncrypting ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" /> Encrypting via WebCrypto...
                  </>
                ) : (
                  <>
                    <FileLock size={18} /> Encrypt in Browser (AES-256-GCM)
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
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(52, 211, 153, 0.3)',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    color: '#e2e8f0',
                    fontSize: '0.88rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.75rem' }}>
                    <span style={{ color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle2 size={16} /> WebCrypto AES-256 Payload Generated
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Executed locally at {encryptedData.encryptedAt}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>CIPHERTEXT (ENCRYPTED BLOB):</div>
                      <div style={{ fontFamily: 'monospace', color: '#f472b6', background: 'rgba(255,255,255,0.04)', padding: '0.5rem 0.75rem', borderRadius: '8px', wordBreak: 'break-all' }}>
                        {encryptedData.ciphertext}
                      </div>
                    </div>

                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>INITIALIZATION VECTOR (IV):</div>
                      <div style={{ fontFamily: 'monospace', color: '#38bdf8', background: 'rgba(255,255,255,0.04)', padding: '0.5rem 0.75rem', borderRadius: '8px', wordBreak: 'break-all' }}>
                        {encryptedData.iv}
                      </div>
                    </div>

                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>URL HASH FRAGMENT (#KEY):</div>
                      <div style={{ fontFamily: 'monospace', color: '#34d399', background: 'rgba(255,255,255,0.04)', padding: '0.5rem 0.75rem', borderRadius: '8px', wordBreak: 'break-all' }}>
                        #key={encryptedData.hashKey}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed rgba(255, 255, 255, 0.1)', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
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
const featureCardStyle = (borderColor: string, bgGradient: string): React.CSSProperties => ({
  background: bgGradient,
  border: `1px solid ${borderColor}`,
  borderRadius: '20px',
  padding: '2.25rem 2rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)'
});

const iconBoxStyle = (color: string, bg: string): React.CSSProperties => ({
  width: '52px',
  height: '52px',
  borderRadius: '14px',
  background: bg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color
});

const pillStyle = (color: string, bg: string): React.CSSProperties => ({
  background: bg,
  color,
  border: `1px solid ${color}`,
  borderRadius: '9999px',
  padding: '0.35rem 0.85rem',
  fontSize: '0.78rem',
  fontWeight: 700
});

const cardHeaderTitleStyle: React.CSSProperties = {
  fontSize: '1.3rem',
  fontWeight: 700,
  color: 'white',
  margin: '0 0 0.85rem'
};

const cardBodyTextStyle: React.CSSProperties = {
  fontSize: '0.92rem',
  color: '#94a3b8',
  lineHeight: 1.6,
  margin: '0 0 1.5rem'
};

const terminalBoxStyle: React.CSSProperties = {
  background: 'rgba(0, 0, 0, 0.45)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '12px',
  padding: '1rem'
};

export default CryptographicSecurityHighlight;
