import type { SchemaTypeDefinition } from "sanity";

import seo from "./objects/seo";
import link from "./objects/link";
import { blocks } from "./objects/blocks";

import homePage from "./documents/homePage";
import page from "./documents/page";
import siteSettings from "./documents/siteSettings";
import event from "./documents/event";
import recording from "./documents/recording";

export const schema: { types: SchemaTypeDefinition[] } = {
	types: [
		// Documents — the things editors create/list in the Studio.
		homePage,
		page,
		siteSettings,
		event,
		recording,
		// Shared objects — reusable field shapes, not documents themselves.
		seo,
		link,
		...blocks,
	],
};
