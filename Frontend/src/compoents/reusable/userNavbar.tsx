import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Menu, X } from "lucide-react";
import LogoWhite from "../../../public/Logo_white.png";
import type { AppDispatch } from "@/store/store";
import { clearUser } from "@/store/slices/user/userSlice";
import { clearUserAuth } from "@/store/slices/user/userAuthSlice";
import { ROUTES } from "@/constants/routes";
import { confirmActionToast } from "./confirmActionToast";
import { UserAuthService } from "@/services/user/UserAuthService";

interface NavbarProps {
  scrollToSection: (id: string) => void;
}

export default function Navbar({ scrollToSection }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

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
      await UserAuthService.logout();
      dispatch(clearUserAuth());
      dispatch(clearUser());
      navigate(ROUTES.USER.LOGIN, { replace: true });
    },
    "Logout"
  );
};

  const handleMenuClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/95 backdrop-blur-lg border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <img
            src={LogoWhite}
            alt="Logo"
            className="h-10 lg:h-19 object-contain"
          />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("packages")}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Packages
            </button>
            <button
              onClick={() => scrollToSection("wallpapers")}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Wallpapers
            </button>
            <button
              onClick={() => scrollToSection("creators")}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Creators
            </button>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-white font-semibold">
                  {user.name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Logout
                </button>
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-lg border-b border-white/10">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => handleMenuClick("packages")}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Packages
            </button>
            <button
              onClick={() => handleMenuClick("wallpapers")}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Wallpapers
            </button>
            <button
              onClick={() => handleMenuClick("creators")}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Creators
            </button>
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full px-6 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate(ROUTES.USER.LOGIN)}
                className="w-full px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}