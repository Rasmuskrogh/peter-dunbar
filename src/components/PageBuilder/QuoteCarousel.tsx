"use client";

import { useEffect, useRef, useState } from "react";
import type { Testimonial } from "@/lib/types";
import styles from "./QuoteCarousel.module.css";

const DISPLAY_MS = 9000;

/**
 * One quote at a time, auto-advancing, pausing on hover, with a
 * crossfade/slide transition. Separate from TestimonialsBlock's plain
 * grid (see its `layout` field) since this needs client-side
 * state/timers the grid doesn't.
 */
export default function QuoteCarousel({ quotes }: { quotes: Testimonial[] }) {
	const [index, setIndex] = useState(0);
	const paused = useRef(false);

	useEffect(() => {
		if (quotes.length <= 1) return;
		if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return;
		}

		const id = setInterval(() => {
			if (!paused.current) {
				setIndex((i) => (i + 1) % quotes.length);
			}
		}, DISPLAY_MS);

		return () => clearInterval(id);
	}, [quotes.length]);

	if (quotes.length === 0) return null;

	return (
		<div
			className={styles.track}
			onMouseEnter={() => (paused.current = true)}
			onMouseLeave={() => (paused.current = false)}
		>
			{quotes.map((item, i) => {
				const offset = (i - index + quotes.length) % quotes.length;
				const position = offset === 0 ? styles.current : offset === quotes.length - 1 ? styles.prev : styles.next;

				return (
					<figure key={i} className={`${styles.item} ${position}`}>
						<blockquote className={styles.text}>&ldquo;{item.quote}&rdquo;</blockquote>
						{item.name || item.source ? (
							<figcaption className={styles.source}>
								{item.name}
								{item.name && item.source ? ", " : ""}
								{item.source}
							</figcaption>
						) : null}
					</figure>
				);
			})}
		</div>
	);
}
