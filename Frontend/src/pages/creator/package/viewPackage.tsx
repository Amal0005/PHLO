import React, { useEffect, useState, useCallback } from "react";
import { ArrowLeft, Package as PackageIcon, Edit, Trash2, Plus, MapPin } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { CreatorPackageService } from "@/services/creator/creatorPackageService";
import CreatorNavbar from "@/components/reusable/creatorNavbar";
import { ROUTES } from "@/constants/routes";
import { S3Media } from "@/components/reusable/s3Media";
import { EditPackageModal } from "./components/editPackageModal";
import { PackageData } from "@/interface/creator/creatorPackageInterface";
import { toast } from "react-toastify";
import { AddPackageModal } from "./components/addPackageModal";
import { AxiosError } from "axios";
import Pagination from "@/components/reusable/pagination";
import { CreatorProfileServices } from "@/services/creator/creatorProfileService";
import ConfirmModal from "@/components/reusable/ConfirmModal";
import { FilterSearch, FilterSelect, FilterButton } from "@/components/reusable/FilterComponents";
import { useDebounce } from "@/hooks/useDebounce";


interface PackageWithId extends Omit<PackageData, 'category'> {
  _id: string;
  createdAt?: string;
  category: string | { _id: string; name: string };
}

const ViewPackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<PackageWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageWithId | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);

  const limit = 9;
  const navigate = useNavigate();

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await CreatorPackageService.getPackage({
        page,
        limit,
        search: debouncedSearch,
        sortBy: sortOrder === "newest" ? "newest" : "oldest" // Backend handles this logic
      });
      if (response?.success) {
        setPackages(response.data || []);
        setTotalPages(response.totalPages || 1);
        setTotalRecords(response.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch packages", error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, sortOrder]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortOrder]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handleEditClick = (pkg: PackageWithId) => {
    setSelectedPackage(pkg);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (pkg: PackageWithId) => {
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
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || "Failed to delete package");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditSuccess = () => {
    fetchPackages();
  };
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await CreatorProfileServices.getProfile();
        if (response.success) {
          const sub = response.creator.subscription;
          const isActive = sub?.status === 'active' && new Date(sub.endDate) > new Date();
          setIsSubscribed(!!isActive);
        }
      } catch (error) {
        console.error("Failed to check subscription", error);
      }
    };
    checkSubscription();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <CreatorNavbar />

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
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
          </div>

          <FilterButton
            onClick={() => {
              if (isSubscribed) {
                setAddModalOpen(true);
              } else {
                setShowSubModal(true);
              }
            }}
            icon={<Plus size={20} />}
          >
            CREATE NEW PACKAGE
          </FilterButton>
        </div>

        {/* SEARCH AND SORT */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <FilterSearch
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
              placeholder="Search packages by title..."
              className="sm:w-80"
            />

            <FilterSelect
              value={sortOrder}
              onChange={(val) => {
                setSortOrder(val as "newest" | "oldest");
                setPage(1);
              }}
              placeholder="Sort Order"
              className="sm:w-48"
              options={[
                { value: "newest", label: "Newest First" },
                { value: "oldest", label: "Oldest First" },
              ]}
            />
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-gray-400">
              {totalRecords} Results
            </span>
          </div>
        </div>



        {loading ? (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          </div>
        ) : packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <PackageIcon size={48} className="text-gray-600 mb-4" />
            <h3 className="text-2xl font-black mb-2">No Packages Found</h3>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all group"
                >
                  <div className="h-48 bg-zinc-800 relative">
                    {pkg.images && pkg.images.length > 0 ? (
                      <S3Media s3Key={pkg.images[0]} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700">
                        <PackageIcon size={40} />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditClick(pkg)}
                        className="p-2 bg-white text-black rounded-full hover:scale-110"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(pkg)}
                        className="p-2 bg-red-500 text-white rounded-full hover:scale-110"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-black text-xl mb-2 line-clamp-1">{pkg.title}</h4>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-6">{pkg.description}</p>
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-4">
                      <MapPin size={14} className="text-white/40" />
                      <span className="line-clamp-1">
                        {pkg.locations && pkg.locations.length > 0
                          ? `${pkg.locations[0].placeName}${pkg.locations.length > 1 ? ` (+${pkg.locations.length - 1} more)` : ''}`
                          : "Location not set"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-black text-white">₹ {pkg.price?.toLocaleString()}</div>
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

      <EditPackageModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        packageData={selectedPackage}
      />

      <ConfirmModal
        isOpen={showSubModal}
        onClose={() => setShowSubModal(false)}
        onConfirm={() => navigate(ROUTES.CREATOR.SUBSCRIPTIONS)}
        title="Subscription Required"
        message="You need an active subscription to add new Packages. Buy a plan to continue."
        confirmLabel="View Plans"
        variant="warning"
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Package?"
        message={`Are you sure you want to delete "${selectedPackage?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
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

