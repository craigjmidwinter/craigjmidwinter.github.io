/**
 * Shared, presentation-level helpers for blog posts.
 *
 * These are pure functions with no React and no "use client" directive, so they
 * are safe to call from server components, client components and route handlers
 * alike. Everything here has to be deterministic: the site is statically
 * exported, so the markup produced on the build machine must match what the
 * browser renders. That rules out `Date.toLocale*` (timezone + locale
 * dependent) — dates are read straight off the ISO string prefix, the same
 * pattern used by `src/components/Jazz/Archive.tsx`.
 */

import {Post} from "@/service/blog";

const WORDS_PER_MINUTE = 200;

/**
 * "YYYY.MM" from the post's published date.
 *
 * Parses the ISO string prefix so the value never shifts across timezones;
 * falls back to UTC field access for anything that is not ISO-shaped, and to
 * "" for a missing or unparseable date.
 */
export function formatPostDate(post: Post): string {
    const value = post?.date_published;
    if (!value) return "";

    const match = /^(\d{4})-(\d{2})/.exec(value);
    if (match) return `${match[1]}.${match[2]}`;

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    return `${parsed.getUTCFullYear()}.${String(parsed.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** Estimated reading time in whole minutes: ceil(words / 200), never below 1. */
export function readTime(post: Post): number {
    const content = post?.content ?? "";
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** Tags as an uppercase list, e.g. ["HOME ASSISTANT", "MQTT"]. [] when absent. */
export function postTags(post: Post): string[] {
    const raw = post?.tags;
    if (!raw) return [];
    return raw
        .split(",")
        .map((tag) => tag.trim().toUpperCase())
        .filter((tag) => tag.length > 0);
}

/**
 * The mono meta line under a card or hero, e.g. `8 MIN · HOME ASSISTANT`.
 * Drops the tag half when the post has no tags.
 */
export function postMeta(post: Post): string {
    const minutes = `${readTime(post)} MIN`;
    const [first] = postTags(post);
    return first ? `${minutes} · ${first}` : minutes;
}

const FENCE = /^\s*(```|~~~)/;

/** Lines that are structure or media rather than prose we would want to quote. */
function isSkippable(line: string): boolean {
    const t = line.trim();
    if (!t) return true;
    if (/^#{1,6}\s/.test(t)) return true; // ATX heading
    if (/^(=+|-+)$/.test(t)) return true; // setext underline / hr
    if (/^([-*_])\s*(\1\s*){2,}$/.test(t)) return true; // thematic break
    if (/^>/.test(t)) return true; // blockquote
    if (/^!\[/.test(t)) return true; // image or YouTube-style embed
    if (/^\[!\[/.test(t)) return true; // linked image
    if (/^</.test(t)) return true; // raw HTML / iframe embed
    if (/^[-*+]\s/.test(t)) return true; // bullet list
    if (/^\d+[.)]\s/.test(t)) return true; // ordered list
    if (/^\|/.test(t)) return true; // table row
    if (/^https?:\/\/\S+$/.test(t)) return true; // bare URL on its own line
    if (/^\s{4,}\S/.test(line)) return true; // indented code block
    return false;
}

/** Reduce inline markdown to plain text. */
function stripMarkdown(text: string): string {
    return text
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // inline links
        .replace(/\[([^\]]*)\]\[[^\]]*\]/g, "$1") // reference links
        .replace(/<[^>]*>/g, "") // stray HTML tags
        .replace(/`([^`]*)`/g, "$1") // inline code
        .replace(/(\*\*|__)(.*?)\1/g, "$2") // bold
        .replace(/(\*|_)(?=\S)([\s\S]*?\S)\1/g, "$2") // italic
        .replace(/~~(.*?)~~/g, "$1") // strikethrough
        .replace(/https?:\/\/\S+/g, " ") // bare URLs read as noise in a blurb
        .replace(/\*/g, "") // emphasis markers left over from multi-line spans
        .replace(/&nbsp;/g, " ")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim();
}

/** Cut at a word boundary and mark the cut with a single ellipsis character. */
function truncate(text: string, maxLen: number): string {
    if (text.length <= maxLen) return text;

    const slice = text.slice(0, maxLen);
    const lastSpace = slice.lastIndexOf(" ");
    const cut = lastSpace > 0 ? slice.slice(0, lastSpace) : slice;
    return `${cut.replace(/[\s,;:.!?"'()—-]+$/, "")}…`;
}

/**
 * The first substantive paragraph of the post body, as plain text.
 *
 * Headings, images, YouTube embeds, blockquotes, lists, tables and fenced code
 * are skipped; inline markdown is stripped. The result is truncated at a word
 * boundary so the prose is at most `maxLen` characters, with a trailing "…"
 * appended when anything was cut (so the returned string can be maxLen + 1).
 * Returns "" when the post has no prose at all.
 */
export function excerpt(post: Post, maxLen: number = 150): string {
    const content = post?.content ?? "";
    if (!content.trim()) return "";

    const lines = content.split(/\r?\n/);
    let inFence = false;

    for (let i = 0; i < lines.length; i++) {
        if (FENCE.test(lines[i])) {
            inFence = !inFence;
            continue;
        }
        if (inFence || isSkippable(lines[i])) continue;

        // Collect the rest of this paragraph (up to the next blank line/fence).
        const paragraph: string[] = [];
        for (let j = i; j < lines.length; j++) {
            if (!lines[j].trim() || FENCE.test(lines[j])) break;
            paragraph.push(lines[j].trim());
        }

        const text = stripMarkdown(paragraph.join(" "));
        if (text) return truncate(text, maxLen);

        // Nothing usable here: resume at the line that ended this paragraph so
        // fence tracking stays in step.
        i += paragraph.length - 1;
    }

    return "";
}
