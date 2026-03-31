import { useEffect, useState, useCallback } from "react";
import { Eye, X, AlertTriangle, ShieldCheck } from "lucide-react";
import ConfirmModal from "@/components/reusable/ConfirmModal";
import { AdminWallpaperService } from "@/services/admin/adminWallpaperService";
import { WallpaperData } from "@/interface/creator/creatorWallpaperInterface";
import Pagination from "@/components/reusable/pagination";
import DataTable, { Column } from "@/components/reusable/dataTable";
import { S3Media } from "@/components/reusable/s3Media";

import { FilterSearch, FilterSelect } from "@/components/reusable/FilterComponents";
import { useDebounce } from "@/hooks/useDebounce";


type StatusFilter = "all" | "approved" | "rejected" | "blocked";

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Blocked", value: "blocked" },
];

export default function WallpaperListingPage() {
  const [wallpapers, setWallpapers] = useState<WallpaperData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const limit = 10;

  const [previewWallpaper, setPreviewWallpaper] = useState<WallpaperData | null>(null);

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    mode: 'block' | 'unblock' | null;
    targetId: string | null;
  }>({
    isOpen: false,
    mode: null,
    targetId: null,
  });

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const loadWallpapers = useCallback(async () => {
    try {
      setLoading(true);
      const filters: Record<string, unknown> = {};
      if (statusFilter !== "all") {
        filters.status = statusFilter;
      }
      if (debouncedSearch.trim()) {
        filters.search = debouncedSearch;
      }
      const data = await AdminWallpaperService.getWallpapers(page, limit, filters);
      setWallpapers(data.data);
      setTotalPages(data.totalPages);
    } catch (error: unknown) {
      console.error("Load wallpapers error:", error);
      setError("Failed to fetch wallpapers");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, debouncedSearch]);

  useEffect(() => {
    loadWallpapers();
  }, [loadWallpapers]);

  const handleStatusFilterChange = (newFilter: StatusFilter) => {
    setStatusFilter(newFilter);
    setPage(1);
  };



  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      approved: "bg-green-500/10 text-green-400 border-green-500/20",
      rejected: "bg-red-500/10 text-red-400 border-red-500/20",
      blocked: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status] || ""}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const columns: Column<WallpaperData>[] = [
    {
      header: "Wallpaper",
      key: "wallpaper",
      render: (wp) => (
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-white/5 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div
              onClick={() => setPreviewWallpaper(wp)}
              className="relative w-16 h-12 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer active:scale-95 transition-all"
            >
              <S3Media s3Key={wp.imageUrl || wp.watermarkedUrl || ""} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye size={14} className="text-white" />
              </div>
            </div>
          </div>
          <div>
            <p className="text-white font-black text-sm tracking-tight uppercase italic italic">
              {wp.title}
            </p>
            <p className="text-gray-500 text-[10px] font-medium tracking-wider uppercase">
              By {typeof wp.creatorId === "object" ? (wp.creatorId as { fullName: string }).fullName : wp.creatorId}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (wp) => (
        <div className="flex items-center">
          <span
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase italic tracking-[0.1em] border ${wp.status === "approved"
                ? "bg-green-500/5 text-green-400 border-green-500/10"
                : wp.status === "rejected"
                  ? "bg-red-500/5 text-red-400 border-red-500/10"
                  : wp.status === "blocked"
                    ? "bg-zinc-500/5 text-zinc-400 border-zinc-500/10"
                    : "bg-yellow-500/5 text-yellow-400 border-yellow-500/10"
              }`}
          >
            {wp.status}
          </span>
        </div>
      ),
    },
    {
      header: "Price",
      key: "price",
      render: (wp) => (
        <div className="flex items-center gap-2">
          <span className={`text-xs font-black italic uppercase ${wp.price > 0 ? 'text-green-400' : 'text-gray-600'}`}>
            {wp.price > 0 ? `₹${wp.price}` : 'FREE'}
          </span>
        </div>
      ),
    },
    {
      header: "Joined",
      key: "createdAt",
      render: (wp) => (
        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-xs font-medium">
            {wp.createdAt ? new Date(wp.createdAt).toLocaleDateString() : "-"}
          </span>
        </div>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      align: "right",
      render: (wp) => (
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setPreviewWallpaper(wp)}
            className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all"
          >
            <Eye size={18} />
          </button>
          {wp.status === "approved" && (
            <button
              onClick={(e) => { e.stopPropagation(); handleBlock(wp._id); }}
              className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all font-bold text-[10px] uppercase tracking-wider italic"
            >
              Block
            </button>
          )}
          {wp.status === "blocked" && (
            <button
              onClick={(e) => { e.stopPropagation(); handleUnblock(wp._id); }}
              className="px-4 py-2 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all font-bold text-[10px] uppercase tracking-wider italic"
            >
              Unblock
            </button>
          )}
        </div>
      ),
    },
  ];

  const handleBlock = (id: string) => {
    setConfirmModal({
      isOpen: true,
      mode: 'block',
      targetId: id
    });
  };

  const handleUnblock = (id: string) => {
    setConfirmModal({
      isOpen: true,
      mode: 'unblock',
      targetId: id
    });
  };

  const executeAction = async () => {
    if (!confirmModal.targetId || !confirmModal.mode) return;

    setIsProcessing(true);
    try {
      if (confirmModal.mode === 'block') {
        await AdminWallpaperService.blockWallpaper(confirmModal.targetId);
      } else {
        await AdminWallpaperService.unblockWallpaper(confirmModal.targetId);
      }
      await loadWallpapers();
      setPreviewWallpaper(null);
      setConfirmModal({ isOpen: false, mode: null, targetId: null });
    } catch (err) {
      console.error(`${confirmModal.mode} failed:`, err);
    } finally {
      setIsProcessing(false);
    }
  };



  if (error) return <p className="p-6 text-red-400">{error}</p>;

  return (
    <div className="p-4 lg:p-10 space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <h1 className="text-6xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-white via-white to-white/20 bg-clip-text text-transparent">
          Visual Archive
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <FilterSearch
            value={searchQuery}
            onChange={(val) => { setSearchQuery(val); setPage(1); }}
            placeholder="Search by title..."
            className="sm:w-64"
          />
          <FilterSelect
            value={statusFilter}
            onChange={(val) => handleStatusFilterChange(val as StatusFilter)}
            placeholder="Filter Status"
            className="sm:w-48"
            options={STATUS_TABS.map(tab => ({ value: tab.value, label: tab.label }))}
          />
        </div>
      </div>


      <DataTable
        columns={columns}
        data={wallpapers}
        loading={loading}
        keyExtractor={(wp) => wp._id}
        emptyMessage="No wallpapers found."
      />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />



      {/* Preview Modal */}
      {previewWallpaper && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          onClick={() => setPreviewWallpaper(null)}
        >
          <div
            className="bg-zinc-900 w-full max-w-3xl rounded-2xl border border-white/10 overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setPreviewWallpaper(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X size={16} />
            </button>

            {/* Image */}
            <div className="w-full max-h-[60vh] overflow-hidden bg-black flex items-center justify-center">
              <S3Media
                s3Key={previewWallpaper.watermarkedUrl || previewWallpaper.imageUrl}
                className="w-full h-full object-contain max-h-[60vh]"
              />
            </div>

            {/* Info & Actions */}
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-white text-lg font-bold">{previewWallpaper.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-gray-400 text-sm">
                      By {typeof previewWallpaper.creatorId === "object" ? (previewWallpaper.creatorId as { fullName: string }).fullName : previewWallpaper.creatorId}
                      {previewWallpaper.createdAt && (
                        <span className="text-gray-600 ml-2">• {new Date(previewWallpaper.createdAt).toLocaleDateString()}</span>
                      )}
                    </p>
                    <span className={`text-sm font-bold ${previewWallpaper.price > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                      {previewWallpaper.price > 0 ? `₹${previewWallpaper.price}` : 'FREE'}
                    </span>
                  </div>
                </div>
                {getStatusBadge(previewWallpaper.status)}
              </div>

              {previewWallpaper.hashtags && previewWallpaper.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {previewWallpaper.hashtags.map((tag, i) => (
                    <span key={i} className="text-xs text-blue-400/80 bg-blue-500/10 px-2.5 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              {previewWallpaper.status === "rejected" && previewWallpaper.rejectionReason && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-xs font-semibold mb-1">Rejection Reason</p>
                  <p className="text-gray-300 text-sm">{previewWallpaper.rejectionReason}</p>
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t border-white/5">
                {previewWallpaper.status === "approved" && (
                  <button
                    onClick={() => handleBlock(previewWallpaper._id)}
                    className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-black uppercase italic tracking-wider rounded-xl transition-all text-xs"
                  >
                    Block Wallpaper
                  </button>
                )}
                {previewWallpaper.status === "blocked" && (
                  <button
                    onClick={() => handleUnblock(previewWallpaper._id)}
                    className="flex-1 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/20 font-black uppercase italic tracking-wider rounded-xl transition-all text-xs"
                  >
                    Unblock Wallpaper
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={executeAction}
        loading={isProcessing}
        title={confirmModal.mode === 'block' ? "Restricted Content" : "Authorize Content"}
        message={
          confirmModal.mode === 'block'
            ? "Are you sure you want to block this wallpaper? It will no longer be visible to users in the explore gallery."
            : "Are you sure you want to unblock this wallpaper? It will immediately become visible to all active users."
        }
        confirmLabel={confirmModal.mode === 'block' ? "Confirm Block" : "Authorize"}
        cancelLabel="Abort"
        variant={confirmModal.mode === 'block' ? 'danger' : 'info'}
        icon={confirmModal.mode === 'block' ? <AlertTriangle size={28} /> : <ShieldCheck size={28} />}
      />

    </div>
  );
}


