import { defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons/Home";
import { pageBuilderField } from "../objects/pageBuilder";

/**
 * Singleton — there is only ever one Home Page document. Enforced in the
 * Studio via structure.ts (no "create new" button, can't be deleted),
 * not by Sanity itself, which has no built-in singleton concept.
 */
export default defineType({
	name: "homePage",
	title: "Home Page",
	type: "document",
	icon: HomeIcon,
	fields: [
		defineField({
			name: "title",
			title: "Internal title",
			type: "string",
			description: "For the Studio only — not shown on the site.",
			initialValue: "Home",
			readOnly: true,
		}),
		pageBuilderField,
		defineField({ name: "seo", title: "SEO & Social", type: "seo" }),
	],
	preview: {
		prepare() {
			return { title: "Home Page" };
		},
	},
});
