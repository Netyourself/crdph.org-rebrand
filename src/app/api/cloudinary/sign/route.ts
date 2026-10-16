import { NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';
import { auth } from '@/auth';

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { paramsToSign } = await req.json();

  if (!process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json(
      { error: 'Cloudinary is not configured yet. Set CLOUDINARY_* env vars.' },
      { status: 503 }
    );
  }

  const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

  return NextResponse.json({ signature });
}
