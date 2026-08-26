// app/page.tsx
import ClientLandingPage from "./ClientLandingPage";
import {getAllPosts} from "@/service/blog";
import {EPISODES, EPISODES_FETCHED_AT} from "@/data/episodes";

/** Days after which the committed episode snapshot is worth refreshing. */
const STALE_AFTER_DAYS = 21;

export default async function Page() {
    // Oscars Outsider episodes come from a committed snapshot, not a build-time
    // fetch. YouTube 404s this playlist from GitHub Actions runners while serving it
    // fine elsewhere — true of both the Data API and the public RSS feed, so it is
    // where the request originates, not the key or the playlist. Refresh with
    // `node scripts/refresh-episodes.mjs` and commit the result.
    const episodes = EPISODES.slice(0, 2);
    const posts = getAllPosts();

    // The failure mode this section had for months was silence: an empty tile grid
    // that looked deliberate. A snapshot cannot break that way, but it can go quietly
    // out of date, so say so at build time rather than letting it drift unnoticed.
    const ageDays = Math.floor(
        (Date.parse(new Date().toISOString()) - Date.parse(EPISODES_FETCHED_AT)) / 86_400_000,
    );
    if (episodes.length === 0) {
        console.warn(
            "[podcast] src/data/episodes.ts is empty — the section will render without " +
            "tiles. Run `node scripts/refresh-episodes.mjs` and commit the result.",
        );
    } else if (ageDays > STALE_AFTER_DAYS) {
        console.warn(
            `[podcast] Episode snapshot is ${ageDays} days old (taken ${EPISODES_FETCHED_AT}). ` +
            "Run `node scripts/refresh-episodes.mjs` and commit the result.",
        );
    }

    return <ClientLandingPage episodes={episodes} posts={posts}/>;
}

// Force static generation
export const dynamic = 'force-static';
