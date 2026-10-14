import type { SanityLink } from "./types";

/** Resolves a SanityLink (internal ref or external URL) to a plain href string. */
export function hrefFor(link: SanityLink | null | undefined): string {
	if (!link?.url) return "#";
	if (link.linkType === "internal") {
		return link.url === "home" ? "/" : `/${link.url}`;
	}
	return link.url;
}
