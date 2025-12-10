import type { EmailData } from "../mail";

export const EmailTemplates = {
  getIntentLabel: (intent: string): string => {
    const intentMap: Record<string, string> = {
      student: "Student Community Registration",
      partner: "Partnership Inquiry",
      program: "Program/Challenge Proposal",
      hiring: "Hiring & Launchpad Request",
      events: "Events & Speaking Request",
      media: "Media & Press Inquiry",
      support: "Technical Support Request",
      other: "General Inquiry",
    };

    return intentMap[intent] || "Contact Form Submission";
  },

  generateEmailSubject: (intent: string, name: string): string => {
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
  },

  getIntentSpecificFields: (data: EmailData): string => {
    let fieldsHtml = "";

    switch (data.intent) {
      case "student":
        if (data.institution || data.courseYear || data.campusChapter || data.interestGroups) {
          fieldsHtml = `
            <div style="background: #fefefe; border: 1px solid #c4c4c4; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
              <h3 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'CirceRounded', 'Plus Jakarta Sans', sans-serif;">Student Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${data.institution ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; width: 150px; font-size: 14px;">Institution:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.institution}</td></tr>` : ""}
                ${data.courseYear ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Course & Year:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.courseYear}</td></tr>` : ""}
                ${data.campusChapter ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Campus Chapter:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.campusChapter}</td></tr>` : ""}
                ${data.interestGroups ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Interest Groups:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.interestGroups}</td></tr>` : ""}
              </table>
            </div>
          `;
        }
        break;

      case "partner":
        if (data.organization || data.organizationType || data.focusArea || data.timeline) {
          fieldsHtml = `
            <div style="background: #fefefe; border: 1px solid #c4c4c4; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
              <h3 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'CirceRounded', 'Plus Jakarta Sans', sans-serif;">Organization Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${data.organization ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; width: 150px; font-size: 14px;">Organization:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.organization}</td></tr>` : ""}
                ${data.organizationType ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Type:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.organizationType}</td></tr>` : ""}
                ${data.focusArea ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Focus Area:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.focusArea}</td></tr>` : ""}
                ${data.timeline ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Timeline:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.timeline}</td></tr>` : ""}
              </table>
            </div>
          `;
        }
        break;

      case "program":
        if (data.programType || data.targetCohort || data.timeline || data.budget) {
          fieldsHtml = `
            <div style="background: #fefefe; border: 1px solid #c4c4c4; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
              <h3 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'CirceRounded', 'Plus Jakarta Sans', sans-serif;">Program Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${data.programType ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; width: 150px; font-size: 14px;">Program Type:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.programType}</td></tr>` : ""}
                ${data.targetCohort ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Target Cohort:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.targetCohort}</td></tr>` : ""}
                ${data.timeline ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Timeline:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.timeline}</td></tr>` : ""}
                ${data.budget ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Budget:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.budget}</td></tr>` : ""}
              </table>
            </div>
          `;
        }
        break;

      case "hiring":
        if (data.role || data.skills || data.numberOfHires || data.budget) {
          fieldsHtml = `
            <div style="background: #fefefe; border: 1px solid #c4c4c4; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
              <h3 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'CirceRounded', 'Plus Jakarta Sans', sans-serif;">Hiring Requirements</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${data.role ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; width: 150px; font-size: 14px;">Role:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.role}</td></tr>` : ""}
                ${data.skills ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Skills:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.skills}</td></tr>` : ""}
                ${data.numberOfHires ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Number of Hires:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.numberOfHires}</td></tr>` : ""}
                ${data.budget ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Compensation:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.budget}</td></tr>` : ""}
              </table>
            </div>
          `;
        }
        break;

      case "events":
        if (data.eventName || data.eventDate) {
          fieldsHtml = `
            <div style="background: #fefefe; border: 1px solid #c4c4c4; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
              <h3 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'CirceRounded', 'Plus Jakarta Sans', sans-serif;">Event Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${data.eventName ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; width: 150px; font-size: 14px;">Event Name:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.eventName}</td></tr>` : ""}
                ${data.eventDate ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Event Date:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.eventDate}</td></tr>` : ""}
              </table>
            </div>
          `;
        }
        break;

      case "media":
        if (data.outlet || data.deadline) {
          fieldsHtml = `
            <div style="background: #fefefe; border: 1px solid #c4c4c4; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
              <h3 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'CirceRounded', 'Plus Jakarta Sans', sans-serif;">Media Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${data.outlet ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; width: 150px; font-size: 14px;">Media Outlet:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.outlet}</td></tr>` : ""}
                ${data.deadline ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Deadline:</td><td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.deadline}</td></tr>` : ""}
              </table>
            </div>
          `;
        }
        break;

      case "support":
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
  },

  generateContactEmailTemplate: (data: EmailData): string => {
    const specificFields = EmailTemplates.getIntentSpecificFields(data);
    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
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
                ${EmailTemplates.getIntentLabel(data.intent)}
              </h2>
              <p style="color: #666771; margin: 0 0 5px 0; font-size: 14px;">Received on ${currentDate}</p>
              ${data.ticketId ? `<p style="color: #2E85FE; margin: 0; font-size: 14px; font-weight: 600;">Ticket ID: ${data.ticketId}</p>` : ""}
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
                ${
                  data.phone
                    ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Phone:</td>
                  <td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.phone}</td>
                </tr>`
                    : ""
                }
                ${
                  data.region
                    ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Region:</td>
                  <td style="padding: 8px 0; color: #666771; font-size: 14px;">${data.region}</td>
                </tr>`
                    : ""
                }
              </table>
            </div>
            
            ${specificFields}
            
            <!-- Message -->
            <div style="margin-bottom: 30px;">
              <h3 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'CirceRounded', 'Plus Jakarta Sans', sans-serif;">Message</h3>
              <div style="background: #fefefe; border: 1px solid #c4c4c4; padding: 20px; border-radius: 8px; border-left: 4px solid #2E85FE; line-height: 1.6; color: #666771;">
                ${data.message.replace(/\n/g, "<br>")}
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #ffffffff; padding: 30px; text-align: center;">
            <img src="cid:mulearn-logo" alt="μLearn Foundation" style="height: 40px; margin-bottom: 15px; filter: brightness(0) invert(1);">
            <p style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 14px; font-weight: 300;">
             <b>μLearn Foundation | Copyright © ${new Date().getFullYear()} All rights reserved.</b>
            </p>
            <p style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 12px;">
              <b>Technopark Phase 1, Thiruvananthapuram, Kerala - 695581</b>
            </p>
            <div style="margin: 15px 0;">
              <a href="mailto:info@mulearn.org" style="color: #2E85FE; text-decoration: none; margin: 0 10px; font-size: 12px;">info@mulearn.org</a>
              <span style="color: #1a1a1a;">|</span>
              <a href="https://www.mulearn.org" style="color: #2E85FE; text-decoration: none; margin: 0 10px; font-size: 12px;">www.mulearn.org</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  generateAutoReplyTemplate: (data: EmailData): string => {
    const _currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
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
            <div style="margin-bottom: 30px;">
              <h2 style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 24px; font-weight: 600; font-family: 'CirceRounded', 'Plus Jakarta Sans', sans-serif;">
                Dear ${data.name},
              </h2>
              ${data.ticketId ? `<div style="background: #f8f9fa; border: 1px solid #e9ecef; color: #495057; padding: 12px 20px; border-radius: 8px; margin: 20px 0; text-align: center; font-size: 14px;"><strong>Reference ID: ${data.ticketId}</strong></div>` : ""}
            </div>
            
            <p style="color: #333333; line-height: 1.8; font-size: 16px; margin-bottom: 25px;">
              Thank you for reaching out to μLearn Foundation. We have received your inquiry regarding <strong>${EmailTemplates.getIntentLabel(data.intent).toLowerCase()}</strong> and appreciate your interest in our programs and initiatives.
            </p>
            
            <p style="color: #333333; line-height: 1.8; font-size: 16px; margin-bottom: 25px;">
              Our team is committed to providing you with comprehensive information and support. We will carefully review your submission and ensure you receive the most relevant and helpful response.
            </p>
            
            <div style="background: #f8f9fa; border-radius: 8px; padding: 25px; margin: 25px 0;">
              <h3 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; font-family: 'CirceRounded', 'Plus Jakarta Sans', sans-serif;">Next Steps</h3>
              <p style="color: #495057; line-height: 1.6; margin: 0; font-size: 15px;">
                Our dedicated team will review your submission and respond within 24-48 hours with detailed information tailored to your specific requirements. We look forward to discussing how μLearn Foundation can support your goals.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #666771; font-size: 14px; margin-bottom: 15px;">
                Stay connected with our latest updates and initiatives
              </p>
              <a href="https://mulearn.org" style="display: inline-block; background: linear-gradient(135deg, #2E85FE 0%, #AF2EE6 100%); color: #fefefe; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px;">Explore μLearn</a>
            </div>
            
            <div style="border-top: 1px solid #e9ecef; padding-top: 25px; margin-top: 35px;">
              <p style="color: #495057; font-size: 15px; line-height: 1.6; margin: 0;">
                Warm regards,<br><br>
                <strong style="color: #1a1a1a;">The μLearn Foundation Team</strong><br>
                <span style="color: #6c757d; font-size: 13px;">Empowering learners, building futures</span>
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #ffffffff; padding: 30px; text-align: center;">
            <img src="cid:mulearn-logo" alt="μLearn Foundation" style="height: 40px; margin-bottom: 15px; filter: brightness(0) invert(1);">
            <p style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 14px; font-weight: 300;">
             <b>μLearn Foundation | Copyright © ${new Date().getFullYear()} All rights reserved.</b>
            </p>
            <p style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 12px;">
             <b>Technopark Phase 1, Thiruvananthapuram, Kerala - 695581</b>
            </p>
            <div style="margin: 15px 0;">
              <a href="mailto:info@mulearn.org" style="color: #2E85FE; text-decoration: none; margin: 0 10px; font-size: 12px;">info@mulearn.org</a>      
              <span style="color: #1a1a1a;">|</span>
              <a href="https://www.mulearn.org" style="color: #2E85FE; text-decoration: none; margin: 0 10px; font-size: 12px;">www.mulearn.org</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  },
};
