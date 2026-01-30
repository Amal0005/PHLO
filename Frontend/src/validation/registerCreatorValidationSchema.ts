import { z } from "zod";

// Step 1: Basic Info Schema
export const creatorStep1Schema = z.object({
  fullName: z
    .string()
    .min(1, "Please enter your full name")
    .min(3, "Full name must be at least 3 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters"),
  
  email: z
    .string()
    .min(1, "Please enter your email address")
    .email("Please enter a valid email address"),
  
  phone: z
    .string()
    .min(1, "Please enter your phone number")
    .regex(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"),
  
  password: z
    .string()
    .min(1, "Please enter a password")
    .min(6, "Password must be at least 6 characters long"),
  
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Step 2: Experience Schema
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

// Step 3: Professional Details Schema
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

// Step 4: Documents Schema
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

// Complete registration schema (all steps combined)
export const creatorRegistrationSchema = z.object({
  fullName: z.string().min(3).regex(/^[a-zA-Z\s]+$/),
  email: z.string().email(),
  phone: z.string().regex(/^[0-9]{10}$/),
  password: z.string().min(6),
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