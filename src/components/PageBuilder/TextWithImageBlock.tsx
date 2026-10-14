import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { TextWithImageBlock as TextWithImageBlockType, SiteSettings } from "@/lib/types";
import { hrefFor } from "@/lib/link";
import { urlFor } from "@/sanity/lib/image";
import { client } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/lib/queries";
import styles from "./TextWithImageBlock.module.css";

export default async function TextWithImageBlock({ block }: { block: TextWithImageBlockType }) {
	const isCircle = block.imageStyle === "circle";
	const imageFirst = block.imagePosition === "left";
	// The one common case that also needs a list of contact details
	// alongside the body text is a contact page's intro block — pulled
	// from Site Settings here, not authored per-block, so it stays in
	// sync with the header/footer's own contact info automatically.
	// Fetched only when actually needed, same pattern as Header/Footer
	// each doing their own settings fetch.
	const settings = block.showContactDetails
		? await client.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY).catch(() => null)
		: null;

	const text = (
		<div className={styles.text}>
			{block.eyebrow ? <p className={styles.eyebrow}>{block.eyebrow}</p> : null}
			<h2 className={styles.heading}>{block.heading}</h2>
			{block.body ? (
				<div className={styles.body}>
					<PortableText value={block.body} />
				</div>
			) : null}
			{block.button?.text ? (
				<a href={hrefFor(block.button)} className={styles.button}>
					{block.button.text}
				</a>
			) : null}
			{block.facts?.length ? (
				<dl className={styles.facts}>
					{block.facts.map((fact, i) => (
						<div key={i}>
							<dt>{fact.label}</dt>
							<dd>{fact.value}</dd>
						</div>
					))}
				</dl>
			) : null}
			{settings ? (
				<ul className={styles.details}>
					{settings.email ? (
						<li>
							<a href={`mailto:${settings.email}`}>{settings.email}</a>
						</li>
					) : null}
					{settings.phone ? (
						<li>
							<a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a>
						</li>
					) : null}
					{settings.managementName || settings.address ? (
						<li>
							{settings.managementName}
							{settings.managementName && settings.address ? <br /> : null}
							{settings.address}
						</li>
					) : null}
					{settings.website ? (
						<li>
							<a href={settings.website} target="_blank" rel="noreferrer">
								Website
							</a>
						</li>
					) : null}
					{settings.socialLinks?.map((social, i) => (
						<li key={i}>
							<a href={social.url} target="_blank" rel="noreferrer">
								{social.platform}
							</a>
						</li>
					))}
				</ul>
			) : null}
		</div>
	);

	const image = (
		<div className={isCircle ? styles.imageCircleWrap : styles.imageRectWrap}>
			<Image
				src={urlFor(block.image).width(900).url()}
				alt={block.image.alt ?? ""}
				fill
				sizes="(max-width: 700px) 100vw, 50vw"
				className={styles.image}
			/>
		</div>
	);

	return (
		<section className={`container section ${styles.section}`}>
			{imageFirst ? (
				<>
					{image}
					{text}
				</>
			) : (
				<>
					{text}
					{image}
				</>
			)}
		</section>
	);
}
