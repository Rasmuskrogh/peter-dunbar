import { defineArrayMember, defineField, defineType } from "sanity";
import { ImagesIcon } from "@sanity/icons/Images";

/** A grid/justified gallery of photos, each with an optional caption + credit. */
export default defineType({
	name: "imageGalleryBlock",
	title: "Image Gallery",
	type: "object",
	icon: ImagesIcon,
	fields: [
		defineField({ name: "heading", title: "Heading", type: "string" }),
		defineField({
			name: "layout",
			title: "Layout",
			type: "string",
			options: {
				list: [
					{ title: "Grid — even, cropped thumbnails", value: "grid" },
					{ title: "Mosaic — justified rows, true aspect ratios", value: "mosaic" },
				],
				layout: "radio",
			},
			initialValue: "grid",
		}),
		defineField({
			name: "images",
			title: "Images",
			type: "array",
			of: [
				defineArrayMember({
					type: "image",
					options: { hotspot: true },
					fields: [
						defineField({
							name: "alt",
							title: "Alt text",
							type: "string",
							description: "Describes the image for screen readers — not shown visually. Required.",
							validation: (Rule) => Rule.required().warning("Every gallery photo needs alt text."),
						}),
						defineField({ name: "caption", title: "Caption", type: "string" }),
						defineField({ name: "credit", title: "Photo credit", type: "string" }),
					],
				}),
			],
			validation: (Rule) => Rule.required().min(1),
		}),
	],
	preview: {
		select: { title: "heading", count: "images.length", media: "images.0" },
		prepare({ title, count = 0, media }) {
			return { title: title || "Image Gallery", subtitle: `${count} image${count === 1 ? "" : "s"}`, media };
		},
	},
});
