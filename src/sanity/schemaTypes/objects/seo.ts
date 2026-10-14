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
			description: "Falls back to the page title if left empty.",
		}),
		defineField({
			name: "metaDescription",
			title: "Meta description",
			type: "text",
			rows: 2,
		}),
		defineField({
			name: "metaImage",
			title: "Social share image",
			type: "image",
			description: "Shown when the page is shared on social media. Falls back to the site default.",
		}),
	],
});
