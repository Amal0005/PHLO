import { useState, useEffect } from 'react';
import {
  Camera,
  Star,
  ArrowRight,
  Menu,
  X,
  CheckCircle,
  Award
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
  { number: '10K+', label: 'Professional Photographers', icon: Camera },
  { number: '250K+', label: 'Sessions Completed', icon: CheckCircle },
  { number: '4.9★', label: 'Average Rating', icon: Star },
  { number: '150+', label: 'Cities Worldwide', icon: Award }
];

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const navigate = useNavigate();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* NAVBAR */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-2xl'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            <div className="cursor-pointer">
              <img
                src={logoWhite}
                alt="Logo"
                className="h-16 md:h-20 object-contain"
              />
            </div>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(prev => !prev)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>

          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">

        {/* Background Images */}
        <div className="absolute inset-0">
          {heroImages.map((img, index) => (
            <div
              key={img}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={img}
                alt="Photography"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">

          <p className="tracking-[0.3em] text-gray-300 mb-6">
            WELCOME TO PHLO
          </p>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Where Moments
            <span className="block mt-2 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              Become Masterpieces
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mt-6">
            Connect with world-class photographers and preserve your memories
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">

            <button
              onClick={() => navigate(ROUTES.USER.REGISTER)}
              className="px-8 py-4 bg-white text-black rounded-full font-semibold flex items-center gap-2 justify-center hover:scale-105 transition"
            >
              Join as Client <ArrowRight size={18} />
            </button>

            <button
              onClick={() => navigate(ROUTES.CREATOR.REGISTER)}
              className="px-8 py-4 border border-white rounded-full font-semibold flex items-center gap-2 justify-center hover:bg-white hover:text-black transition"
            >
              <Camera size={18} />
              Become Creator
            </button>

          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="mx-auto mb-2 text-gray-400" />
                  <h3 className="text-2xl font-bold">{stat.number}</h3>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              );
            })}
          </div>

        </div>

      </section>
    </div>
  );
};

export default LandingPage;