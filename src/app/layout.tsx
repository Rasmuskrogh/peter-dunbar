import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
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

export const metadata: Metadata = {
	title: "Sanity Base",
	description: "Reusable Next.js + Sanity starter.",
};

/**
 * Deliberately bare — Header/Footer live in app/(site)/layout.tsx
 * instead, so /studio (the embedded Sanity Studio, a full-screen app in
 * its own right) doesn't get wrapped in the site's chrome. Every real
 * page route lives inside the (site) route group for exactly this
 * reason; only add something here if it truly belongs on /studio too.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
			<body>{children}</body>
		</html>
	);
}
