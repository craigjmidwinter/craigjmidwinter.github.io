// app/layout.tsx
import { ReactNode } from "react";

export const metadata = {
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
      <body>{children}</body>
      </html>
  );
}
