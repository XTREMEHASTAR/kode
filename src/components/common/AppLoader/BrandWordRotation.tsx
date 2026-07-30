import React, { useEffect, useState } from 'react';

interface BrandWordRotationProps {
  stage: number; // 2: build letters, 3: signature rotation, 4: navbar transition
  textColor?: string;
}

const BRAND_LETTERS = ['K', 'O', 'N', 'T', 'A', 'G', 'I'];
const SIGNATURE_WORDS = ['Analyze', 'Predict', 'Simulate', 'Optimize', 'Scale'];

export const BrandWordRotation: React.FC<BrandWordRotationProps> = ({
  stage,
  textColor = '#162A3B'
}) => {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (stage < 3) return;

    // Cinematic, unhurried rotation of product signature words (700ms per word)
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % SIGNATURE_WORDS.length);
    }, 700);

    return () => clearInterval(interval);
  }, [stage]);

  const currentSuffix = SIGNATURE_WORDS[wordIndex];

  return (
    <div className="brand-word-rotation-container">
      {/* STAGE 2: INDIVIDUAL LETTER BUILD "KONTAGI" */}
      {stage === 2 && (
        <div className="brand-letters-wrapper">
          {BRAND_LETTERS.map((letter, idx) => (
            <span
              key={idx}
              className="brand-letter"
              style={{
                animationDelay: `${idx * 140}ms`,
                color: textColor
              }}
            >
              {letter}
            </span>
          ))}
        </div>
      )}

      {/* STAGE 3 & 4: BRAND SIGNATURE WITH ROTATING SUFFIX */}
      {(stage === 3 || stage === 4) && (
        <div className="brand-signature-wrapper">
          {/* STATIONARY PREFIX */}
          <span className="brand-prefix" style={{ color: textColor }}>
            KONTAGI.
          </span>

          {/* ROTATING SUFFIX */}
          <span className="brand-suffix-box" key={currentSuffix}>
            <span className="brand-suffix-word">
              {currentSuffix}
            </span>
          </span>
        </div>
      )}

      <style>{`
        .brand-word-rotation-container {
          display: inline-flex;
          align-items: center;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          user-select: none;
        }

        /* STAGE 2: LETTER BUILD ANIMATION */
        .brand-letters-wrapper {
          display: flex;
          align-items: center;
          gap: 1.5px;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .brand-letter {
          display: inline-block;
          opacity: 0;
          transform: translateY(14px) translateZ(0);
          filter: blur(5px);
          animation: letterBuildIn 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          will-change: transform, opacity, filter;
        }

        /* STAGE 3 & 4: SIGNATURE ROTATION */
        .brand-signature-wrapper {
          display: flex;
          align-items: center;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.02em;
          white-space: nowrap;
        }

        .brand-prefix {
          font-weight: 800;
        }

        .brand-suffix-box {
          display: inline-block;
          position: relative;
          overflow: hidden;
          vertical-align: bottom;
        }

        .brand-suffix-word {
          display: inline-block;
          color: #FF6B3D;
          opacity: 0;
          transform: translateY(12px) translateZ(0);
          filter: blur(4px);
          animation: suffixSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity, filter;
        }

        @keyframes letterBuildIn {
          0% {
            opacity: 0;
            transform: translateY(14px) translateZ(0);
            filter: blur(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) translateZ(0);
            filter: blur(0);
          }
        }

        @keyframes suffixSlideIn {
          0% {
            opacity: 0;
            transform: translateY(-12px) translateZ(0);
            filter: blur(4px);
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
