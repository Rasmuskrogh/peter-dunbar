import { defineField, defineType } from "sanity";
import { CalendarIcon } from "@sanity/icons/Calendar";

/**
 * Unlike other blocks, this one doesn't hold its own content — drop it
 * on a page and it automatically lists every `event` document (see
 * queries.ts: it runs its own *[_type == "event"] sub-query and splits
 * upcoming/past at render time). Add/edit events from the "Events"
 * list in the Studio's main navigation, not from inside this block.
 */
export default defineType({
	name: "eventsBlock",
	title: "Events Calendar",
	type: "object",
	icon: CalendarIcon,
	fields: [
		defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
		defineField({ name: "heading", title: "Heading", type: "string" }),
		defineField({
			name: "limit",
			title: "Show only the next N upcoming events",
			type: "number",
			description:
				"For a homepage teaser (e.g. \"next 2 events\"). Leave empty for the full calendar — every upcoming event, plus past events collapsed by year.",
			validation: (Rule) => Rule.min(1).integer(),
		}),
		defineField({
			name: "button",
			title: "Button",
			type: "link",
			description: "Optional — e.g. \"See full calendar\" linking to a dedicated events page.",
		}),
	],
	preview: {
		select: { title: "heading" },
		prepare({ title }) {
			return { title: title || "Events Calendar", subtitle: "Lists every Event document" };
		},
	},
});
