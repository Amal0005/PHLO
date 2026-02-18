import { useEffect, useState } from "react";
// import { Edit, Trash2 } from "lucide-react";
import { fetchAdminUsers, toggleUserStatus } from "@/services/admin/adminUserService";
import { User } from "@/interface/admin/userInterface";
import { toast } from "react-toastify";
import ConfirmModal from "../../compoents/reusable/ConfirmModal";
import { UserX, UserCheck } from "lucide-react";
import Pagination from "@/compoents/reusable/pagination";

import DataTable, { Column } from "@/compoents/reusable/dataTable";

export default function UserListingPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "blocked">("all");
  const [confirmData, setConfirmData] = useState<{ userId: string; newStatus: "active" | "blocked" } | null>(null);
  const limit = 10;

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);

        const result = await fetchAdminUsers(page, limit);

        setUsers(result.data);
        setTotalPages(result.totalPages);

      } catch {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [page]);

  const filteredUsers = users.filter((user) => {
    if (filterStatus === "all") return true;
    return user.status === filterStatus;
  });


  const handleToggleStatus = async () => {
    if (!confirmData) return;
    const { userId, newStatus } = confirmData;
    try {
      await toggleUserStatus(userId, newStatus);

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
      );

      toast.success(
        newStatus === "blocked"
          ? "User blocked successfully"
          : "User unblocked successfully"
      );
    } catch {
      toast.error("Failed to update user status");
    } finally {
      setConfirmData(null);
    }
  };

  const columns: Column<User>[] = [
    {
      header: "User",
      key: "user",
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div>
            <p className="text-white font-medium text-sm">
              {user.name}
            </p>
            <p className="text-gray-400 text-xs">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (user) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.status === "active"
            ? "bg-green-500/10 text-green-400 border border-green-500/20"
            : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
        >
          {user.status}
        </span>
      ),
    },
    {
      header: "Joined",
      key: "createdAt",
      render: (user) => (
        <span className="text-gray-400 text-sm">
          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
        </span>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      align: "right",
      render: (user) => (
        <button
          onClick={() =>
            user._id &&
            setConfirmData({
              userId: user._id,
              newStatus: user.status === "active" ? "blocked" : "active",
            })
          }
          className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${user.status === "active"
            ? "text-red-400 border-red-400/30 hover:bg-red-500/10 border-red-400/60"
            : "text-green-400 border-green-400/30 hover:bg-green-500/10 border-green-400/60"
            }`}
        >
          {user.status === "active" ? "Block" : "Unblock"}
        </button>
      ),
    },
  ];

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-lg animate-pulse">Loading users...</p>
      </div>
    );
  }
  if (error) {
    return <p className="p-6 text-red-400">{error}</p>;
  }

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "blocked")}
            className="bg-zinc-900 text-white border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-white/20 transition-all"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={filteredUsers}
            loading={loading}
            keyExtractor={(user) => user._id || user.email}
            emptyMessage={`No users found with status "${filterStatus}".`}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
      <ConfirmModal
        isOpen={!!confirmData}
        onClose={() => setConfirmData(null)}
        onConfirm={handleToggleStatus}
        title={`${confirmData?.newStatus === "blocked" ? "Block" : "Unblock"} User`}
        message={`Are you sure you want to ${confirmData?.newStatus === "blocked" ? "block" : "unblock"} this user? ${confirmData?.newStatus === "blocked" ? "They will not be able to sign in." : "They will regain access."}`}
        confirmLabel={confirmData?.newStatus === "blocked" ? "Block" : "Unblock"}
        variant={confirmData?.newStatus === "blocked" ? "danger" : "info"}
        icon={confirmData?.newStatus === "blocked" ? <UserX size={28} /> : <UserCheck size={28} />}
      />
    </>
  );
}

