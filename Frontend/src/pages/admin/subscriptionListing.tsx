import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, CreditCard, Search } from "lucide-react";
import { Subscription, SubscriptionForm } from "@/interface/admin/subscriptionInterface";
import { toast } from "react-toastify";
import ConfirmModal from "@/compoents/reusable/ConfirmModal";
import DataTable, { Column } from "@/compoents/reusable/dataTable";
import AddEditSubscriptionModal from "./components/addEditSubscriptionModal";
import { AdminSubscriptionService } from "@/services/admin/adminSubscriptionService";
import Pagination from "@/compoents/reusable/pagination";

export default function SubscriptionListingPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const isActive = filterStatus === "active" ? true : filterStatus === "inactive" ? false : undefined;
      const response = await AdminSubscriptionService.getSubscriptions(page, 10, search, isActive);
      setSubscriptions(response.result.data);
      setTotalPages(response.result.totalPages);
    } catch (error) {
      console.error("Failed to fetch subscriptions", error);
      // toast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  }, [page, search, filterStatus]);

  const handleFilterChange = (newStatus: typeof filterStatus) => {
    setFilterStatus(newStatus);
    setPage(1);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubscriptions();
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchSubscriptions]);

  const handleAdd = () => {
    setSelectedSubscription(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sub: Subscription) => {
    setSelectedSubscription(sub);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await AdminSubscriptionService.deleteSubscription(deleteId);
      fetchSubscriptions();
      toast.success("Subscription deleted successfully");
    } catch (error: unknown) {
      toast.error("Failed to delete subscription");
    } finally {
      setDeleteId(null);
    }
  };

  const handleModalSubmit = async (formData: SubscriptionForm) => {
    try {
      if (selectedSubscription) {
        await AdminSubscriptionService.updateSubscription(selectedSubscription.subscriptionId, formData);
        toast.success("Subscription updated successfully");
      } else {
        await AdminSubscriptionService.addSubscription(formData);
        toast.success("Subscription added successfully");
      }
      fetchSubscriptions();
    } catch (error: unknown) {
      console.error("Failed to submit subscription", error);
      const message = (error as any)?.response?.data?.message || (error instanceof Error ? error.message : "Failed to save subscription");
      toast.error(message);
    }
  };

  const columns: Column<Subscription>[] = [
    { header: "Plan Name", key: "name", className: "font-medium text-white" },
    { header: "Price", key: "price", render: (sub) => <span className="text-white">₹{sub.price}</span> },
    { header: "Duration", key: "duration", render: (sub) => <span className="text-gray-400">{sub.duration} Months</span> },
    {
      header: "Status",
      key: "isActive",
      render: (sub) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${sub.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
          {sub.isActive ? "Active" : "Inactive"}
        </span>
      )
    },
    {
      header: "Actions",
      key: "actions",
      align: "right",
      render: (sub) => (
        <div className="space-x-2">
          <button onClick={() => handleEdit(sub)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => setDeleteId(sub.subscriptionId)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-500 transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <CreditCard className="w-8 h-8" />
          Subscription Management
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search plans..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-zinc-900 text-white border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-white/20 transition-all"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => handleFilterChange(e.target.value as typeof filterStatus)}
            className="bg-zinc-900 text-white border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-white/20 transition-all"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span>Add Plan</span>
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={subscriptions}
        loading={loading}
        keyExtractor={(sub) => sub.subscriptionId}
        emptyMessage={`No subscriptions found with status "${filterStatus}".`}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />

      <AddEditSubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        subscription={selectedSubscription}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Plan"
        message="Are you sure you want to delete this subscription plan? This will affect new subscriptions."
        confirmLabel="Delete"
        variant="danger"
        icon={<Trash2 size={28} />}
      />
    </div>
  );
}
