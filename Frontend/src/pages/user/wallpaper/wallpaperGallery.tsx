import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Image as ImageIcon, Download, X, Bookmark } from "lucide-react";

import { UserWallpaperService } from "@/services/user/userWallpaperService";
import { WishlistService } from "@/services/user/wishlistService";
import { WallpaperData } from "@/interface/creator/creatorWallpaperInterface";
import { S3Media } from "@/components/reusable/s3Media";
import { S3Service } from "@/services/s3Service";
import UserNavbar from "@/components/reusable/userNavbar";
import { FilterSearch } from "@/components/reusable/FilterComponents";
import { toast } from "react-toastify";
import { useDebounce } from "@/hooks/useDebounce";
import logo from "@/assets/images/Logo_white.png";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

// Memoized Card for performance
const WallpaperCard = React.memo(({ 
  wp, 
  orientation, 
  wishlisted, 
  onSelect, 
  onBuy, 
  onDownload, 
  onToggleWishlist 
}: { 
  wp: WallpaperData; 
  orientation?: string; 
  wishlisted: boolean;
  onSelect: (wp: WallpaperData) => void;
  onBuy: (wp: WallpaperData) => void;
  onDownload: (wp: WallpaperData) => void;
  onToggleWishlist: (e: React.MouseEvent, id: string) => void;
}) => (
  <div
    onClick={() => onSelect(wp)}
    className="mb-4 inline-block w-full break-inside-avoid bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 cursor-pointer group"
  >
    <div className="relative w-full aspect-auto overflow-hidden bg-zinc-950">
      <S3Media 
        s3Key={wp.watermarkedUrl || wp.imageUrl} 
        className="w-full h-auto object-cover block transition-transform duration-700 group-hover:scale-105" 
      />
      
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${wp.price > 0 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-white/10 text-gray-300 border-white/20'}`}>
          {wp.price > 0 ? `₹${wp.price}` : 'FREE'}
        </span>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (wp.price > 0 && !wp.isPurchased) onBuy(wp);
              else onDownload(wp);
            }}
            className="p-2.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white hover:text-black transition-all"
          >
            <Download size={14} />
          </button>
          <button
            onClick={(e) => onToggleWishlist(e, wp._id)}
            className={`p-2.5 backdrop-blur-md border rounded-xl transition-all ${
              wishlisted ? "bg-red-500/20 border-red-500/30 text-red-400" : "bg-white/10 border-white/10 text-white"
            }`}
          >
            <Bookmark size={14} fill={wishlisted ? "currentColor" : "none"} />
          </button>
        </div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white font-black text-xs uppercase tracking-widest mb-1 line-clamp-1">{wp.title}</p>
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-white/50 uppercase tracking-tighter">
              {typeof wp.creatorId === "object" ? (wp.creatorId as any).fullName : "Artist"}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
));



const WallpaperGallery: React.FC = () => {
  const navigate = useNavigate();
  const { id: urlId } = useParams();
  type Orientation = "vertical" | "horizontal" | "square";


  // Handle Deep Linking moved to after state initializations

  const [wallpapers, setWallpapers] = useState<WallpaperData[]>([]);
  const [orientationMap, setOrientationMap] = useState<Record<string, Orientation>>({});
  const [selectedOrientation, setSelectedOrientation] = useState<"all" | "vertical" | "horizontal">("all");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [selectedTag, setSelectedTag] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const debouncedPrice = useDebounce(priceRange, 500);
  const MIN_PRICE = 0;
  const MAX_PRICE = 1000;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperData | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [purchasedId, setPurchasedId] = useState<string | null>(null);
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const limit = 12;

  // Handle Deep Linking
  useEffect(() => {
    const checkUrlId = async () => {
      if (urlId) {
        // First check if it's already in the wallpapers list
        const existing = wallpapers.find(wp => wp._id === urlId);
        if (existing) {
          setSelectedWallpaper(existing);
        } else {
          // If not in current list (maybe on another page), fetch it specifically
          try {
            const wallpaper = await UserWallpaperService.getWallpaperById(urlId);
            if (wallpaper) {
              setSelectedWallpaper(wallpaper);
            }
          } catch (error) {
            console.error("Failed to fetch wallpaper for deep link", error);
          }
        }
      }
    };
    checkUrlId();
  }, [urlId, wallpapers]);

  // Reset feed when filters change
  useEffect(() => {
    setPage(1);
    setWallpapers([]);
    setHasMore(true);
  }, [debouncedSearch, debouncedPrice, selectedTag]);

  const fetchWallpapers = useCallback(async (isFirstLoad = false) => {
    try {
      if (isFirstLoad) setLoading(true);
      else setIsLoadingMore(true);

      const currentPage = isFirstLoad ? 1 : page;

      const response = await UserWallpaperService.getApprovedWallpapers(currentPage, limit, {
        search: debouncedSearch || undefined,
        hashtag: selectedTag || undefined,
        minPrice: debouncedPrice[0] > MIN_PRICE ? debouncedPrice[0] : undefined,
        maxPrice: debouncedPrice[1] < MAX_PRICE ? debouncedPrice[1] : undefined,
      });

      if (response?.success) {
        const newWallpapers = response.data || [];
        setWallpapers(prev => (currentPage === 1 ? newWallpapers : [...prev, ...newWallpapers]));
        setHasMore(newWallpapers.length === limit);
      }
    } catch (error) {
      console.error("Failed to fetch wallpapers", error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [page, debouncedSearch, selectedTag, debouncedPrice]);

  useEffect(() => {
    fetchWallpapers(page === 1);
  }, [page, debouncedSearch, selectedTag, debouncedPrice, fetchWallpapers]);

  // Infinite Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500 &&
        !isLoadingMore &&
        !loading &&
        hasMore
      ) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoadingMore, loading, hasMore]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      const id = params.get("id");
      if (id) {
        setPurchasedId(id);
        setShowSuccessModal(true);
        // Manually update the purchased status in the local state for better UX
        setWallpapers(prev => prev.map(wp =>
          wp._id === id ? { ...wp, isPurchased: true } : wp
        ));
      }
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    } else if (params.get("cancel") === "true") {
      toast.error("Payment cancelled.");
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [wallpapers.length]);

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

  // Optimized Orientation Detection
  useEffect(() => {
    let isCancelled = false;

    const detectOrientation = async () => {
      // Only detect for unresolved wallpapers
      const unresolved = wallpapers.filter((wp) => !orientationMap[wp._id]);
      if (!unresolved.length) return;

      // Process in smaller batches to avoid UI freezing
      const batchSize = 4;
      for (let i = 0; i < unresolved.length; i += batchSize) {
        if (isCancelled) break;
        const batch = unresolved.slice(i, i + batchSize);
        
        const results = await Promise.all(
          batch.map(async (wp) => {
            try {
              const mediaKey = wp.watermarkedUrl || wp.imageUrl;
              const url = await S3Service.getViewUrl(mediaKey);
              return new Promise<{id: string, orientation: Orientation}>((resolve) => {
                const img = new Image();
                img.onload = () => {
                  const orientation = img.naturalHeight > img.naturalWidth ? "vertical" : 
                                     img.naturalWidth > img.naturalHeight ? "horizontal" : "square";
                  resolve({ id: wp._id, orientation });
                };
                img.onerror = () => resolve({ id: wp._id, orientation: "vertical" });
                img.src = url;
              });
            } catch {
              return { id: wp._id, orientation: "vertical" as Orientation };
            }
          })
        );

        if (!isCancelled) {
          setOrientationMap(prev => {
            const next = { ...prev };
            results.forEach(res => { next[res.id] = res.orientation; });
            return next;
          });
        }
        
        // Small delay between batches to let the UI breathe
        await new Promise(r => setTimeout(r, 100));
      }
    };

    detectOrientation();
    return () => { isCancelled = true; };
  }, [wallpapers]);

  const filteredWallpapers = useMemo(() => {
    if (selectedOrientation === "all") return wallpapers;
    return wallpapers.filter((wp) => orientationMap[wp._id] === selectedOrientation);
  }, [wallpapers, orientationMap, selectedOrientation]);

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
      toast.success(res.wishlisted ? "Saved" : "Unsaved");
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  const handleBuy = async (wp: WallpaperData) => {
    try {
      setLoading(true);
      const successUrl = `${window.location.origin}/wallpapers?success=true&id=${wp._id}`;
      const cancelUrl = `${window.location.origin}/wallpapers?cancel=true`;

      const res = await UserWallpaperService.buyWallpaper(wp._id, successUrl, cancelUrl);
      if (res.success && res.url) {
        window.location.href = res.url;
      } else {
        toast.error("Failed to initiate payment");
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || "Payment initiation failed");
    } finally {
      setLoading(false);
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
      toast.success(`"${wp.title}" downloaded successfully`);
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const msg = axiosError.response?.data?.message || "Download failed. Please try again.";
      toast.error(msg);
      // If it failed because it needs purchase, we don't need to do anything else, the toast tells them.
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <UserNavbar />

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        {/* Compact Header Area */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">Wallpapers</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em]">Premium 8K Collection</p>
          </div>
          
          <div className="flex flex-1 items-center justify-end gap-3 w-full max-w-2xl">
            <div className="relative flex-1 group">
              <FilterSearch
                value={searchQuery}
                onChange={(val) => setSearchQuery(val)}
                placeholder="Search vision..."
                className="w-full !bg-zinc-900/50 !border-white/5 focus:!border-white/20 transition-all rounded-2xl pl-12"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-4 rounded-2xl border transition-all flex items-center gap-2 ${
                showFilters 
                ? "bg-white text-black border-white" 
                : "bg-zinc-900/50 text-white border-white/5 hover:border-white/20"
              }`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Filters</span>
              <ImageIcon size={18} />
            </button>

            <button
              onClick={() => navigate(ROUTES.USER.MY_WALLPAPERS)}
              className="px-6 py-4 rounded-2xl bg-zinc-900/50 text-white border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              My Collection
            </button>
          </div>
        </div>

        {/* Expandable Filter Panel */}
        {showFilters && (
          <div className="mb-12 p-8 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Orientation */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Orientation</h3>
                <div className="flex gap-2">
                  {(["all", "vertical", "horizontal"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedOrientation(type)}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        selectedOrientation === type
                          ? "bg-white text-black border-white"
                          : "bg-black/20 text-white/40 border-white/5 hover:border-white/10"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4 lg:col-span-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Price Threshold</h3>
                  <span className="text-[10px] font-black text-white/80">
                    ₹{priceRange[0]} — ₹{priceRange[1]}{priceRange[1] >= MAX_PRICE ? "+" : ""}
                  </span>
                </div>
                <div className="relative h-6 pt-2">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[2px] bg-white/10 rounded-full" />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-[2px] bg-white rounded-full"
                    style={{
                      left: `${(priceRange[0] / MAX_PRICE) * 100}%`,
                      right: `${100 - (priceRange[1] / MAX_PRICE) * 100}%`,
                    }}
                  />
                  <input
                    type="range" min={MIN_PRICE} max={MAX_PRICE} step={10} value={priceRange[0]}
                    onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1] - 10), priceRange[1]])}
                    className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <input
                    type="range" min={MIN_PRICE} max={MAX_PRICE} step={10} value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0] + 10)])}
                    className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Hashtags */}
            <div className="mt-12 pt-8 border-t border-white/5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-6">Popular Aesthetics</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Nature", "Dark", "Minimal", "Urban", "Aesthetic", "Moody", "Travel", "Sunset", "Ocean", "Mountain",
                  "Forest", "Night", "Light", "Shadow", "Abstract", "Creative", "Art", "Design"
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      selectedTag === tag
                      ? "bg-white text-black border-white"
                      : "bg-black/20 text-white/40 border-white/5 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[3/4] bg-zinc-950 flex items-center justify-center animate-pulse rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent w-full h-full phlo-image-shimmer" />
                <img src={logo} alt="PHLO" className="w-14 h-auto opacity-10 grayscale brightness-200" />
              </div>
            ))}
          </div>
        ) : wallpapers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <ImageIcon size={48} className="text-gray-600 mb-4" />
            <h3 className="text-2xl font-black mb-2">No Wallpapers Found</h3>
          </div>
        ) : filteredWallpapers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <ImageIcon size={48} className="text-gray-600 mb-4" />
            <h3 className="text-2xl font-black mb-2">No {selectedOrientation} wallpapers found</h3>
            <p className="text-gray-500">Try switching to another orientation.</p>
          </div>
        ) : (
          <>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
              {filteredWallpapers.map((wp) => (
                <WallpaperCard
                  key={wp._id}
                  wp={wp}
                  orientation={orientationMap[wp._id]}
                  wishlisted={wishlistedIds.has(wp._id)}
                  onSelect={setSelectedWallpaper}
                  onBuy={handleBuy}
                  onDownload={handleDownload}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))}
            </div>

            {/* Loading Indicator for Infinite Scroll */}
            {isLoadingMore && (
              <div className="mt-12 mb-20 flex flex-col items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Discovering more...</span>
              </div>
            )}
            {!hasMore && wallpapers.length > 0 && (
              <div className="mt-12 mb-20 flex flex-col items-center">
                <div className="h-[1px] w-12 bg-white/10 mb-4" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700">End of the collection</span>
              </div>
            )}
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
                    onClick={() => {
                      if (selectedWallpaper.price > 0 && !selectedWallpaper.isPurchased) {
                        handleBuy(selectedWallpaper);
                      } else {
                        handleDownload(selectedWallpaper);
                      }
                    }}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-white to-gray-200 text-black rounded-2xl hover:from-gray-100 hover:to-white hover:shadow-lg hover:shadow-white/10 hover:scale-105 active:scale-95 transition-all duration-300 font-semibold"
                  >
                    <Download size={18} className={selectedWallpaper.price > 0 && !selectedWallpaper.isPurchased ? "text-green-600" : "text-black"} />
                    <span>{selectedWallpaper.price > 0 && !selectedWallpaper.isPurchased ? "Buy Now" : "Download"}</span>
                  </button>
                  <button
                    onClick={(e) => handleToggleWishlist(e, selectedWallpaper._id)}
                    className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 ${wishlistedIds.has(selectedWallpaper._id)
                      ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    title="Wishlist"
                  >
                    <Bookmark size={20} fill={wishlistedIds.has(selectedWallpaper._id) ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedWallpaper(null);
                      if (urlId) navigate(ROUTES.USER.WALLPAPERS);
                    }}
                    className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-zinc-900 border border-white/10 p-10 rounded-[3rem] text-center shadow-2xl shadow-green-500/10 relative overflow-hidden">
              {/* Decorative glows */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-green-500/10 rounded-full blur-[60px]" />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px]" />

              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 relative">
                  <div className="absolute inset-0 rounded-full border border-green-500/20 animate-ping opacity-25" />
                  <ImageIcon className="w-10 h-10 text-green-500" />
                </div>
              </div>

              <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Purchase Successful!</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Your new wallpaper has been added to your collection and is ready for download.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    const wp = wallpapers.find(w => w._id === purchasedId);
                    if (wp) handleDownload(wp);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-all active:scale-[0.98]"
                >
                  <Download size={20} />
                  Download Now
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full bg-zinc-800/50 text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all border border-white/5 active:scale-[0.98]"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes phlo-image-shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(250%) skewX(-20deg); }
        }
        .phlo-image-shimmer {
          animation: phlo-image-shimmer 2.5s infinite ease-in-out;
        }
      `}} />
    </div>
  );
};

export default WallpaperGallery;

