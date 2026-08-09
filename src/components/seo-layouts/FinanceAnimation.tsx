import { useEffect, useState } from 'react';

interface FinanceAnimationProps {
  slug?: string;
}

export default function FinanceAnimation({ slug }: FinanceAnimationProps) {
  const [stage, setStage] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage(s => (s + 1) % 4);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const counter = setInterval(() => {
      setCount(c => (c + 1) % 100);
    }, 50);
    return () => clearInterval(counter);
  }, []);

  const stages = [
    { label: 'Collect Tax Docs', icon: '📊', color: '#f59e0b' },
    { label: 'Encrypt & Protect', icon: '🔒', color: '#3b82f6' },
    { label: 'Client Signs', icon: '✍️', color: '#10b981' },
    { label: 'Filed & Archived', icon: '📁', color: '#8b5cf6' },
  ];

  return (
    <div style={{
      width: '100%',
      minHeight: 260,
      background: 'linear-gradient(135deg, #0c1222 0%, #1a1a2e 50%, #0c1222 100%)',
      borderRadius: 16,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      padding: '32px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Calculator display */}
      <div style={{
        background: '#1e293b',
        border: `2px solid ${stages[stage].color}44`,
        borderRadius: 12,
        padding: '12px 24px',
        minWidth: 180,
        textAlign: 'right',
        position: 'relative',
        transition: 'border-color 0.4s ease',
      }}>
        <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4, textAlign: 'left' }}>
          DocTransfer {stages[stage].label}
        </div>
        <div style={{
          color: stages[stage].color,
          fontSize: 28,
          fontWeight: 800,
          fontFamily: 'monospace',
          transition: 'color 0.4s ease',
        }}>
          {stage === 3 ? '✓ DONE' : `$${(count * 127 + 4500).toLocaleString()}`}
        </div>
      </div>

      {/* Animated bars */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 60 }}>
        {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.3, 0.75].map((h, i) => (
          <div key={i} style={{
            width: 14,
            height: `${h * 100 * (stage === 3 ? 1 : 0.5 + Math.sin(count * 0.1 + i) * 0.3)}%`,
            borderRadius: '4px 4px 0 0',
            background: `linear-gradient(to top, ${stages[stage].color}88, ${stages[stage].color})`,
            transition: 'background 0.4s ease',
            minHeight: 8,
          }} />
        ))}
      </div>

      {/* Stage label */}
      <div style={{
        color: '#fff',
        fontWeight: 700,
        fontSize: 17,
        letterSpacing: '-0.01em',
      }}>
        {stages[stage].label}
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 10 }}>
        {stages.map((s, i) => (
          <div key={i} style={{
            width: i === stage ? 28 : 10,
            height: 10,
            borderRadius: 5,
            background: i === stage ? s.color : '#334155',
            transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: i === stage ? `0 0 12px ${s.color}66` : 'none',
          }} />
        ))}
      </div>

      {/* Number rain effect */}
      {[...Array(8)].map((_, i) => (
        <div key={`n-${i}`} style={{
          position: 'absolute',
          color: stages[stage].color,
          opacity: 0.12,
          fontSize: 14,
          fontFamily: 'monospace',
          top: `${(count * 2 + i * 40) % 120 - 20}%`,
          left: `${5 + i * 13}%`,
          transition: 'color 0.4s ease',
        }}>
          {['$', '1099', 'W-9', '%', 'TAX', '$', 'ROI', 'P&L'][i]}
        </div>
      ))}
    </div>
  );
}
