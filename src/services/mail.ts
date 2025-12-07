import path from "node:path";
import nodemailer from "nodemailer";
import type { EmailData } from "@/lib/schemas/contact";
import { EmailTemplates } from "./emailtemplate/emailTemplates";

// Re-export for backwards compatibility
export type { EmailData } from "@/lib/schemas/contact";

class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const emailConfig =
      process.env.EMAIL_PROVIDER === "outlook"
        ? {
            host: "smtp-mail.outlook.com",
            port: 587,
            secure: false,
            auth: {
              user: process.env.GMAIL_USER,
              pass: process.env.GMAIL_APP_PASSWORD,
            },
          }
        : {
            service: "gmail",
            auth: {
              user: process.env.GMAIL_USER,
              pass: process.env.GMAIL_APP_PASSWORD,
            },
          };

    this.transporter = nodemailer.createTransport({
      ...emailConfig,
    });
  }

  async sendContactEmail(data: EmailData): Promise<{ success: boolean; message: string }> {
    try {
      const subject = EmailTemplates.generateEmailSubject(data.intent, data.name);
      const html = EmailTemplates.generateContactEmailTemplate(data);

      const recipients = process.env.CONTACT_EMAIL_RECIPIENTS?.split(",").map((e) => e.trim()) || [
        "sachin@mulearn.org",
        "info@mulearn.org",
      ];

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: recipients,
        subject,
        html,
        replyTo: data.email,
        attachments: [
          {
            filename: "mulearn-logo.webp",
            path: path.join(process.cwd(), "public", "assets", "mulearn logo.webp"),
            cid: "mulearn-logo",
          },
        ],
      };

      await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        message: "Email sent successfully",
      };
    } catch (_error) {
      return {
        success: false,
        message: "Failed to send email",
      };
    }
  }

  async sendAutoReply(data: EmailData): Promise<{ success: boolean; message: string }> {
    try {
      const autoReplyHtml = EmailTemplates.generateAutoReplyTemplate(data);

      const autoReplyOptions = {
        from: process.env.GMAIL_USER,
        to: data.email,
        subject: "Your inquiry has been received - μLearn Foundation",
        html: autoReplyHtml,
        attachments: [
          {
            filename: "mulearn-logo.webp",
            path: path.join(process.cwd(), "public", "assets", "mulearn logo.webp"),
            cid: "mulearn-logo",
          },
        ],
      };

      await this.transporter.sendMail(autoReplyOptions);

      return {
        success: true,
        message: "Auto-reply sent successfully",
      };
    } catch (_error) {
      return {
        success: false,
        message: "Failed to send auto-reply",
      };
    }
  }
}

export const mailService = new MailService();
