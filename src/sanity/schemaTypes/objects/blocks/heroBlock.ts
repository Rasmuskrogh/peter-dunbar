import { defineField, defineType } from "sanity";
import { ImageIcon } from "@sanity/icons/Image";

/** Full-bleed image banner with a heading — typically the first block on a homepage. */
export default defineType({
	name: "heroBlock",
	title: "Hero",
	type: "object",
	icon: ImageIcon,
	fields: [
		defineField({
			name: "backgroundImage",
			title: "Background image",
			type: "image",
			options: { hotspot: true },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "heading",
			title: "Heading",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "subheading",
			title: "Subheading",
			type: "string",
			description: "E.g. a date, location, or short tagline.",
		}),
		defineField({
			name: "darkenOverlay",
			title: "Darken image for text legibility",
			type: "boolean",
			initialValue: true,
		}),
	],
	preview: {
		select: { title: "heading", media: "backgroundImage" },
	},
});
