export interface ICreatorSubscriptionWebhookUseCase {
    handle(payload: string | Buffer, signature: string): Promise<void>;
}
