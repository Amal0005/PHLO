import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Filter, X } from "lucide-react";
import { Category, CategoryForm } from "@/interface/admin/categoryInterface";
import { AdminCategoryService } from "@/services/admin/adminCategoryServices";
import { toast } from "react-toastify";
import { confirmActionToast } from "@/compoents/reusable/confirmActionToast";
import AddEditCategoryModal from "./components/addEditCategoryModal";
import Pagination from "@/compoents/reusable/pagination";

import DataTable, { Column } from "@/compoents/reusable/dataTable";

export default function CategoryListingPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Simplified Filter States
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const limit = 10;

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const filters = { search, sort };
      const response = await AdminCategoryService.getCategories(page, limit, filters);
      setCategories(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 400);
    return () => clearTimeout(timer);
  }, [page, search, sort]);

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    confirmActionToast(
      "Are you sure you want to delete this category?",
      async () => {
        try {
          await AdminCategoryService.deleteCategory(categoryId);

          if (categories.length === 1 && page > 1) {
            setPage(prev => prev - 1);
          } else {
            fetchCategories();
          }

          toast.success("Category deleted successfully");
        } catch (error) {
          console.error("Failed to delete category", error);
          toast.error("Failed to delete category");
        }
      }
    );
  };

  const handleModalSubmit = async (formData: CategoryForm) => {
    try {
      if (selectedCategory) {
        await AdminCategoryService.editCategory(selectedCategory.categoryId, formData);
        toast.success(`${formData.name} updated successfully`)
      } else {
        await AdminCategoryService.addCategory(formData);
        toast.success(`${formData.name} added successfully`)
      }
      fetchCategories();
    } catch (error: unknown) {
      console.error("Failed to submit category", error);
      toast.error((error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to save category");
    }
  };

  const columns: Column<Category>[] = [
    {
      header: "Name",
      key: "name",
      className: "font-medium text-white",
    },
    {
      header: "Description",
      key: "description",
      render: (category) => (
        <span className="text-gray-400">{category.description || "-"}</span>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      align: "right",
      render: (category) => (
        <div className="space-x-2">
          <button
            onClick={() => handleEdit(category)}
            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(category.categoryId)}
            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-500 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Category Management</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Simplified Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-zinc-900 text-white border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-white/20 transition-all"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
          className="bg-zinc-900 text-white border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-white/20 transition-all"
        >
          <option value="newest">Newest to Oldest</option>
          <option value="oldest">Oldest to Newest</option>
        </select>
      </div>

      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={categories}
          loading={loading}
          keyExtractor={(category) => category.categoryId}
          emptyMessage="No categories found."
        />
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <AddEditCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        category={selectedCategory}
      />
    </div>
  );
}
