import nodemailer from "nodemailer";
import { IMailService } from "../../interface/service/ImailServices";
import path from "path";

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

  
async sendMail(to: string, subject: string, html: string): Promise<void> {
  await this.transporter.sendMail({
    from: `"PHLO" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments: [
      {
        filename: "Logo_white.png",
        path: path.join(__dirname, "../../../templates/user/Logo_white.png"),
        cid: "app-logo"
      }
    ]
  });
}

}
