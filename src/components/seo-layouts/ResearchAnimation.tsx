import React, { useEffect, useState } from 'react';

interface ResearchAnimationProps {
  slug: string;
  isCompact?: boolean;
}

const ResearchAnimation: React.FC<ResearchAnimationProps> = ({ slug, isCompact = false }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Determine color scheme based on category/slug
  const getColors = () => {
    if (slug.includes('pitch-deck') || slug.includes('fundraising')) {
      return { primary: '#4f46e5', secondary: '#7c3aed', accent: '#a855f7', bg: '#ede9fe' };
    }
    if (slug.includes('security')) {
      return { primary: '#059669', secondary: '#10b981', accent: '#34d399', bg: '#d1fae5' };
    }
    if (slug.includes('nda') || slug.includes('legal')) {
      return { primary: '#d97706', secondary: '#f59e0b', accent: '#fbbf24', bg: '#fef3c7' };
    }
    return { primary: '#4f46e5', secondary: '#6366f1', accent: '#818cf8', bg: '#e0e7ff' };
  };

  const colors = getColors();
  const height = isCompact ? 200 : 300;
  const barWidth = isCompact ? 28 : 40;
  const barGap = isCompact ? 12 : 20;
  const barData = [
    { height: 0.85, label: 'Team' },
    { height: 0.72, label: 'Finance' },
    { height: 0.65, label: 'Market' },
    { height: 0.58, label: 'Traction' },
    { height: 0.45, label: 'Product' },
    { height: 0.38, label: 'Problem' },
  ];

  const totalWidth = barData.length * (barWidth + barGap) - barGap;
  const chartAreaHeight = height * 0.65;
  const chartStartY = height * 0.1;

  return (
    <div style={{
      width: '100%',
      height: `${height}px`,
      background: `linear-gradient(135deg, ${colors.bg} 0%, white 100%)`,
      borderRadius: isCompact ? '24px 24px 0 0' : '24px',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: isCompact ? 0 : '2rem'
    }}>
      {/* Decorative circles */}
      <div style={{
        position: 'absolute',
        top: '-30%',
        right: '-10%',
        width: isCompact ? '120px' : '200px',
        height: isCompact ? '120px' : '200px',
        background: `${colors.primary}08`,
        borderRadius: '50%'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '-5%',
        width: isCompact ? '80px' : '150px',
        height: isCompact ? '80px' : '150px',
        background: `${colors.secondary}08`,
        borderRadius: '50%'
      }} />

      {/* SVG Chart Animation */}
      <svg
        width={totalWidth + 60}
        height={height * 0.85}
        viewBox={`0 0 ${totalWidth + 60} ${height * 0.85}`}
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1.0].map((ratio, i) => (
          <line
            key={i}
            x1={30}
            y1={chartStartY + chartAreaHeight * (1 - ratio)}
            x2={totalWidth + 40}
            y2={chartStartY + chartAreaHeight * (1 - ratio)}
            stroke={`${colors.primary}15`}
            strokeDasharray="4 4"
          />
        ))}

        {/* Bars */}
        {barData.map((bar, i) => {
          const barH = chartAreaHeight * bar.height;
          const x = 35 + i * (barWidth + barGap);
          const y = chartStartY + chartAreaHeight - barH;

          return (
            <g key={i}>
              {/* Bar shadow */}
              <rect
                x={x + 2}
                y={y + 2}
                width={barWidth}
                height={barH}
                rx={barWidth / 4}
                fill={`${colors.primary}10`}
              />
              {/* Bar */}
              <rect
                x={x}
                y={animated ? y : chartStartY + chartAreaHeight}
                width={barWidth}
                height={animated ? barH : 0}
                rx={barWidth / 4}
                fill={`url(#barGrad-${i})`}
                style={{
                  transition: `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s`,
                }}
              />
              {/* Value label */}
              {!isCompact && (
                <text
                  x={x + barWidth / 2}
                  y={animated ? y - 8 : chartStartY + chartAreaHeight - 8}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill={colors.primary}
                  style={{
                    opacity: animated ? 1 : 0,
                    transition: `opacity 0.4s ease ${0.6 + i * 0.1}s`,
                  }}
                >
                  {Math.round(bar.height * 50)}s
                </text>
              )}
              {/* Label */}
              <text
                x={x + barWidth / 2}
                y={chartStartY + chartAreaHeight + (isCompact ? 14 : 18)}
                textAnchor="middle"
                fontSize={isCompact ? '8' : '10'}
                fontWeight="600"
                fill="#64748b"
              >
                {bar.label}
              </text>

              {/* Gradient definition */}
              <defs>
                <linearGradient id={`barGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.primary} stopOpacity={1 - i * 0.1} />
                  <stop offset="100%" stopColor={colors.secondary} stopOpacity={0.7 - i * 0.08} />
                </linearGradient>
              </defs>
            </g>
          );
        })}

        {/* Trend line overlay */}
        <polyline
          points={barData.map((bar, i) => {
            const x = 35 + i * (barWidth + barGap) + barWidth / 2;
            const y = chartStartY + chartAreaHeight * (1 - bar.height) - 3;
            return `${x},${animated ? y : chartStartY + chartAreaHeight}`;
          }).join(' ')}
          fill="none"
          stroke={colors.accent}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s',
            opacity: animated ? 0.6 : 0,
          }}
        />

        {/* Trend line dots */}
        {barData.map((bar, i) => {
          const x = 35 + i * (barWidth + barGap) + barWidth / 2;
          const y = chartStartY + chartAreaHeight * (1 - bar.height) - 3;
          return (
            <circle
              key={`dot-${i}`}
              cx={x}
              cy={animated ? y : chartStartY + chartAreaHeight}
              r="3"
              fill="white"
              stroke={colors.accent}
              strokeWidth="2"
              style={{
                transition: `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.4 + i * 0.1}s`,
                opacity: animated ? 0.8 : 0,
              }}
            />
          );
        })}
      </svg>

      {/* Floating stat badge */}
      {!isCompact && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '16px',
          background: 'white',
          border: `1px solid ${colors.primary}20`,
          borderRadius: '16px',
          padding: '0.75rem 1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          opacity: animated ? 1 : 0,
          transform: animated ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'all 0.6s ease 0.8s',
          zIndex: 2,
        }}>
          <div style={{ fontSize: '1.25rem', fontWeight: '900', color: colors.primary, lineHeight: 1 }}>
            3m 44s
          </div>
          <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '600', marginTop: '2px' }}>
            Avg. View Time
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchAnimation;
