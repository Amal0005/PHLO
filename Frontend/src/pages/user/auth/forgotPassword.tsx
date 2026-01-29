import { useState } from "react";
import type { ChangeEvent } from "react";
import { Mail, ArrowLeft, X } from "lucide-react";
import { passwordService } from "@/services/user/passwordService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [showResetForm, setShowResetForm] = useState<boolean>(false);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleSendOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsLoading(true);
      const res = await passwordService.sendForgotPasswordOtp(email);

      toast.success(res.message || "OTP sent successfully");
      setShowOtpModal(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send OTP. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) return;

    try {
      setIsVerifying(true);
      await passwordService.verifyForgotOtp(email, otpValue);

      toast.success("OTP Verified");
      setShowOtpModal(false);
      setShowResetForm(true);
    } catch (error) {
      console.error(error);
      toast.error("Invalid OTP. Try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetPassword = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (passwords.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      setIsResetting(true);
      await passwordService.resetPassword(email, passwords.newPassword);

      toast.success("Password reset successful!");
      navigate(ROUTES.USER.LOGIN)
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset password");
    } finally {
      setIsResetting(false);
    }
  };

  if (showResetForm) {
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
          <div className="hidden lg:flex w-full lg:w-1/2 flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-light mb-2 lg:mb-4 leading-relaxed text-white">
              Create a new password.
              <br />
              Keep it secure.
              <br />
              <span className="text-gray-400">Keep it memorable.</span>
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-gray-400 mb-8 lg:mb-12 leading-relaxed max-w-md">
              Your password should be at least 8 characters long and contain a
              mix of letters and numbers.
            </p>
          </div>

          <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md">
              <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/10">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Reset Password
                  </h2>
                  <p className="text-sm sm:text-base text-gray-400">
                    Enter your new password
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New Password"
                      className="w-full p-3.5 text-sm sm:text-base rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300 pr-12"
                      value={passwords.newPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setPasswords({
                          ...passwords,
                          newPassword: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showNewPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="w-full p-3.5 text-sm sm:text-base rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300 pr-12"
                      value={passwords.confirmPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setPasswords({
                          ...passwords,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={
                        isResetting ||
                        !passwords.newPassword ||
                        !passwords.confirmPassword
                      }
                      className="w-full bg-white hover:bg-gray-200 text-black py-3.5 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isResetting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Resetting...
                        </span>
                      ) : (
                        "Reset Password"
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-gray-400 text-xs sm:text-sm text-center pt-4">
                  Remember your password?{" "}
                  <span
                    className="text-white cursor-pointer hover:underline font-medium"
                    onClick={() => navigate(ROUTES.USER.LOGIN)}
                  >
                    Back to Login
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
        <div className="hidden lg:flex w-full lg:w-1/2 flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-light mb-2 lg:mb-4 leading-relaxed text-white">
            Forgot your password?
            <br />
            Don't worry.
            <br />
            <span className="text-gray-400">We've got you covered.</span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-gray-400 mb-8 lg:mb-12 leading-relaxed max-w-md">
            Enter your email address and we'll send you a verification code to
            reset your password securely.
          </p>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
            <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/10">
              <button onClick={() => navigate(ROUTES.USER.LOGIN)} className="mb-4 text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>

              <div className="text-center mb-6 sm:mb-8">
                <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Forgot Password?
                </h2>
                <p className="text-sm sm:text-base text-gray-400">
                  Enter your email to receive a verification code
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3.5 text-sm sm:text-base rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                  />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading || !email}
                    className="w-full bg-white hover:bg-gray-200 text-black py-3.5 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      "Send Verification Code"
                    )}
                  </button>
                </div>
              </div>

              <p className="text-gray-400 text-xs sm:text-sm text-center pt-4">
                Remember your password?{" "}
                <span className="text-white cursor-pointer hover:underline font-medium" onClick={() => navigate(ROUTES.USER.LOGIN)}>
                  Back to Login
                </span>
              </p>
            </div>

            <p className="text-center text-gray-600 text-xs mt-6 px-4">
              We'll send a 6-digit verification code to your email
            </p>
          </div>
        </div>
      </div>

      {showOtpModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col lg:flex-row z-50">
          <div className="hidden lg:block w-full lg:w-1/2"></div>

          <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/10 w-full max-w-md relative">
              <button
                onClick={() => setShowOtpModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Verify Code
                </h3>
                <p className="text-sm text-gray-400">
                  Enter the 6-digit code sent to
                </p>
                <p className="text-sm text-white font-medium mt-1">{email}</p>
              </div>

              <div className="flex gap-2 justify-center mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleOtpChange(index, e.target.value)
                    }
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                      handleOtpKeyDown(index, e)
                    }
                    className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold rounded-lg bg-zinc-800/50 border border-zinc-700 text-white outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
                  />
                ))}
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isVerifying || otp.join("").length !== 6}
                className="w-full bg-white hover:bg-gray-200 text-black py-3.5 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98]"
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  "Verify Code"
                )}
              </button>

              <p className="text-center text-gray-400 text-xs sm:text-sm mt-4">
                Didn't receive the code?{" "}
                <button className="text-white hover:underline font-medium">
                  Resend
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
