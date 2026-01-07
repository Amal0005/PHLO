import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/user/auth/register";
import Login from "./pages/user/auth/login";
import VerifyOtp from "./pages/user/auth/verify-otp";
import LandingPage from "./pages/user/home/landing";
import { ToastContainer } from "react-toastify";
import { setUserFromSession } from "./store/user/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ForgotPassword from "./pages/user/auth/forgotPassword";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      dispatch(
        setUserFromSession({
          user: JSON.parse(savedUser),
          token: savedToken,
        })
      );
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/home" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" theme="dark" />
    </>
  );
}
