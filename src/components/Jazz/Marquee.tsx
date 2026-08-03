import React from "react";
import styled, {css} from "styled-components";

const Band = styled.div<{ $bordered?: boolean }>`
    overflow: hidden;
    background: #111;
    color: #fbfaf7;
    border-top: 2px solid #111;

    ${({$bordered}) =>
        $bordered &&
        css`
            border-bottom: 2px solid #111;
        `}
`;

const Track = styled.div<{ $duration: number }>`
    display: flex;
    width: max-content;
    animation: jzmarq ${({$duration}) => $duration}s linear infinite;
    font: 700 clamp(15px, 1.6vw, 22px)/1 'Space Grotesk', sans-serif;
    padding: 12px 0;
    will-change: transform;

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

const Run = styled.span`
    white-space: nowrap;
`;

const ITEMS = [
    "MULTICAM TOOLBOX",
    "RIPLINE",
    "MAIL MUNCHER",
    "KATRA",
    "GOALFEED",
    "OSCARS OUTSIDER",
    "HOME ASSISTANT",
    "TOTALCONNECT",
];

// Non-breaking spaces so the separator never collapses at the span seam —
// both halves of the loop must measure identically for the -50% loop to be seamless.
const SEPARATOR = " — ";

function toSequence(items: string[]): string {
    return items.map((item) => `${item}${SEPARATOR}`).join("");
}

export interface MarqueeProps {
    /** Words to scroll. Defaults to the landing page list. */
    items?: string[];
    /** Loop duration in seconds. Defaults to the landing page 26s. */
    duration?: number;
    /** Adds the blog comp's 2px ink bottom border (the band is top-bordered either way). */
    bordered?: boolean;
}

export function Marquee({items = ITEMS, duration = 26, bordered = false}: MarqueeProps = {}) {
    const sequence = toSequence(items);

    return (
        <Band $bordered={bordered}>
            <Track $duration={duration}>
                <Run>{sequence}</Run>
                <Run aria-hidden="true">{sequence}</Run>
            </Track>
        </Band>
    );
}
