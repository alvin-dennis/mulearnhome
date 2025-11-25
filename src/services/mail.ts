import nodemailer from 'nodemailer';

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

  private generateEmailSubject(intent: string, name: string): string {
    const subjectMap: Record<string, string> = {
      student: `New Student Registration - ${name}`,
      partner: `Partnership Inquiry - ${name}`,
      program: `Program Proposal - ${name}`,
      hiring: `Hiring Request - ${name}`,
      events: `Event Inquiry - ${name}`,
      media: `Media Request - ${name}`,
      support: `Technical Support - ${name}`,
      other: `General Inquiry - ${name}`,
    };

    return subjectMap[intent] || `Contact Form Submission - ${name}`;
  }

  private generateEmailBody(data: EmailData): string {
    let html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #456FF6 0%, #8B42FC 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">μLearn Contact Form</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #2d3748; margin-top: 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
            ${this.getIntentLabel(data.intent)}
          </h2>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #4a5568; margin-bottom: 15px;">Contact Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #2d3748; width: 120px;">Name:</td>
                <td style="padding: 8px 0; color: #4a5568;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #2d3748;">Email:</td>
                <td style="padding: 8px 0; color: #4a5568;">${data.email}</td>
              </tr>
              ${data.phone ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #2d3748;">Phone:</td>
                <td style="padding: 8px 0; color: #4a5568;">${data.phone}</td>
              </tr>` : ''}
              ${data.region ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #2d3748;">Region:</td>
                <td style="padding: 8px 0; color: #4a5568;">${data.region}</td>
              </tr>` : ''}
            </table>
          </div>
    `;

    // Add intent-specific fields
    const specificFields = this.getIntentSpecificFields(data);
    if (specificFields) {
      html += specificFields;
    }

    html += `
          <div style="margin: 20px 0;">
            <h3 style="color: #4a5568; margin-bottom: 15px;">Message</h3>
            <div style="background: #f7fafc; padding: 15px; border-radius: 5px; border-left: 4px solid #456FF6;">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #e6fffa; border-radius: 5px; border: 1px solid #81e6d9;">
            <p style="margin: 0; color: #234e52; font-size: 14px;">
              <strong>Submission Time:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    `;

    return html;
  }

  private getIntentLabel(intent: string): string {
    const intentMap: Record<string, string> = {
      student: 'Student Community Registration',
      partner: 'Partnership Inquiry',
      program: 'Program/Challenge Proposal',
      hiring: 'Hiring & Launchpad Request',
      events: 'Events & Speaking Request',
      media: 'Media & Press Inquiry',
      support: 'Technical Support Request',
      other: 'General Inquiry',
    };

    return intentMap[intent] || 'Contact Form Submission';
  }

  private getIntentSpecificFields(data: EmailData): string {
    let fieldsHtml = '';

    switch (data.intent) {
      case 'student':
        if (data.institution || data.courseYear || data.campusChapter || data.interestGroups) {
          fieldsHtml = `
            <div style="margin: 20px 0;">
              <h3 style="color: #4a5568; margin-bottom: 15px;">Student Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${data.institution ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #2d3748; width: 150px;">Institution:</td><td style="padding: 8px 0; color: #4a5568;">${data.institution}</td></tr>` : ''}
                ${data.courseYear ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #2d3748;">Course & Year:</td><td style="padding: 8px 0; color: #4a5568;">${data.courseYear}</td></tr>` : ''}
                ${data.campusChapter ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #2d3748;">Campus Chapter:</td><td style="padding: 8px 0; color: #4a5568;">${data.campusChapter}</td></tr>` : ''}
                ${data.interestGroups ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #2d3748;">Interest Groups:</td><td style="padding: 8px 0; color: #4a5568;">${data.interestGroups}</td></tr>` : ''}
              </table>
            </div>
          `;
        }
        break;

      case 'partner':
        if (data.organization || data.organizationType || data.focusArea || data.timeline) {
          fieldsHtml = `
            <div style="margin: 20px 0;">
              <h3 style="color: #4a5568; margin-bottom: 15px;">Organization Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${data.organization ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #2d3748; width: 150px;">Organization:</td><td style="padding: 8px 0; color: #4a5568;">${data.organization}</td></tr>` : ''}
                ${data.organizationType ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #2d3748;">Type:</td><td style="padding: 8px 0; color: #4a5568;">${data.organizationType}</td></tr>` : ''}
                ${data.focusArea ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #2d3748;">Focus Area:</td><td style="padding: 8px 0; color: #4a5568;">${data.focusArea}</td></tr>` : ''}
                ${data.timeline ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #2d3748;">Timeline:</td><td style="padding: 8px 0; color: #4a5568;">${data.timeline}</td></tr>` : ''}
              </table>
            </div>
          `;
        }
        break;

      case 'program':
        if (data.programType || data.targetCohort || data.timeline || data.budget) {
          fieldsHtml = `
            <div style="margin: 20px 0;">
              <h3 style="color: #4a5568; margin-bottom: 15px;">Program Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${data.programType ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #2d3748; width: 150px;">Program Type:</td><td style="padding: 8px 0; color: #4a5568;">${data.programType}</td></tr>` : ''}
                ${data.targetCohort ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #2d3748;">Target Cohort:</td><td style="padding: 8px 0; color: #4a5568;">${data.targetCohort}</td></tr>` : ''}
                ${data.timeline ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #2d3748;">Timeline:</td><td style="padding: 8px 0; color: #4a5568;">${data.timeline}</td></tr>` : ''}
                ${data.budget ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #2d3748;">Budget:</td><td style="padding: 8px 0; color: #4a5568;">${data.budget}</td></tr>` : ''}
              </table>
            </div>
          `;
        }
        break;

      case 'hiring':
        if (data.role || data.skills || data.numberOfHires || data.budget) {
          fieldsHtml = `
            <div style="margin: 20px 0;">
              <h3 style="color: #4a5568; margin-bottom: 15px;">Hiring Requirements</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${data.role ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #2d3748; width: 150px;">Role:</td><td style="padding: 8px 0; color: #4a5568;">${data.role}</td></tr>` : ''}
                ${data.skills ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #2d3748;">Skills:</td><td style="padding: 8px 0; color: #4a5568;">${data.skills}</td></tr>` : ''}
                ${data.numberOfHires ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #2d3748;">Number of Hires:</td><td style="padding: 8px 0; color: #4a5568;">${data.numberOfHires}</td></tr>` : ''}
                ${data.budget ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #2d3748;">Compensation:</td><td style="padding: 8px 0; color: #4a5568;">${data.budget}</td></tr>` : ''}
              </table>
            </div>
          `;
        }
        break;

      case 'events':
        if (data.eventName || data.eventDate) {
          fieldsHtml = `
            <div style="margin: 20px 0;">
              <h3 style="color: #4a5568; margin-bottom: 15px;">Event Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${data.eventName ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #2d3748; width: 150px;">Event Name:</td><td style="padding: 8px 0; color: #4a5568;">${data.eventName}</td></tr>` : ''}
                ${data.eventDate ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #2d3748;">Event Date:</td><td style="padding: 8px 0; color: #4a5568;">${data.eventDate}</td></tr>` : ''}
              </table>
            </div>
          `;
        }
        break;

      case 'media':
        if (data.outlet || data.deadline) {
          fieldsHtml = `
            <div style="margin: 20px 0;">
              <h3 style="color: #4a5568; margin-bottom: 15px;">Media Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${data.outlet ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #2d3748; width: 150px;">Media Outlet:</td><td style="padding: 8px 0; color: #4a5568;">${data.outlet}</td></tr>` : ''}
                ${data.deadline ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #2d3748;">Deadline:</td><td style="padding: 8px 0; color: #4a5568;">${data.deadline}</td></tr>` : ''}
              </table>
            </div>
          `;
        }
        break;

      case 'support':
        if (data.issueCategory) {
          fieldsHtml = `
            <div style="margin: 20px 0;">
              <h3 style="color: #4a5568; margin-bottom: 15px;">Support Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold; color: #2d3748; width: 150px;">Issue Category:</td><td style="padding: 8px 0; color: #4a5568;">${data.issueCategory}</td></tr>
              </table>
            </div>
          `;
        }
        break;
    }

    return fieldsHtml;
  }

  async sendContactEmail(data: EmailData): Promise<{ success: boolean; message: string }> {
    try {
      const subject = this.generateEmailSubject(data.intent, data.name);
      const html = this.generateEmailBody(data);

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.CONTACT_EMAIL || process.env.GMAIL_USER,
        subject,
        html,
        replyTo: data.email,
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
      const autoReplyHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #456FF6 0%, #8B42FC 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Contacting μLearn!</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #2d3748; margin-top: 0;">Hi ${data.name},</h2>
            
            <p style="color: #4a5568; line-height: 1.6;">Thank you for reaching out to us regarding <strong>${this.getIntentLabel(data.intent).toLowerCase()}</strong>.</p>
            
            <p style="color: #4a5568; line-height: 1.6;">We have received your message and our team will get back to you soon. Here's what happens next:</p>
            
            <ul style="color: #4a5568; line-height: 1.6;">
              <li>Our team will review your inquiry within 24-48 hours</li>
              <li>You'll receive a personalized response from the relevant department</li>
              <li>We'll provide you with the information or assistance you need</li>
            </ul>
            
            <div style="margin: 30px 0; padding: 20px; background: #f7fafc; border-radius: 8px; border-left: 4px solid #456FF6;">
              <p style="margin: 0; color: #2d3748; font-weight: bold;">Your Reference Details:</p>
              <p style="margin: 5px 0 0 0; color: #4a5568; font-size: 14px;">Inquiry Type: ${this.getIntentLabel(data.intent)}</p>
              <p style="margin: 5px 0 0 0; color: #4a5568; font-size: 14px;">Submission Time: ${new Date().toLocaleString()}</p>
            </div>
            
            <p style="color: #4a5568; line-height: 1.6;">In the meantime, feel free to explore our community and resources:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://mulearn.org" style="display: inline-block; background: linear-gradient(135deg, #456FF6 0%, #8B42FC 100%); color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Visit μLearn</a>
            </div>
            
            <p style="color: #718096; font-size: 14px; line-height: 1.6;">Best regards,<br>The μLearn Team</p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            
            <p style="color: #a0aec0; font-size: 12px; text-align: center;">This is an automated response. Please do not reply to this email.</p>
          </div>
        </div>
      `;

      const autoReplyOptions = {
        from: process.env.GMAIL_USER,
        to: data.email,
        subject: 'Thank you for contacting μLearn - We\'ll be in touch soon!',
        html: autoReplyHtml,
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