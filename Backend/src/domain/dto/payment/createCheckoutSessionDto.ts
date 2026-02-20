export interface CreateCheckoutSessionDTO {
  bookingId: string;
  packageName: string;
  amount: number;
  successUrl: string;
  cancelUrl: string;
}
