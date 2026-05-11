import { useState } from "react";
import { AxiosError } from "axios";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  ExternalLink,
  Users,
  Award,
  Camera,
  CameraOff,
} from "lucide-react";

import { S3Service } from "@/services/s3Service";
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
import OtpVerificationModal from "@/components/reusable/OtpVerificationModal";
import { motion, AnimatePresence } from "framer-motion";

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (error.response?.data as { message?: string })?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}

async function uploadToS3(file: File, type: "profile" | "id"): Promise<string> {
  const url = await S3Service.uploadToS3(file, type);
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
      } catch (error) {
        toast.error(getErrorMessage(error));
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
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(getErrorMessage(error));
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
      toast.error(getErrorMessage(error));
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

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md"
          >
            <div className="mb-8 relative">
              {/* Progress Line Background */}
              <div className="absolute top-4 left-0 w-full h-0.5 bg-white/10 -z-0" />
              <motion.div 
                className="absolute top-4 left-0 h-0.5 bg-white -z-0 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
              
              <div className="flex justify-between items-start relative z-10">
                {[
                  { id: 1, label: "Basic Info" },
                  { id: 2, label: "Experience" },
                  { id: 3, label: "Portfolio" },
                  { id: 4, label: "Documents" },
                ].map((step) => (
                  <div key={step.id} className="flex flex-col items-center flex-1">
                    <motion.div
                      initial={false}
                      animate={{
                        backgroundColor: currentStep >= step.id ? "#ffffff" : "rgba(39, 39, 42, 0.5)",
                        borderColor: currentStep >= step.id ? "#ffffff" : "rgba(63, 63, 70, 0.5)",
                        color: currentStep >= step.id ? "#000000" : "rgba(161, 161, 170, 1)",
                        scale: currentStep === step.id ? 1.1 : 1,
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 text-sm font-bold shadow-lg"
                    >
                      {currentStep > step.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        step.id
                      )}
                    </motion.div>
                    <motion.span 
                      animate={{
                        color: currentStep >= step.id ? "#ffffff" : "rgba(161, 161, 170, 1)",
                        fontWeight: currentStep >= step.id ? 600 : 400,
                      }}
                      className="text-[10px] sm:text-xs mt-2 text-center"
                    >
                      {step.label}
                    </motion.span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-950/40 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/10 overflow-hidden relative group">
              {/* Subtle inner glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        {/* <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
                        >
                          <Camera className="w-7 h-7 text-white" />
                        </motion.div> */}
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
                          Join as a Creator
                        </h2>
                        <p className="text-sm sm:text-base text-gray-400">
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
                          className="w-full p-3 text-sm rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
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
                          className="w-full p-3 text-sm rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
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
                          className="w-full p-3 text-sm rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300 pr-12"
                          value={formData.password}
                          onChange={handleChange}
                        />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[38px] text-gray-500 hover:text-white transition-colors"
                          >
                            {showPassword ? (
                              <CameraOff className="w-5 h-5" />
                            ) : (
                              <Camera className="w-5 h-5" />
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
                          className="w-full p-3 text-sm rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300 pr-12"
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
                          className="w-full p-3 text-sm rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
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
                      </motion.button>
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
                            className="w-full p-3 text-sm rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
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
                            className="w-full p-3 text-sm rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
                            value={formData.yearsOfExperience}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleBack}
                          className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 border border-white/10 active:scale-[0.98]"
                        >
                          <ArrowLeft className="w-5 h-5" />
                          Back
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleNext}
                          disabled={!isStep2Valid}
                          className="flex-1 bg-white hover:bg-gray-200 text-black py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          Continue
                          <ArrowRight className="w-5 h-5" />
                        </motion.button>
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
                            className="w-full p-3 text-sm rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300 resize-none"
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
                              className="w-full p-3 text-sm rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300 pl-10"
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
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${formData.specialties.includes(specialty)
                                  ? "bg-white text-black"
                                  : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
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
                          className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 border border-white/10 active:scale-[0.98]"
                        >
                          <ArrowLeft className="w-5 h-5" />
                          Back
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleNext}
                          disabled={!isStep3Valid}
                          className="flex-1 bg-white hover:bg-gray-200 text-black py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          Continue
                          <ArrowRight className="w-5 h-5" />
                        </motion.button>
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
                              className="w-full p-5 text-sm rounded-lg bg-white/5 border-2 border-dashed border-white/10 text-white cursor-pointer hover:border-white hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center gap-1.5"
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
                              className="w-full p-5 text-sm rounded-lg bg-white/5 border-2 border-dashed border-white/10 text-white cursor-pointer hover:border-white hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center gap-1.5"
                            >
                              {idPreview ? (
                                <img
                                  src={idPreview}
                                  alt="ID Preview"
                                  className="w-24 h-16 rounded-md object-cover mb-2 border border-white/10"
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
                          className="flex-1 bg-zinc-800/50 hover:bg-zinc-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 border border-zinc-700 active:scale-[0.98]"
                        >
                          <ArrowLeft className="w-5 h-5" />
                          Back
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSubmit}
                          disabled={!isStep4Valid || isLoading}
                          className="flex-1 bg-white hover:bg-gray-200 text-black py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

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
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:flex w-full lg:w-1/2 flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-32"
        >
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4 lg:mb-6 leading-tight text-white">
              Manage your <span className="font-bold">craft.</span>
              <br />
              Connect with <span className="text-gray-400">clients.</span>
              <br />
              Showcase your <span className="font-bold">art.</span>
            </h2>

            <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-8 lg:mb-12 leading-relaxed">
              Access your creator dashboard to manage bookings, upload galleries,
              and grow your photography business.
            </p>

            <div className="flex flex-col gap-6 lg:gap-8">
              {[
                { icon: <Users className="w-6 h-6 text-white" />, title: "Client Management", desc: "Track sessions and communicate effortlessly" },
                { icon: <Camera className="w-6 h-6 text-white" />, title: "Gallery Upload", desc: "Share high-resolution photos with your clients" },
                { icon: <Award className="w-6 h-6 text-white" />, title: "Portfolio Builder", desc: "Showcase your best work to the world" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-5 group cursor-default"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
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

