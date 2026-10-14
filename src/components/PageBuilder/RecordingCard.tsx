"use client";

import { useState } from "react";
import type { RecordingItem } from "@/lib/types";
import { urlFor } from "@/sanity/lib/image";
import { embedSrcFor, youtubeThumbnailFor } from "@/lib/embed";
import Modal from "@/components/Modal";
import styles from "./RecordingCard.module.css";

export default function RecordingCard({ recording }: { recording: RecordingItem }) {
	const [open, setOpen] = useState(false);
	const embedSrc = embedSrcFor(recording.mediaUrl);
	const thumbUrl = recording.thumbnail
		? urlFor(recording.thumbnail).width(500).height(310).url()
		: youtubeThumbnailFor(recording.mediaUrl);

	// No recognized embed provider: just link straight out instead of
	// opening a modal with nothing playable in it.
	if (!embedSrc) {
		return (
			<a href={recording.mediaUrl} target="_blank" rel="noreferrer" className={styles.card}>
				{thumbUrl ? (
					// eslint-disable-next-line @next/next/no-img-element -- external (non-Sanity) thumbnail, next/image's loader doesn't apply
					<img src={thumbUrl} alt="" loading="lazy" className={styles.thumb} />
				) : (
					<div className={styles.thumb} />
				)}
				<p className={styles.recTitle}>{recording.title}</p>
				{recording.composer ? <p className={styles.recComposer}>{recording.composer}</p> : null}
			</a>
		);
	}

	return (
		<>
			<button type="button" className={styles.card} onClick={() => setOpen(true)} aria-haspopup="dialog">
				{thumbUrl ? (
					// eslint-disable-next-line @next/next/no-img-element -- external (non-Sanity) thumbnail, next/image's loader doesn't apply
					<img src={thumbUrl} alt="" loading="lazy" className={styles.thumb} />
				) : (
					<div className={styles.thumb} />
				)}
				<span className={styles.playButton} aria-hidden>
					▶
				</span>
				<p className={styles.recTitle}>{recording.title}</p>
				{recording.composer ? <p className={styles.recComposer}>{recording.composer}</p> : null}
			</button>

			<Modal open={open} onClose={() => setOpen(false)} ariaLabel={recording.title}>
				<div className={styles.content}>
					<div className={styles.embedWrapper}>
						<iframe
							src={embedSrc}
							title={recording.title}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
						/>
					</div>
					<p className={styles.modalCaption}>
						{recording.title}
						{recording.composer ? ` — ${recording.composer}` : ""}
					</p>
				</div>
			</Modal>
		</>
	);
}
