import { db } from '@/lib/db';

export default async function AdminDashboard() {
  const [banners, users, openRequests, totalRequests] = await Promise.all([
    db.banner.count({ where: { isActive: true } }),
    db.adminUser.count(),
    db.contactMessage.count({ where: { handled: false } }),
    db.contactMessage.count(),
  ]);

  const stats = [
    { label: 'Open audit requests', value: openRequests },
    { label: 'Total audit requests', value: totalRequests },
    { label: 'Active hero banners', value: banners },
    { label: 'CMS users', value: users },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-ink-100 bg-white p-4 sm:p-5">
            <p className="text-3xl font-semibold text-brand-700">{s.value}</p>
            <p className="mt-1 text-sm text-ink-600">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
