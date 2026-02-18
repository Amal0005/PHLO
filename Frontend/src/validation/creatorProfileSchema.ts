import { z } from "zod";

export const creatorProfileSchema = z.object({
  fullName: z.string().trim().min(3, "Full name must be at least 3 characters").regex(/^[a-zA-Z\s]+$/, "Full name must only contain letters"),
  phone: z
    .string()
    .regex(/^(?!0{10}$)\d{10}$/, "Phone number must be 10 digits and cannot be all zeros"),
  city: z.string().min(2, "City name is too short"),
  yearsOfExperience: z
    .number()
    .min(0, "Experience cannot be negative")
    .max(50, "Experience cannot exceed 50 years"),
  bio: z.string().min(20, "Bio is required and must be at least 20 characters"),
  portfolioLink: z
    .string()
    .url("Portfolio link is required and must be a valid URL")
    .min(1, "Portfolio link is required"),
});
