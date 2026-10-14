/**
 * One-off: creates the site's three pages — Home, Gallery (/gallery),
 * Contact (/contact) — plus Site Settings with the menu linking them.
 * Text is placeholder copy in [brackets] to replace in /studio; images
 * are uploaded there too (the hero and gallery have none yet).
 *
 * Safe to re-run: singletons use createIfNotExists, and a page is only
 * created if no page with that slug exists yet.
 *
 *   npx sanity exec scripts/seed-pages.mjs --with-user-token
 */
import { randomUUID } from "node:crypto";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-01-01" });
const key = () => randomUUID().replace(/-/g, "").slice(0, 12);

const paragraph = (text) => ({
	_type: "block",
	_key: key(),
	style: "normal",
	markDefs: [],
	children: [{ _type: "span", _key: key(), text, marks: [] }],
});

async function ensurePage(slug, title, pageBuilder) {
	const existing = await client.fetch(`*[_type == "page" && slug.current == $slug][0]._id`, { slug });
	if (existing) return existing.replace(/^drafts\./, "");
	const created = await client.create({ _type: "page", title, slug: { _type: "slug", current: slug }, pageBuilder });
	return created._id;
}

const galleryId = await ensurePage("gallery", "Gallery", [
	{ _type: "imageGalleryBlock", _key: key(), heading: "Gallery", layout: "mosaic" },
]);

const contactId = await ensurePage("contact", "Contact", [
	{
		_type: "textBlock",
		_key: key(),
		heading: "Get in touch",
		body: [paragraph("[A sentence or two about how and why to get in touch.]")],
	},
	{
		_type: "contactFormBlock",
		_key: key(),
		heading: "Send a message",
		nameLabel: "Name",
		emailLabel: "Email",
		messageLabel: "Message",
		submitLabel: "Send",
		successMessage: "Thanks! Your message has been sent.",
		errorMessage: "Something went wrong. Please try again, or email directly.",
	},
]);

const internal = (text, ref) => ({ _type: "link", text, linkType: "internal", internalLink: { _type: "reference", _ref: ref } });

const tx = client.transaction();
tx.createIfNotExists({
	_id: "homePage",
	_type: "homePage",
	title: "Home",
	pageBuilder: [
		{
			_type: "textBlock",
			_key: key(),
			eyebrow: "[Short tagline]",
			heading: "[Peter's name]",
			body: [paragraph("[An introduction — who Peter is and what the site is about.]")],
			button: internal("See the gallery", galleryId),
		},
		{
			_type: "ctaBlock",
			_key: key(),
			heading: "Want to get in touch?",
			button: internal("Contact", contactId),
		},
	],
});
tx.createIfNotExists({
	_id: "siteSettings",
	_type: "siteSettings",
	title: "Site Settings",
	siteName: "[Peter's name]",
	navItems: [
		{ _type: "navItem", _key: key(), link: internal("Home", "homePage") },
		{ _type: "navItem", _key: key(), link: internal("Gallery", galleryId) },
		{ _type: "navItem", _key: key(), link: internal("Contact", contactId) },
	],
	copyrightName: "[Peter's name]",
});
await tx.commit();
console.log("Done:", { homePage: "homePage", gallery: galleryId, contact: contactId, siteSettings: "siteSettings" });
