import { HeroSection } from '@/components/sections/hero-section';
import { ServicesSection } from '@/components/sections/services-section';
import { SimulatorSection } from '@/components/sections/simulator-section';
import { MarketsSection } from '@/components/sections/markets-section';
import { TechStackSection } from '@/components/sections/tech-stack-section';
import { AuditSection } from '@/components/sections/audit-section';
import { db } from '@/lib/db';

// Revalidate periodically so hero-banner changes made in /admin appear without a redeploy.
export const revalidate = 300;

export default async function HomePage() {
  const banners = await db.banner
    .findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } })
    .catch(() => []); // graceful fallback if the DB isn't provisioned yet

  return (
    <>
      <HeroSection slides={banners.map((b) => ({ id: b.id, imageUrl: b.imageUrl, title: b.title }))} />
      <ServicesSection />
      <SimulatorSection />
      <MarketsSection />
      <TechStackSection />
      <AuditSection />
    </>
  );
}
