import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Menu, X, LayoutDashboard, User, LogOut, ChevronDown, CreditCard, Wallet, MessageSquare } from "lucide-react";
import { useRef } from "react";
import LogoWhite from "../../../public/Logo_white.png";
import type { AppDispatch } from "@/store/store";
import { clearCreator } from "@/store/slices/creator/creatorSlice";
import { ROUTES } from "@/constants/routes";
import { CreatorAuthService } from "@/services/creator/creatorAuthService";
import { S3Media } from "@/components/reusable/s3Media";
import ConfirmModal from "@/components/reusable/ConfirmModal";
import { removeUser } from "@/store/slices/auth/authSlice";
import NotificationBell from "@/components/reusable/NotificationBell";
import { toast } from "react-toastify";

export default function CreatorNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const creator = useSelector((state: RootState) => state.creator.creator);
    const navigate = useNavigate();
    const location = useLocation();
    const [showCreatorDropdown, setShowCreatorDropdown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowCreatorDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getInitials = (name: string) => {
        if (!name) return "C";
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
        await CreatorAuthService.logout();
        toast.success("Logout successful");
        dispatch(removeUser());
        dispatch(clearCreator());
        navigate(ROUTES.CREATOR.LOGIN, { replace: true });
    };

    const isDashboardPage = location.pathname === ROUTES.CREATOR.DASHBOARD;

    const navLinks = [
        { name: "Dashboard", path: ROUTES.CREATOR.DASHBOARD, icon: LayoutDashboard, active: isDashboardPage },
        { name: "Subscription", path: ROUTES.CREATOR.SUBSCRIPTIONS, icon: CreditCard, active: location.pathname === ROUTES.CREATOR.SUBSCRIPTIONS },
        { name: "Revenue", path: ROUTES.CREATOR.WALLET, icon: Wallet, active: location.pathname === ROUTES.CREATOR.WALLET },
        { name: "Chat", path: ROUTES.CREATOR.CHAT, icon: MessageSquare, active: location.pathname === ROUTES.CREATOR.CHAT }
    ];

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
                    <div className="cursor-pointer" onClick={() => navigate(ROUTES.CREATOR.DASHBOARD)}>
                        <img
                            src={LogoWhite}
                            alt="Logo"
                            className="h-10 lg:h-12 object-contain"
                        />
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className={`flex items-center gap-2 text-sm font-medium transition-colors ${link.active ? "text-white" : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                <link.icon className="w-4 h-4" />
                                {link.name}
                            </button>
                        ))}

                        <NotificationBell />

                        {creator && (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowCreatorDropdown(!showCreatorDropdown)}
                                    className="flex items-center gap-3 p-1 px-2 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
                                >
                                    <div className="flex flex-col items-end">
                                        <span className="text-white text-sm font-semibold">
                                            {creator.fullName.split(' ')[0]}
                                        </span>
                                        <span className="text-gray-500 text-[10px] uppercase tracking-widest leading-none">
                                            Creator
                                        </span>
                                    </div>

                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-zinc-800 flex items-center justify-center">
                                        {creator.profilePhoto ? (
                                            creator.profilePhoto.startsWith('http') ? (
                                                <img src={creator.profilePhoto} alt={creator.fullName} className="w-full h-full object-cover" />
                                            ) : (
                                                <S3Media s3Key={creator.profilePhoto} className="w-full h-full object-cover" />
                                            )
                                        ) : (
                                            <span className="text-white text-[10px] font-bold">{getInitials(creator.fullName)}</span>
                                        )}
                                    </div>
                                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${showCreatorDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showCreatorDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1">
                                        <button
                                            onClick={() => {
                                                navigate(ROUTES.CREATOR.PROFILE);
                                                setShowCreatorDropdown(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                                        >
                                            <User size={16} />
                                            Profile
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowLogoutModal(true);
                                                setShowCreatorDropdown(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/5 transition-colors border-t border-white/5 text-left"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2 z-50"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-3xl transition-all duration-700 md:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          {/* Animated Slide-in Sidebar */}
          <div className={`absolute top-0 right-0 w-[85%] h-full bg-black/90 backdrop-blur-2xl border-l border-white/5 flex flex-col p-6 space-y-8 transition-transform duration-500 ease-out shadow-[-20px_0_100px_rgba(0,0,0,0.5)] ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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

            {/* Menu Header */}
            <div className="flex items-center justify-between flex-shrink-0">
              <div className="relative group">
                <div className="absolute inset-0 blur-xl opacity-20 group-hover:opacity-40 transition-opacity bg-gradient-to-r from-blue-500 to-white -z-10" />
                <img src={LogoWhite} alt="PHLO" className="h-8 object-contain" />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar -mx-6 px-6 space-y-8 pt-4 pb-12">
              {/* Creator Profile Card */}
              {creator && (
                <div
                  onClick={() => { navigate(ROUTES.CREATOR.PROFILE); setMobileMenuOpen(false); }}
                  className="p-5 rounded-[2rem] bg-white/[0.03] border border-white/10 flex items-center gap-4 group cursor-pointer transition-all hover:bg-white/[0.05] active:scale-[0.98] menu-item-animate"
                  style={{ animationDelay: '100ms' }}
                >
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/20 bg-zinc-800 flex items-center justify-center p-0.5 group-hover:border-white/40 transition-all">
                    {creator.profilePhoto ? (
                      <S3Media s3Key={creator.profilePhoto} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span className="text-white text-lg font-black">{getInitials(creator.fullName)}</span>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 truncate">
                    <span className="text-white font-bold leading-tight flex items-center gap-2">
                      {creator.fullName}
                      <ChevronDown size={12} className="-rotate-90 text-gray-600" />
                    </span>
                    <span className="text-gray-500 text-[10px] uppercase font-black tracking-widest truncate">{creator.email}</span>
                  </div>
                </div>
              )}

              {/* Navigation Grid */}
              <div className="grid grid-cols-2 gap-4 menu-item-animate" style={{ animationDelay: '200ms' }}>
                {navLinks.map((link, idx) => (
                  <button
                    key={link.path}
                    onClick={() => { navigate(link.path); setMobileMenuOpen(false); }}
                    className={`p-6 rounded-[2rem] border transition-all active:scale-95 text-left w-full flex flex-col items-start gap-4 ${
                      link.active 
                      ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                      : "bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                      link.active 
                      ? "bg-black/10 border-black/20 text-black" 
                      : "bg-blue-500/20 border-blue-500/30 text-blue-400"
                    }`}>
                      <link.icon size={20} />
                    </div>
                    <div className="space-y-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${link.active ? "text-black/40" : "text-zinc-500"}`}>Creator</span>
                      <p className={`text-sm font-black tracking-tight uppercase ${link.active ? "text-black" : "text-white"}`}>{link.name}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-4 menu-item-animate" style={{ animationDelay: '400ms' }}>
                <button
                  onClick={() => { setMobileMenuOpen(false); /* notifications handled separately */ }}
                  className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all flex flex-col gap-3 group items-center"
                >
                  <NotificationBell />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white">Alerts</span>
                </button>
              </div>
            </div>

            {/* Logout Section */}
            {creator && (
              <div className="flex-shrink-0 pt-4 pb-8 menu-item-animate" style={{ animationDelay: '500ms' }}>
                <button
                  onClick={() => { setShowLogoutModal(true); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-3 py-4 text-xs font-black uppercase tracking-[0.2em] text-rose-500 hover:text-white hover:bg-rose-500 rounded-2xl border border-rose-500/20 transition-all active:scale-95"
                >
                  <LogOut size={16} />
                  Exit Dashboard
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
                message="Are you sure you want to logout? You will need to sign in again to access your creator dashboard."
                confirmLabel="Logout"
                variant="danger"
                icon={<LogOut size={28} />}
            />
        </nav>
    );
}
