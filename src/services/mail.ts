import nodemailer from 'nodemailer';
import { EmailTemplates } from './emailtemplate/emailTemplates';
import path from 'path';

interface EmailData {
  intent: string;
  name: string;
  email: string;
  phone?: string;
  region?: string;
  message: string;
  institution?: string;
  courseYear?: string;
  campusChapter?: string;
  interestGroups?: string;
  organization?: string;
  organizationType?: string;
  focusArea?: string;
  timeline?: string;
  budget?: string;
  programType?: string;
  targetCohort?: string;
  role?: string;
  skills?: string;
  numberOfHires?: string;
  eventName?: string;
  eventDate?: string;
  outlet?: string;
  deadline?: string;
  issueCategory?: string;
}

class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Try Gmail first, fallback to manual SMTP if needed
    const emailConfig = process.env.EMAIL_PROVIDER === 'outlook' 
      ? {
          host: 'smtp-mail.outlook.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        }
      : {
          service: 'gmail',
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

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: ['info@mulearn.org', 'sachin@mulearn.org'],
        subject,
        html,
        replyTo: data.email,
        attachments: [
          {
            filename: 'mulearn-logo.webp',
            path: path.join(process.cwd(), 'public', 'assets', 'mulearn logo.webp'),
            cid: 'mulearn-logo'
          }
        ]
      };

      await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        message: 'Email sent successfully',
      };
    } catch (error) {
      // Log error without exposing sensitive details
      console.error('Failed to send contact email');
      return {
        success: false,
        message: 'Failed to send email',
      };
    }
  }

  async sendAutoReply(data: EmailData): Promise<{ success: boolean; message: string }> {
    try {
      const autoReplyHtml = EmailTemplates.generateAutoReplyTemplate(data);

      const autoReplyOptions = {
        from: process.env.GMAIL_USER,
        to: data.email,
        subject: 'Thank you for contacting μLearn Foundation - We\'ll be in touch soon! 🚀',
        html: autoReplyHtml,
        attachments: [
          {
            filename: 'mulearn-logo.webp',
            path: path.join(process.cwd(), 'public', 'assets', 'mulearn logo.webp'),
            cid: 'mulearn-logo'
          }
        ]
      };

      await this.transporter.sendMail(autoReplyOptions);
      
      return {
        success: true,
        message: 'Auto-reply sent successfully',
      };
    } catch (error) {
      // Log error without exposing sensitive details
      console.error('Failed to send auto-reply email');
      return {
        success: false,
        message: 'Failed to send auto-reply',
      };
    }
  }
}

export const mailService = new MailService();
export type { EmailData };