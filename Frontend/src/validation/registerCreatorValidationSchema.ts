import { z } from "zod";

export const creatorStep1Schema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Please enter your full name")
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address")
    .email("Please enter a valid email address"),
  
  phone: z
    .string()
    .trim()
    .min(1, "Please enter your phone number")
    .regex(/^[1-9][0-9]{9}$/, "Phone number must be exactly 10 digits and cannot start with 0"),
  
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must not exceed 32 characters")
    .refine(
      (val) =>
        /[a-z]/.test(val) &&
        /[A-Z]/.test(val) &&
        /[0-9]/.test(val) &&
        /[^A-Za-z0-9]/.test(val),
      {
        message:
          "Password must include uppercase, lowercase, number, and special character",
      }
    ),
  
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const creatorStep2Schema = z.object({
  city: z
    .string()
    .min(1, "Please enter your city")
    .trim(),
  
  yearsOfExperience: z
    .string()
    .min(1, "Please enter your years of experience")
    .refine((val) => !isNaN(Number(val)), "Please enter a valid number")
    .refine((val) => Number(val) >= 0, "Years of experience cannot be negative")
    .refine((val) => Number(val) <= 50, "Years of experience seems too high. Please check."),
});

export const creatorStep3Schema = z.object({
  bio: z
    .string()
    .min(1, "Please write something about yourself")
    .min(20, "Bio should be at least 20 characters long")
    .trim(),
  
  portfolioLink: z
    .string()
    .min(1, "Please provide your portfolio link")
    .url("Please enter a valid portfolio URL (e.g., https://example.com)"),
  
  specialties: z
    .array(z.string())
    .min(1, "Please select at least one specialty"),
});

export const creatorStep4Schema = z.object({
  profilePhoto: z
    .instanceof(File, { message: "Please upload your profile photo" })
    .nullable()
    .refine((file) => file !== null, "Please upload your profile photo"),
  
  governmentId: z
    .instanceof(File, { message: "Please upload your government ID" })
    .nullable()
    .refine((file) => file !== null, "Please upload your government ID"),
});

export const creatorRegistrationSchema = z.object({
  fullName: z.string().trim().min(3).max(50).regex(/^[a-zA-Z\s]+$/),
  email: z.string().trim().email(),
  phone: z.string().trim().regex(/^[1-9][0-9]{9}$/),
  password: z
    .string()
    .min(8)
    .max(32)
    .refine((val) =>
      /[a-z]/.test(val) &&
      /[A-Z]/.test(val) &&
      /[0-9]/.test(val) &&
      /[^A-Za-z0-9]/.test(val)
    ),
  confirmPassword: z.string(),
  city: z.string().min(1),
  yearsOfExperience: z.string(),
  bio: z.string().min(20),
  portfolioLink: z.string().url(),
  specialties: z.array(z.string()).min(1),
  profilePhoto: z.instanceof(File).nullable(),
  governmentId: z.instanceof(File).nullable(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
