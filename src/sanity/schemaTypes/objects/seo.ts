import { defineField, defineType } from "sanity";

/**
 * Reusable SEO/social-sharing fields. Add this as a field (not a
 * top-level document) to any page-like document type:
 *
 *   defineField({ name: "seo", type: "seo" })
 *
 * Keeping it as one object type means every page gets the same three
 * fields with the same behavior, defined once.
 */
export default defineType({
	name: "seo",
	title: "SEO & Social",
	type: "object",
	options: { collapsible: true, collapsed: true },
	fields: [
		defineField({
			name: "metaTitle",
			title: "Meta title",
			type: "string",
			description: 'Falls back to the page title + site name if left empty. Write it in full, e.g. "Om mig — sångerska i Stockholm | Anna Svensson".',
			validation: (Rule) => Rule.max(60).warning("Google usually cuts titles off after about 60 characters."),
		}),
		defineField({
			name: "metaDescription",
			title: "Meta description",
			type: "text",
			rows: 2,
			description: "The text under the title in Google. Falls back to the site description in Site Settings.",
			validation: (Rule) => Rule.max(160).warning("Google usually cuts descriptions off after about 160 characters."),
		}),
		defineField({
			name: "metaImage",
			title: "Social share image",
			type: "image",
			description: "Shown when the page is shared on social media. Falls back to the site default. Ideally 1200 × 630 px.",
			options: { hotspot: true },
		}),
		defineField({
			name: "noIndex",
			title: "Hide from search engines",
			type: "boolean",
			description: "For pages that shouldn't show up in Google, e.g. a thank-you page. Also leaves the page out of the sitemap.",
			initialValue: false,
		}),
	],
});
