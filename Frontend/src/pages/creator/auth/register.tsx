import { useState } from "react";
import {
  Camera,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  ExternalLink,
  Users,
  Award,
  Eye,
  EyeOff,
} from "lucide-react";

import { uploadToS3 as fileUploader } from "@/utils/uploadToS3";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
} from "@/validation/registerCreatorValidation";
import { ROUTES } from "@/constants/routes";
import { CreatorAuthService } from "@/services/creator/creatorAuthService";
import OtpVerificationModal from "@/components/OtpVerificationModal";

async function uploadToS3(file: File, type: "profile" | "id"): Promise<string> {
  const url = await fileUploader(file, type);
  return url;
}

export default function CreatorSignup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",
    yearsOfExperience: "",
    bio: "",
    portfolioLink: "",
    specialties: [] as string[],
    profilePhoto: null as File | null,
    governmentId: null as File | null,
  });

  const specialtyOptions = [
    "Wedding",
    "Portrait",
    "Event",
    "Fashion",
    "Product",
    "Landscape",
    "Wildlife",
    "Commercial",
  ];
  const navigate = useNavigate();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSpecialtyToggle(specialty: string) {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  }

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "profilePhoto" | "governmentId",
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData({ ...formData, [fieldName]: file });

    const previewUrl = URL.createObjectURL(file);

    if (fieldName === "profilePhoto") {
      setProfilePreview(previewUrl);
    } else {
      setIdPreview(previewUrl);
    }
  }

  async function handleNext() {
    if (isLoading) return;
    setIsLoading(true);

    if (currentStep === 1) {
      const isValid = await validateStep1(
        formData,
        CreatorAuthService.checkCreatorExists
      );

      if (!isValid) {
        setIsLoading(false);
        return;
      }

      try {
        await CreatorAuthService.resendOtp(formData.email);
        setIsOtpModalOpen(true);
        toast.info("Verification code sent to your email");
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to send OTP");
      } finally {
        setIsLoading(false);
      }
      return;
    }
    if (currentStep === 2 && !validateStep2(formData)) {
      setIsLoading(false);
      return;
    }
    if (currentStep === 3 && !validateStep3(formData)) {
      setIsLoading(false);
      return;
    }
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      toast.success("Step completed successfully!");
    }
    setIsLoading(false);
  }

  async function handleOtpVerify(otp: string) {
    try {
      await CreatorAuthService.verifyOtp(formData.email, otp);
      setIsOtpModalOpen(false);
      setCurrentStep(2);
      toast.success("Email verified successfully!");
    } catch (error: any) {
      toast.error(error);
    }
  }

  async function handleOtpResend() {
    await CreatorAuthService.resendOtp(formData.email);
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep4(formData)) return;

    setIsLoading(true);

    try {
      if (!formData.profilePhoto || !formData.governmentId) {
        throw new Error("Please upload all required documents");
      }

      toast.info("Uploading documents...");

      const profilePhotoUrl = await uploadToS3(
        formData.profilePhoto,
        "profile",
      );
      const governmentIdUrl = await uploadToS3(formData.governmentId, "id");

      toast.info("Submitting your application...");

      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        city: formData.city,
        yearsOfExperience: Number(formData.yearsOfExperience),
        bio: formData.bio,
        portfolioLink: formData.portfolioLink,
        specialties: formData.specialties,
        profilePhoto: profilePhotoUrl,
        governmentId: governmentIdUrl,
      };

      await CreatorAuthService.register(payload);

      toast.success(
        "Creator registered successfully! Awaiting admin approval.",
      );

      setFormData({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        confirmPassword: "",
        city: "",
        yearsOfExperience: "",
        bio: "",
        portfolioLink: "",
        specialties: [],
        profilePhoto: null,
        governmentId: null,
      });
      setProfilePreview(null);
      setIdPreview(null);
      setCurrentStep(1);

      setTimeout(() => {
        navigate(ROUTES.CREATOR.LOGIN);
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const isStep1Valid =
    formData.fullName &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.phone;
  const isStep2Valid = formData.city && formData.yearsOfExperience;
  const isStep3Valid =
    formData.bio && formData.portfolioLink && formData.specialties.length > 0;
  const isStep4Valid = formData.profilePhoto && formData.governmentId;

  return (
    <div className="h-screen bg-black relative overflow-hidden">
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

      <div className="relative z-10 h-screen flex flex-col lg:flex-row overflow-y-auto">
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 text-sm ${
                        currentStep >= step
                          ? "bg-white border-white text-black"
                          : "bg-zinc-800/50 border-zinc-700 text-gray-500"
                      }`}
                    >
                      {currentStep > step ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        step
                      )}
                    </div>
                    {step < 4 && (
                      <div
                        className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${
                          currentStep > step ? "bg-white" : "bg-zinc-700"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 px-1">
                <span>Basic Info</span>
                <span>Experience</span>
                <span>Portfolio</span>
                <span>Documents</span>
              </div>
            </div>

            <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-5 border border-white/10">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      Join as a Creator
                    </h2>
                    <p className="text-sm text-gray-400">
                      Let's start with your basic information
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="John Doe"
                        className="w-full p-3 text-sm rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        className="w-full p-3 text-sm rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create a strong password"
                        className="w-full p-3 text-sm rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300 pr-12"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-[38px] text-gray-500 hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Confirm Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Repeat your password"
                        className="w-full p-3 text-sm rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300 pr-12"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="9876543210"
                        className="w-full p-3 text-sm rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

      <button
  onClick={handleNext}
  disabled={!isStep1Valid || isLoading}
  className="w-full bg-white hover:bg-gray-200 text-black py-3 rounded-lg font-semibold
             transition-all duration-300
             disabled:opacity-50 disabled:cursor-not-allowed
             flex items-center justify-center gap-2"
>
  {isLoading ? (
    <>
      <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
      Sending Otp...
    </>
  ) : (
    <>
      Continue
      <ArrowRight className="w-5 h-5" />
    </>
  )}
</button>

                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      Location & Experience
                    </h2>
                    <p className="text-sm text-gray-400">
                      Tell us about your professional background
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Bangalore"
                        className="w-full p-3 text-sm rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        name="yearsOfExperience"
                        placeholder="5"
                        min="0"
                        className="w-full p-3 text-sm rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
                        value={formData.yearsOfExperience}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleBack}
                      className="flex-1 bg-zinc-800/50 hover:bg-zinc-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 border border-zinc-700 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!isStep2Valid}
                      className="flex-1 bg-white hover:bg-gray-200 text-black py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Continue
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      Professional Details
                    </h2>
                    <p className="text-sm text-gray-400">
                      Showcase your expertise and portfolio
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        placeholder="Tell us about yourself and your photography journey..."
                        rows={3}
                        className="w-full p-3 text-sm rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300 resize-none"
                        value={formData.bio}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Portfolio Link
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          name="portfolioLink"
                          placeholder="https://www.yourportfolio.com"
                          className="w-full p-3 text-sm rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300 pl-10"
                          value={formData.portfolioLink}
                          onChange={handleChange}
                        />
                        <ExternalLink className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Specialties
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {specialtyOptions.map((specialty) => (
                          <button
                            key={specialty}
                            type="button"
                            onClick={() => handleSpecialtyToggle(specialty)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                              formData.specialties.includes(specialty)
                                ? "bg-white text-black"
                                : "bg-zinc-800/50 text-gray-400 border border-zinc-700 hover:bg-zinc-700"
                            }`}
                          >
                            {specialty}
                          </button>
                        ))}
                      </div>
                      {formData.specialties.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1.5">
                          Selected: {formData.specialties.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleBack}
                      className="flex-1 bg-zinc-800/50 hover:bg-zinc-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 border border-zinc-700 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!isStep3Valid}
                      className="flex-1 bg-white hover:bg-gray-200 text-black py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Continue
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      Upload Documents
                    </h2>
                    <p className="text-sm text-gray-400">
                      Final step - verify your identity
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Profile Photo
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          id="profilePhoto"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "profilePhoto")}
                          className="hidden"
                        />
                        <label
                          htmlFor="profilePhoto"
                          className="w-full p-5 text-sm rounded-lg bg-zinc-800/50 border-2 border-dashed border-zinc-700 text-white cursor-pointer hover:border-white hover:bg-zinc-700/50 transition-all duration-300 flex flex-col items-center justify-center gap-1.5"
                        >
                          {profilePreview ? (
                            <img
                              src={profilePreview}
                              alt="Profile Preview"
                              className="w-20 h-20 rounded-full object-cover mb-2"
                            />
                          ) : (
                            <Upload className="w-6 h-6 text-gray-400" />
                          )}

                          <span className="text-gray-400 text-xs">
                            {formData.profilePhoto
                              ? "Profile photo selected"
                              : "Click to upload profile photo"}
                          </span>

                          {formData.profilePhoto && (
                            <span className="text-xs text-green-400 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Uploaded
                            </span>
                          )}
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Government ID
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          id="governmentId"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "governmentId")}
                          className="hidden"
                        />
                        <label
                          htmlFor="governmentId"
                          className="w-full p-5 text-sm rounded-lg bg-zinc-800/50 border-2 border-dashed border-zinc-700 text-white cursor-pointer hover:border-white hover:bg-zinc-700/50 transition-all duration-300 flex flex-col items-center justify-center gap-1.5"
                        >
                          {idPreview ? (
                            <img
                              src={idPreview}
                              alt="ID Preview"
                              className="w-24 h-16 rounded-md object-cover mb-2 border border-zinc-700"
                            />
                          ) : (
                            <Upload className="w-6 h-6 text-gray-400" />
                          )}

                          <span className="text-gray-400 text-xs">
                            {formData.governmentId
                              ? "Government ID selected"
                              : "Click to upload government ID"}
                          </span>

                          {formData.governmentId && (
                            <span className="text-xs text-green-400 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Uploaded
                            </span>
                          )}
                        </label>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 bg-zinc-800/30 p-2.5 rounded-lg border border-zinc-700/50">
                      Your documents will be securely stored and used only for
                      verification purposes.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleBack}
                      className="flex-1 bg-zinc-800/50 hover:bg-zinc-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 border border-zinc-700 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!isStep4Valid || isLoading}
                      className="flex-1 bg-white hover:bg-gray-200 text-black py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <Check className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <p className="text-gray-400 text-xs text-center mt-4">
                Already have an account?{" "}
                <span
                  onClick={() => navigate(ROUTES.CREATOR.LOGIN)}
                  className="text-white cursor-pointer hover:underline font-medium"
                >
                  Log in
                </span>
              </p>
            </div>

            <p className="text-center text-gray-600 text-xs mt-4 px-4">
              Your information is protected and will be reviewed by our team
            </p>
          </div>
        </div>

        <div className="hidden lg:flex w-full lg:w-1/2 flex-col justify-center px-6 py-8 sm:px-12 lg:px-16 xl:px-24">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-light mb-2 lg:mb-4 leading-relaxed text-white">
            Manage your craft.
            <br />
            Connect with clients.
            <br />
            <span className="text-gray-400">Showcase your art.</span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-gray-400 mb-6 lg:mb-8 leading-relaxed max-w-md">
            Access your creator dashboard to manage bookings, upload galleries,
            and grow your photography business.
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 group hover:translate-x-2 transition-transform duration-300">
              <div className="w-10 h-10 rounded-full bg-zinc-800/80 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base text-white">
                  Client Management
                </h3>
                <p className="text-xs text-gray-400">
                  Track sessions and communicate
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 group hover:translate-x-2 transition-transform duration-300">
              <div className="w-10 h-10 rounded-full bg-zinc-800/80 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base text-white">
                  Gallery Upload
                </h3>
                <p className="text-xs text-gray-400">
                  Share photos with your clients
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 group hover:translate-x-2 transition-transform duration-300">
              <div className="w-10 h-10 rounded-full bg-zinc-800/80 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base text-white">
                  Portfolio Builder
                </h3>
                <p className="text-xs text-gray-400">Showcase your best work</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        email={formData.email}
        onClose={() => setIsOtpModalOpen(false)}
        onVerify={handleOtpVerify}
        onResend={handleOtpResend}
      />
    </div>
  );
}
