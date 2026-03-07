import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

import { Category, CategoryForm } from "@/interface/admin/categoryInterface";
import { AdminCategoryService } from "@/services/admin/adminCategoryServices";
import { toast } from "react-toastify";
import ConfirmModal from "@/compoents/reusable/ConfirmModal";
import AddEditCategoryModal from "./components/addEditCategoryModal";
import Pagination from "@/compoents/reusable/pagination";
import { FilterSearch, FilterSelect, FilterButton } from "@/compoents/reusable/FilterComponents";
import DataTable, { Column } from "@/compoents/reusable/dataTable";


export default function CategoryListingPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Simplified Filter States
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const limit = 10;

  const fetchCategories = useCallback(async () => {
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
  }, [page, search, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 400);
    return () => clearTimeout(timer);
  }, [page, search, sort, fetchCategories]);

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await AdminCategoryService.deleteCategory(deleteId);

      if (categories.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        fetchCategories();
      }

      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Failed to delete category", error);
      toast.error("Failed to delete category");
    } finally {
      setDeleteId(null);
    }
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
            onClick={() => setDeleteId(category.categoryId)}
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
        <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Category Management</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <FilterSearch
            value={search}
            onChange={(val) => { setSearch(val); setPage(1); }}
            placeholder="Search by name..."
            className="sm:w-64"
          />
          <FilterSelect
            value={sort}
            onChange={(val) => setSort(val as any)}
            placeholder="Sort Order"
            className="sm:w-48"
            options={[
              { value: "newest", label: "Newest to Oldest" },
              { value: "oldest", label: "Oldest to Newest" },
            ]}
          />
          <FilterButton
            onClick={handleAdd}
            icon={<Plus className="w-5 h-5" />}
          >
            Add Category
          </FilterButton>
        </div>
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

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        icon={<Trash2 size={28} />}
      />
    </div>
  );
}
