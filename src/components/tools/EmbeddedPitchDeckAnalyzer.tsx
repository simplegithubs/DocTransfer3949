import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, BarChart3, ShieldCheck, Eye, Lock, ArrowRight, TrendingUp } from 'lucide-react';

const EmbeddedPitchDeckAnalyzer: React.FC = () => {
  const [slideCount, setSlideCount] = useState<number>(12);
  const [hasWatermark, setHasWatermark] = useState<boolean>(true);
  const [hasPasscode, setHasPasscode] = useState<boolean>(false);
  const [trackViewTime, setTrackViewTime] = useState<boolean>(true);

  // Compute calculated security & investor engagement score
  const baseScore = 50;
  const watermarkBonus = hasWatermark ? 20 : 0;
  const passcodeBonus = hasPasscode ? 15 : 0;
  const trackingBonus = trackViewTime ? 15 : 0;
  const totalScore = baseScore + watermarkBonus + passcodeBonus + trackingBonus;

  const estimatedDwellTime = (slideCount * 18).toFixed(0); // 18 seconds per slide benchmark

  return (
    <div style={{
      background: '#0a0f1d',
      color: 'white',
      borderRadius: '24px',
      padding: '2.5rem 2rem',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      boxShadow: '0 20px 40px -15px rgba(56, 189, 248, 0.2)',
      marginBottom: '3rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            <Sparkles size={14} /> Interactive Pitch Deck Calculator
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', margin: 0 }}>
            Pitch Deck Engagement & Security Score Analyzer
          </h3>
        </div>
        <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={16} color="#38bdf8" /> Real-time Page Analytics Benchmark
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        
        {/* Controls Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' }}>Total Deck Slides</label>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>{slideCount} Slides</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={slideCount}
              onChange={(e) => setSlideCount(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.88rem', color: '#cbd5e1', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={hasWatermark}
                onChange={(e) => setHasWatermark(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#38bdf8', cursor: 'pointer' }}
              />
              Dynamic Viewer Email Watermarking (+20 Score)
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.88rem', color: '#cbd5e1', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={trackViewTime}
                onChange={(e) => setTrackViewTime(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#38bdf8', cursor: 'pointer' }}
              />
              Page-by-Page Reading Dwell Time Tracking (+15 Score)
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.88rem', color: '#cbd5e1', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={hasPasscode}
                onChange={(e) => setHasPasscode(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#38bdf8', cursor: 'pointer' }}
              />
              Passcode or Email Verification Guard (+15 Score)
            </label>
          </div>
        </div>

        {/* Results Card Column */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Security & Tracking Rating</span>
              <span style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: totalScore >= 80 ? '#34d399' : totalScore >= 65 ? '#fbbf24' : '#f87171'
              }}>
                {totalScore} / 100
              </span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '9999px', height: '10px', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <div style={{
                width: `${totalScore}%`,
                height: '100%',
                background: totalScore >= 80 ? 'linear-gradient(90deg, #10b981, #34d399)' : totalScore >= 65 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : '#ef4444',
                transition: 'width 0.3s ease'
              }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '12px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>EST. VC READ TIME</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginTop: '0.25rem' }}>~{estimatedDwellTime}s</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>LEAK RISK</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: hasWatermark ? '#34d399' : '#f87171', marginTop: '0.25rem' }}>
                  {hasWatermark ? 'Zero' : 'High'}
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/dataroom"
            style={{
              marginTop: '1.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
              color: 'white',
              padding: '0.8rem 1.25rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(14, 165, 233, 0.3)'
            }}
          >
            Track Pitch Decks for Free <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default EmbeddedPitchDeckAnalyzer;
