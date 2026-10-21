import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "@/lib/siteUrl";

/** Production: everything but the Studio and API. Previews/branch deploys: nothing at all. */
export default function robots(): MetadataRoute.Robots {
	if (!isIndexable) return { rules: [{ userAgent: "*", disallow: "/" }] };

	return {
		rules: [{ userAgent: "*", allow: "/", disallow: ["/studio", "/api"] }],
		sitemap: `${siteUrl}/sitemap.xml`,
	};
}
