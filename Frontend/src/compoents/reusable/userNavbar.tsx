import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Menu, X, ChevronDown, User, LogOut, Heart } from "lucide-react";
import { useRef } from "react";
import LogoWhite from "../../../public/Logo_white.png";
import type { AppDispatch } from "@/store/store";
import { clearUser } from "@/store/slices/user/userSlice";
import { ROUTES } from "@/constants/routes";
import { UserAuthService } from "@/services/user/UserAuthService";
import { S3Service } from "@/services/s3Service";
import ConfirmModal from "./ConfirmModal";
import { removeUser } from "@/store/slices/auth/authSlice";

interface NavbarProps {
  scrollToSection?: (id: string) => void;
}

export default function Navbar({ scrollToSection }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [signedImageUrl, setSignedImageUrl] = useState<string | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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

  const handleMenuClick = (sectionId: string) => {
    if (scrollToSection) {
      scrollToSection(sectionId);
    }
    setMobileMenuOpen(false);
  };
  const isProfilePage = location.pathname === ROUTES.USER.PROFILE;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
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
              onClick={() => navigate(ROUTES.USER.PACKAGES)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Packages
            </button>
            <button
              onClick={() => navigate(ROUTES.USER.WALLPAPERS)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Wallpapers
            </button>
            <button
              onClick={() => navigate(ROUTES.USER.WISHLIST)}
              className="text-gray-300 hover:text-white transition-all hover:scale-110"
              title="Wishlist"
            >
              <Heart size={18} />
            </button>
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-lg border-b border-white/10">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => {
                navigate(ROUTES.USER.PACKAGES);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Packages
            </button>
            <button
              onClick={() => {
                navigate(ROUTES.USER.WALLPAPERS);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Wallpapers
            </button>
            <button
              onClick={() => {
                navigate(ROUTES.USER.WISHLIST);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Heart size={16} />
            </button>
            <button
              onClick={() => handleMenuClick("creators")}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Creators
            </button>
            {user ? (
              <>
                <div
                  onClick={() => {
                    navigate(ROUTES.USER.PROFILE);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 mb-2 border-b border-white/5 hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 bg-zinc-800 flex items-center justify-center">
                    {signedImageUrl ? (
                      <img src={signedImageUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-sm font-bold">{getInitials(user.name || "U")}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-semibold flex items-center gap-2">
                      {user.name || "User"}
                      <ChevronDown size={14} className="-rotate-90 text-gray-500" />
                    </span>
                    <span className="text-gray-500 text-xs truncate max-w-[200px]">{user.email}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full px-6 py-2 text-red-500 hover:text-red-400 font-semibold transition-colors"
                >
                  Logout
                </button>
              </>
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
    </nav>
  );
}