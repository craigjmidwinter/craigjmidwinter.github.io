"use client";

import React, {useEffect, useRef, useState} from "react";
import styled, {createGlobalStyle} from "styled-components";
import {Nav} from "@/components/Jazz/Nav";
import {Contact} from "@/components/Jazz/Contact";

/* Same palette as the blog. See README, "Colour pairings": teal is a fill only
   (shadows, marks); purple carries white text; text on paper is ink, muted ink
   or the darkened teal. */
const TEAL = "#00a7a0";
const TEAL_ON_PAPER = "#007570";
const PURPLE = "#8e3d94";
const YELLOW = "#e9e64a";
const INK = "#111";
const PAPER = "#fbfaf7";
const MUTED = "#444"; /* 9.7:1 on paper */

/** The nameplate tool is a separate GPL-3.0 program, shipped as static files in
 *  public/nameplate-tool/ (built from the commit in its BUILD-INFO.txt). */
const TOOL_BASE = "/nameplate-tool/";
const TOOL_COMMIT = "a2b3f9a98397267472e4a7dffa549a38002c5b4d";
/* TODO(Craig, before merge): confirm the public repo URL once it is pushed. */
const TOOL_SOURCE = `https://github.com/craigjmidwinter/nameplate-generator/tree/${TOOL_COMMIT}`;

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
    }

    html, body {
        overflow-x: clip;
        max-width: 100%;
    }

    body {
        margin: 0;
        background: ${PAPER};
        color: ${INK};
        font-family: 'Space Grotesk', sans-serif;
        -webkit-font-smoothing: antialiased;
    }

    a {
        color: ${INK};
    }

    a:hover {
        color: ${TEAL_ON_PAPER};
    }

    ::selection {
        background: ${YELLOW};
        color: ${INK};
    }

    :focus-visible {
        outline: 2px solid ${INK};
        outline-offset: 2px;
    }
`;

const Hero = styled.section`
    padding: clamp(40px, 7vh, 84px) clamp(20px, 4vw, 56px) clamp(24px, 4vh, 40px);
`;

const Eyebrow = styled.p`
    margin: 0 0 14px;
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.16em;
    color: ${PURPLE};
`;

const Headline = styled.h1`
    margin: 0;
    font: 700 clamp(40px, 7.6vw, 104px)/0.86 'Space Grotesk', sans-serif;
    letter-spacing: -0.05em;
    text-transform: uppercase;
`;

const Intro = styled.p`
    margin: clamp(22px, 3vh, 36px) 0 0;
    max-width: 60ch;
    font: 400 15px/1.6 'Space Grotesk', sans-serif;
    background: ${PAPER};
    border: 2px solid ${INK};
    padding: 16px 18px;
    box-shadow: 10px 10px 0 ${TEAL};
    text-wrap: pretty;
`;

const ToolSection = styled.section`
    padding: 0 clamp(20px, 4vw, 56px) clamp(24px, 4vh, 40px);
`;

/* Theme for the tool's own markup (.npg): it reads these custom properties. */
const ToolFrame = styled.div`
    border: 2px solid ${INK};
    box-shadow: 14px 14px 0 ${YELLOW};
    height: min(82vh, 780px);
    min-height: 560px;

    @media (max-width: 720px) {
        height: auto;
    }

    .npg {
        --npg-bg: ${PAPER};
        --npg-panel: ${PAPER};
        --npg-ink: ${INK};
        --npg-muted: ${MUTED};
        --npg-line: ${INK};
        --npg-accent: ${PURPLE};
        --npg-accent-ink: #fff;
        --npg-stage: #efece4;
        --npg-font: 'Space Grotesk', sans-serif;
        --npg-label-font: 'JetBrains Mono', monospace;
        --npg-radius: 0;
        --npg-border-width: 2px;
    }

    .npg h2 {
        font-size: 10px;
        font-weight: 500;
        letter-spacing: 0.16em;
        color: ${PURPLE};
    }

    .npg button {
        font: 500 10px/1 'JetBrains Mono', monospace;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        padding: 11px 14px;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .npg button:not(:disabled):hover,
    .npg button:not(:disabled):focus-visible {
        transform: translate(-2px, -2px);
        box-shadow: 4px 4px 0 ${INK};
    }

    .npg .npg-list button {
        padding: 6px 9px;
    }

    .npg :focus-visible {
        outline: 2px solid ${INK};
        outline-offset: 2px;
    }

    .npg a {
        color: ${INK};
        text-decoration: underline;
    }

    @media (prefers-reduced-motion: reduce) {
        .npg button {
            transition: none;
        }
    }
`;

const MountPoint = styled.div`
    height: 100%;
`;

const Fallback = styled.p`
    margin: 0;
    padding: 24px;
    font: 400 15px/1.6 'Space Grotesk', sans-serif;
`;

const Notes = styled.section`
    padding: clamp(20px, 3vh, 32px) clamp(20px, 4vw, 56px) clamp(40px, 6vh, 72px);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 24px;
    font: 400 14px/1.6 'Space Grotesk', sans-serif;

    h2 {
        margin: 0 0 8px;
        font: 500 10px/1 'JetBrains Mono', monospace;
        letter-spacing: 0.16em;
        color: ${PURPLE};
    }

    p {
        margin: 0;
        max-width: 52ch;
    }

    a {
        text-decoration: underline;
    }
`;

type MountFn = (el: HTMLElement, options: Record<string, unknown>) => { destroy(): void };

export default function ClientNameplate() {
    const root = useRef<HTMLDivElement>(null);
    const [state, setState] = useState<"loading" | "ready" | "failed">("loading");

    useEffect(() => {
        let tool: { destroy(): void } | null = null;
        let cancelled = false;
        // Plain static file, not part of the Next bundle (it is a separate GPL program).
        import(/* webpackIgnore: true */ /* turbopackIgnore: true */ `${TOOL_BASE}app/nameplate-tool.js`)
            .then((mod: { mountNameplateTool: MountFn }) => {
                if (cancelled || !root.current) return;
                tool = mod.mountNameplateTool(root.current, {
                    assetBase: TOOL_BASE,
                    colorScheme: "light",
                    persist: false,
                });
                setState("ready");
            })
            .catch(() => setState("failed"));
        return () => {
            cancelled = true;
            tool?.destroy();
        };
    }, []);

    return (
        <>
            <GlobalStyle/>
            <Nav page="nameplate"/>
            <main id="main-content" tabIndex={-1}>
                <Hero>
                    <Eyebrow>🏒 TOOL · 3D PRINTING</Eyebrow>
                    <Headline>Nameplates</Headline>
                    <Intro>
                        Type one name per line, pick a font (or use your own TTF or OTF), and download a
                        3MF with the base, letters and optional hockey stick as separate colours. It all
                        runs in your browser: names and font files never leave your computer.
                    </Intro>
                </Hero>
                <ToolSection aria-label="Nameplate tool">
                    <ToolFrame>
                        {state !== "ready" && (
                            <Fallback role="status">
                                {state === "failed"
                                    ? "The tool could not load. Reload the page to try again."
                                    : "Loading the nameplate tool…"}
                            </Fallback>
                        )}
                        {/* The tool owns this element's children; React never renders into it. */}
                        <MountPoint ref={root}/>
                    </ToolFrame>
                </ToolSection>
                <Notes>
                    <div>
                        <h2>ONE PIECE</h2>
                        <p>
                            Every plate prints as a single piece. Where letters stand apart (or a name
                            has a space), the tool adds a small joining bar to the base.
                        </p>
                    </div>
                    <div>
                        <h2>PRINTING</h2>
                        <p>
                            Open the 3MF in Bambu Studio or PrusaSlicer. Each plate imports as one
                            object with its parts ready to colour.
                        </p>
                    </div>
                    <div>
                        <h2>SOURCE</h2>
                        <p>
                            The tool is free software (GPL-3.0). <a href={TOOL_SOURCE}>Source code</a> ·{" "}
                            <a href={`${TOOL_BASE}BUILD-INFO.txt`}>build info</a> ·{" "}
                            <a href={`${TOOL_BASE}THIRD-PARTY-NOTICES.md`}>third-party notices</a> ·{" "}
                            <a href={`${TOOL_BASE}fonts/LICENSES.md`}>font licences</a>.
                        </p>
                    </div>
                </Notes>
            </main>
            <Contact variant="blog"/>
        </>
    );
}
