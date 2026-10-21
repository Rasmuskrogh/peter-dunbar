import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { client } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/lib/queries";
import { localeFor } from "@/lib/seo";
import { isIndexable, siteUrl } from "@/lib/siteUrl";
import type { SiteSettings } from "@/lib/types";
import "./globals.css";

/* Headings: Playfair Display. Body / UI: DM Sans. Wired to --font-display / --font-body in globals.css. */
const playfair = Playfair_Display({
	subsets: ["latin"],
	weight: ["400", "700"],
	style: ["normal", "italic"],
	variable: "--font-playfair",
	display: "swap",
});

const dmSans = DM_Sans({
	subsets: ["latin"],
	weight: ["300", "400", "500"],
	variable: "--font-dm-sans",
	display: "swap",
});

const getSettings = () => client.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY).catch(() => null);

/**
 * Site-wide defaults; each page's generateMetadata (via lib/seo.ts) adds
 * its own title, description, canonical URL and share image on top.
 */
export async function generateMetadata(): Promise<Metadata> {
	const settings = await getSettings();
	const siteName = settings?.siteName ?? "Site Name";

	return {
		metadataBase: new URL(siteUrl),
		// A plain page title becomes "About | Site Name"; a hand-written meta title is used as-is.
		title: { default: siteName, template: `%s | ${siteName}` },
		description: settings?.siteDescription ?? undefined,
		openGraph: { type: "website", siteName, locale: localeFor(settings) },
		// Large image previews in Google results; previews and branch deploys stay out of the index entirely.
		robots: isIndexable
			? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } }
			: { index: false, follow: false },
	};
}

/**
 * Deliberately bare — Header/Footer live in app/(site)/layout.tsx
 * instead, so /studio (the embedded Sanity Studio, a full-screen app in
 * its own right) doesn't get wrapped in the site's chrome. Every real
 * page route lives inside the (site) route group for exactly this
 * reason; only add something here if it truly belongs on /studio too.
 */
export default async function RootLayout({ children }: LayoutProps<"/">) {
	const settings = await getSettings();

	return (
		<html lang={settings?.language ?? "sv"} className={`${playfair.variable} ${dmSans.variable}`}>
			<body>{children}</body>
		</html>
	);
}
