import { defineArrayMember, defineField, defineType } from "sanity";
import { DoubleQuoteIcon } from "@sanity/icons/DoubleQuote";

/**
 * A list of quotes/testimonials — press reviews, client quotes,
 * anything with a short text + who said it. `limit` lets an editor
 * show only the first N (e.g. 3 highlights on a homepage) and pair it
 * with `button` linking to a page with the full list, instead of
 * needing a separate "teaser" block type for the same content shape.
 */
export default defineType({
	name: "testimonialsBlock",
	title: "Testimonials / Quotes",
	type: "object",
	icon: DoubleQuoteIcon,
	fields: [
		defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
		defineField({ name: "heading", title: "Heading", type: "string" }),
		defineField({
			name: "layout",
			title: "Layout",
			type: "string",
			options: {
				list: [
					{ title: "Grid — every quote visible at once", value: "grid" },
					{ title: "Carousel — one quote at a time, auto-rotating", value: "carousel" },
				],
				layout: "radio",
			},
			initialValue: "grid",
		}),
		defineField({
			name: "quotes",
			title: "Quotes",
			type: "array",
			validation: (Rule) => Rule.required().min(1),
			of: [
				defineArrayMember({
					type: "object",
					name: "quote",
					fields: [
						defineField({
							name: "quote",
							title: "Quote",
							type: "text",
							rows: 3,
							validation: (Rule) => Rule.required(),
						}),
						defineField({ name: "name", title: "Name", type: "string" }),
						defineField({
							name: "source",
							title: "Role / source",
							type: "string",
							description: "e.g. a job title, or the publication a press quote is from",
						}),
						defineField({ name: "date", title: "Date", type: "date" }),
						defineField({
							name: "group",
							title: "Group",
							type: "string",
							description:
								"Optional — quotes sharing the same group (e.g. a project or production) are shown together under one heading, in the grid layout only. Leave every quote's group blank for one flat list.",
						}),
					],
					preview: {
						select: { title: "quote", subtitle: "name" },
					},
				}),
			],
		}),
		defineField({
			name: "limit",
			title: "Show only the first N",
			type: "number",
			description: "Leave empty to show all quotes.",
			validation: (Rule) => Rule.min(1).integer(),
		}),
		defineField({
			name: "button",
			title: "Button",
			type: "link",
			description: "Optional — e.g. \"Read all reviews\" linking to a dedicated page.",
		}),
	],
	preview: {
		select: { title: "heading", quotes: "quotes" },
		prepare({ title, quotes }) {
			return {
				title: title || "Testimonials / Quotes",
				subtitle: quotes ? `${quotes.length} quote(s)` : undefined,
			};
		},
	},
});
