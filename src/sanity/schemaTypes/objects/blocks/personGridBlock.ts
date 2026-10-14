import { defineArrayMember, defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons/Users";

/**
 * A grid of people with a photo + name + role, each expandable to a full
 * bio — generalized from "faculty"/"team"/"staff" patterns, which all
 * turned out to be the same shape. Name it whatever fits the client
 * ("Faculty & Coaches", "Our Team", "Meet the Instructors") via the
 * block's own heading field.
 */
export default defineType({
	name: "personGridBlock",
	title: "Person Grid",
	type: "object",
	icon: UsersIcon,
	fields: [
		defineField({ name: "heading", title: "Heading", type: "string" }),
		defineField({
			name: "people",
			title: "People",
			type: "array",
			of: [
				defineArrayMember({
					type: "object",
					name: "person",
					fields: [
						defineField({
							name: "name",
							title: "Name",
							type: "string",
							validation: (Rule) => Rule.required(),
						}),
						defineField({ name: "role", title: "Role", type: "string" }),
						defineField({
							name: "photo",
							title: "Photo",
							type: "image",
							options: { hotspot: true },
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "bio",
							title: "Biography",
							type: "array",
							of: [{ type: "block" }],
							description: "Shown when a visitor clicks this person's photo.",
						}),
					],
					preview: {
						select: { title: "name", subtitle: "role", media: "photo" },
					},
				}),
			],
		}),
		defineField({
			name: "button",
			title: "Button",
			type: "link",
			description: "Optional — e.g. link to a fuller team/faculty page.",
		}),
	],
	preview: {
		select: { title: "heading", count: "people.length" },
		prepare({ title, count = 0 }) {
			return { title: title || "Person Grid", subtitle: `${count} ${count === 1 ? "person" : "people"}` };
		},
	},
});
