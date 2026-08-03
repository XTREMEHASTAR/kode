import React from 'react';

export interface BrandWordmarkProps {
  /** Height of the wordmark (e.g. 24, 32, 40, 48) */
  height?: number | string;
  /** Primary text color for lettering (default: "#13233F") */
  primaryColor?: string;
  /** Accent dot color (default: "#FF6B35") */
  accentColor?: string;
  /** Dynamic rotating brand word (e.g. "Scale", "Predict") */
  suffixWord?: string;
  /** Suffix word color */
  suffixColor?: string;
  /** Custom classname */
  className?: string;
  /** OnClick handler */
  onClick?: () => void;
}

export const BrandWordmark: React.FC<BrandWordmarkProps> = ({
  height = 28,
  primaryColor = "#13233F",
  accentColor = "#FF6B35",
  suffixWord,
  suffixColor = "#FF6B35",
  className = "",
  onClick
}) => {
  const numericHeight = typeof height === 'number' ? height : parseInt(height, 10) || 28;
  const viewBoxWidth = 1860;
  const viewBoxHeight = 320;
  const aspectWidth = (viewBoxWidth / viewBoxHeight) * numericHeight;

  return (
    <div 
      className={`brand-wordmark-container inline-flex items-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      style={{ gap: '6px', height: `${numericHeight}px` }}
    >
      {/* PERFECTED ENTERPRISE VECTOR LOGO WORDMARK */}
      <svg 
        height={numericHeight} 
        width={aspectWidth} 
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', height: '100%', width: 'auto' }}
      >
        <g fill={primaryColor}>
          {/* K */}
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M 40 40 H 104 V 152 L 182 40 H 264 L 168 172 L 272 290 H 190 L 104 192 V 290 H 40 V 40 Z" 
          />

          {/* O */}
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M 440 35 C 512 35 568 91 568 165 C 568 239 512 295 440 295 C 368 295 312 239 312 165 C 312 91 368 35 440 35 Z M 440 98 C 402 98 376 124 376 165 C 376 206 402 232 440 232 C 478 232 504 206 504 165 C 504 124 478 98 440 98 Z" 
          />

          {/* N */}
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M 620 40 H 682 L 768 200 V 40 H 830 V 290 H 768 L 682 130 V 290 H 620 V 40 Z" 
          />

          {/* T */}
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M 885 40 H 1045 V 98 H 996 V 290 H 934 V 98 H 885 V 40 Z" 
          />

          {/* A */}
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M 1150 40 H 1228 L 1305 290 H 1240 L 1225 238 H 1153 L 1138 290 H 1073 L 1150 40 Z M 1189 110 L 1168 182 H 1210 L 1189 110 Z" 
          />

          {/* G (Crisp Clean Geometric Arch & Horizontal Crossbar, Zero Stroke Artifacts) */}
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M 1475 35 
               C 1555 35 1615 90 1615 165 
               C 1615 239 1555 295 1475 295 
               C 1395 295 1345 239 1345 165 
               C 1345 91 1395 35 1475 35 Z 
               M 1475 98 
               C 1435 98 1410 125 1410 165 
               C 1410 205 1435 232 1475 232 
               C 1515 232 1538 208 1544 178 
               H 1480 
               V 125 
               H 1610 
               V 165 
               C 1610 239 1555 295 1475 295 
               Z" 
          />

          {/* I */}
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M 1665 40 H 1727 V 290 H 1665 V 40 Z" 
          />
        </g>

        {/* Accent Orange Squircle Period (#FF6B35) */}
        <rect x="1755" y="240" width="46" height="46" rx="12" fill={accentColor} />
      </svg>

      {/* OPTIONAL ROTATING SUFFIX WORD */}
      {suffixWord && (
        <span 
          style={{ 
            color: suffixColor, 
            fontSize: `${numericHeight * 0.65}px`, 
            fontWeight: 800, 
            fontFamily: "'Genty', 'Satoshi', sans-serif",
            letterSpacing: '0.01em',
            lineHeight: 1
          }}
        >
          {suffixWord}
        </span>
      )}
    </div>
  );
};
