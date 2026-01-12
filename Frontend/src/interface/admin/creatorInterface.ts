export interface Creator {
  _id: string;
  fullName: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
}
