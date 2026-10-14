/**
 * The Studio route — embedded directly in the Next.js app at /studio
 * instead of a separately hosted/deployed Studio. `[[...tool]]` is the
 * Studio's own internal routing (its desk, vision, etc. tools), not
 * ours — leave this file alone, it just mounts <NextStudio>.
 */
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
	return <NextStudio config={config} />;
}
