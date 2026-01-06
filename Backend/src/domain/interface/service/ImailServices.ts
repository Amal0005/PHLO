export interface IMailService {
  sendMail(to: string, subject: string, html: string): Promise<void>;
}
