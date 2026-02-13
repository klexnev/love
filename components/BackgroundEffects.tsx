import React, { useEffect, useState } from 'react';

interface Orb {
  id: number;
  top: number;
  left: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

interface Cloud {
  id: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
  duration: number;
  delay: number;
}

interface Mote {
  id: number;
  top: number;
  left: number;
  size: number;
  targetOpacity: number;
  duration: number;
  delay: number;
}

interface Ember {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  swayAmplitude: number;
}

const BackgroundEffects: React.FC = () => {
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [motes, setMotes] = useState<Mote[]>([]);
  const [embers, setEmbers] = useState<Ember[]>([]);

  useEffect(() => {
    // Generate glowing Bokeh Orbs
    const newOrbs: Orb[] = [];
    const colors = ['bg-red-400', 'bg-pink-300', 'bg-yellow-200', 'bg-white'];
    
    for (let i = 0; i < 20; i++) {
      newOrbs.push({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 50 + Math.random() * 150, // Large sizes
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: 6 + Math.random() * 10, // Slower duration for gentle breathing
        delay: Math.random() * -20,
      });
    }
    setOrbs(newOrbs);

    // Generate Twinkling Stars
    const newStars: Star[] = [];
    for (let i = 0; i < 30; i++) {
        newStars.push({
            id: i,
            top: Math.random() * 100,
            left: Math.random() * 100,
            size: 2 + Math.random() * 4,
            duration: 2 + Math.random() * 3,
            delay: Math.random() * 5,
        });
    }
    setStars(newStars);

    // Generate Moving Fog/Clouds
    const newClouds: Cloud[] = [];
    for (let i = 0; i < 6; i++) {
        newClouds.push({
            id: i,
            bottom: -20 + Math.random() * 60, // Keep them in lower half/middle
            left: -20 + Math.random() * 100,
            width: 300 + Math.random() * 400,
            height: 150 + Math.random() * 150,
            duration: 30 + Math.random() * 30, // Slow movement
            delay: -Math.random() * 30,
        });
    }
    setClouds(newClouds);

    // Generate Dust Motes / Glitter (Existing)
    const newMotes: Mote[] = [];
    for (let i = 0; i < 50; i++) {
        newMotes.push({
            id: i,
            top: Math.random() * 100,
            left: Math.random() * 100,
            size: 1 + Math.random() * 3,
            targetOpacity: 0.3 + Math.random() * 0.5,
            duration: 12 + Math.random() * 18,
            delay: -Math.random() * 20,
        });
    }
    setMotes(newMotes);

    // Generate Rising Embers (New)
    const newEmbers: Ember[] = [];
    for (let i = 0; i < 35; i++) {
        newEmbers.push({
            id: i,
            left: Math.random() * 100,
            size: 2 + Math.random() * 4,
            duration: 15 + Math.random() * 15, // Slow rise
            delay: -Math.random() * 20,
            swayAmplitude: 20 + Math.random() * 30, // How much they sway left/right
        });
    }
    setEmbers(newEmbers);

  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* Floating Clouds / Fog */}
      {clouds.map((cloud) => (
        <div 
            key={`cloud-${cloud.id}`}
            className="absolute bg-white/40 blur-[80px] rounded-full opacity-40"
            style={{
                bottom: `${cloud.bottom}%`,
                left: `${cloud.left}%`,
                width: `${cloud.width}px`,
                height: `${cloud.height}px`,
                animation: `float-horizontal ${cloud.duration}s infinite alternate ease-in-out`,
                animationDelay: `${cloud.delay}s`,
            }}
        />
      ))}

      {/* Glowing Bokeh Orbs (Breathing) */}
      {orbs.map((orb) => (
        <div
          key={`orb-${orb.id}`}
          className={`absolute rounded-full mix-blend-screen filter blur-3xl ${orb.color}`}
          style={{
            top: `${orb.top}%`,
            left: `${orb.left}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            animation: `breathe ${orb.duration}s infinite ease-in-out`,
            animationDelay: `${orb.delay}s`,
            transform: 'translate(-50%, -50%)',
            opacity: 0, // Base opacity handled by keyframe
          }}
        />
      ))}

      {/* Twinkling Stars */}
      {stars.map((star) => (
        <div 
            key={`star-${star.id}`}
            className="absolute bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse"
            style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: 0.6,
                animationDuration: `${star.duration}s`,
                animationDelay: `${star.delay}s`,
            }}
        />
      ))}

      {/* Dust Motes / Glitter */}
      {motes.map((mote) => (
         <div 
            key={`mote-${mote.id}`}
            className="absolute bg-[#fffadd] rounded-full"
            style={{
                top: `${mote.top}%`,
                left: `${mote.left}%`,
                width: `${mote.size}px`,
                height: `${mote.size}px`,
                boxShadow: '0 0 4px rgba(255, 255, 255, 0.9)',
                animation: `drift ${mote.duration}s infinite linear`,
                animationDelay: `${mote.delay}s`,
                // @ts-ignore - Custom property for keyframe usage
                '--target-opacity': mote.targetOpacity,
            }}
         />
      ))}

      {/* Rising Embers */}
      {embers.map((ember) => (
         <div 
            key={`ember-${ember.id}`}
            className="absolute bg-orange-300 rounded-full blur-[0.5px]"
            style={{
                bottom: '-10%',
                left: `${ember.left}%`,
                width: `${ember.size}px`,
                height: `${ember.size}px`,
                boxShadow: '0 0 6px rgba(255, 160, 100, 0.7)',
                animation: `rise ${ember.duration}s infinite ease-out`,
                animationDelay: `${ember.delay}s`,
                // @ts-ignore - Custom property
                '--sway-amt': `${ember.swayAmplitude}px`,
            }}
         />
      ))}

      <style>{`
        @keyframes float-horizontal {
            0% { transform: translateX(-30px); }
            100% { transform: translateX(30px); }
        }
        @keyframes breathe {
           0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.15; }
           50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.4; }
        }
        @keyframes drift {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            20% { opacity: var(--target-opacity); }
            80% { opacity: var(--target-opacity); }
            100% { transform: translateY(-100px) translateX(25px); opacity: 0; }
        }
        @keyframes rise {
            0% { 
                transform: translateY(0) translateX(0); 
                opacity: 0; 
            }
            15% { opacity: 0.6; }
            50% { transform: translateY(-50vh) translateX(var(--sway-amt)); }
            85% { opacity: 0.6; }
            100% { 
                transform: translateY(-110vh) translateX(calc(var(--sway-amt) * -1)); 
                opacity: 0; 
            }
        }
      `}</style>
    </div>
  );
};

export default BackgroundEffects;