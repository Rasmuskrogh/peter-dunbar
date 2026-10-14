import { defineField, defineType } from "sanity";
import { PlayIcon } from "@sanity/icons/Play";

/**
 * A single recording/media item (a YouTube/Vimeo/Spotify link, or any
 * other URL). Like `event`, not embedded in a page: `recordingsBlock`
 * pulls in every Recording document and groups them by `category` —
 * a free-text field on purpose, not a fixed list, so each project
 * defines its own categories instead of inheriting one client's.
 */
export default defineType({
	name: "recording",
	title: "Recording",
	type: "document",
	icon: PlayIcon,
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({ name: "composer", title: "Composer / artist", type: "string" }),
		defineField({
			name: "category",
			title: "Category",
			type: "string",
			description:
				"Free text — recordings are grouped by whatever category names you use here. Leave blank to show it in an \"Uncategorized\" group.",
		}),
		defineField({
			name: "mediaUrl",
			title: "Media URL",
			type: "url",
			description: "A YouTube, Vimeo, or Spotify link. Other URLs link out instead of embedding.",
			validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] }),
		}),
		defineField({
			name: "thumbnail",
			title: "Thumbnail",
			type: "image",
			options: { hotspot: true },
			description: "Optional. YouTube links get a thumbnail automatically if this is left blank.",
		}),
	],
	preview: {
		select: { title: "title", subtitle: "composer", media: "thumbnail" },
	},
});
