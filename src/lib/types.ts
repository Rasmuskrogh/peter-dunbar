/**
 * Hand-written types matching queries.ts exactly (field-for-field, not
 * the full schema) — deliberately not auto-generated, so a schema field
 * you haven't queried yet doesn't show up as available here. If a
 * project outgrows this, swap in `sanity typegen` for generated types
 * and delete this file.
 */
import type { PortableTextBlock } from "sanity";
import type { Image } from "sanity";

export type SanityLink = {
	text: string | null;
	linkType: "internal" | "external" | null;
	openInNewTab: boolean | null;
	url: string | null;
};

export type SeoFields = {
	metaTitle?: string;
	metaDescription?: string;
	metaImage?: Image;
} | null;

export type HeroBlock = {
	_type: "heroBlock";
	_key: string;
	backgroundImage: Image;
	heading: string;
	subheading: string | null;
	darkenOverlay: boolean | null;
};

export type SplitHeroBlock = {
	_type: "splitHeroBlock";
	_key: string;
	eyebrow: string | null;
	heading: string;
	body: string | null;
	primaryButton: SanityLink | null;
	secondaryButton: SanityLink | null;
	image: (Image & { alt?: string }) | null;
};

export type PullQuote = {
	quote: string;
	source: string | null;
};

export type TextBlock = {
	_type: "textBlock";
	_key: string;
	eyebrow: string | null;
	heading: string | null;
	body: PortableTextBlock[] | null;
	button: SanityLink | null;
	pullQuote: PullQuote | null;
};

export type Fact = {
	label: string;
	value: string;
};

export type TextWithImageBlock = {
	_type: "textWithImageBlock";
	_key: string;
	eyebrow: string | null;
	heading: string;
	body: PortableTextBlock[] | null;
	button: SanityLink | null;
	facts: Fact[] | null;
	showContactDetails: boolean | null;
	image: (Image & { alt?: string }) | null;
	imageStyle: "circle" | "rectangle" | null;
	imagePosition: "left" | "right" | null;
};

export type Person = {
	name: string;
	role: string | null;
	photo: Image;
	bio: PortableTextBlock[] | null;
};

export type PersonGridBlock = {
	_type: "personGridBlock";
	_key: string;
	heading: string | null;
	people: Person[] | null;
	button: SanityLink | null;
};

export type GalleryImage = Image & {
	alt: string;
	caption?: string;
	credit?: string;
	// Only present because the query explicitly asks for it (asset->metadata.dimensions)
	// — needed by the "mosaic" layout to lay out true-aspect-ratio justified rows.
	dimensions?: { width: number; height: number };
};

export type ImageGalleryBlock = {
	_type: "imageGalleryBlock";
	_key: string;
	heading: string | null;
	layout: "grid" | "mosaic" | null;
	images: GalleryImage[];
};

export type CtaBlock = {
	_type: "ctaBlock";
	_key: string;
	eyebrow: string | null;
	heading: string;
	body: string | null;
	button: SanityLink;
};

export type Testimonial = {
	quote: string;
	name: string | null;
	source: string | null;
	date: string | null;
	group: string | null;
};

export type TestimonialsBlock = {
	_type: "testimonialsBlock";
	_key: string;
	eyebrow: string | null;
	heading: string | null;
	layout: "grid" | "carousel" | null;
	quotes: Testimonial[];
	limit: number | null;
	button: SanityLink | null;
};

export type InfoGridItem = {
	title: string;
	meta: string | null;
	detail: string | null;
};

export type InfoGridBlock = {
	_type: "infoGridBlock";
	_key: string;
	eyebrow: string | null;
	heading: string | null;
	columns: number | null;
	items: InfoGridItem[];
};

export type ContactFormBlock = {
	_type: "contactFormBlock";
	_key: string;
	heading: string | null;
	nameLabel: string | null;
	namePlaceholder: string | null;
	emailLabel: string | null;
	emailPlaceholder: string | null;
	messageLabel: string | null;
	messagePlaceholder: string | null;
	submitLabel: string | null;
	successMessage: string | null;
	errorMessage: string | null;
};

export type EventItem = {
	_id: string;
	title: string;
	description: PortableTextBlock[] | null;
	date: string;
	venue: string | null;
	location: string | null;
	ticketLink: SanityLink | null;
};

export type EventsBlock = {
	_type: "eventsBlock";
	_key: string;
	eyebrow: string | null;
	heading: string | null;
	limit: number | null;
	button: SanityLink | null;
	events: EventItem[];
};

export type RecordingItem = {
	_id: string;
	title: string;
	composer: string | null;
	category: string | null;
	mediaUrl: string;
	thumbnail: Image | null;
};

export type RecordingsBlock = {
	_type: "recordingsBlock";
	_key: string;
	eyebrow: string | null;
	heading: string | null;
	button: SanityLink | null;
	// Non-empty only when the editor hand-picked specific recordings on
	// the block itself — see RecordingsBlock.tsx for how that changes
	// the render (flat list, editor's own order) vs. the default
	// (every recording, grouped by category).
	featured: RecordingItem[];
	recordings: RecordingItem[];
};

export type PageBuilderBlock =
	| HeroBlock
	| SplitHeroBlock
	| TextBlock
	| TextWithImageBlock
	| PersonGridBlock
	| ImageGalleryBlock
	| CtaBlock
	| TestimonialsBlock
	| InfoGridBlock
	| ContactFormBlock
	| EventsBlock
	| RecordingsBlock;

export type PageDocument = {
	title?: string;
	pageBuilder: PageBuilderBlock[] | null;
	seo: SeoFields;
};

export type NavLink = {
	link: SanityLink;
	children: SanityLink[] | null;
};

export type SiteSettings = {
	siteName: string | null;
	logo: Image | null;
	navItems: NavLink[] | null;
	email: string | null;
	phone: string | null;
	address: string | null;
	managementName: string | null;
	website: string | null;
	socialLinks: { platform: string; url: string }[] | null;
	copyrightName: string | null;
};
