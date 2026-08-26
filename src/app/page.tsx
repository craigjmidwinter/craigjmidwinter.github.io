// app/page.tsx
import ClientLandingPage from "./ClientLandingPage";
import {fetchPlaylistFeedItems} from "@/service/youtube/feed";
import {getAllPosts} from "@/service/blog";

export default async function Page() {
    // Oscars Outsider episodes (same playlist oscarsoutsider.com builds from).
    // Read from the public RSS feed rather than the Data API — see the note at the
    // top of service/youtube/feed.ts for why the API path was blanking this section
    // on every deploy.
    const playlistId = 'PLDYT8ZhjQbnwIrSVrbcav3rGZvojw22Ml';
    let episodes: Awaited<ReturnType<typeof fetchPlaylistFeedItems>> = [];
    try {
        episodes = await fetchPlaylistFeedItems(playlistId, 2);
    } catch (error) {
        // Still non-fatal: a YouTube outage should not take down the whole build.
        // But log loudly and specifically — the previous version printed an axios
        // object whose response body rendered as "[Object]", which is why a section
        // that had been empty for months read as a design choice rather than a bug.
        console.error(
            `[podcast] Episodes unavailable at build time for playlist ${playlistId}. ` +
            `The podcast section will render without episode tiles. Reason:`,
            error instanceof Error ? error.message : error,
        );
    }
    const posts = getAllPosts();

    return <ClientLandingPage episodes={episodes} posts={posts}/>;
}

// Force static generation
export const dynamic = 'force-static';

