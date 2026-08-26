// src/service/youtube/feed.ts
//
// Episode data for the podcast section, read from YouTube's public playlist RSS
// feed instead of the Data API.
//
// WHY NOT THE DATA API: the Data API path in ./index.ts fails at build time on CI.
// The deploy log for the last release shows `YOUTUBE_API_KEY: ***` present and then
// `Request failed with status code 404` from googleapis, and page.tsx catches that,
// so the build stays green while the section silently renders empty placeholder
// tiles. The playlist itself is fine — this feed returns 200 with 15 entries for the
// same id, and the same video ids appear on oscarsoutsider.com. Whatever is wrong
// lives in the key/project configuration, which needs GCP console access to see.
//
// This endpoint needs no key, no secret and no quota, so it also works on a local
// `yarn build`. That matters: the Data API version only ever failed where nobody was
// looking, because every local build fell back to placeholders too.
//
// Trade-off: the feed returns only the ~15 most recent uploads. The section shows
// two, so that is ample.

import {PlaylistItem, Snippet} from "./types";

const PLAYLIST_FEED = "https://www.youtube.com/feeds/videos.xml";

function decodeEntities(text: string): string {
    return text
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, "&");
}

function tagValue(entry: string, tag: string): string {
    const match = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`).exec(entry);
    return match ? decodeEntities(match[1].trim()) : "";
}

/**
 * Maps one Atom entry onto the PlaylistItem shape the Podcast component already
 * consumes, so nothing downstream has to know where the data came from.
 *
 * The thumbnail is whatever URL the feed hands us (hqdefault), never a URL we
 * assemble ourselves. Deriving `maxresdefault.jpg` from a video id would look
 * tidier and 404s for any video that has no max-res still — precisely the silent
 * broken-image failure this change exists to remove.
 */
function entryToPlaylistItem(entry: string, playlistId: string, index: number): PlaylistItem | null {
    const videoId = tagValue(entry, "yt:videoId");
    if (!videoId) return null;

    const thumb = /<media:thumbnail\s+url="([^"]+)"(?:\s+width="(\d+)")?(?:\s+height="(\d+)")?/.exec(entry);
    const thumbnails: Snippet["thumbnails"] = {};
    if (thumb) {
        thumbnails.high = {
            url: decodeEntities(thumb[1]),
            width: thumb[2] ? Number(thumb[2]) : 480,
            height: thumb[3] ? Number(thumb[3]) : 360,
        };
    }

    const title = tagValue(entry, "title");
    const publishedAt = tagValue(entry, "published");
    const channelId = tagValue(entry, "yt:channelId");
    const channelTitle = tagValue(entry, "name");

    return {
        kind: "youtube#playlistItem",
        etag: "",
        id: `${playlistId}:${videoId}`,
        snippet: {
            publishedAt,
            channelId,
            title,
            description: "",
            thumbnails,
            channelTitle,
            videoOwnerChannelTitle: channelTitle,
            videoOwnerChannelId: channelId,
            playlistId,
            position: index,
            resourceId: {kind: "youtube#video", videoId},
        },
        contentDetails: {
            videoId,
            startAt: "",
            endAt: "",
            note: "",
            videoPublishedAt: publishedAt,
        },
        // The feed only carries publicly visible uploads, so anything we can read here
        // is public by construction.
        status: {privacyStatus: "public"},
    };
}

/**
 * Newest-first episodes for a public playlist. Throws on a non-200 so the caller
 * decides what a missing podcast section should do.
 */
export async function fetchPlaylistFeedItems(
    playlistId: string,
    count = 0,
): Promise<PlaylistItem[]> {
    const url = `${PLAYLIST_FEED}?playlist_id=${encodeURIComponent(playlistId)}`;
    const response = await fetch(url, {headers: {accept: "application/atom+xml"}});

    if (!response.ok) {
        throw new Error(
            `YouTube playlist feed for ${playlistId} returned ${response.status} ${response.statusText}`,
        );
    }

    const xml = await response.text();
    const entries = xml.split("<entry>").slice(1);
    const items = entries
        .map((entry, i) => entryToPlaylistItem(entry, playlistId, i))
        .filter((item): item is PlaylistItem => item !== null);

    return count > 0 ? items.slice(0, count) : items;
}
