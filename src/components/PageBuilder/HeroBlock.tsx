import Image from "next/image";
import type { HeroBlock as HeroBlockType } from "@/lib/types";
import { urlFor } from "@/sanity/lib/image";
import styles from "./HeroBlock.module.css";

export default function HeroBlock({ block }: { block: HeroBlockType }) {
	return (
		<section className={styles.hero}>
			<div className={styles.imageWrap}>
				<Image
					src={urlFor(block.backgroundImage).width(1800).url()}
					alt=""
					fill
					priority
					sizes="100vw"
					className={styles.image}
				/>
				{block.darkenOverlay !== false && <div className={styles.overlay} />}
				<div className={styles.text}>
					<h1 className={styles.heading}>{block.heading}</h1>
					{block.subheading ? <p className={styles.subheading}>{block.subheading}</p> : null}
				</div>
			</div>
		</section>
	);
}
