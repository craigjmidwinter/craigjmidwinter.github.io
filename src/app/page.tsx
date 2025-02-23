// app/page.tsx
import ClientLandingPage from "./ClientLandingPage";
import {fetchPlaylistItems} from "@/service/youtube";

export const metadata = {
    title: "Craig Midwinter - Personal Website",
    description:
        "Welcome to my personal website. Check out my resume, GitHub, LinkedIn, podcast, and blog posts.",
};


export default async function Page() {
    const playlistId = 'PLiFBbHnPz5MSqFWfGx_qsLYqLFv3ktLCU'; // Replace with your actual playlist ID
    const episodes = await fetchPlaylistItems(playlistId, 2);
    return <ClientLandingPage episodes={episodes}/>;
}

