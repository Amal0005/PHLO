import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

import { Subscription, SubscriptionForm } from "@/interface/admin/subscriptionInterface";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/reusable/ConfirmModal";
import DataTable, { Column } from "@/components/reusable/dataTable";
import AddEditSubscriptionModal from "@/pages/admin/components/addEditSubscriptionModal";
import { AdminSubscriptionService } from "@/services/admin/adminSubscriptionService";
import Pagination from "@/components/reusable/pagination";
import { FilterSearch, FilterSelect, FilterButton } from "@/components/reusable/FilterComponents";
import { useDebounce } from "@/hooks/useDebounce";


export default function SubscriptionListingPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const isActive = filterStatus === "active" ? true : filterStatus === "inactive" ? false : undefined;
      const response = await AdminSubscriptionService.getSubscriptions(page, 10, debouncedSearch, isActive);
      setSubscriptions(response.result.data);
      setTotalPages(response.result.totalPages);
    } catch (error: unknown) {
      console.error("Failed to fetch subscriptions", error);
      // toast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filterStatus]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterStatus]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleFilterChange = (newStatus: "all" | "active" | "inactive") => {
    setFilterStatus(newStatus);
    setPage(1);
  };

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
      console.error("Delete subscription error:", error);
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
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || (error instanceof Error ? error.message : "Failed to save subscription");
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
        <h1 className="text-6xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-white via-white to-white/20 bg-clip-text text-transparent">
          Subscriptions
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <FilterSearch
            value={search}
            onChange={(val) => { setSearch(val); setPage(1); }}
            placeholder="Search plans..."
            className="sm:w-64"
          />
          <FilterSelect
            value={filterStatus}
            onChange={(val) => handleFilterChange(val as "all" | "active" | "inactive")}
            placeholder="Filter Status"
            className="sm:w-48"
            options={[
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
          <FilterButton
            onClick={handleAdd}
            icon={<Plus className="w-5 h-5" />}
          >
            Add Plan
          </FilterButton>
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

