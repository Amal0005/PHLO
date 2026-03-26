import { useEffect, useState, useCallback } from "react";
import { AdminComplaintService } from "@/services/admin/adminComplaintService";
import { Complaint } from "@/interface/admin/AdminComplaintInterface";
import DataTable, { Column } from "@/components/reusable/dataTable";
import { FilterSearch, FilterSelect } from "@/components/reusable/FilterComponents";
import { ComplaintDetailModal } from "@/pages/admin/components/ComplaintDetailModal";
import Pagination from "@/components/reusable/pagination";
import { useDebounce } from "@/hooks/useDebounce";

export default function ComplaintListingPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "resolved" | "dismissed">("all");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 4;

  const loadComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AdminComplaintService.getAllComplaints(page, limit, debouncedSearch, filterStatus);
      if (data.success) {
        setComplaints(data.data);
        setTotalItems(data.total);
        setTotalPages(data.totalPages);
      }
    } catch {
      console.error("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, filterStatus]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterStatus]);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const columns: Column<Complaint>[] = [
    {
      header: "Booking ID",
      key: "bookingId",
      render: (c) => <span className="text-zinc-500 font-mono text-xs">{c.bookingId.slice(-8).toUpperCase()}</span>
    },
    {
      header: "From (User)",
      key: "userId",
      render: (c) => (
        <div>
          <p className="text-white font-medium text-sm">{c.userName}</p>
          <p className="text-zinc-500 text-xs">{c.userId}</p>
        </div>
      ),
    },
    {
      header: "Against (Creator)",
      key: "creatorId",
      render: (c) => (
        <div>
          <p className="text-white font-medium text-sm">{c.creatorName}</p>
          <p className="text-zinc-500 text-xs">{c.creatorId}</p>
        </div>
      ),
    },
    {
      header: "Reason",
      key: "reason",
      render: (c) => <span className="text-zinc-300 text-sm font-semibold">{c.reason}</span>
    },
    {
      header: "Status",
      key: "status",
      render: (c) => (
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${c.status === "resolved"
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : c.status === "dismissed"
              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            }`}
        >
          {c.status}
        </span>
      ),
    },
    {
      header: "Date",
      key: "createdAt",
      render: (c) => (
        <span className="text-zinc-500 text-sm">
          {new Date(c.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      align: "right",
      render: (c) => (
        <button
          onClick={() => {
            setSelectedComplaint(c);
            setShowDetails(true);
          }}
          className="px-4 py-2 text-xs font-black uppercase tracking-widest text-white bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 transition-all active:scale-95"
        >
          Review
        </button>
      ),
    },
  ];

  if (loading && complaints.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-zinc-800 border-t-white rounded-full animate-spin" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading Complaints</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-10 space-y-10 bg-black min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-white via-white to-white/20 bg-clip-text text-transparent">
            Complaints
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <FilterSearch
            value={search}
            onChange={setSearch}
            placeholder="Search by Reason or Description..."
            className="sm:w-80"
          />
          <FilterSelect
            value={filterStatus}
            onChange={(val) => setFilterStatus(val as typeof filterStatus)}
            placeholder="Filter Status"
            className="sm:w-48"
            options={[
              { value: "all", label: "All Cases" },
              { value: "pending", label: "Pending" },
              { value: "resolved", label: "Resolved" },
              { value: "dismissed", label: "Dismissed" },
            ]}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-zinc-900/30 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] overflow-hidden">
          <DataTable
            columns={columns}
            data={complaints}
            loading={loading}
            keyExtractor={(c) => c.id}
            emptyMessage="No complaints found in the moderation queue."
          />
        </div>

        {/* Improved Pagination Section */}
        <div className="px-4">
           <Pagination 
              page={page} 
              totalPages={totalPages} 
              onPageChange={setPage} 
            />
            <p className="text-center sm:text-left text-zinc-500 text-xs mt-2 uppercase tracking-[0.2em] font-black">
              Showing {Math.min(page * limit, totalItems)} of {totalItems} total complaints
            </p>
        </div>
      </div>

      {showDetails && selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          onClose={() => setShowDetails(false)}
          onUpdate={() => loadComplaints()}
        />
      )}
    </div>
  );
}

