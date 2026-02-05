export interface UserProfileResponse {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  role: string;
  googleVerified?: boolean;
  createdAt?: Date;
}

export interface EditProfilePayload {
  name?: string;
  phone?: string;
}