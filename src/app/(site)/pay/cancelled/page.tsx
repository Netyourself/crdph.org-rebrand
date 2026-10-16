import Link from 'next/link';
import type { Metadata } from 'next';
import { Container } from '@/components/container';

export const metadata: Metadata = { title: 'Payment cancelled', robots: { index: false } };

export default function PayCancelledPage() {
  return (
    <div className="section">
      <Container className="max-w-lg text-center">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Payment cancelled</h1>
        <p className="mt-4 text-gray-400">
          No charge was made. If something went wrong, or you&apos;d like to try a different amount or payment
          method, you&apos;re welcome to try again.
        </p>
        <Link href="/pay" className="btn-gradient mt-8">
          Back to payment page
        </Link>
      </Container>
    </div>
  );
}
