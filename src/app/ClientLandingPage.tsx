"use client";

import React from "react";
import {createGlobalStyle} from "styled-components";
import {PlaylistItem} from "@/service/youtube/types";
import {Post} from "@/service/blog";
import {Nav} from "@/components/Jazz/Nav";
import {Hero} from "@/components/Jazz/Hero";
import {Marquee} from "@/components/Jazz/Marquee";
import {Work} from "@/components/Jazz/Work";
import {About} from "@/components/Jazz/About";
import {Podcast} from "@/components/Jazz/Podcast";
import {BravoOutsider} from "@/components/Jazz/BravoOutsider";
import {Archive} from "@/components/Jazz/Archive";
import {Contact} from "@/components/Jazz/Contact";

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
    }

    html, body {
        /* clip (not hidden) so the sticky nav keeps working */
        overflow-x: clip;
        max-width: 100%;
    }

    body {
        margin: 0;
        background: #fbfaf7;
        color: #111;
        font-family: 'Space Grotesk', sans-serif;
        -webkit-font-smoothing: antialiased;
    }

    a {
        color: #111;
    }

    /* #007570, not the #00a7a0 fill teal: on paper the fill teal is only 2.86:1. */
    a:hover {
        color: #007570;
    }

    ::selection {
        background: #e9e64a;
        color: #111;
    }

    :focus-visible {
        outline: 2px solid #111;
        outline-offset: 2px;
    }

    @keyframes jzmarq {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(-50%);
        }
    }

    @keyframes jzdrift {
        0%, 100% {
            transform: translateY(0) rotate(var(--r, 0deg));
        }
        50% {
            transform: translateY(-10px) rotate(calc(var(--r, 0deg) + 8deg));
        }
    }
`;

interface ClientLandingProps {
    episodes: PlaylistItem[];
    posts: Post[];
}

export default function ClientLanding({episodes, posts}: ClientLandingProps) {
    return (
        <>
            <GlobalStyle />
            <Nav />
            <main id="main-content" tabIndex={-1}>
                <Hero />
                <Marquee />
                <Work />
                <About />
                <Podcast episodes={episodes} />
                <BravoOutsider />
                <Archive posts={posts} />
            </main>
            <Contact />
        </>
    );
}
