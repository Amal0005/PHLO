import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "@/pages/admin/adminLayout";
import AdminLogin from "@/pages/admin/adminLogin";
import AdminDashboard from "@/pages/admin/adminDashboard";
import UserListingPage from "@/pages/admin/userListing";
import CreatorListingPage from "@/pages/admin/creatorListing";
import ProtectedRoute from "./protectedRoute";
import { ROUTES } from "../constants/routes";
import CategoryListing from "@/pages/admin/categoryListing";
import SubscriptionListingPage from "@/pages/admin/subscriptionListing";
import WallpaperListingPage from "@/pages/admin/wallpaper/wallpaperListing";

export function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute role="admin" requireAuth={false} />}>
        <Route path={ROUTES.ADMIN.LOGIN} element={<AdminLogin />} />
      </Route>

      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<AdminLayout />}>
          <Route
            path={ROUTES.ADMIN.ROOT}
            element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />}
          />
          <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
          <Route path={ROUTES.ADMIN.USERS} element={<UserListingPage />} />
          <Route path={ROUTES.ADMIN.CATEGORIES} element={<CategoryListing/>}/>
          <Route
            path={ROUTES.ADMIN.CREATORS}
            element={<CreatorListingPage />}
          />
          <Route path={ROUTES.ADMIN.SUBSCRIPTIONS} element={<SubscriptionListingPage/>}/>
          <Route path={ROUTES.ADMIN.WALLPAPERS} element={<WallpaperListingPage />} />

        </Route>
      </Route>
    </Routes>
  );
}
