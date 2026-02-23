import React, { useEffect, useState, useCallback } from "react";
import { Search, Image as ImageIcon, Download, X } from "lucide-react";
import { UserWallpaperService } from "@/services/user/userWallpaperService";
import { WallpaperData } from "@/interface/creator/creatorWallpaperInterface";
import Pagination from "@/compoents/reusable/pagination";
import { S3Media } from "@/compoents/reusable/s3Media";
import { S3Service } from "@/services/s3Service";
import UserNavbar from "@/compoents/reusable/userNavbar";

const WallpaperGallery: React.FC = () => {
  const [wallpapers, setWallpapers] = useState<WallpaperData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperData | null>(null);
  const limit = 12;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchWallpapers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await UserWallpaperService.getApprovedWallpapers(page, limit, {
        search: debouncedSearch,
      });
      if (response?.success) {
        setWallpapers(response.data || []);
        setTotalPages(response.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch wallpapers", error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchWallpapers();
  }, [fetchWallpapers]);

  const handleDownload = async (wp: WallpaperData) => {
    try {
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
    } catch {
      console.error("Download failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <UserNavbar />

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-3">Wallpapers</h1>
          <p className="text-gray-500 font-medium max-w-md mx-auto">
            Browse stunning wallpapers created by our talented creators
          </p>
        </div>

        {/* Search */}
        <div className="mb-10 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search wallpapers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          </div>
        ) : wallpapers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <ImageIcon size={48} className="text-gray-600 mb-4" />
            <h3 className="text-2xl font-black mb-2">No Wallpapers Found</h3>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {wallpapers.map((wp) => (
                <div
                  key={wp._id}
                  onClick={() => setSelectedWallpaper(wp)}
                  className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all cursor-pointer group aspect-[3/4]"
                >
                  <div className="relative w-full h-full">
                    <S3Media s3Key={wp.imageUrl} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(wp);
                        }}
                        className="absolute top-3 right-3 p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white hover:text-black hover:scale-110 hover:shadow-lg hover:shadow-white/20 text-white transition-all duration-300 active:scale-95"
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

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(newPage) => {
                setPage(newPage);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </>
        )}

        {/* Lightbox */}
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
                  <p className="text-gray-500 text-sm">
                    By {typeof selectedWallpaper.creatorId === "object" ? selectedWallpaper.creatorId.fullName : "Creator"}
                  </p>
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

export default WallpaperGallery;
