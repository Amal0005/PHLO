import { Routes, Route, Navigate } from "react-router-dom";
import CreatorLogin from "@/pages/creator/auth/login";
import CreatorSignup from "@/pages/creator/auth/register";
import ForgotPassword from "@/pages/creator/auth/forgotPassword";
import CreatorDashboard from "@/pages/creator/dashboard";
import ProtectedRoute from "./protectedRoute";
import { ROUTES } from "../constants/routes";
export function CreatorRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute role="creator" requireAuth={false} />}>
        <Route path={ROUTES.CREATOR.LOGIN} element={<CreatorLogin />} />
        <Route path={ROUTES.CREATOR.REGISTER} element={<CreatorSignup />} />
        <Route
          path={ROUTES.CREATOR.FORGOT_PASSWORD}
          element={<ForgotPassword />}
        />
      </Route>

      <Route element={<ProtectedRoute role="creator" />}>
        <Route
          path={ROUTES.CREATOR.ROOT}
          element={<Navigate to={ROUTES.CREATOR.DASHBOARD} replace />}
        />
        <Route path={ROUTES.CREATOR.DASHBOARD} element={<CreatorDashboard />} />
      </Route>
    </Routes>
  );
}
