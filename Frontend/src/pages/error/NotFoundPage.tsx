import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Disc } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center relative overflow-hidden font-mono selection:bg-[#E2B354] selection:text-black">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#E2B354]/5 blur-[150px] rounded-full animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Error Code Container */}
        <div className="relative mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-[12rem] md:text-[20rem] font-black leading-none tracking-tighter italic select-none"
            style={{
              background: "linear-gradient(to bottom, #fff 30%, rgba(255,255,255,0.05))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </motion.div>
          
          {/* Glitch Overlay Text */}
          <motion.div
            animate={{ x: [0, -4, 4, -4, 0], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }}
            className="absolute inset-0 text-[12rem] md:text-[20rem] font-black leading-none tracking-tighter italic text-blue-500/20 mix-blend-screen pointer-events-none select-none"
          >
            404
          </motion.div>
          <motion.div
            animate={{ x: [0, 4, -4, 4, 0], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 0.3, repeat: Infinity, repeatType: "mirror" }}
            className="absolute inset-0 text-[12rem] md:text-[20rem] font-black leading-none tracking-tighter italic text-[#E2B354]/20 mix-blend-screen pointer-events-none select-none"
          >
            404
          </motion.div>

          {/* <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/5 backdrop-blur-3xl px-6 py-2 rounded-full border border-white/10 shadow-2xl">
             <AlertCircle className="w-4 h-4 text-[#E2B354]" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50 italic">System Exception: Target Undefined</span>
          </div> */}
        </div>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-xl mx-auto space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
               Disconnected <br /> From Reality
            </h1>
            <p className="text-xs md:text-sm font-medium text-gray-500 leading-relaxed uppercase tracking-widest max-w-md mx-auto">
              The neural pathway you are searching for does not exist in our current simulation. Please re-orient your coordinates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
            <button
               onClick={() => navigate("/")}
               className="group flex items-center gap-4 px-10 py-5 bg-white text-black rounded-3xl text-xs font-black uppercase tracking-[0.3em] hover:bg-[#E2B354] transition-all duration-500 shadow-[0_20px_50px_rgba(255,255,255,0.05)] active:scale-95 italic"
            >
              <Home className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Return Home
            </button>
            <button
               onClick={() => navigate(-1)}
               className="group flex items-center gap-4 px-10 py-5 bg-white/5 border border-white/10 rounded-3xl text-xs font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all duration-500 hover:border-white/20 active:scale-95 italic"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back Track
            </button>
          </div>
        </motion.div>
      </div>

      {/* Decorative Rotating Element */}
      <div className="absolute -bottom-32 -left-32 opacity-10 blur-sm pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <Disc className="w-96 h-96 text-white" strokeWidth={0.5} />
        </motion.div>
      </div>

      {/* Grid Pattern Bottom Overlay */}
      <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-black to-transparent z-0 pointer-events-none" />
      <div className="absolute bottom-0 w-full h-[150px] opacity-[0.05] z-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px) 0 0 / 40px 40px, linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px) 0 0 / 40px 40px",
          maskImage: "linear-gradient(to bottom, transparent, black)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black)"
        }}
      />

      {/* Version Stamp Footer */}
      <div className="absolute bottom-10 left-10 opacity-30">
        <p className="text-[8px] font-black uppercase tracking-[0.6em] italic">PHLO Core v3.0 / Error Log: 0x404</p>
      </div>
    </div>
  );
};

export default NotFoundPage;
