export interface IHandleStripeWebhookUseCase {
    handleWebhook(rawBody: string | Buffer, signature: string): Promise<{ received: boolean }>;
}
