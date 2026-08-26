# midwinter.io

Craig Midwinter's personal site and blog. Next.js App Router, statically exported,
served from GitHub Pages at [midwinter.io](https://midwinter.io).

## Running it

```bash
yarn install
yarn dev      # http://localhost:3000
yarn build    # static export into dist/
```

`yarn build` needs `YOUTUBE_API_KEY` (see `.env.example`) to pull the latest Oscars
Outsider episodes. Without it the build still succeeds — the podcast section falls
back to placeholder tiles rather than failing the build.

### The distDir gotcha

`next.config.ts` points dev at `.next` and builds at `dist`. They must not share a
directory: a `next build` will clobber the dev server's incremental artifacts, which
shows up as `ENOENT build-manifest` errors and a "missing required error components"
refresh loop. If you hit that, stop the dev server, delete `.next`, and restart.

## Deploying

Push to `main`. `.github/workflows/integrate.yaml` builds and publishes `dist/` to the
`gh-pages` branch. `public/CNAME` holds the custom domain.

## Content

Posts are markdown with gray-matter frontmatter in `_posts/`, read at build time by
`src/service/blog/index.ts`.

```yaml
---
title: "Putting the pit crew loop to the test"
slug: 2026-08-putting-the-pit-crew-loop-to-the-test  # optional; defaults to the filename
excerpt: "One or two sentences..."                   # optional
cover_image: "/assets/blog/2026/pit-crew-test-cover.png"  # optional; doubles as the og:image
tags: AI Workflows, Multi-Agent, Agents
date_published: 2026-08-14T12:00:00.000Z
date_updated: 2026-08-20T12:00:00.000Z               # optional
---
```

Filenames follow `<publish-date>-<YYYY-MM>-<slug>.md`. Cover images live under
`public/assets/blog/<year>/`.

### Scheduled publishing

`scripts/release-due-posts.mjs` moves drafts out of `_drafts/queue/` into `_posts/`
once their `publishOn: YYYY-MM-DD` frontmatter date arrives, then commits and pushes.
It is idempotent and driven by a launch agent
(`~/Library/LaunchAgents/io.midwinter.blog-release.plist`); the log is gitignored at
`scripts/release-due-posts.log`. Run it by hand with
`node scripts/release-due-posts.mjs`.

Queueing a draft is the publish decision — the script does not ask again.

### Podcast episodes

The Oscars Outsider tiles are built from the playlist's **public RSS feed**
(`service/youtube/feed.ts`), not the YouTube Data API.

The Data API path in `service/youtube/index.ts` is still present but no longer used by
the page, and it is why that section shipped empty for months: on CI it returned `404`
even with `YOUTUBE_API_KEY` set, `page.tsx` caught the error so the build stayed green,
and the section quietly rendered two empty placeholder tiles that looked like a design
choice. The playlist was never the problem — the same id returns 200 with 15 entries
from the feed, and the same video ids appear on oscarsoutsider.com. Whatever is
misconfigured is in the API key or its GCP project, which needs console access to see.

The feed needs no key, no secret and no quota, so **a local `yarn build` renders the
real tiles too**. That matters as much as the fix: the old path failed identically on
every developer machine, so there was nowhere the breakage was visible.

Thumbnail URLs come from the feed's `media:thumbnail` and are never assembled from a
video id. Deriving `maxresdefault.jpg` looks tidier and 404s for any video without a
max-res still — the same silent broken-image failure this replaced.

`.cache/playlistItems.json` short-circuits the old API path and is gitignored and never
populated on CI, so it never provided resilience there. It *will* freeze episodes
locally once written — delete it if the tiles look stale.

### Unwired content

`_experience/`, `_project/`, and `_volunteer/` are holdovers from the previous site
and are **not** read by the current build. The work cards and timeline are hardcoded
in `src/components/Jazz/Work.tsx` and `src/components/Jazz/About.tsx`. Edit those.

## Design system ("Jazz")

Brutalist blocks, hard offset shadows, rotated confetti marks. There is no dark
treatment — the site is light-only, and `globals.css` pins `color-scheme: light` so the
UA chrome, the painted page, and `<meta name="theme-color">` agree.

| Token  | Hex       | Role                                      |
| ------ | --------- | ----------------------------------------- |
| Paper  | `#fbfaf7` | Page background                           |
| Ink    | `#111111` | Body text, dark section fills             |
| Teal   | `#00a7a0` | Fill/shadow accent                        |
| Purple | `#8e3d94` | Fill accent, footer, blockquotes          |
| Yellow | `#e9e64a` | Highlight, hover fills, focus rings on ink |

### Icons

`src/app/favicon.ico`, `src/app/icon.png` and `src/app/apple-icon.png` are generated
from `scripts/favicon.html` by `./scripts/make-favicon.sh`. Next's App Router picks
those filenames up on its own and emits the `<link>` tags, so there is no markup to
keep in sync.

The previous icon was the stock `create-next-app` triangle — served fine at 200, just
never replaced, same family of leftover as the old README.

The generator is **fleet-reusable**: the letter and the three colours are custom
properties at the top of `favicon.html`, and nothing else in it is site-specific.

### Colour pairings

**This is the part that has bitten us. Read it before changing a colour.**

Teal and purple are both **mid-luminance**. That is the trap: they look like brand
colours you can put anywhere, but each one only clears WCAG AA against *one* end of the
palette, and fails against the other.

| Pairing                | Ratio  | Verdict                                    |
| ---------------------- | ------ | ------------------------------------------ |
| Ink on teal            | 6.33:1 | ✅                                          |
| Teal on ink            | 6.33:1 | ✅                                          |
| **White on teal**      | 2.99:1 | ❌ fails AA *and* the 3:1 large-text floor   |
| **Teal on paper**      | 2.86:1 | ❌ fails AA                                 |
| White on purple        | 6.47:1 | ✅                                          |
| Purple on paper        | 6.20:1 | ✅                                          |
| **Purple on ink**      | 2.92:1 | ❌ fails AA                                 |

So:

- **Teal as a fill** (buttons, section backgrounds) takes **ink** text, never white.
- **Teal as text** on ink is fine at full strength.
- **Teal as text on a light surface** uses `TEAL_ON_PAPER` = `#007570` — the same hue
  darkened until it clears AA on paper (5.32:1) *and* on the slightly darker inline-code
  chip (4.70:1). Declared in `Nav.tsx`, `ClientBlogListing.tsx`, `ClientBlogPost.tsx`.
- **Purple as text on ink** uses `PURPLE_ON_INK` = `#b077b4` (5.53:1), in `About.tsx`.

Three things that are easy to miss:

- **`opacity` counts, and it multiplies down the tree.** Dimmed ink on paper falls under
  AA below about `0.60` — several 9.5–10px labels were sitting at `0.5`/`0.55`. A blanket
  `opacity` on a container also dims its coloured children: that is how the purple
  `ARCHIVE` tag ended up at 3.33:1. Prefer baking the dim into an explicit `color`.
- **Decorative washes count** when text can overlap them. The purple blobs behind the
  podcast and "keep reading" sections sit at `opacity: 0.25` precisely so ink copy
  crossing them stays above 4.5:1.
- **The nearest painted background is not always the obvious one.** A link inside
  `<code>` sits on the inline-code chip, not on paper.

Verify against the **rendered** page, not the source — walk up from the element and
composite the real ancestor backgrounds. The post meta date looks like body text but
sits on the ink hero, where the fill teal is the correct choice.

## Analytics

Self-hosted [Umami](https://umami.is) at `umami.midwinter.dev`, reached through a
Cloudflare tunnel. The tag is a plain `<script defer>` in `app/layout.tsx`.

**The tag and the footer disclosure are a pair. Never ship one without the other.**
That was the condition for self-hosting rather than using Google: cookieless, no
personal data, self-hosted, disclosed on the site. The disclosure string lives in
`components/Jazz/analyticsDisclosure.ts` and is rendered by the sitewide footer
(`Jazz/Contact.tsx`) *and* by the 404 (`components/Jazz/NotFoundPage.tsx`), because the
tag is injected by the root layout and so reaches pages the footer does not.

Things that will make this collect nothing while still looking correct:

- **A Content-Security-Policy.** There is none today, and GitHub Pages cannot set
  response headers — so one could only arrive as a `<meta http-equiv>` tag. If you add
  one, `script-src` **and** `connect-src` both need `umami.midwinter.dev`, or collection
  stops silently.
- **`next/script`.** Deliberately not used here. An `afterInteractive` strategy can
  defer the tag past a bounce, and a bounce is exactly the visit worth counting.
- **A tag that is in the repo but not in the build.** Verify against built or deployed
  HTML, never against the source.

The website id is midwinter.io's alone. Several sites are being tagged and the ids are
not interchangeable, so do not copy the tag to another repo.

The claims in the disclosure were checked against the served tracker rather than
assumed: no `document.cookie`, no `Set-Cookie` on the script response, the single
`localStorage` key is the `umami.disabled` opt-out flag rather than a visitor id, and
events post to `/api/send` on the same self-hosted origin. Re-check if the tracker is
ever swapped or upgraded.

## Accessibility baseline

Each page ships a skip link (`.skip-link` in `globals.css`) as the first focusable
element, targeting `<main id="main-content" tabindex="-1">`. Keep it first in the DOM,
ahead of the sticky nav.

## Metadata

`src/app/siteMeta.ts` holds the canonical origin, site name, and the fallback social
card. `layout.tsx` sets `metadataBase`, so every `canonical` and `og:image` below it can
be written as a root-relative path and still resolve to an absolute URL for scrapers.

`next.config.ts` sets `trailingSlash: true`, so canonicals must carry the trailing
slash — that is what `canonicalPath()` is for. A canonical without it points at a URL
that redirects.

Blog posts use their `cover_image` as the social card and fall back to
`public/og-default.png` when they do not have one. That fallback is generated from
`scripts/og-card.html` rather than hand-drawn, so it stays in step with the tokens
above; regeneration instructions are in a comment at the top of that file.
