import React from 'react';

interface LogoLoadingProps {
    fullScreen?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const LogoLoading: React.FC<LogoLoadingProps> = ({ fullScreen = false, size = 'md' }) => {
    const sizeMap = {
        sm: { width: 240, fontSize: 60 },
        md: { width: 400, fontSize: 80 },
        lg: { width: 600, fontSize: 120 },
    };

    const { width, fontSize } = sizeMap[size];

    return (
        <div className={`${fullScreen ? 'fixed inset-0 z-[9999] bg-black' : 'w-full h-full min-h-[300px] py-20'} flex flex-col items-center justify-center overflow-hidden`}>
            {/* Deep Space Background Atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[40%] bg-white/[0.03] blur-[120px] rounded-full animate-pulse" />
            </div>

            <div className="relative group select-none">
                <svg viewBox={`0 0 ${width} 120`} className={`w-full max-w-[${width}px] h-auto overflow-visible`}>
                    <defs>
                        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="white" stopOpacity="0" />
                            <stop offset="50%" stopColor="white" stopOpacity="1" />
                            <stop offset="100%" stopColor="white" stopOpacity="0" />
                        </linearGradient>

                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Stroke Drawing Path */}
                    <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="phlo-drawing-text"
                        style={{
                            fontSize: `${fontSize}px`,
                            fontWeight: 900,
                            letterSpacing: '0.25em',
                            fontFamily: 'system-ui, -apple-system, sans-serif'
                        }}
                    >
                        PHLO
                    </text>
                </svg>

                {/* Ambient Shimmer Line */}
                <div className="mt-8 flex flex-col items-center gap-4">
                    <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden rounded-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2 phlo-shimmer-bar" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.6em] text-zinc-500 animate-pulse">
                        Authenticating
                    </span>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .phlo-drawing-text {
          fill: none;
          stroke: white;
          stroke-width: 0.8;
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: phlo-draw-cycle 3s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }

        @keyframes phlo-draw-cycle {
          0% {
            stroke-dashoffset: 600;
            fill: rgba(255, 255, 255, 0);
            opacity: 0;
            filter: blur(4px);
          }
          15% {
            opacity: 1;
            filter: blur(0px);
          }
          40% {
            stroke-dashoffset: 0;
            fill: rgba(255, 255, 255, 0);
            stroke-width: 1;
          }
          60%, 85% {
            stroke-dashoffset: 0;
            fill: rgba(255, 255, 255, 1);
            stroke-width: 0;
            filter: drop-shadow(0 0 15px rgba(255,255,255,0.4));
          }
          100% {
            stroke-dashoffset: -600;
            fill: rgba(255, 255, 255, 0);
            opacity: 0;
            filter: blur(8px);
          }
        }

        .phlo-shimmer-bar {
          animation: phlo-shimmer-move 2s infinite ease-in-out;
        }

        @keyframes phlo-shimmer-move {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(250%); }
        }
      `}} />
        </div>
    );
};

export default LogoLoading;
