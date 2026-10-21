import { client } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { siteUrl } from "@/lib/siteUrl";
import type { SiteSettings } from "@/lib/types";

/**
 * schema.org JSON-LD for the whole site, rendered once in the (site)
 * layout: the website itself, plus who's behind it (a person, a band or
 * a business — picked in Site Settings → SEO). Helps search engines and
 * AI assistants connect the site's name, domain, logo, contact details
 * and social profiles to one entity.
 */
export default async function StructuredData() {
	const settings = await client.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY).catch(() => null);
	if (!settings?.siteName) return null;

	const entityId = `${siteUrl}/#owner`;
	const logo = settings.logo?.asset ? urlFor(settings.logo).width(512).url() : undefined;
	const sameAs = (settings.socialLinks ?? []).map((s) => s.url).filter(Boolean);

	const data = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebSite",
				"@id": `${siteUrl}/#website`,
				name: settings.siteName,
				url: siteUrl,
				inLanguage: settings.language ?? "sv",
				publisher: { "@id": entityId },
			},
			{
				"@type": settings.entityType ?? "Organization",
				"@id": entityId,
				name: settings.siteName,
				url: siteUrl,
				...(settings.siteDescription ? { description: settings.siteDescription } : {}),
				...(logo ? (settings.entityType === "Person" ? { image: logo } : { logo, image: logo }) : {}),
				...(settings.email ? { email: settings.email } : {}),
				...(settings.phone ? { telephone: settings.phone } : {}),
				...(settings.address && settings.entityType !== "Person"
					? { address: { "@type": "PostalAddress", streetAddress: settings.address } }
					: {}),
				...(sameAs.length ? { sameAs } : {}),
			},
		],
	};

	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
