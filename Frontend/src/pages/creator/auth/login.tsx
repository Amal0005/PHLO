import { ChangeEvent, useState } from "react";
import { AxiosError } from "axios";
import { Camera, Mail, Lock, Eye, EyeOff, Sparkles, Image as ImageIcon, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { setCreator } from "@/store/slices/creator/creatorSlice";
import { toast } from "react-toastify";
import StatusModal from "./statusModal";
import { CreatorAuthService } from "@/services/creator/creatorAuthService";
import { setToken, setRole } from "@/store/slices/auth/authSlice";
import { ROUTES } from "@/constants/routes";
import { motion } from "framer-motion";

export default function CreatorLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [status, setStatus] = useState<{
    status: "pending" | "rejected" | null;
    message: string;
    reason?: string;
  } | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const responseData = await CreatorAuthService.login(form);

      if (responseData.status === "pending") {
        setStatus({
          status: "pending",
          message: responseData.message || "Your application is under review",
        });
        return;
      }

      if (responseData.status === "rejected") {
        setStatus({
          status: "rejected",
          message: responseData.message || "Your application was rejected",
          reason: responseData.reason,
        });
        return;
      }

      if (
        responseData.status === "approved" &&
        responseData.creator &&
        responseData.token
      ) {
        dispatch(setCreator({ ...responseData.creator, status: "approved" }));
        dispatch(setToken(responseData.token));
        dispatch(setRole("creator"));

        toast.success("Logged in successfully");
        navigate(ROUTES.CREATOR.DASHBOARD, { replace: true });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const data = error.response?.data as {
          status?: string;
          message?: string;
          reason?: string;
        };

        if (data?.status === "blocked") {
          toast.error(data.message || "Your account blocked by admin");
          return;
        }
        if (data?.status === "pending" || data?.status === "rejected") {
          setStatus({
            status: data.status as "pending" | "rejected",
            message: data.message || "Authentication failed",
            reason: data.reason,
          });
          return;
        }
        toast.error(data?.message || "Login failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden relative font-outfit">
      {/* Dynamic Background with Cinematic Layers */}
      <div className="fixed inset-0 z-0 opacity-60">
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale brightness-[0.7]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2074')" }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-700/5 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative z-10 w-full flex flex-col lg:flex-row">
        {/* Left Side: Auth Section */}
        <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12 min-h-screen">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <div className="bg-zinc-900/30 backdrop-blur-[0px] border border-white/5 rounded-[2.5rem] p-10 lg:p-12 shadow-[0_32px_120px_-15px_rgba(0,0,0,0.8)] relative group">
              {/* Subtle outer glow on card */}
              <div className="absolute -inset-0.5 bg-gradient-to-tr from-white/5 to-white/0 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-1000" />
              
              <div className="relative">
                <div className="flex flex-col items-center mb-10">
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-6 shadow-2xl backdrop-blur-3xl"
                  >
                    <Camera className="w-10 h-10 text-white stroke-[1.5]" />
                  </motion.div>
                  <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white mb-3">
                    Creator Portal
                  </h1>
                  <p className="text-zinc-400 text-center font-light leading-relaxed">
                    Step into your studio. Manage your art, clients, and growth.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-zinc-500 ml-4 uppercase tracking-widest">Email Address</label>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors duration-300">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full bg-white/[0.03] border border-white/5 text-white pl-13 pr-5 py-4 rounded-2xl outline-none focus:bg-white/[0.05] focus:border-white/20 focus:ring-[3px] focus:ring-white/5 transition-all duration-300 placeholder:text-zinc-600 font-light"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-end mr-2">
                       <label className="text-[13px] font-medium text-zinc-500 ml-4 uppercase tracking-widest">Passphrase</label>
                       <button
                        type="button"
                        onClick={() => navigate(ROUTES.CREATOR.FORGOT_PASSWORD)}
                        className="text-xs text-zinc-500 hover:text-white transition-colors"
                      >
                        Lost password?
                      </button>
                    </div>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors duration-300">
                        <Lock size={18} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        className="w-full bg-white/[0.03] border border-white/5 text-white pl-13 pr-14 py-4 rounded-2xl outline-none focus:bg-white/[0.05] focus:border-white/20 focus:ring-[3px] focus:ring-white/5 transition-all duration-300 placeholder:text-zinc-600 font-light"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors duration-300"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || !form.email || !form.password}
                    className="w-full relative group overflow-hidden bg-white text-black py-4.5 rounded-2xl font-bold tracking-tight text-lg shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <div className="absolute inset-0 bg-zinc-200 group-hover:scale-110 transition-transform duration-500" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                         <>
                          <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                          Entering Studio...
                         </>
                      ) : (
                        <>
                          Login to Studio <Sparkles size={18} className="text-zinc-500" />
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>

                <div className="mt-10 flex items-center justify-center gap-2">
                  <span className="text-zinc-500 text-sm">New here?</span>
                  <button
                    onClick={() => navigate(ROUTES.CREATOR.REGISTER)}
                    className="text-white text-sm font-semibold hover:underline decoration-white/30 underline-offset-8 transition-all"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 2 }}
              className="text-center text-zinc-600 text-[11px] mt-8 uppercase tracking-[0.2em]"
            >
              Enterprise Grade Encryption • Secure Studio Auth
            </motion.p>
          </motion.div>
        </div>

        {/* Right Side: Showcase section */}
        <div className="hidden lg:flex lg:w-[55%] flex-col justify-center p-20 xl:p-24 relative">
          <div className="relative z-10 space-y-12 max-w-2xl">
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h2 className="text-6xl xl:text-7xl font-black mb-8 leading-[1.05] tracking-tight">
                Craft your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-600">Legendary.</span>
              </h2>
              <p className="text-xl text-zinc-400 font-light leading-relaxed max-w-lg italic">
                "The eyes of a photographer see life beyond the lens. PHLO is where you give it a home."
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 mt-16">
              {[
                { 
                  icon: <ImageIcon size={28} />, 
                  title: "Digital Marketplace", 
                  desc: "Turn your captures into global digital assets with zero friction.",
                  color: "bg-zinc-800/80" 
                },
                { 
                  icon: <Wallet size={28} />, 
                  title: "Instant Settlement", 
                  desc: "Direct revenue shares directly to your studio wallet every day.",
                  color: "bg-white/5" 
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.2, duration: 0.8 }}
                  className="flex items-start gap-6 group cursor-default"
                >
                  <div className={`w-16 h-16 shrink-0 rounded-[1.2rem] ${item.color} backdrop-blur-xl border border-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-2xl`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform">{item.title}</h3>
                    <p className="text-zinc-500 leading-relaxed font-light">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <StatusModal
        isOpen={!!status}
        onClose={() => setStatus(null)}
        status={status?.status || null}
        message={status?.message || ""}
        reason={status?.reason}
      />
    </div>
  );
}
