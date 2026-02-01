import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/store/store";
import { LogOut } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { clearCreator } from "@/store/slices/creator/creatorSlice";
import { clearCreatorAuth } from "@/store/slices/creator/creatorAuthSlice";
import { confirmActionToast } from "@/compoents/reusable/confirmActionToast";
import { CreatorAuthService } from "@/services/creator/creatorAuthService";

export default function CreatorDashboard() {

  const creator = useSelector((state: RootState) => state.creator.creator);

  const dispatch = useDispatch();
  const navigate = useNavigate();

const handleLogout = () => {
  confirmActionToast(
    "Are you sure you want to logout?",
    async () => {
      await CreatorAuthService.logout();
      dispatch(clearCreatorAuth());
      dispatch(clearCreator());
      navigate(ROUTES.CREATOR.LOGIN, { replace: true });
    },
    "Logout"
  );
};
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-white text-center">

        <h1 className="text-2xl font-bold mb-2">
          Welcome, {creator?.fullName || "Creator"}
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          This is your creator dashboard
        </p>
        <button
          onClick={() => handleLogout()}
          className="mt-6 flex items-center justify-center gap-2 text-red-400 hover:text-red-300 text-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
