import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { PAGE_QUERY } from "@/lib/queries";
import type { PageDocument } from "@/lib/types";
import PageBuilder from "@/components/PageBuilder";

type Props = { params: Promise<{ slug: string }> };

export default async function Page({ params }: Props) {
	const { slug } = await params;
	const page = await client.fetch<PageDocument | null>(PAGE_QUERY, { slug }).catch(() => null);

	if (!page) {
		notFound();
	}

	return <PageBuilder blocks={page.pageBuilder} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const page = await client.fetch<PageDocument | null>(PAGE_QUERY, { slug }).catch(() => null);

	if (!page) return {};

	return {
		title: page.seo?.metaTitle || page.title,
		description: page.seo?.metaDescription,
	};
}
