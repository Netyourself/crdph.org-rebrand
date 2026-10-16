import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Deletes an asset from Cloudinary by its public_id. Called whenever a DB
 * row that owns an uploaded image (Banner, GalleryImage, Post cover) is
 * deleted, so orphaned files don't pile up in the Cloudinary account.
 * Never throws — a failed cleanup shouldn't block the DB delete.
 */
export async function deleteCloudinaryAsset(publicId: string | null | undefined) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Failed to delete Cloudinary asset', publicId, err);
  }
}
