import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { fetchAdminCreators } from "@/services/admin/adminCreatorService";
import { Creator } from "@/interface/admin/creatorInterface";

export default function CreatorListingPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  console.log(creators,"creat")

  if (loading) return <p className="p-6 text-white">Loading creators...</p>;
  if (error) return <p className="p-6 text-red-400">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Creators</h1>

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
            {creators.data.map((creator) => (
              <tr key={creator._id} className="hover:bg-white/5">
                {/* Creator */}
                <td className="px-6 py-4">
                  <p className="text-white font-medium text-sm">
                    {creator.fullName}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {creator.email}
                  </p>
                </td>

                {/* Status */}
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

                {/* Joined */}
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {creator.createdAt
                    ? new Date(creator.createdAt).toLocaleDateString()
                    : "-"}
                </td>

                {/* Actions (UI only for now) */}
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
