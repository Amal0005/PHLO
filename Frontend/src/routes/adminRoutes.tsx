import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "@/pages/admin/adminLayout";
import AdminLogin from "@/pages/admin/adminLogin";
import AdminDashboard from "@/pages/admin/adminDashboard";
import UserListingPage from "@/pages/admin/userListing";
import CreatorListingPage from "@/pages/admin/creatorListing";
import ProtectedRoute from "./protectedRoute";

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserListingPage />} />
          <Route path="creators" element={<CreatorListingPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
