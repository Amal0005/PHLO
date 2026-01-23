import { Routes, Route } from "react-router-dom";
import CreatorLogin from "@/pages/creator/auth/login";
import CreatorSignup from "@/pages/creator/auth/register";
import ForgotPasswordd from "@/pages/creator/auth/forgotPassword";
import ProtectedRoute from "./protectedRoute";
import CreatorHomepage from "@/pages/creator/home";

export function CreatorRoutes() {
  return (
    <Routes>
      <Route path="login" element={<CreatorLogin />} />
      <Route path="register" element={<CreatorSignup />} />
      <Route path="forgot-password" element={<ForgotPasswordd />} />
            <Route element={<ProtectedRoute allowedRoles={["creator"]} />}>
            <Route path="home" element={<CreatorHomepage />} />
      </Route>
    </Routes>
  );
}
