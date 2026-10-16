import Link from 'next/link';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { auth } from '@/auth';
import { deleteUser, updateUserRole } from './actions';

export default async function AdminUsersPage() {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') redirect('/admin');

  const users = await db.adminUser.findMany({ orderBy: { createdAt: 'asc' } });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Users &amp; Roles</h1>
          <p className="mt-1 text-sm text-ink-500">
            Admins can create new editor/admin accounts and manage existing ones.
          </p>
        </div>
        <Link href="/admin/users/new" className="btn-primary">New user</Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-ink-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50 text-ink-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isSelf = user.id === session?.user.id;
              const updateRole = updateUserRole.bind(null, user.id);
              const remove = deleteUser.bind(null, user.id);
              return (
                <tr key={user.id} className="border-t border-ink-100">
                  <td className="px-4 py-3 font-medium text-ink-900">
                    {user.name} {isSelf && <span className="text-xs text-ink-400">(you)</span>}
                  </td>
                  <td className="px-4 py-3 text-ink-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <form action={updateRole} className="flex items-center gap-2">
                      <select name="role" defaultValue={user.role} className="rounded-lg border border-ink-100 px-2 py-1 text-xs">
                        <option value="EDITOR">Editor</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      <button type="submit" className="text-xs font-medium text-brand-700 hover:underline">Save</button>
                    </form>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!isSelf && (
                      <form action={remove}>
                        <button className="text-xs text-red-600 hover:underline">Delete</button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
