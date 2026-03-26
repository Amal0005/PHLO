import { useState, useEffect } from "react";
import { X, Layers, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Category, CategoryForm } from "@/interface/admin/categoryInterface";
import { toast } from "react-toastify";
import { categorySchema } from "@/validation/categorySchema";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryForm) => Promise<void>;
  category?: Category | null;
}

export default function AddEditCategoryModal({ isOpen, onClose, onSubmit, category }: Props) {
  const [formData, setFormData] = useState<CategoryForm>({ name: "", description: "" });
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({ name: category.name, description: category.description || "" });
    } else {
      setFormData({ name: "", description: "" });
    }
    setErrors({});
  }, [category, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = categorySchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors: Partial<Record<keyof CategoryForm, string>> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof CategoryForm;
        formattedErrors[key] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error: unknown) {
      toast.error((error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/40">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {category ? "Edit Category" : "New Category"}
                  </h2>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {category ? "Modify existing category" : "Create a new classification"}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-6">
                {/* Category Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    className={`w-full bg-zinc-900/50 border ${errors.name ? 'border-red-500/50 focus:ring-red-500/10' : 'border-white/5 focus:ring-white/5'} rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-4 transition-all`}
                    placeholder="e.g. Abstract, Nature, Minimal"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-[11px] mt-1.5 flex items-center gap-1.5 ml-1">
                      <AlertCircle className="w-3 h-3" /> {errors.name}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (errors.description) setErrors({ ...errors, description: undefined });
                    }}
                    className={`w-full bg-zinc-900/50 border ${errors.description ? 'border-red-500/50 focus:ring-red-500/10' : 'border-white/5 focus:ring-white/5'} rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-4 transition-all h-40 resize-none`}
                    placeholder="Explain what kind of wallpapers fall into this category..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-[11px] mt-1.5 flex items-center gap-1.5 ml-1">
                      <AlertCircle className="w-3 h-3" /> {errors.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl bg-zinc-800 text-gray-300 font-bold hover:bg-zinc-700 transition-all active:scale-[0.98] text-sm"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-all active:scale-[0.98] text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    category ? "Save Changes" : "Publish"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
