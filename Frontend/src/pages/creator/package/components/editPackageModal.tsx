import { AdminCategoryService } from "@/services/admin/adminCategoryServices";
import { CreatorPackageService } from "@/services/creator/creatorPackageService";
import { EditPackageFormData, editPackageSchema } from "@/validation/packageValidation";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { S3Service } from "@/services/s3Service";
import { S3Media } from "@/compoents/reusable/s3Media";
import LocationSearchBar from "./locationSearchBar";

interface EditPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  packageData: {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string | {
      _id: string;
      name: string;
      description?: string;
    };
    images?: string[];
    location?: {
      type: "Point";
      coordinates: [number, number];
    };
    placeName?: string;
  } | null;
}

export const EditPackageModal: React.FC<EditPackageModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  packageData,
}) => {
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<EditPackageFormData>({
    resolver: zodResolver(editPackageSchema),
  });

  // Load categories
  useEffect(() => {
    if (!isOpen) return;

    AdminCategoryService.getCategories()
      .then((data: any) => {
        setCategories(data?.data || data || []);
      })
      .catch(() => setCategories([]));
  }, [isOpen]);

  useEffect(() => {
    if (packageData && isOpen) {
      setValue("title", packageData.title);
      setValue("description", packageData.description);
      setValue("price", packageData.price);
      // Extract category ID if it's a populated object
      const categoryId = typeof packageData.category === 'object'
        ? packageData.category._id
        : packageData.category;
      setValue("category", categoryId);
      setExistingImages(packageData.images || []);
      if (packageData.location) {
        setValue("location", packageData.location);
      }
      if (packageData.placeName) {
        setValue("placeName", packageData.placeName);
      }
    }
  }, [packageData, isOpen, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const totalImages = existingImages.length + selectedImages.length + files.length;
    if (totalImages > 5) {
      toast.warning("You can only have up to 5 images");
      return;
    }

    setSelectedImages((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));

    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: EditPackageFormData) => {
    if (!packageData) return;

    setLoading(true);

    try {
      const newImageUrls = await Promise.all(
        selectedImages.map((file) => S3Service.uploadToS3(file, "packages"))
      );

      const allImages = [...existingImages, ...newImageUrls];

      const updateData: Partial<EditPackageFormData> = {};
      if (data.title && data.title !== packageData.title) updateData.title = data.title;
      if (data.description && data.description !== packageData.description)
        updateData.description = data.description;
      if (data.price && data.price !== packageData.price) updateData.price = data.price;
      const currentCategoryId = typeof packageData.category === 'object'
        ? packageData.category._id
        : packageData.category;
      if (data.category && data.category !== currentCategoryId)
        updateData.category = data.category;
      if (allImages.length !== packageData.images?.length ||
        !allImages.every((img, i) => img === packageData.images?.[i])) {
        updateData.images = allImages;
      }

      if (data.location) updateData.location = data.location;
      if (data.placeName) updateData.placeName = data.placeName;

      await CreatorPackageService.editPackage(packageData._id, updateData);

      toast.success("Package updated successfully!");
      onSuccess();
      handleClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update package");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedImages([]);
    setPreviews([]);
    setExistingImages([]);
    onClose();
  };

  if (!isOpen || !packageData) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-white/10 p-6 md:p-8 rounded-3xl w-full max-w-2xl shadow-2xl max-h-[95vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white leading-none mb-2">
              Edit Package
            </h2>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Update Package Details</p>
          </div>
          <button onClick={handleClose} className="text-gray-500 hover:text-white transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-5">
              {/* TITLE */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">
                  Title
                </label>
                <input
                  {...register("title")}
                  className="w-full bg-black/50 border border-white/5 p-4 rounded-xl text-white focus:border-white/20 outline-none transition-colors"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* PRICE */}
              <div>
                <label className="text-xs text-gray-500 font-bold mb-2 block uppercase tracking-widest">
                  Price (₹)
                </label>
                <input
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                  className="w-full bg-black/50 border border-white/5 p-4 rounded-xl text-white focus:border-white/20 outline-none transition-colors"
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-5">
              {/* CATEGORY */}
              <div>
                <label className="text-xs text-gray-500 font-bold mb-2 block uppercase tracking-widest">
                  Category
                </label>
                <select
                  {...register("category")}
                  className="w-full bg-black/50 border border-white/5 p-4 rounded-xl text-white focus:border-white/20 outline-none transition-colors appearance-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* LOCATION SEARCH */}
              <div>
                <label className="text-xs text-gray-500 font-bold mb-2 block uppercase tracking-widest">
                  Search Location {packageData.placeName && `(Current: ${packageData.placeName})`}
                </label>

                <LocationSearchBar
                  onChange={(location) => {
                    const geoJSON = {
                      type: "Point" as const,
                      coordinates: [location.longitude, location.latitude] as [number, number]
                    };

                    setValue("location", geoJSON, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
                    setValue("placeName", location.placeName || "", { shouldValidate: true });
                  }}
                />

                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">
                    Please select a location
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full bg-black/50 border border-white/5 p-4 rounded-xl h-32 text-white focus:border-white/20 outline-none transition-colors resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-500 font-bold mb-2 block">
              Package Images (Max 5)
            </label>

            <div className="grid grid-cols-3 gap-3 mb-3">
              {existingImages.map((s3Key, index) => (
                <div
                  key={`existing-${index}`}
                  className="relative group aspect-video rounded-xl overflow-hidden border border-white/10"
                >
                  <S3Media s3Key={s3Key} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs w-6 h-6 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {previews.map((preview, index) => (
                <div
                  key={`new-${index}`}
                  className="relative group aspect-video rounded-xl overflow-hidden border border-white/10"
                >
                  <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs w-6 h-6 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {existingImages.length + selectedImages.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center text-gray-500 hover:border-white/20 hover:text-white transition-all"
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

          <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
            <button
              type="button"
              onClick={handleClose}
              className="px-8 py-3 bg-zinc-800 text-white rounded-xl font-bold hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {loading ? "Updating..." : "Update Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
