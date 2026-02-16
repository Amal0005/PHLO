export interface UserProfileResponse {
  _id: string;
  name: string;
  email: string;
  image?: string
  phone: string;
  status: "active" | "blocked";
  role: "user" | "admin";
  googleVerified?: boolean;
  createdAt?: Date;
}

export interface EditProfilePayload {
  name?: string;
  phone?: string;
  image?: string;
  email?: string
}