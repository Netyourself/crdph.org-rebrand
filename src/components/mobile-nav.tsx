'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

type Props = {
  links: { href: string; label: string }[];
  ctaHref: string;
  ctaLabel: string;
};

/**
 * Mobile menu: a dropdown panel anchored under the sticky header (the header is the
 * positioned ancestor). Closes on link tap and on Escape; 44px+ touch targets.
 */
export function MobileNav({ links, ctaHref, ctaLabel }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-300 transition hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="absolute inset-x-0 top-full max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-gray-800 bg-surface/95 px-4 pb-5 pt-2 backdrop-blur-lg"
        >
          <ul className="flex flex-col">
            {links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3.5 text-base font-medium text-gray-200 transition hover:bg-white/5 hover:text-cyan-400"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={ctaHref} onClick={() => setOpen(false)} className="btn-gradient mt-3 w-full">
            {ctaLabel}
          </Link>
        </nav>
      )}
    </div>
  );
}
