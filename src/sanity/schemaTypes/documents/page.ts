import { defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons/Document";
import { pageBuilderField } from "../objects/pageBuilder";

/**
 * Generic repeatable page — About, Application, Contact, or any other
 * simple page a client needs, without a dedicated schema each time.
 * Routed by its slug: a page with slug "about" renders at /about.
 *
 * Reach for a dedicated document type instead only when a page needs
 * fields a generic slug + pageBuilder can't express (e.g. an Event with
 * a real date field to sort/filter by, not just page content).
 */
export default defineType({
	name: "page",
	title: "Page",
	type: "document",
	icon: DocumentIcon,
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			description: "For the Studio list and as a fallback page heading.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "URL",
			type: "slug",
			options: { source: "title", maxLength: 96 },
			validation: (Rule) => Rule.required(),
		}),
		pageBuilderField,
		defineField({ name: "seo", title: "SEO & Social", type: "seo" }),
	],
	preview: {
		select: { title: "title", slug: "slug.current" },
		prepare({ title, slug }) {
			return { title, subtitle: slug ? `/${slug}` : "(no URL set)" };
		},
	},
});
