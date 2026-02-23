import {
  Camera,
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
import UserNavbar from "@/compoents/reusable/userNavbar";
import { UserPackageService } from "@/services/user/userPackageService";
import { UserPackage } from "@/interface/user/userPackageInterface";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { S3Service } from "@/services/s3Service";

export default function LandingPage() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<UserPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await UserPackageService.listPackages();
        if (response.success && Array.isArray(response.data)) {
          const packagesWithSignedUrls = await Promise.all(
            response.data.map(async (pkg) => {
              const images = pkg.images || [];
              const signedImages = await Promise.all(
                images.map(async (img) => {
                  if (img && typeof img === 'string' && !img.startsWith("http")) {
                    try {
                      const signedUrl = await S3Service.getViewUrl(img);
                      return signedUrl || null;
                    } catch (err) {
                      console.error("Error signing image:", img, err);
                      return null;
                    }
                  }
                  return img;
                })
              );
              return { ...pkg, images: signedImages.filter(img => img !== null) };
            })
          );
          setPackages(packagesWithSignedUrls);
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

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
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <UserNavbar scrollToSection={scrollToSection} />

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
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-zinc-900/50 animate-pulse rounded-2xl p-8 h-96" />
              ))
            ) : packages.length > 0 ? (
              packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <img
                    src={(pkg.images && pkg.images.length > 0) ? pkg.images[0] : "https://images.unsplash.com/photo-1519741497674-611481863552?w=800"}
                    alt={pkg.title}
                    className="w-full h-48 object-cover rounded-xl mb-6"
                  />

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2 line-clamp-1">{pkg.title}</h3>
                    <div className="text-4xl font-bold mb-2">₹{pkg.price}</div>
                    <p className="text-gray-400 capitalize">
                      {typeof pkg.category === 'object' ? pkg.category.name : pkg.category}
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-2 text-gray-300 mb-4">
                      <Camera size={20} />
                      <span className="text-sm line-clamp-2">{pkg.description}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`${ROUTES.USER.PACKAGES}/${pkg._id}`)}
                    className="w-full py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all"
                  >
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                No packages available at the moment.
              </div>
            )}
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
                />
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