import React, { useEffect, useState, useCallback } from "react";
import { ArrowLeft, Image as ImageIcon, Trash2, Search, Plus } from "lucide-react";
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
  }, [page, debouncedSearch]);

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
              onClick={() => setAddModalOpen(true)}
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

        {/* SEARCH */}
        <div className="mb-8">
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
                    <S3Media s3Key={wp.imageUrl} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setDeleteTarget(wp)}
                        className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="absolute top-4 left-4">
                      {getStatusBadge(wp.status)}
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-black text-lg mb-1 line-clamp-1">{wp.title}</h4>
                    <p className="text-gray-500 text-xs">
                      {wp.createdAt ? new Date(wp.createdAt).toLocaleDateString() : ""}
                    </p>
                    {wp.status === "rejected" && wp.rejectionReason && (
                      <p className="text-red-400/80 text-xs mt-2 line-clamp-2">
                        Reason: {wp.rejectionReason}
                      </p>
                    )}
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
    </div>
  );
};

export default ViewWallpapersPage;
