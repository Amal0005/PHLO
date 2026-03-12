export interface ComplaintEntity {
  _id?: string;
  userId: string;
  creatorId: string;
  bookingId: string;
  reason: string;
  description: string;
  status: "pending" | "resolved" | "dismissed";
  adminComment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
