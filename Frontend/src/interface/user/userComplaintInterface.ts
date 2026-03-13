export interface ComplaintRequest {
  creatorId: string;
  bookingId: string;
  reason: string;
  description: string;
}

export interface Complaint {
  id?: string;
  userId: string;
  creatorId: string;
  bookingId: string;
  reason: string;
  description: string;
  status: "pending" | "resolved" | "dismissed";
  adminComment?: string;
  createdAt: string;
}
