import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { brand } from '@/config/brand';

// Wire in your real Stripe secret key via STRIPE_SECRET_KEY. This route works
// against Stripe's test mode as soon as a test key is set — going live is
// just swapping the key (and adding the webhook noted below).
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function POST(req: Request) {
  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: 'Stripe is not configured yet. Set STRIPE_SECRET_KEY in your environment.' },
      { status: 503 }
    );
  }

  const stripe = new Stripe(stripeSecretKey);
  const { amount, reference } = (await req.json().catch(() => ({}))) as {
    amount?: number;
    reference?: string;
  };

  if (!amount || amount < 1) {
    return NextResponse.json({ error: 'Enter a valid payment amount.' }, { status: 400 });
  }

  const cleanReference = (reference ?? '').trim().slice(0, 100);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(amount * 100),
          product_data: {
            name: `Payment to ${brand.acronym}`,
            description: cleanReference ? `${brand.name} — ref ${cleanReference}` : brand.name,
          },
        },
        quantity: 1,
      },
    ],
    metadata: cleanReference ? { reference: cleanReference } : undefined,
    success_url: `${siteUrl}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/pay/cancelled`,
  });

  return NextResponse.json({ url: session.url });
}

// NOTE: before taking live payments, add a webhook route
// (src/app/api/webhooks/stripe/route.ts) listening for `checkout.session.completed`
// so payments are recorded server-side — the success_url redirect alone can be
// skipped by a user closing the tab early.
