import React from 'react';
import kontagiLogo from '../../../assets/branding/kontagi-icon-180x180.png';

interface LogoAnimationProps {
  stage: number; // 1: appear, 2: build, 3: signature, 4: navbar transition
}

export const LogoAnimation: React.FC<LogoAnimationProps> = ({ stage }) => {
  return (
    <div className={`app-loader-icon-wrap stage-${stage}`}>
      {/* AMBIENT SOFT ORANGE GLOW */}
      <div className="icon-ambient-glow" />
      
      {/* KONTAGI LOGO ICON */}
      <img
        src={kontagiLogo}
        alt="Kontagi Icon"
        className="kontagi-brand-icon"
      />

      <style>{`
        .app-loader-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          will-change: transform, opacity;
        }

        .icon-ambient-glow {
          position: absolute;
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 107, 61, 0.28) 0%, rgba(255, 107, 61, 0) 70%);
          filter: blur(12px);
          animation: ambientPulse 2s ease-in-out infinite alternate;
          pointer-events: none;
        }

        .kontagi-brand-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(255, 107, 61, 0.24), 0 2px 8px rgba(22, 42, 59, 0.08);
          object-fit: cover;
          position: relative;
          z-index: 2;
          transform-origin: center center;
          animation: logoStage1Appear 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes logoStage1Appear {
          0% {
            opacity: 0;
            transform: scale(0.92) translateZ(0);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateZ(0);
            filter: blur(0);
          }
        }

        @keyframes ambientPulse {
          0% { transform: scale(0.85); opacity: 0.6; }
          100% { transform: scale(1.15); opacity: 0.95; }
        }
      `}</style>
    </div>
  );
};
