"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import justifiedLayout from "justified-layout";
import type { GalleryImage } from "@/lib/types";
import { urlFor } from "@/sanity/lib/image";
import styles from "./GalleryMosaic.module.css";

const BOX_SPACING = 6;

// Scales down with the container so narrow (mobile) viewports still fit a
// couple of images per row instead of one large image per row.
function targetRowHeightFor(containerWidth: number) {
	return Math.min(320, Math.max(120, containerWidth / 5));
}

// justified-layout's own `widowLayoutStyle: "justify"` fills the last,
// incomplete row by stretching each item's *width* only, at the same target
// row height as every other row — which distorts the image's aspect ratio
// and forces a crop. Instead, give the last row a taller (or shorter) height
// so its images, scaled uniformly like any other row, naturally add up to
// the full container width with no distortion.
function stretchLastRowHeight(
	layout: ReturnType<typeof justifiedLayout>,
	containerWidth: number,
	spacing: number,
) {
	const { boxes } = layout;
	if (boxes.length === 0) return layout;

	const lastRowTop = boxes[boxes.length - 1].top;
	const lastRow = boxes.filter((box) => box.top === lastRowTop);
	const originalHeight = lastRow[0].height;

	const aspectRatioSum = lastRow.reduce((sum, box) => sum + box.aspectRatio, 0);
	const newHeight = (containerWidth - spacing * (lastRow.length - 1)) / aspectRatioSum;

	let left = 0;
	for (const box of lastRow) {
		box.width = box.aspectRatio * newHeight;
		box.height = newHeight;
		box.left = left;
		left += box.width + spacing;
	}

	layout.containerHeight += newHeight - originalHeight;

	return layout;
}

/**
 * Justified/masonry layout: images keep their own aspect ratio and are
 * scaled to a shared row height, filling the container edge-to-edge
 * with no ragged bottom — unlike an even CSS grid, which crops every
 * thumbnail to the same box. Pure layout component: it doesn't own the
 * lightbox, just tells the caller which index was clicked.
 */
export default function GalleryMosaic({
	images,
	onOpen,
}: {
	images: GalleryImage[];
	onOpen: (index: number) => void;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [containerWidth, setContainerWidth] = useState(0);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const observer = new ResizeObserver((entries) => {
			setContainerWidth(entries[0].contentRect.width);
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	// Falls back to a generic 4:3 box for any image missing real
	// dimensions (shouldn't normally happen — every Sanity image asset
	// has metadata.dimensions — but keeps the layout from breaking).
	const boxSizes = useMemo(
		() => images.map((image) => image.dimensions ?? { width: 4, height: 3 }),
		[images],
	);

	const layout = useMemo(() => {
		if (!containerWidth) return null;

		const result = justifiedLayout(boxSizes, {
			containerWidth,
			targetRowHeight: targetRowHeightFor(containerWidth),
			boxSpacing: BOX_SPACING,
			containerPadding: 0,
		});

		return stretchLastRowHeight(result, containerWidth, BOX_SPACING);
	}, [boxSizes, containerWidth]);

	if (images.length === 0) return null;

	return (
		<div ref={containerRef} className={styles.grid} style={{ height: layout?.containerHeight }}>
			{layout &&
				images.map((image, index) => {
					const box = layout.boxes[index];
					if (!box) return null;

					return (
						<button
							key={index}
							type="button"
							className={styles.item}
							style={{ top: box.top, left: box.left, width: box.width, height: box.height }}
							onClick={() => onOpen(index)}
							aria-label={image.caption ?? "Open image"}
						>
							<Image
								src={urlFor(image).width(Math.ceil(box.width * 2)).url()}
								alt={image.alt}
								fill
								sizes={`${Math.ceil(box.width)}px`}
								className={styles.photo}
							/>
						</button>
					);
				})}
		</div>
	);
}
