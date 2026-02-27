import React, { useEffect, useState, useCallback } from "react";
import { ArrowLeft, Image as ImageIcon, Trash2, Search, Plus, X, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CreatorWallpaperService } from "@/services/creator/creatorWallpaperService";
import CreatorNavbar from "@/compoents/reusable/creatorNavbar";
import { ROUTES } from "@/constants/routes";
import { S3Media } from "@/compoents/reusable/s3Media";
import { WallpaperData } from "@/interface/creator/creatorWallpaperInterface";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import Pagination from "@/compoents/reusable/pagination";
import ConfirmModal from "@/compoents/reusable/ConfirmModal";
import { AddWallpaperModal } from "./components/addWallpaperModal";
import { CreatorProfileServices } from "@/services/creator/creatorProfileService";

const ViewWallpapersPage: React.FC = () => {
  const [wallpapers, setWallpapers] = useState<WallpaperData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<WallpaperData | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [previewWallpaper, setPreviewWallpaper] = useState<WallpaperData | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);

  const limit = 9;
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchWallpapers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await CreatorWallpaperService.getWallpapers(page, limit, {
        search: debouncedSearch,
        status: statusFilter || undefined,
      });
      if (response?.success) {
        setWallpapers(response.data || []);
        setTotalPages(response.totalPages || 1);
        setTotalRecords(response.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch wallpapers", error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchWallpapers();
  }, [fetchWallpapers]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await CreatorWallpaperService.deleteWallpaper(deleteTarget._id);
      toast.success("Wallpaper deleted successfully!");
      setDeleteTarget(null);
      fetchWallpapers();
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || "Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      approved: "bg-green-500/10 text-green-400 border-green-500/20",
      rejected: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || ""}`}>
        {status.toUpperCase()}
      </span>
    );
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
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(ROUTES.CREATOR.DASHBOARD)}
              className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>

            <div>
              <h1 className="text-4xl font-black mb-1">My Wallpapers</h1>
              <p className="text-gray-500 font-medium">
                Upload and manage your wallpaper collection
              </p>
            </div>

            <button
              onClick={() => {
                if (isSubscribed) {
                  setAddModalOpen(true);
                } else {
                  setShowSubModal(true);
                }
              }}
              className="px-6 py-3 bg-white text-black rounded-2xl hover:bg-zinc-200 transition-all flex items-center gap-2 font-black shadow-[0_0_20px_rgba(255,255,255,0.15)] group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="hidden sm:inline tracking-tighter">ADD WALLPAPER</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-gray-400">
              {totalRecords} Wallpaper{totalRecords !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search wallpapers by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-colors appearance-none cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {(searchQuery || statusFilter) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("");
                setPage(1);
              }}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:bg-white/10 hover:text-white transition-colors text-sm font-bold"
            >
              Clear Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          </div>
        ) : wallpapers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <ImageIcon size={48} className="text-gray-600 mb-4" />
            <h3 className="text-2xl font-black mb-2">No Wallpapers Found</h3>
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
              {wallpapers.map((wp) => (
                <div
                  key={wp._id}
                  className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all group"
                >
                  <div className="h-52 bg-zinc-800 relative">
                    <div
                      className="w-full h-full cursor-pointer"
                      onClick={() => setPreviewWallpaper(wp)}
                    >
                      <S3Media s3Key={wp.watermarkedUrl || wp.imageUrl} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(wp);
                        }}
                        className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="absolute top-4 left-4 z-10">
                      {getStatusBadge(wp.status)}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-black text-lg line-clamp-1">{wp.title}</h4>
                      <span className={`text-sm font-bold ${wp.price > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                        {wp.price > 0 ? `₹${wp.price}` : 'FREE'}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs">
                      {wp.createdAt ? new Date(wp.createdAt).toLocaleDateString() : ""}
                    </p>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                      <Download size={12} />
                      <span>{wp.downloadCount ?? 0} downloads</span>
                    </div>
                    {wp.hashtags && wp.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {wp.hashtags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-xs text-blue-400/80 bg-blue-500/10 px-2 py-0.5 rounded-full">
                            #{tag}
                          </span>
                        ))}
                        {wp.hashtags.length > 3 && (
                          <span className="text-xs text-gray-500">+{wp.hashtags.length - 3}</span>
                        )}
                      </div>
                    )}
                    {wp.status === "rejected" && wp.rejectionReason && (
                      <p className="text-red-400/80 text-xs mt-2 line-clamp-2">
                        Reason: {wp.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {previewWallpaper && (
              <div
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setPreviewWallpaper(null)}
              >
                <button
                  className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10"
                  onClick={() => setPreviewWallpaper(null)}
                >
                  <X size={24} />
                </button>

                <div
                  className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center gap-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <S3Media
                    s3Key={previewWallpaper.watermarkedUrl || previewWallpaper.imageUrl}
                    className="max-w-full max-h-[75vh] rounded-2xl object-contain"
                  />
                  <div className="text-center">
                    <h3 className="text-xl font-black">{previewWallpaper.title}</h3>
                    <div className="mt-2">{getStatusBadge(previewWallpaper.status)}</div>
                    {previewWallpaper.status === "rejected" && previewWallpaper.rejectionReason && (
                      <p className="text-red-400/80 text-sm mt-2">
                        Reason: {previewWallpaper.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

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
      </main>

      <AddWallpaperModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={fetchWallpapers}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Wallpaper"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteLoading}
      />
      <ConfirmModal
        isOpen={showSubModal}
        onClose={() => setShowSubModal(false)}
        onConfirm={() => navigate(ROUTES.CREATOR.SUBSCRIPTIONS)}
        title="Subscription Required"
        message="You need an active subscription to upload wallpapers. Buy a plan to continue."
        confirmLabel="View Plans"
        variant="warning"
      />

    </div>

  );
};

export default ViewWallpapersPage;
