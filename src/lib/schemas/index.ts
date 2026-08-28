/**
 * Central export file for all Zod schemas
 * Import from '@/lib/schemas' for all validation needs
 */

export type { Address, Email, Name, PAN, Phone } from "@/shared";
// Common reusable schemas — relocated to shared/schemas (used across multiple domains)
export {
  addressSchema,
  consentSchema,
  emailSchema,
  messageSchema,
  nameSchema,
  panSchema,
  phoneSchema,
} from "@/shared";
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
