import React from "react";
import styled from "styled-components";
import {MARK_CLIP, marks} from "./marks";
import {ANALYTICS_DISCLOSURE} from "./analyticsDisclosure";

const Section = styled.footer`
    position: relative;
    overflow: hidden;
    background: #8e3d94;
    color: #fff;
    padding: clamp(48px, 8vh, 96px) clamp(20px, 4vw, 56px);
`;

const Confetti = styled.div`
    position: absolute;
    clip-path: ${MARK_CLIP};
    opacity: 0.85;
`;

const Inner = styled.div`
    position: relative;
`;

const Eyebrow = styled.div`
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.16em;
    margin-bottom: 14px;
    opacity: 0.85;
`;

const Email = styled.a`
    display: inline-block;
    font: 700 clamp(22px, 4.6vw, 64px)/1 'Space Grotesk', sans-serif;
    letter-spacing: -0.04em;
    color: #fff;
    text-decoration: none;
    word-break: break-word;

    &:hover {
        color: #e9e64a;
    }

    &:focus-visible {
        outline: 2px solid #fff;
        outline-offset: 2px;
    }
`;

const Links = styled.div`
    display: flex;
    gap: 18px;
    flex-wrap: wrap;
    margin-top: 30px;
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.12em;
`;

const FooterLink = styled.a`
    color: #fff;
    text-decoration: none;

    &:hover {
        color: #e9e64a;
    }

    &:focus-visible {
        outline: 2px solid #fff;
        outline-offset: 2px;
    }
`;

const Colophon = styled.div`
    margin-top: 36px;
    font: 500 9.5px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.14em;
    /* 0.8, not 0.65: dimmed white on the purple footer needs 0.8 to clear 4.5:1. */
    opacity: 0.8;
`;

/* Discloses the self-hosted Umami tag added in layout.tsx. The tracker and this
   line are a pair: if the tag is ever removed, remove this; if it is ever moved to
   another site, that site needs its own disclosure. Do not ship one without the
   other. The 404 page carries the same string via analyticsDisclosure.ts, since it
   renders no footer but still inherits the tag from the root layout. */
const AnalyticsNote = styled.div`
    margin-top: 10px;
    font: 500 9.5px/1.5 'JetBrains Mono', monospace;
    letter-spacing: 0.14em;
    /* Matches Colophon: 0.8 is the floor for white on this purple. */
    opacity: 0.8;
    max-width: 80ch;
`;

interface FooterLinkItem {
    href: string;
    label: string;
    /** Off-site links open in a new tab; in-site ones (the feed) stay put. */
    external: boolean;
}

const LINKS: FooterLinkItem[] = [
    {href: "https://github.com/craigjmidwinter", label: "GITHUB ↗", external: true},
    {
        href: "https://www.linkedin.com/in/craig-midwinter-b26193155/",
        label: "LINKEDIN ↗",
        external: true,
    },
    {href: "https://oscarsoutsider.com/", label: "PODCAST ↗", external: true},
    {href: "/resume.pdf", label: "RÉSUMÉ ↗", external: true},
];

/** Blog footer: the résumé slot becomes the RSS feed. */
const BLOG_LINKS: FooterLinkItem[] = [
    {href: "https://github.com/craigjmidwinter", label: "GITHUB ↗", external: true},
    {
        href: "https://www.linkedin.com/in/craig-midwinter-b26193155/",
        label: "LINKEDIN ↗",
        external: true,
    },
    {href: "https://oscarsoutsider.com/", label: "PODCAST ↗", external: true},
    {href: "/feed.xml", label: "RSS ↗", external: false},
];

const FOOTER_MARKS = marks(19, 13, [70, 46]);

export function Contact({variant = "home"}: { variant?: "home" | "blog" } = {}) {
    const isBlog = variant === "blog";
    const links = isBlog ? BLOG_LINKS : LINKS;

    return (
        <Section id="contact">
            {!isBlog &&
                FOOTER_MARKS.map((m, i) => (
                    <Confetti
                        key={i}
                        aria-hidden="true"
                        style={{
                            left: m.left,
                            top: m.top,
                            width: m.w,
                            height: m.h,
                            background: m.bg,
                            transform: m.tf,
                        }}
                    />
                ))}

            <Inner>
                <Eyebrow>📫 HOW TO REACH ME</Eyebrow>
                <Email href="mailto:craig.j.midwinter@gmail.com">
                    craig.j.midwinter@gmail.com
                </Email>
                <Links>
                    {links.map((l) => (
                        <FooterLink
                            key={l.href}
                            href={l.href}
                            target={l.external ? "_blank" : undefined}
                            rel={l.external ? "noopener noreferrer" : undefined}
                        >
                            {l.label}
                        </FooterLink>
                    ))}
                </Links>
                <Colophon>WINNIPEG, MB · 49.895°N 97.138°W · MMXXVI</Colophon>
                <AnalyticsNote>{ANALYTICS_DISCLOSURE}</AnalyticsNote>
            </Inner>
        </Section>
    );
}
