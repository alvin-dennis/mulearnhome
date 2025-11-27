import { NextRequest, NextResponse } from 'next/server';
import { mailService, EmailData } from '@/services/mail';

const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000,
  maxRequests: 10,
  cleanupIntervalMs: 60 * 60 * 1000,
} as const;

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const cleanupExpiredEntries = () => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
};

const cleanupTimer = setInterval(cleanupExpiredEntries, RATE_LIMIT_CONFIG.cleanupIntervalMs);

process.on('SIGTERM', () => clearInterval(cleanupTimer));
process.on('SIGINT', () => clearInterval(cleanupTimer));

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { 
      count: 1, 
      resetTime: now + RATE_LIMIT_CONFIG.windowMs 
    });
    return false;
  }
  
  if (record.count >= RATE_LIMIT_CONFIG.maxRequests) {
    return true;
  }
  
  record.count++;
  return false;
}

function validateEmailData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.intent?.trim()) {
    errors.push('Intent is required');
  }
  
  if (!data.name?.trim()) {
    errors.push('Name is required');
  } else if (data.name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }
  
  if (!data.email?.trim()) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(data.email) || data.email.length > 254) {
      errors.push('Invalid email format');
    }
  }
  
  if (!data.message?.trim()) {
    errors.push('Message is required');
  } else if (data.message.length > 5000) {
    errors.push('Message must be less than 5000 characters');
  }
  
  if (!data.consent) {
    errors.push('Consent is required');
  }
  
  const sanitizeString = (str: string) => {
    return str
      .replace(/<[^>]*>/g, '')
      .replace(/[<>"'&]/g, '')
      .trim()
      .substring(0, 1000);
  };
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'string') {
      data[key] = sanitizeString(data[key]);
    }
  });
  
  return { isValid: errors.length === 0, errors };
}

export async function POST(request: NextRequest) {
  const headers = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  };

  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json(
        { success: false, message: 'Service temporarily unavailable.' },
        { status: 503, headers }
      );
    }

    const ip = getClientIP(request);
    
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Too many requests. Please try again in 15 minutes.' 
        },
        { status: 429, headers }
      );
    }
    
    const body = await request.json();
    
    const { isValid, errors } = validateEmailData(body);
    
    if (!isValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed', 
          errors 
        },
        { status: 400, headers }
      );
    }
    
    let ticketId = '';
    
    try {
      const datasheetResponse = await fetch(`${request.nextUrl.origin}/api/datasheet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      if (datasheetResponse.ok) {
        const datasheetResult = await datasheetResponse.json();
        ticketId = datasheetResult.ticketId || '';
      }
    } catch (error) {
      // Continue without ticket ID if datasheet fails
    }
    
    const emailData: EmailData = {
      intent: body.intent,
      name: body.name,
      email: body.email,
      phone: body.phone,
      region: body.region,
      message: body.message,
      institution: body.institution,
      courseYear: body.courseYear,
      campusChapter: body.campusChapter,
      interestGroups: body.interestGroups,
      organization: body.organization,
      organizationType: body.organizationType,
      focusArea: body.focusArea,
      timeline: body.timeline,
      budget: body.budget,
      programType: body.programType,
      targetCohort: body.targetCohort,
      role: body.role,
      skills: body.skills,
      numberOfHires: body.numberOfHires,
      eventName: body.eventName,
      eventDate: body.eventDate,
      outlet: body.outlet,
      deadline: body.deadline,
      issueCategory: body.issueCategory,
      ticketId: ticketId,
    };
    
    const emailPromises = [
      mailService.sendContactEmail(emailData),
      mailService.sendAutoReply(emailData)
    ];
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Email timeout')), 30000)
    );
    
    const [contactResult, autoReplyResult] = await Promise.allSettled([
      Promise.race([emailPromises[0], timeoutPromise]),
      Promise.race([emailPromises[1], timeoutPromise])
    ]);
    
    const contactSuccess = contactResult.status === 'fulfilled' && 
      (contactResult.value as { success: boolean }).success;
    const autoReplySuccess = autoReplyResult.status === 'fulfilled' && 
      (autoReplyResult.value as { success: boolean }).success;
    
    if (contactSuccess) {
      return NextResponse.json({
        success: true,
        message: 'Your message has been sent successfully! We\'ll get back to you soon.',
        ticketId: ticketId,
        autoReplyStatus: autoReplySuccess ? 'sent' : 'failed'
      }, { headers });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Unable to send message at this time. Please try again later.',
        },
        { status: 500, headers }
      );
    }
    
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Service temporarily unavailable. Please try again later.',
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