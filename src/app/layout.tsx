import type { Metadata } from "next";
import "./globals.css";

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
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
