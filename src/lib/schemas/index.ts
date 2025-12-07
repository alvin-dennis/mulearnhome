/**
 * Central export file for all Zod schemas
 * Import from '@/lib/schemas' for all validation needs
 */

// Common reusable schemas
export {
    emailSchema,
    phoneSchema,
    nameSchema,
    panSchema,
    addressSchema,
    messageSchema,
    consentSchema,
} from "./common";
export type { Email, Phone, Name, PAN, Address } from "./common";

// Donation schemas
export {
    donationTypeSchema,
    donationFormSchema,
    donationPayloadSchema,
} from "./donation";
export type {
    DonationType,
    DonationFormData,
    DonationPayload,
    DonationFormPayload,
    RazorpayOrderResponse,
    RazorpaySubscriptionResponse,
    RazorpayErrorResponse,
} from "./donation";

// Contact schemas
export {
    contactIntentSchema,
    contactFormSchema,
    emailDataSchema,
    contactApiRequestSchema,
} from "./contact";
export type {
    ContactIntent,
    ContactFormData,
    EmailData,
    ContactApiRequest,
} from "./contact";
