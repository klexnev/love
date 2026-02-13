import React, { useState, useRef, useEffect } from 'react';
import FloatingHearts from './components/FloatingHearts';
import BackgroundEffects from './components/BackgroundEffects';
import Envelope from './components/Envelope';
import Confetti from './components/Confetti';

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Audio Context Ref
  const audioContextRef = useRef<AudioContext | null>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize AudioContext
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContextRef.current = new AudioContextClass();

    // Initialize BGM
    // Using a direct reliable link for Satie. If this fails, the app will still work without BGM.
    bgmRef.current = new Audio('https://ia800306.us.archive.org/24/items/ErikSatieGymnopedieNo1/ErikSatieGymnopedieNo1.mp3'); 
    bgmRef.current.loop = true;
    bgmRef.current.volume = 0;
    bgmRef.current.crossOrigin = "anonymous";

    return () => {
        bgmRef.current?.pause();
        bgmRef.current = null;
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
    }
  }, []);

  // --- Sound Synthesis Functions ---

  const initAudioContext = () => {
    if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
    }
  };

  const playPaperSound = () => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    const t = ctx.currentTime;

    // Create noise for paper friction texture
    const bufferSize = ctx.sampleRate * 0.6; 
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to simulate paper material (Bandpass focused on mids/highs)
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 0.7;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.1); // Attack
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5); // Decay

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(t);
  };

  const playWhooshSound = () => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    const t = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 1.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5; // Pink-ish noise volume
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Lowpass filter sweep for "whoosh" effect
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, t);
    filter.frequency.exponentialRampToValueAtTime(1200, t + 0.4); // Sweep up
    filter.frequency.exponentialRampToValueAtTime(100, t + 1.2);  // Sweep down

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.3);
    gain.gain.linearRampToValueAtTime(0, t + 1.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(t);
  };

  const playChimeSound = () => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    const t = ctx.currentTime;

    // Play a magical major triad (C majorish: C6, E6, G6, C7)
    const frequencies = [1046.50, 1318.51, 1567.98, 2093.00]; 

    frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        // Stagger entries slightly for a "strum" or "sparkle" effect
        const delay = i * 0.08; 

        gain.gain.setValueAtTime(0, t + delay);
        gain.gain.linearRampToValueAtTime(0.08, t + delay + 0.05); // Very quiet
        gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 2.5); // Long ring

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + delay);
        osc.stop(t + delay + 3);
    });
  };

  // --- Interaction Handler ---

  const handleEnvelopeClick = () => {
    // 1. Ensure Audio Context is active (browser requires user gesture)
    initAudioContext();

    const newState = !isOpen;
    setIsOpen(newState);

    if (newState) {
        // === OPENING ===
        
        // 1. Paper Slide (Immediate)
        playPaperSound();
        
        // 2. Whoosh (Letter rising)
        setTimeout(() => {
            playWhooshSound();
        }, 300);

        // 3. Chime (Reveal)
        setTimeout(() => {
             playChimeSound();
        }, 1400);

        // 4. Fade in Music
        if (bgmRef.current) {
            bgmRef.current.currentTime = 0;
            bgmRef.current.volume = 0;
            // Catch errors if BGM fails to load so app doesn't break
            bgmRef.current.play().then(() => {
                // Fade in
                let vol = 0;
                const interval = setInterval(() => {
                    if (vol < 0.15) { 
                        vol += 0.01;
                        if (bgmRef.current) bgmRef.current.volume = Math.min(vol, 0.15);
                    } else {
                        clearInterval(interval);
                    }
                }, 100);
            }).catch(e => {
                console.warn("Background music could not be played:", e);
            });
        }
    } else {
        // === CLOSING ===
        
        // Fade out music
         if (bgmRef.current) {
            let vol = bgmRef.current.volume;
            const interval = setInterval(() => {
                if (vol > 0) {
                    vol -= 0.02;
                    if (bgmRef.current) bgmRef.current.volume = Math.max(vol, 0);
                } else {
                    clearInterval(interval);
                    bgmRef.current?.pause();
                }
            }, 50);
        }
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#ffe5ec] via-[#ffc2d1] to-[#ffe5ec]">
      
      {/* Decorative Dot Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{
            backgroundImage: 'radial-gradient(#ff99ac 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px'
        }}
      ></div>

      {/* Ambient Background Effects (Bokeh, Stars, Clouds) */}
      <BackgroundEffects />

      {/* Falling Hearts Foreground */}
      <FloatingHearts />
      
      {/* Burst Confetti on Open */}
      <Confetti trigger={isOpen} />

      {/* Header - Hides completely when open to focus on letter */}
      <div className={`absolute top-[5%] md:top-[8%] w-full flex flex-col items-center z-10 transition-all duration-700 transform ${isOpen ? 'opacity-0 -translate-y-20' : 'opacity-100 scale-100'}`}>
        
        {/* Playful Typography for "Happy Valentine's Day" */}
        <div className="relative group cursor-default">
            {/* "С Днём" - Elegant Script, slight rotation */}
            <div className="absolute -top-6 -left-4 md:-left-16 transform -rotate-12 transition-transform duration-500 group-hover:-rotate-6">
                <span className="font-['Marck_Script'] text-3xl md:text-5xl text-[#ff4d6d] drop-shadow-sm whitespace-nowrap">
                    С Днём
                </span>
            </div>

            {/* "Святого" - Big Bold Gradient Text */}
            <h1 className="text-6xl md:text-9xl font-['Lobster'] text-transparent bg-clip-text bg-gradient-to-br from-[#d90429] via-[#ef233c] to-[#8d99ae] drop-shadow-[0_4px_4px_rgba(217,4,41,0.25)] z-10 relative leading-tight">
                Святого
            </h1>

            {/* "Валентина!" - Elegant Serif, overlapping slightly */}
            <div className="absolute -bottom-4 md:-bottom-8 -right-2 md:-right-12 transform rotate-6 transition-transform duration-500 group-hover:rotate-3">
                 <span className="font-['Playfair_Display'] italic text-3xl md:text-5xl text-[#800f2f] font-bold tracking-wide drop-shadow-md whitespace-nowrap">
                    Валентина!
                 </span>
            </div>
            
            {/* Decorative Sparkle Icon near text */}
            <div className="absolute -top-8 right-0 text-yellow-400 text-4xl animate-pulse opacity-80">✨</div>
            <div className="absolute bottom-0 -left-8 text-pink-400 text-3xl animate-bounce opacity-80 delay-700">💖</div>
        </div>

      </div>

      {/* Main Content Area - Envelope sits lower to allow letter to go UP */}
      <div className={`z-20 relative flex items-center justify-center w-full transition-all duration-700 ${isOpen ? 'mt-32' : 'mt-24 md:mt-16'}`}>
        <Envelope 
            isOpen={isOpen} 
            onClick={handleEnvelopeClick} 
        />
      </div>

      {/* Footer */}
      <div className={`absolute bottom-10 w-full text-center z-20 transition-all duration-500 ${isOpen ? 'opacity-0 translate-y-10' : 'opacity-100'}`}>
        <p className="text-[#c9184a] font-['Comfortaa'] text-lg md:text-xl animate-pulse cursor-pointer font-semibold tracking-wide drop-shadow-sm bg-white/30 backdrop-blur-sm py-2 px-6 rounded-full inline-block border border-white/50 shadow-sm">
            ( Нажми на конверт )
        </p>
      </div>

      {/* Subtle Credit */}
      <div className="absolute bottom-2 right-3 z-10 opacity-30 hover:opacity-50 transition-opacity text-[10px] text-[#800f2f] font-mono pointer-events-none select-none">
        made fusnzy for l1ns1q
      </div>

    </div>
  );
};

export default App;