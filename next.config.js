/** @type {import('next').NextConfig} */

// ---------------------------------------------------------------------------
// REDIRECTS (permanent = HTTP 301, so search engines transfer ranking signals)
//
// The public site is now a single-page startup site (sections: #services,
// #simulator, #markets, #techstack, #audit) plus /pay. Every older URL —
// legacy PHP pages, the earlier NGO-style routes, and routes removed in the
// startup redesign — maps to the closest equivalent. Keep this file indefinitely:
// old backlinks and bookmarks persist for years.
// ---------------------------------------------------------------------------
const legacyPhp = [
  ['/index.php', '/'],
  ['/about.php', '/'],
  ['/mission.php', '/'],
  ['/vision.php', '/'],
  ['/core-values.php', '/'],
  ['/background.php', '/'],
  ['/our-impact.php', '/'],
  ['/what-we-do.php', '/#services'],
  ['/funders-partners.php', '/#markets'],
  ['/our-team.php', '/'],
  ['/team.php', '/'],
  ['/our-board.php', '/'],
  // old program pages -> services
  ['/nutrition-programming.php', '/#services'],
  ['/wash-programming.php', '/#services'],
  ['/child-protection.php', '/#services'],
  ['/health-programming.php', '/#services'],
  ['/family-strengthening.php', '/#services'],
  ['/capacity-enhancement.php', '/#services'],
  ['/operational-research.php', '/#services'],
  ['/policyengagement.php', '/#services'],
  ['/center-of-excellency.php', '/#services'],
  ['/cause-details.php', '/#services'],
  ['/blog.php', '/'],
  ['/blog-single.php', '/'],
  ['/blog-details.php', '/'],
  ['/events.php', '/'],
  ['/gallery.php', '/'],
  ['/contact.php', '/#audit'],
  // old client/admin auth area — not part of the public site
  ['/login.php', '/'],
  ['/register.php', '/'],
  ['/forgot-password.php', '/'],
  ['/logout.php', '/'],
  ['/users/:path*', '/'],
];

const retiredRoutes = [
  // removed in the startup redesign
  ['/about', '/'],
  ['/team', '/'],
  ['/blog', '/'],
  ['/blog/:slug', '/'],
  ['/events', '/'],
  ['/gallery', '/'],
  ['/resources', '/'],
  ['/partners', '/#markets'], // partners became "Target Markets"
  ['/contact', '/#audit'], // contact form became the data-audit request form
  // earlier rebrand routes
  ['/solutions', '/#services'],
  ['/solutions/:slug', '/#services'],
  ['/programs', '/#services'],
  ['/programs/:slug', '/#services'],
  ['/donate', '/pay'],
  ['/donate/:path*', '/pay/:path*'],
];

const redirects = [...legacyPhp, ...retiredRoutes].map(([source, destination]) => ({
  source,
  destination,
  permanent: true,
}));

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Primary image host: Cloudinary.
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // Fallback for pre-existing/admin-pasted URLs from other sources (e.g. picsum placeholders).
      // Tighten to specific hosts once all content is on Cloudinary.
      { protocol: 'https', hostname: '**' },
    ],
  },
  async redirects() {
    return redirects;
  },
};

module.exports = nextConfig;
