export interface CreateCheckoutSessionDTO {
  bookingId?: string;
  subscriptionId?: string;
  creatorId: string;
  packageName: string;
  amount: number;
  successUrl: string;
  cancelUrl: string;
  type: "booking" | "subscription";
}
