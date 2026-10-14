import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";
import { dataset, projectId } from "../env";

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

/** `urlFor(image).width(800).url()` — the standard Sanity image URL builder. */
export function urlFor(source: Image) {
	return imageBuilder.image(source);
}
