import { defineField, defineType } from "sanity";
import { PlayIcon } from "@sanity/icons/Play";

/**
 * Like eventsBlock: no content of its own, it lists every `recording`
 * document grouped by category at render time. Add/edit recordings
 * from the "Recordings" list in the Studio's main navigation.
 */
export default defineType({
	name: "recordingsBlock",
	title: "Recordings",
	type: "object",
	icon: PlayIcon,
	fields: [
		defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
		defineField({ name: "heading", title: "Heading", type: "string" }),
		defineField({
			name: "featured",
			title: "Featured recordings",
			type: "array",
			description:
				"For a homepage teaser: hand-pick specific recordings to highlight, shown as a flat list (no category grouping). Leave empty to show every Recording, grouped by category, instead.",
			of: [{ type: "reference", to: [{ type: "recording" }] }],
		}),
		defineField({
			name: "button",
			title: "Button",
			type: "link",
			description: "Optional — e.g. \"See all recordings\" linking to a dedicated page.",
		}),
	],
	preview: {
		select: { title: "heading" },
		prepare({ title }) {
			return { title: title || "Recordings", subtitle: "Lists every Recording document" };
		},
	},
});
