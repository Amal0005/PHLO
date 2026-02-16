import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Package as PackageIcon, MapPin } from "lucide-react";
import { UserPackageService } from "@/services/user/userPackageService";
import { UserPackage, PackageFilters } from "@/interface/user/userPackageInterface";
import { S3Media } from "@/compoents/reusable/s3Media";
import UserNavbar from "@/compoents/reusable/userNavbar";

const PackageListing: React.FC = () => {
  const navigate = useNavigate();
  const getSavedFilters = () => {
    const saved = sessionStorage.getItem("packageFilters");
    return saved ? JSON.parse(saved) : null;
  };

  const saved = getSavedFilters();

  const [packages, setPackages] = useState<UserPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(saved?.search || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(saved?.category || "");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 100000,
  });
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "newest">(saved?.sort || "newest");
  const [allCategories, setAllCategories] = useState<Array<{ _id: string; name: string }>>([]);
  const [debouncedSearch, setDebouncedSearch] = useState(saved?.search || "");
  const [locationFilter, setLocationFilter] = useState<{ lat: number; lng: number } | null>(saved?.location || null);
  const [isLocating, setIsLocating] = useState(false);

  // Save filters to sessionStorage whenever they change
  useEffect(() => {
    const filtersToSave = {
      search: searchQuery,
      category: selectedCategory,
      sort: sortBy,
      location: locationFilter
    };
    sessionStorage.setItem("packageFilters", JSON.stringify(filtersToSave));
  }, [searchQuery, selectedCategory, sortBy, locationFilter]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      const filters: PackageFilters = {
        sortBy,
      };

      if (debouncedSearch.trim()) {
        filters.search = debouncedSearch.trim();
      }
      if (selectedCategory) {
        filters.category = selectedCategory;
      }
      if (priceRange.min > 0 || priceRange.max < 100000) {
        filters.minPrice = priceRange.min;
        filters.maxPrice = priceRange.max;
      }

      if (locationFilter) {
        filters.lat = locationFilter.lat;
        filters.lng = locationFilter.lng;
        filters.radiusInKm = 50; // Default radius
      }

      const response = await UserPackageService.listPackages(filters);
      if (response?.success) {
        setPackages(response.data || []);

        // Extract unique categories for filter dropdown
        if (!selectedCategory) {
          const categoryMap = new Map<string, { _id: string; name: string }>();
          response.data.forEach((pkg: UserPackage) => {
            if (typeof pkg.category === 'object' && pkg.category._id && pkg.category.name) {
              categoryMap.set(pkg.category._id, {
                _id: pkg.category._id,
                name: pkg.category.name
              });
            }
          });
          setAllCategories(Array.from(categoryMap.values()));
        }
      }
    } catch (error) {
      console.error("Failed to fetch packages", error);
    } finally {
      setLoading(false);
    }
  }, [sortBy, debouncedSearch, selectedCategory, priceRange.min, priceRange.max, locationFilter]);

  // Fetch packages whenever filters change
  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange({ min: 0, max: 100000 });
    setSortBy("newest");
    setLocationFilter(null);
    sessionStorage.removeItem("packageFilters");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <UserNavbar />

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black mb-4">Browse Packages</h1>
          <p className="text-gray-400 text-lg">
            Discover amazing photography packages from talented creators
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search packages by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/20 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-colors cursor-pointer"
            >
              <option value="">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "price-asc" | "price-desc" | "newest")}
              className="bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-colors cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            {/* Near Me Button */}
            <button
              onClick={() => {
                if (locationFilter) {
                  setLocationFilter(null);
                  return;
                }
                setIsLocating(true);
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    setLocationFilter({
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                    });
                    setIsLocating(false);
                  },
                  (error) => {
                    console.error("Error getting location", error);
                    alert("Unable to get your location. Please check browser permissions.");
                    setIsLocating(false);
                  }
                );
              }}
              className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${locationFilter
                ? "bg-white text-black"
                : "bg-zinc-900 text-white border border-white/10 hover:border-white/20"
                }`}
            >
              <MapPin size={18} className={isLocating ? "animate-bounce" : ""} />
              {isLocating ? "Locating..." : locationFilter ? "Near Me: ON" : "Near Me"}
            </button>

            {/* Clear Filters */}
            {(searchQuery || selectedCategory || sortBy !== "newest" || locationFilter) && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-colors"
              >
                Clear Filters
              </button>
            )}

            {/* Results Count */}
            <div className="ml-auto flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-gray-400">
                {packages.length} Package
                {packages.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          </div>
        ) : packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <PackageIcon size={48} className="text-gray-600 mb-4" />
            <h3 className="text-2xl font-black mb-2">
              No Matching Packages
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filters
            </p>
            {(searchQuery || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                onClick={() => navigate(`/packages/${pkg._id}`)}
                className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all group cursor-pointer"
              >
                {/* Package Image */}
                <div className="h-56 bg-zinc-800 relative overflow-hidden">
                  {pkg.images?.length > 0 ? (
                    <S3Media
                      s3Key={pkg.images[0]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                      <PackageIcon size={40} />
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 text-black text-xs font-bold rounded-full">
                      {typeof pkg.category === 'object' ? pkg.category.name : pkg.category}
                    </span>
                  </div>
                </div>

                {/* Package Info */}
                <div className="p-6">
                  <h4 className="font-black text-xl mb-2 line-clamp-1">
                    {pkg.title}
                  </h4>

                  {/* Creator Info */}
                  {typeof pkg.creatorId === 'object' && (
                    <div className="text-sm text-gray-400 mb-3">
                      by <span className="text-white font-semibold">{pkg.creatorId.fullName}</span>
                      {pkg.placeName && <span> • {pkg.placeName}</span>}
                    </div>
                  )}

                  <p className="text-gray-500 text-sm line-clamp-2 mb-6">
                    {pkg.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-black">
                      ₹ {pkg.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PackageListing;
