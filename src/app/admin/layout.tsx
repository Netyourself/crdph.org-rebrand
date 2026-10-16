import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth, signOut } from '@/auth';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/banners', label: 'Hero Banners' },
  { href: '/admin/messages', label: 'Audit Requests' },
];

const navClass =
  'whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isLoginPage = headers().get('x-pathname') === '/admin/login';

  // Authoritative server-side gate: anonymous visitors never see page content.
  if (!session?.user && !isLoginPage) redirect('/admin/login');
  if (!session?.user) return <>{children}</>; // bare login page, no sidebar

  const isAdmin = session.user.role === 'ADMIN';

  return (
    // Mobile: sidebar becomes a top bar with a horizontally scrollable nav. Desktop (lg+): fixed-width sidebar.
    <div className="flex min-h-screen flex-col bg-ink-50 lg:flex-row">
      <aside className="border-b border-ink-100 bg-white p-4 lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:justify-between lg:border-b-0 lg:border-r lg:p-6">
        <div>
          <div className="flex items-baseline justify-between gap-3 lg:block">
            <p className="font-display text-lg font-semibold text-brand-800">CRDPH CMS</p>
            <p className="truncate text-xs text-ink-400 lg:mt-1">
              {session.user.email} · <span className="uppercase">{session.user.role}</span>
            </p>
          </div>
          <nav aria-label="CMS" className="-mx-1 mt-3 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:mt-8 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={navClass}>
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin/users" className={navClass}>
                Users &amp; Roles
              </Link>
            )}
            <Link href="/admin/account" className={`${navClass} lg:hidden`}>
              My account
            </Link>
          </nav>
        </div>

        <div className="mt-3 hidden space-y-1 border-t border-ink-100 pt-4 lg:block">
          <Link href="/admin/account" className={`block ${navClass}`}>
            My account
          </Link>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/admin/login' });
            }}
          >
            <button className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50">
              Sign out
            </button>
          </form>
        </div>

        {/* Mobile sign-out (the desktop block above is hidden below lg) */}
        <form
          className="mt-2 lg:hidden"
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/admin/login' });
          }}
        >
          <button className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Sign out</button>
        </form>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
