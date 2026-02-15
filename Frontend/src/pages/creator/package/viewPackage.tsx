import React, { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Package as PackageIcon, Edit, Trash2, Search, ArrowUpDown, Plus, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CreatorPackageService } from "@/services/creator/creatorPackageService";
import CreatorNavbar from "@/compoents/reusable/creatorNavbar";
import { ROUTES } from "@/constants/routes";
import { S3Media } from "@/compoents/reusable/s3Media";
import { EditPackageModal } from "./components/editPackageModal";
import { toast } from "react-toastify";
import { DeleteConfirmModal } from "./components/deleteConfirmationModal";
import { AddPackageModal } from "./components/addPackageModal";

const ViewPackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchPackages = async () => {
    try {
      const response = await CreatorPackageService.getPackage();
      if (response?.success) {
        setPackages(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch packages", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleEditClick = (pkg: any) => {
    setSelectedPackage(pkg);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (pkg: any) => {
    setSelectedPackage(pkg);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPackage) return;

    setDeleteLoading(true);
    try {
      await CreatorPackageService.deletePackage(selectedPackage._id);
      toast.success("Package deleted successfully!");
      setDeleteModalOpen(false);
      setSelectedPackage(null);
      fetchPackages();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete package");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditSuccess = () => {
    fetchPackages();
  };

  // Filter and sort packages
  const filteredAndSortedPackages = useMemo(() => {
    let filtered = packages;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((pkg) =>
        pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by date
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  }, [packages, searchQuery, sortOrder]);

  return (
    <div className="min-h-screen bg-black text-white">
      <CreatorNavbar />

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(ROUTES.CREATOR.DASHBOARD)}
              className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>

            <div>
              <h1 className="text-4xl font-black mb-1">My Packages</h1>
              <p className="text-gray-500 font-medium">
                Manage and monitor your professional offerings
              </p>
            </div>

            <button
              onClick={() => setAddModalOpen(true)}
              className="px-6 py-3 bg-white text-black rounded-2xl hover:bg-zinc-200 transition-all flex items-center gap-2 font-black shadow-[0_0_20px_rgba(255,255,255,0.15)] group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="hidden sm:inline tracking-tighter">CREATE NEW PACKAGE</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-gray-400">
              {filteredAndSortedPackages.length} {filteredAndSortedPackages.length !== packages.length && `of ${packages.length}`} Package{filteredAndSortedPackages.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* SEARCH AND SORT */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
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

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
              className="appearance-none bg-zinc-900 border border-white/10 rounded-2xl pl-12 pr-12 py-3 text-white focus:outline-none focus:border-white/20 transition-colors cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              ▼
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          </div>
        ) : filteredAndSortedPackages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <PackageIcon size={48} className="text-gray-600 mb-4" />
            <h3 className="text-2xl font-black mb-2">
              {packages.length === 0 ? "No Packages Found" : "No Matching Packages"}
            </h3>
            <p className="text-gray-500 mb-4">
              {packages.length === 0
                ? "You haven't created any packages yet"
                : "Try adjusting your search or filters"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors mb-2"
              >
                Clear Search
              </button>
            )}
            {packages.length === 0 && (
              <button
                onClick={() => navigate(ROUTES.CREATOR.DASHBOARD)}
                className="px-6 py-3 bg-white text-black rounded-xl font-bold"
              >
                Back to Dashboard
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedPackages.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all group"
              >
                <div className="h-48 bg-zinc-800 relative">
                  {pkg.images?.length > 0 ? (
                    <S3Media
                      s3Key={pkg.images[0]}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                      <PackageIcon size={40} />
                    </div>
                  )}

                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditClick(pkg)}
                      className="p-2 bg-white text-black rounded-full hover:scale-110 transition-transform"
                      title="Edit Package"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(pkg)}
                      className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                      title="Delete Package"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="font-black text-xl mb-2 line-clamp-1">
                    {pkg.title}
                  </h4>

                  <p className="text-gray-500 text-sm line-clamp-2 mb-6">
                    {pkg.description}
                  </p>

                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-4">
                    <MapPin size={14} className="text-white/40" />
                    <span className="line-clamp-1">{pkg.placeName || "Location not set"}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-black text-white">
                      ₹ {pkg.price ? pkg.price.toLocaleString() : 0}
                    </div>

                    {pkg.images?.length > 1 && (
                      <div className="flex -space-x-3">
                        {pkg.images.slice(1, 4).map((img: string, i: number) => (
                          <div
                            key={i}
                            className="w-9 h-9 rounded-full border-2 border-zinc-900 overflow-hidden"
                          >
                            <S3Media s3Key={img} className="w-full h-full" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <EditPackageModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        packageData={selectedPackage}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        packageTitle={selectedPackage?.title || ""}
        loading={deleteLoading}
      />

      <AddPackageModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={fetchPackages}
      />
    </div>
  );
};

export default ViewPackagesPage;
