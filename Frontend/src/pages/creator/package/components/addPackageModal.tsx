import { AdminCategoryService } from "@/services/admin/adminCategoryServices";
import { CreatorPackageService } from "@/services/creator/creatorPackageService";
import { PackageFormData, packageSchema } from "@/validation/packageValidation";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { S3Service } from "@/services/s3Service";

interface AddPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddPackageModal: React.FC<AddPackageModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
  });

  useEffect(() => {
    if (!isOpen) return;

    AdminCategoryService.getCategories()
      .then((data: any) => {
        setCategories(data?.data || data || []);
      })
      .catch(() => setCategories([]));
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (selectedImages.length + files.length > 5) {
      toast.warning("You can only upload up to 5 images");
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));

    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onSubmit = async (data: PackageFormData) => {
    setLoading(true);

    try {
      const imageUrls = await Promise.all(
        selectedImages.map(file => S3Service.uploadToS3(file, "packages"))
      );

      await CreatorPackageService.addPackage({
        ...data,
        images: imageUrls
      });

      toast.success("Package added successfully!");
      onSuccess();
      onClose();
      reset();
      setSelectedImages([]);
      setPreviews([]);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add package");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-2xl">
        <h2 className="text-2xl font-black mb-6 tracking-tight text-white">
          Create New Package
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* TITLE */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">
              Title
            </label>
            <input
              {...register("title")}
              className="w-full bg-black/50 border border-white/5 p-4 rounded-xl"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full bg-black/50 border border-white/5 p-4 rounded-xl h-32"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* PRICE + CATEGORY */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 font-bold mb-2 block">
                Price (₹)
              </label>
              <input
                type="number"
                {...register("price", { valueAsNumber: true })}
                className="w-full bg-black/50 border border-white/5 p-4 rounded-xl"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs text-gray-500 font-bold mb-2 block">
                Category
              </label>
              <select
                {...register("category")}
                className="w-full bg-black/50 border border-white/5 p-4 rounded-xl"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* IMAGES */}
          <div>
            <label className="text-xs text-gray-500 font-bold mb-2 block">
              Package Images (Max 5)
            </label>

            <div className="grid grid-cols-3 gap-3 mb-3">
              {previews.map((preview, index) => (
                <div key={index} className="relative group aspect-video rounded-xl overflow-hidden border border-white/10">
                  <img src={preview} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {selectedImages.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center"
                >
                  Add
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              multiple
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-3 bg-zinc-800 rounded-xl">
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-white text-black rounded-xl"
            >
              {loading ? "Creating..." : "Create Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
