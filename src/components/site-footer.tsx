import Link from 'next/link';
import { Container } from './container';
import { BrandLogo } from './brand-logo';
import { services } from '@/data/services';
import { brand } from '@/config/brand';

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-gray-800 bg-surface-card/80">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div>
          <div className="flex items-center gap-3">
            <BrandLogo className="h-8 w-8" />
            <span className="text-xl font-extrabold tracking-wider text-white">{brand.acronym}</span>
          </div>
          <p className="mt-4 text-sm text-gray-400">{brand.name}.</p>
          <p className="mt-3 text-xs font-medium text-cyan-400">{brand.tagline}.</p>
        </div>

        <div>
          <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-300">Core Capabilities</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-gray-400">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href="/#services" className="transition hover:text-cyan-400">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-300">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-gray-400">
            <li><Link href="/#simulator" className="transition hover:text-cyan-400">Data Pipeline Simulator</Link></li>
            <li><Link href="/#markets" className="transition hover:text-cyan-400">Target Markets</Link></li>
            <li><Link href="/#techstack" className="transition hover:text-cyan-400">Architecture Ecosystem</Link></li>
            <li><Link href="/#audit" className="transition hover:text-cyan-400">Request a Data Audit</Link></li>
            <li><Link href="/pay" className="transition hover:text-cyan-400">Make a Payment</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-300">Regional Hub</h4>
          <p className="mt-4 text-sm text-gray-400">
            Operating across South Sudan and East Africa for enterprise clients, international NGOs, and
            government institutions.
          </p>
          <address className="mt-4 space-y-1.5 text-sm not-italic text-gray-400">
            <p>{brand.location}</p>
            <p>
              <a href={`mailto:${brand.email}`} className="text-cyan-400 hover:underline">{brand.email}</a>
            </p>
            <p>
              <a href={`tel:${brand.phone}`} className="transition hover:text-cyan-400">{brand.phoneDisplay}</a>
            </p>
          </address>
        </div>
      </Container>

      <div className="border-t border-gray-800 py-6">
        <Container className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} {brand.acronym} ({brand.name}). All rights reserved.
        </Container>
      </div>
    </footer>
  );
}
