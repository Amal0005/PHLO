import {z} from "zod"
export const registerUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z
    .string()
    .min(10, "Phone must be 10 digits")
    .max(10, "Phone must be 10 digits")
    .regex(/^[0-9]+$/, "Phone must contain only numbers"),
});
export type RegisterUserDTO = z.infer<typeof registerUserSchema>;
