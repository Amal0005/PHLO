import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [crackAnimated, setCrackAnimated] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    setMounted(true);
    const crackTimer = setTimeout(() => setCrackAnimated(true), 400);
    
    // Random glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 4000);
    
    return () => {
      clearTimeout(crackTimer);
      clearInterval(glitchInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-['Outfit',sans-serif]">
      {/* Animated grain overlay */}
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none z-50">
        <div className="w-full h-full animate-grain bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgNDAwIDQwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48ZmlsdGVyIGlkPSdub2lzZSc+PGZlVHVyYnVsZW5jZSB0eXBlPSdmcmFjdGFsTm9pc2UnIGJhc2VGcmVxdWVuY3k9JzAuOScgbnVtT2N0YXZlcz0nNCcgc3RpdGNoVGlsZXM9J3N0aXRjaCcvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbHRlcj0ndXJsKCNub2lzZSknLz48L3N2Zz4=')]"></div>
      </div>

      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Spotlight effect */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.03),transparent_50%)] pointer-events-none z-5"></div>

      {/* Main content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        
        {/* Broken Camera Illustration */}
        <div className={`relative mb-16 transition-all duration-1000 ${mounted ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
          <div className={`relative w-80 h-64 flex items-center justify-center transition-transform duration-200 ${glitchActive ? 'animate-shake' : ''}`}>
            
            {/* Glitch layers */}
            {glitchActive && (
              <>
                <div className="absolute inset-0 opacity-50 translate-x-1 translate-y-1">
                  <svg className="w-full h-full opacity-30" viewBox="0 0 320 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="160" cy="160" r="60" fill="none" stroke="white" strokeWidth="3"/>
                  </svg>
                </div>
                <div className="absolute inset-0 opacity-50 -translate-x-1 -translate-y-1">
                  <svg className="w-full h-full opacity-30" viewBox="0 0 320 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="160" cy="160" r="60" fill="none" stroke="white" strokeWidth="3"/>
                  </svg>
                </div>
              </>
            )}
            
            {/* Camera body */}
            <svg className="w-full h-full" viewBox="0 0 320 256" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Camera main body */}
              <rect x="40" y="80" width="240" height="160" rx="8" fill="#1a1a1a" stroke="white" strokeWidth="2"/>
              
              {/* Camera top section */}
              <path d="M 100 80 L 100 60 L 220 60 L 220 80" fill="#1a1a1a" stroke="white" strokeWidth="2"/>
              
              {/* Viewfinder */}
              <rect x="130" y="45" width="60" height="20" rx="3" fill="#0a0a0a" stroke="white" strokeWidth="1.5"/>
              
              {/* Flash */}
              <circle cx="250" cy="70" r="8" fill="#0a0a0a" stroke="white" strokeWidth="1.5"/>
              
              {/* Shutter button */}
              <circle cx="250" cy="100" r="6" fill="white" stroke="white" strokeWidth="2"/>
              
              {/* Lens outer ring */}
              <circle cx="160" cy="160" r="60" fill="#2a2a2a" stroke="white" strokeWidth="3" className="animate-lens-pulse"/>
              
              {/* Lens inner ring */}
              <circle cx="160" cy="160" r="50" fill="#1a1a1a" stroke="white" strokeWidth="2"/>
              
              {/* Lens glass */}
              <circle cx="160" cy="160" r="42" fill="#0a0a0a" stroke="white" strokeWidth="1.5"/>
              
              {/* Animated lens aperture blades */}
              <g className="animate-aperture-rotate" style={{ transformOrigin: '160px 160px' }}>
                {[...Array(6)].map((_, i) => (
                  <path
                    key={i}
                    d={`M 160 160 L ${160 + 30 * Math.cos((i * 60 - 15) * Math.PI / 180)} ${160 + 30 * Math.sin((i * 60 - 15) * Math.PI / 180)} L ${160 + 30 * Math.cos((i * 60 + 15) * Math.PI / 180)} ${160 + 30 * Math.sin((i * 60 + 15) * Math.PI / 180)} Z`}
                    fill="white"
                    opacity="0.05"
                  />
                ))}
              </g>
              
              {/* Lens reflection - animated */}
              <circle cx="145" cy="145" r="15" fill="white" opacity="0.1" className="animate-shimmer"/>
              
              {/* Camera details */}
              <rect x="60" y="100" width="30" height="4" rx="2" fill="white" opacity="0.3"/>
              <rect x="60" y="110" width="20" height="4" rx="2" fill="white" opacity="0.3"/>
              
              {/* Brand mark */}
              <text x="160" y="230" fill="white" fontSize="12" fontFamily="Courier, monospace" textAnchor="middle" opacity="0.5">404</text>
              
              {/* Animated crack lines */}
              <g className={`transition-all duration-1000 ${crackAnimated ? 'opacity-100' : 'opacity-0'}`}>
                {/* Main crack 1 */}
                <path 
                  d="M 130 130 L 160 160 L 175 190" 
                  stroke="white" 
                  strokeWidth="2" 
                  fill="none" 
                  strokeLinecap="round"
                  className="animate-crack-draw"
                  style={{ animationDelay: '0ms' }}
                />
                
                {/* Main crack 2 */}
                <path 
                  d="M 190 130 L 160 160 L 140 185" 
                  stroke="white" 
                  strokeWidth="2" 
                  fill="none" 
                  strokeLinecap="round"
                  className="animate-crack-draw"
                  style={{ animationDelay: '100ms' }}
                />
                
                {/* Branch crack 1 */}
                <path 
                  d="M 150 145 L 135 140" 
                  stroke="white" 
                  strokeWidth="1.5" 
                  fill="none" 
                  strokeLinecap="round"
                  className="animate-crack-draw"
                  style={{ animationDelay: '200ms' }}
                />
                
                {/* Branch crack 2 */}
                <path 
                  d="M 170 145 L 185 140" 
                  stroke="white" 
                  strokeWidth="1.5" 
                  fill="none" 
                  strokeLinecap="round"
                  className="animate-crack-draw"
                  style={{ animationDelay: '250ms' }}
                />
                
                {/* Small cracks */}
                <path 
                  d="M 155 170 L 148 178" 
                  stroke="white" 
                  strokeWidth="1" 
                  fill="none" 
                  strokeLinecap="round"
                  className="animate-crack-draw"
                  style={{ animationDelay: '300ms' }}
                />
                
                <path 
                  d="M 165 175 L 172 183" 
                  stroke="white" 
                  strokeWidth="1" 
                  fill="none" 
                  strokeLinecap="round"
                  className="animate-crack-draw"
                  style={{ animationDelay: '350ms' }}
                />
              </g>
              
              {/* Impact point */}
              <circle 
                cx="160" 
                cy="160" 
                r="4" 
                fill="white" 
                className={`transition-all duration-300 ${crackAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
              />
            </svg>

            {/* Warning icon - animated */}
            <div className={`absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full flex items-center justify-center transition-all duration-700 delay-500 ${crackAnimated ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
              <svg className="w-10 h-10 text-black animate-pulse-warning" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
              </svg>
            </div>

            {/* Shatter particles */}
            {crackAnimated && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-white/40 animate-shatter"
                    style={{
                      top: '50%',
                      left: '50%',
                      animationDelay: `${i * 50}ms`,
                      '--tx': `${Math.cos((i * Math.PI * 2) / 6) * 80}px`,
                      '--ty': `${Math.sin((i * Math.PI * 2) / 6) * 80}px`,
                    } as React.CSSProperties}
                  ></div>
                ))}
              </div>
            )}

            {/* Scanning line effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-scan absolute"></div>
            </div>
          </div>
        </div>

        {/* Error code */}
        <div className={`mb-8 transition-all duration-1000 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="font-['Bebas_Neue',sans-serif] text-8xl md:text-9xl tracking-widest text-white relative">
            <span className={`relative inline-block ${glitchActive ? 'animate-glitch-text' : ''}`}>
              404
              <span className="absolute inset-0 text-white/20 blur-sm animate-pulse-slow">404</span>
              <span className="absolute inset-0 text-white/10 blur-md">404</span>
            </span>
          </div>
        </div>

        {/* Text content */}
        <div className={`text-center max-w-2xl mb-12 transition-all duration-1000 delay-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Something went wrong before this shot could load.
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 leading-relaxed">
            Good photos—and pages—are just a click away.
          </p>
        </div>

        {/* Action buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <button
            onClick={() => navigate('/')}
            className="group relative px-8 py-4 bg-white text-black font-semibold tracking-wide overflow-hidden transition-all hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-white/20"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="relative">
                Return to Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
              </span>
            </span>
            
            {/* Ripple effect on hover */}
            <span className="absolute inset-0 scale-0 group-hover:scale-100 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-20 transition-all duration-500 rounded-full blur-xl"></span>
          </button>

          <button
            onClick={() => navigate(-1)}
            className="group relative px-8 py-4 border-2 border-white/30 text-white font-semibold tracking-wide hover:border-white hover:bg-white/5 transition-all hover:scale-105 active:scale-95 overflow-hidden"
          >
            <span className="flex items-center gap-2 relative z-10">
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </span>
            
            {/* Border glow effect */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="absolute inset-0 rounded border-2 border-white animate-ping-slow"></span>
            </span>
          </button>
        </div>

        {/* Decorative film strip */}
        <div className={`mt-20 flex items-center gap-2 transition-all duration-1000 delay-1000 ${mounted ? 'translate-y-0 opacity-20' : 'translate-y-4 opacity-0'}`}>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="w-2 h-3 border border-white/40 animate-film-roll"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
          <div className="px-4 py-1 border-y border-white/40 text-xs font-mono tracking-widest relative overflow-hidden">
            <span className="relative z-10">PAGE NOT FOUND</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer-slide"></div>
          </div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="w-2 h-3 border border-white/40 animate-film-roll"
                style={{ animationDelay: `${(i + 5) * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=Bebas+Neue&display=swap');

        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -25%); }
          40% { transform: translate(-5%, 25%); }
          50% { transform: translate(-15%, 10%); }
          60% { transform: translate(15%, 0%); }
          70% { transform: translate(0%, 15%); }
          80% { transform: translate(-25%, 0%); }
          90% { transform: translate(10%, 10%); }
        }

        @keyframes crack-draw {
          from {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
          }
          to {
            stroke-dasharray: 100;
            stroke-dashoffset: 0;
          }
        }

        @keyframes pulse-warning {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes shatter {
          0% {
            transform: translate(-50%, -50%) translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0.5;
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }

        @keyframes lens-pulse {
          0%, 100% {
            r: 60;
            opacity: 1;
          }
          50% {
            r: 62;
            opacity: 0.8;
          }
        }

        @keyframes aperture-rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes shimmer {
          0%, 100% {
            opacity: 0.05;
            transform: scale(1);
          }
          50% {
            opacity: 0.15;
            transform: scale(1.2);
          }
        }

        @keyframes scan {
          0% {
            top: -10%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 110%;
            opacity: 0;
          }
        }

        @keyframes glitch-text {
          0%, 100% {
            transform: translate(0);
            text-shadow: none;
          }
          20% {
            transform: translate(-3px, 3px);
            text-shadow: 3px 0 0 rgba(255, 255, 255, 0.3), -3px 0 0 rgba(255, 255, 255, 0.3);
          }
          40% {
            transform: translate(3px, -3px);
            text-shadow: -3px 0 0 rgba(255, 255, 255, 0.3), 3px 0 0 rgba(255, 255, 255, 0.3);
          }
          60% {
            transform: translate(-3px, -3px);
            text-shadow: 3px 3px 0 rgba(255, 255, 255, 0.3);
          }
          80% {
            transform: translate(3px, 3px);
            text-shadow: -3px -3px 0 rgba(255, 255, 255, 0.3);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.3;
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.1);
            opacity: 0;
          }
        }

        @keyframes film-roll {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-2px);
            opacity: 0.8;
          }
        }

        @keyframes shimmer-slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-grain {
          animation: grain 0.6s steps(5) infinite;
        }

        .animate-crack-draw {
          animation: crack-draw 0.6s ease-out forwards;
        }

        .animate-pulse-warning {
          animation: pulse-warning 2s ease-in-out infinite;
        }

        .animate-shatter {
          animation: shatter 1s ease-out forwards;
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-lens-pulse {
          animation: lens-pulse 3s ease-in-out infinite;
        }

        .animate-aperture-rotate {
          animation: aperture-rotate 20s linear infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        .animate-scan {
          animation: scan 4s linear infinite;
        }

        .animate-glitch-text {
          animation: glitch-text 0.3s ease-in-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-film-roll {
          animation: film-roll 2s ease-in-out infinite;
        }

        .animate-shimmer-slide {
          animation: shimmer-slide 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;