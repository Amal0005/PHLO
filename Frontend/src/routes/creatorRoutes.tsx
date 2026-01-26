import { Routes, Route } from "react-router-dom";
import CreatorLogin from "@/pages/creator/auth/login";
import CreatorSignup from "@/pages/creator/auth/register";
import ForgotPassword from "@/pages/creator/auth/forgotPassword";
import CreatorDashboard from "@/pages/creator/dashboard";
import ProtectedRoute from "./protectedRoute";

export function CreatorRoutes() {
  return (
    <Routes>
        <Route path="login" element={<CreatorLogin />} />
        <Route path="register" element={<CreatorSignup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />

      <Route element={<ProtectedRoute allowedRoles={["creator"]} />}>

          <Route path="dashboard" element={<CreatorDashboard />} />
        </Route>
    </Routes>);
}
