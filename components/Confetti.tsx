import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  trigger: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: 'square' | 'circle' | 'heart';
}

const Confetti: React.FC<ConfettiProps> = ({ trigger }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    const particles: Particle[] = [];
    const colors = ['#ff0000', '#ff4d6d', '#ffb703', '#ffffff', '#ff99ac', '#8338ec', '#3a86ff'];
    
    // Create particles - Slower burst
    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Reduced velocity for a softer explosion (was 25, now 12)
      const velocity = Math.random() * 12 + 3; 
      
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2 + 50,
        vx: Math.cos(angle) * velocity * (Math.random() + 0.5),
        vy: (Math.sin(angle) * velocity - 5) * (Math.random() + 0.5), // Less upward force
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 5, // Slower rotation
        opacity: 1,
        shape: Math.random() > 0.8 ? 'heart' : (Math.random() > 0.5 ? 'circle' : 'square')
      });
    }

    let animationId: number;

    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, rotation: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.fillStyle = color;
        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
        ctx.bezierCurveTo(-size / 2, size / 2, 0, size, 0, size);
        ctx.bezierCurveTo(0, size, size / 2, size / 2, size / 2, topCurveHeight);
        ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.fill();
        ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let activeParticles = 0;

      particles.forEach(p => {
        if (p.opacity <= 0) return;
        activeParticles++;

        // Physics - Floaty feel
        p.x += p.vx;
        p.y += p.vy;
        
        p.vx *= 0.98; // Less air resistance on X (gliding)
        p.vy += 0.15; // Very low gravity (feather-like fall)
        p.vy *= 0.98; // Terminal velocity check
        
        p.rotation += p.rotationSpeed;
        
        // Slower fade out (was 0.008, now 0.004)
        p.opacity -= 0.003 + (Math.random() * 0.002);

        // Draw
        ctx.save();
        ctx.globalAlpha = p.opacity;
        
        if (p.shape === 'heart') {
             drawHeart(ctx, p.x, p.y, p.size * 1.5, p.color, p.rotation);
        } else if (p.shape === 'circle') {
             ctx.fillStyle = p.color;
             ctx.beginPath();
             ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
             ctx.fill();
        } else {
             ctx.translate(p.x, p.y);
             ctx.rotate((p.rotation * Math.PI) / 180);
             ctx.fillStyle = p.color;
             ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
             ctx.restore();
        }
        
        ctx.restore();
      });

      if (activeParticles > 0) {
        animationId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animate();

    return () => {
        window.removeEventListener('resize', updateSize);
        cancelAnimationFrame(animationId);
    };
  }, [trigger]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[60]"
    />
  );
};

export default Confetti;