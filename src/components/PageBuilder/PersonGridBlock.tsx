"use client";

import { useState } from "react";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { PersonGridBlock as PersonGridBlockType } from "@/lib/types";
import { hrefFor } from "@/lib/link";
import { urlFor } from "@/sanity/lib/image";
import Modal from "@/components/Modal";
import styles from "./PersonGridBlock.module.css";

export default function PersonGridBlock({ block }: { block: PersonGridBlockType }) {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const people = block.people ?? [];
	const active = openIndex !== null ? people[openIndex] : null;

	return (
		<section className={`container section ${styles.section}`}>
			{block.heading ? <h2 className={styles.heading}>{block.heading}</h2> : null}

			<div className={styles.grid}>
				{people.map((person, index) => (
					<button
						key={index}
						type="button"
						className={styles.card}
						onClick={() => setOpenIndex(index)}
						disabled={!person.bio}
					>
						<div className={styles.photoWrap}>
							<Image
								src={urlFor(person.photo).width(400).height(400).url()}
								alt={person.name}
								fill
								sizes="(max-width: 700px) 50vw, 25vw"
								className={styles.photo}
							/>
						</div>
						<p className={styles.name}>{person.name}</p>
						{person.role ? <p className={styles.role}>{person.role}</p> : null}
					</button>
				))}
			</div>

			{people.some((p) => p.bio) ? <p className={styles.hint}>Click on a photo for their biography</p> : null}

			{block.button?.text ? (
				<div className={styles.buttons}>
					<a href={hrefFor(block.button)} className={styles.button}>
						{block.button.text}
					</a>
				</div>
			) : null}

			<Modal open={active !== null} onClose={() => setOpenIndex(null)} ariaLabel={active?.name}>
				{active ? (
					<div className={styles.bio}>
						<div className={styles.bioPhotoWrap}>
							<Image
								src={urlFor(active.photo).width(300).height(300).url()}
								alt={active.name}
								fill
								sizes="150px"
								className={styles.photo}
							/>
						</div>
						<h3 className={styles.bioName}>{active.name}</h3>
						{active.role ? <p className={styles.role}>{active.role}</p> : null}
						{active.bio ? (
							<div className={styles.bioText}>
								<PortableText value={active.bio} />
							</div>
						) : null}
					</div>
				) : null}
			</Modal>
		</section>
	);
}
