export function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-400 sm:text-sm">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-4xl">{title}</h2>
      {children && <p className="mt-4 text-sm text-gray-400 sm:text-base">{children}</p>}
    </div>
  );
}
