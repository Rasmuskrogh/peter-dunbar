"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import type { ImageGalleryBlock as ImageGalleryBlockType } from "@/lib/types";
import { urlFor } from "@/sanity/lib/image";
import Modal from "@/components/Modal";
import GalleryMosaic from "./GalleryMosaic";
import styles from "./ImageGalleryBlock.module.css";

export default function ImageGalleryBlock({ block }: { block: ImageGalleryBlockType }) {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const images = block.images ?? [];
	const active = openIndex !== null ? images[openIndex] : null;
	const hasMultiple = images.length > 1;

	function showPrev() {
		setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
	}
	function showNext() {
		setOpenIndex((i) => (i === null ? i : (i + 1) % images.length));
	}

	// Real aspect ratio when the query's dimensions are present (always,
	// for a Sanity image asset), falling back to a neutral 4:3 box only
	// if something's missing it.
	const activeAspectRatio = active?.dimensions
		? active.dimensions.width / active.dimensions.height
		: 4 / 3;

	return (
		<section className={`container section ${styles.section}`}>
			{block.heading ? <h2 className={styles.heading}>{block.heading}</h2> : null}

			{block.layout === "mosaic" ? (
				<GalleryMosaic images={images} onOpen={setOpenIndex} />
			) : (
				<div className={styles.grid}>
					{images.map((image, index) => (
						<button key={index} type="button" className={styles.item} onClick={() => setOpenIndex(index)}>
							<Image
								src={urlFor(image).width(500).height(375).url()}
								alt={image.alt}
								fill
								sizes="(max-width: 640px) 50vw, 300px"
								className={styles.thumb}
							/>
						</button>
					))}
				</div>
			)}

			<Modal
				open={active !== null}
				onClose={() => setOpenIndex(null)}
				ariaLabel={active?.alt}
				onPrev={hasMultiple ? showPrev : undefined}
				onNext={hasMultiple ? showNext : undefined}
			>
				{active ? (
					<div className={styles.lightboxWrap} style={{ "--ar": activeAspectRatio } as CSSProperties}>
						<Image
							src={urlFor(active).width(1400).url()}
							alt={active.alt}
							fill
							sizes="90vw"
							className={styles.lightboxImage}
						/>
					</div>
				) : null}
				{active?.caption || active?.credit ? (
					<div className={styles.caption}>
						{active.caption ? <p>{active.caption}</p> : null}
						{active.credit ? <p className={styles.credit}>Photo: {active.credit}</p> : null}
					</div>
				) : null}
			</Modal>
		</section>
	);
}
