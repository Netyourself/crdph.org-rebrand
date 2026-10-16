import { auth } from '@/auth';
import { ChangePasswordForm } from '@/components/admin/change-password-form';

export default async function AccountPage() {
  const session = await auth();
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">My Account</h1>
      <div className="mt-4 rounded-xl border border-ink-100 bg-white p-4 text-sm">
        <p className="text-ink-900">{session?.user.name}</p>
        <p className="text-ink-600">{session?.user.email}</p>
        <p className="mt-1 text-xs uppercase text-ink-400">{session?.user.role}</p>
      </div>
      <h2 className="mt-10 font-display text-lg font-semibold text-ink-900">Change password</h2>
      <ChangePasswordForm />
    </div>
  );
}
