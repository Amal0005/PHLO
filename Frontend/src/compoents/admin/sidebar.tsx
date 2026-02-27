import { Shield, Users, LayoutDashboard, Camera, FolderTree, CreditCard, Image as ImageIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      to: ROUTES.ADMIN.DASHBOARD,
    },
    {
      label: "Users",
      icon: Users,
      to: ROUTES.ADMIN.USERS,
    },
    {
      label: "Creators",
      icon: Camera,
      to: ROUTES.ADMIN.CREATORS,
    },
    {
      label: "Categories",
      icon: FolderTree,
      to: ROUTES.ADMIN.CATEGORIES,
    },
    {
      label: "Subscriptions",
      icon: CreditCard,
      to: ROUTES.ADMIN.SUBSCRIPTIONS,
    },
    {
      label: "Wallpapers",
      icon: ImageIcon,
      to: ROUTES.ADMIN.WALLPAPERS,
    },
  ];

  return (
    <>
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-zinc-900/90 backdrop-blur-xl border-r border-white/10 z-30
        transform transition-transform duration-300 lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${isActive
                    ? "bg-white/10 text-white border border-white/20"
                    : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Shield className="w-3 h-3" />
            <span>Secure Admin Access</span>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden top-16"
          onClick={onClose}
        />
      )}
    </>
  );
}
