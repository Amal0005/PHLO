import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/sidebar";
import AdminNavbar from "@/components/admin/adminNavbar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <AdminNavbar onMenuToggle={() => setSidebarOpen(p => !p)} />

      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="pt-16 lg:pl-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

