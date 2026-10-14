import type { StructureResolver } from "sanity/structure";
import { HomeIcon } from "@sanity/icons/Home";
import { CogIcon } from "@sanity/icons/Cog";
import { DocumentIcon } from "@sanity/icons/Document";
import { CalendarIcon } from "@sanity/icons/Calendar";
import { PlayIcon } from "@sanity/icons/Play";

/**
 * Sanity has no built-in "singleton" concept — any document type can
 * always get a second document created via "create new", which is
 * exactly how past projects ended up with confusing duplicate Settings
 * documents. This structure enforces singletons the standard way: list
 * item that opens the ONE document directly, with no "create new"
 * affordance, and the schema-level filter below removes those types
 * from the generic "create" menu entirely.
 *
 * To add another singleton (e.g. a "themeSettings" type later): add it
 * to SINGLETON_TYPES and give it a list item here, same pattern.
 */
const SINGLETON_TYPES = new Set(["homePage", "siteSettings"]);

export const structure: StructureResolver = (S) =>
	S.list()
		.title("Content")
		.items([
			S.listItem()
				.title("Home Page")
				.icon(HomeIcon)
				.child(S.document().schemaType("homePage").documentId("homePage")),
			S.listItem()
				.title("Site Settings")
				.icon(CogIcon)
				.child(S.document().schemaType("siteSettings").documentId("siteSettings")),
			S.divider(),
			S.listItem()
				.title("Pages")
				.icon(DocumentIcon)
				.child(S.documentTypeList("page").title("Pages")),
			S.divider(),
			S.listItem()
				.title("Events")
				.icon(CalendarIcon)
				.child(
					S.documentTypeList("event")
						.title("Events")
						.defaultOrdering([{ field: "date", direction: "asc" }]),
				),
			S.listItem()
				.title("Recordings")
				.icon(PlayIcon)
				.child(S.documentTypeList("recording").title("Recordings")),
		]);

/** Hides singleton types from the "+ Create" menu — they already exist by definition. */
export function isSingletonType(typeName: string): boolean {
	return SINGLETON_TYPES.has(typeName);
}
