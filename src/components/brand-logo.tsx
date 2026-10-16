/** Inline SVG logo — no extra request, scales crisply at any size. */
export function BrandLogo({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="CRDPH logo" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#0B0F19" />
      <path d="M20 8L31 14V26L20 32L9 26V14L20 8Z" fill="none" stroke="#00F0FF" strokeWidth="2" />
      <circle cx="20" cy="20" r="4" fill="#00F0FF" />
      <path
        d="M20 8V16M31 14L24 18M31 26L24 22M20 32V24M9 26L16 22M9 14L16 18"
        stroke="#3B82F6"
        strokeWidth="1.5"
      />
    </svg>
  );
}
