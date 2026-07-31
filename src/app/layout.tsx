// app/layout.tsx
import { ReactNode } from "react";
import { Metadata } from "next";
import "./globals.css";
import StyledComponentsRegistry from "@/lib/registry";

export const metadata: Metadata = {
  title: "Craig Midwinter | Software Engineering Leader",
  description:
      "Engineering leader who still ships code. Director of Engineering at Lyntris (formerly Hypergiant), builder of MLOps platforms and AI agent tooling, host of the Oscars Outsider podcast.",
  openGraph: {
    title: "Craig Midwinter | Software Engineering Leader",
    description:
        "Engineering leader who still ships code. Director of Engineering at Lyntris (formerly Hypergiant), builder of MLOps platforms and AI agent tooling, host of the Oscars Outsider podcast.",
    url: "https://midwinter.io",
    siteName: "Craig Midwinter",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Craig Midwinter | Software Engineering Leader",
    description:
        "Engineering leader who still ships code. Director of Engineering at Lyntris (formerly Hypergiant), builder of MLOps platforms and AI agent tooling, host of the Oscars Outsider podcast.",
  },
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
      </head>
      <body>
        <StyledComponentsRegistry>
          <div id="root">
            {children}
          </div>
        </StyledComponentsRegistry>
      </body>
      </html>
  );
}
