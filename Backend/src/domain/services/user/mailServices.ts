import nodemailer from "nodemailer";
import { IMailService } from "../../interface/service/ImailServices";

export class MailService implements IMailService {
private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  
async sendMail(
  to: string,
  subject: string,
  html: string,
  attachments?: {
    filename: string;
    path: string;
    cid?: string;
  }[]
): Promise<void> {
  await this.transporter.sendMail({
    from: `"PHLO" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments,
  });
}


}
