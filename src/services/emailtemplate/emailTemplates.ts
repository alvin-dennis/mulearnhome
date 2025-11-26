import type { EmailData } from '../mail';

export class EmailTemplates {
  
  static getIntentLabel(intent: string): string {
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

  static generateEmailSubject(intent: string, name: string): string {
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

  static getIntentSpecificFields(data: EmailData): string {
    let fieldsHtml = '';

    switch (data.intent) {
      case 'student':
        if (data.institution || data.courseYear || data.campusChapter || data.interestGroups) {
          fieldsHtml = `
            <div style="background: #fefefe; border: 1px solid #c4c4c4; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
              <h3 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'CirceRounded', 'Plus Jakarta Sans', sans-serif;">Student Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${data.institution ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; width: 150px; font-size: 14px;">Institution:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.institution}</td></tr>` : ''}
                ${data.courseYear ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Course & Year:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.courseYear}</td></tr>` : ''}
                ${data.campusChapter ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Campus Chapter:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.campusChapter}</td></tr>` : ''}
                ${data.interestGroups ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Interest Groups:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.interestGroups}</td></tr>` : ''}
              </table>
            </div>
          `;
        }
        break;

      case 'partner':
        if (data.organization || data.organizationType || data.focusArea || data.timeline) {
          fieldsHtml = `
            <div style="background: #fefefe; border: 1px solid #c4c4c4; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
              <h3 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'CirceRounded', 'Plus Jakarta Sans', sans-serif;">Organization Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${data.organization ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; width: 150px; font-size: 14px;">Organization:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.organization}</td></tr>` : ''}
                ${data.organizationType ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Type:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.organizationType}</td></tr>` : ''}
                ${data.focusArea ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Focus Area:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.focusArea}</td></tr>` : ''}
                ${data.timeline ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Timeline:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.timeline}</td></tr>` : ''}
              </table>
            </div>
          `;
        }
        break;

      case 'program':
        if (data.programType || data.targetCohort || data.timeline || data.budget) {
          fieldsHtml = `
            <div style="background: #fefefe; border: 1px solid #c4c4c4; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
              <h3 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'CirceRounded', 'Plus Jakarta Sans', sans-serif;">Program Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${data.programType ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; width: 150px; font-size: 14px;">Program Type:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.programType}</td></tr>` : ''}
                ${data.targetCohort ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Target Cohort:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.targetCohort}</td></tr>` : ''}
                ${data.timeline ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Timeline:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.timeline}</td></tr>` : ''}
                ${data.budget ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Budget:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.budget}</td></tr>` : ''}
              </table>
            </div>
          `;
        }
        break;

      case 'hiring':
        if (data.role || data.skills || data.numberOfHires || data.budget) {
          fieldsHtml = `
            <div style="background: #fefefe; border: 1px solid #c4c4c4; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
              <h3 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'CirceRounded', 'Plus Jakarta Sans', sans-serif;">Hiring Requirements</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${data.role ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; width: 150px; font-size: 14px;">Role:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.role}</td></tr>` : ''}
                ${data.skills ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Skills:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.skills}</td></tr>` : ''}
                ${data.numberOfHires ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Number of Hires:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.numberOfHires}</td></tr>` : ''}
                ${data.budget ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Compensation:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.budget}</td></tr>` : ''}
              </table>
            </div>
          `;
        }
        break;

      case 'events':
        if (data.eventName || data.eventDate) {
          fieldsHtml = `
            <div style="background: #fefefe; border: 1px solid #c4c4c4; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
              <h3 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'CirceRounded', 'Plus Jakarta Sans', sans-serif;">Event Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${data.eventName ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; width: 150px; font-size: 14px;">Event Name:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.eventName}</td></tr>` : ''}
                ${data.eventDate ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Event Date:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.eventDate}</td></tr>` : ''}
              </table>
            </div>
          `;
        }
        break;

      case 'media':
        if (data.outlet || data.deadline) {
          fieldsHtml = `
            <div style="background: #fefefe; border: 1px solid #c4c4c4; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
              <h3 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'CirceRounded', 'Plus Jakarta Sans', sans-serif;">Media Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${data.outlet ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; width: 150px; font-size: 14px;">Media Outlet:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.outlet}</td></tr>` : ''}
                ${data.deadline ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Deadline:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.deadline}</td></tr>` : ''}
              </table>
            </div>
          `;
        }
        break;

      case 'support':
        if (data.issueCategory) {
          fieldsHtml = `
            <div style="background: #fefefe; border: 1px solid #c4c4c4; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
              <h3 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'CirceRounded', 'Plus Jakarta Sans', sans-serif;">Support Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; width: 150px; font-size: 14px;">Issue Category:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.issueCategory}</td></tr>
              </table>
            </div>
          `;
        }
        break;
    }

    return fieldsHtml;
  }

  static generateContactEmailTemplate(data: EmailData): string {
    const specificFields = this.getIntentSpecificFields(data);
    const currentDate = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>μLearn Contact Form</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #fefefe; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #2E85FE 0%, #AF2EE6 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #fefefe; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 1px; font-family: 'CirceRounded', 'Plus Jakarta Sans', sans-serif;">
            New Enquiry</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <div style="border-left: 4px solid #2E85FE; padding-left: 20px; margin-bottom: 30px;">
              <h2 style="color: #1a1a1a; margin: 0 0 5px 0; font-size: 22px; font-weight: 600; font-family: 'CirceRounded', 'Plus Jakarta Sans', sans-serif;">
                ${this.getIntentLabel(data.intent)}
              </h2>
              <p style="color: #666771; margin: 0; font-size: 14px;">Received on ${currentDate}</p>
            </div>
            
            <!-- Contact Information -->
            <div style="background: #fefefe; border: 1px solid #c4c4c4; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
              <h3 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'CirceRounded', 'Plus Jakarta Sans', sans-serif;">Contact Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; width: 120px; font-size: 14px;">Full Name:</td>
                  <td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Email:</td>
                  <td style="padding: 8px 0; color: #666771; font-size: 14px;"><a href="mailto:${data.email}" style="color: #2E85FE; text-decoration: none;">${data.email}</a></td>
                </tr>
                ${data.phone ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Phone:</td>
                  <td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.phone}</td>
                </tr>` : ''}
                ${data.region ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Region:</td>
                  <td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.region}</td>
                </tr>` : ''}
              </table>
            </div>
            
            ${specificFields}
            
            <!-- Message -->
            <div style="margin-bottom: 30px;">
              <h3 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'CirceRounded', 'Plus Jakarta Sans', sans-serif;">Message</h3>
              <div style="background: #fefefe; border: 1px solid #c4c4c4; padding: 20px; border-radius: 8px; border-left: 4px solid #2E85FE; line-height: 1.6; color: #666771;">
                ${data.message.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #ffffffff; padding: 30px; text-align: center;">
            <img src="cid:mulearn-logo" alt="μLearn Foundation" style="height: 40px; margin-bottom: 15px; filter: brightness(0) invert(1);">
            <p style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 14px; font-weight: 300;">
              μLearn Foundation | Copyright © ${new Date().getFullYear()} All rights reserved.
            </p>
            <p style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 12px;">
              Technopark Phase 1, Thiruvananthapuram, Kerala - 695581
            </p>
            <div style="margin: 15px 0;">
              <a href="mailto:info@mulearn.org" style="color: #2E85FE; text-decoration: none; margin: 0 10px; font-size: 12px;">info@mulearn.org</a>
              <span style="color: #1a1a1a;">|</span>
              <span style="color: #1a1a1a; margin: 0 10px; font-size: 12px;">+91 89436 47000</span>
              <span style="color: #1a1a1a;">|</span>
              <a href="https://www.mulearn.org" style="color: #2E85FE; text-decoration: none; margin: 0 10px; font-size: 12px;">www.mulearn.org</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  static generateAutoReplyTemplate(data: EmailData): string {
    const currentDate = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You - μLearn Foundation</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #fefefe; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #2E85FE 0%, #AF2EE6 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #fefefe; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 1px; font-family: 'CirceRounded', 'Plus Jakarta Sans', sans-serif;">
              Thank You!
            </h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <div style="border-left: 4px solid #2E85FE; padding-left: 20px; margin-bottom: 30px;">
              <h2 style="color: #1a1a1a; margin: 0 0 5px 0; font-size: 22px; font-weight: 600; font-family: 'CirceRounded', 'Plus Jakarta Sans', sans-serif;">
                Hello ${data.name}
              </h2>
              <p style="color: #666771; margin: 0; font-size: 14px;">Your message has been received on ${currentDate}</p>
            </div>
            
            <p style="color: #666771; line-height: 1.7; font-size: 16px; margin-bottom: 25px;">
              Thank you for contacting μLearn Foundation regarding <strong style="color: #2E85FE;">${this.getIntentLabel(data.intent).toLowerCase()}</strong>. 
              We appreciate your interest in our mission to democratize quality education and build a tech-enabled learning ecosystem.
            </p>
            
            <!-- What's Next -->
            <div style="background: #fefefe; border: 1px solid #c4c4c4; border-radius: 12px; padding: 25px; margin: 25px 0;">
              <h3 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'CirceRounded', 'Plus Jakarta Sans', sans-serif;">What happens next?</h3>
              <div style="color: #666771; line-height: 1.6;">
                <div style="margin: 10px 0;">
                  • Our team will carefully review your inquiry within 24-48 hours
                </div>
                <div style="margin: 10px 0;">
                  • You'll receive a personalized response from our relevant department
                </div>
                <div style="margin: 10px 0;">
                  • We'll work together to address your needs and questions
                </div>
              </div>
            </div>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="https://mulearn.org" style="display: inline-block; background: linear-gradient(135deg, #2E85FE 0%, #AF2EE6 100%); color: #fefefe; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px; margin: 0 8px 8px 0;">Visit μLearn</a>
            </div>
            
            <div style="border-top: 1px solid #c4c4c4; padding-top: 25px; margin-top: 30px;">
              <p style="color: #666771; font-size: 14px; line-height: 1.6; margin: 0;">
                Best regards,<br>
                <strong style="color: #1a1a1a;">The μLearn Foundation Team</strong>
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #ffffffff; padding: 30px; text-align: center;">
            <img src="cid:mulearn-logo" alt="μLearn Foundation" style="height: 40px; margin-bottom: 15px; filter: brightness(0) invert(1);">
            <p style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 14px; font-weight: 300;">
              μLearn Foundation | Copyright © ${new Date().getFullYear()} All rights reserved.
            </p>
            <p style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 12px;">
              Technopark Phase 1, Thiruvananthapuram, Kerala - 695581
            </p>
            <div style="margin: 15px 0;">
              <a href="mailto:info@mulearn.org" style="color: #2E85FE; text-decoration: none; margin: 0 10px; font-size: 12px;">info@mulearn.org</a>
              <span style="color: #1a1a1a;">|</span>
              <span style="color: #1a1a1a; margin: 0 10px; font-size: 12px;">+91 89436 47000</span>
              <span style="color: #1a1a1a;">|</span>
              <a href="https://www.mulearn.org" style="color: #2E85FE; text-decoration: none; margin: 0 10px; font-size: 12px;">www.mulearn.org</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}