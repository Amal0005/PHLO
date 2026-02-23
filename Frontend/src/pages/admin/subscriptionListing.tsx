import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, CreditCard } from "lucide-react";
import { Subscription, SubscriptionForm } from "@/interface/admin/subscriptionInterface";
import { toast } from "react-toastify";
import ConfirmModal from "@/compoents/reusable/ConfirmModal";
import DataTable, { Column } from "@/compoents/reusable/dataTable";
import AddEditSubscriptionModal from "./components/addEditSubscriptionModal";
import { AdminSubscriptionService } from "@/services/admin/adminSubscriptionService";
import Pagination from "@/compoents/reusable/pagination";

export default function SubscriptionListingPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [type, setType] = useState<"User" | "Creator">("User");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await AdminSubscriptionService.getSubscriptions(type, page, 10);
      setSubscriptions(response.result.data);
      setTotalPages(response.result.totalPages);
    } catch (error) {
      console.error("Failed to fetch subscriptions", error);
      toast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [type, page]);

  const handleTypeChange = (newType: "User" | "Creator") => {
    setType(newType);
    setPage(1); // Reset to first page when type changes
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
    } catch (error:unknown) {
      const message = error instanceof Error ? error.message : "Failed to save subscription";
      toast.error(message);
    }
  };

  const columns: Column<Subscription>[] = [
    { header: "Plan Name", key: "name", className: "font-medium text-white" },
    { header: "Type", key: "type", render: (sub) => <span className="text-gray-400">{sub.type}</span> },
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
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Plan</span>
        </button>
      </div>

      <div className="flex gap-4 border-b border-white/10">
        <button
          onClick={() => handleTypeChange("User")}
          className={`px-6 py-3 font-medium transition-all ${type === "User" ? "text-white border-b-2 border-white" : "text-gray-500 hover:text-gray-300"}`}
        >
          User Plans
        </button>
        <button
          onClick={() => handleTypeChange("Creator")}
          className={`px-6 py-3 font-medium transition-all ${type === "Creator" ? "text-white border-b-2 border-white" : "text-gray-500 hover:text-gray-300"}`}
        >
          Creator Plans
        </button>
      </div>

      <DataTable
        columns={columns}
        data={subscriptions}
        loading={loading}
        keyExtractor={(sub) => sub.subscriptionId}
        emptyMessage={`No ${type} subscriptions found.`}
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
