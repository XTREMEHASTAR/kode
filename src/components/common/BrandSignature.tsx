import React, { useEffect, useState, useMemo } from 'react';
import { BrandWordmark } from './BrandWordmark';

export const DEFAULT_BRAND_WORDS = [
  "Analyze",
  "Predict",
  "Simulate",
  "Optimize",
  "Scale"
];

export interface BrandSignatureProps {
  /** Configurable array of brand words */
  words?: string[];
  /** Fixed brand name prefix (default: "KONTAGI") */
  prefix?: string;
  /** Fixed dot separator (default: ".") */
  period?: string;
  /** Duration of transition animation in seconds (default: 0.6 = 600ms) */
  transitionDuration?: number;
  /** Pause duration on each word in milliseconds (default: 2000 = 2 seconds) */
  pauseDuration?: number;
  /** Custom CSS classes */
  className?: string;
  /** Presets for typography sizing */
  size?: 'header' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  /** Primary text color for prefix (default: "#162A3B") */
  prefixColor?: string;
  /** Accent text color for animated word (default: "#FF6B3D") */
  wordColor?: string;
  /** Custom font size for prefix (e.g. "20px") */
  prefixFontSize?: string;
  /** Custom font size for animated word (e.g. "13px") */
  wordFontSize?: string;
  /** Custom font weight for animated word */
  wordFontWeight?: number | string;
  /** Enable subtle glow micro-interaction on active word */
  showGlow?: boolean;
}

export const BrandSignature: React.FC<BrandSignatureProps> = ({
  words = DEFAULT_BRAND_WORDS,
  prefix = "KONTAGI",
  period = ".",
  transitionDuration = 0.6,
  pauseDuration = 2000,
  className = "",
  size = "header",
  prefixColor = "#162A3B",
  wordColor = "#FF6B3D",
  prefixFontSize,
  wordFontSize,
  wordFontWeight,
  showGlow = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);

  const safeWords = useMemo(() => {
    return Array.isArray(words) && words.length > 0 ? words : DEFAULT_BRAND_WORDS;
  }, [words]);

  const activeWord = safeWords[currentIndex % safeWords.length] || "Analyze";

  // 1. Page Visibility API listener - Pause animation when tab is inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined') {
        setIsTabVisible(!document.hidden);
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    };
  }, []);

  // 2. Loop timer logic (pause + transition)
  useEffect(() => {
    if (!isTabVisible || safeWords.length <= 1) return;

    const intervalTime = pauseDuration + transitionDuration * 1000;
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % safeWords.length);
        setIsAnimating(false);
      }, transitionDuration * 500);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [safeWords, pauseDuration, transitionDuration, isTabVisible]);

  // Typography sizing configurations
  const typography = useMemo(() => {
    if (prefixFontSize || wordFontSize) {
      return {
        prefixSize: prefixFontSize || '20px',
        wordSize: wordFontSize || '13px',
        wordWeight: wordFontWeight || 800
      };
    }

    switch (size) {
      case 'header':
        return {
          prefixSize: '26px',
          wordSize: '16px',
          wordWeight: 800
        };
      case 'sm':
        return {
          prefixSize: '1.25rem',
          wordSize: '0.875rem',
          wordWeight: 800
        };
      case 'md':
        return {
          prefixSize: '2rem',
          wordSize: '1.25rem',
          wordWeight: 800
        };
      case 'lg':
        return {
          prefixSize: '3rem',
          wordSize: '1.75rem',
          wordWeight: 800
        };
      case 'xl':
        return {
          prefixSize: '4rem',
          wordSize: '2.25rem',
          wordWeight: 800
        };
      case 'hero':
      default:
        return {
          prefixSize: 'clamp(2.5rem, 6vw, 5rem)',
          wordSize: 'clamp(1.5rem, 3.5vw, 3rem)',
          wordWeight: 800
        };
    }
  }, [size, prefixFontSize, wordFontSize, wordFontWeight]);

  return (
    <div
      className={`brand-signature-root inline-flex items-baseline select-none whitespace-nowrap ${className}`}
      style={{
        fontFamily: "'Genty', 'Genty ExtraBold', 'Satoshi', system-ui, -apple-system, sans-serif",
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'baseline'
      }}
      aria-label={`${prefix}${period}${activeWord}`}
    >
      {/* FIXED BRAND PREFIX: KONTAGI. */}
      <span
        className="brand-signature-prefix flex-shrink-0"
        style={{
          fontSize: typography.prefixSize,
          fontWeight: 800,
          fontFamily: "'Genty', 'Genty ExtraBold', 'Satoshi', sans-serif",
          letterSpacing: '-0.02em',
          color: prefixColor,
          marginRight: '0.12em',
          display: 'inline-block'
        }}
      >
        {prefix}
        <span style={{ color: wordColor, fontWeight: 800, fontFamily: "'Genty', 'Genty ExtraBold', 'Satoshi', sans-serif" }}>{period}</span>
      </span>

      {/* ANIMATED WORD CONTAINER SLOT */}
      <span
        className="brand-signature-word-slot relative inline-block overflow-hidden align-baseline"
        style={{
          fontSize: typography.wordSize,
          height: '1.4em',
          verticalAlign: 'baseline',
          paddingRight: '0.1em',
          position: 'relative',
          display: 'inline-block'
        }}
      >
        <span
          key={activeWord}
          className="brand-signature-word inline-block"
          style={{
            color: wordColor,
            fontWeight: typography.wordWeight,
            fontFamily: "'Genty', 'Genty ExtraBold', 'Satoshi', sans-serif",
            letterSpacing: '0.02em',
            textShadow: showGlow ? `0 0 16px ${wordColor}35` : 'none',
            transformOrigin: 'left center',
            display: 'inline-block',
            transition: `transform ${transitionDuration * 0.5}s cubic-bezier(0.16, 1, 0.3, 1), opacity ${transitionDuration * 0.5}s ease, filter ${transitionDuration * 0.5}s ease`,
            transform: isAnimating ? 'translateY(-50%) scale(0.98)' : 'translateY(0%) scale(1)',
            opacity: isAnimating ? 0 : 1,
            filter: isAnimating ? 'blur(4px)' : 'blur(0px)',
            willChange: 'transform, opacity, filter'
          }}
        >
          {activeWord}
        </span>
      </span>
    </div>
  );
};
