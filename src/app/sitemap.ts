import type { MetadataRoute } from 'next';
import { brand } from '@/config/brand';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${brand.domain}`;

// Single-page site: one indexable URL (/pay is a noindex utility page; /admin is private).
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 }];
}
