// app/page.tsx
import ClientLandingPage from "./ClientLandingPage";
import {fetchPlaylistItems} from "@/service/youtube";
import {getAllPosts} from "@/service/blog";

export default async function Page() {
    const playlistId = 'PLiFBbHnPz5MSqFWfGx_qsLYqLFv3ktLCU';
    const episodes = await fetchPlaylistItems(playlistId, 2);
    const posts = getAllPosts();
    const latestPosts = posts.slice(0, 3);
    
    return <ClientLandingPage episodes={episodes} posts={latestPosts}/>;
}

// Force static generation
export const dynamic = 'force-static';

