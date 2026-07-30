import React from 'react';

interface PageRevealProps {
  isRevealed: boolean;
  children: React.ReactNode;
}

export const PageReveal: React.FC<PageRevealProps> = ({ isRevealed, children }) => {
  return (
    <div className={`page-reveal-wrapper ${isRevealed ? 'revealed' : 'hidden'}`}>
      {children}

      <style>{`
        .page-reveal-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: opacity 0.5s ease;
        }

        .page-reveal-wrapper.hidden {
          opacity: 0;
          pointer-events: none;
        }

        .page-reveal-wrapper.revealed {
          opacity: 1;
        }

        /* STAGGERED REVEAL ANIMATIONS FOR CHILDREN SECTIONS */
        .page-reveal-wrapper.revealed nav {
          animation: revealStagger 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0ms forwards;
        }

        .page-reveal-wrapper.revealed section:nth-of-type(1) {
          animation: revealStagger 0.5s cubic-bezier(0.16, 1, 0.3, 1) 70ms forwards;
        }

        .page-reveal-wrapper.revealed section:nth-of-type(2) {
          animation: revealStagger 0.5s cubic-bezier(0.16, 1, 0.3, 1) 140ms forwards;
        }

        .page-reveal-wrapper.revealed section:nth-of-type(3) {
          animation: revealStagger 0.5s cubic-bezier(0.16, 1, 0.3, 1) 210ms forwards;
        }

        .page-reveal-wrapper.revealed section:nth-of-type(4) {
          animation: revealStagger 0.5s cubic-bezier(0.16, 1, 0.3, 1) 280ms forwards;
        }

        @keyframes revealStagger {
          0% {
            opacity: 0;
            transform: translateY(16px) translateZ(0);
            filter: blur(6px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) translateZ(0);
            filter: blur(0);
          }
        }
      `}</style>
    </div>
  );
};
