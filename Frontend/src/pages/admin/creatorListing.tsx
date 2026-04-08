import { useEffect, useState, useCallback } from "react";
import { AlertCircle } from "lucide-react";

import {
  approveCreator,
  fetchAdminCreators,
  rejectCreator,
  toggleCreatorStatus,
} from "@/services/admin/adminCreatorService";
import { Creator } from "@/interface/admin/creatorInterface";
import { toast } from "react-toastify";
import { CreatorDetailModal } from "@/pages/admin/components/CreatorDetailModal";
import ConfirmModal from "@/components/reusable/ConfirmModal";
import Pagination from "@/components/reusable/pagination";
import { UserX, UserCheck } from "lucide-react";
import { FilterSearch, FilterSelect } from "@/components/reusable/FilterComponents";
import DataTable, { Column } from "@/components/reusable/dataTable";
import { useDebounce } from "@/hooks/useDebounce";


export default function CreatorListingPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected" | "blocked"
  >("all");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [confirmData, setConfirmData] = useState<{ creatorId: string; newStatus: "approved" | "blocked" } | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const loadCreators = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAdminCreators(page, limit, debouncedSearch, filterStatus);
      setCreators(data.data);
      setTotalPages(data.totalPages);
    } catch (error: unknown) {
      console.error("Load creators error:", error);
      setError("Failed to fetch creators");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filterStatus]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterStatus]);

  useEffect(() => {
    loadCreators();
  }, [loadCreators]);

  const handleFilterChange = (newStatus: typeof filterStatus) => {
    setFilterStatus(newStatus);
    setPage(1);
  };

  async function handleApprove(id: string) {
    try {
      await approveCreator(id);
      setCreators((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: "approved" } : c)),
      );
      toast.success("Creator approved successfully");
      setShowDetails(false);
    } catch (error: unknown) {
      console.error("Approve creator error:", error);
      toast.error("Failed to approve creator");
    }
  }

  const openRejectModal = () => {
    setShowRejectModal(true);
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      await rejectCreator(id, reason);

      setCreators((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: "rejected" } : c)),
      );

      toast.success("Creator rejected");
      setShowRejectModal(false);
      setShowDetails(false);
      setRejectionReason("");
    } catch (error: unknown) {
      console.error("Reject creator error:", error);
      toast.error("Failed to reject creator");
    }
  };

  const handleToggleStatus = async () => {
    if (!confirmData) return;
    const { creatorId, newStatus } = confirmData;
    try {
      await toggleCreatorStatus(creatorId, newStatus);

      setCreators((prev) =>
        prev.map((c) =>
          c._id === creatorId ? { ...c, status: newStatus as Creator["status"] } : c,
        ),
      );

      toast.success(
        newStatus === "blocked"
          ? "Creator blocked successfully"
          : "Creator unblocked successfully",
      );
    } catch (error: unknown) {
      console.error("Toggle status error:", error);
      toast.error("Failed to update creator status");
    } finally {
      setConfirmData(null);
    }
  };

  const columns: Column<Creator>[] = [
    {
      header: "Creator",
      key: "creator",
      render: (creator) => (
        <div>
          <p className="text-white font-medium text-sm">{creator.fullName}</p>
          <p className="text-gray-400 text-xs">{creator.email}</p>
        </div>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (creator) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${creator.status === "approved"
            ? "bg-green-500/10 text-green-400"
            : creator.status === "rejected"
              ? "bg-red-500/10 text-red-400"
              : "bg-yellow-500/10 text-yellow-400"
            }`}
        >
          {creator.status}
        </span>
      ),
    },
    {
      header: "Joined",
      key: "createdAt",
      render: (creator) => (
        <span className="text-gray-400 text-sm">
          {creator.createdAt ? new Date(creator.createdAt).toLocaleDateString() : "-"}
        </span>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      align: "right",
      render: (creator) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setSelectedCreator(creator);
              setShowDetails(true);
            }}
            className="px-3 py-1.5 text-sm text-blue-400 border border-blue-400/30 rounded-lg hover:bg-blue-500/10 transition-all"
          >
            Details
          </button>
          {creator.status !== "pending" && creator.status !== "rejected" && (
            <button
              onClick={() => setConfirmData({
                creatorId: creator._id,
                newStatus: creator.status === "approved" ? "blocked" : "approved"
              })}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${creator.status === "approved"
                ? "text-red-400 border-red-400/30 hover:bg-red-500/10 border-red-400/60"
                : "text-green-400 border-green-400/30 hover:bg-green-500/10 border-green-400/60"
                }`}
            >
              {creator.status === "approved" ? "Block" : "Unblock"}
            </button>
          )}
        </div>
      ),
    },
  ];

  if (loading && creators.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-lg animate-pulse">Loading Creators...</p>
      </div>
    );
  }

  if (error) return <p className="p-6 text-red-400">{error}</p>;

  return (
    <div className="p-4 lg:p-10 space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <h1 className="text-6xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-white via-white to-white/20 bg-clip-text text-transparent">
          Creators Registry
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <FilterSearch
            value={search}
            onChange={(val) => { setSearch(val); setPage(1); }}
            placeholder="Search creators by name or email..."
            className="sm:w-64"
          />
          <FilterSelect
            value={filterStatus}
            onChange={(val) => handleFilterChange(val as "all" | "pending" | "approved" | "rejected" | "blocked")}
            placeholder="Filter Status"
            className="sm:w-48"
            options={[
              { value: "all", label: "All Status" },
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
              { value: "blocked", label: "Blocked" },
            ]}
          />
        </div>
      </div>


      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={creators}
          loading={loading}
          keyExtractor={(creator) => creator._id}
          emptyMessage="No creators found."
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>


      {showDetails && selectedCreator && (
        <CreatorDetailModal
          creator={selectedCreator}
          onClose={() => setShowDetails(false)}
          onApprove={handleApprove}
          onReject={openRejectModal}
        />
      )}

      {showRejectModal && selectedCreator && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-zinc-900 w-full max-w-md rounded-xl p-6 border border-red-400/20 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Reject Application
              </h2>
            </div>

            <p className="text-gray-400 text-sm mb-4">
              Please provide a reason for rejecting this creator's application.
              This will be sent to them.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason......"
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
                onClick={() =>
                  handleReject(selectedCreator._id, rejectionReason)
                }
                disabled={!rejectionReason.trim()}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={!!confirmData}
        onClose={() => setConfirmData(null)}
        onConfirm={handleToggleStatus}
        title={`${confirmData?.newStatus === "blocked" ? "Block" : "Unblock"} Creator`}
        message={`Are you sure you want to ${confirmData?.newStatus === "blocked" ? "block" : "unblock"} this creator?`}
        confirmLabel={confirmData?.newStatus === "blocked" ? "Block" : "Unblock"}
        variant={confirmData?.newStatus === "blocked" ? "danger" : "info"}
        icon={confirmData?.newStatus === "blocked" ? <UserX size={28} /> : <UserCheck size={28} />}
      />
    </div>
  );
}

