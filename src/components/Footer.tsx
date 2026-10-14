import { client } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/lib/queries";
import type { SiteSettings } from "@/lib/types";
import styles from "./Footer.module.css";

export default async function Footer() {
	const settings = await client.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY).catch(() => null);
	const currentYear = new Date().getFullYear();

	return (
		<footer className={styles.footer}>
			<div className={`container ${styles.row}`}>
				<div className={styles.info}>
					{settings?.address ? <p>{settings.address}</p> : null}
					{settings?.email ? <p>{settings.email}</p> : null}
					{settings?.phone ? <p>{settings.phone}</p> : null}
				</div>

				{settings?.socialLinks?.length ? (
					<div className={styles.socials}>
						{settings.socialLinks.map((social, index) => (
							<a key={index} href={social.url} target="_blank" rel="noreferrer" className={styles.socialLink}>
								{social.platform}
							</a>
						))}
					</div>
				) : null}

				<p className={styles.copyright}>
					© {currentYear} {settings?.copyrightName || settings?.siteName || "Site Name"}
				</p>
			</div>
		</footer>
	);
}
