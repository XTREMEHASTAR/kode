import React, { useEffect, useRef, useState } from 'react';

interface AiOrbCanvasProps {
  onClick?: () => void;
  size?: number;
  interactiveMessage?: string;
  theme?: 'off-white' | 'dark-cyber' | 'nothing-glass' | 'stripe-neon';
}

export const AiOrbCanvas: React.FC<AiOrbCanvasProps> = ({
  onClick,
  size = 280,
  interactiveMessage,
  theme = 'off-white'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);

  const handleClick = () => {
    setPulseCount(prev => prev + 1);
    if (onClick) onClick();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      baseRadius: number;
      speed: number;
      angle: number;
      orbit: number;
      opacity: number;
      color: string;
    }> = [];

    // Colors matching Kontagi design system: Deep Navy, Orange Accent, Warm Glow
    const colors = theme === 'dark-cyber' 
      ? ['#FF6B3D', '#FF541F', '#38BDF8', '#818CF8', '#F59E0B']
      : ['#FF6B3D', '#FF541F', '#162A3B', '#F59E0B', '#3B82F6'];

    // Initialize 60 orbit particles
    const particleCount = 65;
    const center = size / 2;

    for (let i = 0; i < particleCount; i++) {
      const orbit = 35 + Math.random() * (size * 0.38);
      const pAngle = Math.random() * Math.PI * 2;
      particles.push({
        x: center + Math.cos(pAngle) * orbit,
        y: center + Math.sin(pAngle) * orbit,
        radius: 1.5 + Math.random() * 2.5,
        baseRadius: 1.5 + Math.random() * 2.5,
        speed: (0.005 + Math.random() * 0.015) * (Math.random() > 0.5 ? 1 : -1),
        angle: pAngle,
        orbit,
        opacity: 0.3 + Math.random() * 0.7,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      angle += isHovered ? 0.025 : 0.012;

      // 1. Ambient Outer Glow Pulse
      const pulseFactor = 1 + Math.sin(angle * 2) * 0.06 + (pulseCount % 5 === 0 && pulseCount > 0 ? 0.15 : 0);
      const gradient = ctx.createRadialGradient(
        center,
        center,
        15,
        center,
        center,
        center * 0.85 * pulseFactor
      );

      if (theme === 'dark-cyber') {
        gradient.addColorStop(0, 'rgba(255, 107, 61, 0.45)');
        gradient.addColorStop(0.35, 'rgba(255, 84, 31, 0.22)');
        gradient.addColorStop(0.7, 'rgba(56, 189, 248, 0.08)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(255, 107, 61, 0.38)');
        gradient.addColorStop(0.4, 'rgba(22, 42, 59, 0.12)');
        gradient.addColorStop(0.75, 'rgba(245, 158, 11, 0.05)');
        gradient.addColorStop(1, 'rgba(250, 247, 242, 0)');
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(center, center, center * 0.85 * pulseFactor, 0, Math.PI * 2);
      ctx.fill();

      // 2. Nothing Phone Inspired Dot Matrix & Concentric Rings
      const ringRadii = [size * 0.22, size * 0.32, size * 0.42];
      ringRadii.forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(center, center, r, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 1 ? 'rgba(255, 107, 61, 0.25)' : 'rgba(22, 42, 59, 0.08)';
        ctx.lineWidth = idx === 1 ? 1.5 : 1;
        ctx.setLineDash(idx % 2 === 0 ? [4, 6] : [2, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 3. Orbiting Nodes & Connections
      particles.forEach((p, index) => {
        p.angle += p.speed * (isHovered ? 1.8 : 1.0);
        p.x = center + Math.cos(p.angle) * p.orbit;
        p.y = center + Math.sin(p.angle) * p.orbit;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (isHovered ? 1.3 : 1.0), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Draw node links for neural net aesthetic
        if (index % 4 === 0) {
          const next = particles[(index + 1) % particles.length];
          const dist = Math.hypot(p.x - next.x, p.y - next.y);
          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(next.x, next.y);
            ctx.strokeStyle = 'rgba(255, 107, 61, 0.18)';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      // 4. Glowing Core Orb (OpenAI + Linear Style)
      const coreGradient = ctx.createRadialGradient(
        center - 10,
        center - 10,
        5,
        center,
        center,
        size * 0.18
      );
      coreGradient.addColorStop(0, '#FFFFFF');
      coreGradient.addColorStop(0.25, '#FF6B3D');
      coreGradient.addColorStop(0.7, '#FF541F');
      coreGradient.addColorStop(1, theme === 'dark-cyber' ? '#0F1C28' : '#162A3B');

      ctx.beginPath();
      ctx.arc(center, center, size * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.shadowColor = '#FF6B3D';
      ctx.shadowBlur = isHovered ? 35 : 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      // 5. Pulsing Status Rings around Core
      ctx.beginPath();
      ctx.arc(center, center, (size * 0.18) + (Math.sin(angle * 4) * 4) + 6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [size, isHovered, theme, pulseCount]);

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none'
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isHovered ? 'scale(1.04)' : 'scale(1)'
        }}
      />

      {/* Floating Sarcastic Message Dialog Bubble */}
      {interactiveMessage && (
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            backgroundColor: theme === 'dark-cyber' ? '#1E293B' : '#FFFBF7',
            color: theme === 'dark-cyber' ? '#F8FAFC' : '#162A3B',
            border: '1px solid rgba(255, 107, 61, 0.35)',
            boxShadow: '0 12px 30px -5px rgba(255, 107, 61, 0.25), 0 4px 12px rgba(0,0,0,0.1)',
            padding: '10px 16px',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: 600,
            maxWidth: '260px',
            textAlign: 'center',
            zIndex: 10,
            animation: 'orbMessageBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px' }}>🤖</span>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#FF6B3D', letterSpacing: '0.05em' }}>AI ASSISTANT</span>
          </div>
          <div>"{interactiveMessage}"</div>
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              bottom: '-6px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '10px',
              height: '10px',
              backgroundColor: theme === 'dark-cyber' ? '#1E293B' : '#FFFBF7',
              borderRight: '1px solid rgba(255, 107, 61, 0.35)',
              borderBottom: '1px solid rgba(255, 107, 61, 0.35)'
            }}
          />
        </div>
      )}

      {/* Interactive Trigger Hint */}
      <div
        style={{
          marginTop: '-10px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '9999px',
          backgroundColor: isHovered ? 'rgba(255, 107, 61, 0.15)' : 'rgba(22, 42, 59, 0.05)',
          border: '1px solid rgba(255, 107, 61, 0.2)',
          fontSize: '11px',
          fontWeight: 700,
          color: '#FF6B3D',
          transition: 'all 0.2s ease'
        }}
      >
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FF6B3D', display: 'inline-block' }} />
        <span>CLICK ORB FOR AI WISDOM</span>
      </div>

      <style>{`
        @keyframes orbMessageBounce {
          0% { opacity: 0; transform: translateY(10px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};
