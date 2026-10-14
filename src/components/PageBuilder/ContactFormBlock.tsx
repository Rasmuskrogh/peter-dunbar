import type { ContactFormBlock as ContactFormBlockType } from "@/lib/types";
import ContactFormClient from "./ContactFormClient";

/**
 * Thin server wrapper: pulls the editable Studio labels off the block
 * and hands them to the client component that actually owns the form
 * state / submit handling. Kept separate so the "use client" boundary
 * stays as small as possible.
 */
export default function ContactFormBlock({ block }: { block: ContactFormBlockType }) {
	return (
		<section className="container section">
			<ContactFormClient
				labels={{
					heading: block.heading ?? "Send us a message",
					nameLabel: block.nameLabel ?? "Name",
					namePlaceholder: block.namePlaceholder,
					emailLabel: block.emailLabel ?? "Email",
					emailPlaceholder: block.emailPlaceholder,
					messageLabel: block.messageLabel ?? "Message",
					messagePlaceholder: block.messagePlaceholder,
					submitLabel: block.submitLabel ?? "Send",
					successMessage: block.successMessage ?? "Thanks! Your message has been sent.",
					errorMessage:
						block.errorMessage ?? "Something went wrong. Please try again, or email us directly.",
				}}
			/>
		</section>
	);
}
