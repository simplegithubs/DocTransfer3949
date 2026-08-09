import { useEffect, useState } from 'react';

interface BuildAnimationProps {
  slug?: string;
}

export default function BuildAnimation({ slug }: BuildAnimationProps) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage(s => (s + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tick = setInterval(() => {
      setProgress(p => (p + 1) % 100);
    }, 80);
    return () => clearInterval(tick);
  }, []);

  const stages = [
    { label: 'Upload Blueprints', icon: '📐', color: '#f97316' },
    { label: 'Sign Change Order', icon: '📋', color: '#eab308' },
    { label: 'Track Reviews', icon: '👁️', color: '#3b82f6' },
    { label: 'Project Complete', icon: '🏗️', color: '#10b981' },
  ];

  return (
    <div style={{
      width: '100%',
      minHeight: 260,
      background: 'linear-gradient(135deg, #1a1405 0%, #1c1917 50%, #1a1405 100%)',
      borderRadius: 16,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 18,
      padding: '28px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Blueprint grid background */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.06 }}>
        <defs>
          <pattern id="bp-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#60a5fa" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bp-grid)" />
      </svg>

      {/* Main icon with hard hat */}
      <div style={{
        fontSize: 44,
        transition: 'transform 0.5s ease',
        transform: `rotate(${stage * 5 - 10}deg)`,
        filter: `drop-shadow(0 0 12px ${stages[stage].color}44)`,
      }}>
        {stages[stage].icon}
      </div>

      {/* Progress timeline */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        width: '80%',
        maxWidth: 280,
      }}>
        {stages.map((s, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: i <= stage ? s.color : '#374151',
              border: `2px solid ${i <= stage ? s.color : '#4b5563'}`,
              transition: 'all 0.4s ease',
              boxShadow: i === stage ? `0 0 12px ${s.color}88` : 'none',
              zIndex: 1,
            }} />
            {i < 3 && (
              <div style={{
                flex: 1,
                height: 3,
                background: i < stage ? stages[i + 1].color : '#374151',
                transition: 'background 0.4s ease',
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Stage label */}
      <div style={{
        color: '#fff',
        fontWeight: 700,
        fontSize: 17,
        transition: 'all 0.4s ease',
      }}>
        {stages[stage].label}
      </div>

      {/* Loading bar */}
      <div style={{
        width: '70%',
        maxWidth: 240,
        height: 6,
        background: '#27272a',
        borderRadius: 3,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${(stage * 25) + (progress * 0.25)}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${stages[stage].color}, ${stages[Math.min(stage + 1, 3)].color})`,
          borderRadius: 3,
          transition: 'width 0.08s linear, background 0.4s ease',
        }} />
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
    </div>
  );
}
