import { useEffect, useState } from 'react';

interface LegalAnimationProps {
  slug?: string;
}

export default function LegalAnimation({ slug }: LegalAnimationProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage(s => (s + 1) % 4);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const stages = [
    { label: 'Draft Contract', icon: '📄', color: '#6366f1' },
    { label: 'Review & Redline', icon: '🔍', color: '#f59e0b' },
    { label: 'E-Sign & Seal', icon: '✍️', color: '#ec4899' },
    { label: 'Court-Admissible', icon: '⚖️', color: '#10b981' },
  ];

  return (
    <div style={{
      width: '100%',
      minHeight: 260,
      background: 'linear-gradient(135deg, #0c0a1f 0%, #1e1b3a 50%, #0c0a1f 100%)',
      borderRadius: 16,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      padding: '28px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Scales of justice SVG */}
      <svg viewBox="0 0 120 100" width="120" height="100" style={{ position: 'relative' }}>
        {/* Pillar */}
        <line x1="60" y1="15" x2="60" y2="85" stroke="#475569" strokeWidth="3" />
        {/* Base */}
        <rect x="40" y="82" width="40" height="6" rx="2" fill="#475569" />
        {/* Beam */}
        <line
          x1="20" y1={stage >= 2 ? 30 : 35}
          x2="100" y2={stage >= 2 ? 30 : 25}
          stroke={stages[stage].color}
          strokeWidth="2.5"
          style={{ transition: 'all 0.8s ease' }}
        />
        {/* Left pan */}
        <path
          d={`M12 ${stage >= 2 ? 32 : 37} Q12 ${stage >= 2 ? 48 : 53} 28 ${stage >= 2 ? 48 : 53} Q28 ${stage >= 2 ? 48 : 53} 28 ${stage >= 2 ? 32 : 37}`}
          fill={`${stages[stage].color}33`}
          stroke={stages[stage].color}
          strokeWidth="1.5"
          style={{ transition: 'all 0.8s ease' }}
        />
        {/* Right pan */}
        <path
          d={`M92 ${stage >= 2 ? 32 : 27} Q92 ${stage >= 2 ? 48 : 43} 108 ${stage >= 2 ? 48 : 43} Q108 ${stage >= 2 ? 48 : 43} 108 ${stage >= 2 ? 32 : 27}`}
          fill={`${stages[stage].color}33`}
          stroke={stages[stage].color}
          strokeWidth="1.5"
          style={{ transition: 'all 0.8s ease' }}
        />
        {/* Icon in center */}
        <text x="60" y="65" textAnchor="middle" fontSize="22">
          {stages[stage].icon}
        </text>
        {/* Seal on completion */}
        {stage === 3 && (
          <circle cx="60" cy="12" r="8" fill={stages[stage].color} opacity="0.8">
            <animate attributeName="r" values="4;8;4" dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>

      {/* Stage label */}
      <div style={{
        color: '#fff',
        fontWeight: 700,
        fontSize: 17,
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

      {/* Floating legal terms */}
      {['§', '¶', '©', '™', '®', '§'].map((sym, i) => (
        <div key={`s-${i}`} style={{
          position: 'absolute',
          color: stages[stage].color,
          opacity: 0.08,
          fontSize: 20 + i * 4,
          fontWeight: 700,
          top: `${10 + i * 15}%`,
          left: `${8 + i * 16}%`,
          animation: `float-legal ${2.5 + i * 0.4}s ease-in-out infinite alternate`,
        }}>
          {sym}
        </div>
      ))}

      <style>{`
        @keyframes float-legal {
          0% { transform: translateY(0px); opacity: 0.05; }
          100% { transform: translateY(-10px); opacity: 0.12; }
        }
      `}</style>
    </div>
  );
}
