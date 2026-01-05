export interface AuthPayload {
  userId: string;
  role: "user" | "creator" | "admin";
  email: string;
}
