import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Image, Calendar, Sparkles, CameraOff, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LogoWhite from "../../../assets/images/Logo_white.png";
import { loginUserSchema } from "../../../validation/loginUserSchema";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/user/userSlice";
import { authService } from "@/services/user/loginService";
import GoogleLoginButton from "../../../compoents/reusable/googleButton";
import { setAuth } from "@/store/tokenSlice";
import { AppDispatch } from "@/store/store";
import InputError from "@/compoents/reusable/inputErrors";

interface loginForm {
  email: string;
  password: string;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState<loginForm>({
    email: "",
    password: "",
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    const result = loginUserSchema.safeParse(form);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      if (errors.email) toast.error(errors.email[0]);
      if (errors.password) toast.error(errors.password[0]);
      return;
    }

    setIsLoading(true);

    try {
      const data = await authService.login(form);

      dispatch(setUser(data.user));

      dispatch(
        setAuth({
          token: data.accessToken,
          role: data.user.role,
        }),
      );

      toast.success("Login Successful");
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  }

  function handleRegister() {
    navigate("/register");
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
            Log in to access your photography sessions, download premium
            wallpapers, and manage your bookings.
          </p>

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
                <div>
                  <InputError
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="w-full p-3.5 text-sm sm:text-base rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300 pr-12"
                    value={form.password}
                    onChange={handleChange}
                  />
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

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleLogin}
                    disabled={isLoading || !form.email || !form.password}
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
                      const data = await authService.googleLogin(idToken);

                      dispatch(setUser(data.user));
                      dispatch(
                        setAuth({
                          token: data.accessToken,
                          role: data.user.role,
                        }),
                      );

                      navigate("/home");
                    } catch (err) {
                      toast.error("Google login failed");
                      console.log(err);
                    }
                  }}
                />

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

            <p className="text-center text-gray-600 text-xs mt-6 px-4">
              Protected by industry-standard encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
