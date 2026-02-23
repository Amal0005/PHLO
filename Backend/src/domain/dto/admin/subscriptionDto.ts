export interface SubscriptionDTO {
  id: string;
  subscriptionId?: string;
  name: string;
  type: "User" | "Creator";
  price: number;
  duration: number;
  features: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
