import { Fragment } from "react";
import Image from "next/image";
import type { SplitHeroBlock as SplitHeroBlockType } from "@/lib/types";
import { hrefFor } from "@/lib/link";
import { urlFor } from "@/sanity/lib/image";
import styles from "./SplitHeroBlock.module.css";

/** "Painting the *living* landscape" → the starred words in italic gold. */
function Emphasis({ text }: { text: string }) {
	return text.split(/\*([^*]+)\*/g).map((part, i) => (i % 2 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>));
}

export default function SplitHeroBlock({ block }: { block: SplitHeroBlockType }) {
	const { primaryButton: primary, secondaryButton: secondary } = block;
	const external = (newTab: boolean | null) => (newTab ? { target: "_blank", rel: "noopener noreferrer" } : {});

	return (
		<section className={styles.hero}>
			<div className={styles.content}>
				{block.eyebrow ? <p className={styles.eyebrow}>{block.eyebrow}</p> : null}
				<h1 className={styles.heading}>
					<Emphasis text={block.heading} />
				</h1>
				{block.body ? <p className={styles.body}>{block.body}</p> : null}
				{primary?.text || secondary?.text ? (
					<div className={styles.actions}>
						{primary?.text ? (
							<a href={hrefFor(primary)} className={styles.primary} {...external(primary.openInNewTab)}>
								{primary.text}
							</a>
						) : null}
						{secondary?.text ? (
							<a href={hrefFor(secondary)} className={styles.secondary} {...external(secondary.openInNewTab)}>
								{secondary.text}
							</a>
						) : null}
					</div>
				) : null}
			</div>

			<div className={styles.media}>
				{block.image?.asset ? (
					<Image
						src={urlFor(block.image).width(1400).url()}
						alt={block.image.alt ?? ""}
						fill
						priority
						sizes="(max-width: 800px) 100vw, 50vw"
						className={styles.image}
					/>
				) : null}
			</div>
		</section>
	);
}
