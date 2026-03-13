export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  creatorId: string;
  creatorName: string;
  bookingId: string;
  reason: string;
  description: string;
  status: "pending" | "resolved" | "dismissed";
  adminComment?: string;
  createdAt: string;
}
