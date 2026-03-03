import { z } from "zod";

export const registerUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must not exceed 50 characters"),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address"),

 password: z
  .string()
  .min(8)
  .max(32)
  .refine((val) =>
    /[a-z]/.test(val) &&
    /[A-Z]/.test(val) &&
    /[0-9]/.test(val) &&
    /[^A-Za-z0-9]/.test(val),
    {
      message:
        "Password must be 8–32 characters long and include uppercase, lowercase, number, and special character.",
    }
  ),

    confirmPassword: z
      .string()
      .min(8, "Confirm password is required"),

    phone: z
      .string()
      .trim()
      .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
