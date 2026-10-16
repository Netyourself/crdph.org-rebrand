import Image from 'next/image';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { deleteCloudinaryAsset } from '@/lib/cloudinary';
import { CloudinaryImagePicker } from '@/components/admin/cloudinary-image-picker';
import { requireSession } from '@/lib/require-admin';

async function addBanner(formData: FormData) {
  'use server';
  await requireSession();
  const imageUrl = String(formData.get('imageUrl') ?? '');
  const imagePublicId = String(formData.get('imagePublicId') ?? '');
  const title = String(formData.get('title') ?? '');
  if (!imageUrl || !title) return;
  await db.banner.create({
    data: {
      imageUrl,
      imagePublicId: imagePublicId || null,
      title,
      description: String(formData.get('description') ?? '') || null,
    },
  });
  revalidatePath('/admin/banners');
  revalidatePath('/');
}

async function removeBanner(id: string) {
  'use server';
  await requireSession();
  const existing = await db.banner.findUnique({ where: { id } });
  await db.banner.delete({ where: { id } });
  await deleteCloudinaryAsset(existing?.imagePublicId);
  revalidatePath('/admin/banners');
  revalidatePath('/');
}

export default async function AdminBannersPage() {
  const banners = await db.banner.findMany({ orderBy: { sortOrder: 'asc' } });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Homepage Banners</h1>
      <p className="mt-1 text-sm text-ink-500">
        These images slide behind the homepage hero (under a dark overlay, so the headline stays readable). With none active, the hero shows the plain tech background.
      </p>

      <form
        action={addBanner}
        className="mt-6 max-w-xl space-y-4 rounded-xl border border-ink-100 bg-white p-4"
      >
        <CloudinaryImagePicker
          label="Slide image"
          folder="crdph/banners"
          urlFieldName="imageUrl"
          publicIdFieldName="imagePublicId"
        />
        <label className="block">
          <span className="text-sm font-medium text-ink-800">Title</span>
          <input name="title" required className="input mt-1" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink-800">Description</span>
          <input name="description" className="input mt-1" />
        </label>
        <button type="submit" className="btn-primary">
          Add slide
        </button>
      </form>

      <div className="mt-8 space-y-3">
        {banners.map((b) => (
          <div key={b.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-ink-100 bg-white p-3 sm:flex-nowrap sm:gap-4">
            <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-ink-100">
              <Image src={b.imageUrl} alt={b.title} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-ink-900">{b.title}</p>
              <p className="text-sm text-ink-600">{b.description}</p>
            </div>
            <form action={removeBanner.bind(null, b.id)}>
              <button className="text-sm text-red-600 hover:underline">Delete</button>
            </form>
          </div>
        ))}
        {banners.length === 0 && <p className="text-ink-400">No banners yet.</p>}
      </div>
    </div>
  );
}
