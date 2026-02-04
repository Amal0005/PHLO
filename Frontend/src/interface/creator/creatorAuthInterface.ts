export interface CreatorLoginPayload{
     email: string;
  password: string;
}
export interface CreatorLoginResponse {
  status: "approved" | "pending" | "rejected";
  message?: string;
  creator?: any;
  token?: string;
  reason?: string;
}
export interface CreatorRegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone: string;
city: string;
  yearsOfExperience: number;
  bio: string;
  portfolioLink: string;
  specialties: string[];
  profilePhoto: string;
  governmentId: string;
}
