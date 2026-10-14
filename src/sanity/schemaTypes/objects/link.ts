import { defineField, defineType } from "sanity";
import { LinkIcon } from "@sanity/icons/Link";

/**
 * A link that's either an internal reference (to a `page` or `homePage`
 * document) or an external URL, with its own display text — the same
 * "one field, either kind of link" pattern used for every button/link
 * across every block below. Add it to a block with:
 *
 *   defineField({ name: "button", type: "link" })
 */
export default defineType({
	name: "link",
	title: "Link",
	type: "object",
	icon: LinkIcon,
	fields: [
		defineField({
			name: "text",
			title: "Link text",
			type: "string",
		}),
		defineField({
			name: "linkType",
			title: "Link type",
			type: "string",
			options: {
				list: [
					{ title: "Internal page", value: "internal" },
					{ title: "External URL", value: "external" },
				],
				layout: "radio",
				direction: "horizontal",
			},
			initialValue: "internal",
		}),
		defineField({
			name: "internalLink",
			title: "Page",
			type: "reference",
			to: [{ type: "page" }, { type: "homePage" }],
			hidden: ({ parent }) => parent?.linkType !== "internal",
		}),
		defineField({
			name: "externalUrl",
			title: "URL",
			type: "url",
			hidden: ({ parent }) => parent?.linkType !== "external",
		}),
		defineField({
			name: "openInNewTab",
			title: "Open in new tab",
			type: "boolean",
			initialValue: false,
			hidden: ({ parent }) => parent?.linkType !== "external",
		}),
	],
	preview: {
		select: { title: "text", linkType: "linkType", externalUrl: "externalUrl" },
		prepare({ title, linkType, externalUrl }) {
			return {
				title: title || "(no text)",
				subtitle: linkType === "external" ? externalUrl : "Internal page",
			};
		},
	},
});
