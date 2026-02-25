export interface SubscriptionDTO {
  id: string;
  subscriptionId?: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
