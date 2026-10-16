/**
 * Rebrand cleanup — removes the content that was seeded for the previous brand
 * (population-health NGO) from an EXISTING database.
 *
 * Changing the code does not change rows already stored in Postgres: your
 * production database may still contain the old success-story post, the old
 * event, the old placeholder banners and the old team/board rows.
 *
 * DRY RUN by default (prints what it would delete). Nothing is removed unless
 * you pass --confirm:
 *
 *   tsx migration-scripts/05-rebrand-cleanup.ts            # preview
 *   tsx migration-scripts/05-rebrand-cleanup.ts --confirm  # actually delete
 *
 * It only targets rows created by the previous seed script (matched by exact
 * slug/title). Anything you created yourself is left alone — review the rest
 * of your content in /admin. Cloudinary assets of deleted rows are not
 * touched; remove those in the Cloudinary console if you wish.
 */
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
const confirm = process.argv.includes('--confirm');

const OLD_POST_SLUGS = [
  'empowering-caregivers-in-a-humanitarian-crisis',
  'welcome-to-the-new-crdph-website',
];
const OLD_EVENT_SLUGS = ['plh-parenting-radio-talk-show', 'community-nutrition-outreach-2026'];
const OLD_BANNER_TITLES = [
  'Community outreach in Juba',
  'Parenting group session',
  'WASH program in the field',
];
const OLD_TEAM = [
  { name: 'Samuel Bojo', role: 'Chief Executive Officer / Technical Lead' },
  { name: 'Akita Magret', role: 'Project Manager' },
  { name: 'Team Member', role: 'Programs Manager' },
  { name: 'Board Member', role: 'Board Chair' },
  { name: 'Board Member', role: 'Board Member' },
];

async function main() {
  const posts = await db.post.findMany({ where: { slug: { in: OLD_POST_SLUGS } }, select: { id: true, title: true } });
  const events = await db.event.findMany({ where: { slug: { in: OLD_EVENT_SLUGS } }, select: { id: true, title: true } });
  const banners = await db.banner.findMany({ where: { title: { in: OLD_BANNER_TITLES } }, select: { id: true, title: true } });
  const team = await db.teamMember.findMany({ where: { OR: OLD_TEAM }, select: { id: true, name: true, role: true } });

  console.log(confirm ? 'DELETING:' : 'DRY RUN — would delete:');
  posts.forEach((p) => console.log(`  post   : ${p.title}`));
  events.forEach((e) => console.log(`  event  : ${e.title}`));
  banners.forEach((b) => console.log(`  banner : ${b.title}`));
  team.forEach((t) => console.log(`  team   : ${t.name} — ${t.role}`));

  if (!confirm) {
    console.log('\nRe-run with --confirm to apply.');
    return;
  }

  await db.post.deleteMany({ where: { id: { in: posts.map((p) => p.id) } } });
  await db.event.deleteMany({ where: { id: { in: events.map((e) => e.id) } } });
  await db.banner.deleteMany({ where: { id: { in: banners.map((b) => b.id) } } });
  await db.teamMember.deleteMany({ where: { id: { in: team.map((t) => t.id) } } });
  console.log('\nDone.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
