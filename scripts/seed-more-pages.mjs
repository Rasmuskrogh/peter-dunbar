/**
 * Second round of pages: About, Commissions, Greeting Cards, Originals
 * and Prints, with suggested copy (anything in [brackets] still needs
 * Peter's real details). Images are uploaded in /studio. Also rebuilds
 * the menu and points the home hero's main button at Originals.
 *
 * Safe to re-run: a page is only created if its slug doesn't exist yet.
 *
 *   npx sanity exec scripts/seed-more-pages.mjs --with-user-token
 */
import { randomUUID } from "node:crypto";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-01-01" });
const key = () => randomUUID().replace(/-/g, "").slice(0, 12);
const keyed = (items) => items.map((item) => ({ _key: key(), ...item }));

const paragraphs = (...texts) =>
	texts.map((text) => ({
		_type: "block",
		_key: key(),
		style: "normal",
		markDefs: [],
		children: [{ _type: "span", _key: key(), text, marks: [] }],
	}));
const internal = (text, ref) => ({ _type: "link", text, linkType: "internal", internalLink: { _type: "reference", _ref: ref } });
const idOf = (slug) => client.fetch(`*[_type == "page" && slug.current == $slug && !(_id in path("drafts.**"))][0]._id`, { slug });

async function ensurePage(slug, title, pageBuilder) {
	const existing = await idOf(slug);
	if (existing) return existing;
	return (await client.create({ _type: "page", title, slug: { _type: "slug", current: slug }, pageBuilder }))._id;
}

const contact = await idOf("contact");
const text = (eyebrow, heading, ...body) => ({ _type: "textBlock", _key: key(), eyebrow, heading, body: paragraphs(...body) });
const gallery = (heading, layout) => ({ _type: "imageGalleryBlock", _key: key(), heading, layout });
const cta = (heading, body, button) => ({ _type: "ctaBlock", _key: key(), heading, body, button: internal(button, contact) });
const grid = (heading, columns, items) => ({ _type: "infoGridBlock", _key: key(), heading, columns, items: keyed(items.map(([title, meta, detail]) => ({ _type: "infoGridItem", title, meta, detail }))) });

const originals = await ensurePage("originals", "Originals", [
	text(
		"Original paintings",
		"One of a kind",
		"Every painting here is an original — painted by hand, signed, and the only one of its kind. Click a painting to see it larger; size, medium and price are in the caption.",
		"Paintings are sold unframed unless the caption says otherwise. I'm happy to send more photos or arrange a viewing.",
	),
	gallery("Available paintings", "mosaic"),
	cta("Interested in a painting?", "Ask about availability, framing or shipping — or come and see it in person.", "Ask about a painting"),
]);

const prints = await ensurePage("prints", "Prints", [
	text(
		"Prints",
		"Fine art prints",
		"A selection of my paintings is available as fine art giclée prints — printed on heavy archival paper with pigment inks, so the colours last for decades. Every print is checked and signed by hand.",
	),
	grid("Sizes", 3, [
		["A4", "[price]", "21 × 30 cm. Fits a standard 30 × 40 cm frame with a mount."],
		["A3", "[price]", "30 × 42 cm. Fits a standard 40 × 50 cm frame with a mount."],
		["A2", "[price]", "42 × 59 cm. For the walls that need something bigger."],
	]),
	gallery("Available as prints", "mosaic"),
	cta("Order a print", "Tell me which motif and size you'd like, and I'll get back to you with delivery details.", "Order a print"),
]);

const cards = await ensurePage("greeting-cards", "Greeting Cards", [
	text(
		"Greeting cards",
		"Paintings to send",
		"My paintings as folded cards — printed on thick matte card, blank inside for your own words, and sent with an envelope. Mix motifs however you like.",
	),
	grid("Packages", 3, [
		["Single card", "[price]", "One card of your choice, with envelope."],
		["Pack of 5", "[price]", "Five cards — the same motif or a mix."],
		["Pack of 10", "[price]", "Ten cards for the whole year's birthdays and thank-yous."],
	]),
	gallery("The motifs", "grid"),
	cta("Order cards", "Let me know which package and motifs you'd like.", "Order cards"),
]);

const commissions = await ensurePage("commissions", "Commissions", [
	text(
		"Commissions",
		"A painting made for you",
		"A favourite view, the house you grew up in, the place where you got engaged — I paint commissions of the places that matter to you, in the same style as my own work.",
		"Commissions usually take [4–6 weeks] from the first sketch to the finished painting. Prices start at [price] depending on size.",
	),
	grid("How it works", 4, [
		["Get in touch", "Step 1", "Tell me about the place and send a few photos. We talk about size, medium and budget."],
		["Sketch & quote", "Step 2", "I send a small sketch of the composition and a fixed price."],
		["Painting", "Step 3", "I paint the piece and send you an update along the way."],
		["Delivery", "Step 4", "The finished painting is signed, carefully packed and delivered to you."],
	]),
	gallery("Previous commissions", "grid"),
	cta("Start a commission", "Tell me about the place you'd like painted.", "Start a commission"),
]);

const about = await ensurePage("about", "About", [
	{
		_type: "textWithImageBlock",
		_key: key(),
		eyebrow: "About",
		heading: "Hello, I'm Peter",
		body: paragraphs(
			"I paint the landscapes around me — [the coast, the forests and the changing light of the seasons] — mostly in [watercolour and oil].",
			"[A few sentences on how Peter started painting, where he works, and what draws him to a motif.]",
			"Alongside my originals I make prints and greeting cards, so a painting can find its way to more walls and mailboxes. I also take on commissions.",
		),
		facts: keyed([
			{ _type: "fact", label: "Based in", value: "[Town, country]" },
			{ _type: "fact", label: "Works in", value: "[Watercolour & oil]" },
			{ _type: "fact", label: "Painting since", value: "[Year]" },
		]),
		imageStyle: "rectangle",
		imagePosition: "left",
		button: internal("See the originals", originals),
	},
	{ _type: "ctaBlock", _key: key(), heading: "Have a place you'd like painted?", body: "I take on a few commissions every year.", button: internal("About commissions", commissions) },
]);

// Menu: Home · About · Originals · Prints · Greeting Cards · Commissions · Contact
const nav = [
	["Home", "homePage"],
	["About", about],
	["Originals", originals],
	["Prints", prints],
	["Greeting Cards", cards],
	["Commissions", commissions],
	["Contact", contact],
].map(([label, ref]) => ({ _type: "navItem", _key: key(), link: internal(label, ref) }));
await client.patch("siteSettings").set({ navItems: nav }).commit();

// The home hero's "View gallery" now leads to the originals.
const home = await client.getDocument("homePage");
const heroIndex = (home.pageBuilder ?? []).findIndex((b) => b._type === "splitHeroBlock");
if (heroIndex >= 0) {
	await client
		.patch("homePage")
		.set({ [`pageBuilder[${heroIndex}].primaryButton`]: internal("View originals", originals) })
		.commit();
}

console.log("Done:", { about, commissions, cards, originals, prints, contact });
