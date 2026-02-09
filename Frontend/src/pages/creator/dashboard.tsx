import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/store/store";
import { LogOut } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { clearCreator } from "@/store/slices/creator/creatorSlice";
import { clearCreatorAuth } from "@/store/slices/creator/creatorAuthSlice";
import { confirmActionToast } from "@/compoents/reusable/confirmActionToast";
import { CreatorAuthService } from "@/services/creator/creatorAuthService";

import CreatorNavbar from "@/compoents/reusable/creatorNavbar";

export default function CreatorDashboard() {
  const creator = useSelector((state: RootState) => state.creator.creator);

  return (
    <div className="min-h-screen bg-black text-white">
      <CreatorNavbar />

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 mb-8">
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

        {/* Dashboard Grid Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-zinc-900/40 border border-white/5 rounded-2xl flex items-center justify-center">
              <span className="text-zinc-700 font-mono tracking-tighter">FEATURE_{i}_PLACEHOLDER</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
