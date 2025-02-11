"use client";

import styled from "styled-components";
import {motion, useScroll, useTransform} from "framer-motion";
import React from "react";
import {generateZigZagPolygon} from "@/utils";
import {PlaylistItem} from "@/service/youtube/types";
import Image from "next/image";

/*
  PodcastContainer:
  - Fills the viewport (100vh) and becomes the stacking context.
  - No negative margin on the container so that it always spans full height.
*/
const PodcastContainer = styled(motion.div)`
    position: relative;
    height: 100vh;
    z-index: 2;
`;

/*
  PodcastBackground:
  - Absolutely positioned to fill the container.
  - Its top is offset by -5vh so that the zig-zag clip-path extends above the container,
    "peeking" over the previous section.
  - Adjust the value (-5vh) to make the peek subtler or more pronounced.
*/
const PodcastBackground = styled(motion.div)`
    position: absolute;
    top: -5vh;
    left: 0;
    width: 100%;
    height: calc(100% + 5vh);
    background: url("/80s/1980s Fashion Patterns_For The Articles.jpg") repeat center center;
    background-size: 100%;
    clip-path: ${generateZigZagPolygon(40, 1)};
    z-index: 1;
`;

/*
  PodcastTease:
  - Displays the section title ("Podcast") at the very top.
  - Fades out on scroll.
*/
const PodcastTease = styled(motion.div)`
    position: absolute;
    top: 0;
    width: 100%;
    text-align: center;
    font-size: 2rem;
    pointer-events: none;
    z-index: 2;
`;

/*
  PodcastContent:
  - The white card that holds your main content.
  - Absolutely centered in the container using top/left 50% and transform.
  - Has a higher z-index (3) so it appears above the background (and above the canvas if needed).
*/
const PodcastContent = styled(motion.div)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 900px;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 8px 8px 0 #000;
    z-index: 3;
`;

/* Inner layout for logo and episode grid */
const PodcastLayout = styled.div`
    display: flex;
    flex-direction: row;
    gap: 2rem;
    margin-top: 2rem;
    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const LogoContainer = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        max-width: 80%;
        height: auto;
        border: 2px solid #231f20;
        box-shadow: 4px 4px 0 #000;
    }
`;

const PodcastInfo = styled.div`
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #231f20;
    font-family: "Roboto", sans-serif;

    p {
        margin-bottom: 1.5rem;
        line-height: 1.5;
        font-size: 1.1rem;
    }
`;

const EpisodesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
`;

const EpisodeCard = styled.a`
    text-decoration: none;
    color: inherit;
    font-family: "Roboto", sans-serif;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    border-radius: 2px;
    overflow: hidden;
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transform: scale(1.02);
    }

    .thumbnail {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        background-color: #ddd;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
    }

    .episode-info {
        padding: 0.75rem;
        display: flex;
        flex-direction: column;

        .title {
            font-weight: 500;
            font-size: 1rem;
            color: #030303;
            margin-bottom: 0.25rem;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .meta {
            font-size: 0.875rem;
            color: #606060;
            line-height: 1.4;
            margin-bottom: 0.25rem;
        }
    }
`;

//
// ============================
//     COMPONENT
// ============================
interface PodcastProps {
    /**
     * We assume each `episodes[i].formattedPublishedDate` is generated
     * server-side (e.g. "1/21/2025"), so there’s no hydration mismatch.
     */
    episodes?: Array<PlaylistItem & { formattedPublishedDate?: string }>;
}

export function Podcast({episodes = []}: PodcastProps) {
    const {scrollYProgress} = useScroll();

    // Match the About section animation values:
    const teaseOpacity = useTransform(scrollYProgress, [0.3, 0.4], [1, 0]);
    const contentOpacity = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);
    const containerOffset = useTransform(scrollYProgress, [0, 0.5], ["-10vh", "0vh"]);

    return (
        <PodcastContainer style={{y: containerOffset}}>
            <PodcastBackground/>
            <PodcastTease style={{opacity: teaseOpacity}}>
                <h2>Podcast</h2>
            </PodcastTease>
            <PodcastContent style={{opacity: contentOpacity}}>
                <h2>Bravo Outsider Podcast</h2>
                <p>
                    I produce and host a podcast called <em>Bravo Outsider</em> where we
                    look at The Real Housewives and other Bravo reality TV shows from an
                    artistic lens.
                </p>
                <PodcastLayout>
                    <LogoContainer>
                        <Image src="/bravo-outsider.jpg" alt="Bravo Outsider Podcast Logo"/>
                    </LogoContainer>
                    <PodcastInfo>
                        <h4>Latest Episodes</h4>
                        <EpisodesGrid>
                            {episodes.map((episode) => {
                                const snippet = episode.snippet;
                                const thumbnailUrl = snippet?.thumbnails?.medium?.url || "";
                                const title = snippet?.title || "Episode";
                                const published = episode.formattedPublishedDate || "";
                                const youtubeLink = `https://www.youtube.com/watch?v=${snippet?.resourceId?.videoId}`;
                                return (
                                    <EpisodeCard
                                        key={episode.id}
                                        href={youtubeLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <div className="thumbnail">
                                            <Image src={thumbnailUrl} alt={title}/>
                                        </div>
                                        <div className="episode-info">
                                            <div className="title">{title}</div>
                                            <div className="meta">Published on {published}</div>
                                        </div>
                                    </EpisodeCard>
                                );
                            })}
                        </EpisodesGrid>
                    </PodcastInfo>
                </PodcastLayout>
            </PodcastContent>
        </PodcastContainer>
    );
}
