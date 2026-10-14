import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { hrefFor } from "@/lib/link";
import type { SiteSettings } from "@/lib/types";
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

				<nav>
					<ul className={styles.links}>
						{navItems.map((item, index) => {
							const hasDropdown = (item.children?.length ?? 0) > 0;

							return (
								<li key={index} className={hasDropdown ? styles.dropdownItem : undefined}>
									<Link href={hrefFor(item.link)} className={styles.link}>
										{item.link.text}
									</Link>

									{hasDropdown ? (
										<ul className={styles.dropdownPanel}>
											{item.children!.map((child, childIndex) => (
												<li key={childIndex}>
													<Link href={hrefFor(child)} className={styles.dropdownLink}>
														{child.text}
													</Link>
												</li>
											))}
										</ul>
									) : null}
								</li>
							);
						})}
					</ul>
				</nav>
			</div>
		</header>
	);
}
