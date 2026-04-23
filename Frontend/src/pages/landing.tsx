import { motion, Variants } from 'framer-motion';
import { ArrowRight, Camera, Image, Users, WandSparkles } from 'lucide-react';
import logoWhite from "@/assets/images/Logo_white.png";
import { useNavigate } from 'react-router-dom';
import { ROUTES } from "@/constants/routes";

const showcaseImages = [
  {
    title: "Wedding Stories",
    description: "Cinematic moments captured by trusted creators.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80"
  },
  {
    title: "Portrait Sessions",
    description: "Editorial-style portraits with premium finishing.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80"
  },
  {
    title: "Commercial Shoots",
    description: "Brand-ready visuals for campaigns and product launches.",
    image: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1200&q=80"
  }
];

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

      <main className="relative z-10">
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="min-h-screen flex items-center justify-center px-5 sm:px-8"
        >
          <div className="w-full max-w-4xl text-center py-14 sm:py-20">
            <motion.img
              variants={itemVariants}
              src={logoWhite}
              alt="PHLO"
              className="h-10 sm:h-12 w-auto mx-auto mb-8 opacity-95"
            />

            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4"
            >
              Find Creators. Build Visual Stories.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              PHLO connects users with photography creators for bookings, premium visuals, and creative collaboration.
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

            <motion.button
              variants={itemVariants}
              onClick={() => navigate(ROUTES.USER.LOGIN)}
              className="mt-5 text-xs uppercase tracking-[0.14em] text-white/70 hover:text-white transition-colors"
            >
              Login
            </motion.button>
          </div>
        </motion.section>

        <section className="px-5 sm:px-8 pb-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-6"
            >
              <Image size={18} className="text-white/70" />
              <h2 className="text-xl sm:text-2xl font-bold">Explore What You Can Create</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {showcaseImages.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="group rounded-2xl overflow-hidden border border-white/10 bg-black/30"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-white/70 mt-1">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 sm:px-8 pb-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <Users size={20} className="mb-3 text-white/80" />
              <h3 className="font-semibold mb-1">User First Booking</h3>
              <p className="text-sm text-white/70">Browse creators and choose the right photography style for your event.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <Camera size={20} className="mb-3 text-white/80" />
              <h3 className="font-semibold mb-1">Creator Opportunities</h3>
              <p className="text-sm text-white/70">Creators can onboard, publish offerings, and grow their professional presence.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.16 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <WandSparkles size={20} className="mb-3 text-white/80" />
              <h3 className="font-semibold mb-1">Premium Visual Experience</h3>
              <p className="text-sm text-white/70">From discovery to delivery, every step is designed for clean and modern usage.</p>
            </motion.div>
          </div>
        </section>

        <section className="px-5 sm:px-8 pb-24" id="about">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45 }}
            className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8 sm:p-10 text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">About PHLO</h2>
            <p className="text-sm sm:text-base text-white/75 max-w-2xl mx-auto leading-relaxed">
              PHLO is a photography platform where users discover creators, book sessions, and access curated visual content in one place.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => navigate(ROUTES.USER.ABOUT)}
                className="px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors"
              >
                Open About Page
              </button>
              <button
                onClick={() => navigate(ROUTES.USER.CREATORS)}
                className="px-6 py-3 rounded-full border border-white/20 text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Browse Creators
              </button>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;