import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Category, CategoryForm } from "@/interface/admin/categoryInterface";
import { AdminCategoryService } from "@/services/admin/adminCategoryServices";
import { toast } from "react-toastify";
import { confirmActionToast } from "@/compoents/reusable/confirmActionToast";
import AddEditCategoryModal from "./components/addEditCategoryModal";

export default function CategoryListingPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const data = await AdminCategoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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

        setCategories(prev =>
          prev.filter(c => c.categoryId !== categoryId)
        );

        toast.success("Category deleted successfully");
      } catch (error) {
        console.error("Failed to delete category", error);
        toast.error("Failed to delete category");
      }
    }
  );
};

  const handleModalSubmit = async (formData: CategoryForm) => {
    if (selectedCategory) {
      await AdminCategoryService.editCategory(selectedCategory.categoryId, formData);
      toast.success(`${formData.name} updated successfully`)
    } else {
      await AdminCategoryService.addCategory(formData);
    }
    fetchCategories();
  };



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

      <div className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Description</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            {loading}
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">Loading categories...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">No categories found.</td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.categoryId} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-medium text-white">{category.name}</td>
                    <td className="px-6 py-4 text-gray-400">{category.description || "-"}</td>
                    <td className="px-6 py-4 text-right space-x-2">
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
