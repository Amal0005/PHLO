import { motion, Variants } from 'framer-motion';
import { ArrowRight, Camera } from 'lucide-react';
import logoWhite from "@/assets/images/Logo_white.png";
import { useNavigate } from 'react-router-dom';
import { ROUTES } from "@/constants/routes";

const LandingPage = () => {
  const navigate = useNavigate();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.45, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white selection:bg-white selection:text-black overflow-x-hidden font-sans relative">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-8rem] left-1/2 -translate-x-1/2 w-[24rem] h-[24rem] rounded-full bg-white/10 blur-[120px]"
        />
        <motion.div
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute bottom-[-10rem] right-[-6rem] w-[22rem] h-[22rem] rounded-full bg-zinc-500/20 blur-[120px]"
        />
      </div>

      <main className="relative z-10 min-h-screen flex items-center justify-center px-5 sm:px-8">
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-3xl text-center py-14 sm:py-20"
        >
          <motion.img
            variants={itemVariants}
            src={logoWhite}
            alt="PHLO"
            className="h-10 sm:h-12 w-auto mx-auto mb-8 opacity-95"
          />

          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-5xl font-black leading-tight tracking-tight mb-4"
          >
            Welcome to PHLO
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base text-white/70 max-w-xl mx-auto mb-8 leading-relaxed"
          >
            Simple, fast access for both users and creators.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
          >
            <button
              onClick={() => navigate(ROUTES.USER.REGISTER)}
              className="group w-full sm:w-auto min-w-[220px] px-7 py-3.5 bg-white text-black rounded-full font-bold text-sm uppercase tracking-[0.12em] transition-transform hover:scale-[1.02] active:scale-95 inline-flex items-center justify-center gap-2"
            >
              User Signup
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => navigate(ROUTES.CREATOR.REGISTER)}
              className="w-full sm:w-auto min-w-[220px] px-7 py-3.5 border border-white/20 rounded-full font-bold text-sm uppercase tracking-[0.12em] hover:bg-white/10 transition-transform hover:scale-[1.02] active:scale-95 inline-flex items-center justify-center gap-2"
            >
              <Camera size={16} />
              Creator Signup
            </button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-5"
          >
            <button
              onClick={() => navigate(ROUTES.USER.LOGIN)}
              className="text-xs uppercase tracking-[0.14em] text-white/70 hover:text-white transition-colors"
            >
              Login
            </button>
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
};

export default LandingPage;