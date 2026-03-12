export interface ComplaintResponseDTO {
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
  createdAt: Date;
}
