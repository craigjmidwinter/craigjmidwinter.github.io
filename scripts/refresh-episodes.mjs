#!/usr/bin/env node
/**
 * refresh-episodes.mjs
 *
 * Writes src/data/episodes.ts — the committed snapshot of Oscars Outsider episodes
 * that the podcast section renders from.
 *
 * WHY A COMMITTED SNAPSHOT RATHER THAN A BUILD-TIME FETCH:
 * YouTube returns 404 for this playlist when the request comes from a GitHub Actions
 * runner, and 200 for the same URL from Craig's machine. That is true of BOTH the
 * Data API and this public RSS feed — two unrelated endpoints — so it is not the API
 * key, not the playlist, and not the request shape. It is where the request comes
 * from. No build-time fetch can work on CI, so the data has to be in the repo.
 *
 * That also removes a whole class of failure: the build no longer depends on a
 * network call at all, so it cannot silently degrade in the one environment nobody
 * watches. Staleness replaces breakage, and staleness is visible.
 *
 * Run it from a machine where the feed resolves:
 *     node scripts/refresh-episodes.mjs
 * then commit src/data/episodes.ts. Run it whenever a new episode should appear.
 */

import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const OUT_FILE = path.join(REPO_ROOT, "src", "data", "episodes.ts");

const PLAYLIST_ID = "PLDYT8ZhjQbnwIrSVrbcav3rGZvojw22Ml";
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`;
/** The section shows two; keep a few spare so a reorder does not empty it. */
const KEEP = 6;

function decodeEntities(text) {
    return text
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, "&");
}

function tagValue(entry, tag) {
    const match = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`).exec(entry);
    return match ? decodeEntities(match[1].trim()) : "";
}

/**
 * Thumbnails come from the feed's own media:thumbnail and are never assembled from
 * a video id. Deriving maxresdefault.jpg looks tidier and 404s for any video with no
 * max-res still, which is the silent broken-image failure this all exists to avoid.
 */
function entryToItem(entry, index) {
    const videoId = tagValue(entry, "yt:videoId");
    if (!videoId) return null;

    const thumb = /<media:thumbnail\s+url="([^"]+)"(?:\s+width="(\d+)")?(?:\s+height="(\d+)")?/.exec(entry);
    const thumbnails = {};
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
        id: `${PLAYLIST_ID}:${videoId}`,
        snippet: {
            publishedAt,
            channelId,
            title,
            description: "",
            thumbnails,
            channelTitle,
            videoOwnerChannelTitle: channelTitle,
            videoOwnerChannelId: channelId,
            playlistId: PLAYLIST_ID,
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
        status: {privacyStatus: "public"},
    };
}

const response = await fetch(FEED_URL, {headers: {accept: "application/atom+xml"}});
if (!response.ok) {
    console.error(
        `Feed for ${PLAYLIST_ID} returned ${response.status} ${response.statusText}.\n` +
        `If this is a 404, you are probably running somewhere YouTube refuses the ` +
        `request — a CI runner or a datacenter IP. Run it from a normal connection.`,
    );
    process.exit(1);
}

const xml = await response.text();
const items = xml
    .split("<entry>")
    .slice(1)
    .map(entryToItem)
    .filter(Boolean)
    .slice(0, KEEP);

if (items.length === 0) {
    console.error("Feed parsed to zero episodes; refusing to write an empty snapshot.");
    process.exit(1);
}

const fetchedAt = new Date().toISOString();
const file = `// GENERATED FILE — do not edit by hand.
// Written by scripts/refresh-episodes.mjs. Run that script and commit the result
// when a new episode should appear on the site.
//
// This is a committed snapshot rather than a build-time fetch because YouTube 404s
// this playlist from GitHub Actions runners while serving it fine elsewhere — see
// the header of scripts/refresh-episodes.mjs.

import {PlaylistItem} from "@/service/youtube/types";

/** When this snapshot was taken, so the build can report how stale it is. */
export const EPISODES_FETCHED_AT = ${JSON.stringify(fetchedAt)};

export const EPISODES: PlaylistItem[] = ${JSON.stringify(items, null, 4)};
`;

fs.mkdirSync(path.dirname(OUT_FILE), {recursive: true});
fs.writeFileSync(OUT_FILE, file, "utf8");

console.log(`Wrote ${items.length} episodes to src/data/episodes.ts`);
console.log(`  newest: ${items[0].snippet.title}`);
console.log(`  fetched at: ${fetchedAt}`);
console.log(`Commit src/data/episodes.ts to publish them.`);
