import { ChangeEvent, useState } from "react";
import { Camera, CameraOff, Image, Users, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/axios/axiosConfig";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";

import { setCreator } from "@/store/creator/creatorSlice";
import { setAuth } from "@/store/tokenSlice";
import { toast } from "react-toastify";

export default function CreatorLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const dispatch = useDispatch<AppDispatch>();


  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
async function handleLogin(e: React.FormEvent) {
  e.preventDefault();

  try {
    setIsLoading(true);

    const res = await api.post("/creator/login", {
      email: form.email,
      password: form.password,
    });

    dispatch(setCreator(res.data.creator));
    dispatch(
      setAuth({
        token: res.data.token,
        role: "creator",
      })
    );
toast.success("Logged in")
    navigate("/creator/dashboard");
  } catch (error:any) {
    console.error(error);
    toast.error(error.message);
  } finally {
    setIsLoading(false);
  }
}


  const navigate=useNavigate()
  

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2074')",
            filter: "grayscale(100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black lg:bg-gradient-to-l lg:from-black/40 lg:via-black/60 lg:to-black" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
            <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/10">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Creator Login
                </h2>
                <p className="text-sm sm:text-base text-gray-400">
                  Access your photography dashboard
                </p>
              </div>

              <div className="space-y-4">
                 <form action="" onSubmit={handleLogin}>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full p-3.5 text-sm sm:text-base rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
<br />
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
                    className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading || !form.email || !form.password}
                    className="w-full bg-white hover:bg-gray-200 text-black py-3.5 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Logging in...
                      </span>
                    ) : (
                      "Login to Dashboard"
                    )}
                  </button>
                </div>
                  </form>

                <p className="text-gray-400 text-xs sm:text-sm text-center pt-2">
                  Haven't Account? {" "}
                  <span onClick={() => navigate("/creator/register")} className="text-white cursor-pointer hover:underline font-medium hover:scale-105 inline-block transition-transform">
                    Signup
                  </span>
                </p>
              </div>
            </div>

            <p className="text-center text-gray-600 text-xs mt-6 px-4">
              Secure creator authentication
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-light mb-2 lg:mb-4 leading-relaxed text-white">
            Manage your craft.
            <br />
            Connect with clients.
            <br />
            <span className="text-gray-400">Showcase your art.</span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-gray-400 mb-8 lg:mb-12 leading-relaxed max-w-md">
            Access your creator dashboard to manage bookings, upload galleries, and grow your photography business.
          </p>

          <div className="hidden sm:flex flex-col gap-4 lg:gap-6">
            <div className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-zinc-800/80 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base lg:text-lg text-white">
                  Client Management
                </h3>
                <p className="text-xs lg:text-sm text-gray-400">
                  Track sessions and communicate
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-zinc-800/80 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                <Image className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base lg:text-lg text-white">
                  Gallery Upload
                </h3>
                <p className="text-xs lg:text-sm text-gray-400">
                  Share photos with your clients
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-zinc-800/80 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                <Award className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base lg:text-lg text-white">
                  Portfolio Builder
                </h3>
                <p className="text-xs lg:text-sm text-gray-400">
                  Showcase your best work
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}