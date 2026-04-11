import { z } from "zod";

export const registerUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must not exceed 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address"),

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
      .min(1, "Confirm password is required"),

    phone: z
      .string()
      .trim()
      .regex(/^[1-9][0-9]{9}$/, "Phone number must be exactly 10 digits and cannot start with 0"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
