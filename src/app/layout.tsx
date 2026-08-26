// app/layout.tsx
import { ReactNode } from "react";
import { Metadata, Viewport } from "next";
import "./globals.css";
import StyledComponentsRegistry from "@/lib/registry";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "./siteMeta";

// Craig co-hosts and produces Oscars Outsider — he does not host it. This string is
// the site title description, the og:description and the twitter:description, so a
// role error here propagates into every shared link.
const DESCRIPTION =
    "Engineering leader who still ships code. Director of Engineering at Lyntris (formerly Hypergiant), builder of MLOps platforms and AI agent tooling, co-host and producer of the Oscars Outsider podcast.";

export const metadata: Metadata = {
  // Resolves every relative canonical/og:image below to an absolute URL, which
  // is what scrapers require.
  metadataBase: new URL(SITE_URL),
  title: "Craig Midwinter | Software Engineering Leader",
  description: DESCRIPTION,
  // next.config sets trailingSlash: true, so canonicals carry the slash the
  // server actually serves.
  alternates: { canonical: "/" },
  openGraph: {
    title: "Craig Midwinter | Software Engineering Leader",
    description: DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_CA",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Craig Midwinter | Software Engineering Leader",
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

/** Paper, matching the page background the design actually paints. */
export const viewport: Viewport = {
  themeColor: "#fbfaf7",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
      <html lang="en">
      <head>
        {/* Preconnect to Google Fonts and load the site typefaces */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
            href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap"
            rel="stylesheet"
        />
        <link rel="alternate" type="application/rss+xml" title="Craig Midwinter — Blog" href="/feed.xml" />
        {/*
          Self-hosted Umami. Cookieless, so it ships with the footer disclosure in
          Contact.tsx — the two are a pair, never one without the other.

          The website id is midwinter.io's alone; four sites are being tagged and
          the ids are not interchangeable, so do not copy this line to another repo.

          Deliberately a plain <script defer>, not next/script: an afterInteractive
          strategy can defer the tag past a bounce, and a bounce is exactly the
          visit worth counting.

          If this site ever gains a Content-Security-Policy, script-src AND
          connect-src both need umami.midwinter.dev or collection stops silently
          while everything still looks correct.
        */}
        <script
            defer
            src="https://umami.midwinter.dev/script.js"
            data-website-id="1715e340-329e-49d6-9737-cbfcb2b9d578"
        />
      </head>
      <body>
        {/* First focusable thing on the page, ahead of the sticky nav. */}
        <a className="skip-link" href="#main-content">Skip to content</a>
        <StyledComponentsRegistry>
          <div id="root">
            {children}
          </div>
        </StyledComponentsRegistry>
      </body>
      </html>
  );
}
