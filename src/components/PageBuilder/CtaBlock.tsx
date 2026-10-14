import type { CtaBlock as CtaBlockType } from "@/lib/types";
import { hrefFor } from "@/lib/link";
import styles from "./CtaBlock.module.css";

export default function CtaBlock({ block }: { block: CtaBlockType }) {
	return (
		<section className={`container section ${styles.section}`}>
			{block.eyebrow ? <p className={styles.eyebrow}>{block.eyebrow}</p> : null}
			<h2 className={styles.heading}>{block.heading}</h2>
			{block.body ? <p className={styles.body}>{block.body}</p> : null}
			<a href={hrefFor(block.button)} className={styles.button}>
				{block.button.text}
			</a>
		</section>
	);
}
