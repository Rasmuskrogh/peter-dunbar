/**
 * Central place for the three values every Sanity project needs.
 * Pulled from env vars so a new client project only has to change
 * `.env.local` (see `.env.local.example`), never this file.
 */

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-01-01";

export const dataset = assertValue(
	process.env.NEXT_PUBLIC_SANITY_DATASET,
	"Missing environment variable: NEXT_PUBLIC_SANITY_DATASET",
);

export const projectId = assertValue(
	process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	"Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
);

function assertValue<T>(v: T | undefined, errorMessage: string): T {
	if (v === undefined) {
		throw new Error(errorMessage);
	}
	return v;
}
