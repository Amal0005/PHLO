export interface CreateCheckoutSessionDTO {
  bookingId?: string;
  subscriptionId?: string;
  wallpaperId?: string;
  userId?: string;
  creatorId: string;
  packageName: string;
  amount: number;
  successUrl: string;
  cancelUrl: string;
  type: "booking" | "subscription" | "wallpaper";
}
