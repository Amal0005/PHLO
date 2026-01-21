export interface AuthPayload {
  userId: string;
  role: "user" | "admin" | "creator";
  email: string;
  exp?: number;
}