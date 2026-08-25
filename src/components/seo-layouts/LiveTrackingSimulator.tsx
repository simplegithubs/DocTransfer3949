import React, { useState, useEffect } from 'react';
import { Eye, Clock, ShieldAlert, Bell, Sparkles, Lock, ArrowRight, CheckCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Slide {
  id: number;
  title: string;
  category: string;
  previewSnippet: string;
  simulatedAvgTime: number;
  interestLevel: 'Normal' | 'High Intent' | 'Critical Review';
}

const SAMPLE_SLIDES: Slide[] = [
  {
    id: 1,
    title: '1. Executive Summary & Team',
    category: 'Overview',
    previewSnippet: 'DocTransfer zero-knowledge document transfer architecture & founding team.',
    simulatedAvgTime: 6.2,
    interestLevel: 'Normal'
  },
  {
    id: 2,
    title: '2. Market Problem & Legacy Flaws',
    category: 'Problem Statement',
    previewSnippet: 'Legacy platforms decrypt contracts on their cloud servers, risking subpoena leaks.',
    simulatedAvgTime: 8.5,
    interestLevel: 'Normal'
  },
  {
    id: 3,
    title: '3. Financial Projections & Metrics',
    category: 'Financials & Valuation',
    previewSnippet: '$100k ARR target trajectory, 85% gross margins, CAC:LTV ratio of 1:12.',
    simulatedAvgTime: 24.8,
    interestLevel: 'High Intent'
  },
  {
    id: 4,
    title: '4. Legal Terms & Safe Agreement',
    category: 'Contract Terms',
    previewSnippet: 'eIDAS & ESIGN Act compliant digital signature clause and tamper seal.',
    simulatedAvgTime: 31.4,
    interestLevel: 'Critical Review'
  }
];

export const LiveTrackingSimulator: React.FC = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(2); // Default to Slide 3 (Financials)
  const [secondsSpent, setSecondsSpent] = useState<number>(14);
  const [watermarkEnabled, setWatermarkEnabled] = useState<boolean>(true);
  const [downloadDisabled, setDownloadDisabled] = useState<boolean>(true);

  // Active slide
  const activeSlide = SAMPLE_SLIDES[activeSlideIndex];

  // Increment timer every second to simulate live tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsSpent(prev => +(prev + 0.5).toFixed(1));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const handleSlideChange = (index: number) => {
    setActiveSlideIndex(index);
    setSecondsSpent(1);
  };

  return (
    <div style={{
      background: '#0f172a',
      borderRadius: '24px',
      padding: '2.5rem 2rem',
      color: '#f8fafc',
      margin: '3.5rem 0',
      border: '1px solid #334155',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(16, 185, 129, 0.15)',
          padding: '0.4rem 1rem',
          borderRadius: '9999px',
          color: '#34d399',
          fontSize: '0.875rem',
          fontWeight: 700,
          marginBottom: '0.75rem',
          border: '1px solid rgba(52, 211, 153, 0.3)'
        }}>
          <Eye size={15} /> Interactive Live Viewer Demo
        </div>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0 0.5rem 0' }}>
          Experience Real-Time Page-by-Page Document Tracking
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.975rem', maxWidth: '650px', margin: '0 auto' }}>
          Click through the sample slides below to see how DocTransfer captures recipient viewing seconds, identifies high intent, and triggers instant alerts.
        </p>
      </div>

      {/* Simulator Workspace Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        alignItems: 'start',
        marginBottom: '2rem'
      }}>
        {/* Left Column: Interactive Slide Viewer */}
        <div style={{
          background: '#1e293b',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid #334155',
          position: 'relative'
        }}>
          {/* Security & Watermark Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#0f172a',
            padding: '0.6rem 1rem',
            borderRadius: '10px',
            marginBottom: '1rem',
            fontSize: '0.8rem',
            color: '#94a3b8'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 700 }}>
              <Lock size={14} /> Zero-Knowledge E2EE (AES-256)
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={watermarkEnabled}
                  onChange={e => setWatermarkEnabled(e.target.checked)}
                /> Watermark
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={downloadDisabled}
                  onChange={e => setDownloadDisabled(e.target.checked)}
                /> No Download
              </label>
            </div>
          </div>

          {/* Slide Preview Canvas */}
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
            border: '2px solid #6366f1',
            borderRadius: '12px',
            minHeight: '220px',
            padding: '2rem 1.5rem',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            {/* Dynamic Scribe Watermark Overlay */}
            {watermarkEnabled && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                transform: 'rotate(-25deg)',
                opacity: 0.15,
                fontSize: '1.25rem',
                fontWeight: 900,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                userSelect: 'none'
              }}>
                CONFIDENTIAL • investor@sequoiacap.com • 192.168.1.1
              </div>
            )}

            <div style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {activeSlide.category}
            </div>
            <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
              {activeSlide.title}
            </h4>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', maxWidth: '420px', lineHeight: 1.5 }}>
              {activeSlide.previewSnippet}
            </p>
          </div>

          {/* Slide Switcher Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem',
            marginTop: '1rem'
          }}>
            {SAMPLE_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => handleSlideChange(idx)}
                style={{
                  background: activeSlideIndex === idx ? '#4f46e5' : '#334155',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.6rem 0.25rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: activeSlideIndex === idx ? '0 0 12px rgba(79, 70, 229, 0.6)' : 'none'
                }}
              >
                Slide {slide.id}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Live Telemetry & Founder Notification Alert */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {/* Real-Time Telemetry Card */}
          <div style={{
            background: '#1e293b',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid #334155'
          }}>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>
              📡 Live Recipient Telemetry
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Currently Viewing</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>{activeSlide.title}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Time on Slide</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={18} /> {secondsSpent}s
                </div>
              </div>
            </div>

            {/* Interest Meter */}
            <div style={{ background: '#0f172a', padding: '0.75rem 1rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Intent Signal:</span>
              <span style={{
                background: activeSlide.interestLevel === 'High Intent' ? 'rgba(245, 158, 11, 0.2)' : (activeSlide.interestLevel === 'Critical Review' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)'),
                color: activeSlide.interestLevel === 'High Intent' ? '#fbbf24' : (activeSlide.interestLevel === 'Critical Review' ? '#f87171' : '#60a5fa'),
                padding: '3px 10px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 800
              }}>
                ⚡ {activeSlide.interestLevel}
              </span>
            </div>
          </div>

          {/* Instant Notification Popup Simulation */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid #6366f1',
            borderRadius: '16px',
            padding: '1.25rem',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#818cf8', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <Bell size={16} /> Instant Founder Alert Triggered
            </div>
            <p style={{ fontSize: '0.9rem', color: '#e2e8f0', margin: 0, lineHeight: 1.4 }}>
              "Partner at Sequoia opened your pitch deck from Menlo Park, CA. Currently reading <strong>{activeSlide.title}</strong> for {secondsSpent} seconds."
            </p>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div style={{ textAlign: 'center', borderTop: '1px solid #334155', paddingTop: '1.75rem' }}>
        <Link
          to="/signup"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: '#4f46e5',
            color: '#ffffff',
            padding: '0.9rem 2rem',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '1rem',
            textDecoration: 'none',
            boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.4)'
          }}
        >
          Track Your Documents Free Today <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default LiveTrackingSimulator;
