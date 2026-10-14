import { PortableText } from "@portabletext/react";
import type { TextBlock as TextBlockType } from "@/lib/types";
import { hrefFor } from "@/lib/link";
import styles from "./TextBlock.module.css";

export default function TextBlock({ block }: { block: TextBlockType }) {
	// A pull quote switches this from the default centered/narrow "CTA"
	// look to a full-width, left-aligned two-column layout (body beside
	// the quote) — for a testimonial-style highlight embedded in a
	// longer piece of body text (e.g. an "About" page's story).
	if (block.pullQuote) {
		return (
			<section className={`container section ${styles.withQuote}`}>
				<div>
					{block.eyebrow ? <p className={styles.eyebrow}>{block.eyebrow}</p> : null}
					{block.heading ? <h2 className={styles.heading}>{block.heading}</h2> : null}
					{block.body ? (
						<div className={styles.body}>
							<PortableText value={block.body} />
						</div>
					) : null}
					{block.button?.text ? (
						<a href={hrefFor(block.button)} className="arrowLink">
							{block.button.text}
						</a>
					) : null}
				</div>
				<blockquote className={styles.pullQuote}>
					<p>&ldquo;{block.pullQuote.quote}&rdquo;</p>
					{block.pullQuote.source ? <cite>{block.pullQuote.source}</cite> : null}
				</blockquote>
			</section>
		);
	}

	return (
		<section className={`container section ${styles.section}`}>
			{block.eyebrow ? <p className={styles.eyebrow}>{block.eyebrow}</p> : null}
			{block.heading ? <h2 className={styles.heading}>{block.heading}</h2> : null}
			{block.body ? (
				<div className={styles.body}>
					<PortableText value={block.body} />
				</div>
			) : null}
			{block.button?.text ? (
				<a href={hrefFor(block.button)} className={styles.button}>
					{block.button.text}
				</a>
			) : null}
		</section>
	);
}
