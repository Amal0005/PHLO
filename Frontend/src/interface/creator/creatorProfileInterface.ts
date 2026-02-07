export interface CreatorProfileResponse {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  profilePhoto?: string;
  city: string;
  yearsOfExperience: number;
  bio: string;
  portfolioLink?: string;
  specialties?: string[];
  status: string;
}
export interface EditCreatorProfilePayload {
  fullName?: string;
  phone?: string;
  profilePhoto?: string;
  city?: string;
  yearsOfExperience?: number;
  bio?: string;
  portfolioLink?: string;
  specialties?: string[];
}