import React, { useState } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { CreatorWallpaperService } from "@/services/creator/creatorWallpaperService";
import { S3Service } from "@/services/s3Service";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddWallpaperModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !file) {
      toast.error("Please provide a title and select an image");
      return;
    }

    setLoading(true);
    try {
      // Upload image to S3 first
      const imageUrl = await S3Service.uploadToS3(file, "wallpapers");

      // Then save wallpaper with the S3 key
      await CreatorWallpaperService.addWallpaper({ title: title.trim(), imageUrl });

      toast.success("Wallpaper submitted for review!");
      resetForm();
      onSuccess();
      onClose();
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || "Failed to add wallpaper");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setFile(null);
    setPreview(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 w-full max-w-lg rounded-3xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-black">Add Wallpaper</h2>
          <button
            onClick={() => { resetForm(); onClose(); }}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter wallpaper title"
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Image</label>
            {preview ? (
              <div className="relative rounded-xl overflow-hidden border border-white/10">
                <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
                <button
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-48 bg-zinc-800 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-white/20 transition-colors">
                <Upload size={32} className="text-gray-500 mb-2" />
                <span className="text-sm text-gray-500 font-medium">Click to upload image</span>
                <span className="text-xs text-gray-600 mt-1">PNG, JPG up to 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-white/10">
          <button
            onClick={() => { resetForm(); onClose(); }}
            className="flex-1 px-4 py-3 border border-white/10 rounded-xl text-gray-400 hover:bg-white/5 transition-colors font-bold"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !title.trim() || !file}
            className="flex-1 px-4 py-3 bg-white text-black rounded-xl font-black hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <ImageIcon size={18} />
                Submit
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
