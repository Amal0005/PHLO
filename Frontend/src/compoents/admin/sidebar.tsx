import { Shield, Users, LayoutDashboard, Camera, FolderTree, CreditCard, Image as ImageIcon, Wallet, ShieldAlert } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { motion } from "framer-motion";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, to: ROUTES.ADMIN.DASHBOARD },
    { label: "Users", icon: Users, to: ROUTES.ADMIN.USERS },
    { label: "Creators", icon: Camera, to: ROUTES.ADMIN.CREATORS },
    { label: "Categories", icon: FolderTree, to: ROUTES.ADMIN.CATEGORIES },
    { label: "Subscriptions", icon: CreditCard, to: ROUTES.ADMIN.SUBSCRIPTIONS },
    { label: "Wallpapers", icon: ImageIcon, to: ROUTES.ADMIN.WALLPAPERS },
    { label: "Wallet", icon: Wallet, to: ROUTES.ADMIN.WALLET },
    { label: "Complaints", icon: ShieldAlert, to: ROUTES.ADMIN.COMPLAINTS },
  ];

  return (
    <>
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-zinc-950/30 backdrop-blur-3xl z-30 
        transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 h-full flex flex-col justify-between no-scrollbar overflow-y-auto">
          <div className="space-y-3">
             <div className="px-4 mb-8">
             </div>
             
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 overflow-hidden ${
                      isActive
                        ? "text-white"
                        : "text-gray-500 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Background Pill */}
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      
                      <div className="relative flex items-center gap-4 z-10 w-full">
                         <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                         <span className={`text-[11px] font-black italic uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>
                            {item.label}
                         </span>
                         
                         {/* Subtle Indicator Dot */}
                         {isActive && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_#fff]" />
                         )}
                      </div>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          <div className="px-4 py-8 relative">
             <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="flex items-center gap-3 text-[9px] font-black italic uppercase tracking-[0.2em] text-gray-600">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group hover:border-white/20 transition-all cursor-pointer">
                 <Shield className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
              </div>
              <div className="flex flex-col gap-0.5">
                  <span className="text-white/60 tracking-[0.3em]">SECURE ACCESS</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-20 lg:hidden top-0"
          onClick={onClose}
        />
      )}
    </>
  );
}
