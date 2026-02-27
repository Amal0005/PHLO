import React, { useState } from "react";
import { X, Upload, Image as ImageIcon, Hash, Plus } from "lucide-react";
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
  const [price, setPrice] = useState<number>(0);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
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

  const addHashtag = () => {
    const tag = hashtagInput.trim().replace(/^#/, "");
    if (!tag) return;
    if (hashtags.includes(tag)) {
      toast.error("This hashtag already exists");
      return;
    }
    if (hashtags.length >= 10) {
      toast.error("Maximum 10 hashtags allowed");
      return;
    }
    setHashtags([...hashtags, tag]);
    setHashtagInput("");
  };

  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addHashtag();
    }
  };

  const removeHashtag = (index: number) => {
    setHashtags(hashtags.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !file) {
      toast.error("Please provide a title and select an image");
      return;
    }
    if (price < 0) {
      toast.error("Price cannot be negative");
      return;
    }

    setLoading(true);
    try {
      // Upload image to S3 first
      const imageUrl = await S3Service.uploadToS3(file, "wallpapers");

      // Then save wallpaper with the S3 key
      await CreatorWallpaperService.addWallpaper({
        title: title.trim(),
        imageUrl,
        price,
        hashtags,
      });

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
    setPrice(0);
    setHashtags([]);
    setHashtagInput("");
    setFile(null);
    setPreview(null);
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-white/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        <h3 className="text-white text-lg font-black mb-2">Uploading Wallpaper...</h3>
        <p className="text-gray-400 text-sm text-center max-w-xs">Please wait while we process your image</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 w-full max-w-4xl rounded-3xl border border-white/10 overflow-hidden max-h-[90vh] flex flex-col md:flex-row">

        {/* Left — Image Upload / Preview */}
        <div className="md:w-[45%] w-full bg-zinc-950 flex items-center justify-center relative min-h-[240px] md:min-h-0">
          {preview ? (
            <>
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button
                onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors text-white"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            </>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer group p-8">
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center mb-4 group-hover:border-white/40 group-hover:bg-white/10 transition-all">
                <Upload size={28} className="text-gray-500 group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm text-gray-400 font-semibold group-hover:text-white transition-colors">Drop or click to upload</span>
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

        {/* Right — Form */}
        <div className="md:w-[55%] w-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div>
              <h2 className="text-xl font-black text-white">Add Wallpaper</h2>
              <p className="text-xs text-gray-500 mt-0.5">Fill in the details and upload your image</p>
            </div>
            <button
              onClick={() => { resetForm(); onClose(); }}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Body */}
          <div className="px-6 pb-2 space-y-4 overflow-y-auto flex-1">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter wallpaper title"
                className="w-full bg-zinc-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-white/25 transition-colors"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Price (₹)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="0 for free"
                min={0}
                className="w-full bg-zinc-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-white/25 transition-colors"
              />
              <p className="text-[11px] text-gray-600 mt-1">Set to 0 for free wallpapers</p>
            </div>

            {/* Hashtags */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Hashtags
                <span className="text-gray-600 font-normal normal-case tracking-normal ml-1.5">({hashtags.length}/10)</span>
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    onKeyDown={handleHashtagKeyDown}
                    placeholder="Type and press Enter"
                    className="w-full bg-zinc-800/60 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-white/25 transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={addHashtag}
                  disabled={!hashtagInput.trim()}
                  className="px-3 py-2.5 bg-white/10 border border-white/10 rounded-xl text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Hashtag pills */}
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {hashtags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300 hover:border-white/20 transition-colors"
                    >
                      <Hash size={10} className="text-gray-500" />
                      {tag}
                      <button
                        onClick={() => removeHashtag(index)}
                        className="ml-0.5 p-0.5 rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-4 border-t border-white/5 mt-auto">
            <button
              onClick={() => { resetForm(); onClose(); }}
              className="flex-1 px-4 py-2.5 border border-white/10 rounded-xl text-gray-400 hover:bg-white/5 transition-colors font-bold text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !title.trim() || !file}
              className="flex-1 px-4 py-2.5 bg-white text-black rounded-xl font-black hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              <ImageIcon size={16} />
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
