import { client } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/lib/queries";
import type { SiteSettings } from "@/lib/types";
import styles from "./Footer.module.css";

/** One slim row: copyright in the middle, the Kroghdev credit on the right. */
export default async function Footer() {
	const settings = await client.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY).catch(() => null);
	const currentYear = new Date().getFullYear();

	return (
		<footer className={styles.footer}>
			<div className={`container ${styles.row}`}>
				<p className={styles.copyright}>
					© {currentYear} {settings?.copyrightName || settings?.siteName || "Site Name"}
				</p>
				<p className={styles.credit}>
					Made by{" "}
					<a href="https://kroghdev.se" target="_blank" rel="noopener" className={styles.creditLink}>
						Kroghdev
					</a>
				</p>
			</div>
		</footer>
	);
}
