/**
 * The disclosure for the self-hosted Umami tag in `app/layout.tsx`.
 *
 * The tag is injected by the ROOT LAYOUT, so it is on every page — including the
 * 404, which renders no footer. The disclosure therefore cannot live in one
 * component: it has to appear anywhere the layout does. Every page that can be
 * reached must render this string somewhere.
 *
 * Rendered by `Jazz/Contact.tsx` (the sitewide footer) and by
 * `app/blog/[slug]/not-found.tsx` (the 404, which has no footer of its own).
 * Shared as one constant so the two can never drift apart.
 *
 * The wording is load-bearing and was checked against the served tracker rather
 * than assumed: no `document.cookie`, no `Set-Cookie` on the script response, the
 * single `localStorage` key is the `umami.disabled` opt-out flag rather than a
 * visitor id, and events post to `/api/send` on the same self-hosted origin.
 * If the tracker is ever swapped or upgraded, re-check before trusting this line.
 */
export const ANALYTICS_DISCLOSURE =
    "Self-hosted, cookieless analytics. No personal data, no third party.";
