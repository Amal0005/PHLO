import { toast } from "react-toastify";

export async function validateStep1(
  formData: any,
  checkEmailExists: (email: string) => Promise<boolean>
): Promise<boolean> {
  if (!formData.fullName.trim()) {
    toast.error("Please enter your full name");
    return false;
  }
  const nameRegex = /^[a-zA-Z\s]+$/;
if(formData.fullName && !nameRegex.test(formData.fullName)){
    toast.error("Full name can only contain letters");
    return false;
  }
if (formData.fullName.trim().length < 3) {
    toast.error("Full name must be at least 3 characters")
    return false;
  }
  if (!formData.email.trim()) {
    toast.error("Please enter your email address");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    toast.error("Please enter a valid email address");
    return false;
  }

  if (!formData.phone.trim()) {
    toast.error("Please enter your phone number");
    return false;
  }

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(formData.phone.trim())) {
    toast.error("Please enter a valid 10-digit phone number");
    return false;
  }

  if (!formData.password) {
    toast.error("Please enter a password");
    return false;
  }

  if (formData.password.length < 6) {
    toast.error("Password must be at least 6 characters long");
    return false;
  }

  if (!formData.confirmPassword) {
    toast.error("Please confirm your password");
    return false;
  }

  if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }

  try {
    const exists = await checkEmailExists(formData.email);
    if (exists) {
      toast.error("Email already registered");
      return false;
    }
  } catch (error: any) {
    toast.error(error?.message || "Unable to verify email");
    return false;
  }

  return true;
}

export function validateStep2(formData: any): boolean {
  if (!formData.city.trim()) {
    toast.error("Please enter your city");
    return false;
  }

  if (!formData.yearsOfExperience) {
    toast.error("Please enter your years of experience");
    return false;
  }

  const years = Number(formData.yearsOfExperience);
  if (isNaN(years) || years < 0) {
    toast.error("Please enter a valid number of years");
    return false;
  }

  if (years > 50) {
    toast.error("Years of experience seems too high. Please check.");
    return false;
  }

  return true;
}

export function validateStep3(formData: any): boolean {
  if (!formData.bio.trim()) {
    toast.error("Please write something about yourself");
    return false;
  }

  if (formData.bio.trim().length < 20) {
    toast.error("Bio should be at least 20 characters long");
    return false;
  }

  if (!formData.portfolioLink.trim()) {
    toast.error("Please provide your portfolio link");
    return false;
  }

  try {
    new URL(formData.portfolioLink);
  } catch {
    toast.error("Please enter a valid portfolio URL (e.g., https://example.com)");
    return false;
  }

  if (formData.specialties.length === 0) {
    toast.error("Please select at least one specialty");
    return false;
  }

  return true;
}

export function validateStep4(formData: any): boolean {
  if (!formData.profilePhoto) {
    toast.error("Please upload your profile photo");
    return false;
  }

  if (!formData.governmentId) {
    toast.error("Please upload your government ID");
    return false;
  }

  return true;
}
