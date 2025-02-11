export interface Snippet {
    publishedAt: string; // datetime is usually represented as a string in JSON
    channelId: string;
    title: string;
    description: string;
    thumbnails: { [key: string]: Thumbnail };
    channelTitle: string;
    videoOwnerChannelTitle: string;
    videoOwnerChannelId: string;
    playlistId: string;
    position: number; // unsigned integer
    resourceId: ResourceId;
}

interface Thumbnail {
    url: string;
    width: number; // unsigned integer
    height: number; // unsigned integer
}

interface ResourceId {
    kind: string;
    videoId: string;
}

export interface ContentDetails {
    videoId: string;
    startAt: string;
    endAt: string;
    note: string;
    videoPublishedAt: string; // datetime
}

export interface Status {
    privacyStatus: string;
}

export interface PlaylistItem {
    kind: "youtube#playlistItem";
    etag: string;
    id: string;
    snippet: Snippet;
    contentDetails: ContentDetails;
    status: Status;
}

export interface YouTubeApiResponse {
    items: PlaylistItem[];
    nextPageToken?: string;
}

export interface YouTubeVideoApiResponse {
    items: Array<{
        snippet: {
            title: string;
            description: string;
            // Add other snippet fields as needed
        };
        status: {
            privacyStatus: string;
        };
        // Add other video item fields as needed
    }>;
}
