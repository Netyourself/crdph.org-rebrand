import Link from 'next/link';
import { Container } from './container';
import { MobileNav } from './mobile-nav';
import { BrandLogo } from './brand-logo';
import { brand } from '@/config/brand';

export const navLinks = [
  { href: '/#services', label: 'Services' },
  { href: '/#simulator', label: 'Simulator', live: true },
  { href: '/#markets', label: 'Target Markets' },
  { href: '/#techstack', label: 'Tech Stack' },
];

export const ctaLink = { href: '/#audit', label: 'Request Data Audit' };

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-surface/80 backdrop-blur-lg">
      <Container className="flex h-16 items-center justify-between gap-3 sm:h-20">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label={`${brand.name} — home`}>
          <BrandLogo className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
          <span className="min-w-0 leading-tight">
            <span className="block text-lg font-extrabold tracking-wider text-white sm:text-xl">{brand.acronym}</span>
            <span className="hidden truncate text-[10px] font-medium uppercase tracking-wide text-gray-400 sm:block">
              {brand.name}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-gray-300 lg:flex" aria-label="Primary">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1.5 transition hover:text-cyan-400"
            >
              {item.label}
              {item.live && (
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href={ctaLink.href} className="btn-gradient hidden !px-5 !py-2.5 sm:inline-flex">
            {ctaLink.label}
          </Link>
          <MobileNav links={navLinks} ctaHref={ctaLink.href} ctaLabel={ctaLink.label} />
        </div>
      </Container>
    </header>
  );
}
