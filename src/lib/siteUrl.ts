/**
 * The site's public origin, used for canonical URLs, the sitemap and
 * social-share links. Set NEXT_PUBLIC_SITE_URL to the real domain (e.g.
 * https://www.example.se) once it's live; until then it falls back to
 * what the host knows — Vercel's production domain, or Netlify's URL —
 * and finally localhost.
 */
const fromEnv =
	process.env.NEXT_PUBLIC_SITE_URL ||
	(process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
	process.env.URL ||
	"http://localhost:3000";

export const siteUrl = fromEnv.replace(/\/$/, "");

/**
 * Only the real production deployment may be indexed. Vercel preview
 * deployments and Netlify deploy previews / branch deploys get noindex
 * and a robots.txt that blocks everything, so a half-finished version
 * never ends up in Google. Local dev counts as indexable so the tags
 * can be checked; it isn't reachable by crawlers anyway.
 */
export const isIndexable =
	(process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true) &&
	(process.env.CONTEXT ? process.env.CONTEXT === "production" : true);
