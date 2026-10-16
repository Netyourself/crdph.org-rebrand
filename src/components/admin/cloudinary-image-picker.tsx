'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { ImagePlus, X } from 'lucide-react';

type Props = {
  label: string;
  folder: string; // e.g. "crdph/gallery", "crdph/banners", "crdph/posts"
  urlFieldName: string; // hidden input name the surrounding <form> will submit
  publicIdFieldName: string;
  defaultUrl?: string | null;
};

export function CloudinaryImagePicker({
  label,
  folder,
  urlFieldName,
  publicIdFieldName,
  defaultUrl,
}: Props) {
  const [url, setUrl] = useState<string | null>(defaultUrl ?? null);
  const [publicId, setPublicId] = useState<string>('');

  function handleSuccess(result: CloudinaryUploadWidgetResults) {
    if (typeof result.info === 'object' && result.info) {
      setUrl(result.info.secure_url);
      setPublicId(result.info.public_id);
    }
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink-800">{label}</span>

      {/* These are what actually get submitted to the server action */}
      <input type="hidden" name={urlFieldName} value={url ?? ''} />
      <input type="hidden" name={publicIdFieldName} value={publicId} />

      <div className="flex items-center gap-4">
        {url ? (
          <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-ink-100 bg-ink-50">
            <Image src={url} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => {
                setUrl(null);
                setPublicId('');
              }}
              className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white"
              aria-label="Remove image"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-ink-200 text-ink-300">
            <ImagePlus size={24} />
          </div>
        )}

        {cloudName && apiKey ? (
          <CldUploadWidget
            signatureEndpoint="/api/cloudinary/sign"
            options={{ apiKey, cloudName, folder, sources: ['local', 'url', 'camera'], multiple: false }}
            onSuccess={handleSuccess}
          >
            {({ open }) => (
              <button type="button" onClick={() => open()} className="btn-secondary">
                {url ? 'Replace image' : 'Upload image'}
              </button>
            )}
          </CldUploadWidget>
        ) : (
          <p className="text-xs text-ink-400">
            Cloudinary isn't configured yet — set <code className="font-mono">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code>{' '}
            and the other <code className="font-mono">CLOUDINARY_*</code> env vars.
          </p>
        )}
      </div>
    </div>
  );
}
