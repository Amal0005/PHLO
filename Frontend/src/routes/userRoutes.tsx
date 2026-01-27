import { Routes, Route } from "react-router-dom";
import Register from "@/pages/user/auth/register";
import Login from "@/pages/user/auth/login";
import VerifyOtp from "@/pages/user/auth/verify-otp";
import ForgotPassword from "@/pages/user/auth/forgotPassword";
import Home from "@/pages/user/home/landing";
import LandingPage from "@/pages/landing";
import ProtectedRoute from "./protectedRoute";

export function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<ProtectedRoute role="user" requireAuth={false} />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="verify-otp" element={<VerifyOtp />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route element={<ProtectedRoute role="user" />}>
        <Route path="home" element={<Home />} />
      </Route>
    </Routes>
  );
}

