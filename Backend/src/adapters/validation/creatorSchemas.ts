import { z } from "zod";

export const registerCreatorSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

  email: z
    .string()
    .trim()
    .email("Invalid email format"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must not exceed 32 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

  phone: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]{9}$/, "Phone number must be exactly 10 digits and cannot start with 0"),

  city: z
    .string()
    .min(2, "City is required"),

  yearsOfExperience: z
    .number()
    .min(0, "Experience cannot be negative"),

  bio: z
    .string()
    .min(20, "Bio must be at least 20 characters")
  ,
  portfolioLink: z
    .string()
    .url("Portfolio must be a valid URL")
    .optional(),

  profilePhoto: z
    .string()
    .optional(),

  governmentId: z
    .string(),
  specialties: z
    .array(z.string().min(2))
    .optional(),
});
export const loginCreatorSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const verifyCreatorOtpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
  email: z.string().email("Invalid email format"),
});

export const forgotCreatorPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const resetCreatorPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const addPackageSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  locations: z.array(
    z.object({
      type: z.literal("Point"),
      coordinates: z.tuple([z.number(), z.number()]),
      placeName: z.string().min(1, "Location name is required"),
    })
  ).min(1, "At least one location is required"),
});

export const editPackageSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").optional(),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  category: z.string().min(1, "Category is required").optional(),
  images: z.array(z.string()).min(1, "At least one image is required").optional(),
  locations: z.array(
    z.object({
      type: z.literal("Point"),
      coordinates: z.tuple([z.number(), z.number()]),
      placeName: z.string().min(1, "Location name is required"),
    })
  ).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" }
);

export type LoginCreatorDTO = z.infer<typeof loginCreatorSchema>;
export type RegisterCreatorDTO = z.infer<typeof registerCreatorSchema>;
export type AddPackageDTO = z.infer<typeof addPackageSchema>;
export type EditPackageDTO = z.infer<typeof editPackageSchema>;
