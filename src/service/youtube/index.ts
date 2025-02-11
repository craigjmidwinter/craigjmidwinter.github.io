// youtubeService.ts
import axios from 'axios';
import {PlaylistItem, YouTubeApiResponse, YouTubeVideoApiResponse} from "@/service/youtube/types";
import path from "path";
import fs from "fs";

const YOUTUBE_PLAYLIST_ITEMS_API = 'https://www.googleapis.com/youtube/v3/playlistItems';
const cacheDirPath = path.resolve('./.cache'); // Define cache directory path

export const initiateCache = (): void => {
    // Check if the cache directory exists
    if (!fs.existsSync(cacheDirPath)) {
        // If the cache directory does not exist, create it
        fs.mkdirSync(cacheDirPath, {recursive: true});
        console.log('Cache directory created at:', cacheDirPath);
    } else {
        console.log('Cache directory already exists at:', cacheDirPath);
    }
};
const cacheFilePath = path.resolve('./.cache/playlistItems.json'); // Define cache file path
export const fetchPlaylistItems = async (playlistId: string, count: number = 0, fromId?: string, order: "asc" | "desc" = "desc"): Promise<PlaylistItem[]> => {
    const allItems = await fetchAllPlaylistItems(playlistId);

    // Locate the index of fromId if specified
    const startIndex = fromId ? allItems.findIndex(item => item.snippet.resourceId.videoId === fromId) : -1;
    let items: PlaylistItem[] = [];

    if (order === 'asc') {
        items = startIndex > 0 ? allItems.slice(0, startIndex) : allItems;
        items.reverse();
    } else {
        items = startIndex >= 0 ? allItems.slice(startIndex + 1) : allItems;
    }
    if (count > 0) {
        items = items.slice(0, count);
    }

    return items;
};

export const fetchAllPlaylistItems = async (playlistId: string): Promise<PlaylistItem[]> => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    let pageToken = '';
    let allItems: PlaylistItem[] = [];
    let allResults: PlaylistItem[] = [];
    let fetchedAll = false;

    initiateCache()
    try {
        // Attempt to read from cache first
        if (fs.existsSync(cacheFilePath)) {
            const cacheContent = fs.readFileSync(cacheFilePath, 'utf8');
            allResults = JSON.parse(cacheContent);
            return allResults;
        }

        // Fetch all public items from the playlist if cache is not available
        while (!fetchedAll) {
            const response = await axios.get<YouTubeApiResponse>(YOUTUBE_PLAYLIST_ITEMS_API, {
                params: {
                    part: 'snippet,status',
                    maxResults: 50,
                    playlistId,
                    key: apiKey,
                    pageToken,
                },
            });

            const publicItems = response.data.items.filter(item => item.status.privacyStatus === 'public');
            allItems = allItems.concat(publicItems);
            allResults = allItems.map(structurePlaylistItem);

            if (response.data.nextPageToken) {
                pageToken = response.data.nextPageToken;
            } else {
                fetchedAll = true;
            }
        }

        // Cache the results
        fs.writeFileSync(cacheFilePath, JSON.stringify(allResults));

        return allResults;
    } catch (error) {
        console.error('Error fetching data from YouTube API:', error);
        throw new Error('Failed to fetch data from YouTube API');
    }
};
export const structurePlaylistItem = (item: PlaylistItem): PlaylistItem => {
    return {
        ...item,
    }
}
export const fetchVideoDetails = async (videoId: string) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    try {
        const response = await axios.get<YouTubeVideoApiResponse>('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet,status', // Specify other parts as needed
                id: videoId, // Use the 'id' parameter to specify the video ID
                key: apiKey,
            },
        });

        const publicVideos = response.data.items.filter(item => item.status.privacyStatus === 'public');

        if (publicVideos.length > 0) {
            return publicVideos[0]; // Return the first public video's details
        } else {
            throw new Error('No public video found with the provided ID');
        }
    } catch (error) {
        console.error('Error fetching data from YouTube API:', error);
        throw new Error('Failed to fetch video details from YouTube API');
    }
};
export const fetchLatestPlaylistItem = async (playlistId: string): Promise<PlaylistItem> => {
    const playlistItems = await fetchPlaylistItems(playlistId);
    return playlistItems[0];

}

