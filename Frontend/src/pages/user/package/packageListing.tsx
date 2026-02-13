import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Package as PackageIcon } from "lucide-react";
import { UserPackageService } from "@/services/user/userPackageService";
import { UserPackage } from "@/interface/user/userPackageInterface";
import { S3Media } from "@/compoents/reusable/s3Media";
import UserNavbar from "@/compoents/reusable/userNavbar";

const PackageListing: React.FC = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<UserPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 100000,
  });
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "newest">("newest");

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await UserPackageService.listPackages();
      if (response?.success) {
        setPackages(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch packages", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from packages
const categories = useMemo(() => {
  const cats = packages.map((pkg) => 
    typeof pkg.category === 'object' ? pkg.category.name : pkg.category
  );
  return Array.from(new Set(cats)).filter(Boolean);
}, [packages]);


  // Filter and sort packages
  const filteredAndSortedPackages = useMemo(() => {
    let filtered = packages;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
if (selectedCategory) {
  filtered = filtered.filter((pkg) => {
    const categoryName = typeof pkg.category === 'object' ? pkg.category.name : pkg.category;
    return categoryName === selectedCategory;
  });
}

    // Price range filter
    filtered = filtered.filter(
      (pkg) => pkg.price >= priceRange.min && pkg.price <= priceRange.max
    );

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      // newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sorted;
  }, [packages, searchQuery, selectedCategory, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange({ min: 0, max: 100000 });
    setSortBy("newest");
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
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-colors cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            {/* Clear Filters */}
            {(searchQuery || selectedCategory || sortBy !== "newest") && (
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
                {filteredAndSortedPackages.length} Package
                {filteredAndSortedPackages.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          </div>
        ) : filteredAndSortedPackages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <PackageIcon size={48} className="text-gray-600 mb-4" />
            <h3 className="text-2xl font-black mb-2">
              {packages.length === 0 ? "No Packages Available" : "No Matching Packages"}
            </h3>
            <p className="text-gray-500 mb-4">
              {packages.length === 0
                ? "Check back later for new packages"
                : "Try adjusting your search or filters"}
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
            {filteredAndSortedPackages.map((pkg) => (
              <div
                key={pkg._id}
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
                      {pkg.creatorId.city && <span> • {pkg.creatorId.city}</span>}
                    </div>
                  )}

                  <p className="text-gray-500 text-sm line-clamp-2 mb-6">
                    {pkg.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-black">
                      ₹ {pkg.price.toLocaleString()}
                    </div>

                    <button
                      onClick={() => navigate(`/packages/${pkg._id}`)}
                      className="px-4 py-2 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors"
                    >
                      View Details
                    </button>
                  </div>

                  {/* Additional Images Preview */}
                  {pkg.images?.length > 1 && (
                    <div className="flex -space-x-3 mt-4">
                      {pkg.images.slice(1, 4).map((img: string, i: number) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full border-2 border-zinc-900 overflow-hidden"
                        >
                          <S3Media s3Key={img} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {pkg.images.length > 4 && (
                        <div className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-white/10 flex items-center justify-center text-xs font-bold">
                          +{pkg.images.length - 4}
                        </div>
                      )}
                    </div>
                  )}
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
