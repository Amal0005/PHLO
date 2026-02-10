import React from "react";
import { Eye, Plus } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useNavigate } from "react-router-dom";


interface PackageOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAdd: () => void;
  onSelectView: () => void;
}

export const PackageOptionModal: React.FC<PackageOptionModalProps> = ({
  isOpen,
  onClose,
  onSelectAdd,
  onSelectView,
}) => {
  const navigate = useNavigate()
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-sm shadow-2xl">
        <h2 className="text-xl font-black mb-6 tracking-tight text-white text-center">
          Package Options
        </h2>

        <div className="space-y-4">
          <button
            onClick={() => {
              navigate(ROUTES.CREATOR.PACKAGES);
              onSelectView();
              onClose();
            }}
            className="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
          >
            <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center group-hover:bg-zinc-700">
              <Eye size={20} className="text-gray-400" />
            </div>
            <div className="text-left">
              <span className="block font-bold text-white">View Packages</span>
              <span className="text-xs text-gray-500">
                List and manage your existing packages
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              onSelectAdd();
              onClose();
            }}
            className="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
          >
            <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
              <Plus size={20} />
            </div>
            <div className="text-left">
              <span className="block font-bold text-white">Add Package</span>
              <span className="text-xs text-gray-500">
                Create a new photography package
              </span>
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 text-gray-500 font-bold hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
