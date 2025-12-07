import { type NextRequest, NextResponse } from "next/server";
import { serverEnv } from "@/lib/env/env.server";
import { contactFormSchema, type EmailData } from "@/lib/schemas/contact";

// DatasheetData extends EmailData with additional fields for tracking
export interface DatasheetData extends EmailData {
  ticketId: string;
  submittedAt: string;
}

function generateTicketId(): string {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `MU${year}${month}${day}${hours}${minutes}`;
}

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
};

export async function POST(request: NextRequest) {
  try {
    // Check required environment variables
    if (!serverEnv.GOOGLE_APPS_SCRIPT_URL || !serverEnv.GOOGLE_APPS_SCRIPT_SECRET) {
      return NextResponse.json(
        { success: false, message: "Datasheet service not configured." },
        { status: 503, headers: securityHeaders },
      );
    }

    const body = await request.json();

    // Zod handles validation AND sanitization - no manual sanitizeString needed
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Invalid data provided" },
        { status: 400, headers: securityHeaders },
      );
    }

    const validatedData = result.data;
    const ticketId = generateTicketId();
    const submittedAt = new Date().toISOString();

    // Build datasheet data from validated Zod output
    const datasheetData: DatasheetData = {
      ticketId,
      submittedAt,
      intent: validatedData.intent,
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone || "",
      region: validatedData.region || "",
      message: validatedData.message || "",
      institution: validatedData.institution || "",
      courseYear: validatedData.courseYear || "",
      campusChapter: validatedData.campusChapter || "",
      interestGroups: validatedData.interestGroups || "",
      organization: validatedData.organization || "",
      organizationType: validatedData.organizationType || "",
      focusArea: validatedData.focusArea || "",
      timeline: validatedData.timeline || "",
      budget: validatedData.budget || "",
      programType: validatedData.programType || "",
      targetCohort: validatedData.targetCohort || "",
      role: validatedData.role || "",
      skills: validatedData.skills || "",
      numberOfHires: validatedData.numberOfHires || "",
      eventName: validatedData.eventName || "",
      eventDate: validatedData.eventDate || "",
      outlet: validatedData.outlet || "",
      deadline: validatedData.deadline || "",
      issueCategory: validatedData.issueCategory || "",
    };

    const appsScriptUrl = new URL(serverEnv.GOOGLE_APPS_SCRIPT_URL);
    appsScriptUrl.searchParams.append(
      "authorization",
      `Bearer ${serverEnv.GOOGLE_APPS_SCRIPT_SECRET}`,
    );

    const appsScriptResponse = await fetch(appsScriptUrl.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datasheetData),
    });

    if (!appsScriptResponse.ok) {
      throw new Error("External service error");
    }

    const responseData = await appsScriptResponse.json();

    if (responseData.success) {
      return NextResponse.json(
        { success: true, ticketId, message: "Data saved to sheet successfully" },
        { headers: securityHeaders },
      );
    }

    throw new Error(responseData.message || "Failed to save data to sheet");
  } catch (_error) {
    return NextResponse.json(
      { success: false, message: "Service temporarily unavailable" },
      { status: 500, headers: securityHeaders },
    );
  }
}
