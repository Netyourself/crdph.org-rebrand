import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

/**
 * Seed data for CRDPH — Computational Research and Data Processing Hub.
 *
 * - Creates the first CMS admin account (credentials from env).
 * - Adds placeholder hero banners (replace via /admin/banners).
 *
 * Idempotent — safe to re-run.
 */
async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@crdph.org';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';

  await db.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'CRDPH Admin',
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: 'ADMIN',
    },
  });
  console.log(`Admin user ready: ${adminEmail} — CHANGE THIS PASSWORD after first login.`);

  const sampleBanners = [
    { title: 'Data pipeline operations', imageUrl: 'https://picsum.photos/seed/crdph-1/1600/900', sortOrder: 0 },
    { title: 'Applied computational research', imageUrl: 'https://picsum.photos/seed/crdph-2/1600/900', sortOrder: 1 },
    { title: 'Hyperautomation in action', imageUrl: 'https://picsum.photos/seed/crdph-3/1600/900', sortOrder: 2 },
  ];
  for (const banner of sampleBanners) {
    const existing = await db.banner.findFirst({ where: { title: banner.title } });
    if (!existing) await db.banner.create({ data: { ...banner, isActive: true } });
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
