import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons/Envelope";

/**
 * A contact form with every label editable in the Studio (so an editor
 * can localize it without a code change) that POSTs to /api/contact.
 * That route needs EMAIL_USER/EMAIL_PASS (and optionally CONTACT_EMAIL)
 * in the environment to actually deliver mail — see README.md. Without
 * them it still works end-to-end using a disposable test inbox, so the
 * whole flow can be verified before real credentials exist.
 */
export default defineType({
	name: "contactFormBlock",
	title: "Contact Form",
	type: "object",
	icon: EnvelopeIcon,
	groups: [
		{ name: "content", title: "Content", default: true },
		{ name: "labels", title: "Field labels" },
	],
	fields: [
		defineField({
			name: "heading",
			title: "Heading",
			type: "string",
			group: "content",
			initialValue: "Send us a message",
		}),
		defineField({
			name: "nameLabel",
			title: "Name field label",
			type: "string",
			group: "labels",
			initialValue: "Name",
		}),
		defineField({
			name: "namePlaceholder",
			title: "Name field placeholder",
			type: "string",
			group: "labels",
		}),
		defineField({
			name: "emailLabel",
			title: "Email field label",
			type: "string",
			group: "labels",
			initialValue: "Email",
		}),
		defineField({
			name: "emailPlaceholder",
			title: "Email field placeholder",
			type: "string",
			group: "labels",
		}),
		defineField({
			name: "messageLabel",
			title: "Message field label",
			type: "string",
			group: "labels",
			initialValue: "Message",
		}),
		defineField({
			name: "messagePlaceholder",
			title: "Message field placeholder",
			type: "string",
			group: "labels",
		}),
		defineField({
			name: "submitLabel",
			title: "Submit button text",
			type: "string",
			group: "labels",
			initialValue: "Send",
		}),
		defineField({
			name: "successMessage",
			title: "Success message",
			type: "string",
			group: "labels",
			initialValue: "Thanks! Your message has been sent.",
		}),
		defineField({
			name: "errorMessage",
			title: "Error message",
			type: "string",
			group: "labels",
			initialValue: "Something went wrong. Please try again, or email us directly.",
		}),
	],
	preview: {
		select: { title: "heading" },
		prepare({ title }) {
			return { title: title || "Contact Form" };
		},
	},
});
