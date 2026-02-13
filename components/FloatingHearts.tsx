import React, { useEffect, useState } from 'react';
import { Particle } from '../types';

const FloatingHearts: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    const count = 40; 
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        left: Math.random() * 100,
        duration: 8 + Math.random() * 10,
        delay: -Math.random() * 20,
        size: 0.5 + Math.random() * 1.5,
        opacity: 0.2 + Math.random() * 0.4
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute text-[#ff4d6d] animate-fall"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}rem`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
            top: '-10%',
            filter: p.size < 1 ? 'blur(1px)' : 'none' // Blur smaller hearts for depth
          }}
        >
          {Math.random() > 0.5 ? '❤' : '♥'}
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-[#ffccd5]/40 via-transparent to-[#ffccd5]/40"></div>
    </div>
  );
};

export default FloatingHearts;