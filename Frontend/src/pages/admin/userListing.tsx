import { useEffect, useState, useCallback } from "react";
// import { Edit, Trash2 } from "lucide-react";
import { fetchAdminUsers, toggleUserStatus } from "@/services/admin/adminUserService";
import { User } from "@/interface/admin/userInterface";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/reusable/ConfirmModal";
import { UserX, UserCheck } from "lucide-react";
import Pagination from "@/components/reusable/pagination";
import { FilterSearch, FilterSelect } from "@/components/reusable/FilterComponents";
import DataTable, { Column } from "@/components/reusable/dataTable";
import { useDebounce } from "@/hooks/useDebounce";


export default function UserListingPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "blocked">("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [confirmData, setConfirmData] = useState<{ userId: string; newStatus: "active" | "blocked" } | null>(null);
  const limit = 10;

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchAdminUsers(page, limit, debouncedSearch, filterStatus);
      setUsers(result.data);
      setTotalPages(result.totalPages);
    } catch (error: unknown) {
      console.error("Load users error:", error);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filterStatus]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterStatus]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleFilterChange = (newStatus: "all" | "active" | "blocked") => {
    setFilterStatus(newStatus);
    setPage(1);
  };


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
    } catch (error: unknown) {
      console.error("Toggle status error:", error);
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
      <div className="p-4 lg:p-10 space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <h1 className="text-6xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-white via-white to-white/20 bg-clip-text text-transparent">
            Users Registry
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <FilterSearch
              value={search}
              onChange={(val) => { setSearch(val); setPage(1); }}
              placeholder="Search users by name or email..."
              className="sm:w-64"
            />
            <FilterSelect
              value={filterStatus}
              onChange={(val) => handleFilterChange(val as "all" | "active" | "blocked")}
              placeholder="Filter Status"
              className="sm:w-48"
              options={[
                { value: "all", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "blocked", label: "Blocked" },
              ]}
            />
          </div>
        </div>


        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={users}
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


