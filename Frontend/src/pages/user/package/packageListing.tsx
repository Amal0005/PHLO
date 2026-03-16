import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Package as PackageIcon, MapPin, X, Heart } from "lucide-react";

import { UserPackageService } from "@/services/user/userPackageService";
import { WishlistService } from "@/services/user/wishlistService";
import { UserPackage, PackageFilters } from "@/interface/user/userPackageInterface";
import { S3Media } from "@/compoents/reusable/s3Media";
import UserNavbar from "@/compoents/reusable/userNavbar";
import Pagination from "@/compoents/reusable/pagination";
import { FilterSearch, FilterSelect, FilterButton } from "@/compoents/reusable/FilterComponents";
import { toast } from "react-toastify";
import { useDebounce } from "@/hooks/useDebounce";



const PackageListing: React.FC = () => {
  const navigate = useNavigate();
  const getSavedFilters = () => {
    const saved = sessionStorage.getItem("packageFilters");
    return saved ? JSON.parse(saved) : null;
  };

  const saved = getSavedFilters();

  const [packages, setPackages] = useState<UserPackage[]>([]);
  const [totalPackages, setTotalPackages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(saved?.search || "");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [selectedCategory, setSelectedCategory] = useState<string>(saved?.category || "");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 100000,
  });
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "newest" | "oldest">(saved?.sort || "newest");
  const [allCategories, setAllCategories] = useState<Array<{ _id: string; name: string }>>([]);
  const [locationFilter, setLocationFilter] = useState<{ lat: number; lng: number } | null>(saved?.location || null);
  const [isLocating, setIsLocating] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());
  const [currentLocationName, setCurrentLocationName] = useState<string>("");
  const limit = 9;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory, sortBy, locationFilter]);
  console.log(packages, "pack")
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
        // filters.radiusInKm = 50;
      }

      const response = await UserPackageService.listPackages(filters);
      if (response?.success) {
        setPackages(response.data || []);
        setTotalPackages(response.total || 0);
        setTotalPages(response.totalPages || 1);

        setPackages(response.data || []);
        setTotalPackages(response.total || 0);
        setTotalPages(response.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch packages", error);
    } finally {
      setLoading(false);
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
      toast.success(res.wishlisted ? "Added to wishlist" : "Removed from wishlist");
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
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black mb-4">Browse Packages</h1>
          <p className="text-gray-400 text-lg">
            Discover amazing photography packages from talented creators
          </p>
        </div>

        {/* FILTER BAR */}
        <div className="mb-10 space-y-6">
          <FilterSearch
            value={searchQuery}
            onChange={(val) => { setSearchQuery(val); setPage(1); }}
            placeholder="Search by package name, creator, or style..."
            className="w-full"
          />

          <div className="flex flex-wrap items-center gap-3">
            <FilterSelect
              value={selectedCategory}
              onChange={(val) => { setSelectedCategory(val); setPage(1); }}
              placeholder="All Categories"
              className="w-[200px]"
              options={[
                { value: "", label: "All Categories" },
                ...allCategories.map(cat => ({ value: cat._id, label: cat.name }))
              ]}
            />

            <FilterSelect
              value={sortBy}
              onChange={(val) => { setSortBy(val as "newest" | "oldest" | "price-asc" | "price-desc"); setPage(1); }}
              placeholder="Sort By"
              className="w-[200px]"
              options={[
                { value: "newest", label: "Newest First" },
                { value: "oldest", label: "Oldest First" },
                { value: "price-asc", label: "Price: Low to High" },
                { value: "price-desc", label: "Price: High to Low" },
              ]}
            />

            <FilterButton
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
                      try {
                        const token = import.meta.env.VITE_MAPBOX_TOKEN;
                        const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}&types=place,address&limit=1`);
                        const data = await res.json();
                        if (data.features?.[0]) {
                          setCurrentLocationName(data.features[0].text || data.features[0].place_name);
                        }
                      } catch (error) { console.error(error); }
                      setIsLocating(false);
                      setPage(1);
                    },
                    (err: GeolocationPositionError) => {
                      console.error(err);
                      setIsLocating(false);
                      toast.error("Failed to get location.");
                    }
                  );
                }
              }}
              active={!!locationFilter}
              loading={isLocating}
              icon={<MapPin size={16} />}
              className="max-w-[280px]"
            >
              {currentLocationName && locationFilter ? currentLocationName : "Near Me"}
            </FilterButton>

            {/* Clear Filters */}
            {(searchQuery || selectedCategory || locationFilter || sortBy !== "newest") && (
              <FilterButton
                onClick={clearFilters}
                variant="danger"
                icon={<X size={16} />}
              >
                Clear
              </FilterButton>
            )}

            {/* Results Count */}
            <div className="ml-auto hidden sm:flex items-center gap-2.5 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-2xl">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Results</span>
              <span className="text-xs font-black text-white">{totalPackages}</span>
            </div>
          </div>
        </div>


        {loading ? (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  onClick={() => {
                    console.log("FULL PKG:", pkg);
                    console.log("TYPE OF _id:", typeof pkg._id);
                    console.log("VALUE OF _id:", pkg._id);
                    navigate(`/packages/${pkg._id}`);
                  }}

                  className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all cursor-pointer group"
                >
                  <div className="h-56 bg-zinc-800 relative overflow-hidden">
                    {pkg.images?.length > 0 ? (
                      <S3Media s3Key={pkg.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700">
                        <PackageIcon size={40} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <button
                        onClick={(e) => handleToggleWishlist(e, pkg._id)}
                        className={`p-2.5 backdrop-blur-md border rounded-2xl hover:scale-110 transition-all duration-300 active:scale-95 ${wishlistedIds.has(pkg._id)
                          ? "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
                          : "bg-black/30 border-white/20 text-white hover:bg-white hover:text-black"
                          }`}
                        title="Wishlist"
                      >
                        <Heart size={16} fill={wishlistedIds.has(pkg._id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-black text-xl mb-2 line-clamp-1">{pkg.title}</h4>

                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{pkg.description}</p>

                    {/* Location Display */}
                    {(pkg.locations && pkg.locations.length > 0) && (
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                        <MapPin size={16} className="flex-shrink-0" />
                        <span className="line-clamp-1">
                          {pkg.locations[0].placeName}
                          {pkg.locations.length > 1 && ` (+${pkg.locations.length - 1} more)`}
                        </span>
                      </div>
                    )}

                    <div className="text-2xl font-black">₹ {pkg.price.toLocaleString()}</div>
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
