import { defineField, defineType } from "sanity";
import { StarIcon } from "@sanity/icons/Star";

/** A short, high-contrast call-to-action banner — "key facts + one button". */
export default defineType({
	name: "ctaBlock",
	title: "Call to Action",
	type: "object",
	icon: StarIcon,
	fields: [
		defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
		defineField({
			name: "heading",
			title: "Heading",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
		defineField({
			name: "button",
			title: "Button",
			type: "link",
			validation: (Rule) => Rule.required(),
		}),
	],
	preview: {
		select: { title: "heading", subtitle: "eyebrow" },
	},
});
