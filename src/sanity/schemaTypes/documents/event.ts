import { defineField, defineType } from "sanity";
import { CalendarIcon } from "@sanity/icons/Calendar";

/**
 * A single event (concert, show, talk — whatever a project needs a
 * calendar of). Not embedded in a page directly: the `eventsBlock`
 * pulls in every Event document via its own query and does the
 * upcoming/past split, so editors just add events here without
 * touching any page.
 */
export default defineType({
	name: "event",
	title: "Event",
	type: "document",
	icon: CalendarIcon,
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({ name: "description", title: "Description", type: "array", of: [{ type: "block" }] }),
		defineField({
			name: "date",
			title: "Date & time",
			type: "datetime",
			validation: (Rule) => Rule.required(),
		}),
		defineField({ name: "venue", title: "Venue", type: "string" }),
		defineField({ name: "location", title: "Location", type: "string", description: "City / country" }),
		defineField({
			name: "ticketLink",
			title: "Ticket / info link",
			type: "link",
			description: "Optional — e.g. a ticket vendor page.",
		}),
	],
	preview: {
		select: { title: "title", date: "date", venue: "venue" },
		prepare({ title, date, venue }) {
			const dateLabel = date ? new Date(date).toLocaleDateString() : "No date";
			return { title, subtitle: [dateLabel, venue].filter(Boolean).join(" · ") };
		},
	},
	orderings: [
		{
			title: "Date, soonest first",
			name: "dateAsc",
			by: [{ field: "date", direction: "asc" }],
		},
	],
});
