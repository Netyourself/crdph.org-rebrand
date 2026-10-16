import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { createUser } from '../actions';

export default async function NewUserPage() {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') redirect('/admin');

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">New User</h1>
      <form action={createUser} className="mt-6 max-w-md space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-ink-800">Full name</span>
          <input name="name" required className="input mt-1" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink-800">Email</span>
          <input name="email" type="email" required className="input mt-1" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink-800">Temporary password</span>
          <input name="password" type="password" required minLength={8} className="input mt-1" />
          <span className="mt-1 block text-xs text-ink-400">
            At least 8 characters. Share out of band — they can change it under &quot;My account&quot;.
          </span>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink-800">Role</span>
          <select name="role" defaultValue="EDITOR" className="input mt-1">
            <option value="EDITOR">Editor — can manage content</option>
            <option value="ADMIN">Admin — can also manage users and roles</option>
          </select>
        </label>
        <button type="submit" className="btn-primary">Create user</button>
      </form>
    </div>
  );
}
