export interface IDownloadInvoiceUseCase {
    downloadInvoice(sessionId: string): Promise<Buffer>;
}
