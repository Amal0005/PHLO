import React, { useState } from "react";
import { X, Upload, Image as ImageIcon, Hash, Plus, AlertTriangle } from "lucide-react";
import { CreatorWallpaperService } from "@/services/creator/creatorWallpaperService";
import { toast } from "react-toastify";
import { MESSAGES } from "@/constants/messages";
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
  const [showGuidelines, setShowGuidelines] = useState(true);

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
      toast.error(MESSAGES.WALLPAPER.HASHTAG_EXISTS);
      return;
    }
    if (hashtags.length >= 10) {
      toast.error(MESSAGES.WALLPAPER.MAX_HASHTAGS);
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
      toast.error(MESSAGES.WALLPAPER.REQUIRED_FIELDS);
      return;
    }
    if (price < 0) {
      toast.error(MESSAGES.WALLPAPER.NEGATIVE_PRICE);
      return;
    }

    setLoading(true);
    try {
      // Save wallpaper with the file directly (backend handles S3 upload)
      const response = await CreatorWallpaperService.addWallpaper({
        title: title.trim(),
        price,
        hashtags,
      }, file);

      if (response.data.status === "rejected") {
        toast.error(response.data.rejectionReason || MESSAGES.WALLPAPER.SUBMIT_FAILED);
        return;
      }

      toast.success(MESSAGES.WALLPAPER.SUBMITTED_SUCCESS);
      resetForm();
      onSuccess();
      onClose();
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || MESSAGES.WALLPAPER.SUBMIT_FAILED);
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
    setShowGuidelines(true);
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
      <div className="bg-zinc-900 w-full max-w-4xl rounded-3xl border border-white/10 overflow-y-auto md:overflow-hidden max-h-[95vh] md:max-h-[90vh] flex flex-col md:flex-row shadow-2xl">
        
        {showGuidelines ? (
          <div className="w-full p-6 md:p-10 flex flex-col items-center justify-center text-center space-y-6 md:space-y-8 min-h-[400px] md:min-h-[500px] bg-zinc-900">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-red-500/10 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center border border-red-500/20 shadow-inner">
              <AlertTriangle size={40} className="md:size-[48px] text-red-500" />
            </div>
            
            <div className="max-w-md space-y-3">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Content Guidelines</h2>
              <p className="text-gray-400 text-sm leading-relaxed px-4 md:px-0">
                To maintain a premium and safe community, we enforce strict content rules.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full max-w-xl px-4 md:px-0">
              <div className="bg-zinc-950/50 border border-white/5 p-5 rounded-3xl flex items-center gap-4 hover:border-white/10 transition-colors">
                <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 text-xs font-black ring-1 ring-red-500/20">18+</div>
                <div className="text-left">
                  <span className="block text-sm text-white font-bold">No Adult Content</span>
                  <span className="text-[10px] text-gray-500">Nudity or sexual content</span>
                </div>
              </div>
              <div className="bg-zinc-950/50 border border-white/5 p-5 rounded-3xl flex items-center gap-4 hover:border-white/10 transition-colors">
                <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 text-xs font-black ring-1 ring-red-500/20">GORE</div>
                <div className="text-left">
                  <span className="block text-sm text-white font-bold">No Violence</span>
                  <span className="text-[10px] text-gray-500">Extreme gore or blood</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950/80 border border-white/5 rounded-2xl p-4 max-w-lg">
              <p className="text-[11px] text-gray-500 italic">
                All uploads are automatically scanned by Google AI. Violating these rules will result in an immediate rejection.
              </p>
            </div>

            <div className="flex gap-4 w-full max-w-md pt-6">
              <button
                onClick={() => onClose()}
                className="flex-1 px-8 py-4 border border-white/10 rounded-2xl text-gray-400 hover:bg-white/5 transition-all font-bold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowGuidelines(false)}
                className="flex-1 px-8 py-4 bg-white text-black rounded-2xl font-black hover:bg-zinc-200 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] text-sm"
              >
                I Understand
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Left — Image Upload / Preview */}
            <div className="md:w-[45%] w-full bg-zinc-950 flex items-center justify-center relative min-h-[220px] md:min-h-0 aspect-video md:aspect-auto">
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="absolute top-4 md:top-6 right-4 md:right-6 p-2 bg-black/60 backdrop-blur-md rounded-full hover:bg-black/80 transition-all text-white shadow-xl"
                  >
                    <X className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 h-24 md:h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                </>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer group p-8 md:p-12">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-[2rem] bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center mb-4 md:mb-6 group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-500">
                    <Upload className="w-6 h-6 md:w-8 md:h-8 text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-sm md:text-base text-gray-400 font-bold group-hover:text-white transition-colors">Select Wallpaper</span>
                  <span className="text-[10px] md:text-xs text-gray-600 mt-1 md:mt-2">PNG or JPG up to 10MB</span>
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
            <div className="md:w-[55%] w-full flex flex-col bg-zinc-900 border-t md:border-t-0 border-white/5">
              {/* Header */}
              <div className="flex items-center justify-between px-6 md:px-8 pt-5 md:pt-8 pb-3 md:pb-6">
                <div>
                  <h2 className="text-lg md:text-2xl font-black text-white tracking-tight leading-tight">Details</h2>
                  <p className="text-[9px] md:text-xs text-gray-500">Configure your wallpaper metadata</p>
                </div>
                <button
                  onClick={() => { resetForm(); onClose(); }}
                  className="p-2 md:p-2.5 hover:bg-white/5 rounded-2xl transition-all text-gray-500 hover:text-white"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              {/* Form Body */}
              <div className="px-6 md:px-8 pb-4 space-y-5 md:space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                {/* Title */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E.g. Neon Horizon 2077"
                    className="w-full bg-zinc-950 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/20 transition-all font-medium"
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder="0 for free"
                      min={0}
                      className="w-full bg-zinc-950 border border-white/5 rounded-2xl pl-10 pr-5 py-4 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/20 transition-all font-medium"
                    />
                  </div>
                  <p className="text-[10px] text-gray-600 ml-1 italic">* Set to 0 for free download</p>
                </div>

                {/* Hashtags */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    Hashtags
                    <span className="text-zinc-700 font-bold normal-case tracking-normal ml-2">({hashtags.length}/10)</span>
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Hash size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                      <input
                        type="text"
                        value={hashtagInput}
                        onChange={(e) => setHashtagInput(e.target.value)}
                        onKeyDown={handleHashtagKeyDown}
                        placeholder="Nature, Tech, Abstract..."
                        className="w-full bg-zinc-950 border border-white/5 rounded-2xl pl-11 pr-5 py-4 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/20 transition-all font-medium"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addHashtag}
                      disabled={!hashtagInput.trim()}
                      className="px-5 bg-white/5 border border-white/5 rounded-2xl text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
                    >
                      <Plus size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </div>

                  {/* Hashtag pills */}
                  {hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {hashtags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3.5 py-2 bg-zinc-950 border border-white/5 rounded-xl text-xs text-gray-400 hover:border-white/20 hover:text-white transition-all cursor-default"
                        >
                          <Hash size={12} className="text-zinc-600" />
                          <span className="font-bold">{tag}</span>
                          <button
                            onClick={() => removeHashtag(index)}
                            className="p-1 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

               {/* Footer */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 px-6 md:px-8 py-5 md:py-6 bg-zinc-900/50 border-t border-white/5">
                <button
                  onClick={() => { resetForm(); onClose(); }}
                  className="w-full sm:flex-1 px-6 py-3.5 md:py-4 border border-white/10 rounded-2xl text-gray-400 hover:bg-white/5 transition-all font-bold text-xs md:text-sm order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !title.trim() || !file}
                  className="w-full sm:flex-[1.5] px-6 py-3.5 md:py-4 bg-white text-black rounded-2xl font-black hover:bg-zinc-200 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-3 text-xs md:text-sm order-1 sm:order-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <ImageIcon size={18} />
                      Publish Wallpaper
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
