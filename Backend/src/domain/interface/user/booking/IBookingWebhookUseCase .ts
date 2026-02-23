export interface IBookingWebhookUseCase {
  handleWebhook(payload: string | Buffer,signature: string): Promise<void>;
}
