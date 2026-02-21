import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Menu, X, LayoutDashboard, User, LogOut, ChevronDown, CreditCard } from "lucide-react";
import { useRef } from "react";
import LogoWhite from "../../../public/Logo_white.png";
import type { AppDispatch } from "@/store/store";
import { clearCreator } from "@/store/slices/creator/creatorSlice";
import { ROUTES } from "@/constants/routes";
import { CreatorAuthService } from "@/services/creator/creatorAuthService";
import { S3Media } from "./s3Media";
import ConfirmModal from "./ConfirmModal";
import { removeUser } from "@/store/slices/auth/authSlice";

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
        dispatch(removeUser());
        dispatch(clearCreator());
        navigate(ROUTES.CREATOR.LOGIN, { replace: true });
    };

    const isDashboardPage = location.pathname === ROUTES.CREATOR.DASHBOARD;

    const navLinks = [
        { name: "Dashboard", path: ROUTES.CREATOR.DASHBOARD, icon: LayoutDashboard, active: isDashboardPage },
        { name: "Subscription", path: ROUTES.CREATOR.SUBSCRIPTIONS, icon: CreditCard, active: location.pathname === ROUTES.CREATOR.SUBSCRIPTIONS }
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
                        className="md:hidden text-white p-2"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-black/98 backdrop-blur-xl border-b border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="px-4 py-6 space-y-4">
                        {creator && (
                            <>
                                <div
                                    onClick={() => {
                                        navigate(ROUTES.CREATOR.PROFILE);
                                        setMobileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-4 px-4 py-4 mb-2 border-b border-white/5 hover:bg-white/5 rounded-2xl cursor-pointer transition-all"
                                >
                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 bg-zinc-800 flex items-center justify-center">
                                        {creator.profilePhoto ? (
                                            creator.profilePhoto.startsWith('http') ? (
                                                <img src={creator.profilePhoto} alt={creator.fullName} className="w-full h-full object-cover" />
                                            ) : (
                                                <S3Media s3Key={creator.profilePhoto} className="w-full h-full object-cover" />
                                            )
                                        ) : (
                                            <span className="text-white text-lg font-bold">{getInitials(creator.fullName)}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-semibold flex items-center gap-2">
                                            {creator.fullName}
                                            <ChevronDown size={14} className="-rotate-90 text-gray-500" />
                                        </span>
                                        <span className="text-gray-500 text-xs tracking-widest uppercase truncate max-w-[200px]">{creator.email}</span>
                                    </div>
                                </div>

                                {navLinks.map((link) => (
                                    <button
                                        key={link.path}
                                        onClick={() => {
                                            navigate(link.path);
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all ${link.active
                                            ? "bg-white/10 text-white"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        <link.icon className="w-5 h-5" />
                                        <span className="text-lg font-light">{link.name}</span>
                                    </button>
                                ))}

                                <button
                                    onClick={() => {
                                        setShowLogoutModal(true);
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full px-6 py-3 text-red-500 hover:text-red-400 font-semibold transition-colors flex items-center gap-3"
                                >
                                    <LogOut size={20} />
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
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
