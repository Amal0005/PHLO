import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Camera,
  Star,
  ArrowRight,
  Menu,
  X,
  CheckCircle,
  Award,
  Zap,
  Globe,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import logoWhite from "@/assets/images/Logo_white.png";
import { useNavigate } from 'react-router-dom';
import { ROUTES } from "@/constants/routes";

const heroImages = [
  'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1920&q=80',
  'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1920&q=80',
  'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1920&q=80',
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1920&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1920&q=80'
];

const stats = [
  { number: '10K+', label: 'Photographers', icon: Camera, delay: 0.1 },
  { number: '250K+', label: 'Sessions', icon: CheckCircle, delay: 0.2 },
  { number: '4.9★', label: 'Average Rating', icon: Star, delay: 0.3 },
  { number: '150+', label: 'Cities', icon: Award, delay: 0.4 }
];

const features = [
  { 
    title: "Global Search", 
    desc: "Discover lens masters in every corner of the world.", 
    icon: Globe,
    color: "from-blue-500/20 to-cyan-500/20"
  },
  { 
    title: "Verified Talent", 
    desc: "Only elite, background-checked professionals.", 
    icon: ShieldCheck ,
    color: "from-purple-500/20 to-pink-500/20"
  },
  { 
    title: "Instant Booking", 
    desc: "Seamless synchronization with your personal schedule.", 
    icon: Zap ,
    color: "from-orange-500/20 to-red-500/20"
  }
];

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black overflow-x-hidden font-sans">
      
      {/* Dynamic Background Atmospheric Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[150px] animate-pulse" />
      </div>

      {/* NAVBAR */}
      <nav className={`fixed w-full z-[60] transition-all duration-700 ${
        isScrolled
          ? 'bg-black/50 backdrop-blur-2xl border-b border-white/5 py-4'
          : 'bg-transparent py-8'
      }`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="flex justify-between items-center">
            
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="relative group cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img src={logoWhite} alt="PHLO" className="h-10 md:h-14 object-contain brightness-110 drop-shadow-2xl transition-transform group-hover:scale-105" />
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              {['Explore', 'Creators', 'Experience'].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  whileHover={{ y: -2 }}
                  className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 hover:text-white transition-colors"
                >
                  {item}
                </motion.a>
              ))}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(ROUTES.USER.LOGIN)}
                className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all"
              >
                Sign In
              </motion.button>
            </div>

            <button className="md:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[55] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {['Explore', 'Creators', 'Experience'].map((item) => (
              <a key={item} href="#" className="text-2xl font-black uppercase tracking-[0.3em]" onClick={() => setMobileMenuOpen(false)}>{item}</a>
            ))}
            <button 
              onClick={() => navigate(ROUTES.USER.LOGIN)}
              className="px-12 py-4 bg-white text-black rounded-full font-black uppercase tracking-[0.3em]"
            >
              Start Journey
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        
        {/* Background Slider */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img src={heroImages[currentImageIndex]} alt="Hero" className="w-full h-full object-cover grayscale-[20%] contrast-[1.1]" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#050505]" />
              <div className="absolute inset-0 bg-black/30" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 px-6 max-w-6xl mx-auto text-center pt-20"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <Sparkles size={14} className="text-yellow-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">The Future of Photography</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter mb-8"
          >
            CAPTURING THE <br/>
            <span className="bg-gradient-to-r from-white via-white/50 to-white/10 bg-clip-text text-transparent italic">EXTRAORDINARY</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 font-medium leading-relaxed tracking-wide"
          >
            PHLO bridges the gap between visionaries and pixel-perfect creators. A luxury eco-system designed for elite visual storytelling.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => navigate(ROUTES.USER.REGISTER)}
              className="group relative px-10 py-5 bg-white text-black rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] overflow-hidden transition-all hover:pr-14 active:scale-95"
            >
              <span className="relative z-10">Start as a User</span>
              <ArrowRight className="absolute right-6 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" size={20} />
            </button>

            <button
              onClick={() => navigate(ROUTES.CREATOR.REGISTER)}
              className="px-10 py-5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2rem] font-black text-sm uppercase tracking-[0.1em] hover:bg-white/10 transition-all flex items-center gap-3 active:scale-95 border-b-4 border-white/5"
            >
              <Camera size={18} className="text-white/50" />
              Join Creator Network
            </button>
          </motion.div>

          {/* Stats Hub */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mt-24 pt-12 border-t border-white/5"
          >
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="group p-6 rounded-3xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5"
              >
                <div className="flex flex-col items-center">
                  <div className="p-3 bg-white/5 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                    <stat.icon size={20} className="text-white/40" />
                  </div>
                  <h3 className="text-3xl font-black mb-1">{stat.number}</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20"
        >
          <div className="w-[1px] h-20 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-[10px] font-black uppercase tracking-[1em] text-white/30 mb-6">Capabilities</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tight">ELEVATED WORKFLOW</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="relative group p-10 bg-white/[0.01] border border-white/5 rounded-[3rem] hover:bg-white/[0.03] hover:border-white/10 transition-all overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${f.color} blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center mb-8 border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
                    <f.icon size={28} />
                  </div>
                  <h4 className="text-2xl font-black mb-4 uppercase tracking-tighter">{f.title}</h4>
                  <p className="text-white/40 leading-relaxed font-medium">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CALL-BACK */}
      <section className="py-32 px-6">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="max-w-6xl mx-auto p-16 md:p-32 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-[4rem] text-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <h2 className="text-4xl md:text-7xl font-black mb-10 tracking-tight leading-none">
            READY TO <br/>
            <span className="bg-white text-black px-4 ml-[-1rem] md:ml-[-2rem] leading-tight">DEFINE REALITY?</span>
          </h2>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center mt-12">
            <button 
              onClick={() => navigate(ROUTES.USER.REGISTER)}
              className="px-12 py-5 bg-white text-black rounded-full font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all flex items-center justify-center gap-4"
            >
              Launch Now
              <Zap size={20} fill="currentColor" />
            </button>
          </div>
          
          <p className="mt-12 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">The industry standard for high-end photography</p>
        </motion.div>
      </section>

      {/* FOOTER LINKS */}
      <footer className="py-20 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <img src={logoWhite} alt="PHLO" className="h-10 opacity-30 grayscale" />
          <div className="flex gap-8">
            {['Instagram', 'Dribbble', 'LinkedIn'].map(p => (
              <a key={p} href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors">{p}</a>
            ))}
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">© 2026 PHLO STUDIOS. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;