export interface UserDto {
  _id?: string;
  name: string;
  phone?: string;
  email: string;
  status: "active" | "blocked";
  role: "user" | "creator" | "admin";
  googleVerified: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
