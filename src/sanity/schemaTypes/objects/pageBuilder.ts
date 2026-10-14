import { defineArrayMember, defineField } from "sanity";

/**
 * The Prismic "Slice Zone" equivalent: an array field where editors add,
 * remove, and reorder blocks freely. Add it to any page-like document
 * type with:
 *
 *   defineField(pageBuilderField)
 *
 * To add a new block type site-wide: create it under
 * schemaTypes/objects/blocks/, add it to blockTypes.ts, and it shows up
 * here automatically — every document using pageBuilder gets it, no
 * per-document-type wiring needed.
 */
import { blockTypes } from "./blocks";

export const pageBuilderField = defineField({
	name: "pageBuilder",
	title: "Page content",
	type: "array",
	of: blockTypes.map((type) => defineArrayMember({ type })),
});
