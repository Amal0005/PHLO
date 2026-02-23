import { Routes, Route } from "react-router-dom";
import Register from "@/pages/user/auth/register";
import Login from "@/pages/user/auth/login";
import ForgotPassword from "@/pages/user/auth/forgotPassword";
import VerifyOtp from "@/pages/user/auth/verify-otp";
import Home from "@/pages/user/home/landing";
import LandingPage from "@/pages/landing";
import ProtectedRoute from "./protectedRoute";
import { ROUTES } from "../constants/routes";
import UserProfile from "@/pages/user/profile/userProfile";
import PackageListing from "@/pages/user/package/packageListing";
import PackageDetailPage from "@/pages/user/package/packageDetail";
import PaymentSuccess from "@/pages/user/payment/paymentSuccess";
import PaymentCancel from "@/pages/user/payment/paymentCancel";
import BookingsPage from "@/pages/user/booking/bookings";
import WallpaperGallery from "@/pages/user/wallpaper/wallpaperGallery";
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
        <Route path={ROUTES.USER.PROFILE} element={<UserProfile />} />
        <Route path={ROUTES.USER.PACKAGES} element={<PackageListing />} />
        <Route
          path={ROUTES.USER.PACKAGE_DETAIL}
          element={<PackageDetailPage />}
        />
        <Route
          path={ROUTES.USER.PAYMENT_SUCCESS} element={<PaymentSuccess />} />
        <Route path={ROUTES.USER.PAYMENT_CANCEL} element={<PaymentCancel />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path={ROUTES.USER.WALLPAPERS} element={<WallpaperGallery />} />
      </Route>
    </Routes>
  );
}
