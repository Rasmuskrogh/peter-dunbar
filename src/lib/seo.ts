import type { Metadata } from "next";
import { urlFor } from "@/sanity/lib/image";
import { isIndexable } from "./siteUrl";
import type { SeoFields, SiteSettings } from "./types";

const LOCALES = { sv: "sv_SE", en: "en_US" } as const;

export const localeFor = (settings: SiteSettings | null) => LOCALES[settings?.language ?? "sv"] ?? LOCALES.sv;

/** The page's own share image, else the site default from Site Settings, else none. */
function shareImages(seo: SeoFields, settings: SiteSettings | null) {
	const image = seo?.metaImage?.asset ? seo.metaImage : settings?.defaultShareImage?.asset ? settings.defaultShareImage : null;
	if (!image) return undefined;
	return [{ url: urlFor(image).width(1200).height(630).fit("crop").url(), width: 1200, height: 630 }];
}

/**
 * Everything a page's generateMetadata needs, in one place: title (a
 * hand-written meta title is used as-is; a plain page title gets the
 * "| Site name" suffix from the root layout's template), description
 * (falls back to the site description), canonical URL, Open Graph /
 * Twitter cards and noindex. Next.js replaces rather than merges a
 * parent's openGraph object, so every page passes the full set.
 */
export function buildMetadata({
	seo,
	title,
	path,
	settings,
}: {
	seo: SeoFields;
	/** Fallback when the page has no meta title; gets the site-name suffix. */
	title?: string | null;
	path: string;
	settings: SiteSettings | null;
}): Metadata {
	const siteName = settings?.siteName ?? undefined;
	const pageTitle = seo?.metaTitle ? { absolute: seo.metaTitle } : title ?? siteName;
	const shareTitle = seo?.metaTitle || (title && siteName ? `${title} | ${siteName}` : title || siteName);
	const description = seo?.metaDescription || settings?.siteDescription || undefined;
	const images = shareImages(seo, settings);
	const noIndex = !isIndexable || seo?.noIndex === true;

	return {
		title: pageTitle,
		description,
		alternates: { canonical: path },
		openGraph: { type: "website", siteName, locale: localeFor(settings), url: path, title: shareTitle, description, images },
		twitter: { card: images ? "summary_large_image" : "summary", title: shareTitle, description, images },
		...(noIndex ? { robots: { index: false, follow: isIndexable } } : {}),
	};
}
