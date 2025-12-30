import path from "node:path";
import nodemailer from "nodemailer";
import { serverEnv } from "@/lib/env/env.server";
import type { EmailData } from "@/lib/schemas/contact";
import { EmailTemplates } from "./emailtemplate/emailTemplates";

// Re-export for backwards compatibility
export type { EmailData } from "@/lib/schemas/contact";

class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Transporter configuration removed - mail service is not in use
    // Create a dummy transporter for backwards compatibility
    this.transporter = nodemailer.createTransport({
      streamTransport: true,
      newline: "unix",
      buffer: true,
    });
  }

  async sendContactEmail(data: EmailData): Promise<{ success: boolean; message: string }> {
    try {
      const subject = EmailTemplates.generateEmailSubject(data.intent, data.name);
      const html = EmailTemplates.generateContactEmailTemplate(data);

      const mailOptions = {
        from: data.email,
        to: "contact@mulearn.org",
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
        from: "noreply@mulearn.org",
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
