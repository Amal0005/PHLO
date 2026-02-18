import { useState, useEffect, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Shield, Edit2, Camera, Lock } from "lucide-react";
import { AppDispatch } from "@/store/store";
import { updateUserProfile } from "@/store/slices/user/userSlice";
import { ROUTES } from "@/constants/routes";
import { changePasswordSchema, editProfileSchema } from "@/validation/userProfileSchema";
import Navbar from "@/compoents/reusable/userNavbar";
import { UserProfileService } from "@/services/user/userProfileServices";
import { EditUserProfile } from "./components/editUserProfile";
import { EditUserPassword } from "./components/editUserPassword";
import { ViewProfileImage } from "./components/viewProfileImage";
import OtpVerificationModal from "@/compoents/reusable/OtpVerificationModal";

import { User } from "@/interface/admin/userInterface";

interface ProfileForm {
  name: string;
  phone: string;
  email: string;
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
    email: ""
  });
  const [profileData, setProfileData] = useState<User | null>(null);
  const [isViewingImage, setIsViewingImage] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [editProfileErrors, setEditProfileErrors] = useState<Record<string, string[]>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string[]>>({});

  // Email change OTP flow
  const [isVerifyingEmail, setIsVerifyingEmail] = useState<boolean>(false);
  const [pendingForm, setPendingForm] = useState<ProfileForm | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      setIsLoading(true);
      const { uploadUrl, publicUrl } = await UserProfileService.getUploadUrl(file.type, "user-profiles");

      await UserProfileService.uploadToS3(uploadUrl, file);
      // Update backend with Key
      const response = await UserProfileService.editProfile({ image: publicUrl });

      if (response.success && response.user) {
        // Get the viewable link properly
        const viewUrl = await UserProfileService.getViewUrl(response.user.image || publicUrl);

        // Update state with the VIEWABLE link
        setProfileData({ ...response.user, image: viewUrl });

        dispatch(updateUserProfile({
          name: response.user.name,
          phone: response.user.phone,
          image: response.user.image,
        }));
        toast.success("Profile photo updated!");
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await UserProfileService.getProfile();

        if (response.success && response.user) {
          let userData = response.user;

          if (userData.image && !userData.image.startsWith("http")) {
            try {
              const viewUrl = await UserProfileService.getViewUrl(userData.image);
              userData = { ...userData, image: viewUrl };
            } catch (err) {
              console.error("Failed to sign image url", err);
            }
          }
          setProfileData(userData);
          setForm({
            name: String(userData.name ?? ""),
            phone: String(userData.phone ?? ""),
            email: String(userData.email ?? "")
          });
        }
      } catch (error: unknown) {
        const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to load profile";
        toast.error(message);
        navigate(ROUTES.USER.HOME);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordErrors({});
    const result = changePasswordSchema.safeParse(passwordForm);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setPasswordErrors(errors);
      return;
    }
    setIsSaving(true);
    try {
      const response = await UserProfileService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      if (response.success) {
        setIsChangingPassword(false);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast.success("Password updated successfully!");
      }
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update password";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Only allow alphabets and spaces for name
    if (name === "name" && value !== "" && !/^[a-zA-Z\s]*$/.test(value)) {
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEditProfileErrors({});

    const result = editProfileSchema.safeParse(form);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setEditProfileErrors(errors);
      return;
    }

    const emailChanged = form.email.trim().toLowerCase() !== profileData?.email?.trim().toLowerCase();

    if (emailChanged) {
      setIsSaving(true);
      try {
        // Step 1: Check if the new email is already taken — show error inline before sending OTP
        const checkRes = await UserProfileService.checkEmailAvailability(form.email);
        if (!checkRes.success) {
          setEditProfileErrors({ email: [checkRes.message] });
          return;
        }
        // Step 2: Email is available — send OTP
        await UserProfileService.sendEmailChangeOtp(form.email);
        setPendingForm(form);
        setIsVerifyingEmail(true);
        toast.info(`OTP sent to ${form.email}`);
      } catch (error: unknown) {
        const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to send OTP";
        if (message.toLowerCase().includes("email") || message.toLowerCase().includes("already")) {
          setEditProfileErrors({ email: [message] });
        } else {
          toast.error(message);
        }
      } finally {
        setIsSaving(false);
      }
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
        setProfileData({ ...response.user, image: profileData?.image });
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update profile";
      // Show email-specific error inline
      if (message.toLowerCase().includes("email") || message.toLowerCase().includes("already")) {
        setEditProfileErrors({ email: [message] });
      } else {
        toast.error(message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmailOtpVerify = async (otp: string) => {
    if (!pendingForm) return;
    // Verify OTP first
    const verifyRes = await UserProfileService.verifyEmailChangeOtp(pendingForm.email, otp);
    if (!verifyRes.success) {
      throw new Error(verifyRes.message || "Invalid OTP");
    }
    // OTP verified — now save the profile with the new email
    const response = await UserProfileService.editProfile(pendingForm);
    if (response.success && response.user) {
      dispatch(updateUserProfile({
        name: response.user.name,
        phone: response.user.phone,
      }));
      setProfileData({ ...response.user, image: profileData?.image });
      setIsVerifyingEmail(false);
      setPendingForm(null);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    }
  };

  const handleEmailOtpResend = async () => {
    if (!pendingForm) return;
    await UserProfileService.sendEmailChangeOtp(pendingForm.email);
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
                <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-white text-sm uppercase tracking-wider hover:text-gray-300 transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-full border border-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                      <Edit2 className="w-4 h-4" />
                    </span>
                    Edit Profile
                  </button>
                  {!profileData?.googleVerified && (
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="flex items-center gap-2 text-white text-sm uppercase tracking-wider hover:text-gray-300 transition-colors group"
                    >
                      <span className="w-8 h-8 rounded-full border border-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                        <Lock className="w-4 h-4" />
                      </span>
                      Change Password
                    </button>
                  )}
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
                      <div
                        className="w-full h-full cursor-pointer"
                        onClick={() => {
                          if (profileData?.image) setIsViewingImage(true);
                        }}
                      >
                        {profileData?.image ? (
                          <img
                            src={profileData.image}
                            alt={profileData.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-700 flex items-center justify-center">
                            <span className="text-white text-5xl sm:text-6xl lg:text-7xl font-bold">
                              {getInitials(profileData?.name || "U")}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Camera Icon Overlay */}
                      <div
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="pointer-events-auto p-4 rounded-full hover:bg-white/10 transition-colors"
                          title="Change Profile Photo"
                        >
                          <Camera className="w-10 h-10 text-white" />
                        </button>
                        {/* Hidden Input */}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Profile Info */}
            <div className="lg:col-span-4 space-y-10 order-3 text-center lg:text-right">
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

      {/* EDIT MODAL */}
      <EditUserProfile
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
          setEditProfileErrors({});
        }}
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isSaving={isSaving}
        errors={editProfileErrors}
      />

      {/* EMAIL CHANGE OTP MODAL */}
      <OtpVerificationModal
        isOpen={isVerifyingEmail}
        email={pendingForm?.email || ""}
        onClose={() => {
          setIsVerifyingEmail(false);
          setPendingForm(null);
        }}
        onVerify={handleEmailOtpVerify}
        onResend={handleEmailOtpResend}
        title="Verify New Email"
        description="Enter the 6-digit code sent to your new email"
      />

      {/* PASSWORD CHANGE MODAL */}
      <EditUserPassword
        isOpen={isChangingPassword}
        onClose={() => setIsChangingPassword(false)}
        passwordForm={passwordForm}
        handlePasswordChange={handlePasswordChange}
        handlePasswordSubmit={handlePasswordSubmit}
        isSaving={isSaving}
        errors={passwordErrors}
      />

      <ViewProfileImage
        isOpen={isViewingImage}
        onClose={() => setIsViewingImage(false)}
        imageUrl={profileData?.image || null}
      />

    </div>
  );
}