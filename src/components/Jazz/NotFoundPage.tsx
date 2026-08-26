"use client";

import React from "react";
import Link from "next/link";
import styled, {createGlobalStyle} from "styled-components";
import {ANALYTICS_DISCLOSURE} from "./analyticsDisclosure";

/**
 * The Jazz "not found" shell, shared by two routes:
 *
 *  - `app/not-found.tsx` — exported to `dist/404/index.html`, which is the page
 *    GitHub Pages actually serves for any unrecognised URL. Without it Next ships
 *    its bare built-in 404, which is off-brand and forces its own colour scheme.
 *  - `app/blog/[slug]/not-found.tsx` — the in-route miss, with blog-specific copy.
 *
 * It carries the analytics disclosure itself because it renders no footer while
 * still inheriting the tracker from the root layout.
 */

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        background: #fbfaf7;
        color: #111;
        font-family: 'Space Grotesk', sans-serif;
        -webkit-font-smoothing: antialiased;
    }

    ::selection {
        background: #e9e64a;
        color: #111;
    }

    :focus-visible {
        outline: 2px solid #111;
        outline-offset: 2px;
    }
`;

const Container = styled.main`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 22px;
    background: #fbfaf7;
    color: #111;
    padding: clamp(40px, 8vh, 96px) clamp(20px, 4vw, 56px);
`;

const Eyebrow = styled.div`
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.16em;
    color: #8e3d94;
`;

const Heading = styled.h1`
    margin: 0;
    font: 700 clamp(40px, 8vw, 108px)/0.9 'Space Grotesk', sans-serif;
    letter-spacing: -0.05em;
    max-width: 12ch;
`;

const Message = styled.p`
    margin: 0;
    font: 400 12.5px/1.7 'JetBrains Mono', monospace;
    max-width: 48ch;
    opacity: 0.65;
`;

const BackLink = styled(Link)`
    display: inline-block;
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.12em;
    padding: 13px 17px;
    border: 2px solid #111;
    color: #111;
    text-decoration: none;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover {
        color: #111;
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0 #00a7a0;
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

/* Dimmed ink on paper: 0.65, not lower — below about 0.60 this drops under 4.5:1.
   See README, "Colour pairings". */
const AnalyticsNote = styled.div`
    margin-top: 8px;
    font: 500 9.5px/1.5 'JetBrains Mono', monospace;
    letter-spacing: 0.14em;
    opacity: 0.65;
    max-width: 80ch;
`;

interface NotFoundPageProps {
    eyebrow?: string;
    heading?: string;
    message: string;
    backHref: string;
    backLabel: string;
}

export function NotFoundPage({
    eyebrow = "404 · NOTHING AT THIS ADDRESS",
    heading = "NOT FILED HERE",
    message,
    backHref,
    backLabel,
}: NotFoundPageProps) {
    return (
        <>
            <GlobalStyle/>
            {/* The root layout's skip link targets #main-content on every page,
                including this one. */}
            <Container id="main-content" tabIndex={-1}>
                <Eyebrow>{eyebrow}</Eyebrow>
                <Heading>{heading}</Heading>
                <Message>{message}</Message>
                <BackLink href={backHref}>{backLabel}</BackLink>
                <AnalyticsNote>{ANALYTICS_DISCLOSURE}</AnalyticsNote>
            </Container>
        </>
    );
}
