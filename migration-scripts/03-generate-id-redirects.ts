/**
 * The old site linked to detail pages via numeric IDs in a query string,
 * e.g. blog-details.php?id=5, cause-details.php?id=12. Google, backlinks,
 * and shared social posts reference those exact URLs. next.config.js's
 * static `redirects()` can't loop over DB rows, so this script generates a
 * ready-to-paste array of { source, has, destination } redirect objects -
 * one per legacy row - from the *new* Postgres data (matched back to the
 * legacy numeric id, which we preserve as `legacyId` during import).
 *
 * Usage: DATABASE_URL=postgres://... tsx migration-scripts/03-generate-id-redirects.ts
 * Paste the output into next.config.js's legacyRedirects array.
 *
 * NOTE: this assumes you've added a `legacyId Int?` column to the relevant
 * Prisma models during import (not included in the base schema, since it's
 * only needed transiently). Add it, re-run `prisma migrate dev`, populate it
 * during 02-import-to-postgres.ts, then run this script, then the column can
 * be dropped once the redirect list is generated and pasted in.
 */
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  // Example for posts - repeat the same pattern for any other legacy
  // id-based content type (events, causes, etc.)
  const posts: { legacyId: number | null; slug: string }[] = await db.$queryRawUnsafe(
    `SELECT "legacyId", slug FROM "Post" WHERE "legacyId" IS NOT NULL`
  );

  const lines = posts.map(
    (p) =>
      `  { source: '/blog-details.php', has: [{ type: 'query', key: 'id', value: '${p.legacyId}' }], destination: '/blog/${p.slug}', permanent: true },`
  );

  console.log('// Paste into next.config.js legacyRedirects array:');
  console.log(lines.join('\n'));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
