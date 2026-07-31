"use client";

import React from "react";
import styled from "styled-components";
import {PlaylistItem} from "@/service/youtube/types";

const Section = styled.section`
    position: relative;
    overflow: hidden;
    padding: clamp(48px, 7vh, 86px) clamp(20px, 4vw, 56px);
    background: #00a7a0;
    color: #fff;
`;

const Blob = styled.div`
    position: absolute;
    left: -30px;
    bottom: -50px;
    width: 200px;
    height: 200px;
    background: #8e3d94;
    border-radius: 50%;
    opacity: 0.65;
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
    background: #fff;
    color: #111;
    text-decoration: none;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover {
        color: #111;
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0 #111;
    }

    &:focus-visible {
        outline: 2px solid #111;
        outline-offset: 2px;
    }
`;

const Predecessor = styled.a`
    display: inline-block;
    margin: 14px 0 0 2px;
    font: 500 9.5px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.12em;
    color: #fff;
    opacity: 0.75;
    text-decoration: none;

    &:hover {
        color: #fff;
        opacity: 1;
        text-decoration: underline;
    }

    &:focus-visible {
        outline: 2px solid #111;
        outline-offset: 2px;
    }
`;

const Tiles = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
`;

const tileBase = `
    position: relative;
    display: block;
    aspect-ratio: 16 / 9;
    border: 2px solid #fff;
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
    color: #fff;
    text-shadow: 0 1px 4px rgba(17, 17, 17, 0.85);
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
                        I host a podcast exploring the art of cinema and the stories that
                        define the Academy Awards. Weekly awards-season analysis, plus an
                        Oscars fantasy league we take entirely too seriously.
                    </Blurb>
                    <ListenButton
                        href="https://oscarsoutsider.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        LISTEN / WATCH ↗
                    </ListenButton>
                    <Predecessor
                        href="https://bravooutsider.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        PREVIOUSLY: BRAVO OUTSIDER ↗
                    </Predecessor>
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
