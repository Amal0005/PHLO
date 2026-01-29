import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Mail, Shield, ArrowLeft, Image, Calendar } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../../axios/axiosConfig";
import LogoWhite from "../../../assets/images/Logo_white.png";
import { ROUTES } from "@/constants/routes";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  async function handleVerify(e: FormEvent) {
    e.preventDefault();

    setIsLoading(true);

    try {
      const res = await api.post("/verify-otp", { email, otp });
      localStorage.setItem("accessToken", res.data.accessToken);
      toast.success("OTP Verified Successfully!");
      navigate(ROUTES.USER.LOGIN);
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendOtp() {
    if (!canResend) return;

    try {
      await api.post("/resend-otp", { email });

      toast.info("OTP resent successfully!");
      setTimer(60);
      setCanResend(false);
    } catch (error) {
      console.error("Resend error:", error);
      toast.error("Failed to resend OTP. Please try again.");
    }
  }


  function handleBackToRegister() {
    navigate(ROUTES.USER.REGISTER);
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
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
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
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
            Join thousands of photography lovers. Book sessions and explore
            stunning wallpapers.
          </p>

          <div className="hidden sm:flex flex-col gap-4 lg:gap-6">
            <div className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-zinc-800/80 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base lg:text-lg text-white">
                  Secure Verification
                </h3>
                <p className="text-xs lg:text-sm text-gray-400">
                  Your account security is our priority
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-zinc-800/80 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base lg:text-lg text-white">
                  Easy Booking
                </h3>
                <p className="text-xs lg:text-sm text-gray-400">
                  Schedule photography sessions instantly
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-zinc-800/80 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                <Image className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base lg:text-lg text-white">
                  Premium Wallpapers
                </h3>
                <p className="text-xs lg:text-sm text-gray-400">
                  Download high-quality images for free
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Verify OTP Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
            <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/10">
              {/* Back Button */}
              <button
                type="button"
                onClick={handleBackToRegister}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm">Back to Register</span>
              </button>

              <div className="text-center mb-6 sm:mb-8">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Verify Your Email
                </h2>
                <p className="text-sm sm:text-base text-gray-400">
                  We've sent a verification code to
                </p>
              </div>

              {/* Email Display */}
              <div className="flex items-center justify-center gap-2 mb-6 p-3 rounded-lg bg-white/5 border border-white/10">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm sm:text-base text-white font-medium">
                  {email}
                </span>
              </div>

              <div className="space-y-4">
                {/* OTP Input */}
                <div>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="w-full p-3.5 text-sm sm:text-base rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300 text-center tracking-widest font-mono text-xl"
                    value={otp}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      setOtp(value);
                    }}
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                {/* Verify Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={isLoading || otp.length !== 6}
                    className="w-full bg-white hover:bg-gray-200 text-black py-3.5 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      "Verify Email"
                    )}
                  </button>
                </div>

                {/* Resend OTP */}
                <div className="text-center pt-2">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-sm text-white hover:underline font-medium transition-colors"
                    >
                      Resend Code
                    </button>
                  ) : (
                    <p className="text-sm text-gray-400">
                      Resend code in{" "}
                      <span className="text-white font-mono">{timer}s</span>
                    </p>
                  )}
                </div>

                {/* Help Text */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500 text-center leading-relaxed">
                    Didn't receive the code? Check your spam folder or click
                    "Resend Code" after the timer expires.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-gray-600 text-xs mt-6 px-4">
              This helps us keep your account secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
