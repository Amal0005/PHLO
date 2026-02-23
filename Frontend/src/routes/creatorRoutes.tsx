import { Routes, Route, Navigate } from "react-router-dom";
import CreatorLogin from "@/pages/creator/auth/login";
import CreatorSignup from "@/pages/creator/auth/register";
import ForgotPassword from "@/pages/creator/auth/forgotPassword";
import CreatorDashboard from "@/pages/creator/dashboard";
import ProtectedRoute from "./protectedRoute";
import { ROUTES } from "../constants/routes";
import CreatorProfile from "@/pages/creator/profile/creatorProfile";
import ViewPackagesPage from "@/pages/creator/package/viewPackage";
import CreatorSubscription from "@/pages/creator/subscription/creatorSubscription";
import SubscriptionSuccess from "@/pages/creator/subscription/subscriptionSuccess";
import SubscriptionCancel from "@/pages/creator/subscription/subscriptionCancel";
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
        <Route path={ROUTES.CREATOR.ROOT} element={<Navigate to={ROUTES.CREATOR.DASHBOARD} replace />} />
        <Route path={ROUTES.CREATOR.DASHBOARD} element={<CreatorDashboard />} />
        <Route path={ROUTES.CREATOR.PROFILE} element={<CreatorProfile />} />
        <Route path={ROUTES.CREATOR.PACKAGES} element={<ViewPackagesPage />} />
        <Route path={ROUTES.CREATOR.SUBSCRIPTIONS} element={<CreatorSubscription />} />
        <Route path={ROUTES.CREATOR.SUBSCRIPTION_SUCCESS} element={<SubscriptionSuccess />} />
        <Route path={ROUTES.CREATOR.SUBSCRIPTION_CANCEL} element={<SubscriptionCancel />} />


      </Route>
    </Routes>
  );
}
