import { z } from 'zod';
import { interests, organizationTypes } from '@/data/audit-options';

/** Data-audit request (the homepage form). Shared by the client form and /api/contact. */
export const auditRequestSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(120),
  email: z.string().trim().email('Please enter a valid email address'),
  organizationType: z.enum(organizationTypes, {
    errorMap: () => ({ message: 'Select your organization category' }),
  }),
  interest: z.enum(interests, { errorMap: () => ({ message: 'Select a primary interest' }) }),
  message: z.string().trim().max(5000, 'Please keep details under 5,000 characters').optional().or(z.literal('')),
  // Honeypot — real users never fill this in, bots usually do.
  company: z.string().max(0).optional().or(z.literal('')),
});

export type AuditRequestValues = z.infer<typeof auditRequestSchema>;
