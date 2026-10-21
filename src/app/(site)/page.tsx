import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { HOME_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import type { PageDocument, SiteSettings } from "@/lib/types";
import PageBuilder from "@/components/PageBuilder";

export default async function Page() {
	const home = await client.fetch<PageDocument | null>(HOME_PAGE_QUERY).catch(() => null);

	if (!home) {
		return (
			<div style={{ padding: "6rem 1.5rem", textAlign: "center" }}>
				<h1>No Home Page document yet</h1>
				<p>Create and publish one in the Studio (/studio) to see it here.</p>
			</div>
		);
	}

	return <PageBuilder blocks={home.pageBuilder} />;
}

export async function generateMetadata(): Promise<Metadata> {
	const [home, settings] = await Promise.all([
		client.fetch<PageDocument | null>(HOME_PAGE_QUERY).catch(() => null),
		client.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY).catch(() => null),
	]);

	// No meta title → just the site name, without the "| Site name" suffix.
	const metadata = buildMetadata({ seo: home?.seo ?? null, path: "/", settings });
	return home?.seo?.metaTitle ? metadata : { ...metadata, title: { absolute: settings?.siteName ?? "" } };
}
