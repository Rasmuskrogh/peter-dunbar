"use client";

import { FormEvent, useState } from "react";
import styles from "./ContactFormClient.module.css";

export type ContactFormLabels = {
	heading: string;
	nameLabel: string;
	namePlaceholder: string | null;
	emailLabel: string;
	emailPlaceholder: string | null;
	messageLabel: string;
	messagePlaceholder: string | null;
	submitLabel: string;
	successMessage: string;
	errorMessage: string;
};

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactFormClient({ labels }: { labels: ContactFormLabels }) {
	const [status, setStatus] = useState<Status>("idle");

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setStatus("submitting");

		const form = event.currentTarget;
		const data = new FormData(form);

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: data.get("name"),
					email: data.get("email"),
					message: data.get("message"),
					company: data.get("company"), // honeypot
				}),
			});

			if (!res.ok) throw new Error("request_failed");

			const json = await res.json();
			if (!json.ok) throw new Error(json.error ?? "request_failed");

			setStatus("success");
			form.reset();
		} catch {
			setStatus("error");
		}
	}

	if (status === "success") {
		return <p className={styles.success}>{labels.successMessage}</p>;
	}

	return (
		<form className={styles.form} onSubmit={handleSubmit} noValidate>
			<h2 className={styles.heading}>{labels.heading}</h2>

			<div className={styles.field}>
				<label htmlFor="contact-name">{labels.nameLabel}</label>
				<input
					id="contact-name"
					name="name"
					type="text"
					required
					autoComplete="name"
					placeholder={labels.namePlaceholder ?? undefined}
				/>
			</div>

			<div className={styles.field}>
				<label htmlFor="contact-email">{labels.emailLabel}</label>
				<input
					id="contact-email"
					name="email"
					type="email"
					required
					autoComplete="email"
					placeholder={labels.emailPlaceholder ?? undefined}
				/>
			</div>

			<div className={styles.field}>
				<label htmlFor="contact-message">{labels.messageLabel}</label>
				<textarea
					id="contact-message"
					name="message"
					required
					rows={5}
					placeholder={labels.messagePlaceholder ?? undefined}
				/>
			</div>

			{/* Honeypot: hidden from real visitors (CSS + off-screen, not
			    display:none so unsophisticated bots that skip hidden fields
			    still fill it), and out of the tab order / screen reader flow.
			    Not Studio-editable on purpose — it's a technical anti-spam
			    field, not content. */}
			<div className={styles.honeypot} aria-hidden="true">
				<label htmlFor="contact-company">Company</label>
				<input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
			</div>

			<button type="submit" className={styles.submit} disabled={status === "submitting"}>
				{status === "submitting" ? `${labels.submitLabel}…` : labels.submitLabel}
			</button>

			{status === "error" ? <p className={styles.error}>{labels.errorMessage}</p> : null}
		</form>
	);
}
