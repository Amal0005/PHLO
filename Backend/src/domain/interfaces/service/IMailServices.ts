export interface IMailService {
  sendMail(
    to: string,
    subject: string,
    html: string,
    attachments?: {
      filename: string;
      path: string;
      cid?: string;
    }[]
  ): Promise<void>;
}