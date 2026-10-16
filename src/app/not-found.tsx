import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="site-dark flex min-h-screen items-center justify-center bg-surface px-4 text-gray-100">
      <div className="max-w-md text-center">
        <p className="font-mono text-sm text-cyan-400">ERROR 404</p>
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Page not found</h1>
        <p className="mt-4 text-gray-400">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <Link href="/" className="btn-gradient mt-8">
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
