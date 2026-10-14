import type { Testimonial, TestimonialsBlock as TestimonialsBlockType } from "@/lib/types";
import { hrefFor } from "@/lib/link";
import QuoteCarousel from "./QuoteCarousel";
import styles from "./TestimonialsBlock.module.css";

function formatDate(iso: string) {
	return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

function QuoteCard({ item }: { item: Testimonial }) {
	return (
		<figure className={styles.card}>
			<blockquote className={styles.quote}>&ldquo;{item.quote}&rdquo;</blockquote>
			{item.name || item.source || item.date ? (
				<figcaption className={styles.attribution}>
					{item.name ? <span className={styles.name}>{item.name}</span> : null}
					{item.source || item.date ? (
						<span className={styles.source}>
							{item.source}
							{item.source && item.date ? " — " : ""}
							{item.date ? formatDate(item.date) : ""}
						</span>
					) : null}
				</figcaption>
			) : null}
		</figure>
	);
}

export default function TestimonialsBlock({ block }: { block: TestimonialsBlockType }) {
	const quotes = block.limit ? block.quotes.slice(0, block.limit) : block.quotes;

	if (block.layout === "carousel") {
		return (
			<section className="container section">
				{block.eyebrow ? <p className={styles.eyebrow}>{block.eyebrow}</p> : null}
				{block.heading ? <h2 className={styles.heading}>{block.heading}</h2> : null}
				<QuoteCarousel quotes={quotes} />
				{block.button?.url ? (
					<a href={hrefFor(block.button)} className={styles.button}>
						{block.button.text}
					</a>
				) : null}
			</section>
		);
	}

	// Any quote with a `group` set (e.g. a project or client) switches
	// this to grouped sections instead of one flat grid — most recent
	// first, each quote's own date shown alongside its source.
	const isGrouped = quotes.some((q) => q.group);

	return (
		<section className="container section">
			{block.eyebrow ? <p className={styles.eyebrow}>{block.eyebrow}</p> : null}
			{block.heading ? <h2 className={styles.heading}>{block.heading}</h2> : null}

			{isGrouped ? (
				(() => {
					const groups = new Map<string, Testimonial[]>();
					for (const q of quotes) {
						const key = q.group || "Other";
						if (!groups.has(key)) groups.set(key, []);
						groups.get(key)!.push(q);
					}
					return Array.from(groups.entries()).map(([group, groupQuotes]) => (
						<div key={group} className={styles.group}>
							<h3 className={styles.groupTitle}>{group}</h3>
							<div className={styles.grid}>
								{groupQuotes.map((item, i) => (
									<QuoteCard key={i} item={item} />
								))}
							</div>
						</div>
					));
				})()
			) : (
				<div className={styles.grid}>
					{quotes.map((item, i) => (
						<QuoteCard key={i} item={item} />
					))}
				</div>
			)}

			{block.button?.url ? (
				<a href={hrefFor(block.button)} className={styles.button}>
					{block.button.text}
				</a>
			) : null}
		</section>
	);
}
