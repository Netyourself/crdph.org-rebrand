import Link from 'next/link';
import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { Container } from '@/components/container';
import { brand } from '@/config/brand';

export const metadata: Metadata = { title: 'Payment received', robots: { index: false } };

export default function PaySuccessPage() {
  return (
    <div className="section">
      <Container className="max-w-lg text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
          <Check size={28} aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">Thank you</h1>
        <p className="mt-4 text-gray-400">
          Your payment to {brand.acronym} has been received. A receipt will be sent to the email address you
          provided at checkout.
        </p>
        <Link href="/" className="btn-gradient mt-8">
          Back to homepage
        </Link>
      </Container>
    </div>
  );
}
