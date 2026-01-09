
import  { useState, useEffect } from 'react';
import { Camera, Users, Calendar, Star, Image, ArrowRight, Menu, X, CheckCircle, Award, TrendingUp } from 'lucide-react';
import logoWhite from "../assets/images/Logo_white.png"
import { useNavigate } from 'react-router-dom';
const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1920&q=80',
    'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1920&q=80',
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1920&q=80',
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1920&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1920&q=80'
  ];
  const navigate=useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const scrollToSection = (id:string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-2xl' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3 group cursor-pointer">
               <img
    src={logoWhite}
    alt="Logo"
    className="h-19 w-auto object-contain"
  />
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-sm font-medium hover:text-gray-300 transition-all duration-300 hover:tracking-wide">HOME</button>
              <button onClick={() => scrollToSection('features')} className="text-sm font-medium hover:text-gray-300 transition-all duration-300 hover:tracking-wide">FEATURES</button>
              <button onClick={() => scrollToSection('roles')} className="text-sm font-medium hover:text-gray-300 transition-all duration-300 hover:tracking-wide">WALLPAPERS</button>
              <button onClick={() => scrollToSection('gallery')} className="text-sm font-medium hover:text-gray-300 transition-all duration-300 hover:tracking-wide">GALLERY</button>
              <button className="px-6 py-2.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-all duration-300 hover:shadow-2xl hover:shadow-white/20 hover:scale-105">
                GET STARTED
              </button>
            </div>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 animate-fade-in">
            <div className="px-4 pt-4 pb-6 space-y-4">
              <button onClick={() => scrollToSection('home')} className="block w-full text-left py-3 text-sm font-medium hover:text-gray-300 transition-colors border-b border-white/5">HOME</button>
              <button onClick={() => scrollToSection('features')} className="block w-full text-left py-3 text-sm font-medium hover:text-gray-300 transition-colors border-b border-white/5">FEATURES</button>
              <button onClick={() => scrollToSection('roles')} className="block w-full text-left py-3 text-sm font-medium hover:text-gray-300 transition-colors border-b border-white/5">WALLPAPERS</button>
              <button onClick={() => scrollToSection('gallery')} className="block w-full text-left py-3 text-sm font-medium hover:text-gray-300 transition-colors border-b border-white/5">GALLERY</button>
              <button className="w-full px-6 py-3 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-all duration-300 mt-2">
                GET STARTED
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((img, index) => (
            <div
              key={index}
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

<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-67">
          <div className="space-y-8">
            <div className="inline-block animate-fade-in">
              <div className="flex items-center justify-center space-x-3 mb-8">
                <div className="h-px w-12 bg-white/50"></div>
                <span   style={{
    animationDelay: '0.2s',
    transform: 'translateY(8px)',
  }} className="text-sm tracking-[0.3em] text-gray-300">WELCOME TO PHLO</span>
                <div className="h-px w-12 bg-white/50"></div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Where Moments
              <span className="block mt-2 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                Become Masterpieces
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.4s'}}>
              Connect with world-class photographers, book stunning sessions, and preserve your most precious memories in timeless frames
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 animate-fade-in" style={{animationDelay: '0.6s'}}>
              <button onClick={()=>navigate("/login")} className="group relative px-10 py-5 bg-white text-black rounded-full font-semibold text-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-white/30 hover:scale-110 w-full sm:w-auto">
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  <span>Join as Client</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </button>

              <button onClick={()=>navigate("/creator/login")} className="relative px-10 py-5 border-2 border-white text-white rounded-full font-semibold text-lg overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-white/20 hover:scale-110 w-full sm:w-auto">
                <span className="relative z-10 flex items-center justify-center space-x-3 group-hover:text-black transition-colors duration-500">
                  <Camera className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span>Become a Creator</span>
                </span>
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto pt-20 animate-fade-in" style={{animationDelay: '0.8s'}}>
              {[
                { number: '10K+', label: 'Professional Photographers', icon: <Camera className="w-6 h-6" /> },
                { number: '250K+', label: 'Sessions Completed', icon: <CheckCircle className="w-6 h-6" /> },
                { number: '4.9★', label: 'Average Rating', icon: <Star className="w-6 h-6" /> },
                { number: '150+', label: 'Cities Worldwide', icon: <Award className="w-6 h-6" /> }
              ].map((stat, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-500"></div>
                  <div className="relative p-6 text-center">
                    <div className="flex justify-center mb-3 text-gray-400 group-hover:text-white transition-colors duration-300">
                      {stat.icon}
                    </div>
                    <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">{stat.number}</div>
                    <div className="text-gray-400 text-sm tracking-wide">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="text-sm tracking-[0.3em] text-gray-400 uppercase">Our Platform</span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold mb-6">
              Everything You Need
              <span className="block text-gray-400 mt-2">In One Place</span>
            </h2>
          </div>

          <div className="relative">
            <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              {[
                {
                  icon: <Calendar className="w-10 h-10" />,
                  title: 'Seamless Booking',
                  description: 'Schedule photography sessions with real-time availability, instant confirmations, and automated reminders',
                  image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&q=80'
                },
                {
                  icon: <Award className="w-10 h-10" />,
                  title: 'Verified Professionals',
                  description: 'Every photographer is thoroughly vetted, background-checked, and reviewed by our community',
                  image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&q=80'
                },
                {
                  icon: <Image className="w-10 h-10" />,
                  title: 'Digital Delivery',
                  description: 'High-resolution photos delivered through our secure cloud platform with unlimited downloads',
                  image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&q=80'
                },
                {
                  icon: <Star className="w-10 h-10" />,
                  title: 'Authentic Reviews',
                  description: 'Make informed decisions with verified reviews from real clients and detailed ratings',
                  image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=600&q=80'
                },
                {
                  icon: <TrendingUp className="w-10 h-10" />,
                  title: 'Portfolio Showcase',
                  description: 'Browse stunning portfolios with advanced filters to find photographers matching your vision',
                  image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=80'
                }
              ].map((feature, index) => (
                <div key={index} className="group relative overflow-hidden rounded-2xl flex-shrink-0 w-[400px]">
                  <div className="absolute inset-0">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40 group-hover:from-black group-hover:via-black/90 transition-all duration-500"></div>
                  </div>
                  
                  <div className="relative p-8 h-full flex flex-col justify-end min-h-[450px]">
                    <div className="mb-4 text-white transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-gray-200 transition-colors">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{feature.description}</p>
                    
                    <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <button className="text-sm font-semibold flex items-center space-x-2 text-white hover:text-gray-300 transition-colors">
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wallpapers Section */}
      <section id="roles" className="py-32 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="text-sm tracking-[0.3em] text-gray-400 uppercase">Premium Wallpapers</span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold mb-6">
              Stunning Wallpapers
              <span className="block text-gray-400 mt-2">From Our Creators</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Download exclusive wallpapers created by professional photographers
            </p>
          </div>

          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory">
              {[
                {
                  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
                  title: 'Mountain Vista',
                  creator: 'Alex Rivers',
                  downloads: '15.2K',
                  type: 'free',
                  category: 'Nature'
                },
                {
                  image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80',
                  title: 'Urban Nights',
                  creator: 'Sarah Kim',
                  downloads: '23.8K',
                  type: 'premium',
                  category: 'Urban'
                },
                {
                  image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
                  title: 'Desert Dreams',
                  creator: 'Mike Chen',
                  downloads: '18.5K',
                  type: 'free',
                  category: 'Landscape'
                },
                {
                  image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
                  title: 'Cosmic Beauty',
                  creator: 'Emma Stone',
                  downloads: '31.2K',
                  type: 'premium',
                  category: 'Space'
                },
                {
                  image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
                  title: 'Forest Path',
                  creator: 'John Davis',
                  downloads: '12.7K',
                  type: 'free',
                  category: 'Nature'
                },
                {
                  image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80',
                  title: 'Ocean Serenity',
                  creator: 'Lisa Park',
                  downloads: '27.4K',
                  type: 'premium',
                  category: 'Seascape'
                },
                {
                  image: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&q=80',
                  title: 'Golden Hour',
                  creator: 'Tom Wilson',
                  downloads: '19.8K',
                  type: 'free',
                  category: 'Sunset'
                }
              ].map((wallpaper, index) => (
                <div key={index} className="group relative overflow-hidden rounded-3xl flex-shrink-0 w-[380px] snap-center">
                  <div className="relative h-[500px]">
                    <img
                      src={wallpaper.image}
                      alt={wallpaper.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent group-hover:via-black/70 transition-all duration-500"></div>
                    
                    {wallpaper.type === 'premium' && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-2 shadow-lg">
                        <Star className="w-3 h-3 fill-current" />
                        <span>PREMIUM</span>
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                      {wallpaper.category}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="mb-4">
                        <h3 className="text-2xl font-bold mb-2">{wallpaper.title}</h3>
                        <div className="flex items-center space-x-3 text-gray-300 text-sm">
                          <span className="font-medium">{wallpaper.creator}</span>
                          <span className="text-gray-500">•</span>
                          <span className="flex items-center space-x-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>{wallpaper.downloads}</span>
                          </span>
                        </div>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <button className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition-all duration-300 ${
                          wallpaper.type === 'premium' 
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105' 
                            : 'bg-white text-black hover:bg-gray-200 hover:scale-105'
                        }`}>
                          <Image className="w-4 h-4" />
                          <span>{wallpaper.type === 'premium' ? 'Download Premium' : 'Free Download'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-3xl transition-all duration-500"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-white/20"></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-32 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="text-sm tracking-[0.3em] text-gray-400 uppercase">Portfolio Showcase</span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold mb-6">
              Moments Worth
              <span className="block text-gray-400 mt-2">Remembering</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
              'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80',
              'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80',
              'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80',
              'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80',
              'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&q=80',
              'https://images.unsplash.com/photo-1529946825183-536c6317f60e?w=600&q=80',
              'https://images.unsplash.com/photo-1502982899975-7010e4b5b7d9?w=600&q=80'
            ].map((img, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl aspect-square cursor-pointer">
                <img
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Image className="w-8 h-8 text-white transform scale-0 group-hover:scale-100 transition-transform duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="text-sm tracking-[0.3em] text-gray-400 uppercase">Simple Process</span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold mb-6">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-y-1/2"></div>
            
            {[
              {
                title: 'Discover',
                description: 'Browse our curated collection of professional photographers by style, specialization, and location',
                icon: <Users className="w-12 h-12" />
              },
              {
                title: 'Connect',
                description: 'Select your preferred photographer, choose a time slot, and securely complete your booking',
                icon: <Calendar className="w-12 h-12" />
              },
              {
                title: 'Cherish',
                description: 'Receive your professionally edited photos and share your experience with the community',
                icon: <Star className="w-12 h-12" />
              }
            ].map((step, index) => (
              <div key={index} className="relative group">
                <div className="relative bg-gradient-to-br from-white/10 to-transparent p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-500 hover:transform hover:scale-105">
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg z-10">
                    {index + 1}
                  </div>
                  
                  <div className="pt-8 text-gray-400 group-hover:text-white transition-colors duration-300 mb-6">
                    {step.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="text-sm tracking-[0.3em] text-gray-400 uppercase">Client Stories</span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold mb-6">
              Loved by Thousands
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Bride',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
                rating: 5,
                text: 'Finding our wedding photographer through PHLO was effortless. The quality exceeded all expectations and the memories captured are priceless.'
              },
              {
                name: 'Michael Chen',
                role: 'Business Owner',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
                rating: 5,
                text: 'Professional headshots for my entire team delivered within a week. The booking process was seamless and the results were outstanding.'
              },
              {
                name: 'Emily Rodriguez',
                role: 'New Mom',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
                rating: 5,
                text: 'The newborn photography session was magical. Our photographer was patient, creative, and captured moments we will treasure forever.'
              }
            ].map((testimonial, index) => (
              <div key={index} className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-500">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-white/20"
                  />
                  <div>
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-white text-white" />
                  ))}
                </div>
                
                <p className="text-gray-300 leading-relaxed italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/10"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Camera className="w-20 h-20 mx-auto mb-8 transform group-hover:rotate-12 transition-transform duration-500" />
          
          <h2 className="text-5xl sm:text-6xl font-bold mb-6">
            Ready to Create
            <span className="block text-gray-400 mt-2">Something Beautiful?</span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied clients and professional photographers on the world's leading photography booking platform
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="px-10 py-5 bg-white text-black rounded-full font-semibold text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/20">
              Get Started Today
            </button>
            <button className="px-10 py-5 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
               <img
    src={logoWhite}
    alt="Logo"
    className="h-19 w-auto object-contain"
  />
  <br />
              <p className="text-gray-400 text-sm leading-relaxed">
                Connecting talented photographers with clients who value exceptional visual storytelling.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">For Clients</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Find Photographers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Book a Session</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">For Photographers</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Join as Creator</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 PHLO Photography. All rights reserved.
            </p>
            <div className="flex space-x-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;