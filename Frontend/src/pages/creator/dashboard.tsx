import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import CreatorNavbar from "@/compoents/reusable/creatorNavbar";
import { useState, useEffect } from "react";
import { Package, Image as ImageIcon, Eye, Plus } from "lucide-react";
import { AddPackageModal } from "./package/components/addPackageModal";
import { AddWallpaperModal } from "./wallpaper/components/addWallpaperModal";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { CreatorProfileServices } from "@/services/creator/creatorProfileService";
import ConfirmModal from "@/compoents/reusable/ConfirmModal";
import OptionModal from "@/compoents/reusable/OptionModal";

export default function CreatorDashboard() {
  const creator = useSelector((state: RootState) => state.creator.creator);
  const navigate = useNavigate();

  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isWallpaperOptionModalOpen, setIsWallpaperOptionModalOpen] = useState(false);
  const [isAddWallpaperModalOpen, setIsAddWallpaperModalOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await CreatorProfileServices.getProfile();
        if (response.success) {
          const sub = response.creator.subscription;
          const isActive = sub?.status === 'active' && new Date(sub.endDate) > new Date();
          setIsSubscribed(!!isActive);
        }
      } catch (error) {
        console.error("Failed to check subscription", error);
      }
    };
    checkSubscription();
  }, []);

  const handleSelectView = () => {
    console.log("View Packages selected");
  };

  const handleAddSuccess = () => {
    console.log("Package added successfully");
  };

  const handleWallpaperAddSuccess = () => {
    console.log("Wallpaper added successfully");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <CreatorNavbar />

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 mb-8 shadow-2xl">
          <div className="max-w-3xl">
            <h2 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-4">
              Creator Dashboard
            </h2>
            <h1 className="text-4xl lg:text-6xl font-black mb-6 tracking-tight">
              Welcome back, <br />
              <span className="text-gray-400">{creator?.fullName || "Creator"}</span>
            </h1>
            <p className="text-gray-400 text-lg lg:text-xl font-light leading-relaxed mb-8">
              Manage your profile, view your analytics, and create stunning content for your audience.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            onClick={() => setIsOptionModalOpen(true)}
            className="h-48 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10 shadow-xl">
              <Package size={28} />
            </div>

            <div className="text-center relative z-10">
              <span className="block text-white font-black text-xl tracking-tight">Packages</span>
              <span className="text-gray-500 text-sm font-medium">View or Manage your packages</span>
            </div>

            <div className="absolute -bottom-4 -right-4 text-white/5 group-hover:text-white/10 transition-colors">
              <Package size={100} />
            </div>
          </div>

          {/* Wallpapers Card */}
          <div
            onClick={() => setIsWallpaperOptionModalOpen(true)}
            className="h-48 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10 shadow-xl">
              <ImageIcon size={28} />
            </div>

            <div className="text-center relative z-10">
              <span className="block text-white font-black text-xl tracking-tight">Wallpapers</span>
              <span className="text-gray-500 text-sm font-medium">Upload & manage wallpapers</span>
            </div>

            <div className="absolute -bottom-4 -right-4 text-white/5 group-hover:text-white/10 transition-colors">
              <ImageIcon size={100} />
            </div>
          </div>
        </div>

        <OptionModal
          isOpen={isOptionModalOpen}
          onClose={() => setIsOptionModalOpen(false)}
          title="Package Options"
          options={[
            {
              label: "View Packages",
              description: "List and manage your existing packages",
              icon: <Eye size={20} className="text-gray-400" />,
              onClick: () => {
                handleSelectView();
                navigate(ROUTES.CREATOR.PACKAGES);
              }
            },
            {
              label: "Add Package",
              description: "Create a new photography package",
              icon: <Plus size={20} />,
              isPrimary: true,
              onClick: () => {
                if (isSubscribed) {
                  setIsAddModalOpen(true);
                } else {
                  setShowSubModal(true);
                }
              }
            }
          ]}
        />

        <ConfirmModal
          isOpen={showSubModal}
          onClose={() => setShowSubModal(false)}
          onConfirm={() => navigate(ROUTES.CREATOR.SUBSCRIPTIONS)}
          title="Subscription Required"
          message="You need an active subscription to add new content. Buy a plan to continue."
          confirmLabel="View Plans"
          variant="warning"
        />


        <AddPackageModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleAddSuccess}
        />

        <OptionModal
          isOpen={isWallpaperOptionModalOpen}
          onClose={() => setIsWallpaperOptionModalOpen(false)}
          title="Wallpaper Options"
          options={[
            {
              label: "View Wallpapers",
              description: "List and manage your uploaded wallpapers",
              icon: <Eye size={20} className="text-gray-400" />,
              onClick: () => navigate(ROUTES.CREATOR.WALLPAPERS)
            },
            {
              label: "Add Wallpaper",
              description: "Upload a new wallpaper to your gallery",
              icon: <Plus size={20} />,
              isPrimary: true,
              onClick: () => {
                if (isSubscribed) {
                  setIsAddWallpaperModalOpen(true);
                } else {
                  setShowSubModal(true);
                }
              }
            }
          ]}
        />

        <AddWallpaperModal
          isOpen={isAddWallpaperModalOpen}
          onClose={() => setIsAddWallpaperModalOpen(false)}
          onSuccess={handleWallpaperAddSuccess}
        />
      </main>
    </div>
  );
}
