/**
 * Uploads every file in a local directory (e.g. images pulled off the old
 * cPanel host's /uploads folder) to Cloudinary, and writes a CSV mapping
 * the original filename to its new Cloudinary secure_url + public_id.
 *
 * Run this BEFORE 02-import-to-postgres.ts, then point that script at the
 * generated mapping instead of NEW_UPLOADS_BASE_URL string concatenation.
 *
 * Usage:
 *   CLOUDINARY_CLOUD_NAME=... CLOUDINARY_API_KEY=... CLOUDINARY_API_SECRET=... \
 *   tsx migration-scripts/04-upload-legacy-images-to-cloudinary.ts ./export/uploads crdph/legacy
 */
import { readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const sourceDir = process.argv[2] ?? './export/uploads';
const folder = process.argv[3] ?? 'crdph/legacy';

async function main() {
  const files = readdirSync(sourceDir).filter((f) => !f.startsWith('.'));
  const rows = ['original_filename,secure_url,public_id'];

  for (const file of files) {
    const filePath = join(sourceDir, file);
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'auto',
        use_filename: true,
        unique_filename: true,
      });
      rows.push(`${file},${result.secure_url},${result.public_id}`);
      console.log(`Uploaded ${file} -> ${result.secure_url}`);
    } catch (err) {
      console.error(`Failed to upload ${file}:`, err);
    }
  }

  const outPath = './export/cloudinary-mapping.csv';
  writeFileSync(outPath, rows.join('\n'));
  console.log(`\nDone. Mapping written to ${outPath} (${rows.length - 1} files).`);
  console.log('Use this file in 02-import-to-postgres.ts instead of NEW_UPLOADS_BASE_URL string concatenation.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
