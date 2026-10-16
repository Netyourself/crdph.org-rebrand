import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireSession } from '@/lib/require-admin';

async function markHandled(id: string) {
  'use server';
  await requireSession();
  await db.contactMessage.update({ where: { id }, data: { handled: true } });
  revalidatePath('/admin/messages');
  revalidatePath('/admin');
}

export default async function AdminAuditRequestsPage() {
  const requests = await db.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Audit Requests</h1>
      <p className="mt-1 text-sm text-ink-500">
        Submissions from the &quot;Request a Data Pipeline Audit&quot; form on the homepage.
      </p>

      <div className="mt-6 space-y-4">
        {requests.map((m) => (
          <div key={m.id} className={`rounded-xl border bg-white p-4 sm:p-5 ${m.handled ? 'border-ink-100 opacity-70' : 'border-brand-200'}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words font-medium text-ink-900">
                  {m.name}{' '}
                  <a href={`mailto:${m.email}`} className="font-normal text-brand-700 hover:underline">
                    {m.email}
                  </a>
                </p>
                {m.subject && <p className="mt-0.5 text-sm font-medium text-ink-700">{m.subject}</p>}
              </div>
              {m.handled ? (
                <span className="rounded-full bg-ink-100 px-2 py-1 text-xs text-ink-600">Handled</span>
              ) : (
                <form action={markHandled.bind(null, m.id)}>
                  <button className="rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-50">
                    Mark handled
                  </button>
                </form>
              )}
            </div>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm text-ink-600">{m.message}</p>
            <p className="mt-3 text-xs text-ink-400">
              {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(m.createdAt)}
            </p>
          </div>
        ))}
        {requests.length === 0 && <p className="text-ink-400">No audit requests yet.</p>}
      </div>
    </div>
  );
}
