import { auth } from '@/auth';

/** Any logged-in CMS user (ADMIN or EDITOR). Throws if not authenticated. */
export async function requireSession() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized: you must be signed in.');
  return session;
}

/** Only ADMIN-role users (user management and other admin-only actions). */
export async function requireAdminRole() {
  const session = await requireSession();
  if (session.user.role !== 'ADMIN') {
    throw new Error('Forbidden: this action requires the admin role.');
  }
  return session;
}
