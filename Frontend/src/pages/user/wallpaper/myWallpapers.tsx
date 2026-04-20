import React, { useCallback, useEffect, useState } from "react";
import { Download, Image as ImageIcon, X } from "lucide-react";
import UserNavbar from "@/components/reusable/userNavbar";
import { UserWallpaperService } from "@/services/user/userWallpaperService";
import { WallpaperData } from "@/interface/creator/creatorWallpaperInterface";
import { S3Media } from "@/components/reusable/s3Media";
import { S3Service } from "@/services/s3Service";
import { toast } from "react-toastify";

const MyWallpapers: React.FC = () => {
  const [wallpapers, setWallpapers] = useState<WallpaperData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperData | null>(null);
  const limit = 12;

  const fetchMyWallpapers = useCallback(async (isFirstLoad = false) => {
    try {
      if (isFirstLoad) setLoading(true);
      else setIsLoadingMore(true);

      const currentPage = isFirstLoad ? 1 : page;
      const response = await UserWallpaperService.getPurchasedWallpapers(currentPage, limit);

      if (response?.success) {
        const newWallpapers = response.data || [];
        setWallpapers((prev) => (currentPage === 1 ? newWallpapers : [...prev, ...newWallpapers]));
        setHasMore(newWallpapers.length === limit);
      }
    } catch (error) {
      console.error("Failed to fetch purchased wallpapers", error);
      toast.error("Failed to load your wallpapers");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [page]);

  useEffect(() => {
    fetchMyWallpapers(page === 1);
  }, [page, fetchMyWallpapers]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500 &&
        !isLoadingMore &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoadingMore, loading, hasMore]);

  const handleDownload = async (wp: WallpaperData) => {
    try {
      const creatorId = typeof wp.creatorId === "object" ? wp.creatorId._id : wp.creatorId;
      const recordRes = await UserWallpaperService.recordDownload(wp._id, creatorId);

      setWallpapers((prev) =>
        prev.map((w) =>
          w._id === wp._id ? { ...w, downloadCount: recordRes.downloadCount } : w,
        ),
      );
      if (selectedWallpaper?._id === wp._id) {
        setSelectedWallpaper({ ...wp, downloadCount: recordRes.downloadCount });
      }

      const url = await S3Service.getViewUrl(wp.imageUrl);
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${wp.title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      toast.success(`"${wp.title}" downloaded successfully`);
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || "Download failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <UserNavbar />

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-3">My Wallpapers</h1>
          <p className="text-gray-500 font-medium max-w-md mx-auto">
            All wallpapers you have purchased, ready to download anytime
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          </div>
        ) : wallpapers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <ImageIcon size={48} className="text-gray-600 mb-4" />
            <h3 className="text-2xl font-black mb-2">No Purchased Wallpapers Yet</h3>
            <p className="text-gray-500">Buy wallpapers to see them here.</p>
          </div>
        ) : (
          <>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
              {wallpapers.map((wp) => (
                <div
                  key={wp._id}
                  onClick={() => setSelectedWallpaper(wp)}
                  className="mb-4 inline-block w-full break-inside-avoid bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all cursor-pointer group"
                >
                  <div className="relative w-full">
                    <S3Media s3Key={wp.imageUrl} className="w-full h-auto object-cover block" />
                    <div className="absolute top-3 left-3 z-10 flex gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md border bg-green-500/20 text-green-400 border-green-500/30">
                        ₹{wp.price}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md border bg-white/10 text-gray-300 border-white/20 flex items-center gap-1">
                        <Download size={10} />
                        {wp.downloadCount ?? 0}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(wp);
                        }}
                        className="absolute top-3 right-3 p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white hover:text-black hover:scale-110 text-white transition-all duration-300 active:scale-95"
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white font-bold text-sm line-clamp-1">{wp.title}</p>
                        <p className="text-gray-300 text-xs">
                          {typeof wp.creatorId === "object" ? wp.creatorId.fullName : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {isLoadingMore && (
              <div className="mt-12 mb-20 flex flex-col items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Loading more...</span>
              </div>
            )}
          </>
        )}

        {selectedWallpaper && (
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedWallpaper(null)}
          >
            <div
              className="relative max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <S3Media
                  s3Key={selectedWallpaper.imageUrl}
                  className="w-full max-h-[80vh] object-contain bg-zinc-900"
                />
              </div>
              <div className="flex items-center justify-between mt-4 px-2">
                <div>
                  <h3 className="text-xl font-black">{selectedWallpaper.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-gray-500 text-sm">
                      By {typeof selectedWallpaper.creatorId === "object" ? selectedWallpaper.creatorId.fullName : "Creator"}
                    </p>
                    <span className="text-sm font-bold text-green-400">₹{selectedWallpaper.price}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownload(selectedWallpaper)}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-white to-gray-200 text-black rounded-2xl hover:from-gray-100 hover:to-white hover:shadow-lg hover:shadow-white/10 hover:scale-105 active:scale-95 transition-all duration-300 font-semibold"
                  >
                    <Download size={18} />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => setSelectedWallpaper(null)}
                    className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyWallpapers;
