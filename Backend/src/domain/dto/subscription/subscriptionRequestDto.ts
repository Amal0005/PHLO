export interface SubscriptionRequestDto {
  name: string;
  price: number;
  duration: number;
  features: string[];
  isActive: boolean;
}

export type EditSubscriptionRequestDto = Partial<SubscriptionRequestDto>;
