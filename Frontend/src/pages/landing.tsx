import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, Variants } from 'framer-motion';
import { ArrowRight, Zap, Globe, ShieldCheck, Aperture } from 'lucide-react';
import logoWhite from "@/assets/images/Logo_white.png";
import { useNavigate } from 'react-router-dom';
import { ROUTES } from "@/constants/routes";

const heroImages = [
  'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1920&q=80',
  'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1920&q=80',
  'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1920&q=80',
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1920&q=80',
];

const features = [
  {
    title: "Global Search",
    desc: "Discover lens masters in every corner of the world.",
    icon: Globe,
  },
  {
    title: "Verified Talent",
    desc: "Only elite, background-checked professionals.",
    icon: ShieldCheck,
  },
  {
    title: "Instant Booking",
    desc: "Seamless synchronization with your personal schedule.",
    icon: Zap,
  },
];

/* ─── tiny hook: tracks mouse position as [x%, y%] ─── */
function useMouse() {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  useEffect(() => {
    const h = (e: MouseEvent) =>
      setPos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);
  return pos;
}

const LandingPage = () => {
  const navigate = useNavigate();
  const mouse = useMouse();
  const [imgIdx, setImgIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const id = setInterval(() => setImgIdx(p => (p + 1) % heroImages.length), 5500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const fadeUp: Variants = {
    hidden: { y: 40, opacity: 0 },
    visible: (i = 0) => ({ y: 0, opacity: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 } }),
  };

  const navLinks = [
    { label: 'Explore', href: '#hero' },
    { label: 'Features', href: '#features' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="relative min-h-screen bg-[#080808] text-white overflow-x-hidden"
      style={{ fontFamily: "'Playfair Display', 'DM Sans', serif" }}
    >

      {/* ── Cursor-reactive ambient light ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-all duration-700"
        style={{
          background: `radial-gradient(600px circle at ${mouse.x}% ${mouse.y}%, rgba(200,180,140,0.06), transparent 70%)`,
        }}
      />

      {/* ── Noise grain overlay ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
        }}
      />

      {/* ─────────────── NAVBAR ─────────────── */}
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-black/60 backdrop-blur-2xl border-b border-white/[0.06]' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-5 flex items-center justify-between">

          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="group">
            <img
              src={logoWhite}
              alt="PHLO"
              className="h-9 object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            />
          </button>

          {/* Centre pill nav */}
          <div className="hidden md:flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md px-2 py-1.5">
            {navLinks.map(l => (
              <button
                key={l.label}
                onClick={() => scrollTo(l.href)}
                className="px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50 hover:text-white hover:bg-white/[0.07] rounded-full transition-all duration-200"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(ROUTES.USER.LOGIN)}
              className="hidden sm:block px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50 hover:text-white border border-white/[0.1] hover:border-white/20 rounded-full transition-all duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Login
            </button>
            <button
              onClick={() => navigate(ROUTES.USER.REGISTER)}
              className="px-5 py-2 bg-white text-black text-[11px] font-bold uppercase tracking-[0.18em] rounded-full hover:bg-stone-100 active:scale-95 transition-all duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Get Started
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ─────────────── HERO ─────────────── */}
      <section id="hero" ref={heroRef} className="relative min-h-screen flex items-end pb-28 overflow-hidden">

        {/* Parallax image slider */}
        <motion.div className="absolute inset-0 z-0" style={{ y: parallaxY }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={imgIdx}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, ease: 'easeInOut' }}
            >
              <img src={heroImages[imgIdx]} alt="" className="w-full h-full object-cover" />
            </motion.div>
          </AnimatePresence>

          {/* Multi-layer scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-[#080808]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/50 via-transparent to-transparent" />
        </motion.div>

        {/* Slide dots */}
        <div className="absolute bottom-10 right-10 z-20 flex gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setImgIdx(i)}
              className={`transition-all duration-500 rounded-full ${
                i === imgIdx ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Hero content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 w-full"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {/* Eyebrow */}
            <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3 mb-8">
              <div className="w-8 h-[1px] bg-white/40" />
              <span
                className="text-[10px] uppercase tracking-[0.5em] text-white/50"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Photography Platform
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8.5rem] font-bold leading-[0.88] tracking-[-0.02em] mb-10"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Capturing<br />
              <em className="italic text-stone-300">the</em>{' '}
              <span className="relative inline-block">
                Extraordinary
                <motion.span
                  className="absolute -bottom-2 left-0 h-[2px] bg-white/30"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.2, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  style={{ originX: 0, width: '100%' }}
                />
              </span>
            </motion.h1>

            {/* Sub + CTAs */}
            <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16">
              <motion.p
                variants={fadeUp}
                custom={2}
                className="max-w-md text-base text-white/50 leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                PHLO bridges visionaries and pixel-perfect creators. A luxury ecosystem designed for elite visual storytelling.
              </motion.p>

              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate(ROUTES.USER.REGISTER)}
                  className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-semibold text-sm uppercase tracking-[0.12em] hover:bg-stone-100 active:scale-95 transition-all duration-200"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Start as a User
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => navigate(ROUTES.CREATOR.REGISTER)}
                  className="group flex items-center gap-3 px-8 py-4 border border-white/15 text-white/70 hover:text-white hover:border-white/30 rounded-full font-semibold text-sm uppercase tracking-[0.12em] backdrop-blur-sm transition-all duration-200"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <Aperture size={15} className="text-white/40 group-hover:text-white/70 transition-colors" />
                  Join Creator Network
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute left-10 bottom-10 z-20 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[1px] h-14 bg-gradient-to-b from-transparent via-white/30 to-transparent"
          />
          <span
            className="text-[9px] uppercase tracking-[0.4em] text-white/25 -rotate-90 origin-center translate-y-8"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Scroll
          </span>
        </motion.div>
      </section>

      {/* ─────────────── STAT STRIP ─────────────── */}
      <section className="border-y border-white/[0.06] py-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-3 divide-x divide-white/[0.06]"
          >
            {[
              { n: '12K+', label: 'Verified Creators' },
              { n: '94', label: 'Countries' },
              { n: '4.9★', label: 'Avg. Rating' },
            ].map(s => (
              <div key={s.n} className="text-center px-6 py-2">
                <p
                  className="text-3xl md:text-4xl font-bold text-white mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {s.n}
                </p>
                <p
                  className="text-[11px] uppercase tracking-[0.25em] text-white/30"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─────────────── FEATURES ─────────────── */}
      <section id="features" className="py-36 px-6 sm:px-10 lg:px-14">
        <div className="max-w-7xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="mb-20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-[1px] bg-white/30" />
              <span
                className="text-[10px] uppercase tracking-[0.5em] text-white/30"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Capabilities
              </span>
            </div>
            <h2
              className="text-5xl md:text-6xl font-bold tracking-tight leading-[0.9]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              An Elevated<br />
              <em className="italic text-stone-400">Workflow</em>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="group relative p-10 border border-white/[0.07] rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.14] transition-all duration-500 overflow-hidden cursor-default"
              >
                {/* Hover glow */}
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-white/[0.03] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative z-10">
                  <div className="mb-8 w-12 h-12 flex items-center justify-center border border-white/10 rounded-2xl group-hover:border-white/20 transition-colors duration-300">
                    <f.icon size={22} className="text-white/50 group-hover:text-white/80 transition-colors duration-300" />
                  </div>
                  <h3
                    className="text-2xl font-bold mb-3 tracking-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="text-white/40 text-sm leading-relaxed group-hover:text-white/60 transition-colors duration-300"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {f.desc}
                  </p>
                </div>

                {/* Bottom line accent */}
                <motion.div
                  className="absolute bottom-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.12, duration: 0.8 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── CTA ─────────────── */}
      <section id="contact" className="py-36 px-6 sm:px-10 lg:px-14">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden border border-white/[0.08] rounded-[3rem] p-16 md:p-24 lg:p-32 text-center"
          >
            {/* BG texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-white/[0.01]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,240,200,0.04),transparent_60%)]" />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="flex justify-center items-center gap-3 mb-8"
              >
                <div className="w-10 h-[1px] bg-white/20" />
                <span
                  className="text-[10px] uppercase tracking-[0.5em] text-white/30"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  The Future of Photography
                </span>
                <div className="w-10 h-[1px] bg-white/20" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.9 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.88] tracking-tight mb-12"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Ready to Define<br />
                <em className="italic text-stone-300">Your Reality?</em>
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <button
                  onClick={() => navigate(ROUTES.USER.REGISTER)}
                  className="group flex items-center justify-center gap-3 px-10 py-4 bg-white text-black rounded-full font-semibold text-sm uppercase tracking-[0.14em] hover:bg-stone-100 active:scale-95 transition-all duration-200"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Join as a User
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => navigate(ROUTES.CREATOR.REGISTER)}
                  className="group flex items-center justify-center gap-3 px-10 py-4 border border-white/15 text-white/70 hover:text-white hover:border-white/30 rounded-full font-semibold text-sm uppercase tracking-[0.14em] transition-all duration-200"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <Aperture size={15} className="text-white/40 group-hover:text-white/70 transition-colors" />
                  Become a Creator
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────── FOOTER ─────────────── */}
      <footer className="border-t border-white/[0.06] py-14 px-6 sm:px-10 lg:px-14">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <img src={logoWhite} alt="PHLO" className="h-8 object-contain opacity-25 grayscale" />
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-white/20"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            © 2026 PHLO Studios. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Support'].map(l => (
              <button
                key={l}
                className="text-[10px] uppercase tracking-[0.2em] text-white/20 hover:text-white/50 transition-colors duration-200"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;