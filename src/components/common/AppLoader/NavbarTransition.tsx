import React from 'react';
import { LogoAnimation } from './LogoAnimation';
import { BrandWordRotation } from './BrandWordRotation';

interface NavbarTransitionProps {
  stage: number; // 1 to 4
  textColor?: string;
}

export const NavbarTransition: React.FC<NavbarTransitionProps> = ({
  stage,
  textColor = '#162A3B'
}) => {
  return (
    <div className={`navbar-transition-stage stage-${stage}`}>
      <LogoAnimation stage={stage} />
      {stage >= 2 && (
        <div className="brand-word-wrapper">
          <BrandWordRotation stage={stage} textColor={textColor} />
        </div>
      )}

      <style>{`
        .navbar-transition-stage {
          position: fixed;
          top: 50vh;
          left: 50vw;
          z-index: 9999999;
          display: flex;
          align-items: center;
          gap: 14px;
          will-change: transform, opacity;
          transform: translate3d(-50%, -50%, 0) scale(1.14);
          transition: transform 1.1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease;
          pointer-events: none;
        }

        .navbar-transition-stage.stage-4 {
          transform: translate3d(-50%, calc(-50vh + 46px), 0) scale(1);
          opacity: 0.98;
        }

        .brand-word-wrapper {
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  );
};
