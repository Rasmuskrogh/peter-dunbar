"use client";

import { useEffect, type ReactNode } from "react";
import styles from "./Modal.module.css";

export type ModalProps = {
	open: boolean;
	onClose: () => void;
	ariaLabel?: string;
	children: ReactNode;
	// Optional prev/next (e.g. browsing a gallery without closing the
	// modal each time). Omit both to get a plain single-item modal —
	// the arrow buttons only render when a handler is passed.
	onPrev?: () => void;
	onNext?: () => void;
};

/**
 * Shared modal shell — overlay, close button, Escape-to-close, body
 * scroll lock, optional prev/next arrows + Left/Right-arrow-key
 * navigation. Used by PersonGridBlock (bio) and ImageGalleryBlock
 * (lightbox, both layouts); reach for this instead of building a new
 * modal per block.
 */
export default function Modal({ open, onClose, ariaLabel, children, onPrev, onNext }: ModalProps) {
	useEffect(() => {
		if (!open) return;

		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") onClose();
			if (event.key === "ArrowLeft") onPrev?.();
			if (event.key === "ArrowRight") onNext?.();
		}

		window.addEventListener("keydown", onKeyDown);
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			window.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = previousOverflow;
		};
	}, [open, onClose, onPrev, onNext]);

	if (!open) return null;

	return (
		<div className={styles.overlay} role="dialog" aria-modal="true" aria-label={ariaLabel}>
			<button type="button" className={styles.backdrop} onClick={onClose} aria-label="Close" />

			{onPrev ? (
				<button
					type="button"
					className={`${styles.arrow} ${styles.arrowLeft}`}
					onClick={onPrev}
					aria-label="Previous"
				>
					‹
				</button>
			) : null}

			<div className={styles.modal}>
				<button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
					×
				</button>
				{children}
			</div>

			{onNext ? (
				<button
					type="button"
					className={`${styles.arrow} ${styles.arrowRight}`}
					onClick={onNext}
					aria-label="Next"
				>
					›
				</button>
			) : null}
		</div>
	);
}
