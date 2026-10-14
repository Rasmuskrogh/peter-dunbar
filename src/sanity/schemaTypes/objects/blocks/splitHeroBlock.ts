import { defineField, defineType } from "sanity";
import { SplitHorizontalIcon } from "@sanity/icons/SplitHorizontal";

/**
 * Two-column hero: text and buttons on a deep green panel to the left, a
 * full-height image on the right (stacked on mobile). Typically the
 * first block on the home page. Unlike `heroBlock`, the text never sits
 * on the photo.
 */
export default defineType({
	name: "splitHeroBlock",
	title: "Split Hero",
	type: "object",
	icon: SplitHorizontalIcon,
	fields: [
		defineField({
			name: "eyebrow",
			title: "Eyebrow",
			type: "string",
			description: 'Small line above the heading, e.g. "Original works · 2026".',
		}),
		defineField({
			name: "heading",
			title: "Heading",
			type: "string",
			description: "Wrap words in *asterisks* to set them in italic gold, e.g. Painting the *living* landscape.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({ name: "body", title: "Text", type: "text", rows: 3 }),
		defineField({ name: "primaryButton", title: "Main button", type: "link" }),
		defineField({ name: "secondaryButton", title: "Second button", type: "link", description: "Shown as a text link with an arrow." }),
		defineField({
			name: "image",
			title: "Image",
			type: "image",
			options: { hotspot: true },
			fields: [
				defineField({
					name: "alt",
					title: "Alt text",
					type: "string",
					description: "Describes the image for screen readers.",
					validation: (Rule) => Rule.required().warning("The hero image needs alt text."),
				}),
			],
			validation: (Rule) => Rule.required().warning("Without an image the right side shows an empty beige panel."),
		}),
	],
	preview: {
		select: { title: "heading", subtitle: "eyebrow", media: "image" },
		prepare({ title, subtitle, media }) {
			return { title: title?.replace(/\*/g, "") || "Split Hero", subtitle, media };
		},
	},
});
