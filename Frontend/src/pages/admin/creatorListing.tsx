import { useEffect, useState } from "react";
import {
  approveCreator,
  fetchAdminCreators,
  rejectCreator,
} from "@/services/admin/adminCreatorService";
import { Creator } from "@/interface/admin/creatorInterface";

export default function CreatorListingPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const [selectedCreator, setSelectedCreator] =
  useState<Creator | null>(null);

const [showDetails, setShowDetails] = useState(false);

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
      : creators.filter(
          (creator) => creator.status === filterStatus
        );

  async function handleApprove(id: string) {
    try {
      await approveCreator(id);
      setCreators((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, status: "approved" } : c
        )
      );
    } catch {
      alert("Failed to approve creator");
    }
  }

  async function handleReject(id: string) {
    try {
      await rejectCreator(id);
      setCreators((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, status: "rejected" } : c
        )
      );
    } catch {
      alert("Failed to reject creator");
    }
  }

  if (loading)
    return <p className="p-6 text-white">Loading creators...</p>;

  if (error)
    return <p className="p-6 text-red-400">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">
        Creators
      </h1>

      <select
        value={filterStatus}
        onChange={(e) =>
          setFilterStatus(e.target.value as any)
        }
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
                  <p className="text-gray-400 text-xs">
                    {creator.email}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      creator.status === "approved"
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
                    ? new Date(
                        creator.createdAt
                      ).toLocaleDateString()
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
                  </div>
                </td>
              </tr>
            ))}

            {filteredCreators.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-gray-500"
                >
                  No creators found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {showDetails && selectedCreator && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-zinc-900 w-full max-w-lg rounded-xl p-6 border border-white/10 relative">
      
      {/* CLOSE */}
      <button
        onClick={() => setShowDetails(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold text-white mb-4">
        Creator Details
      </h2>

      {/* PROFILE PHOTO */}
      {selectedCreator.profilePhoto && (
        <img
          src={selectedCreator.profilePhoto}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
      )}

      {/* BIO */}
      <div className="mb-3">
        <p className="text-gray-400 text-sm">Bio</p>
        <p className="text-white text-sm">
          {selectedCreator.bio || "-"}
        </p>
      </div>

      {/* EXPERIENCE */}
      <div className="mb-3">
        <p className="text-gray-400 text-sm">Experience</p>
        <p className="text-white text-sm">
          {selectedCreator.experience || "-"}
        </p>
      </div>

      {/* PORTFOLIO */}
      <div className="mb-3">
        <p className="text-gray-400 text-sm">Portfolio</p>
        {selectedCreator.portfolioLink ? (
          <a
            href={selectedCreator.portfolioLink}
            target="_blank"
            className="text-blue-400 underline"
          >
            View Portfolio
          </a>
        ) : (
          <p className="text-white text-sm">-</p>
        )}
      </div>

      {/* GOVERNMENT ID */}
      <div className="mb-4">
        <p className="text-gray-400 text-sm">Government ID</p>
        {selectedCreator.governmentId ? (
          <a
            href={selectedCreator.governmentId}
            target="_blank"
            className="text-blue-400 underline"
          >
            View Document
          </a>
        ) : (
          <p className="text-white text-sm">-</p>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => {
            handleReject(selectedCreator._id);
            setShowDetails(false);
          }}
          className="px-4 py-2 text-red-400 border border-red-400/30 rounded-lg hover:bg-red-500/10"
        >
          Reject
        </button>

        <button
          onClick={() => {
            handleApprove(selectedCreator._id);
            setShowDetails(false);
          }}
          className="px-4 py-2 text-green-400 border border-green-400/30 rounded-lg hover:bg-green-500/10"
        >
          Approve
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}
