import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CreatorService } from "@/services/user/creatorService";
import { UserPackageService } from "@/services/user/userPackageService";
import { UserWallpaperService } from "@/services/user/userWallpaperService";
import { CreatorProfileResponse } from "@/interface/creator/creatorProfileInterface";
import { UserPackage } from "@/interface/user/userPackageInterface";
import { WallpaperData } from "@/interface/creator/creatorWallpaperInterface";
import Navbar from "@/components/reusable/userNavbar";
import { S3Media } from "@/components/reusable/s3Media";
import { ROUTES } from "@/constants/routes";
import { Globe, MessageCircle, ArrowRight, Briefcase, Image as ImageIcon } from "lucide-react";
import LogoLoading from "@/components/reusable/LogoLoading";
import { toast } from "react-toastify";

const CreatorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [creator, setCreator] = useState<CreatorProfileResponse | null>(null);
  const [packages, setPackages] = useState<UserPackage[]>([]);
  const [wallpapers, setWallpapers] = useState<WallpaperData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"packages" | "wallpapers">("packages");

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [profileRes, packagesRes, wallpapersRes] = await Promise.all([
          CreatorService.getCreatorProfile(id),
          UserPackageService.listPackages({ page: 1, limit: 6, creatorId: id }),
          UserWallpaperService.getApprovedWallpapers(1, 6, { creatorId: id })
        ]);

        if (profileRes.success) setCreator(profileRes.creator);
        if (packagesRes.success) setPackages(packagesRes.data);
        if (wallpapersRes.success) setWallpapers(wallpapersRes.data);
      } catch (error) {
        console.error("Failed to fetch creator data", error);
        toast.error("Failed to load creator profile");
        navigate(ROUTES.USER.CREATORS);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id, navigate]);

  if (loading) return <LogoLoading />;
  if (!creator) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-32 pb-24 px-4 max-w-7xl mx-auto">
        {/* Profile Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          
          {/* Left: Sticky Image & Quick Stats */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/15 relative group bg-zinc-950">
              <S3Media
                s3Key={creator.profilePhoto || ""}
                alt={creator.fullName}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70" />
              <div className="absolute inset-y-0 right-6 w-px bg-white/20" />
            </div>
          </div>

          {/* Right: Detailed Info */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6 text-center lg:text-left">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight uppercase leading-none">
                {creator.fullName}
              </h1>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {creator.specialties?.map((s, i) => (
                  <span key={i} className="px-5 py-2 rounded-full bg-zinc-900 border border-white/15 text-[10px] font-black uppercase tracking-widest text-zinc-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-zinc-950 border border-white/10 rounded-2xl p-4 md:p-5">
              <h3 className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-500 mb-2">About Creator</h3>
              <p className="text-sm md:text-base leading-relaxed text-zinc-200 line-clamp-2">
                {creator.bio || "Crafting moments into cinematic memories."}
              </p>
            </div>

            {/* Links & CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              {creator.portfolioLink && (
                <a 
                  href={creator.portfolioLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 px-8 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all"
                >
                  <Globe className="w-4 h-4" />
                  View Portfolio
                </a>
              )}
              <button 
                onClick={() => toast.info("Messaging system coming soon!")}
                className="flex-1 px-8 py-5 rounded-2xl border border-white/20 bg-zinc-950 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-zinc-900 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Direct Inquiry
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl text-center space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Experience</p>
                <p className="text-xl md:text-2xl font-black">{creator.yearsOfExperience}+ Yrs</p>
              </div>
              <div className="bg-zinc-950 border border-white/10 p-5 rounded-2xl text-center space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">City</p>
                <p className="text-xl md:text-2xl font-black truncate">{creator.city}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Content Tabs */}
        <div className="space-y-12">
          <div className="flex items-center justify-between border-b border-white/10 pb-8">
            <div className="flex gap-12">
              <button 
                onClick={() => setActiveTab("packages")}
                className={`text-xl font-black uppercase tracking-tighter transition-all ${activeTab === "packages" ? "text-white underline decoration-2 underline-offset-8" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                Packages ({packages.length})
              </button>
              <button 
                onClick={() => setActiveTab("wallpapers")}
                className={`text-xl font-black uppercase tracking-tighter transition-all ${activeTab === "wallpapers" ? "text-white underline decoration-2 underline-offset-8" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                Wallpapers ({wallpapers.length})
              </button>
            </div>
          </div>

          <div className="min-h-[40vh]">
            {activeTab === "packages" ? (
              packages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-600 space-y-4">
                  <Briefcase className="w-12 h-12 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-sm">No Active Packages</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {packages.map((pkg) => (
                    <div 
                      key={pkg._id}
                      onClick={() => navigate(ROUTES.USER.PACKAGE_DETAIL.replace(":packageId", pkg._id))}
                      className="group p-8 rounded-[2rem] bg-zinc-950 border border-white/10 hover:border-white/25 transition-all cursor-pointer space-y-6"
                    >
                      <div className="aspect-video rounded-2xl overflow-hidden border border-white/5">
                        <S3Media s3Key={pkg.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-black uppercase tracking-tighter">{pkg.title}</h4>
                        <p className="text-sm text-zinc-400 line-clamp-2">{pkg.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <p className="text-2xl font-black italic">₹{pkg.price.toLocaleString()}</p>
                        <ArrowRight className="w-6 h-6 -rotate-45 group-hover:rotate-0 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              wallpapers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-600 space-y-4">
                  <ImageIcon className="w-12 h-12 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-sm">No Digital Collectibles</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {wallpapers.map((wall) => (
                    <div 
                      key={wall._id}
                      onClick={() => navigate(ROUTES.USER.WALLPAPER_DETAIL.replace(":id", wall._id))}
                      className="group aspect-[9/16] rounded-3xl overflow-hidden border border-white/5 relative cursor-pointer"
                    >
                      <S3Media s3Key={wall.imageUrl} className="w-full h-full object-cover blur-[2px] hover:blur-0 transition-all duration-700" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-6 text-center space-y-3">
                        <p className="text-xs font-black uppercase tracking-widest">{wall.title}</p>
                        <p className="text-2xl font-black">₹{wall.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatorProfile;
