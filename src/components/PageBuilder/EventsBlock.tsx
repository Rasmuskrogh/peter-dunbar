import { PortableText } from "@portabletext/react";
import type { EventsBlock as EventsBlockType } from "@/lib/types";
import { hrefFor } from "@/lib/link";
import styles from "./EventsBlock.module.css";

function formatDateParts(iso: string) {
	const d = new Date(iso);
	return {
		day: d.getDate(),
		month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
	};
}

// Sanity's datetime field always carries a time component, so a plain
// "no time set" check isn't possible — this just formats whatever time
// is there. Hide the field in the Studio's `date` config if a project
// only ever needs day-level events.
function formatTime(iso: string) {
	return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

/**
 * Renders every Event document (fetched by the query, not stored on
 * this block — see queries.ts), split into an upcoming list and a
 * past list collapsed by year. Server component: reading the current
 * time once per request here is intentional, not a client
 * render-purity issue.
 *
 * With `limit` set (a homepage teaser, e.g. "next 2 events"), only
 * that many upcoming events show and the past-events section is
 * skipped entirely — a teaser has no reason to show history.
 */
export default function EventsBlock({ block }: { block: EventsBlockType }) {
	// eslint-disable-next-line react-hooks/purity -- server-rendered per request, see comment above
	const now = Date.now();
	const isTeaser = Boolean(block.limit);

	let upcoming = block.events
		.filter((event) => new Date(event.date).getTime() >= now)
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	if (block.limit) upcoming = upcoming.slice(0, block.limit);

	const past = isTeaser
		? []
		: block.events
				.filter((event) => new Date(event.date).getTime() < now)
				.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	const pastByYear = new Map<number, typeof past>();
	for (const event of past) {
		const year = new Date(event.date).getFullYear();
		if (!pastByYear.has(year)) pastByYear.set(year, []);
		pastByYear.get(year)!.push(event);
	}

	return (
		<section className="container section">
			{block.eyebrow ? <p className={styles.eyebrow}>{block.eyebrow}</p> : null}
			{block.heading ? <h2 className={styles.heading}>{block.heading}</h2> : null}

			{upcoming.length > 0 ? (
				<div className={styles.upcomingList}>
					{upcoming.map((event) => {
						const { day, month } = formatDateParts(event.date);

						return (
							<div key={event._id} className={styles.upcomingItem}>
								<div className={styles.date}>
									<span className={styles.day}>{day}</span>
									<span className={styles.month}>{month}</span>
								</div>
								<div className={styles.details}>
									<h3 className={styles.title}>{event.title}</h3>
									{event.description ? (
										<div className={styles.description}>
											<PortableText value={event.description} />
										</div>
									) : null}
									<p className={styles.meta}>
										{event.venue}
										{event.venue && event.location ? ", " : ""}
										{event.location}
										{` · ${formatTime(event.date)}`}
									</p>
									{event.ticketLink?.url ? (
										<a href={hrefFor(event.ticketLink)} className={styles.link}>
											{event.ticketLink.text || "Tickets & info"}
										</a>
									) : null}
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<p className={styles.empty}>No upcoming events.</p>
			)}

			{pastByYear.size > 0 ? (
				<div className={styles.past}>
					<p className={styles.pastLabel}>Past events</p>
					{Array.from(pastByYear.entries()).map(([year, yearEvents]) => (
						<details key={year} className={styles.yearGroup}>
							<summary>
								{year} <span className={styles.count}>({yearEvents.length})</span>
							</summary>
							<div className={styles.yearList}>
								{yearEvents.map((event) => (
									<div key={event._id} className={styles.pastItem}>
										<span className={styles.pastDate}>
											{new Date(event.date).toLocaleDateString("en-US", {
												day: "numeric",
												month: "long",
											})}
										</span>
										<div>
											<p className={styles.pastTitle}>{event.title}</p>
											<p className={styles.meta}>
												{event.venue}
												{event.venue && event.location ? ", " : ""}
												{event.location}
											</p>
										</div>
									</div>
								))}
							</div>
						</details>
					))}
				</div>
			) : null}

			{block.button?.url ? (
				<a href={hrefFor(block.button)} className={styles.button}>
					{block.button.text}
				</a>
			) : null}
		</section>
	);
}
