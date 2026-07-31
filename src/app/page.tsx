// app/page.tsx
import ClientLandingPage from "./ClientLandingPage";
import {fetchPlaylistItems} from "@/service/youtube";
import {getAllPosts} from "@/service/blog";

export default async function Page() {
    // Oscars Outsider episodes (same playlist oscarsoutsider.com builds from)
    const playlistId = 'PLDYT8ZhjQbnwIrSVrbcav3rGZvojw22Ml';
    let episodes: Awaited<ReturnType<typeof fetchPlaylistItems>> = [];
    try {
        episodes = await fetchPlaylistItems(playlistId, 2);
    } catch (error) {
        // The podcast section falls back to placeholder tiles; a YouTube API
        // failure should not take down the whole build.
        console.error("Podcast episodes unavailable at build time:", error);
    }
    const posts = getAllPosts();

    return <ClientLandingPage episodes={episodes} posts={posts}/>;
}

// Force static generation
export const dynamic = 'force-static';

