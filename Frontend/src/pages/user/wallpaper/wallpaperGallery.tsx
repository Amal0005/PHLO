import React, { useEffect, useState, useCallback } from "react";
import { Search, Image as ImageIcon, Download, X, Heart } from "lucide-react";
import { UserWallpaperService } from "@/services/user/userWallpaperService";
import { WishlistService } from "@/services/user/wishlistService";
import { WallpaperData } from "@/interface/creator/creatorWallpaperInterface";
import Pagination from "@/compoents/reusable/pagination";
import { S3Media } from "@/compoents/reusable/s3Media";
import { S3Service } from "@/services/s3Service";
import UserNavbar from "@/compoents/reusable/userNavbar";

const WallpaperGallery: React.FC = () => {
  const [wallpapers, setWallpapers] = useState<WallpaperData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [debouncedPrice, setDebouncedPrice] = useState<[number, number]>([0, 1000]);
  const MIN_PRICE = 0;
  const MAX_PRICE = 1000;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperData | null>(null);
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());
  const limit = 12;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPrice(priceRange);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [priceRange]);

  const fetchWallpapers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await UserWallpaperService.getApprovedWallpapers(page, limit, {
        search: debouncedSearch || undefined,
        hashtag: selectedTag || undefined,
        minPrice: debouncedPrice[0] > MIN_PRICE ? debouncedPrice[0] : undefined,
        maxPrice: debouncedPrice[1] < MAX_PRICE ? debouncedPrice[1] : undefined,
      });
      if (response?.success) {
        setWallpapers(response.data || []);
        setTotalPages(response.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch wallpapers", error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, selectedTag, debouncedPrice]);

  useEffect(() => {
    fetchWallpapers();
  }, [fetchWallpapers]);

  useEffect(() => {
    const fetchWishlistIds = async () => {
      try {
        const res = await WishlistService.getWishlistIds("wallpaper");
        if (res.success) {
          setWishlistedIds(new Set(res.ids));
        }
      } catch {
        // User might not be logged in
      }
    };
    fetchWishlistIds();
  }, []);

  const handleToggleWishlist = async (e: React.MouseEvent, wallpaperId: string) => {
    e.stopPropagation();
    try {
      const res = await WishlistService.toggle(wallpaperId, "wallpaper");
      setWishlistedIds((prev) => {
        const next = new Set(prev);
        if (res.wishlisted) {
          next.add(wallpaperId);
        } else {
          next.delete(wallpaperId);
        }
        return next;
      });
    } catch {
      console.error("Failed to toggle wishlist");
    }
  };

  const handleDownload = async (wp: WallpaperData) => {
    try {
      const creatorId = typeof wp.creatorId === "object" ? wp.creatorId._id : wp.creatorId;
      const recordRes = await UserWallpaperService.recordDownload(wp._id, creatorId);

      setWallpapers((prev) =>
        prev.map((w) =>
          w._id === wp._id ? { ...w, downloadCount: recordRes.downloadCount } : w
        )
      );
      if (selectedWallpaper?._id === wp._id) {
        setSelectedWallpaper({ ...wp, downloadCount: recordRes.downloadCount });
      }

      const url = await S3Service.getViewUrl(wp.imageUrl);
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${wp.title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      console.error("Download failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <UserNavbar />

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-3">Wallpapers</h1>
          <p className="text-gray-500 font-medium max-w-md mx-auto">
            Browse stunning wallpapers created by our talented creators
          </p>
        </div>

        {/* Search */}
        <div className="mb-4 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search wallpapers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>
        </div>

        {/* Price Range Slider */}
        <div className="mb-4 flex justify-center">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-medium">Price Range</span>
              <span className="text-xs text-gray-400 font-semibold">
                ₹{priceRange[0]} — ₹{priceRange[1]}{priceRange[1] >= MAX_PRICE ? "+" : ""}
              </span>
            </div>
            <div className="relative h-6">
              {/* Track background */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 rounded-full bg-zinc-800" />
              {/* Active track */}
              <div
                className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-green-400"
                style={{
                  left: `${(priceRange[0] / MAX_PRICE) * 100}%`,
                  right: `${100 - (priceRange[1] / MAX_PRICE) * 100}%`,
                }}
              />
              {/* Min handle */}
              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={10}
                value={priceRange[0]}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), priceRange[1] - 10);
                  setPriceRange([val, priceRange[1]]);
                }}
                className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform"
              />
              {/* Max handle */}
              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={10}
                value={priceRange[1]}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), priceRange[0] + 10);
                  setPriceRange([priceRange[0], val]);
                }}
                className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-green-400 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform"
              />
            </div>
          </div>
        </div>

        {/* Hashtag Filters */}
        <div className="mb-10 flex justify-center">
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl">
            {[
              "Nature", "Dark", "Minimal", "Urban", "Aesthetic",
              "Moody", "Travel", "Sunset", "Ocean", "Mountain",
              "Forest", "Night", "Light", "Shadow", "Abstract",
              "Creative", "Art", "Design", "Wallpaper", "HD",
              "4K", "Portrait", "City", "Vintage", "Modern",
              "Luxury", "Calm", "Focus", "Dreamy", "Epic",
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTag(selectedTag === tag ? "" : tag);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${selectedTag === tag
                  ? "bg-white text-black border-white"
                  : "bg-zinc-900 text-gray-400 border-white/10 hover:border-white/25 hover:text-white"
                  }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          </div>
        ) : wallpapers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <ImageIcon size={48} className="text-gray-600 mb-4" />
            <h3 className="text-2xl font-black mb-2">No Wallpapers Found</h3>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {wallpapers.map((wp) => (
                <div
                  key={wp._id}
                  onClick={() => setSelectedWallpaper(wp)}
                  className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all cursor-pointer group aspect-[3/4]"
                >
                  <div className="relative w-full h-full">
                    <S3Media s3Key={wp.watermarkedUrl || wp.imageUrl} className="w-full h-full object-cover" />
                    {/* Price badge */}
                    <div className="absolute top-3 left-3 z-10 flex gap-1.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${wp.price > 0 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-white/10 text-gray-300 border-white/20'}`}>
                        {wp.price > 0 ? `₹${wp.price}` : 'FREE'}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md border bg-white/10 text-gray-300 border-white/20 flex items-center gap-1">
                        <Download size={10} />
                        {wp.downloadCount ?? 0}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(wp);
                        }}
                        className="absolute top-3 right-3 p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white hover:text-black hover:scale-110 hover:shadow-lg hover:shadow-white/20 text-white transition-all duration-300 active:scale-95"
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={(e) => handleToggleWishlist(e, wp._id)}
                        className={`absolute top-3 right-16 p-2.5 backdrop-blur-md border rounded-2xl hover:scale-110 transition-all duration-300 active:scale-95 ${wishlistedIds.has(wp._id)
                            ? "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
                            : "bg-white/10 border-white/20 text-white hover:bg-white hover:text-black"
                          }`}
                        title="Wishlist"
                      >
                        <Heart size={16} fill={wishlistedIds.has(wp._id) ? "currentColor" : "none"} />
                      </button>
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white font-bold text-sm line-clamp-1">{wp.title}</p>
                        <p className="text-gray-300 text-xs">
                          {typeof wp.creatorId === "object" ? wp.creatorId.fullName : ""}
                        </p>
                        {wp.hashtags && wp.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {wp.hashtags.slice(0, 2).map((tag, i) => (
                              <span key={i} className="text-[10px] text-blue-300/90 bg-blue-500/20 px-1.5 py-0.5 rounded-full">
                                #{tag}
                              </span>
                            ))}
                            {wp.hashtags.length > 2 && (
                              <span className="text-[10px] text-gray-400">+{wp.hashtags.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(newPage) => {
                setPage(newPage);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </>
        )}

        {/* Lightbox */}
        {selectedWallpaper && (
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedWallpaper(null)}
          >
            <div
              className="relative max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <S3Media
                  s3Key={selectedWallpaper.watermarkedUrl || selectedWallpaper.imageUrl}
                  className="w-full max-h-[80vh] object-contain bg-zinc-900"
                />
              </div>
              <div className="flex items-center justify-between mt-4 px-2">
                <div>
                  <h3 className="text-xl font-black">{selectedWallpaper.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-gray-500 text-sm">
                      By {typeof selectedWallpaper.creatorId === "object" ? selectedWallpaper.creatorId.fullName : "Creator"}
                    </p>
                    <span className={`text-sm font-bold ${selectedWallpaper.price > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                      {selectedWallpaper.price > 0 ? `₹${selectedWallpaper.price}` : 'FREE'}
                    </span>
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <Download size={14} />
                      {selectedWallpaper.downloadCount ?? 0} downloads
                    </span>
                  </div>
                  {selectedWallpaper.hashtags && selectedWallpaper.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedWallpaper.hashtags.map((tag, i) => (
                        <span key={i} className="text-xs text-blue-400/80 bg-blue-500/10 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownload(selectedWallpaper)}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-white to-gray-200 text-black rounded-2xl hover:from-gray-100 hover:to-white hover:shadow-lg hover:shadow-white/10 hover:scale-105 active:scale-95 transition-all duration-300 font-semibold"
                  >
                    <Download size={18} />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={(e) => handleToggleWishlist(e, selectedWallpaper._id)}
                    className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 ${wishlistedIds.has(selectedWallpaper._id)
                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    title="Wishlist"
                  >
                    <Heart size={20} fill={wishlistedIds.has(selectedWallpaper._id) ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => setSelectedWallpaper(null)}
                    className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WallpaperGallery;
