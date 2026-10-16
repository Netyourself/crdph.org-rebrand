'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { requireAdminRole } from '@/lib/require-admin';

export async function createUser(formData: FormData) {
  await requireAdminRole();

  const name = String(formData.get('name') ?? '');
  const email = String(formData.get('email') ?? '').toLowerCase().trim();
  const password = String(formData.get('password') ?? '');
  const role = String(formData.get('role') ?? 'EDITOR') as 'ADMIN' | 'EDITOR';

  if (!name || !email || password.length < 8) {
    throw new Error('Name, email, and a password of at least 8 characters are required.');
  }
  if (await db.adminUser.findUnique({ where: { email } })) {
    throw new Error('A user with this email already exists.');
  }

  await db.adminUser.create({
    data: { name, email, passwordHash: await bcrypt.hash(password, 10), role },
  });

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

export async function updateUserRole(id: string, formData: FormData) {
  const session = await requireAdminRole();
  const role = String(formData.get('role') ?? 'EDITOR') as 'ADMIN' | 'EDITOR';

  if (id === session.user.id && role !== 'ADMIN') {
    throw new Error("You can't remove your own admin role.");
  }
  if (role !== 'ADMIN') {
    const remainingAdmins = await db.adminUser.count({ where: { role: 'ADMIN', id: { not: id } } });
    const target = await db.adminUser.findUnique({ where: { id } });
    if (target?.role === 'ADMIN' && remainingAdmins === 0) {
      throw new Error("Can't demote the last remaining admin.");
    }
  }

  await db.adminUser.update({ where: { id }, data: { role } });
  revalidatePath('/admin/users');
  redirect('/admin/users');
}

export async function deleteUser(id: string) {
  const session = await requireAdminRole();
  if (id === session.user.id) throw new Error("You can't delete your own account while signed in.");

  const target = await db.adminUser.findUnique({ where: { id } });
  if (target?.role === 'ADMIN') {
    const remainingAdmins = await db.adminUser.count({ where: { role: 'ADMIN', id: { not: id } } });
    if (remainingAdmins === 0) throw new Error("Can't delete the last remaining admin.");
  }

  await db.adminUser.delete({ where: { id } });
  revalidatePath('/admin/users');
}
