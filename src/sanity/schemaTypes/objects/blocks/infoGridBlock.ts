import { defineArrayMember, defineField, defineType } from "sanity";
import { ThListIcon } from "@sanity/icons/ThList";

/**
 * A generic grid of short text items — no photo, just title + optional
 * meta line + optional detail. Covers things like "roles performed",
 * "awards & grants", "services offered", "stats" — anything that's a
 * simple repeating title/subtitle shape. For a grid that needs photos,
 * use personGridBlock instead.
 */
export default defineType({
	name: "infoGridBlock",
	title: "Info Grid",
	type: "object",
	icon: ThListIcon,
	fields: [
		defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
		defineField({ name: "heading", title: "Heading", type: "string" }),
		defineField({
			name: "columns",
			title: "Fixed column count",
			type: "number",
			description: "Leave empty for a responsive grid that fits as many columns as space allows.",
			validation: (Rule) => Rule.min(1).max(6).integer(),
		}),
		defineField({
			name: "items",
			title: "Items",
			type: "array",
			validation: (Rule) => Rule.required().min(1),
			of: [
				defineArrayMember({
					type: "object",
					name: "infoGridItem",
					fields: [
						defineField({
							name: "title",
							title: "Title",
							type: "string",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "meta",
							title: "Meta line",
							type: "string",
							description: "e.g. a second line of context — a composer, a year, a category.",
						}),
						defineField({ name: "detail", title: "Detail", type: "text", rows: 2 }),
					],
					preview: {
						select: { title: "title", subtitle: "meta" },
					},
				}),
			],
		}),
	],
	preview: {
		select: { title: "heading", items: "items" },
		prepare({ title, items }) {
			return {
				title: title || "Info Grid",
				subtitle: items ? `${items.length} item(s)` : undefined,
			};
		},
	},
});
