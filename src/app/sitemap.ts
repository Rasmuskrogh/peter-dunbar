import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { SITEMAP_QUERY } from "@/lib/queries";
import { siteUrl } from "@/lib/siteUrl";

// Rebuilt at most once an hour, so pages published in the Studio show up
// without a redeploy (otherwise the sitemap is frozen at build time).
export const revalidate = 3600;

type Entry = { slug: string | null; updatedAt: string };

/** The home page plus every published page, except those marked "Hide from search engines". */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const { home, pages } = await client
		.fetch<{ home: Entry | null; pages: Entry[] }>(SITEMAP_QUERY)
		.catch(() => ({ home: null, pages: [] as Entry[] }));

	return [
		{ url: siteUrl, lastModified: home?.updatedAt, priority: 1 },
		...pages.map((page) => ({ url: `${siteUrl}/${page.slug}`, lastModified: page.updatedAt, priority: 0.7 })),
	];
}
