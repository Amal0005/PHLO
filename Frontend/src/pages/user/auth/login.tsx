import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Image, Calendar, Eye, EyeOff, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify";

import api from "../../../axios/axiosConfig";
import LogoWhite from "../../../assets/images/Logo_white.png";


export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate()
  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    setIsLoading(true);

    try {
      const res = await api.post("/login", {
        email,
        password,
      });
      localStorage.setItem("accessToken", res.data.accessToken);
    toast.success("Login Successful");
      navigate("/home");

    } catch (error) {
      console.error("Login error:", error);
    toast.error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoogleLogin() {
    // Uncomment for your OAuth:
    // window.location.href = "YOUR_BACKEND_URL/auth/google";
  toast.info("Google login coming soon!");
  }

  function handleRegister() {
    navigate("/register");
  }

  function handleForgotPassword() {
    // Uncomment for your navigation:
    // navigate("/forgot-password");
    alert("Navigate to forgot password page");
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Image - Visible on all screens */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071')",
            filter: "grayscale(100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black lg:bg-gradient-to-r lg:from-black/40 lg:via-black/60 lg:to-black" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Branding */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
          {/* Logo */}
              <div className="flex items-center gap-3 mb-6 lg:mb-15">
            
           <img
  src={LogoWhite}
  alt="Logo"
className="h-19 lg:h-29 object-contain"
/>

          </div>

              <h2 className="text-lg sm:text-xl lg:text-2xl font-light mb-2 lg:mb-4 leading-relaxed text-white">
  Capture moments.
  <br />
  Book sessions.
  <br />
  <span className="text-gray-400">Download beauty.</span>
</h2>

          <p className="text-sm sm:text-base lg:text-lg text-gray-400 mb-8 lg:mb-12 leading-relaxed max-w-md">
            Log in to access your photography sessions, download premium
            wallpapers, and manage your bookings.
          </p>

          {/* Features - Hidden on small mobile, visible from sm breakpoint */}
          <div className="hidden sm:flex flex-col gap-4 lg:gap-6">
            <div className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-zinc-800/80 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base lg:text-lg text-white">
                  Manage Bookings
                </h3>
                <p className="text-xs lg:text-sm text-gray-400">
                  View and reschedule your sessions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-zinc-800/80 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                <Image className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base lg:text-lg text-white">
                  Your Collections
                </h3>
                <p className="text-xs lg:text-sm text-gray-400">
                  Access your downloaded wallpapers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-zinc-800/80 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base lg:text-lg text-white">
                  Portfolio Access
                </h3>
                <p className="text-xs lg:text-sm text-gray-400">
                  View and share your photo gallery
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
            <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/10">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-sm sm:text-base text-gray-400">
                  Log in to your account
                </p>
              </div>

              <div className="space-y-4">
                {/* Email Input */}
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3.5 text-sm sm:text-base rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full p-3.5 text-sm sm:text-base rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300 pr-12"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Login Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleLogin}
                    disabled={isLoading || !email || !password}
                    className="w-full bg-white hover:bg-gray-200 text-black py-3.5 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Logging in...
                      </span>
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs sm:text-sm">
                    <span className="px-4 bg-zinc-900/80 text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Login Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full py-3.5 px-4 bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 rounded-lg text-white font-medium transition-all duration-300 flex items-center justify-center gap-3 text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </button>
                </div>

                <p className="text-gray-400 text-xs sm:text-sm text-center pt-2">
                  Don't have an account?{" "}
                  <span
                    onClick={handleRegister}
                    className="text-white cursor-pointer hover:underline font-medium hover:scale-105 inline-block transition-transform"
                  >
                    Sign up
                  </span>
                </p>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-gray-600 text-xs mt-6 px-4">
              Protected by industry-standard encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}