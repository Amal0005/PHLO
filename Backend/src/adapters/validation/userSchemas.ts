import { z } from "zod";

export const registerUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string().trim().email("Invalid email format"),
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
});

export const loginUserSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const verifyOtpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
  email: z.string().email("Invalid email format"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const reviewSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, "Comment is required"),
});

export const complaintSchema = z.object({
  creatorId: z.string().min(1, "Creator ID is required"),
  bookingId: z.string().min(1, "Booking ID is required"),
  reason: z.string().min(3, "Reason must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export type RegisterUserDTO = z.infer<typeof registerUserSchema>;
export type LoginUserDTO = z.infer<typeof loginUserSchema>;
