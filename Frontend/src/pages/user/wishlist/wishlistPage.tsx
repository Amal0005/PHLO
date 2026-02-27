import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Image as ImageIcon, Package as PackageIcon, Download, MapPin, X } from "lucide-react";
import { WishlistService } from "@/services/user/wishlistService";
import { UserWallpaperService } from "@/services/user/userWallpaperService";
import { UserPackageService } from "@/services/user/userPackageService";
import { WallpaperData } from "@/interface/creator/creatorWallpaperInterface";
import { UserPackage } from "@/interface/user/userPackageInterface";
import { S3Media } from "@/compoents/reusable/s3Media";
import { S3Service } from "@/services/s3Service";
import UserNavbar from "@/compoents/reusable/userNavbar";
import Pagination from "@/compoents/reusable/pagination";
import ConfirmModal from "@/compoents/reusable/ConfirmModal";
import { ROUTES } from "@/constants/routes";
import { toast } from "react-toastify";

type TabType = "wallpaper" | "package";

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("wallpaper");
  const [wallpapers, setWallpapers] = useState<WallpaperData[]>([]);
  const [packages, setPackages] = useState<UserPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperData | null>(null);

  const fetchWishlistItems = useCallback(async () => {
    try {
      setLoading(true);
      const wishlistRes = await WishlistService.getWishlist({
        itemType: activeTab,
        page,
        limit,
      });

      if (!wishlistRes.success || wishlistRes.data.length === 0) {
        if (activeTab === "wallpaper") setWallpapers([]);
        else setPackages([]);
        setTotalPages(1);
        return;
      }

      setTotalPages(wishlistRes.totalPages || 1);
      const itemIds = wishlistRes.data.map(
        (item: { itemId: string }) => item.itemId,
      );

      if (activeTab === "wallpaper") {
        const wpRes = await UserWallpaperService.getApprovedWallpapers(
          1,
          itemIds.length,
          {
            ids: itemIds.join(","),
          },
        );
        setWallpapers(wpRes?.data || []);
      } else {
        const pkgResults = await Promise.all(
          itemIds.map(async (id: string) => {
            try {
              const res = await UserPackageService.getPackageById(id);
              return res?.success ? res.data : null;
            } catch {
              return null;
            }
          }),
        );
        setPackages(pkgResults.filter(Boolean));
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to fetch wishlist", error.message);
      }
      console.error("Failed to fetch wishlist", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page]);

  useEffect(() => {
    fetchWishlistItems();
  }, [fetchWishlistItems]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setPage(1);
  };

  const openRemoveConfirm = (itemId: string) => {
    setItemToRemove(itemId);
    setConfirmModalOpen(true);
  };

  const cancelRemove = () => {
    setConfirmModalOpen(false);
    setItemToRemove(null);
  };

  const confirmRemove = async () => {
    if (!itemToRemove) return;
    try {
      setRemoveLoading(true);
      await WishlistService.toggle(itemToRemove, activeTab);
      if (activeTab === "wallpaper") {
        setWallpapers((prev) => prev.filter((wp) => wp._id !== itemToRemove));
      } else {
        setPackages((prev) => prev.filter((pkg) => pkg._id !== itemToRemove));
      }
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Failed to remove from wishlist");
    } finally {
      setRemoveLoading(false);
      setConfirmModalOpen(false);
      setItemToRemove(null);
    }
  };

  const handleDownload = async (wp: WallpaperData) => {
    try {
      const creatorId = typeof wp.creatorId === "object" ? wp.creatorId._id : wp.creatorId;
      const recordRes = await UserWallpaperService.recordDownload(wp._id, creatorId);

      setWallpapers((prev) =>
        prev.map((w) =>
          w._id === wp._id ? { ...w, downloadCount: recordRes.downloadCount } : w
        )
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
    } catch {
      toast.error("Download failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <UserNavbar />

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Heart size={24} className="text-red-400" fill="currentColor" />
            </div>
            <h1 className="text-5xl font-black">My Wishlist</h1>
          </div>
          <p className="text-gray-500 font-medium max-w-md mx-auto">
            Your saved wallpapers and packages all in one place
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-10">
          <button
            onClick={() => handleTabChange("wallpaper")}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === "wallpaper"
              ? "bg-white text-black"
              : "bg-zinc-900 text-gray-400 border border-white/10 hover:border-white/20 hover:text-white"
              }`}
          >
            <ImageIcon size={18} />
            Wallpapers
          </button>
          <button
            onClick={() => handleTabChange("package")}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === "package"
              ? "bg-white text-black"
              : "bg-zinc-900 text-gray-400 border border-white/10 hover:border-white/20 hover:text-white"
              }`}
          >
            <PackageIcon size={18} />
            Packages
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          </div>
        ) : activeTab === "wallpaper" ? (
          wallpapers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
              <ImageIcon size={48} className="text-gray-600 mb-4" />
              <h3 className="text-2xl font-black mb-2">No Saved Wallpapers</h3>
              <p className="text-gray-500 mb-6">
                Browse wallpapers and tap the heart icon to save them here
              </p>
              <button
                onClick={() => navigate(ROUTES.USER.WALLPAPERS)}
                className="px-6 py-3 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 transition-all"
              >
                Browse Wallpapers
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {wallpapers.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => setSelectedWallpaper(item)}
                    className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all cursor-pointer group aspect-[3/4] relative"
                  >
                    <div className="relative w-full h-full">
                      <S3Media
                        s3Key={item.watermarkedUrl || item.imageUrl}
                        className="w-full h-full object-cover"
                      />
                      {/* Price + Download badge */}
                      <div className="absolute top-3 left-3 z-10 flex gap-1.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${item.price > 0
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-white/10 text-gray-300 border-white/20"
                            }`}
                        >
                          {item.price > 0 ? `₹${item.price}` : "FREE"}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md border bg-white/10 text-gray-300 border-white/20 flex items-center gap-1">
                          <Download size={10} />
                          {item.downloadCount ?? 0}
                        </span>
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDownload(item); }}
                          className="absolute top-3 right-3 p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white hover:text-black hover:scale-110 text-white transition-all duration-300 active:scale-95"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); openRemoveConfirm(item._id); }}
                          className="absolute top-3 right-16 p-2.5 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl text-red-400 hover:bg-red-500/30 hover:scale-110 transition-all duration-300 active:scale-95"
                          title="Remove from wishlist"
                        >
                          <Heart size={16} fill="currentColor" />
                        </button>
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-white font-bold text-sm line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-gray-300 text-xs">
                            {typeof item.creatorId === "object"
                              ? item.creatorId.fullName
                              : ""}
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
          )
        ) : packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <PackageIcon size={48} className="text-gray-600 mb-4" />
            <h3 className="text-2xl font-black mb-2">No Saved Packages</h3>
            <p className="text-gray-500 mb-6">
              Browse packages and tap the heart icon to save them here
            </p>
            <button
              onClick={() => navigate(ROUTES.USER.PACKAGES)}
              className="px-6 py-3 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 transition-all"
            >
              Browse Packages
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  onClick={() => navigate(`/packages/${pkg._id}`)}
                  className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all cursor-pointer group"
                >
                  <div className="h-56 bg-zinc-800 relative overflow-hidden">
                    {pkg.images?.length > 0 ? (
                      <S3Media
                        s3Key={pkg.images[0]}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700">
                        <PackageIcon size={40} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openRemoveConfirm(pkg._id);
                        }}
                        className="p-2.5 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl text-red-400 hover:bg-red-500/30 hover:scale-110 transition-all duration-300 active:scale-95"
                        title="Remove from wishlist"
                      >
                        <Heart size={16} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-black text-xl mb-2 line-clamp-1">
                      {pkg.title}
                    </h4>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                      {pkg.description}
                    </p>
                    {(pkg.placeName ||
                      (typeof pkg.creatorId === "object" &&
                        pkg.creatorId.city)) && (
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                          <MapPin size={16} className="flex-shrink-0" />
                          <span className="line-clamp-1">
                            {pkg.placeName ||
                              (typeof pkg.creatorId === "object"
                                ? pkg.creatorId.city
                                : "")}
                          </span>
                        </div>
                      )}
                    <div className="text-2xl font-black">
                      ₹ {pkg.price.toLocaleString()}
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
      </main>

      {/* Wallpaper Lightbox */}
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
                s3Key={selectedWallpaper.watermarkedUrl || selectedWallpaper.imageUrl}
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
                  <span className={`text-sm font-bold ${selectedWallpaper.price > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                    {selectedWallpaper.price > 0 ? `₹${selectedWallpaper.price}` : 'FREE'}
                  </span>
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <Download size={14} />
                    {selectedWallpaper.downloadCount ?? 0} downloads
                  </span>
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
                  onClick={() => { setSelectedWallpaper(null); openRemoveConfirm(selectedWallpaper._id); }}
                  className="p-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
                  title="Remove from wishlist"
                >
                  <Heart size={20} fill="currentColor" />
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

      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={cancelRemove}
        onConfirm={confirmRemove}
        title="Remove from Wishlist"
        message={`Are you sure you want to remove this ${activeTab} from your wishlist?`}
        confirmLabel="Remove"
        cancelLabel="Keep"
        variant="danger"
        icon={<Heart size={28} />}
        loading={removeLoading}
      />
    </div>
  );
};

export default WishlistPage;
