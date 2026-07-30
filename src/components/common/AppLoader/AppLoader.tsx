import React, { useEffect, useState } from 'react';
import { NavbarTransition } from './NavbarTransition';

interface AppLoaderProps {
  onComplete: () => void;
  textColor?: string;
}

export const AppLoader: React.FC<AppLoaderProps> = ({
  onComplete,
  textColor = '#162A3B'
}) => {
  const [stage, setStage] = useState<number>(1);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    // Check prefers-reduced-motion for accessibility compliance
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      onComplete();
      setIsFinished(true);
      return;
    }

    // STAGE 1: Logo Appears Dead-Centered (0ms - 1000ms)
    const stage2Timer = setTimeout(() => {
      setStage(2); // STAGE 2: Build Brand "KONTAGI" (1000ms - 2400ms)
    }, 1000);

    const stage3Timer = setTimeout(() => {
      setStage(3); // STAGE 3: Brand Signature Word Rotation (2400ms - 4200ms)
    }, 2400);

    const stage4Timer = setTimeout(() => {
      setStage(4); // STAGE 4: Continuous Glide from Dead Center to Navbar (4200ms - 5300ms)
    }, 4200);

    const finishTimer = setTimeout(() => {
      setIsFinished(true);
      onComplete(); // STAGE 5: Staggered Application Reveal (5300ms - 5800ms)
    }, 5400);

    return () => {
      clearTimeout(stage2Timer);
      clearTimeout(stage3Timer);
      clearTimeout(stage4Timer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  if (isFinished) return null;

  return (
    <div className={`app-loader-overlay ${stage === 4 ? 'docking' : ''}`}>
      {/* MICRO DETAILS: WARM RADIAL GLOW & SUBTLE AMBIENT PARTICLES */}
      <div className="ambient-radial-glow" />
      <div className="ambient-noise-texture" />

      {/* FLOATING AMBIENT DUST PARTICLES */}
      <div className="dust-particles">
        <div className="particle p1" />
        <div className="particle p2" />
        <div className="particle p3" />
        <div className="particle p4" />
      </div>

      {/* STAGES 1 TO 4 CONTINUOUS NAVBAR TRANSITION FROM DEAD CENTER */}
      <NavbarTransition stage={stage} textColor={textColor} />

      <style>{`
        .app-loader-overlay {
          position: fixed;
          inset: 0;
          z-index: 999999;
          background-color: #FAF7F2;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          will-change: opacity, background-color;
          transition: background-color 1.1s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1);
          transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        .app-loader-overlay.docking {
          background-color: rgba(250, 247, 242, 0);
          opacity: 0;
          pointer-events: none;
        }

        .ambient-radial-glow {
          position: absolute;
          width: 700px;
          height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 107, 61, 0.16) 0%, rgba(255, 107, 61, 0) 70%);
          pointer-events: none;
          animation: ambientGlowPulse 3.5s ease-in-out infinite alternate;
        }

        .ambient-noise-texture {
          position: absolute;
          inset: 0;
          opacity: 0.025;
          pointer-events: none;
          background-image: radial-gradient(#162A3B 1px, transparent 0);
          background-size: 24px 24px;
        }

        /* FLOATING DUST PARTICLES */
        .dust-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 107, 61, 0.35);
          filter: blur(1px);
        }

        .p1 { width: 4px; height: 4px; top: 35%; left: 30%; animation: particleFloat 4s ease-in-out infinite alternate; }
        .p2 { width: 3px; height: 3px; top: 60%; left: 68%; animation: particleFloat 3.6s ease-in-out infinite alternate 0.5s; }
        .p3 { width: 5px; height: 5px; top: 25%; left: 75%; animation: particleFloat 4.2s ease-in-out infinite alternate 1s; }
        .p4 { width: 3px; height: 3px; top: 70%; left: 25%; animation: particleFloat 3.8s ease-in-out infinite alternate 1.5s; }

        @keyframes ambientGlowPulse {
          0% { transform: scale(0.85); opacity: 0.4; }
          100% { transform: scale(1.2); opacity: 0.85; }
        }

        @keyframes particleFloat {
          0% { transform: translateY(0) translateX(0); opacity: 0.2; }
          100% { transform: translateY(-24px) translateX(10px); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};
