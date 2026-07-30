import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulseSpeed: number;
}

export const NeuralNetworkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking for interactive neural dynamics
    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Initialize nodes
    const nodeCount = Math.floor(Math.min(width, 1400) / 18);
    const nodes: Node[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.5,
        alpha: Math.random() * 0.6 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.005
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background neural glow blobs
      const grad1 = ctx.createRadialGradient(width * 0.3, height * 0.3, 0, width * 0.3, height * 0.3, width * 0.5);
      grad1.addColorStop(0, 'rgba(99, 102, 241, 0.12)');
      grad1.addColorStop(0.5, 'rgba(139, 92, 246, 0.04)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(width * 0.7, height * 0.7, 0, width * 0.7, height * 0.7, width * 0.5);
      grad2.addColorStop(0, 'rgba(236, 72, 153, 0.08)');
      grad2.addColorStop(0.5, 'rgba(99, 102, 241, 0.03)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Move node
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off bounds
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Mouse influence
        const dxMouse = mouseX - node.x;
        const dyMouse = mouseY - node.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 180) {
          const force = (180 - distMouse) / 180;
          node.x += (dxMouse / distMouse) * force * 0.5;
          node.y += (dyMouse / distMouse) * force * 0.5;
        }

        // Pulsing alpha
        node.alpha += Math.sin(Date.now() * node.pulseSpeed) * 0.005;
        const currentAlpha = Math.max(0.2, Math.min(0.9, node.alpha));

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = nodeB.x - node.x;
          const dy = nodeB.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const lineAlpha = (1 - dist / 130) * 0.25 * currentAlpha;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Draw node core
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165, 180, 252, ${currentAlpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(99, 102, 241, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};
