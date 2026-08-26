// app/siteMeta.ts
// Shared identity for the metadata blocks on every page.

export const SITE_URL = "https://midwinter.io";
export const SITE_NAME = "Craig Midwinter";

/**
 * One description of the blog, used by the listing page's metadata AND by the RSS
 * feed. They were separate strings and drifted: the feed still called this a home
 * automation blog long after the writing had moved to AI development workflows, and
 * a feed reader shows the feed's own description rather than the site's, so the
 * stale one was the copy most subscribers actually saw.
 */
export const BLOG_DESCRIPTION =
    "Notes on making computers do the work: AI development workflows lately, and " +
    "before that, the years I wired up my house. Home Assistant, Hue, agent " +
    "pipelines, and one voice actor who reads my cat's litter box.";

/** Site-wide social card, used by any page with no image of its own. */
export const OG_IMAGE = {
    url: "/og-default.png",
    width: 1200,
    height: 630,
    alt: "Craig Midwinter — engineering leader, still shipping. midwinter.io",
};

/** next.config sets trailingSlash: true, so canonicals have to carry the slash the
 *  server actually serves, or the canonical points at a URL that redirects. */
export function canonicalPath(path: string): string {
    if (path === "/") return "/";
    const trimmed = path.replace(/\/+$/, "");
    return `${trimmed}/`;
}
