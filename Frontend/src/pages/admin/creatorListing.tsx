import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import {
  approveCreator,
  fetchAdminCreators,
  rejectCreator,
  toggleCreatorStatus,
} from "@/services/admin/adminCreatorService";
import { Creator } from "@/interface/admin/creatorInterface";
import { toast } from "react-toastify";
import { CreatorDetailModal } from "./components/CreatorDetailModal";

export default function CreatorListingPage() {
  // ... existing state ...
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  // ... existing effects/handlers ...

  useEffect(() => {
    async function loadCreators() {
      try {
        const data = await fetchAdminCreators();
        setCreators(data);
      } catch {
        setError("Failed to fetch creators");
      } finally {
        setLoading(false);
      }
    }

    loadCreators();
  }, []);

  const filteredCreators =
    filterStatus === "all"
      ? creators
      : creators.filter((creator) => creator.status === filterStatus);

  async function handleApprove(id: string) {
    try {
      await approveCreator(id);
      setCreators((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: "approved" } : c))
      );
      toast.success("Creator approved successfully");
      setShowDetails(false);
    } catch {
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
        prev.map((c) => (c._id === id ? { ...c, status: "rejected" } : c))
      );

      toast.success("Creator rejected");
      setShowRejectModal(false);
      setShowDetails(false);
      setRejectionReason("");
    } catch (error) {
      toast.error("Failed to reject creator");
    }
  };

  const handleToggleStatus = async (creatorId: string, currentStatus: string) => {
    try {
const newStatus = currentStatus === "approved" ? "blocked" : "approved";
      await toggleCreatorStatus(creatorId, newStatus);
      
      setCreators((prev) =>
        prev.map((c) => (c._id === creatorId ? { ...c, status: newStatus as any } : c))
      );
      toast.success(`Creator ${newStatus} successfully`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };
  if (loading) return <p className="p-6 text-white">Loading creators...</p>;

  if (error) return <p className="p-6 text-red-400">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Creators</h1>

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value as any)}
        className="mb-4 bg-zinc-900 text-white border border-white/10 rounded-lg px-3 py-2"
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>

      <div className="bg-zinc-900/90 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase">
                Creator
              </th>
              <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase">
                Joined
              </th>
              <th className="px-6 py-4 text-right text-xs text-gray-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {filteredCreators.map((creator) => (
              <tr key={creator._id} className="hover:bg-white/5">
                <td className="px-6 py-4">
                  <p className="text-white font-medium text-sm">
                    {creator.fullName}
                  </p>
                  <p className="text-gray-400 text-xs">{creator.email}</p>
                </td>

                <td className="px-6 py-4">
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
                </td>

                <td className="px-6 py-4 text-gray-400 text-sm">
                  {creator.createdAt
                    ? new Date(creator.createdAt).toLocaleDateString()
                    : "-"}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedCreator(creator);
                        setShowDetails(true);
                      }}
                      className="px-3 py-1.5 text-sm text-blue-400 border border-blue-400/30 rounded-lg hover:bg-blue-500/10"
                    >
                      Details
                    </button>
                    {creator.status !== "pending" && creator.status !== "rejected" && (
      <button
        onClick={() => handleToggleStatus(creator._id, creator.status)}
        className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
          creator.status === "approved"
            ? "text-red-400 border-red-400/30 hover:bg-red-500/10"
            : "text-green-400 border-green-400/30 hover:bg-green-500/10"
        }`}
      >
        {creator.status === "approved" ? "Block" : "Unblock"}
      </button>
    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredCreators.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500">
                  No creators found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MAIN DETAILS MODAL */}
      {showDetails && selectedCreator && (
        <CreatorDetailModal
          creator={selectedCreator}
          onClose={() => setShowDetails(false)}
          onApprove={handleApprove}
          onReject={openRejectModal}
        />
      )}

      {/* REJECTION REASON MODAL */}
      {showRejectModal && selectedCreator && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
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
    </div>
  );
}