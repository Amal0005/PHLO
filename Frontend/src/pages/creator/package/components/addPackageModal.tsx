import { AdminCategoryService } from "@/services/admin/adminCategoryServices";
import { AxiosError } from "axios";
import { CreatorPackageService } from "@/services/creator/creatorPackageService";
import { Category } from "@/interface/admin/categoryInterface";
import { PackageFormData, packageSchema } from "@/validation/packageValidation";
import { PaginatedResponse } from "@/interface/admin/pagination";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LocationSearchBar from "./locationSearchBar";
import { S3Service } from "@/services/s3Service";

interface AddPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddPackageModal: React.FC<AddPackageModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
    reset,
  } = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      location: {
        type: "Point",
        coordinates: [0, 0],
      },
      placeName: "",
    },
  });

  // Watch location field for debugging
  const locationValue = watch("location");

  useEffect(() => {
    console.log('Current location in form:', locationValue);
  }, [locationValue]);

  useEffect(() => {
    if (!isOpen) return;

    AdminCategoryService.getCategories()
      .then((data: PaginatedResponse<Category>) => {
        setCategories(data?.data || []);
      })
      .catch(() => setCategories([]));
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (selectedImages.length + files.length > 5) {
      toast.warning("You can only upload up to 5 images");
      return;
    }

    setSelectedImages((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));

    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onSubmit = async (data: PackageFormData) => {
    // Double check with getValues
    const currentFormValues = getValues();
    console.log('Current form values from getValues:', currentFormValues);

    //Search location validation
    if (!data.location || data.location.coordinates[0] === 0) {
      toast.error("Please search and select a location");
      console.error('Location validation failed:', data.location);
      return;
    }

    setLoading(true);

    try {
      const imageUrls = await Promise.all(
        selectedImages.map((file) =>
          S3Service.uploadToS3(file, "packages")
        )
      );

      const packageData = {
        ...data,
        images: imageUrls,
      };

      console.log('Location details:', {
        coordinates: packageData.location?.coordinates,
        placeName: packageData.placeName
      });

      await CreatorPackageService.addPackage(packageData);

      toast.success("Package added successfully!");

      onSuccess();
      onClose();

      reset({
        location: {
          type: "Point",
          coordinates: [0, 0],
        },
        placeName: "",
      });

      setSelectedImages([]);
      setPreviews([]);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message || "Failed to add package"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-white/10 p-6 md:p-8 rounded-3xl w-full max-w-2xl shadow-2xl max-h-[95vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white leading-none mb-2">
              Create New Package
            </h2>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Basic Information & Details</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">✕</button>
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
                  placeholder="e.g. Cinematic Wedding Session"
                  className="w-full bg-black/50 border border-white/5 p-4 rounded-xl focus:border-white/20 outline-none transition-colors"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title.message}
                  </p>
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
                  placeholder="0.00"
                  className="w-full bg-black/50 border border-white/5 p-4 rounded-xl focus:border-white/20 outline-none transition-colors"
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.price.message}
                  </p>
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
                  className="w-full bg-black/50 border border-white/5 p-4 rounded-xl focus:border-white/20 outline-none transition-colors appearance-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* LOCATION SEARCH */}
              <div>
                <label className="text-xs text-gray-500 font-bold mb-2 block uppercase tracking-widest">
                  Search Location
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
              placeholder="Describe what's included in this package..."
              className="w-full bg-black/50 border border-white/5 p-4 rounded-xl h-32 focus:border-white/20 outline-none transition-colors resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* IMAGES */}
          <div>
            <label className="text-xs text-gray-500 font-bold mb-2 block">
              Package Images (Max 5)
            </label>

            <div className="grid grid-cols-3 gap-3 mb-3">
              {previews.map((preview, index) => (
                <div
                  key={index}
                  className="relative group aspect-video rounded-xl overflow-hidden border border-white/10"
                >
                  <img
                    src={preview}
                    className="w-full h-full object-cover"
                  />
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
          <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 bg-zinc-800 text-white rounded-xl font-bold hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {loading ? "Creating..." : "Create Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
