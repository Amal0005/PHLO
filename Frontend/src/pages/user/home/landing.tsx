import {
  ChevronRight,
  Star,
  Download,
  Award,
  Instagram,
  Twitter,
  Facebook,
  Mail,
  ArrowRight,
} from "lucide-react";
import LogoWhite from "@/assets/images/Logo_white.png";
import UserNavbar from "@/components/reusable/userNavbar";
import { UserPackageService } from "@/services/user/userPackageService";
import { UserPackage } from "@/interface/user/userPackageInterface";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { S3Service } from "@/services/s3Service";
import { UserWallpaperService } from "@/services/user/userWallpaperService";
import { WallpaperData } from "@/interface/creator/creatorWallpaperInterface";
import { S3Media } from "@/components/reusable/s3Media";
import { CreatorService } from "@/services/user/creatorService";
import { CreatorProfileResponse } from "@/interface/creator/creatorProfileInterface";

export default function LandingPage() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<UserPackage[]>([]);
  const [wallpapers, setWallpapers] = useState<WallpaperData[]>([]);
  const [loading, setLoading] = useState(true);
  const [wallpaperLoading, setWallpaperLoading] = useState(true);

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
          setPackages(packagesWithSignedUrls.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchWallpapers = async () => {
      try {
        setWallpaperLoading(true);
        const response = await UserWallpaperService.getApprovedWallpapers(1, 4);
        if (response.success && Array.isArray(response.data)) {
          setWallpapers(response.data);
        }
      } catch (error) {
        console.error("Error fetching wallpapers:", error);
      } finally {
        setWallpaperLoading(false);
      }
    };

    fetchPackages();
    fetchWallpapers();
  }, []);


  const [creators, setCreators] = useState<CreatorProfileResponse[]>([]);
  const [creatorsLoading, setCreatorsLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setCreatorsLoading(true);
        const response = await CreatorService.listCreators(1, 3);
        if (response.success && Array.isArray(response.data)) {
          setCreators(response.data);
        }
      } catch (error) {
        console.error("Error fetching creators:", error);
      } finally {
        setCreatorsLoading(false);
      }
    };
    fetchCreators();
  }, []);



  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <UserNavbar />

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
              onClick={() => navigate(ROUTES.USER.PACKAGES)}
              className="px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Explore Packages
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => navigate(ROUTES.USER.WALLPAPERS)}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              Browse Wallpapers
              <Download size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Photography Packages - Cinematic Spotlight Grid */}
      <section id="packages" className="py-24 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl text-left">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase leading-[0.9]">
                Professional <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
                  Packages
                </span>
              </h2>
              <p className="text-gray-500 text-lg font-medium border-l-2 border-white/20 pl-6">
                Tailored photography experiences crafted for those who demand excellence.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/5] bg-zinc-900/50 animate-pulse rounded-[2.5rem]" />
              ))
            ) : packages.length > 0 ? (
              packages.map((pkg, idx) => (
                <div
                  key={pkg._id}
                  onClick={() => navigate(`${ROUTES.USER.PACKAGES}/${pkg._id}`)}
                  className={`group relative bg-zinc-900/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/5 hover:border-white/20 transition-all duration-500 cursor-pointer overflow-hidden ${
                    idx === 1 ? "md:translate-y-8" : ""
                  }`}
                >
                  <div className="relative h-64 mb-8 overflow-hidden rounded-3xl">
                    <img
                      src={(pkg.images && pkg.images.length > 0) ? pkg.images[0] : "https://images.unsplash.com/photo-1519741497674-611481863552?w=800"}
                      alt={pkg.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute top-4 right-4 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                      <span className="text-xs font-black tracking-widest uppercase text-white">₹{pkg.price}</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3 tracking-tight">{pkg.title}</h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {pkg.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                      {pkg.category && typeof pkg.category === 'object' ? (pkg.category as any).name : pkg.category}
                    </span>
                    <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-white group-hover:text-black transition-all">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-20">No packages found.</div>
            )}
          </div>

          <div className="mt-20 text-center">
            <button
              onClick={() => navigate(ROUTES.USER.PACKAGES)}
              className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_50px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 mx-auto"
            >
              View All Packages
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Wallpapers Section - Magazine Masonry */}
      <section id="wallpapers" className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 text-center md:text-left gap-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter uppercase">
                Premium Wallpapers
              </h2>
              <p className="text-gray-400 font-medium">Stunning 8K resolution assets for your vision.</p>
            </div>
            <button 
              onClick={() => navigate(ROUTES.USER.WALLPAPERS)}
              className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] hover:text-white/60 transition-colors"
            >
              Explore Collection
              <div className="w-12 h-[1px] bg-white" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 items-start">
            {wallpaperLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-zinc-900 animate-pulse rounded-3xl" />
              ))
            ) : wallpapers.length > 0 ? (
              wallpapers.map((wallpaper, idx) => (
                <div
                  key={wallpaper._id}
                  className={`group relative overflow-hidden rounded-3xl cursor-pointer ${
                    idx % 2 === 1 ? "md:mt-12" : ""
                  }`}
                  onClick={() => navigate(ROUTES.USER.WALLPAPER_DETAIL.replace(":id", wallpaper._id))}
                >
                  <div className="aspect-[3/4] w-full">
                    <S3Media
                      s3Key={wallpaper.watermarkedUrl || wallpaper.imageUrl}
                      alt={wallpaper.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-sm font-bold tracking-widest uppercase mb-1">{wallpaper.title}</h3>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50">
                        <Download size={12} /> 8K Asset
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : null}
          </div>
        </div>
      </section>

      {/* Top Creators - Glassmorphic Pods */}
      <section id="creators" className="py-24 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter uppercase">
              Elite Creators
            </h2>
            <p className="text-gray-500 font-medium max-w-xl mx-auto">
              Connecting you with the top 1% of photography professionals worldwide.
            </p>
          </div>

          <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-8 pb-8 no-scrollbar scroll-smooth">
            {creatorsLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="min-w-[300px] aspect-square bg-zinc-900 animate-pulse rounded-[3rem]" />
              ))
            ) : creators.length > 0 ? (
              creators.map((creator) => (
                <div
                  key={creator._id}
                  onClick={() => navigate(ROUTES.USER.CREATOR_DETAIL.replace(":id", creator._id))}
                  className="min-w-[300px] md:min-w-0 group relative bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 flex flex-col items-center text-center hover:bg-zinc-800/50 transition-all cursor-pointer"
                >
                  <div className="relative w-32 h-32 mb-8">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl group-hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100" />
                    <div className="relative w-full h-full rounded-full border-4 border-white/10 overflow-hidden group-hover:border-white transition-colors duration-500">
                      <S3Media
                        s3Key={creator.profilePhoto || ""}
                        alt={creator.fullName}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black mb-2 tracking-tight">{creator.fullName}</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-6">
                    {creator.specialties?.[0] || "Professional"}
                  </p>

                  <div className="flex items-center gap-6 py-4 px-6 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <Star size={14} className="text-white fill-white" />
                      <span className="text-sm font-black">5.0</span>
                    </div>
                    <div className="w-[1px] h-4 bg-white/10" />
                    <div className="flex items-center gap-2 text-white/40">
                      <Award size={14} />
                      <span className="text-[10px] font-black uppercase">{creator.yearsOfExperience}+ YRS</span>
                    </div>
                  </div>
                </div>
              ))
            ) : null}
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={() => navigate(ROUTES.USER.CREATORS)}
              className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all"
            >
              View All Creators
            </button>
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
                    onClick={() => navigate(ROUTES.USER.PACKAGES)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Packages
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate(ROUTES.USER.WALLPAPERS)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Wallpapers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate(ROUTES.USER.CREATORS)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Creators
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate(ROUTES.USER.ABOUT)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About PHLO
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

