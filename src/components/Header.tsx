import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { SiteSettings } from "@/lib/types";
import HeaderNav from "./HeaderNav";
import styles from "./Header.module.css";

export default async function Header() {
	const settings = await client.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY).catch(() => null);
	const navItems = settings?.navItems ?? [];

	return (
		<header className={styles.header}>
			<div className={`container ${styles.bar}`}>
				<Link href="/" className={styles.brand}>
					{settings?.logo ? (
						<Image
							src={urlFor(settings.logo).width(160).url()}
							alt={settings.siteName ?? ""}
							width={140}
							height={40}
							className={styles.logo}
						/>
					) : (
						<span>{settings?.siteName ?? "Site Name"}</span>
					)}
				</Link>

				<HeaderNav items={navItems} />
			</div>
		</header>
	);
}
