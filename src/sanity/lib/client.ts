import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
	projectId,
	dataset,
	apiVersion,
	// Reads the CDN (fast, cached) in production; always fresh in dev/draft
	// preview so editors see their changes immediately.
	useCdn: process.env.NODE_ENV === "production",
});
