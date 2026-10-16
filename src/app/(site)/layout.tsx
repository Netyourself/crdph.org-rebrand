import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-dark relative min-h-screen overflow-x-clip bg-surface text-gray-100">
      {/* Decorative background: technical grid + ambient glow orbs (orbs hidden on
          small screens to save GPU/battery). Purely visual, never intercepts input. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundSize: '40px 40px',
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          }}
        />
        <div className="absolute left-[-10%] top-[-10%] hidden h-[50%] w-[50%] rounded-full bg-cyan-500/10 blur-[120px] sm:block" />
        <div className="absolute bottom-[-10%] right-[-10%] hidden h-[50%] w-[50%] rounded-full bg-violet-600/10 blur-[120px] sm:block" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}
