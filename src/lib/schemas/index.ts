/**
 * Central export file for all Zod schemas
 * Import from '@/lib/schemas' for all validation needs
 */

export type { Address, Email, Name, PAN, Phone } from "./common";
// Common reusable schemas
export {
  addressSchema,
  consentSchema,
  emailSchema,
  messageSchema,
  nameSchema,
  panSchema,
  phoneSchema,
} from "./common";
export type {
  ContactApiRequest,
  ContactFormData,
  ContactIntent,
  EmailData,
} from "./contact";
// Contact schemas
export {
  contactApiRequestSchema,
  contactFormSchema,
  contactIntentSchema,
  emailDataSchema,
} from "./contact";
export type {
  DonationFormData,
  DonationFormPayload,
  DonationPayload,
  DonationType,
  RazorpayErrorResponse,
  RazorpayOrderResponse,
  RazorpaySubscriptionResponse,
} from "./donation";
// Donation schemas
export {
  donationFormSchema,
  donationPayloadSchema,
  donationTypeSchema,
} from "./donation";
