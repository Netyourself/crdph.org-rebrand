/**
 * Run AFTER 01-export-mysql.sh has produced CSVs in ./export
 * Usage: DATABASE_URL=postgres://... tsx migration-scripts/02-import-to-postgres.ts
 *
 * This does NOT try to be a generic ETL tool - it's deliberately explicit about
 * every field mapping so you can see exactly what changed between the legacy
 * MySQL schema and the new Postgres/Prisma schema, and adjust per-field as needed.
 */
import { parse } from 'csv-parse/sync';
import { readFileSync, existsSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();
const EXPORT_DIR = process.env.EXPORT_DIR ?? './export';

function readCsv(table: string) {
  const path = `${EXPORT_DIR}/${table}.csv`;
  if (!existsSync(path)) {
    console.warn(`Skipping ${table}: ${path} not found`);
    return [];
  }
  const raw = readFileSync(path, 'utf-8');
  return parse(raw, { columns: true, skip_empty_lines: true }) as Record<string, string>[];
}

async function importUsers() {
  const rows = readCsv('users');
  for (const row of rows) {
    // Legacy passwords were unsalted SHA1 - there is no way to recover the
    // plaintext, so we CANNOT carry them forward as valid bcrypt hashes.
    // Strategy: create the account with a random, already-invalid password
    // and require a password reset email before first login. Do not ship a
    // "temporary password" over email/SMS - use a signed, expiring reset link.
    const randomInvalidHash = await bcrypt.hash(crypto.randomUUID(), 10);

    await db.adminUser.upsert({
      where: { email: row.email },
      update: {},
      create: {
        name: row.email.split('@')[0],
        email: row.email,
        passwordHash: randomInvalidHash,
        role: row.u_type === 'admin' ? 'ADMIN' : 'EDITOR',
      },
    });
  }
  console.log(`Imported ${rows.length} users (passwords invalidated - see comment above).`);
}

function loadCloudinaryMapping(): Map<string, { secure_url: string; public_id: string }> {
  const mapPath = `${EXPORT_DIR}/cloudinary-mapping.csv`;
  const map = new Map<string, { secure_url: string; public_id: string }>();
  if (!existsSync(mapPath)) return map;
  const rows = parse(readFileSync(mapPath, 'utf-8'), { columns: true, skip_empty_lines: true }) as Record<
    string,
    string
  >[];
  for (const row of rows) {
    map.set(row.original_filename, { secure_url: row.secure_url, public_id: row.public_id });
  }
  return map;
}

async function importBanners() {
  const rows = readCsv('banner');
  const cloudinaryMap = loadCloudinaryMapping();
  for (const row of rows) {
    // Run 04-upload-legacy-images-to-cloudinary.ts first (uploads the old
    // /uploads files to Cloudinary and writes export/cloudinary-mapping.csv)
    // so each legacy filename resolves to a real Cloudinary URL here.
    const uploaded = cloudinaryMap.get(row.banner_image);
    await db.banner.create({
      data: {
        title: row.banner_title ?? '',
        description: row.banner_description || null,
        imageUrl: uploaded?.secure_url ?? '',
        imagePublicId: uploaded?.public_id ?? null,
      },
    });
  }
  console.log(`Imported ${rows.length} banners.`);
}

async function importEvents() {
  const rows = readCsv('events');
  for (const row of rows) {
    const title = row.event_title ?? row.title ?? 'Untitled event';
    await db.event.create({
      data: {
        slug: slugify(title),
        title,
        summary: (row.event_description ?? '').slice(0, 240),
        body: row.event_description ?? '',
        startDate: new Date(row.event_date ?? row.date_added ?? Date.now()),
        isPublished: true,
      },
    });
  }
  console.log(`Imported ${rows.length} events.`);
}

async function importGallery() {
  const rows = readCsv('gallery');
  const cloudinaryMap = loadCloudinaryMapping();
  for (const row of rows) {
    const filename = row.gallery_image ?? row.image;
    const uploaded = cloudinaryMap.get(filename);
    await db.galleryImage.create({
      data: {
        imageUrl: uploaded?.secure_url ?? '',
        imagePublicId: uploaded?.public_id ?? null,
        caption: row.caption || null,
      },
    });
  }
  console.log(`Imported ${rows.length} gallery images.`);
}

function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || crypto.randomUUID().slice(0, 8)
  );
}

async function main() {
  await importUsers();
  await importBanners();
  await importEvents();
  await importGallery();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
