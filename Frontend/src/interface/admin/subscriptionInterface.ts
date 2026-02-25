export interface Subscription {
  subscriptionId: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubscriptionForm {
  name: string;
  price: number;
  duration: number;
  features: string[];
  isActive: boolean;
}
