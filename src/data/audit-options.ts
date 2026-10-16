/** Shared by the audit form (UI) and the API's zod schema, so they can never drift apart. */
export const organizationTypes = [
  'International NGO / UN Agency',
  'Commercial Bank / Fintech',
  'Logistics / Telecom',
  'Government Ministry / Public Sector',
  'Other Enterprise',
] as const;

export const interests = [
  'Data Cleansing & Spreadsheet Fix',
  'Automated Pipeline Architecture',
  'AI & Predictive Dashboards',
  'Hyperautomation & Paperless OCR',
] as const;

export type OrganizationType = (typeof organizationTypes)[number];
export type Interest = (typeof interests)[number];
