import { useEffect, useState } from 'react';

interface WorkforceAnimationProps {
  slug?: string;
}

export default function WorkforceAnimation({ slug }: WorkforceAnimationProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage(s => (s + 1) % 4);
    }, 2300);
    return () => clearInterval(interval);
  }, []);

  const stages = [
    { label: 'Onboard Employee', icon: '👤', color: '#6366f1' },
    { label: 'Sign Documents', icon: '📝', color: '#ec4899' },
    { label: 'Verify Identity', icon: '🔍', color: '#f59e0b' },
    { label: 'Access Granted', icon: '🎉', color: '#10b981' },
  ];

  const checklistItems = [
    { text: 'Offer Letter', done: stage >= 1 },
    { text: 'NDA Signed', done: stage >= 2 },
    { text: 'W-4 Form', done: stage >= 2 },
    { text: 'I-9 Verified', done: stage >= 3 },
    { text: 'Benefits Enrolled', done: stage >= 3 },
  ];

  return (
    <div style={{
      width: '100%',
      minHeight: 260,
      background: 'linear-gradient(135deg, #0f0a1e 0%, #1a1035 50%, #0f0a1e 100%)',
      borderRadius: 16,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      padding: '28px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated person icon */}
      <div style={{
        fontSize: 40,
        transition: 'transform 0.5s ease',
        transform: stage === 3 ? 'scale(1.2)' : 'scale(1)',
      }}>
        {stages[stage].icon}
      </div>

      {/* Checklist */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        background: '#1e1b4b22',
        borderRadius: 10,
        padding: '12px 20px',
        border: `1px solid ${stages[stage].color}33`,
        transition: 'border-color 0.4s ease',
      }}>
        {checklistItems.map((item, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.3s ease',
            opacity: item.done ? 1 : 0.4,
          }}>
            <div style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              border: `2px solid ${item.done ? stages[stage].color : '#475569'}`,
              background: item.done ? stages[stage].color : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              fontSize: 10,
              color: '#fff',
              fontWeight: 700,
            }}>
              {item.done ? '✓' : ''}
            </div>
            <span style={{
              color: item.done ? '#e2e8f0' : '#64748b',
              fontSize: 13,
              fontWeight: 500,
              textDecoration: item.done ? 'line-through' : 'none',
              transition: 'all 0.3s ease',
            }}>
              {item.text}
            </span>
          </div>
        ))}
      </div>

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

      {/* Confetti on completion */}
      {stage === 3 && [...Array(12)].map((_, i) => (
        <div key={`c-${i}`} style={{
          position: 'absolute',
          width: 6,
          height: 6,
          borderRadius: i % 2 ? '50%' : 1,
          background: ['#10b981', '#f59e0b', '#ec4899', '#6366f1', '#3b82f6'][i % 5],
          opacity: 0.7,
          animation: `confetti-workforce ${1 + Math.random()}s ease-out forwards`,
          top: '40%',
          left: '50%',
        }} />
      ))}

      <style>{`
        @keyframes confetti-workforce {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(${Math.random() > 0.5 ? '' : '-'}${40 + Math.random() * 60}px, ${-30 - Math.random() * 80}px) rotate(${360 + Math.random() * 360}deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
