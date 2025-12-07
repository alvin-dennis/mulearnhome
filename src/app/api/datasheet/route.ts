import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema, type EmailData } from '@/lib/schemas/contact';

// DatasheetData extends EmailData with additional fields for tracking
export interface DatasheetData extends EmailData {
  ticketId: string;
  submittedAt: string;
}

function generateTicketId(): string {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `MU${year}${month}${day}${hours}${minutes}`;
}

function sanitizeString(str: string): string {
  return str.replace(/<[^>]*>/g, '').replace(/[<>"'&]/g, '').trim().substring(0, 1000);
}

/**
 * Validates datasheet data using Zod schema
 */
function validateDatasheetData(data: unknown): { isValid: boolean; errors: string[] } {
  const result = contactFormSchema.safeParse(data);

  if (!result.success) {
    const errors = result.error.issues.map((e: { message: string }) => e.message);
    return { isValid: false, errors };
  }

  return { isValid: true, errors: [] };
}

export async function POST(request: NextRequest) {
  const headers = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  };

  try {
    if (!process.env.GOOGLE_APPS_SCRIPT_URL || !process.env.GOOGLE_APPS_SCRIPT_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Datasheet service not configured.' },
        { status: 503, headers }
      );
    }

    const body = await request.json();

    const { isValid, errors } = validateDatasheetData(body);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid data provided' },
        { status: 400, headers }
      );
    }

    const ticketId = generateTicketId();
    const submittedAt = new Date().toISOString();

    const datasheetData: DatasheetData = {
      ticketId,
      intent: sanitizeString(body.intent || ''),
      name: sanitizeString(body.name || ''),
      email: sanitizeString(body.email || ''),
      phone: sanitizeString(body.phone || ''),
      region: sanitizeString(body.region || ''),
      message: sanitizeString(body.message || ''),
      institution: sanitizeString(body.institution || ''),
      courseYear: sanitizeString(body.courseYear || ''),
      campusChapter: sanitizeString(body.campusChapter || ''),
      interestGroups: sanitizeString(body.interestGroups || ''),
      organization: sanitizeString(body.organization || ''),
      organizationType: sanitizeString(body.organizationType || ''),
      focusArea: sanitizeString(body.focusArea || ''),
      timeline: sanitizeString(body.timeline || ''),
      budget: sanitizeString(body.budget || ''),
      programType: sanitizeString(body.programType || ''),
      targetCohort: sanitizeString(body.targetCohort || ''),
      role: sanitizeString(body.role || ''),
      skills: sanitizeString(body.skills || ''),
      numberOfHires: sanitizeString(body.numberOfHires || ''),
      eventName: sanitizeString(body.eventName || ''),
      eventDate: sanitizeString(body.eventDate || ''),
      outlet: sanitizeString(body.outlet || ''),
      deadline: sanitizeString(body.deadline || ''),
      issueCategory: sanitizeString(body.issueCategory || ''),
      submittedAt
    };

    const appsScriptUrl = new URL(process.env.GOOGLE_APPS_SCRIPT_URL);
    appsScriptUrl.searchParams.append('authorization', `Bearer ${process.env.GOOGLE_APPS_SCRIPT_SECRET}`);

    const appsScriptResponse = await fetch(appsScriptUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datasheetData),
    });

    if (!appsScriptResponse.ok) {
      throw new Error('External service error');
    }

    const result = await appsScriptResponse.json();

    if (result.success) {
      return NextResponse.json({
        success: true,
        ticketId,
        message: 'Data saved to sheet successfully',
      }, { headers });
    } else {
      throw new Error(result.message || 'Failed to save data to sheet');
    }

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Service temporarily unavailable'
      },
      { status: 500, headers }
    );
  }
}

const methodHeaders = {
  'Allow': 'POST',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405, headers: methodHeaders }
  );
}

export async function PUT() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405, headers: methodHeaders }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405, headers: methodHeaders }
  );
}