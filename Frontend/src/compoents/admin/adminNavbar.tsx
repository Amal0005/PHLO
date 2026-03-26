import { useState } from "react";
import { Menu, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LogoWhite from "../../assets/images/Logo_white.png";
import type { RootState } from "@/store/store";
import { clearAdmin } from "@/store/slices/admin/adminSlice";
import { ROUTES } from "@/constants/routes";
import { AdminAuthService } from "@/services/admin/adminAuthService";
import ConfirmModal from "../reusable/ConfirmModal";
import { removeUser } from "@/store/slices/auth/authSlice";
import NotificationBell from "../reusable/NotificationBell";


interface AdminNavbarProps {
  onMenuToggle: () => void;
}

export default function AdminNavbar({ onMenuToggle }: AdminNavbarProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const admin = useSelector((state: RootState) => state.admin.admin);


  const handleLogout = async () => {
    try {
      await AdminAuthService.logOut();

      dispatch(removeUser());
      dispatch(clearAdmin());

      navigate(ROUTES.ADMIN.LOGIN, { replace: true });
    } catch (err) {
      console.error("Logout failed", err);
    }
  };


  const initials = admin?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <nav className="bg-zinc-950/20 backdrop-blur-2xl fixed top-0 left-0 right-0 z-40">
      <div className="px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">

          <div className="flex items-center gap-6">
            <button
              onClick={onMenuToggle}
              className="lg:hidden text-white hover:bg-white/10 p-2.5 rounded-2xl transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-6">
              <img src={LogoWhite} alt="Logo" className="h-10 opacity-90 group hover:opacity-100 transition-opacity" />
              <div className="hidden sm:block border-l border-white/10 pl-6 space-y-0.5">
                <h1 className="text-white font-black text-sm tracking-[0.3em] uppercase italic italic">
                  Admin Portal
                </h1>
                <p className="text-gray-500 text-[10px] font-medium tracking-[0.1em] uppercase">
                  Management Dashboard
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4">
               <NotificationBell />
            </div>
            
            {admin && (
              <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-1.5 px-4 border border-white/5 hover:border-white/10 transition-all group cursor-pointer">
                <div className="relative">
                   <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-white/5 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                   <div className="relative w-9 h-9 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center">
                     <span className="text-white text-xs font-black italic">
                       {initials}
                     </span>
                   </div>
                </div>
                <div className="hidden lg:block">
                  <p className="text-white text-[11px] font-black italic uppercase tracking-wider">
                    {admin.name}
                  </p>
                  <p className="text-gray-500 text-[9px] font-medium">
                    {admin.email}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-2xl border border-white/5 transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Admin Logout"
        message="Are you sure you want to exit the admin portal?"
        confirmLabel="Logout"
        variant="danger"
        position="top"
        icon={<LogOut size={28} />}
      />
    </nav>
  );
}
