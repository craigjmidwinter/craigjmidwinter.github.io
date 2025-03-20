// app/layout.tsx
import { ReactNode } from "react";
import { Metadata } from "next";
import "./globals.css";
import StyledComponentsRegistry from "@/lib/registry";

export const metadata: Metadata = {
  title: "Craig Midwinter - Personal Website",
  description:
      "Welcome to my personal website. Check out my resume, GitHub, LinkedIn, podcast, and blog posts.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
      <html lang="en">
      <head>
        {/* Preconnect to Google Fonts and load the retro font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
            href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
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
