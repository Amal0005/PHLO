import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Menu, X, LayoutDashboard, User, LogOut } from "lucide-react";
import LogoWhite from "../../../public/Logo_white.png";
import type { AppDispatch } from "@/store/store";
import { clearCreator } from "@/store/slices/creator/creatorSlice";
import { clearCreatorAuth } from "@/store/slices/creator/creatorAuthSlice";
import { ROUTES } from "@/constants/routes";
import { confirmActionToast } from "./confirmActionToast";
import { CreatorAuthService } from "@/services/creator/creatorAuthService";
import { S3Media } from "./s3Media";

export default function CreatorNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const creator = useSelector((state: RootState) => state.creator.creator);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        confirmActionToast(
            "Are you sure you want to logout?",
            async () => {
                await CreatorAuthService.logout();
                dispatch(clearCreatorAuth());
                dispatch(clearCreator());
                navigate(ROUTES.CREATOR.LOGIN, { replace: true });
            },
            "Logout"
        );
    };

    const isProfilePage = location.pathname === ROUTES.CREATOR.PROFILE;
    const isDashboardPage = location.pathname === ROUTES.CREATOR.DASHBOARD;

    const navLinks = [
        { name: "Dashboard", path: ROUTES.CREATOR.DASHBOARD, icon: LayoutDashboard, active: isDashboardPage },
        { name: "Profile", path: ROUTES.CREATOR.PROFILE, icon: User, active: isProfilePage },
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
                            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
                                <div className="flex flex-col items-end">
                                    <span className="text-white text-sm font-semibold">
                                        {creator.fullName}
                                    </span>
                                    <span className="text-gray-500 text-xs uppercase tracking-widest">
                                        Creator
                                    </span>
                                </div>
                                {creator.profilePhoto ? (
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                                        {creator.profilePhoto.startsWith('http') ? (
                                            <img src={creator.profilePhoto} alt={creator.fullName} className="w-full h-full object-cover" />
                                        ) : (
                                            <S3Media s3Key={creator.profilePhoto} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                        {creator.fullName.charAt(0)}
                                    </div>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
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

                        <div className="pt-4 border-t border-white/10">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-4 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="text-lg font-light">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
