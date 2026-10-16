import type { Metadata } from 'next';
import { Container } from '@/components/container';
import { PaymentForm } from '@/components/payment-form';
import { brand } from '@/config/brand';

export const metadata: Metadata = {
  title: 'Make a Payment',
  description: `Pay a ${brand.acronym} invoice or engagement deposit securely by card or PayPal.`,
  robots: { index: false }, // utility page — keep it out of search results
};

export default function PayPage() {
  return (
    <div className="section">
      <Container className="max-w-lg">
        <div className="text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-400">Secure payment</p>
          <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">Make a Payment</h1>
          <p className="mt-4 text-sm text-gray-400 sm:text-base">
            Pay a {brand.acronym} invoice or engagement deposit securely by card or PayPal. Please include your
            invoice or engagement reference so we can match your payment.
          </p>
        </div>

        <div className="glass mt-8 rounded-2xl p-5 sm:mt-10 sm:p-8">
          <PaymentForm />
        </div>

        <p className="mt-6 rounded-xl border border-gray-800 bg-slate-950/60 p-4 text-xs text-gray-400">
          Payment integration status: Stripe (card) and PayPal are wired up and ready — add real{' '}
          <code className="font-mono text-cyan-300">STRIPE_SECRET_KEY</code> and{' '}
          <code className="font-mono text-cyan-300">NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> values to your environment to
          switch from test mode to live payments. See <code className="font-mono text-cyan-300">.env.example</code>.
        </p>
      </Container>
    </div>
  );
}
