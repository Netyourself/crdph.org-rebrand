import type { Metadata, Viewport } from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import './globals.css';
import { brand, brandLockup } from '@/config/brand';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${brand.domain}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: brandLockup,
    template: `%s | ${brand.acronym}`,
  },
  description: `${brand.tagline}. ${brand.description}`,
  openGraph: {
    type: 'website',
    siteName: brand.acronym,
    url: siteUrl,
    title: brandLockup,
    description: brand.tagline,
  },
  twitter: { card: 'summary_large_image' },
};

// Responsive by default: device-width, no zoom lock (keeps pinch-zoom accessible).
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#060913',
};

// Minimal root: public pages get their chrome from app/(site)/layout.tsx and the
// CMS from app/admin/layout.tsx, so neither inherits the other's header/footer.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
