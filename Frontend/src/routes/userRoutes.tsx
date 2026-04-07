import { Routes, Route, useLocation } from "react-router-dom";
import Register from "@/pages/user/auth/register";
import Login from "@/pages/user/auth/login";
import ForgotPassword from "@/pages/user/auth/forgotPassword";
import VerifyOtp from "@/pages/user/auth/verify-otp";
import Home from "@/pages/user/home/landing";
import LandingPage from "@/pages/landing";
import ProtectedRoute from "@/routes/protectedRoute";
import { ROUTES } from "@/constants/routes";
import UserProfile from "@/pages/user/profile/userProfile";
import PackageListing from "@/pages/user/package/packageListing";
import PackageDetailPage from "@/pages/user/package/packageDetail";
import PaymentSuccess from "@/pages/user/payment/paymentSuccess";
import PaymentCancel from "@/pages/user/payment/paymentCancel";
import BookingsPage from "@/pages/user/booking/bookings";
import BookingDetailPage from "@/pages/user/booking/BookingDetailPage";
import WallpaperGallery from "@/pages/user/wallpaper/wallpaperGallery";
import WishlistPage from "@/pages/user/wishlist/wishlistPage";
import ChatPage from "@/pages/chat/ChatPage";
import UserWalletPage from "@/pages/user/wallet/UserWalletPage";
import NotFoundPage from "@/pages/error/NotFoundPage";
import CreatorsListing from "@/pages/user/creators/CreatorsListing";
import CreatorProfile from "@/pages/user/creators/CreatorProfile";
import About from "@/pages/user/about";

const ConditionalNotFound = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin') || pathname.startsWith('/creator')) return null;
  return <NotFoundPage />;
};

export function UserRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.USER.ROOT} element={<LandingPage />} />
      <Route path={ROUTES.USER.ABOUT} element={<About />} />

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
        <Route path={ROUTES.USER.BOOKINGS} element={<BookingsPage />} />
        <Route path={ROUTES.USER.BOOKING_DETAIL} element={<BookingDetailPage />} />
        <Route path={ROUTES.USER.WALLPAPERS} element={<WallpaperGallery />} />
        <Route path={ROUTES.USER.WISHLIST} element={<WishlistPage />} />
        <Route path={ROUTES.USER.CHAT} element={<ChatPage />} />
        <Route path={ROUTES.USER.WALLET} element={<UserWalletPage />} />
        <Route path={ROUTES.USER.CREATORS} element={<CreatorsListing />} />
        <Route path={ROUTES.USER.CREATOR_DETAIL} element={<CreatorProfile />} />
      </Route>

      <Route path="*" element={<ConditionalNotFound />} />
    </Routes>
  );
}
