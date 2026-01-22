import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";

import {
  Camera,
  Menu,
  X,
  ChevronRight,
  Star,
  Download,
  Award,
  CheckCircle,
  Instagram,
  Twitter,
  Facebook,
  Mail,
  ArrowRight,
} from "lucide-react";
import LogoWhite from "../../../assets/images/Logo_white.png";
import type { AppDispatch } from "@/store/store";
import { clearUser } from "@/store/user/userSlice";
import { clearAuth } from "@/store/tokenSlice";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

const dispatch = useDispatch<AppDispatch>(); 
 const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navigate = useNavigate();
const handleLogout = () => {
 dispatch(clearAuth());
dispatch(clearUser());
localStorage.clear();
navigate("/login");
};
  const packages = [
    {
      id: 1,
      name: "Wedding Photography",
      price: "$1,299",
      duration: "Full Day",
      photos: "300+ Photos",
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
      features: [
        "Pre-wedding Shoot",
        "Full Day Coverage",
        "Professional Editing",
        "Premium Photo Album",
        "All Digital Files",
      ],
      popular: true,
    },
    {
      id: 2,
      name: "Birthday Party",
      price: "$299",
      duration: "3 Hours",
      photos: "80 Photos",
      image:
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800",
      features: [
        "Event Coverage",
        "Candid Shots",
        "Group Photos",
        "Edited Photos",
        "Digital Download",
      ],
      popular: false,
    },
    {
      id: 3,
      name: "Corporate Events",
      price: "$599",
      duration: "Half Day",
      photos: "150 Photos",
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
      features: [
        "Professional Coverage",
        "Headshots Available",
        "Event Highlights",
        "Same Day Delivery",
        "Social Media Ready",
      ],
      popular: false,
    },
    {
      id: 4,
      name: "Maternity Shoot",
      price: "$399",
      duration: "2 Hours",
      photos: "60 Photos",
      image:
        "https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=800",
      features: [
        "Indoor/Outdoor Options",
        "Wardrobe Assistance",
        "Partner Photos",
        "Premium Editing",
        "Printed Portraits",
      ],
      popular: false,
    },
    {
      id: 5,
      name: "Family Portrait",
      price: "$199",
      duration: "1.5 Hours",
      photos: "40 Photos",
      image:
        "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800",
      features: [
        "Multiple Locations",
        "All Ages Welcome",
        "Natural & Posed",
        "Retouching Included",
        "Wall Art Options",
      ],
      popular: false,
    },
    {
      id: 6,
      name: "Graduation Photos",
      price: "$149",
      duration: "1 Hour",
      photos: "30 Photos",
      image:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
      features: [
        "Cap & Gown Photos",
        "Campus Locations",
        "Individual & Group",
        "Quick Turnaround",
        "Print Packages",
      ],
      popular: false,
    },
  ];

  const wallpapers = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      title: "Mountain Sunrise",
      downloads: "2.5K",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
      title: "Ocean Waves",
      downloads: "3.2K",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800",
      title: "Forest Path",
      downloads: "1.8K",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800",
      title: "City Lights",
      downloads: "4.1K",
    },
  ];

  const creators = [
    {
      id: 1,
      name: "Sarah Johnson",
      specialty: "Portrait Photography",
      avatar: "https://i.pravatar.cc/150?img=1",
      rating: 4.9,
      projects: 150,
    },
    {
      id: 2,
      name: "Michael Chen",
      specialty: "Landscape Photography",
      avatar: "https://i.pravatar.cc/150?img=2",
      rating: 4.8,
      projects: 200,
    },
    {
      id: 3,
      name: "Emma Davis",
      specialty: "Wedding Photography",
      avatar: "https://i.pravatar.cc/150?img=3",
      rating: 5.0,
      projects: 180,
    },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/95 backdrop-blur-lg border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <img
              src={LogoWhite}
              alt="Logo"
              className="h-10 lg:h-19 object-contain"
            />

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("packages")}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Packages
              </button>
              <button
                onClick={() => scrollToSection("wallpapers")}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Wallpapers
              </button>
              <button
                onClick={() => scrollToSection("creators")}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Creators
              </button>
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold">
                    {user.name || user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  className="px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all hover:scale-105"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </button>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-lg border-b border-white/10">
            <div className="px-4 py-4 space-y-3">
              <button
                onClick={() => scrollToSection("packages")}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Packages
              </button>
              <button
                onClick={() => scrollToSection("wallpapers")}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Wallpapers
              </button>
              <button
                onClick={() => scrollToSection("creators")}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Creators
              </button>
              <button className="w-full px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Sign In
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1493863641943-9b68992a8d07?q=80&w=2058&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
              filter: "grayscale(100%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            Capture Your Perfect
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              Moment
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Professional photography packages, stunning wallpapers, and talented
            creators all in one place
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollToSection("packages")}
              className="px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Explore Packages
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => scrollToSection("wallpapers")}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              Browse Wallpapers
              <Download size={20} />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="rotate-90 text-white/50" size={32} />
        </div>
      </section>

      {/* Photography Packages */}
      <section id="packages" className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Photography Packages
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Choose the perfect package for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  pkg.popular
                    ? "border-white shadow-xl shadow-white/10"
                    : "border-white/10"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-black text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-48 object-cover rounded-xl mb-6"
                />

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold mb-2">{pkg.price}</div>
                  <p className="text-gray-400">{pkg.duration}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-center gap-2 text-gray-300 mb-4">
                    <Camera size={20} />
                    <span>{pkg.photos}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle
                        size={20}
                        className="text-white flex-shrink-0"
                      />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wallpapers Section */}
      <section id="wallpapers" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Premium Wallpapers
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Download stunning high-resolution wallpapers
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wallpapers.map((wallpaper) => (
              <div
                key={wallpaper.id}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
              >
                <img
                  src={wallpaper.image}
                  alt={wallpaper.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold mb-2">
                      {wallpaper.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300 flex items-center gap-2">
                        <Download size={16} />
                        {wallpaper.downloads}
                      </span>
                      <button className="px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg font-semibold hover:bg-white/20 transition-all inline-flex items-center gap-2">
              View All Wallpapers
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Top Creators */}
      <section id="creators" className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Top Creators
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Meet our talented photography professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {creators.map((creator) => (
              <div
                key={creator.id}
                className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col items-center text-center">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-24 h-24 rounded-full mb-4 border-4 border-white/20"
                  />
                  <h3 className="text-xl font-bold mb-1">{creator.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {creator.specialty}
                  </p>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1">
                      <Star
                        size={16}
                        className="text-yellow-400 fill-yellow-400"
                      />
                      <span className="font-semibold">{creator.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Award size={16} />
                      <span className="text-sm">
                        {creator.projects} projects
                      </span>
                    </div>
                  </div>

                  <button className="w-full py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/path-to-your-logo.png"
                  alt="PHLO Logo"
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling?.classList.remove(
                      "hidden"
                    );
                  }}
                />
                <img
                  src={LogoWhite}
                  alt="Logo"
                  className="h-10 lg:h-19 object-contain"
                />{" "}
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Your one-stop destination for professional photography packages,
                stunning wallpapers, and talented creators.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <Facebook size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection("packages")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Packages
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("wallpapers")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Wallpapers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("creators")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Creators
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>hello@phlo.com</span>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
            <p>&copy; 2024 PHLO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
