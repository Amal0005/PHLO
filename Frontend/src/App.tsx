import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/user/auth/register";
import Login from "./pages/user/auth/login";
import VerifyOtp from "./pages/user/auth/verify-otp";
import Home from "./pages/user/home/landing";
import { ToastContainer } from "react-toastify";
import ForgotPassword from "./pages/user/auth/forgotPassword";
import LandingPage from "./pages/landing";
import CreatorLogin from "./pages/creator/auth/login";
import CreatorSignup from "./pages/creator/auth/register";
import ForgotPasswordd from "./pages/creator/auth/forgotPassword";
import AdminLogin from "./pages/admin/adminLogin";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/home" element={<Home />} />

          <Route path="/creator/login" element={<CreatorLogin />} />
          <Route path="/creator/register" element={<CreatorSignup />} />
          <Route path="/creator/forgot" element={<ForgotPasswordd />} />


          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-right" theme="dark" />
    </>
  );
}
