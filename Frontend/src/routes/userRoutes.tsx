import { Routes, Route } from "react-router-dom";
import Register from "@/pages/user/auth/register";
import Login from "@/pages/user/auth/login";
import ForgotPassword from "@/pages/user/auth/forgotPassword";
import VerifyOtp from "@/pages/user/auth/verify-otp";
import Home from "@/pages/user/home/landing";
import LandingPage from "@/pages/landing";
import ProtectedRoute from "./protectedRoute";
import { ROUTES } from "../constants/routes";
// import NotFound from "@/pages/user/404";

export function UserRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.USER.ROOT} element={<LandingPage />} />
        {/* <Route path={ROUTES.USER.NOT_FOUND} element={<NotFound />} /> */}

      <Route element={<ProtectedRoute role="user" requireAuth={false} />}>
        <Route path={ROUTES.USER.LOGIN} element={<Login />} />
        <Route path={ROUTES.USER.REGISTER} element={<Register />} />
        <Route
          path={ROUTES.USER.FORGOT_PASSWORD}
          element={<ForgotPassword />}
        />
        <Route path={ROUTES.USER.VERIFY_OTP} element={<VerifyOtp />} />
      </Route>

      <Route element={<ProtectedRoute role="user" />}>
        <Route path={ROUTES.USER.HOME} element={<Home />} />
      </Route>
    </Routes>
  );
}
