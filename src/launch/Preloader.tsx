import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

const SYSTEM_LOGS = [
  "Initializing AuraCore Neural Kernel v4.8...",
  "Synthesizing 10,000 Synthetic Viewer Swarms...",
  "Loading Predictive Virality Engine...",
  "Calibrating ContentDNA Pacing Models...",
  "AuraCore Launch Environment Ready."
];

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const duration = 2400; // ms
    const intervalTime = 30;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    const logTimer = setInterval(() => {
      setLogIndex((prev) => (prev < SYSTEM_LOGS.length - 1 ? prev + 1 : prev));
    }, 450);

    const completeTimer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        onComplete();
      }, 500);
    }, duration + 200);

    return () => {
      clearInterval(timer);
      clearInterval(logTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: '#07090E',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.5s ease-in-out',
        pointerEvents: isFading ? 'none' : 'auto',
        overflow: 'hidden'
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'pulseGlow 3s infinite alternate'
        }}
      />

      {/* AuraCore Logo / Icon */}
      <div style={{ position: 'relative', zIndex: 10, marginBottom: '32px', textAlign: 'center' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 20px auto',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.3))',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(99, 102, 241, 0.35)',
            position: 'relative'
          }}
        >
          {/* Animated Core Ring */}
          <div
            style={{
              position: 'absolute',
              inset: '-6px',
              borderRadius: '28px',
              border: '2px dashed rgba(99, 102, 241, 0.5)',
              animation: 'spinRing 8s linear infinite'
            }}
          />
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#A5B4FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </div>

        <h1
          style={{
            fontSize: '28px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: 0,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #A5B4FC 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          AURA<span style={{ color: '#8B5CF6', WebkitTextFillColor: '#8B5CF6' }}>CORE</span>
        </h1>
        <p style={{ fontSize: '13px', color: '#94A3B8', margin: '6px 0 0 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Autonomous Creator Intelligence
        </p>
      </div>

      {/* Progress Bar Container */}
      <div style={{ position: 'relative', zIndex: 10, width: '320px', textAlign: 'center' }}>
        <div
          style={{
            width: '100%',
            height: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '999px',
            overflow: 'hidden',
            marginBottom: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
              borderRadius: '999px',
              transition: 'width 0.05s ease-out',
              boxShadow: '0 0 12px rgba(139, 92, 246, 0.8)'
            }}
          />
        </div>

        {/* Percentage & Status Log */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748B' }}>
          <span style={{ color: '#818CF8', fontWeight: 600 }}>{Math.round(progress)}%</span>
          <span>OPERATIONAL</span>
        </div>

        <p
          style={{
            fontSize: '12px',
            color: '#94A3B8',
            marginTop: '12px',
            height: '18px',
            fontFamily: 'monospace',
            opacity: 0.9
          }}
        >
          {SYSTEM_LOGS[logIndex]}
        </p>
      </div>

      <style>{`
        @keyframes pulseGlow {
          0% { transform: scale(0.9); opacity: 0.2; }
          100% { transform: scale(1.15); opacity: 0.4; }
        }
        @keyframes spinRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
