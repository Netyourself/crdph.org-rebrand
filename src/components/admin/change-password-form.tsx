'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { changeOwnPassword } from '@/app/admin/account/actions';

type State = { error?: string; success?: boolean };
const initialState: State = {};

function SubmitButton() {
  // useFormStatus must be called from a component rendered *inside* the <form>.
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
      {pending ? 'Updating…' : 'Update password'}
    </button>
  );
}

export function ChangePasswordForm() {
  const [state, formAction] = useFormState(changeOwnPassword, initialState);

  if (state.success) {
    return (
      <p className="mt-4 max-w-md rounded-xl bg-brand-50 p-4 text-sm text-brand-800">
        Password updated. Use your new password next time you sign in.
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-4 max-w-md space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-ink-800">Current password</span>
        <input name="currentPassword" type="password" required className="input mt-1" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-ink-800">New password</span>
        <input name="newPassword" type="password" required minLength={8} className="input mt-1" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-ink-800">Confirm new password</span>
        <input name="confirmPassword" type="password" required minLength={8} className="input mt-1" />
      </label>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
