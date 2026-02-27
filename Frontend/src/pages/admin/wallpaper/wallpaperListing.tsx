import { useEffect, useState, useCallback } from "react";
import { AlertCircle, Search, X, Eye, CheckCircle, Download } from "lucide-react";
import { AdminWallpaperService } from "@/services/admin/adminWallpaperService";
import { WallpaperData } from "@/interface/creator/creatorWallpaperInterface";
import { toast } from "react-toastify";
import Pagination from "@/compoents/reusable/pagination";
import DataTable, { Column } from "@/compoents/reusable/dataTable";
import { S3Media } from "@/compoents/reusable/s3Media";
import ConfirmModal from "@/compoents/reusable/ConfirmModal";

type StatusFilter = "all" | "pending" | "approved" | "rejected";

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function WallpaperListingPage() {
  const [wallpapers, setWallpapers] = useState<WallpaperData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const limit = 10;

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperData | null>(null);
  const [previewWallpaper, setPreviewWallpaper] = useState<WallpaperData | null>(null);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [approveTarget, setApproveTarget] = useState<WallpaperData | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
    } catch {
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

  function requestApprove(wp: WallpaperData) {
    setApproveTarget(wp);
    setShowApproveConfirm(true);
  }

  async function confirmApprove() {
    if (!approveTarget) return;
    try {
      await AdminWallpaperService.approveWallpaper(approveTarget._id);
      toast.success("Wallpaper approved");
      loadWallpapers();
    } catch {
      toast.error("Failed to approve wallpaper");
    } finally {
      setShowApproveConfirm(false);
      setApproveTarget(null);
    }
  }

  async function handleReject(id: string, reason: string) {
    try {
      await AdminWallpaperService.rejectWallpaper(id, reason);
      toast.success("Wallpaper rejected");
      setShowRejectModal(false);
      setRejectionReason("");
      loadWallpapers();
    } catch {
      toast.error("Failed to reject wallpaper");
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      approved: "bg-green-500/10 text-green-400 border-green-500/20",
      rejected: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status] || ""}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const columns: Column<WallpaperData>[] = [
    {
      header: "Preview",
      key: "preview",
      render: (wp) => (
        <div
          onClick={() => setPreviewWallpaper(wp)}
          className="w-16 h-12 rounded-lg overflow-hidden border border-white/10 cursor-pointer hover:border-white/30 hover:scale-105 transition-all relative group"
        >
          <S3Media s3Key={wp.watermarkedUrl || wp.imageUrl} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Eye size={14} className="text-white" />
          </div>
        </div>
      ),
    },
    {
      header: "Title",
      key: "title",
      render: (wp) => <span className="text-white font-medium text-sm">{wp.title}</span>,
    },
    {
      header: "Creator",
      key: "creator",
      render: (wp) => (
        <span className="text-gray-400 text-sm">
          {typeof wp.creatorId === "object" ? wp.creatorId.fullName : wp.creatorId}
        </span>
      ),
    },
    {
      header: "Price",
      key: "price",
      render: (wp) => (
        <span className={`text-sm font-bold ${wp.price > 0 ? 'text-green-400' : 'text-gray-500'}`}>
          {wp.price > 0 ? `₹${wp.price}` : 'FREE'}
        </span>
      ),
    },
    {
      header: "Hashtags",
      key: "hashtags",
      render: (wp) => (
        <div className="flex flex-wrap gap-1">
          {wp.hashtags && wp.hashtags.length > 0 ? (
            <>
              {wp.hashtags.slice(0, 2).map((tag, i) => (
                <span key={i} className="text-xs text-blue-400/80 bg-blue-500/10 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
              {wp.hashtags.length > 2 && (
                <span className="text-xs text-gray-500">+{wp.hashtags.length - 2}</span>
              )}
            </>
          ) : (
            <span className="text-xs text-gray-600">—</span>
          )}
        </div>
      ),
    },
    {
      header: "Downloads",
      key: "downloadCount",
      render: (wp) => (
        <span className="text-gray-300 text-sm font-medium flex items-center gap-1">
          <Download size={14} className="text-gray-500" />
          {wp.downloadCount ?? 0}
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (wp) => getStatusBadge(wp.status),
    },
    {
      header: "Submitted",
      key: "createdAt",
      render: (wp) => (
        <span className="text-gray-400 text-sm">
          {wp.createdAt ? new Date(wp.createdAt).toLocaleDateString() : "-"}
        </span>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      align: "right",
      render: (wp) => (
        <div className="flex justify-end gap-2">
          {wp.status === "pending" && (
            <>
              <button
                onClick={() => requestApprove(wp)}
                className="px-3 py-1.5 text-sm text-green-400 border border-green-400/30 rounded-lg hover:bg-green-500/10 transition-all"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  setSelectedWallpaper(wp);
                  setShowRejectModal(true);
                }}
                className="px-3 py-1.5 text-sm text-red-400 border border-red-400/30 rounded-lg hover:bg-red-500/10 transition-all"
              >
                Reject
              </button>
            </>
          )}
          {wp.status === "rejected" && wp.rejectionReason && (
            <span className="text-gray-500 text-xs italic max-w-[200px] truncate" title={wp.rejectionReason}>
              {wp.rejectionReason}
            </span>
          )}
        </div>
      ),
    },
  ];

  // Approve/Reject from preview modal
  const handlePreviewApprove = () => {
    if (!previewWallpaper) return;
    requestApprove(previewWallpaper);
    setPreviewWallpaper(null);
  };

  const handlePreviewReject = () => {
    if (!previewWallpaper) return;
    setSelectedWallpaper(previewWallpaper);
    setPreviewWallpaper(null);
    setShowRejectModal(true);
  };

  if (error) return <p className="p-6 text-red-400">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Wallpaper Management</h1>

        {/* Search */}
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-800 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleStatusFilterChange(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${statusFilter === tab.value
              ? "bg-white text-black"
              : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={wallpapers}
        loading={loading}
        keyExtractor={(wp) => wp._id}
        emptyMessage="No wallpapers found."
      />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Reject Modal */}
      {showRejectModal && selectedWallpaper && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-zinc-900 w-full max-w-md rounded-xl p-6 border border-red-400/20 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Reject Wallpaper</h2>
            </div>

            <p className="text-gray-400 text-sm mb-4">
              Please provide a reason for rejecting "{selectedWallpaper.title}".
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-gray-500 outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all duration-300 min-h-[120px] resize-none text-sm"
              maxLength={500}
            />

            <p className="text-gray-500 text-xs mt-2 text-right">
              {rejectionReason.length}/500
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
                className="flex-1 px-4 py-2.5 text-gray-400 border border-gray-700 rounded-lg hover:bg-zinc-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedWallpaper._id, rejectionReason)}
                disabled={!rejectionReason.trim()}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

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
                      By {typeof previewWallpaper.creatorId === "object" ? previewWallpaper.creatorId.fullName : previewWallpaper.creatorId}
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

              {previewWallpaper.status === "pending" && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handlePreviewApprove}
                    className="flex-1 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-medium"
                  >
                    Approve
                  </button>
                  <button
                    onClick={handlePreviewReject}
                    className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      <ConfirmModal
        isOpen={showApproveConfirm}
        onClose={() => {
          setShowApproveConfirm(false);
          setApproveTarget(null);
        }}
        onConfirm={confirmApprove}
        title="Approve Wallpaper"
        message={`Are you sure you want to approve "${approveTarget?.title}"? It will be visible to all users.`}
        confirmLabel="Approve"
        cancelLabel="Cancel"
        variant="info"
        icon={<CheckCircle size={28} />}
      />
    </div>
  );
}
