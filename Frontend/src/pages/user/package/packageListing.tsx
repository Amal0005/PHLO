import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Package as PackageIcon, MapPin, Bookmark, Image as ImageIcon, ArrowRight } from "lucide-react";

import { UserPackageService } from "@/services/user/userPackageService";
import { WishlistService } from "@/services/user/wishlistService";
import { UserPackage, PackageFilters } from "@/interface/user/userPackageInterface";
import { S3Media } from "@/components/reusable/s3Media";
import UserNavbar from "@/components/reusable/userNavbar";
import Pagination from "@/components/reusable/pagination";
import { FilterSearch, FilterSelect } from "@/components/reusable/FilterComponents";
import { toast } from "react-toastify";
import { useDebounce } from "@/hooks/useDebounce";
import LogoLoading from "@/components/reusable/LogoLoading";



const PackageListing: React.FC = () => {
  const navigate = useNavigate();
  const getSavedFilters = () => {
    const saved = sessionStorage.getItem("packageFilters");
    return saved ? JSON.parse(saved) : null;
  };

  const saved = getSavedFilters();

  const [packages, setPackages] = useState<UserPackage[]>([]);
  const [, setTotalPackages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(saved?.search || "");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [selectedCategory, setSelectedCategory] = useState<string>(saved?.category || "");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 100000,
  });
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "newest" | "oldest" | "distance">(saved?.sort || "newest");
  const [allCategories, setAllCategories] = useState<Array<{ _id: string; name: string }>>([]);
  const [locationFilter, setLocationFilter] = useState<{ lat: number; lng: number } | null>(saved?.location || null);
  const [isLocating, setIsLocating] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());
  const [currentLocationName, setCurrentLocationName] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const limit = 9;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory, sortBy, locationFilter]);
  useEffect(() => {
    const filtersToSave = {
      search: searchQuery,
      category: selectedCategory,
      sort: sortBy,
      location: locationFilter
    };
    sessionStorage.setItem("packageFilters", JSON.stringify(filtersToSave));
  }, [searchQuery, selectedCategory, sortBy, locationFilter]);

  const fetchPackages = useCallback(async () => {
    const startTime = Date.now();
    try {
      setLoading(true);
      const filters: PackageFilters = {
        sortBy,
        page,
        limit
      };

      if (debouncedSearch.trim()) filters.search = debouncedSearch.trim();
      if (selectedCategory) filters.category = selectedCategory;
      if (priceRange.min > 0 || priceRange.max < 100000) {
        filters.minPrice = priceRange.min;
        filters.maxPrice = priceRange.max;
      }

      if (locationFilter) {
        filters.lat = locationFilter.lat;
        filters.lng = locationFilter.lng;
      }

      const response = await UserPackageService.listPackages(filters);
      if (response?.success) {
        setPackages(response.data || []);
        setTotalPackages(response.total || 0);
        setTotalPages(response.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch packages", error);
    } finally {
      const elapsedTime = Date.now() - startTime;
      const minTime = 1200;
      setTimeout(() => {
        setLoading(false);
      }, Math.max(0, minTime - elapsedTime));
    }
  }, [sortBy, debouncedSearch, selectedCategory, priceRange.min, priceRange.max, locationFilter, page]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await UserPackageService.getCategories();
        if (response?.success) {
          setAllCategories(response.data || []);
        }
      } catch (error: unknown) {
        toast.error((error as { response?: { data?: { error?: string } } }).response?.data?.error || "Failed to fetch categories");
      }
    };
    fetchCategories();

    // Re-fetch address if location filter exists
    if (locationFilter) {
      const fetchAddress = async () => {
        try {
          const token = import.meta.env.VITE_MAPBOX_TOKEN;
          const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${locationFilter.lng},${locationFilter.lat}.json?access_token=${token}&types=place,address&limit=1`
          );
          const data = await res.json();
          if (data.features?.[0]) {
            setCurrentLocationName(data.features[0].place_name);
          }
        } catch (error) {
          console.error("Reverse geocoding mount error:", error);
        }
      };
      fetchAddress();
    }
  }, [locationFilter]);

  useEffect(() => {
    const fetchWishlistIds = async () => {
      try {
        const res = await WishlistService.getWishlistIds("package");
        if (res.success) {
          setWishlistedIds(new Set(res.ids));
        }
      } catch {
        // User might not be logged in
      }
    };
    fetchWishlistIds();
  }, []);

  const handleToggleWishlist = async (e: React.MouseEvent, packageId: string) => {
    e.stopPropagation();
    try {
      const res = await WishlistService.toggle(packageId, "package");
      setWishlistedIds((prev) => {
        const next = new Set(prev);
        if (res.wishlisted) {
          next.add(packageId);
        } else {
          next.delete(packageId);
        }
        return next;
      });
      toast.success(res.wishlisted ? "Saved" : "Unsaved");
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange({ min: 0, max: 100000 });
    setSortBy("newest");
    setLocationFilter(null);
    setCurrentLocationName("");
    setPage(1);
    sessionStorage.removeItem("packageFilters");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <UserNavbar />

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        {/* Cinematic Header Area */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16 px-2">
          <div className="text-left">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-2 leading-none">Experiences</h1>
            <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">Bespoke Photography Packages</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:max-w-3xl">
            <div className="relative w-full group">
              <FilterSearch
                value={searchQuery}
                onChange={(val) => { setSearchQuery(val); setPage(1); }}
                placeholder="Search vision..."
                className="w-full !bg-zinc-900/50 !border-white/5 focus:!border-white/20 transition-all rounded-2xl pl-12"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <FilterSelect
                value={selectedCategory}
                onChange={(val) => { setSelectedCategory(val); setPage(1); }}
                placeholder="All Perspectives"
                className="flex-1 sm:min-w-[220px]"
                options={[
                  { value: "", label: "All Perspectives" },
                  ...allCategories.map(cat => ({ value: cat._id, label: cat.name }))
                ]}
              />
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-4 rounded-2xl border transition-all flex items-center gap-2 flex-shrink-0 ${
                  showFilters 
                  ? "bg-white text-black border-white" 
                  : "bg-zinc-900/50 text-white border-white/5 hover:border-white/20"
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Refine</span>
                <ImageIcon size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Removed Categories Pill Bar */}

        {/* Expandable Refine Panel */}
        {showFilters && (
          <div className="mb-12 p-8 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Sorting */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Sort Order</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "newest", label: "Newest" },
                    { value: "price-asc", label: "Price Low" },
                    { value: "price-desc", label: "Price High" },
                    { value: "distance", label: "Distance" }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value as any)}
                      className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                        sortBy === opt.value
                          ? "bg-white/10 text-white border-white/40 shadow-lg shadow-white/5"
                          : "bg-black/20 text-white/30 border-white/5 hover:border-white/10"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Location Intelligence</h3>
                <button
                  onClick={() => {
                    if (locationFilter) {
                      setLocationFilter(null);
                      setCurrentLocationName("");
                    } else {
                      setIsLocating(true);
                      navigator.geolocation.getCurrentPosition(
                        async (pos) => {
                          const { latitude: lat, longitude: lng } = pos.coords;
                          setLocationFilter({ lat, lng });
                          setSortBy("distance");
                          try {
                            const token = import.meta.env.VITE_MAPBOX_TOKEN;
                            const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}&types=place,address&limit=1`);
                            const data = await res.json();
                            if (data.features?.[0]) setCurrentLocationName(data.features[0].text || data.features[0].place_name);
                          } catch (error) { console.error(error); }
                          setIsLocating(false);
                        },
                        () => { setIsLocating(false); toast.error("Failed to get location."); }
                      );
                    }
                  }}
                  className={`w-full py-4 rounded-xl border transition-all flex items-center justify-center gap-3 ${
                    locationFilter 
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/30" 
                    : "bg-black/20 text-white/30 border-white/5"
                  }`}
                >
                  {isLocating ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <MapPin size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        {currentLocationName || "Detect My Area"}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Reset */}
              <div className="flex flex-col justify-end">
                <button
                  onClick={clearFilters}
                  className="w-full py-4 rounded-xl bg-red-500/5 text-red-500/60 border border-red-500/10 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all"
                >
                  Reset All Refinements
                </button>
              </div>
            </div>
          </div>
        )}


        {loading ? (
          <LogoLoading />
        ) : packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <PackageIcon size={48} className="text-gray-600 mb-4" />
            <h3 className="text-2xl font-black mb-2">No Matching Packages</h3>
            <button onClick={clearFilters} className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold mt-4">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  onClick={() => navigate(`/packages/${pkg._id}`)}
                  className="group bg-zinc-950 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-white/15 transition-all duration-500 cursor-pointer flex flex-col h-full"
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-zinc-900">
                    {pkg.images?.length > 0 ? (
                      <S3Media s3Key={pkg.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-800">
                        <PackageIcon size={40} />
                      </div>
                    )}
                    
                    {/* Badge Overlay */}
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                      <div className="px-4 py-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white">
                        {pkg.locations?.[0]?.placeName || "In Studio"}
                      </div>
                      <button
                        onClick={(e) => handleToggleWishlist(e, pkg._id)}
                        className={`p-3 backdrop-blur-md border rounded-2xl transition-all duration-300 ${
                          wishlistedIds.has(pkg._id)
                          ? "bg-red-500/20 border-red-500/30 text-red-400"
                          : "bg-black/20 border-white/10 text-white hover:bg-white hover:text-black"
                        }`}
                      >
                        <Bookmark size={14} fill={wishlistedIds.has(pkg._id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 flex flex-col flex-1">
                    <div className="flex-1 space-y-3">
                      <h4 className="text-2xl font-black uppercase tracking-tighter group-hover:text-zinc-200 transition-colors">
                        {pkg.title}
                      </h4>
                      <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Starting At</p>
                        <p className="text-2xl font-black italic">₹{pkg.price.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                        <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-all" />
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
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default PackageListing;

