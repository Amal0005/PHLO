import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import Register from "./pages/user/auth/register";
import Login from "./pages/user/auth/login";
import VerifyOtp from "./pages/user/auth/verify-otp";
import LandingPage from "./pages/user/home/landing";

  export default function App(){
    return(
  <>
      <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register/>}/>
              <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/home" element={< LandingPage/>} />

      </Routes>
      </BrowserRouter>
       <ToastContainer position="top-right" theme="dark" />
  </>
    )
  }