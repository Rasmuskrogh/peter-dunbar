import { defineField, defineType } from "sanity";
import { TextIcon } from "@sanity/icons/Text";

/**
 * Centered eyebrow/heading/body/button — the workhorse "just some
 * text" block. Heading is optional: with none, and a `pullQuote` set,
 * this switches to a full-width, left-aligned two-column layout
 * (body + a pulled-out quote beside it) instead of the default
 * centered CTA-style block — see TextBlock.tsx.
 */
export default defineType({
	name: "textBlock",
	title: "Text",
	type: "object",
	icon: TextIcon,
	fields: [
		defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
		defineField({ name: "heading", title: "Heading", type: "string" }),
		defineField({
			name: "body",
			title: "Body",
			type: "array",
			of: [{ type: "block", styles: [{ title: "Normal", value: "normal" }] }],
		}),
		defineField({ name: "button", title: "Button", type: "link" }),
		defineField({
			name: "pullQuote",
			title: "Pull quote",
			type: "object",
			description:
				"Optional — a highlighted quote shown beside the body text (switches this block to a full-width, left-aligned layout instead of the default centered one).",
			fields: [
				{ name: "quote", title: "Quote", type: "text", rows: 2, validation: (Rule) => Rule.required() },
				{ name: "source", title: "Source", type: "string" },
			],
			preview: { select: { title: "quote", subtitle: "source" } },
		}),
	],
	preview: {
		select: { title: "heading", subtitle: "eyebrow" },
		prepare({ title, subtitle }) {
			return { title: title || "Text", subtitle };
		},
	},
});
