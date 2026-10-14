import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { HOME_PAGE_QUERY } from "@/lib/queries";
import type { PageDocument } from "@/lib/types";
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
	const home = await client.fetch<PageDocument | null>(HOME_PAGE_QUERY).catch(() => null);

	if (!home?.seo) return {};

	return {
		title: home.seo.metaTitle,
		description: home.seo.metaDescription,
	};
}
