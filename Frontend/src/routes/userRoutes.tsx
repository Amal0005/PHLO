import { Routes, Route } from "react-router-dom";
import Register from "@/pages/user/auth/register";
import Login from "@/pages/user/auth/login";
import VerifyOtp from "@/pages/user/auth/verify-otp";
import ForgotPassword from "@/pages/user/auth/forgotPassword";
import Home from "@/pages/user/home/landing";
import LandingPage from "@/pages/landing";

export function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="verify-otp" element={<VerifyOtp />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="home" element={<Home />} />
    </Routes>
  );
}
