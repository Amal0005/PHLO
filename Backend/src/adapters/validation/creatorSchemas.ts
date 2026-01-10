import { z } from "zod";

export const registerCreatorSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters"),

  email: z
    .string()
    .email("Invalid email format"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  phone: z
    .string()
    .min(10, "Phone must be 10 digits")
    .max(10, "Phone must be 10 digits")
    .regex(/^[0-9]+$/, "Phone must contain only numbers"),

  city: z
    .string()
    .min(2, "City is required"),

  yearsOfExperience: z
    .number()
    .min(0, "Experience cannot be negative"),

  bio: z
    .string()
    .min(50, "Bio must be at least 100 characters")
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

export type RegisterCreatorDTO = z.infer<typeof registerCreatorSchema>;
