import { useEffect, useState, useCallback } from "react";
import { Eye, Download, X } from "lucide-react";
import { AdminWallpaperService } from "@/services/admin/adminWallpaperService";
import { WallpaperData } from "@/interface/creator/creatorWallpaperInterface";
import { toast } from "react-toastify";
import Pagination from "@/compoents/reusable/pagination";
import DataTable, { Column } from "@/compoents/reusable/dataTable";
import { S3Media } from "@/compoents/reusable/s3Media";

import { FilterSearch, FilterSelect } from "@/compoents/reusable/FilterComponents";
import { useDebounce } from "@/hooks/useDebounce";


type StatusFilter = "all" | "pending" | "approved" | "rejected";

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
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
  const debouncedSearch = useDebounce(searchQuery, 500);
  const limit = 10;

  const [previewWallpaper, setPreviewWallpaper] = useState<WallpaperData | null>(null);

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
          {typeof wp.creatorId === "object" ? (wp.creatorId as { fullName: string }).fullName : wp.creatorId}
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
      header: "Rejection Reason",
      key: "actions",
      align: "right",
      render: (wp) => (
        <div className="flex justify-end gap-2">
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
    setPreviewWallpaper(null);
  };

  const handlePreviewReject = () => {
    setPreviewWallpaper(null);
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


            </div>
          </div>
        </div>
      )}


    </div>
  );
}
