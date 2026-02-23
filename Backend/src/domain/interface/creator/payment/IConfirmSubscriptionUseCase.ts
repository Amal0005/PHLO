import { SubscriptionDetails } from "@/domain/entities/creatorEntities";

export interface IConfirmSubscriptionUseCase {
  confirm(sessionId: string, creatorId: string): Promise<SubscriptionDetails | null>;
}
