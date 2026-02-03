import { useState } from "react";
import type { ChangeEvent, MouseEvent } from "react";
import { Image, Calendar, Sparkles, CameraOff, Camera } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LogoWhite from "../../../assets/images/Logo_white.png";
import { registerUserSchema } from "../../../validation/registerUserSchema";
import GoogleLoginButton from "@/compoents/reusable/googleButton";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/user/userSlice";
import { setUserAuth } from "@/store/slices/user/userAuthSlice";
import { ROUTES } from "@/constants/routes";
import { UserAuthService } from "@/services/user/UserAuthService";

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string>("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSignup(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!acceptedTerms) {
      toast.warn("Please accept the terms and privacy policy to continue");
      return;
    }
    const result = registerUserSchema.safeParse(form);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      if (errors.name) toast.error(errors.name[0]);
      if (errors.email) toast.error(errors.email[0]);
      if (errors.phone) toast.error(errors.phone[0]);
      if (errors.password) toast.error(errors.password[0]);
      if (errors.confirmPassword)toast.error(errors.confirmPassword[0]);
      return;
    }

    setIsLoading(true);

    const { confirmPassword, ...submitData } = form;
    try {
      await UserAuthService.register(submitData)
      toast.success("OTP sent successfully!");

      navigate(ROUTES.USER.VERIFY_OTP, { state: { email: form.email } });

      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error: any) {
      console.error("Registration error:", error);

      const message =
        error?.response?.data?.message ||
        "Registration failed. Please try again.";

      toast.error(message);
      setIsLoading(false);
    }
  }

  function handleLogin() {
    navigate(ROUTES.USER.LOGIN, { replace: true });
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

            <div className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-zinc-800/80 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base lg:text-lg text-white">
                  AI Enhancement
                </h3>
                <p className="text-xs lg:text-sm text-gray-400">
                  Enhance your photos with AI magic
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-lg">
            <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-4 sm:p-6 border border-white/10">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Create Account
                </h2>
                <p className="text-sm sm:text-base text-gray-400">
                  Start your photography journey today
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 pt-5 pb-2 text-sm sm:text-base rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white outline-none focus:bg-white/10 focus:border-white/30 transition-all duration-300"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField("")}
                    required
                  />
                  <label
                    className={`absolute left-3.5 pointer-events-none transition-all duration-300 ${form.name || focusedField === "name"
                      ? "top-1.5 text-[11px] text-gray-400"
                      : "top-1/2 -translate-y-1/2 text-sm sm:text-base text-gray-500"
                      }`}
                  >
                    Full Name
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 pt-5 pb-2 text-sm sm:text-base rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white outline-none focus:bg-white/10 focus:border-white/30 transition-all duration-300"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    required
                  />
                  <label
                    className={`absolute left-3.5 pointer-events-none transition-all duration-300 ${form.email || focusedField === "email"
                      ? "top-1.5 text-[11px] text-gray-400"
                      : "top-1/2 -translate-y-1/2 text-sm sm:text-base text-gray-500"
                      }`}
                  >
                    Email
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="phone"
                    className="w-full px-4 pt-5 pb-2 text-sm sm:text-base rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white outline-none focus:bg-white/10 focus:border-white/30 transition-all duration-300"
                    value={form.phone}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField("")}
                    required
                  />
                  <label
                    className={`absolute left-3.5 pointer-events-none transition-all duration-300 ${form.phone || focusedField === "phone"
                      ? "top-1.5 text-[11px] text-gray-400"
                      : "top-1/2 -translate-y-1/2 text-sm sm:text-base text-gray-500"
                      }`}
                  >
                    Phone
                  </label>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full px-4 pt-5 pb-2 pr-12 text-sm sm:text-base rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white outline-none focus:bg-white/10 focus:border-white/30 transition-all duration-300"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    required
                  />
                  <label
                    className={`absolute left-3.5 pointer-events-none transition-all duration-300 ${form.password || focusedField === "password"
                      ? "top-1.5 text-[11px] text-gray-400"
                      : "top-1/2 -translate-y-1/2 text-sm sm:text-base text-gray-500"
                      }`}
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <CameraOff className="w-5 h-5" />
                    ) : (
                      <Camera className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="w-full px-4 pt-5 pb-2 pr-12 text-sm sm:text-base rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white outline-none focus:bg-white/10 focus:border-white/30 transition-all duration-300"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField("")}
                    required
                  />
                  <label
                    className={`absolute left-3.5 pointer-events-none transition-all duration-300 ${form.confirmPassword || focusedField === "confirmPassword"
                      ? "top-1.5 text-[11px] text-gray-400"
                      : "top-1/2 -translate-y-1/2 text-sm sm:text-base text-gray-500"
                      }`}
                  >
                    Confirm Password
                  </label>
                </div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setAcceptedTerms(e.target.checked)
                    }
                    className="mt-1 w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-white focus:ring-white focus:ring-1 cursor-pointer flex-shrink-0 accent-white"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs sm:text-sm text-gray-400 cursor-pointer leading-relaxed"
                  >
                    I agree to the{" "}
                    <span className="text-white hover:underline cursor-pointer">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="text-white hover:underline cursor-pointer">
                      Privacy Policy
                    </span>
                  </label>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleSignup}
                    disabled={!acceptedTerms || isLoading}
                    className="w-full bg-white hover:bg-gray-200 text-black py-3.5 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Creating account...
                      </span>
                    ) : (
                      "Register"
                    )}
                  </button>
                </div>

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

                        <GoogleLoginButton
                  onSuccess={async (idToken: string) => {
                    try {
                      const response = await UserAuthService.googleLogin(idToken);


                      if (response?.accessToken && response?.user) {
                        dispatch(setUser(response.user));
                        dispatch(setUserAuth(response.accessToken));
                        navigate(ROUTES.USER.HOME, { replace: true });
                      } else {
                        console.error("Google Login: Missing token/user", response);
                        toast.error("Google login failed: Invalid response");
                      }
                    } catch (err) {
                      toast.error("Google login failed");
                      console.log(err);
                    }
                  }}
                />

                <p className="text-gray-400 text-xs sm:text-sm text-center pt-2">
                  Already have an account?{" "}
                  <span
                    onClick={handleLogin}
                    className="text-white cursor-pointer hover:underline font-medium hover:scale-105 inline-block transition-transform"
                  >
                    Login
                  </span>
                </p>
              </div>
            </div>

            <p className="text-center text-gray-600 text-xs mt-6 px-4">
              By creating an account, you agree to our terms and privacy policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
