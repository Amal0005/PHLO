import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LogoWhite from "../../assets/images/Logo_white.png";
import type { RootState } from "@/store/store";
import { clearAdmin } from "@/store/slices/admin/adminSlice";
import { clearAdminAuth } from "@/store/slices/admin/adminAuthSlice";
import { ROUTES } from "@/constants/routes";
import { AdminAuthService } from "@/services/admin/adminAuthService";
import { confirmActionToast } from "../reusable/confirmActionToast";

interface AdminNavbarProps {
  onMenuToggle: () => void;
}

export default function AdminNavbar({ onMenuToggle }: AdminNavbarProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const admin = useSelector((state: RootState) => state.admin.admin);


  const handleLogout = () => {
    confirmActionToast(
      "Are you sure you want to logout?",
      async () => {
        try {
          await AdminAuthService.logOut();

          dispatch(clearAdminAuth());
          dispatch(clearAdmin());

          navigate(ROUTES.ADMIN.LOGIN, { replace: true });
        } catch (err) {
          console.error("Logout failed", err);
        }
      },
      "Logout"
    );
  };


  const initials = admin?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <nav className="bg-zinc-900/90 backdrop-blur-xl border-b border-white/10 fixed top-0 left-0 right-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center gap-4">
            <button
              onClick={onMenuToggle}
              className="lg:hidden text-white hover:bg-white/10 p-2 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <img src={LogoWhite} alt="Logo" className="h-8 sm:h-10" />
              <div className="hidden sm:block border-l border-white/20 pl-3">
                <h1 className="text-white font-semibold text-lg">
                  Admin Portal
                </h1>
                <p className="text-gray-400 text-xs">
                  Management Dashboard
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {admin && (
              <div className="hidden sm:flex items-center gap-2 bg-zinc-800/50 rounded-lg px-3 py-2 border border-zinc-700">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {initials}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-white text-sm font-medium">
                    {admin.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {admin.email}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-lg"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
