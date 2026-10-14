/**
 * Sanity has no built-in oEmbed-resolving field (unlike Prismic's
 * Embed field, which auto-fetches provider thumbnail/HTML). This
 * covers the common cases with plain URL parsing instead — no API
 * call, no extra dependency. Unrecognized URLs get `null` back and
 * the caller should link out instead of embedding.
 */
export function embedSrcFor(url: string): string | null {
	let u: URL;
	try {
		u = new URL(url);
	} catch {
		return null;
	}

	if (u.hostname.includes("youtube.com")) {
		const id = u.searchParams.get("v");
		if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
	}
	if (u.hostname === "youtu.be") {
		const id = u.pathname.slice(1);
		if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
	}
	if (u.hostname.includes("vimeo.com")) {
		const id = u.pathname.split("/").filter(Boolean).pop();
		if (id) return `https://player.vimeo.com/video/${id}`;
	}
	if (u.hostname.includes("open.spotify.com")) {
		return `https://open.spotify.com/embed${u.pathname}`;
	}

	return null;
}

/** A free YouTube thumbnail (no API key needed) for when no manual thumbnail is set. */
export function youtubeThumbnailFor(url: string): string | null {
	let u: URL;
	try {
		u = new URL(url);
	} catch {
		return null;
	}

	let id: string | null = null;
	if (u.hostname.includes("youtube.com")) id = u.searchParams.get("v");
	if (u.hostname === "youtu.be") id = u.pathname.slice(1);

	return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}
