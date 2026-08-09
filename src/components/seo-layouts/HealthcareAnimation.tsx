import { useEffect, useState } from 'react';

interface HealthcareAnimationProps {
  slug?: string;
}

export default function HealthcareAnimation({ slug }: HealthcareAnimationProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage(s => (s + 1) % 4);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const stages = [
    { label: 'Upload Records', icon: '📋', color: '#10b981' },
    { label: 'HIPAA Encrypt', icon: '🛡️', color: '#3b82f6' },
    { label: 'Patient Signs', icon: '✍️', color: '#8b5cf6' },
    { label: 'Sealed & Compliant', icon: '✅', color: '#06b6d4' },
  ];

  return (
    <div style={{
      width: '100%',
      minHeight: 260,
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      borderRadius: 16,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
      padding: '32px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background pulse */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${stages[stage].color}22 0%, transparent 70%)`,
        transform: 'translate(-50%, -50%)',
        transition: 'background 0.6s ease',
      }} />

      {/* HIPAA Shield */}
      <div style={{
        position: 'relative',
        width: 80,
        height: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg viewBox="0 0 80 90" width="80" height="90">
          <defs>
            <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={stages[stage].color} />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <path
            d="M40 5 L75 20 L75 50 Q75 75 40 88 Q5 75 5 50 L5 20 Z"
            fill="none"
            stroke="url(#shieldGrad)"
            strokeWidth="2.5"
            style={{ transition: 'all 0.6s ease' }}
          />
          <text x="40" y="52" textAnchor="middle" fontSize="28" style={{ transition: 'all 0.4s ease' }}>
            {stages[stage].icon}
          </text>
        </svg>
      </div>

      {/* Stage label */}
      <div style={{
        color: '#fff',
        fontWeight: 700,
        fontSize: 18,
        letterSpacing: '-0.01em',
        transition: 'all 0.4s ease',
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

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div key={`p-${i}`} style={{
          position: 'absolute',
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: stages[stage].color,
          opacity: 0.3,
          top: `${15 + i * 14}%`,
          left: `${10 + i * 15}%`,
          animation: `float-healthcare ${2 + i * 0.3}s ease-in-out infinite alternate`,
        }} />
      ))}

      <style>{`
        @keyframes float-healthcare {
          0% { transform: translateY(0px) scale(1); opacity: 0.2; }
          100% { transform: translateY(-12px) scale(1.4); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
