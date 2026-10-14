import type { CSSProperties } from "react";
import type { InfoGridBlock as InfoGridBlockType } from "@/lib/types";
import styles from "./InfoGridBlock.module.css";

export default function InfoGridBlock({ block }: { block: InfoGridBlockType }) {
	return (
		<section className="container section">
			{block.eyebrow ? <p className={styles.eyebrow}>{block.eyebrow}</p> : null}
			{block.heading ? <h2 className={styles.heading}>{block.heading}</h2> : null}

			<ul
				className={styles.grid}
				style={block.columns ? ({ "--cols": block.columns } as CSSProperties) : undefined}
			>
				{block.items.map((item, i) => (
					<li key={i} className={styles.item}>
						<p className={styles.title}>{item.title}</p>
						{item.meta ? <p className={styles.meta}>{item.meta}</p> : null}
						{item.detail ? <p className={styles.detail}>{item.detail}</p> : null}
					</li>
				))}
			</ul>
		</section>
	);
}
