import type { RecordingsBlock as RecordingsBlockType, RecordingItem } from "@/lib/types";
import { hrefFor } from "@/lib/link";
import RecordingCard from "./RecordingCard";
import styles from "./RecordingsBlock.module.css";

/**
 * Two modes, both driven by the same block:
 * - `featured` set (a homepage teaser): shows just those hand-picked
 *   recordings, flat, in the editor's own order.
 * - `featured` empty (the default): shows every Recording document,
 *   grouped by whichever `category` strings the documents actually
 *   use — no fixed list, so this works the same for an opera singer's
 *   "Opera & arias" / "Chamber music" as any other project's own
 *   taxonomy.
 */
export default function RecordingsBlock({ block }: { block: RecordingsBlockType }) {
	// A reference to a deleted Recording document resolves to null —
	// filter those out defensively rather than crash on a stale ref.
	const featured = block.featured.filter(Boolean);

	const button = block.button?.url ? (
		<a href={hrefFor(block.button)} className={styles.button}>
			{block.button.text}
		</a>
	) : null;

	if (featured.length > 0) {
		return (
			<section className="container section">
				{block.eyebrow ? <p className={styles.eyebrow}>{block.eyebrow}</p> : null}
				{block.heading ? <h2 className={styles.heading}>{block.heading}</h2> : null}

				<div className={styles.grid}>
					{featured.map((recording) => (
						<RecordingCard key={recording._id} recording={recording} />
					))}
				</div>

				{button}
			</section>
		);
	}

	const groups = new Map<string, RecordingItem[]>();
	for (const recording of block.recordings) {
		const key = recording.category?.trim() || "Uncategorized";
		if (!groups.has(key)) groups.set(key, []);
		groups.get(key)!.push(recording);
	}

	return (
		<section className="container section">
			{block.eyebrow ? <p className={styles.eyebrow}>{block.eyebrow}</p> : null}
			{block.heading ? <h2 className={styles.heading}>{block.heading}</h2> : null}

			{Array.from(groups.entries()).map(([category, recordings]) => (
				<div key={category} className={styles.group}>
					<h3 className={styles.groupTitle}>{category}</h3>
					<div className={styles.grid}>
						{recordings.map((recording) => (
							<RecordingCard key={recording._id} recording={recording} />
						))}
					</div>
				</div>
			))}

			{button}
		</section>
	);
}
