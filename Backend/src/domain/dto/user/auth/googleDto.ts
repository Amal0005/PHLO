export interface GoogleProfileDTO {
  id: string;
  name: string;
  email: string;
  photo?: string;
  provider?: "local" | "google";
}
