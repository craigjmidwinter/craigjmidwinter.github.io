"use client";

import React from "react";
import styled from "styled-components";
import {PlaylistItem} from "@/service/youtube/types";

const Section = styled.section`
    position: relative;
    overflow: hidden;
    padding: clamp(48px, 7vh, 86px) clamp(20px, 4vw, 56px);
    background: #00a7a0;
    /* Ink, not white: white on this teal is 2.99:1, below the AA floor. Ink is 6.33:1. */
    color: #111;
`;

const Blob = styled.div`
    position: absolute;
    left: -30px;
    bottom: -50px;
    width: 200px;
    height: 200px;
    background: #8e3d94;
    border-radius: 50%;
    /* Ink copy can overlap this wash; 0.25 keeps the composite at 4.83:1 against ink.
       At the old 0.65 the blob rendered #5c6298 and dropped ink to 3.29:1. */
    opacity: 0.25;
    pointer-events: none;
`;

const Inner = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: clamp(22px, 3vw, 44px);
    align-items: center;
`;

const Eyebrow = styled.div`
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.16em;
    margin-bottom: 12px;
    opacity: 0.85;
`;

const Heading = styled.h2`
    margin: 0 0 14px;
    font: 700 clamp(30px, 4.4vw, 58px)/0.98 'Space Grotesk', sans-serif;
    letter-spacing: -0.04em;
`;

const Blurb = styled.p`
    margin: 0 0 18px;
    font: 400 15px/1.6 'Space Grotesk', sans-serif;
    max-width: 40ch;
    text-wrap: pretty;
`;

const ListenButton = styled.a`
    display: inline-block;
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.12em;
    padding: 13px 17px;
    background: #111;
    color: #fbfaf7;
    text-decoration: none;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover {
        color: #fbfaf7;
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0 #fbfaf7;
    }

    &:focus-visible {
        outline: 2px solid #111;
        outline-offset: 2px;
    }
`;

/* The "PREVIOUSLY: BRAVO OUTSIDER" footnote that used to sit here has been promoted
   into its own band — see Jazz/BravoOutsider.tsx, rendered directly below this
   section. Do not re-add it here; one mention is enough. */

const Tiles = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
`;

const tileBase = `
    position: relative;
    display: block;
    aspect-ratio: 16 / 9;
    border: 2px solid #111;
    overflow: hidden;
`;

const Tile = styled.a`
    ${tileBase};
    color: #fff;
    text-decoration: none;
    background: rgba(17, 17, 17, 0.25);
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover {
        color: #fff;
        transform: translate(-3px, -3px);
        box-shadow: 8px 8px 0 #111;
    }

    &:focus-visible {
        outline: 2px solid #111;
        outline-offset: 2px;
    }
`;

const PlaceholderTile = styled.div`
    ${tileBase};
    background: repeating-linear-gradient(135deg, #14938e 0 8px, #1aa39d 8px 16px);
`;

const Thumb = styled.img`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
`;

const TileLabel = styled.span`
    position: absolute;
    left: 9px;
    bottom: 8px;
    z-index: 1;
    font: 500 9.5px/1.2 'JetBrains Mono', monospace;
    letter-spacing: 0.12em;
    /* A solid ink chip rather than a text-shadow: the label sits over arbitrary
       thumbnails and over the teal placeholder stripes, where white measured
       2.97:1. Paper on ink is 18.09:1 regardless of what is behind it. */
    background: #111;
    color: #fbfaf7;
    padding: 4px 6px;
`;

const VisuallyHidden = styled.span`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
`;

const TILE_LABELS = ["LATEST EPISODE", "PREVIOUS"];

function thumbnailUrl(episode: PlaylistItem): string {
    const thumbnails = episode.snippet?.thumbnails ?? {};
    const preferred = ["maxres", "standard", "high", "medium", "default"];
    for (const size of preferred) {
        const url = thumbnails[size]?.url;
        if (url) return url;
    }
    return "";
}

export function Podcast({episodes}: { episodes: PlaylistItem[] }) {
    const featured = (episodes ?? []).slice(0, 2);

    return (
        <Section id="pod">
            <Blob aria-hidden="true"/>
            <Inner>
                <div>
                    <Eyebrow>SIDE PROJECT, LOUDEST ONE</Eyebrow>
                    <Heading>Oscars<br/>Outsider</Heading>
                    <Blurb>
                        I co-host and produce a podcast exploring the art of cinema and the
                        stories that define the Academy Awards. Weekly awards-season analysis,
                        plus an Oscars fantasy league we take entirely too seriously.
                    </Blurb>
                    <ListenButton
                        href="https://oscarsoutsider.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        LISTEN / WATCH ↗
                    </ListenButton>
                </div>

                <Tiles>
                    {TILE_LABELS.map((label, index) => {
                        const episode = featured[index];
                        if (!episode) {
                            return <PlaceholderTile key={label} aria-hidden="true"><TileLabel>{label}</TileLabel></PlaceholderTile>;
                        }

                        const title = episode.snippet?.title || "Oscars Outsider episode";
                        const videoId =
                            episode.snippet?.resourceId?.videoId || episode.contentDetails?.videoId;
                        const src = thumbnailUrl(episode);

                        return (
                            <Tile
                                key={episode.id || videoId || label}
                                href={`https://www.youtube.com/watch?v=${videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {src ? <Thumb src={src} alt="" aria-hidden="true"/> : null}
                                <TileLabel>{label}</TileLabel>
                                <VisuallyHidden>{title}</VisuallyHidden>
                            </Tile>
                        );
                    })}
                </Tiles>
            </Inner>
        </Section>
    );
}
