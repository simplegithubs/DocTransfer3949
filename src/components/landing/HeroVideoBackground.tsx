import React, { useState, useEffect, useRef } from 'react';
import './HeroVideoBackground.css';

export interface VideoScene {
  id: string;
  title: string;
  shortLabel: string;
  badge: string;
  description: string;
  src: string;
  featureKey: string;
}

const VIDEO_SCENES: VideoScene[] = [
  {
    id: 'pitching',
    title: 'Pitch Decks & Deals',
    shortLabel: 'Pitching',
    badge: 'Step 1: Pitch',
    description: 'Present pitch decks with real-time viewer tracking',
    src: '/videos/hero-1-pitching.mp4',
    featureKey: 'upload'
  },
  {
    id: 'diligence',
    title: 'Due Diligence & Audit',
    shortLabel: 'Diligence',
    badge: 'Step 2: Review',
    description: 'Zero-knowledge encrypted review with audit trails',
    src: '/videos/hero-2-diligence.mp4',
    featureKey: 'permissions'
  },
  {
    id: 'analytics',
    title: 'Visitor Analytics',
    shortLabel: 'Analytics',
    badge: 'Step 3: Track',
    description: 'Second-by-second page dwell time analytics',
    src: '/videos/hero-3-analytics.mp4',
    featureKey: 'analytics'
  },
  {
    id: 'closing',
    title: 'Deal Closing & Signatures',
    shortLabel: 'Closing',
    badge: 'Step 4: Close',
    description: 'Legally binding e-signatures & executive closing',
    src: '/videos/hero-4-closing.mp4',
    featureKey: 'esignature'
  }
];

interface HeroVideoBackgroundProps {
  activeFeature?: string;
  onSceneChange?: (scene: VideoScene) => void;
}

const HeroVideoBackground: React.FC<HeroVideoBackgroundProps> = ({
  activeFeature,
  onSceneChange
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync with activeFeature if changed from outside
  useEffect(() => {
    if (!activeFeature) return;
    const matchingIdx = VIDEO_SCENES.findIndex(s => s.featureKey === activeFeature);
    if (matchingIdx !== -1 && matchingIdx !== currentIndex) {
      setCurrentIndex(matchingIdx);
      onSceneChange?.(VIDEO_SCENES[matchingIdx]);
    }
  }, [activeFeature]);

  // Handle active video playback
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === currentIndex) {
        if (isPlaying) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Autoplay policy handled
            });
          }
        } else {
          video.pause();
        }
      } else {
        const timeout = setTimeout(() => {
          if (video && idx !== currentIndex) {
            video.pause();
          }
        }, 1200);
        return () => clearTimeout(timeout);
      }
    });
  }, [currentIndex, isPlaying]);

  // Auto-rotation timer (switches every 9 seconds when playing)
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const next = (prev + 1) % VIDEO_SCENES.length;
        onSceneChange?.(VIDEO_SCENES[next]);
        return next;
      });
    }, 9000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, onSceneChange]);

  return (
    <div className="hero-video-bg-container" aria-hidden="true">
      {/* Video Layers with Hardware-Accelerated Crossfade */}
      <div className="hero-video-layers">
        {VIDEO_SCENES.map((scene, idx) => (
          <video
            key={scene.id}
            ref={el => {
              videoRefs.current[idx] = el;
            }}
            src={scene.src}
            className={`hero-video-layer ${idx === currentIndex ? 'active' : ''}`}
            autoPlay
            loop
            muted
            playsInline
            preload={idx === 0 ? 'auto' : 'metadata'}
          />
        ))}
      </div>

      {/* Papermark-style Dual Dark Overlay */}
      <div className="hero-video-overlay" />

      {/* Ambient Glow Orbs */}
      <div className="hero-ambient-glow glow-1" />
      <div className="hero-ambient-glow glow-2" />
    </div>
  );
};

export default HeroVideoBackground;
