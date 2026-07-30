import React from 'react';

/**
 * Geometric Abstract Orb / Atmosphere Background
 * Inspired by Bauhaus / Modernist geometric art reference
 */
export const AuraGradientOrb: React.FC<{
  className?: string;
  size?: number | string;
  variant?: 'vermilion' | 'orange' | 'navy' | 'brand';
  opacity?: number;
}> = ({ className = '', size = 300, variant = 'brand', opacity = 0.45 }) => {
  const getGradient = () => {
    switch (variant) {
      case 'vermilion':
        return 'radial-gradient(circle, rgba(255, 107, 61, 0.7) 0%, rgba(244, 93, 72, 0.3) 60%, rgba(250, 248, 243, 0) 100%)';
      case 'orange':
        return 'radial-gradient(circle, rgba(255, 107, 61, 0.75) 0%, rgba(212, 162, 76, 0.35) 60%, rgba(250, 248, 243, 0) 100%)';
      case 'navy':
        return 'radial-gradient(circle, rgba(22, 42, 59, 0.6) 0%, rgba(244, 93, 72, 0.25) 60%, rgba(250, 248, 243, 0) 100%)';
      case 'brand':
      default:
        return 'radial-gradient(circle, rgba(255, 107, 61, 0.65) 0%, rgba(244, 93, 72, 0.45) 45%, rgba(22, 42, 59, 0.35) 75%, rgba(250, 248, 243, 0) 100%)';
    }
  };

  const dim = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      className={`pointer-events-none absolute rounded-full blur-[80px] ${className}`}
      style={{
        width: dim,
        height: dim,
        maxWidth: dim,
        maxHeight: dim,
        background: getGradient(),
        opacity,
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
};

/**
 * Soft halftone/dot pattern overlay
 */
export const AuraDotPattern: React.FC<{ className?: string; opacity?: number }> = ({
  className = '',
  opacity = 0.2,
}) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        backgroundImage: `radial-gradient(rgba(23, 50, 71, 0.12) 1px, transparent 1px)`,
        backgroundSize: '22px 22px',
        opacity,
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
};

/**
 * Full page background atmosphere matching Soft Ivory canvas (#F5EEE3)
 */
export const AuraAmbientGlow: React.FC = () => {
  return (
    <div 
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}
    >
      {/* Top Right Vermilion Glow */}
      <div
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
        style={{
          position: 'absolute',
          top: '-128px',
          right: '-128px',
          width: '600px',
          height: '600px',
          borderRadius: '9999px',
          filter: 'blur(120px)',
          opacity: 0.20,
          background: 'radial-gradient(circle, rgba(241, 58, 30, 0.35) 0%, rgba(243, 106, 36, 0.15) 60%, transparent 100%)',
        }}
      />
      {/* Bottom Left Deep Navy Atmosphere */}
      <div
        className="absolute -bottom-40 -left-40 w-[650px] h-[650px] rounded-full blur-[140px] opacity-15"
        style={{
          position: 'absolute',
          bottom: '-160px',
          left: '-160px',
          width: '650px',
          height: '650px',
          borderRadius: '9999px',
          filter: 'blur(140px)',
          opacity: 0.15,
          background: 'radial-gradient(circle, rgba(23, 50, 71, 0.4) 0%, rgba(229, 200, 142, 0.15) 60%, transparent 100%)',
        }}
      />
    </div>
  );
};

/**
 * Geometric Motif 1: ORBIT (Thin circular outline)
 */
export const AuraOrbit: React.FC<{
  size?: number;
  className?: string;
  showNodes?: boolean;
}> = ({ size = 280, className = '', showNodes = true }) => {
  const dim = `${size}px`;
  return (
    <div
      className={`pointer-events-none relative flex items-center justify-center ${className}`}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dim,
        height: dim,
        maxWidth: dim,
        maxHeight: dim,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      {/* Outer Thin Orbit Circle */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '9999px',
          border: '1px solid rgba(23, 50, 71, 0.15)',
        }}
      />
      {/* Inner Orbit Circle */}
      <div 
        className="absolute inset-8 rounded-full" 
        style={{
          position: 'absolute',
          top: '32px',
          left: '32px',
          right: '32px',
          bottom: '32px',
          borderRadius: '9999px',
          border: '1px stroke rgba(241, 58, 30, 0.25)',
        }}
      />
      
      {showNodes && (
        <>
          <div 
            style={{ position: 'absolute', top: '0px', left: '50%', transform: 'translateX(-50%)', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F13A1E' }}
          />
          <div 
            style={{ position: 'absolute', bottom: '32px', right: '32px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#F36A24' }}
          />
        </>
      )}
    </div>
  );
};

/**
 * Geometric Motif 2: INTERSECTION (Overlapping Circles Motif)
 * Represents: Content + Audience + Performance = KONTAGI Intelligence
 */
export const AuraIntersection: React.FC<{ size?: number; className?: string }> = ({
  size = 120,
  className = '',
}) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Circle 1: Content */}
        <circle cx="38" cy="50" r="30" stroke="#173247" strokeWidth="1.5" strokeOpacity="0.3" />
        {/* Circle 2: Audience */}
        <circle cx="62" cy="50" r="30" stroke="#F36A24" strokeWidth="1.5" strokeOpacity="0.4" />
        {/* Central Intersection Focal Point */}
        <circle cx="50" cy="50" r="6" fill="#F13A1E" />
      </svg>
    </div>
  );
};

/**
 * Signature Brand Logo Component — KONTAGI
 * Master Brand Asset: Squircle K Icon + Geometric KONTAGI Wordmark
 */
export const KontagiLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl'; showText?: boolean; darkBackground?: boolean }> = ({
  size = 'md',
  showText = true,
  darkBackground = false,
}) => {
  const iconSizes = {
    sm: { container: 'w-8 h-8', px: 32, textH: 22 },
    md: { container: 'w-10 h-10', px: 40, textH: 28 },
    lg: { container: 'w-12 h-12', px: 48, textH: 34 },
    xl: { container: 'w-14 h-14', px: 56, textH: 40 },
  };

  const currentSize = iconSizes[size];

  return (
    <div 
      className="flex items-center gap-3 select-none"
      style={{ display: 'flex', alignItems: 'center', gap: '12px', userSelect: 'none' }}
    >
      <div 
        style={{
          position: 'relative',
          width: `${currentSize.px}px`,
          height: `${currentSize.px}px`,
          minWidth: `${currentSize.px}px`,
          minHeight: `${currentSize.px}px`,
          maxWidth: `${currentSize.px}px`,
          maxHeight: `${currentSize.px}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: darkBackground ? '0 2px 10px rgba(0,0,0,0.35)' : '0 2px 8px rgba(22,42,59,0.12)'
        }}
      >
        <img 
          src="/assets/branding/kontagi-icon-128x128.png" 
          alt="KONTAGI"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.18)' }}
        />
      </div>
      {showText && (
        <img 
          src={darkBackground ? "/assets/branding/kontagi-wordmark-dark.png" : "/assets/branding/kontagi-wordmark-light.png"}
          alt="KONTAGI"
          style={{ 
            height: `${currentSize.textH}px`, 
            width: 'auto', 
            objectFit: 'contain',
            display: 'block'
          }}
        />
      )}
    </div>
  );
};

export const AuraLogo = KontagiLogo;
