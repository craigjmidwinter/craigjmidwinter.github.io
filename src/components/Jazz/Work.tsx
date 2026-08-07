"use client";

import styled, { css } from "styled-components";

type Motif = "tealCircle" | "purpleTriangle" | "yellowSquare" | "inkArch" | "inkCircle";

interface WorkItem {
    title: string;
    href: string;
    description: string;
    tags: string;
    motif: Motif;
    shadow: string;
}

const TEAL = "#00a7a0";
const PURPLE = "#8e3d94";
const YELLOW = "#e9e64a";
const INK = "#111";

const ITEMS: WorkItem[] = [
    {
        title: "Multicam Toolbox",
        href: "https://multicamtoolbox.com",
        description:
            "Commercial Premiere Pro extension that automates multicamera podcast editing. Whisper transcription, speaker diarization, and filler detection, all on-device through ONNX Runtime.",
        tags: "ONNX RUNTIME · WHISPER · PREMIERE",
        motif: "tealCircle",
        shadow: TEAL,
    },
    {
        title: "GetVect",
        href: "https://getvect.midwinter.io",
        description:
            "A local desktop vectorizer for macOS. Drop in a PNG, JPEG or BMP; get back SVG, EPS, DXF, PDF or PNG from an offline tracing engine. No account, no credits, offline by default.",
        tags: "ELECTRON · TYPESCRIPT · SVG",
        motif: "purpleTriangle",
        shadow: INK,
    },
    {
        title: "Ripline",
        href: "https://github.com/ripline-ai/ripline",
        description:
            "Open-source pipeline engine that makes multi-agent AI workflows repeatable. Typed contracts at every node boundary, resumable runs, and review phases where no single model's output is trusted unchecked.",
        tags: "TYPESCRIPT · NODE.JS · AGENTS",
        motif: "purpleTriangle",
        shadow: PURPLE,
    },
    {
        title: "Mail Muncher",
        href: "https://github.com/craigjmidwinter/mail-muncher",
        description:
            "An email client for AI agents. Gives a program its own read-only mailbox: filtered mail delivered to disk as .eml and markdown, served over MCP. Never writes to your mailbox.",
        tags: "GO · IMAP · MCP",
        motif: "yellowSquare",
        shadow: INK,
    },
    {
        title: "Goalfeed",
        href: "https://goalfeed.ca",
        description:
            "Realtime NHL & MLB goal events. Thousands of Home Assistant setups flash their lights off my feed.",
        tags: "GO · K8S · REDIS · POSTGRES",
        motif: "inkArch",
        shadow: TEAL,
    },
    {
        title: "Katra",
        href: "https://github.com/craigjmidwinter/katra",
        description:
            "A committed dev log your agents write as they build. Entries stamp themselves with the commit they describe, and a gate refuses any commit that has no entry.",
        tags: "GO · GIT · DEV LOG",
        motif: "tealCircle",
        shadow: INK,
    },
    {
        title: "total-connect-client",
        href: "https://github.com/craigjmidwinter/total-connect-client",
        description:
            "Python client for the Honeywell Total Connect alarm API. It became the library behind Home Assistant's Total Connect integration, now maintained by the community it attracted.",
        tags: "PYTHON · PYPI · HOME ASSISTANT",
        motif: "inkCircle",
        shadow: PURPLE,
    },
];

const Section = styled.section`
    padding: clamp(48px, 7vh, 86px) clamp(20px, 4vw, 56px);
    background: #fbfaf7;
    color: ${INK};
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 26px;
    gap: 20px;
    flex-wrap: wrap;
`;

const Heading = styled.h2`
    margin: 0;
    font: 700 clamp(30px, 4vw, 54px) / 1 "Space Grotesk", sans-serif;
    letter-spacing: -0.04em;
`;

const Count = styled.span`
    font: 500 10px / 1 "JetBrains Mono", monospace;
    letter-spacing: 0.14em;
    color: ${PURPLE};
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: clamp(14px, 2vw, 22px);
`;

const motifStyles: Record<Motif, ReturnType<typeof css>> = {
    tealCircle: css`
        background: ${TEAL};
        border-radius: 50%;
    `,
    purpleTriangle: css`
        background: ${PURPLE};
        clip-path: polygon(50% 0, 100% 100%, 0 100%);
    `,
    yellowSquare: css`
        background: ${YELLOW};
    `,
    inkArch: css`
        background: ${INK};
        border-radius: 44px 44px 0 0;
    `,
    inkCircle: css`
        background: ${INK};
        border-radius: 50%;
    `,
};

const Shape = styled.div<{ $motif: Motif }>`
    width: 44px;
    height: 44px;
    flex: none;
    ${({ $motif }) => motifStyles[$motif]}
`;

const Card = styled.a<{ $shadow: string }>`
    text-decoration: none;
    color: ${INK};
    background: #fbfaf7;
    border: 2px solid ${INK};
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 230px;
    justify-content: space-between;
    transition: transform 0.18s ease, box-shadow 0.18s ease;

    &:hover,
    &:focus-visible {
        color: ${INK};
        transform: translate(-3px, -3px);
        box-shadow: 10px 10px 0 ${({ $shadow }) => $shadow};
    }

    &:focus-visible {
        outline: 2px solid ${INK};
        outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

const CardTitle = styled.div`
    font: 700 24px / 1.1 "Space Grotesk", sans-serif;
    letter-spacing: -0.03em;
    margin-bottom: 6px;
`;

const CardText = styled.p`
    margin: 0;
    font: 400 13px / 1.5 "Space Grotesk", sans-serif;
    opacity: 0.75;
    text-wrap: pretty;
`;

const Tags = styled.span`
    font: 500 9.5px / 1 "JetBrains Mono", monospace;
    letter-spacing: 0.1em;
    opacity: 0.55;
`;

export function Work() {
    return (
        <Section id="work">
            <Header>
                <Heading>Selected work</Heading>
                <Count>07 THINGS I&apos;VE BUILT</Count>
            </Header>
            <Grid>
                {ITEMS.map((item) => (
                    <Card
                        key={item.title}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        $shadow={item.shadow}
                    >
                        <Shape $motif={item.motif} aria-hidden="true" />
                        <div>
                            <CardTitle>{item.title}</CardTitle>
                            <CardText>{item.description}</CardText>
                        </div>
                        <Tags>
                            {item.tags}
                            <span aria-hidden="true"> ↗</span>
                        </Tags>
                    </Card>
                ))}
            </Grid>
        </Section>
    );
}
