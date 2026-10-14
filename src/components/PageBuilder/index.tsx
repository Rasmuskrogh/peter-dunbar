import type { PageBuilderBlock } from "@/lib/types";
import HeroBlock from "./HeroBlock";
import TextBlock from "./TextBlock";
import TextWithImageBlock from "./TextWithImageBlock";
import PersonGridBlock from "./PersonGridBlock";
import ImageGalleryBlock from "./ImageGalleryBlock";
import CtaBlock from "./CtaBlock";
import TestimonialsBlock from "./TestimonialsBlock";
import InfoGridBlock from "./InfoGridBlock";
import ContactFormBlock from "./ContactFormBlock";
import EventsBlock from "./EventsBlock";
import RecordingsBlock from "./RecordingsBlock";

/**
 * The Prismic SliceZone equivalent: switches on each pageBuilder
 * entry's `_type` and renders the matching component. Add a new block:
 * 1. schema in sanity/schemaTypes/objects/blocks/, added to blocks/index.ts
 * 2. fields added to the relevant query in lib/queries.ts + lib/types.ts
 * 3. a case added here
 */
export default function PageBuilder({ blocks }: { blocks: PageBuilderBlock[] | null }) {
	if (!blocks) return null;

	return (
		<>
			{blocks.map((block) => {
				switch (block._type) {
					case "heroBlock":
						return <HeroBlock key={block._key} block={block} />;
					case "textBlock":
						return <TextBlock key={block._key} block={block} />;
					case "textWithImageBlock":
						return <TextWithImageBlock key={block._key} block={block} />;
					case "personGridBlock":
						return <PersonGridBlock key={block._key} block={block} />;
					case "imageGalleryBlock":
						return <ImageGalleryBlock key={block._key} block={block} />;
					case "ctaBlock":
						return <CtaBlock key={block._key} block={block} />;
					case "testimonialsBlock":
						return <TestimonialsBlock key={block._key} block={block} />;
					case "infoGridBlock":
						return <InfoGridBlock key={block._key} block={block} />;
					case "contactFormBlock":
						return <ContactFormBlock key={block._key} block={block} />;
					case "eventsBlock":
						return <EventsBlock key={block._key} block={block} />;
					case "recordingsBlock":
						return <RecordingsBlock key={block._key} block={block} />;
					default:
						return null;
				}
			})}
		</>
	);
}
