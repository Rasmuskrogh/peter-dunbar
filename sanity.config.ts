"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";
import { structure, isSingletonType } from "./src/sanity/structure";

export default defineConfig({
	basePath: "/studio",
	projectId,
	dataset,
	schema,
	plugins: [
		structureTool({ structure }),
		// GROQ playground at /studio/vision — handy for testing queries
		// against real content before writing them into lib/queries.ts.
		visionTool({ defaultApiVersion: apiVersion }),
	],
	document: {
		// Belt-and-suspenders alongside structure.ts: even if someone finds
		// their way to a raw "create" action for a singleton type, it's not
		// offered here either.
		newDocumentOptions: (prev, { creationContext }) => {
			if (creationContext.type === "global") {
				return prev.filter((template) => !isSingletonType(template.templateId));
			}
			return prev;
		},
	},
});
