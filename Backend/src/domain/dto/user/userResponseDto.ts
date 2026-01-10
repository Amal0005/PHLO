export interface UserResponseDto {
  _id: string;
  name: string;
  phone?: string;
  email: string;
  status: "active" | "blocked";
  role: "user"  | "admin";
  googleVerified: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
