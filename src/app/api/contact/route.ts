import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/db';
import { auditRequestSchema } from '@/lib/validations';
import { brand } from '@/config/brand';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * POST /api/contact — receives "Request a Data Pipeline Audit" submissions.
 * Stored in the ContactMessage table (category + interest go in `subject`, so no
 * schema change is needed) and emailed to the inbox when Resend is configured.
 */
export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = auditRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Honeypot tripped -> pretend success so bots learn nothing.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, organizationType, interest } = parsed.data;
  const details = parsed.data.message?.trim() || 'No additional details provided.';
  const subject = `Data audit request — ${organizationType} · ${interest}`;

  await db.contactMessage.create({ data: { name, email, subject, message: details } });

  if (resend) {
    await resend.emails.send({
      from: `${brand.acronym} Website <no-reply@${brand.domain}>`,
      to: process.env.CONTACT_INBOX_EMAIL ?? brand.email,
      replyTo: email,
      subject: `[Website] ${subject}`,
      text: `From: ${name} <${email}>\nOrganization category: ${organizationType}\nPrimary interest: ${interest}\n\n${details}`,
    });
  }

  return NextResponse.json({ ok: true });
}

// NOTE: add rate limiting (e.g. Upstash Ratelimit or your host's firewall) in front of this route
// before launch — it is a public endpoint.
