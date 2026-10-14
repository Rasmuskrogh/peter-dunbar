import { defineField, defineType } from "sanity";
import { ImagesIcon } from "@sanity/icons/Images";

/** Text on one side, image on the other — order controlled by imagePosition. */
export default defineType({
	name: "textWithImageBlock",
	title: "Text with Image",
	type: "object",
	icon: ImagesIcon,
	fields: [
		defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
		defineField({
			name: "heading",
			title: "Heading",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "body",
			title: "Body",
			type: "array",
			of: [{ type: "block", styles: [{ title: "Normal", value: "normal" }] }],
		}),
		defineField({ name: "button", title: "Button", type: "link" }),
		defineField({
			name: "facts",
			title: "Quick facts",
			type: "array",
			description:
				'Optional — a short label/value list under the body text (e.g. "Founded: 2019"), for a bio-style summary strip.',
			of: [
				{
					type: "object",
					name: "fact",
					fields: [
						{ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() },
						{ name: "value", title: "Value", type: "string", validation: (Rule) => Rule.required() },
					],
					preview: { select: { title: "label", subtitle: "value" } },
				},
			],
		}),
		defineField({
			name: "showContactDetails",
			title: "Show contact details list",
			type: "boolean",
			description:
				"Adds a list below the body pulling email/phone/address/website/social links straight from Site Settings — for a contact page's intro block. Off by default.",
			initialValue: false,
		}),
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
					description: "Describes the image for screen readers. Leave empty only if the image is purely decorative.",
				}),
			],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "imageStyle",
			title: "Image shape",
			type: "string",
			options: { list: ["circle", "rectangle"], layout: "radio" },
			initialValue: "rectangle",
		}),
		defineField({
			name: "imagePosition",
			title: "Image position",
			type: "string",
			options: { list: ["left", "right"], layout: "radio" },
			initialValue: "right",
		}),
	],
	preview: {
		select: { title: "heading", media: "image" },
	},
});
