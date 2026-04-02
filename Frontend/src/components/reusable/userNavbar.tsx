import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Menu, X, ChevronDown, User, LogOut, Bookmark, MessageCircle, Wallet, Image as ImageIcon, BookOpen } from "lucide-react";
import { useRef } from "react";
import LogoWhite from "../../../public/Logo_white.png";
import type { AppDispatch } from "@/store/store";
import { clearUser } from "@/store/slices/user/userSlice";
import { ROUTES } from "@/constants/routes";
import { UserAuthService } from "@/services/user/UserAuthService";
import { S3Service } from "@/services/s3Service";
import ConfirmModal from "@/components/reusable/ConfirmModal";
import { removeUser } from "@/store/slices/auth/authSlice";
import NotificationBell from "@/components/reusable/NotificationBell";


export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  const [signedImageUrl, setSignedImageUrl] = useState<string | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMobileNotifications, setShowMobileNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const signImage = async () => {
      if (user?.image) {
        if (user.image.startsWith("http")) {
          setSignedImageUrl(user.image);
        } else {
          try {
            const url = await S3Service.getViewUrl(user.image);
            setSignedImageUrl(url);
          } catch (error) {
            console.error("Error signing user image:", error);
            setSignedImageUrl(null);
          }
        }
      } else {
        setSignedImageUrl(null);
      }
    };
    signImage();
  }, [user?.image]);

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await UserAuthService.logout();
    dispatch(removeUser());
    dispatch(clearUser());
    navigate(ROUTES.USER.LOGIN, { replace: true });
  };



  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? "bg-black/95 backdrop-blur-lg border-b border-white/10"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button onClick={() => navigate(ROUTES.USER.HOME)} className="cursor-pointer">
            <img
              src={LogoWhite}
              alt="Logo"
              className="h-10 lg:h-19 object-contain"
            />
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate(ROUTES.USER.PACKAGES)}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Packages
            </button>
            <button
              onClick={() => navigate(ROUTES.USER.WALLPAPERS)}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Wallpapers
            </button>
            <button
              onClick={() => navigate(ROUTES.USER.WISHLIST)}
              className="text-gray-300 hover:text-white transition-all hover:scale-110"
              title="Wishlist"
            >
              <Bookmark size={18} />
            </button>
            <button
              onClick={() => navigate(ROUTES.USER.CHAT)}
              className="text-gray-300 hover:text-white transition-all hover:scale-110"
              title="Chat"
            >
              <MessageCircle size={18} />
            </button>
            <NotificationBell />
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-3 p-1 px-2 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-zinc-800 flex items-center justify-center">
                    {signedImageUrl ? (
                      <img src={signedImageUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-xs font-bold">{getInitials(user.name || "U")}</span>
                    )}
                  </div>
                  <span className="text-white font-medium">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1">
                    <button
                      onClick={() => {
                        navigate(ROUTES.USER.PROFILE);
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                    >
                      <User size={16} />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate(ROUTES.USER.WALLET);
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                    >
                      <Wallet size={16} />
                      Wallet
                    </button>
                    <button
                      onClick={() => {
                        setShowLogoutModal(true);
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/5 transition-colors border-t border-white/5 text-left"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all hover:scale-105"
                onClick={() => navigate(ROUTES.USER.LOGIN)}
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-3xl transition-all duration-700 md:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Animated Slide-in Sidebar */}
        <div className={`absolute top-0 right-0 w-[85%] h-full bg-black/90 backdrop-blur-2xl border-l border-white/5 flex flex-col p-6 space-y-10 transition-transform duration-500 ease-out shadow-[-20px_0_100px_rgba(0,0,0,0.5)] ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes slideInItem {
              from { opacity: 0; transform: translateX(20px); }
              to { opacity: 1; transform: translateX(0); }
            }
            .menu-item-animate {
              animation: slideInItem 0.5s ease-out forwards;
              opacity: 0;
            }
          `}} />

          {/* Menu Header with Brand Glow */}
          <div className="flex items-center justify-between">
            <div className="relative group">
              <div className="absolute inset-0 blur-xl opacity-20 group-hover:opacity-40 transition-opacity bg-gradient-to-r from-blue-500 to-white -z-10" />
              <img src={LogoWhite} alt="PHLO" className="h-8 object-contain" />
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Profile Card (Premium Glass) */}
          {user ? (
            <div
              onClick={() => { navigate(ROUTES.USER.PROFILE); setMobileMenuOpen(false); }}
              className="p-5 rounded-[2rem] bg-white/[0.03] border border-white/10 flex items-center gap-4 group cursor-pointer transition-all hover:bg-white/[0.05] active:scale-[0.98] menu-item-animate"
              style={{ animationDelay: '100ms' }}
            >
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/20 bg-zinc-800 flex items-center justify-center p-0.5 group-hover:border-white/40 transition-all">
                {signedImageUrl ? (
                  <img src={signedImageUrl} alt={user.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span className="text-white text-lg font-black">{getInitials(user.name || "U")}</span>
                )}
              </div>
              <div className="flex flex-col flex-1 truncate">
                <span className="text-white font-bold leading-tight flex items-center gap-2">
                  {user.name || "User"}
                  <ChevronDown size={12} className="-rotate-90 text-gray-600" />
                </span>
                <span className="text-gray-500 text-[10px] uppercase font-black tracking-widest truncate">{user.email}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate(ROUTES.USER.LOGIN)}
              className="w-full py-5 rounded-[2rem] bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95 menu-item-animate"
              style={{ animationDelay: '100ms' }}
            >
              Access Account
            </button>
          )}

          {/* Visual Navigation Cards */}
          <div className="grid grid-cols-2 gap-4 menu-item-animate" style={{ animationDelay: '200ms' }}>
            <button
              onClick={() => { navigate(ROUTES.USER.PACKAGES); setMobileMenuOpen(false); }}
              className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 flex flex-col items-start gap-4 group transition-all hover:bg-white/[0.05] active:scale-95 text-left w-full"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:rotate-6 transition-all">
                <BookOpen size={20} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Service</span>
                <p className="text-sm font-black text-white tracking-tight uppercase">Packages</p>
              </div>
            </button>
            <button
              onClick={() => { navigate(ROUTES.USER.WALLPAPERS); setMobileMenuOpen(false); }}
              className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 flex flex-col items-start gap-4 group transition-all hover:bg-white/[0.05] active:scale-95 text-left w-full"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:-rotate-6 transition-all">
                <ImageIcon size={20} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Media</span>
                <p className="text-sm font-black text-white tracking-tight uppercase">Wallpapers</p>
              </div>
            </button>
          </div>

          {/* Secondary Utility Icons (Grid Style) */}
          <div className="grid grid-cols-2 gap-4 menu-item-animate" style={{ animationDelay: '400ms' }}>
            <button
              onClick={() => { navigate(ROUTES.USER.WISHLIST); setMobileMenuOpen(false); }}
              className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all flex flex-col gap-3 group items-center"
            >
              <Bookmark size={20} className="text-zinc-600 group-hover:text-white group-hover:scale-110 transition-all" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white">Wishlist</span>
            </button>
            <button
              onClick={() => { navigate(ROUTES.USER.CHAT); setMobileMenuOpen(false); }}
              className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all flex flex-col gap-3 group items-center"
            >
              <MessageCircle size={20} className="text-zinc-600 group-hover:text-white group-hover:scale-110 transition-all" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white">Chat</span>
            </button>
            <button
              onClick={() => { navigate(ROUTES.USER.WALLET); setMobileMenuOpen(false); }}
              className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all flex flex-col gap-3 group items-center"
            >
              <Wallet size={20} className="text-zinc-600 group-hover:text-white group-hover:scale-110 transition-all" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white">Wallet</span>
            </button>
            <button
              onClick={() => setShowMobileNotifications(true)}
              className="p-5 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-3 group items-center transition-all hover:bg-white/10 active:scale-95"
            >
              <NotificationBell onTrigger={() => setShowMobileNotifications(true)} />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white">Alerts</span>
            </button>
          </div>

          {/* Logout Section at Bottom */}
          {user && (
            <div className="mt-auto menu-item-animate" style={{ animationDelay: '500ms' }}>
              <button
                onClick={() => { setShowLogoutModal(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-3 py-4 text-xs font-black uppercase tracking-[0.2em] text-rose-500 hover:text-white hover:bg-rose-500 rounded-2xl border border-rose-500/20 transition-all active:scale-95"
              >
                <LogOut size={16} />
                Terminate Session
              </button>
            </div>
          )}
        </div>
      </div>
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        message="Are you sure you want to logout? You will need to sign in again to access your account."
        confirmLabel="Logout"
        variant="danger"
        icon={<LogOut size={28} />}
      />

      {/* Full-Screen Mobile Notifications Overlay (Solves transform trapping) */}
      <div className={`fixed inset-0 z-[100] bg-black backdrop-blur-3xl transition-all duration-500 md:hidden ${showMobileNotifications ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-20'}`}>
        <div className="h-full flex flex-col p-6 space-y-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowMobileNotifications(false)}
              className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white active:scale-95 transition-all"
            >
              <ChevronDown size={20} className="rotate-90" />
            </button>
            <div className="flex-1">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Notifications</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Recent Activity</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar -mx-6 px-6">
            <NotificationBell
              onTrigger={() => { }}
              onClose={() => {
                setShowMobileNotifications(false);
                setMobileMenuOpen(false);
              }}
              forceOpen={showMobileNotifications}
              mobileMode={true}
            />
          </div>

          <button
            onClick={() => setShowMobileNotifications(false)}
            className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 active:scale-95 transition-all"
          >
            Close Alerts
          </button>
        </div>
      </div>
    </nav>
  );
}
