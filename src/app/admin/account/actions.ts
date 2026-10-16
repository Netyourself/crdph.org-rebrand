'use server';

import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { requireSession } from '@/lib/require-admin';

type State = { error?: string; success?: boolean };

export async function changeOwnPassword(_prevState: State, formData: FormData): Promise<State> {
  const session = await requireSession();

  const currentPassword = String(formData.get('currentPassword') ?? '');
  const newPassword = String(formData.get('newPassword') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');

  if (newPassword.length < 8) return { error: 'New password must be at least 8 characters.' };
  if (newPassword !== confirmPassword) return { error: "New passwords don't match." };

  const user = await db.adminUser.findUnique({ where: { id: session.user.id } });
  if (!user) return { error: 'User not found.' };

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) return { error: 'Current password is incorrect.' };

  await db.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(newPassword, 10) },
  });

  return { success: true };
}
