import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FUNNY_MESSAGES = [
  "This page dropped off faster than a video that starts with 'Hey guys, welcome back to my channel!' 📉",
  "404 — Looks like the Instagram algorithm buried this URL under 10,000 cat videos. 🐱",
  "Even KONTAGI AI couldn't craft a scroll-stopping hook for this link. 🎣",
  "This URL doesn't exist. Probably because the creator forgot to include a Call To Action. 📢",
  "Retention Warning: 100% of users bounced from this page in 0.00 seconds flat. 🛑",
  "You tried to hack into a secret page... but your Hook Score wasn't high enough! 🔒",
  "This link is as empty as the comments section of a 45-minute slide deck video. 💬"
];

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const [msgIndex, setMsgIndex] = useState(() => Math.floor(Math.random() * FUNNY_MESSAGES.length));

  const handleNextMessage = () => {
    setMsgIndex((prev) => (prev + 1) % FUNNY_MESSAGES.length);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#FAF7F2',
        color: '#162A3B',
        fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Signature KONTAGI Orange Aura Glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(255, 107, 61, 0.16) 0%, rgba(22, 42, 59, 0.03) 60%, transparent 80%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '44px 36px',
          borderRadius: '24px',
          backgroundColor: '#FFFBF7',
          border: '1px solid #E8E3DA',
          boxShadow: '0 20px 40px -10px rgba(255, 107, 61, 0.12), 0 4px 16px rgba(22, 42, 59, 0.04)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          boxSizing: 'border-box'
        }}
      >
        {/* Retention Warning Tag */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 14px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 107, 61, 0.1)',
            border: '1px solid rgba(255, 107, 61, 0.25)',
            color: '#FF6B3D',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            marginBottom: '20px'
          }}
        >
          <span>📉 Retention Dropoff: 100%</span>
        </div>

        {/* Big Orange 404 Header */}
        <div
          style={{
            fontSize: '76px',
            fontWeight: 900,
            lineHeight: 1,
            color: '#FF6B3D',
            marginBottom: '12px',
            letterSpacing: '-0.04em',
            textShadow: '0 4px 12px rgba(255, 107, 61, 0.2)'
          }}
        >
          404
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '22px',
            fontWeight: 800,
            color: '#162A3B',
            margin: '0 0 16px 0',
            letterSpacing: '-0.01em'
          }}
        >
          Page Dropped Off the Algorithm
        </h1>

        {/* Dynamic Funny Creator Message */}
        <div
          onClick={handleNextMessage}
          title="Click for another joke!"
          style={{
            padding: '16px 18px',
            borderRadius: '14px',
            backgroundColor: '#FAF5EE',
            border: '1px dashed #E2D9CC',
            color: '#3D5A73',
            fontSize: '14px',
            lineHeight: '1.55',
            fontWeight: 500,
            marginBottom: '28px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            userSelect: 'none'
          }}
        >
          {FUNNY_MESSAGES[msgIndex]}
          <div style={{ fontSize: '11px', color: '#FF6B3D', fontWeight: 700, marginTop: '8px' }}>
            🎲 Click for another excuse
          </div>
        </div>

        {/* Primary CTA Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <button
            onClick={() => navigate('/script-intelligence')}
            style={{
              width: '100%',
              padding: '13px 24px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#FF6B3D',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(255, 107, 61, 0.3)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              (e.currentTarget as HTMLElement).style.backgroundColor = '#FF541F';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'none';
              (e.currentTarget as HTMLElement).style.backgroundColor = '#FF6B3D';
            }}
          >
            🚀 Return to Script Intelligence
          </button>
        </div>
      </div>
    </div>
  );
};
