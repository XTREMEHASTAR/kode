import React, { useEffect, useState } from 'react';
import { BrandSignature } from './BrandSignature';
import kontagiLogo from '../../assets/branding/kontagi-icon-180x180.png';

interface PreloaderIntroProps {
  onComplete: () => void;
  textColor?: string;
}

const SOCIAL_PLATFORMS = [
  {
    name: 'YouTube',
    color: '#FF0000',
    bg: 'rgba(255, 0, 0, 0.12)',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="#FF0000">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  },
  {
    name: 'Instagram',
    color: '#E1306C',
    bg: 'rgba(225, 48, 108, 0.12)',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    )
  },
  {
    name: 'TikTok',
    color: '#00F2FE',
    bg: 'rgba(0, 242, 254, 0.12)',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="#00F2FE">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-1.16V9.25a6.34 6.34 0 0 0-5.11 6.16A6.34 6.34 0 0 0 10.7 21.75a6.34 6.34 0 0 0 6.34-6.34V9a8.16 8.16 0 0 0 4.77 1.52V7.07a4.85 4.85 0 0 1-2.22-.38z"/>
      </svg>
    )
  },
  {
    name: 'X',
    color: '#1DA1F2',
    bg: 'rgba(29, 161, 242, 0.12)',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="#1DA1F2">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  }
];

export const PreloaderIntro: React.FC<PreloaderIntroProps> = ({ onComplete, textColor = '#162A3B' }) => {
  const [platformIndex, setPlatformIndex] = useState(0);
  const [stage, setStage] = useState<'social-cycle' | 'kontagi-reveal' | 'docking' | 'finished'>('social-cycle');

  useEffect(() => {
    // 1. Comfortable, smooth social media logo cycle (320ms per icon)
    const cycleInterval = setInterval(() => {
      setPlatformIndex((prev) => (prev + 1) % SOCIAL_PLATFORMS.length);
    }, 320);

    // 2. Smoothly morph into KONTAGI Logo & Brand Signature in center (at 1280ms)
    const revealTimer = setTimeout(() => {
      clearInterval(cycleInterval);
      setStage('kontagi-reveal');
    }, 1280);

    // 3. Smooth fade & glide hand-off into page (at 2200ms)
    const dockTimer = setTimeout(() => {
      setStage('docking');
    }, 2200);

    // 4. Complete preloader (at 2800ms)
    const finishTimer = setTimeout(() => {
      setStage('finished');
      onComplete();
    }, 2800);

    return () => {
      clearInterval(cycleInterval);
      clearTimeout(revealTimer);
      clearTimeout(dockTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  if (stage === 'finished') return null;

  return (
    <div className={`preloader-overlay ${stage}`}>
      {/* BACKGROUND AMBIENT GLOW */}
      <div className="preloader-glow" />

      {/* PHASE 1: PRE-RENDERED SOCIAL MEDIA LOGOS WITH OPACITY CROSSFADE */}
      <div className={`social-stage ${stage === 'social-cycle' ? 'active' : 'hidden'}`}>
        {SOCIAL_PLATFORMS.map((platform, idx) => (
          <div
            key={platform.name}
            className={`social-icon-circle ${idx === platformIndex ? 'active' : ''}`}
            style={{
              background: platform.bg,
              borderColor: platform.color,
              boxShadow: `0 14px 40px ${platform.bg}`
            }}
          >
            {platform.icon}
          </div>
        ))}
      </div>

      {/* PHASE 2 & 3: KONTAGI BRAND REVEAL & SMOOTH TRANSITION */}
      <div className={`kontagi-brand-stage ${stage}`}>
        <img
          src={kontagiLogo}
          alt="Kontagi Logo"
          className="kontagi-brand-logo"
        />
        <BrandSignature size="header" prefixColor={textColor} wordColor="#FF6B3D" />
      </div>

      {/* BUTTERY SMOOTH STYLES */}
      <style>{`
        .preloader-overlay {
          position: fixed;
          inset: 0;
          z-index: 999999;
          background-color: #FAF7F2;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          will-change: opacity, background-color;
          transition: background-color 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .preloader-overlay.docking {
          background-color: rgba(250, 247, 242, 0);
          opacity: 0;
          pointer-events: none;
        }

        .preloader-glow {
          position: absolute;
          width: 480px;
          height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 107, 61, 0.16) 0%, rgba(255, 107, 61, 0) 70%);
          will-change: transform, opacity;
          animation: glowPulse 2s ease-in-out infinite alternate;
        }

        /* PHASE 1: PRE-RENDERED OPACITY CROSSFADE (ZERO DOM JANK) */
        .social-stage {
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .social-stage.hidden {
          opacity: 0;
          transform: scale(0.85);
          pointer-events: none;
        }

        .social-icon-circle {
          position: absolute;
          inset: 0;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-sizing: border-box;
          opacity: 0;
          transform: scale(0.9);
          will-change: opacity, transform;
          transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .social-icon-circle.active {
          opacity: 1;
          transform: scale(1);
        }

        /* PHASE 2 & 3: KONTAGI BRAND REVEAL & NAVBAR TRANSITION */
        .kontagi-brand-stage {
          position: absolute;
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 14px;
          opacity: 0;
          transform: scale(0.9);
          will-change: transform, opacity;
          transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease;
          pointer-events: none;
        }

        .kontagi-brand-stage.kontagi-reveal {
          opacity: 1;
          transform: scale(1.12);
        }

        .kontagi-brand-stage.docking {
          opacity: 0.95;
          transform: translateY(-160px) scale(1);
        }

        .kontagi-brand-logo {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          box-shadow: 0 4px 14px rgba(255, 107, 61, 0.3);
          object-fit: cover;
        }

        @keyframes glowPulse {
          0% { transform: scale(0.85); opacity: 0.5; }
          100% { transform: scale(1.2); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
};
