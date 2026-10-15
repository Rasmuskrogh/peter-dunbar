"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { hrefFor } from "@/lib/link";
import type { NavLink } from "@/lib/types";
import styles from "./Header.module.css";

/**
 * The header menu. On wide screens it's an inline row of links; below
 * the breakpoint in Header.module.css it collapses behind a hamburger
 * button and opens as a panel under the header. Client component only
 * for the open/closed state — the items come from Header (server).
 */
export default function HeaderNav({ items }: { items: NavLink[] }) {
	const pathname = usePathname();
	const panelId = useId();
	// Remembers which page the menu was opened on, so navigating anywhere closes it.
	const [openOn, setOpenOn] = useState<string | null>(null);
	const open = openOn === pathname;
	const setOpen = (value: boolean | ((was: boolean) => boolean)) =>
		setOpenOn((typeof value === "function" ? value(open) : value) ? pathname : null);

	// Escape closes it too.
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenOn(null);
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);

	return (
		<>
			<button
				type="button"
				className={styles.menuButton}
				aria-expanded={open}
				aria-controls={panelId}
				aria-label={open ? "Close menu" : "Open menu"}
				onClick={() => setOpen((o) => !o)}
			>
				<span className={`${styles.burger} ${open ? styles.burgerOpen : ""}`} aria-hidden="true" />
			</button>

			<nav id={panelId} className={`${styles.nav} ${open ? styles.navOpen : ""}`} aria-label="Main">
				<ul className={styles.links}>
					{items.map((item, index) => {
						const hasDropdown = (item.children?.length ?? 0) > 0;
						const href = hrefFor(item.link);

						return (
							<li key={index} className={hasDropdown ? styles.dropdownItem : undefined}>
								<Link
									href={href}
									className={styles.link}
									aria-current={href === pathname ? "page" : undefined}
									onClick={() => setOpen(false)}
								>
									{item.link.text}
								</Link>

								{hasDropdown ? (
									<ul className={styles.dropdownPanel}>
										{item.children!.map((child, childIndex) => (
											<li key={childIndex}>
												<Link href={hrefFor(child)} className={styles.dropdownLink} onClick={() => setOpen(false)}>
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
		</>
	);
}
