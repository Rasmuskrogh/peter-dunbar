import heroBlock from "./heroBlock";
import splitHeroBlock from "./splitHeroBlock";
import textBlock from "./textBlock";
import textWithImageBlock from "./textWithImageBlock";
import personGridBlock from "./personGridBlock";
import imageGalleryBlock from "./imageGalleryBlock";
import ctaBlock from "./ctaBlock";
import testimonialsBlock from "./testimonialsBlock";
import infoGridBlock from "./infoGridBlock";
import contactFormBlock from "./contactFormBlock";
import eventsBlock from "./eventsBlock";
import recordingsBlock from "./recordingsBlock";

/** Every block available in the pageBuilder. Add new ones here. */
export const blocks = [
	heroBlock,
	splitHeroBlock,
	textBlock,
	textWithImageBlock,
	personGridBlock,
	imageGalleryBlock,
	ctaBlock,
	testimonialsBlock,
	infoGridBlock,
	contactFormBlock,
	eventsBlock,
	recordingsBlock,
];

/** Just the type names, for the pageBuilder array's `of` list. */
export const blockTypes = blocks.map((block) => block.name);
