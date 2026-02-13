import React, { useState, useRef, useEffect } from 'react';
import FloatingHearts from './components/FloatingHearts';
import BackgroundEffects from './components/BackgroundEffects';
import Envelope from './components/Envelope';
import Confetti from './components/Confetti';

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Audio Refs
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const openSfxRef = useRef<HTMLAudioElement | null>(null);
  const chimeSfxRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize Audio objects
    // Using Internet Archive for public domain Satie (Gymnopédie No. 1)
    bgmRef.current = new Audio('https://ia800306.us.archive.org/24/items/ErikSatieGymnopedieNo1/ErikSatieGymnopedieNo1.mp3'); 
    bgmRef.current.loop = true;
    bgmRef.current.volume = 0; // Start silent

    // Paper slide sound
    openSfxRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-paper-slide-1530.mp3');
    openSfxRef.current.volume = 0.6;

    // Magical chime/sparkle
    chimeSfxRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-fairy-dust-sparkle-861.mp3');
    chimeSfxRef.current.volume = 0.4;

    return () => {
        bgmRef.current?.pause();
        bgmRef.current = null;
        openSfxRef.current = null;
        chimeSfxRef.current = null;
    }
  }, []);

  const handleEnvelopeClick = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    if (newState) {
        // === OPENING ===
        
        // 1. Play Open Sound
        openSfxRef.current?.play().catch(e => console.warn("Audio blocked", e));
        
        // 2. Play Chime with delay (Synced to new 2000ms animation, triggered when letter is ~halfway up)
        setTimeout(() => {
             chimeSfxRef.current?.play().catch(e => console.warn("Audio blocked", e));
        }, 1100);

        // 3. Fade in Music
        if (bgmRef.current) {
            bgmRef.current.currentTime = 0;
            bgmRef.current.volume = 0;
            const playPromise = bgmRef.current.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Fade in
                    let vol = 0;
                    const interval = setInterval(() => {
                        if (vol < 0.3) {
                            vol += 0.01;
                            if (bgmRef.current) bgmRef.current.volume = Math.min(vol, 0.3);
                        } else {
                            clearInterval(interval);
                        }
                    }, 50);
                }).catch(e => console.warn("Background music blocked", e));
            }
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