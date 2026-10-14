import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export type ContactPayload = {
	name: string;
	email: string;
	message: string;
	// Honeypot: a field real visitors never see or fill in. Bots that fill
	// out every field in a scraped form will fill this too.
	company?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Reuse one transporter/test-account across requests in dev instead of
// creating a new Ethereal inbox on every submit.
let cachedTransporter: Transporter | null = null;
let cachedFrom: string | null = null;

async function getTransporter(): Promise<{ transporter: Transporter; from: string }> {
	if (cachedTransporter && cachedFrom) {
		return { transporter: cachedTransporter, from: cachedFrom };
	}

	const { EMAIL_USER, EMAIL_PASS } = process.env;

	if (EMAIL_USER && EMAIL_PASS) {
		// Gmail via nodemailer's built-in provider shorthand — no host/port
		// needed, it already knows Gmail's SMTP settings. EMAIL_PASS must be
		// a Google Account "app password", not the regular account password.
		// Swap this block for a different provider (Resend, SES, SMTP host)
		// if a project needs one — everything else in this route is provider-agnostic.
		cachedTransporter = nodemailer.createTransport({
			service: "gmail",
			auth: { user: EMAIL_USER, pass: EMAIL_PASS },
		});
		cachedFrom = EMAIL_USER;
		return { transporter: cachedTransporter, from: cachedFrom };
	}

	// No real credentials configured yet (e.g. local dev before .env is
	// filled in) — fall back to a disposable Ethereal test inbox so the
	// whole send flow can still be verified end-to-end without real
	// credentials. Never used unless EMAIL_USER/EMAIL_PASS are both missing.
	const testAccount = await nodemailer.createTestAccount();
	const transporter = nodemailer.createTransport({
		host: "smtp.ethereal.email",
		port: 587,
		secure: false,
		auth: { user: testAccount.user, pass: testAccount.pass },
	});
	const from = testAccount.user;
	cachedTransporter = transporter;
	cachedFrom = from;
	console.warn(
		"[contact] EMAIL_USER/EMAIL_PASS not set — using a throwaway Ethereal test inbox. " +
			"Emails sent this way are NOT delivered anywhere real; check the server log for a preview link.",
	);
	return { transporter, from };
}

export async function POST(request: NextRequest) {
	let body: ContactPayload;

	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
	}

	const name = body.name?.trim() ?? "";
	const email = body.email?.trim() ?? "";
	const message = body.message?.trim() ?? "";

	// Honeypot tripped: pretend success so the bot doesn't learn anything,
	// just silently drop the submission.
	if (body.company) {
		return NextResponse.json({ ok: true });
	}

	if (!name || !email || !message) {
		return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
	}

	if (!EMAIL_RE.test(email)) {
		return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
	}

	try {
		const { transporter, from } = await getTransporter();
		// Defaults to the sending account itself if CONTACT_EMAIL isn't set —
		// matches the common case of sending a notification to your own inbox.
		const to = process.env.CONTACT_EMAIL || from;

		const info = await transporter.sendMail({
			from,
			to,
			replyTo: email,
			subject: `New contact form message from ${name}`,
			text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
		});

		const previewUrl = nodemailer.getTestMessageUrl(info);
		if (previewUrl) {
			console.log(`[contact] Test email sent (Ethereal, not real delivery). Preview: ${previewUrl}`);
		}

		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error("[contact] Failed to send email:", error);
		return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });
	}
}
