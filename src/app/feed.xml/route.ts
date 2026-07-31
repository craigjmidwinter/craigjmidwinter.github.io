import {getAllPosts, Post} from "@/service/blog";
import {excerpt} from "@/components/Jazz/postMeta";

/**
 * Static RSS 2.0 feed.
 *
 * The site is built with `output: "export"`, so this handler runs once at build
 * time and the response body is written to `dist/feed.xml`. `force-static` is
 * what lets a route handler participate in the export at all — the handler must
 * therefore never read the request, and everything it emits has to be derived
 * from the posts on disk (no Date.now, no request headers).
 */
export const dynamic = "force-static";

const SITE = "https://midwinter.io";
const FEED_TITLE = "Craig Midwinter — Blog";
const FEED_DESCRIPTION =
    "Notes from a house that talks back. Home automation writing from Craig Midwinter.";

/** Escape the five XML predefined entities. */
function esc(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

/** RFC 822 style date for <pubDate>; "" when the post has no usable date. */
function pubDate(value: string | undefined): string {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toUTCString();
}

function postUrl(post: Post): string {
    return `${SITE}/blog/${post.slug}`;
}

function item(post: Post): string {
    const url = postUrl(post);
    const date = pubDate(post.date_published);

    return [
        "        <item>",
        `            <title>${esc(post.title ?? "")}</title>`,
        `            <link>${esc(url)}</link>`,
        `            <guid isPermaLink="true">${esc(url)}</guid>`,
        date ? `            <pubDate>${esc(date)}</pubDate>` : "",
        `            <description>${esc(excerpt(post, 300))}</description>`,
        "        </item>",
    ]
        .filter(Boolean)
        .join("\n");
}

export async function GET() {
    const posts = getAllPosts();
    // Posts arrive newest-first, so the newest date doubles as the build stamp
    // without reaching for the clock.
    const lastBuildDate = posts.length > 0 ? pubDate(posts[0].date_published) : "";

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>${esc(FEED_TITLE)}</title>
        <link>${SITE}/blog</link>
        <description>${esc(FEED_DESCRIPTION)}</description>
        <language>en</language>
        <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
${lastBuildDate ? `        <lastBuildDate>${esc(lastBuildDate)}</lastBuildDate>\n` : ""}${posts
        .map(item)
        .join("\n")}
    </channel>
</rss>
`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, must-revalidate",
        },
    });
}
