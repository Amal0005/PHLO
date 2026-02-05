import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Shield, Edit2, Camera, X } from "lucide-react";
import { AppDispatch } from "@/store/store";
import { updateUserProfile } from "@/store/slices/user/userSlice";
import { ROUTES } from "@/constants/routes";
import InputError from "@/compoents/reusable/inputErrors";
import { editProfileSchema } from "@/validation/userProfileSchema";
import Navbar from "@/compoents/reusable/userNavbar";
import { UserProfileService } from "@/services/user/userProfileServices";

interface ProfileForm {
  name: string;
  phone: string;
}

export default function UserProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    phone: "",
  });
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await UserProfileService.getProfile();
      if (response.success && response.user) {
        setProfileData(response.user);
        setForm({
          name: response.user.name || "",
          phone: response.user.phone || "",
        });
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to load profile";
      toast.error(message);
      navigate(ROUTES.USER.HOME);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const result = editProfileSchema.safeParse(form);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      if (errors.name) toast.error(errors.name[0]);
      if (errors.phone) toast.error(errors.phone[0]);
      return;
    }

    setIsSaving(true);

    try {
      const response = await UserProfileService.editProfile(form);
      if (response.success && response.user) {
        dispatch(updateUserProfile({
          name: response.user.name,
          phone: response.user.phone,
        }));
        setProfileData(response.user);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to update profile";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Dummy scrollToSection for navbar
  const scrollToSection = (id: string) => {
    console.log("Scroll to:", id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black relative overflow-hidden">
      {/* Navbar */}
      <Navbar scrollToSection={scrollToSection} />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* LEFT SIDE - Name & Tagline */}
            <div className="lg:col-span-4 space-y-4 order-2 lg:order-1 text-center lg:text-left">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white uppercase tracking-tight mb-2">
                  {profileData?.name?.split(' ')[0] || "User"}
                </h1>
                <p className="text-gray-500 text-sm tracking-wide">
                  Think more, design less.
                </p>
              </div>

              {!isEditing && (
                <div className="pt-8 space-y-3 flex justify-center lg:justify-start">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-white text-sm uppercase tracking-wider hover:text-gray-300 transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-full border border-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                      <Edit2 className="w-4 h-4" />
                    </span>
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            {/* CENTER - Profile Image */}
            <div className="lg:col-span-4 flex justify-center order-1 lg:order-2">
              <div className="relative group">
                {/* Main Profile Circle */}
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden shadow-2xl">
                  {/* Outer white ring */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-white rounded-full p-2">
                    {/* Inner image container */}
                    <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900 relative">
                      {profileData?.image ? (
                        <img
                          src={profileData.image}
                          alt={profileData.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-700 flex items-center justify-center">
                          <span className="text-white text-5xl sm:text-6xl lg:text-7xl font-bold">
                            {getInitials(profileData?.name || "U")}
                          </span>
                        </div>
                      )}
                      
                      {/* Camera Icon Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer">
                        <Camera className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Profile Info */}
            <div className="lg:col-span-4 space-y-6 order-3 text-center lg:text-right">
              {/* Profile Details */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Email</p>
                  <p className="text-base lg:text-lg text-gray-200 font-light break-all">{profileData?.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Phone</p>
                  <p className="text-base lg:text-lg text-gray-200 font-light">{profileData?.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Member Since</p>
                  <p className="text-base lg:text-lg text-gray-200 font-light">{formatDate(profileData?.createdAt)}</p>
                </div>
              </div>

              {/* Back to Home Button */}
              <div className="flex justify-center lg:justify-end pt-8">
                <button
                  onClick={() => navigate(ROUTES.USER.HOME)}
                  className="flex items-center gap-3 text-white text-sm uppercase tracking-wider hover:text-gray-300 transition-colors group"
                >
                  <span>Back to Home</span>
                  <span className="w-8 h-8 rounded-full border border-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    →
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info Panel - Only show when not editing */}
      {!isEditing && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-zinc-900/80 backdrop-blur-xl rounded-full px-6 sm:px-8 py-3 sm:py-4 border border-white/10 flex items-center gap-4 sm:gap-6 shadow-2xl">
            <div className="flex items-center gap-2 sm:gap-3">
              <Shield className="w-4 h-4 text-gray-400" />
              <span className="text-xs sm:text-sm text-gray-300 capitalize">{profileData?.role || "Member"}</span>
            </div>
            <div className="w-px h-4 sm:h-6 bg-white/20"></div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm text-gray-300 capitalize">{profileData?.status || "Active"}</span>
            </div>
            {profileData?.googleVerified && (
              <>
                <div className="w-px h-4 sm:h-6 bg-white/20"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs sm:text-sm text-gray-300">Verified</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* EDIT MODAL - Minimalist Style */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Close Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setIsEditing(false)}
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Edit Form */}
            <div className="text-center space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-light text-white uppercase tracking-tight mb-2">
                  Edit Profile
                </h2>
                <p className="text-gray-500 text-sm tracking-wide">
                  Update your information
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name Field */}
                <div className="space-y-3">
                  <label className="block text-sm text-gray-500 uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full bg-transparent border-b border-white/20 text-white text-center text-lg font-light py-3 px-4 outline-none focus:border-white transition-colors placeholder:text-gray-600"
                  />
                </div>

                {/* Phone Field */}
                <div className="space-y-3">
                  <label className="block text-sm text-gray-500 uppercase tracking-wider">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full bg-transparent border-b border-white/20 text-white text-center text-lg font-light py-3 px-4 outline-none focus:border-white transition-colors placeholder:text-gray-600"
                  />
                </div>

                {/* Save Button */}
                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center justify-center gap-3 text-white text-sm uppercase tracking-wider hover:text-gray-300 transition-colors group mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                    <span className="w-10 h-10 rounded-full border border-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                      {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "→"
                      )}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}