import { Routes, Route } from "react-router-dom";
import CreatorLogin from "@/pages/creator/auth/login";
import CreatorSignup from "@/pages/creator/auth/register";
import ForgotPasswordd from "@/pages/creator/auth/forgotPassword";
import ProtectedRoute from "./protectedRoute";
import CreatorDashboard from "@/pages/creator/dashboard";

export function CreatorRoutes() {
  return (
    <Routes>
      <Route path="login" element={<CreatorLogin />} />
      <Route path="register" element={<CreatorSignup />} />
      <Route path="forgot-password" element={<ForgotPasswordd />} />
            <Route element={<ProtectedRoute allowedRoles={["creator"]} />}>
            <Route path="dashboard" element={<CreatorDashboard />} />
      </Route>
    </Routes>
  );
}
