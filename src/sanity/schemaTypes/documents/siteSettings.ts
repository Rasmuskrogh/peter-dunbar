import { defineArrayMember, defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons/Cog";

/**
 * Singleton — global, site-wide content that isn't really "a page":
 * nav menu, logo, social links, contact info. Read this from a single
 * deterministic query (see lib/queries.ts) rather than ever letting a
 * second copy of it get created — that exact bug (a duplicate Settings
 * document causing "which one is real?" confusion) has bitten a past
 * project, hence the singleton enforcement in structure.ts.
 */
export default defineType({
	name: "siteSettings",
	title: "Site Settings",
	type: "document",
	icon: CogIcon,
	fieldsets: [{ name: "seo", title: "SEO & search", options: { collapsible: true, collapsed: false } }],
	fields: [
		defineField({
			name: "title",
			title: "Internal title",
			type: "string",
			initialValue: "Site Settings",
			readOnly: true,
		}),
		defineField({ name: "siteName", title: "Site name", type: "string" }),
		defineField({ name: "logo", title: "Logo", type: "image" }),
		defineField({
			name: "navItems",
			title: "Navigation",
			type: "array",
			description: "The header menu, top to bottom in this list's order.",
			of: [
				defineArrayMember({
					type: "object",
					name: "navItem",
					fields: [
						defineField({ name: "link", title: "Link", type: "link", validation: (Rule) => Rule.required() }),
						defineField({
							name: "children",
							title: "Dropdown items",
							type: "array",
							description: "Optional — turns this item into a hover/click dropdown.",
							of: [defineArrayMember({ type: "link" })],
						}),
					],
					preview: {
						select: { title: "link.text", count: "children.length" },
						prepare({ title, count = 0 }) {
							return { title: title || "(untitled)", subtitle: count ? `${count} dropdown items` : undefined };
						},
					},
				}),
			],
		}),
		defineField({ name: "email", title: "Contact email", type: "string" }),
		defineField({ name: "phone", title: "Contact phone", type: "string" }),
		defineField({ name: "address", title: "Address", type: "text", rows: 2 }),
		defineField({
			name: "managementName",
			title: "Management / agency name",
			type: "string",
			description:
				'Shown alongside the address on a contact page (e.g. "Acme Talent Management") — separate from the site name itself.',
		}),
		defineField({ name: "website", title: "Website", type: "url" }),
		defineField({
			name: "socialLinks",
			title: "Social links",
			type: "array",
			of: [
				defineArrayMember({
					type: "object",
					name: "socialLink",
					fields: [
						defineField({
							name: "platform",
							title: "Platform",
							type: "string",
							options: { list: ["Instagram", "Facebook", "TikTok", "YouTube", "LinkedIn", "X"] },
						}),
						defineField({ name: "url", title: "URL", type: "url", validation: (Rule) => Rule.required() }),
					],
					preview: {
						select: { title: "platform", subtitle: "url" },
					},
				}),
			],
		}),
		defineField({
			name: "copyrightName",
			title: "Copyright name",
			type: "string",
			description: 'E.g. "Acme Inc" — rendered as "© {year} {this}" in the footer.',
		}),
		defineField({
			name: "language",
			title: "Site language",
			type: "string",
			fieldset: "seo",
			options: { list: [{ title: "Svenska", value: "sv" }, { title: "English", value: "en" }], layout: "radio", direction: "horizontal" },
			initialValue: "sv",
			description: "Tells browsers and search engines which language the site is in.",
		}),
		defineField({
			name: "siteDescription",
			title: "Site description",
			type: "text",
			rows: 2,
			fieldset: "seo",
			description: "One or two sentences about the site. Used in search results for pages without their own meta description.",
			validation: (Rule) => Rule.max(160).warning("Google usually cuts descriptions off after about 160 characters."),
		}),
		defineField({
			name: "defaultShareImage",
			title: "Default share image",
			type: "image",
			fieldset: "seo",
			options: { hotspot: true },
			description: "Shown when a page without its own share image is shared on social media. Ideally 1200 × 630 px.",
		}),
		defineField({
			name: "entityType",
			title: "Who is behind the site?",
			type: "string",
			fieldset: "seo",
			options: {
				list: [
					{ title: "A person (artist, freelancer)", value: "Person" },
					{ title: "A band or ensemble", value: "MusicGroup" },
					{ title: "A local business", value: "LocalBusiness" },
					{ title: "An organization or company", value: "Organization" },
				],
				layout: "radio",
			},
			initialValue: "Organization",
			description: "Helps Google and AI assistants understand the site — used in the structured data.",
		}),
	],
	preview: {
		prepare() {
			return { title: "Site Settings" };
		},
	},
});
