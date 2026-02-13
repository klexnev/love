import React from 'react';

interface EnvelopeProps {
  isOpen: boolean;
  onClick: () => void;
}

const Envelope: React.FC<EnvelopeProps> = ({ isOpen, onClick }) => {
  const message = "Люблю тебя <3";

  return (
    <div 
        className="relative w-[300px] h-[200px] md:w-[400px] md:h-[260px] perspective-1000 group cursor-pointer select-none" 
        onClick={onClick}
    >
      
      {/* Wrapper - Moves down slightly when opened to make room for the letter popping up */}
      {/* Increased duration from 700 to 1000ms */}
      <div className={`relative w-full h-full transform-style-3d transition-transform duration-1000 ease-in-out ${isOpen ? 'translate-y-24' : 'hover:scale-105'}`}>
        
        {/* === SHADOW === */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-6 bg-black/40 blur-xl rounded-[100%] transition-all duration-1000"></div>

        {/* === ENVELOPE BACK (Inside) === */}
        <div className="absolute inset-0 bg-[#720e1e] rounded-lg shadow-2xl border border-[#4a0913]"></div>
        
        {/* Gold Inner Lining */}
        <div className="absolute inset-1 border-[1px] border-yellow-500/30 rounded-lg bg-[#5c0b18]"></div>

        {/* === THE LETTER (HEART SHAPE) === */}
        {/* Increased duration to 2000ms (2s) for very slow reveal */}
        <div 
          className={`absolute left-0 right-0 mx-auto transition-all duration-[2000ms] cubic-bezier(0.25, 1, 0.5, 1) flex items-center justify-center
            w-[260px] h-[220px] md:w-[320px] md:h-[280px]
            ${isOpen 
              ? '-translate-y-[280px] md:-translate-y-[380px] scale-[1.1] md:scale-[1.3] z-50' // Moves way up and sits on top
              : 'translate-y-12 scale-50 opacity-0 z-0' // Hides inside
            }`}
          style={{ 
             top: '10%'
          }}
        >
            {/* Heart Container */}
            <div className="relative w-full h-full drop-shadow-2xl filter hover:scale-[1.02] transition-transform duration-500">
                <svg viewBox="0 0 512 512" className="w-full h-full overflow-visible">
                   <defs>
                     <filter id="paper-texture-2" x="0%" y="0%" width="100%" height="100%">
                       <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" result="noise" />
                       <feDiffuseLighting in="noise" lightingColor="#fff0f5" surfaceScale="1.5">
                         <feDistantLight azimuth="45" elevation="60" />
                       </feDiffuseLighting>
                     </filter>
                   </defs>
                   
                   {/* Main Heart Body */}
                   <path 
                     fill="#fff0f3" 
                     d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"
                     filter="url(#paper-texture-2)"
                     stroke="#d4af37" // Gold border
                     strokeWidth="3"
                   />
                   
                   {/* Decorative Inner Border (Dashed) */}
                   <path 
                     fill="none" 
                     d="M442 82C395 45 325 50 285 90L256 120L227 90C187 50 117 45 70 82C20 125 15 200 60 250L256 450L452 250C497 200 492 125 442 82Z"
                     stroke="#e63946"
                     strokeWidth="2"
                     strokeDasharray="8 8"
                     opacity="0.6"
                   />
                </svg>
                
                {/* Message Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 pb-6 md:pb-10">
                    <div className="w-[70%] flex justify-center">
                        <p className="font-['Marck_Script'] text-[#800f2f] text-xl md:text-3xl leading-snug drop-shadow-sm font-bold transform -rotate-2">
                            {message}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* === ENVELOPE FRONT FLAPS === */}
        <div className="absolute inset-0 z-20 pointer-events-none">
            {/* Left Flap */}
            <div className="absolute bottom-0 left-0 w-0 h-0 
                border-l-[150px] border-b-[110px] md:border-l-[200px] md:border-b-[140px]
                border-l-transparent border-b-[#a41623] border-t-0 rounded-bl-lg shadow-[5px_-5px_15px_rgba(0,0,0,0.1)]">
            </div>
            
            {/* Right Flap */}
            <div className="absolute bottom-0 right-0 w-0 h-0 
                border-r-[150px] border-b-[110px] md:border-r-[200px] md:border-b-[140px]
                border-r-transparent border-b-[#a41623] border-t-0 rounded-br-lg shadow-[-5px_-5px_15px_rgba(0,0,0,0.1)]">
            </div>

            {/* Bottom Flap (Center) */}
            <div className="absolute bottom-0 left-0 w-full flex justify-center z-10">
                 <div className="w-0 h-0 
                    border-l-[150px] border-r-[150px] border-b-[120px] 
                    md:border-l-[200px] md:border-r-[200px] md:border-b-[150px]
                    border-l-transparent border-r-transparent border-b-[#90131f]">
                 </div>
            </div>
            
            {/* Glossy sheen on front */}
            <div className="absolute bottom-0 left-0 w-full h-full opacity-10 bg-gradient-to-tr from-black via-transparent to-white rounded-lg pointer-events-none"></div>
        </div>

        {/* === ENVELOPE LID === */}
        {/* Increased duration to 1000ms */}
        <div 
            className={`absolute top-0 left-0 w-full h-0 transition-all duration-1000 ease-in-out origin-top
            border-t-[110px] border-l-[150px] border-r-[150px] 
            md:border-t-[140px] md:border-l-[200px] md:border-r-[200px]
            border-t-[#ba1825] border-l-transparent border-r-transparent
            ${isOpen ? 'rotate-x-180 z-10 brightness-75' : 'z-30 brightness-100'}
            `}
            style={{ 
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
            }}
        >
             {/* Decorative Gold Trim on Lid */}
             <div className={`absolute -top-[105px] -left-[145px] md:-top-[135px] md:-left-[195px] w-0 h-0
                border-t-[100px] border-l-[145px] border-r-[145px]
                md:border-t-[130px] md:border-l-[195px] md:border-r-[195px]
                border-t-transparent border-t-[#ffb703] border-l-transparent border-r-transparent
                opacity-30 pointer-events-none scale-[0.95]
             `}></div>

             {/* WAX SEAL */}
            <div className={`absolute -top-[80px] md:-top-[100px] left-1/2 -translate-x-1/2 -translate-y-1/2 
                 transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100 delay-300'}`}>
                <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                    {/* Seal Shadow */}
                    <div className="absolute inset-0 bg-black/30 rounded-full blur-sm transform translate-y-1"></div>
                    {/* Seal Body */}
                    <div className="w-full h-full bg-gradient-to-br from-[#d00000] to-[#720e1e] rounded-full border-4 border-[#9d0208] shadow-inner flex items-center justify-center">
                         {/* Embossed Heart */}
                        <div className="text-[#a41623] text-3xl font-bold drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)] filter contrast-125">
                            ♥
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Envelope;