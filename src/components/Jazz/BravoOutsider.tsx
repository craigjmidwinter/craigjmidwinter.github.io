"use client";

import React from "react";
import styled from "styled-components";

/**
 * The predecessor podcast, promoted out of the one-line footnote it used to be
 * under the Oscars Outsider blurb.
 *
 * Deliberately sized as a lesser sibling of the podcast block above it, not a peer:
 * paper ground rather than a teal fill, a heading roughly half the size, and no
 * episode tiles. It should read as "and there was one before this", not as a second
 * podcast section — this is a personal site, not a project index.
 */

const Section = styled.section`
    border-top: 2px solid #111;
    background: #fbfaf7;
    padding: clamp(28px, 4.5vh, 48px) clamp(20px, 4vw, 56px);
`;

const Inner = styled.div`
    display: flex;
    align-items: center;
    gap: clamp(18px, 3vw, 34px);
    flex-wrap: wrap;
`;

/* The logo tile borrows the Hero portrait's idiom — hard border, offset shadow —
   at a much smaller size so it reads as a footnote's worth of weight. */
const Cover = styled.a`
    flex: none;
    display: block;
    width: 96px;
    height: 96px;
    border: 2px solid #111;
    box-shadow: 7px 7px 0 #8e3d94;
    overflow: hidden;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover,
    &:focus-visible {
        transform: translate(-2px, -2px);
        box-shadow: 10px 10px 0 #8e3d94;
    }

    &:focus-visible {
        outline: 2px solid #111;
        outline-offset: 3px;
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;

        &:hover {
            transform: none;
        }
    }
`;

const CoverImage = styled.img`
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const Body = styled.div`
    min-width: 240px;
    flex: 1 1 320px;
`;

const Eyebrow = styled.div`
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.16em;
    /* Purple on paper is 6.20:1; the same pairing the hero eyebrow uses. */
    color: #8e3d94;
    margin-bottom: 9px;
`;

/* Half the podcast heading's clamp, so the hierarchy is unmistakable. */
const Heading = styled.h2`
    margin: 0 0 8px;
    font: 700 clamp(20px, 2.4vw, 28px)/1.05 'Space Grotesk', sans-serif;
    letter-spacing: -0.03em;
`;

const Blurb = styled.p`
    margin: 0 0 14px;
    font: 400 14px/1.55 'Space Grotesk', sans-serif;
    max-width: 54ch;
    text-wrap: pretty;
`;

const VisitLink = styled.a`
    display: inline-block;
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.12em;
    padding: 11px 14px;
    border: 2px solid #111;
    color: #111;
    text-decoration: none;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover,
    &:focus-visible {
        color: #111;
        transform: translate(-2px, -2px);
        box-shadow: 5px 5px 0 #8e3d94;
    }

    &:focus-visible {
        outline: 2px solid #111;
        outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;

        &:hover {
            transform: none;
        }
    }
`;

const HREF = "https://bravooutsider.com/";

export function BravoOutsider() {
    return (
        <Section id="bravo" aria-labelledby="bravo-heading">
            <Inner>
                <Cover
                    href={HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={-1}
                    aria-hidden="true"
                >
                    <CoverImage src="/bravo-outsider.jpg" alt="" width={800} height={800}/>
                </Cover>
                <Body>
                    <Eyebrow>BEFORE THAT</Eyebrow>
                    <Heading id="bravo-heading">Bravo Outsider</Heading>
                    {/* Past tense, and "hosted": this is the show Craig hosted, unlike
                        Oscars Outsider, which he co-hosts and produces. The tense is
                        load-bearing — it is what keeps this from reading as a second
                        current show. */}
                    <Blurb>
                        The video podcast I hosted before Oscars Outsider, pointed at
                        Bravo&apos;s reality slate instead of the Academy&apos;s. The back
                        catalogue is still online — including the episodes I rebuilt as VR
                        scenes.
                    </Blurb>
                    <VisitLink href={HREF} target="_blank" rel="noopener noreferrer">
                        BRAVO OUTSIDER ↗
                    </VisitLink>
                </Body>
            </Inner>
        </Section>
    );
}
