import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Shield, CameraOff, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LogoWhite from "../../assets/images/Logo_white.png";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { loginUserSchema } from "@/validation/loginUserSchema";
import { AdminAuthService } from "@/services/admin/adminAuthService";
import { setAdmin } from "@/store/admin/adminSlice";
import { setAdminAuth } from "@/store/admin/adminAuthSlice";

interface loginForm {
  email: string;
  password: string;
}

export default function AdminLogin() {
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
    const data = await AdminAuthService.login(form);

dispatch(setAdmin(data.data.admin));
dispatch(setAdminAuth(data.data.accessToken));


console.log("skdlf", data);

    toast.success("Admin login successful");
    navigate("/admin/dashboard", { replace: true });
  } catch (error) {
    console.error("Admin login error:", error);
    toast.error("Invalid admin credentials");
  } finally {
    setIsLoading(false);
  }
}

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070')",
            filter: "grayscale(100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-4">
            <img
              src={LogoWhite}
              alt="Logo"
              className="h-12 sm:h-20 object-contain"
            />
          </div>

          <div className="bg-zinc-900/90 backdrop-blur-xl rounded-xl shadow-2xl p-5 sm:p-6 border border-white/10">
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                Admin Portal
              </h2>
              <p className="text-xs sm:text-sm text-gray-400">
                Secure administrative access
              </p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  className="w-full p-2.5 text-sm rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    className="w-full p-2.5 text-sm rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300 pr-10"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <CameraOff className="w-4 h-4" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

                    
              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoading || !form.email || !form.password}
                className="w-full bg-white hover:bg-gray-200 text-black py-2.5 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>

            {/* Security Notice */}
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" />
                Protected by enterprise-grade security
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-600 text-xs mt-4">
            Unauthorized access is prohibited and will be logged
          </p>
        </div>
      </div>
    </div>
  );
}