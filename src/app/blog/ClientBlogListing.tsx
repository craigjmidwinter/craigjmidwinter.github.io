"use client";

import React, {useMemo, useState} from "react";
import Link from "next/link";
import styled, {createGlobalStyle} from "styled-components";
import {Nav} from "@/components/Jazz/Nav";
import {Marquee} from "@/components/Jazz/Marquee";
import {Contact} from "@/components/Jazz/Contact";
import {MARK_CLIP, marks} from "@/components/Jazz/marks";
import {excerpt, formatPostDate, postMeta, postTags} from "@/components/Jazz/postMeta";
import {Post} from "@/service/blog";

const TEAL = "#00a7a0";
/* Teal text on paper: the fill teal above is only 2.86:1 there, so links use this
   darkened same-hue variant (5.32:1). See README, "Colour pairings". */
const TEAL_ON_PAPER = "#007570";
const PURPLE = "#8e3d94";
const YELLOW = "#e9e64a";
const INK = "#111";
const PAPER = "#fbfaf7";

/**
 * The blog owns its own global styles: the landing page's GlobalStyle only
 * mounts on `/`, and the jzmarq / jzdrift keyframes have to exist here too.
 */
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

/* ---------------------------------------------------------------- hero -- */

const HeroSection = styled.section`
    position: relative;
    overflow: hidden;
    background: ${PAPER};
    padding-bottom: clamp(24px, 4vh, 48px);
`;

const Slab = styled.div`
    position: absolute;
    left: -10%;
    top: -26%;
    width: 130%;
    height: 66%;
    background: ${INK};
    transform: rotate(-9deg);
    transform-origin: left bottom;
`;

const Confetti = styled.div`
    position: absolute;
    clip-path: ${MARK_CLIP};
    animation: jzdrift 11s ease-in-out infinite;
    will-change: transform;

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

const HeadlineWrap = styled.div`
    position: relative;
    padding: clamp(40px, 7vh, 84px) clamp(20px, 4vw, 56px) 0;
    mix-blend-mode: difference;
    color: #fff;
    pointer-events: none;
`;

const Headline = styled.h1`
    margin: 0;
    font: 700 clamp(40px, 7.6vw, 104px)/0.86 'Space Grotesk', sans-serif;
    letter-spacing: -0.05em;
    text-transform: uppercase;
`;

const HeroRow = styled.div`
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    padding: clamp(26px, 4vh, 52px) clamp(20px, 4vw, 56px) 0;
`;

const Intro = styled.p`
    margin: 0;
    max-width: 52ch;
    font: 400 15px/1.6 'Space Grotesk', sans-serif;
    background: ${PAPER};
    padding: 16px 18px;
    box-shadow: 10px 10px 0 ${TEAL};
    text-wrap: pretty;
`;

const HeroButtons = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
`;

const buttonBase = `
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.12em;
    padding: 12px 15px;
    text-decoration: none;
    border: 2px solid transparent;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

const RssButton = styled.a`
    ${buttonBase}
    background: ${PURPLE};
    color: #fff;

    &:hover,
    &:focus-visible {
        color: #fff;
        transform: translate(-2px, -2px);
        box-shadow: 4px 4px 0 ${INK};
    }
`;

const BackButton = styled(Link)`
    ${buttonBase}
    border-color: ${INK};
    color: ${INK};

    &:hover,
    &:focus-visible {
        color: ${INK};
        transform: translate(-2px, -2px);
        box-shadow: 4px 4px 0 ${INK};
    }
`;

/* -------------------------------------------------------------- filter -- */

const FilterSection = styled.section`
    padding: clamp(34px, 5vh, 60px) clamp(20px, 4vw, 56px) 0;
`;

const FilterRow = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
`;

const FilterLabel = styled.span`
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.16em;
    color: ${PURPLE};
    margin-right: 6px;
`;

const Chip = styled.button<{ $active: boolean }>`
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.12em;
    padding: 11px 14px;
    border: 2px solid ${INK};
    background: ${({$active}) => ($active ? INK : "transparent")};
    color: ${({$active}) => ($active ? PAPER : INK)};
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover {
        transform: translate(-2px, -2px);
        box-shadow: 5px 5px 0 ${TEAL};
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

/* ------------------------------------------------------------ featured -- */

const FeaturedSection = styled.section`
    padding: clamp(24px, 4vh, 40px) clamp(20px, 4vw, 56px) clamp(20px, 3vh, 32px);
`;

const FeaturedCard = styled(Link)`
    text-decoration: none;
    color: ${INK};
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    border: 2px solid ${INK};
    background: ${PAPER};
    transition: transform 0.18s ease, box-shadow 0.18s ease;

    &:hover,
    &:focus-visible {
        color: ${INK};
        transform: translate(-4px, -4px);
        box-shadow: 14px 14px 0 ${YELLOW};
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

const FeaturedMedia = styled.div`
    background: repeating-linear-gradient(135deg, #e3ded3 0 9px, #efeae0 9px 18px);
    min-height: 250px;
    display: flex;
    align-items: flex-end;
    padding: 12px;

    @media (min-width: 620px) {
        border-right: 2px solid ${INK};
    }
`;

const FeaturedImage = styled.img`
    display: block;
    width: 100%;
    height: 100%;
    min-height: 250px;
    object-fit: cover;

    @media (min-width: 620px) {
        border-right: 2px solid ${INK};
    }
`;

const PlaceholderLabel = styled.span`
    font: 500 9px/1.4 'JetBrains Mono', monospace;
    opacity: 0.6;
`;

const FeaturedBody = styled.div`
    padding: clamp(20px, 3vw, 32px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 16px;
`;

const FeaturedMetaRow = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.14em;
`;

const FeaturedFlag = styled.span`
    background: ${YELLOW};
    padding: 6px 8px;
`;

/* 0.65, not 0.5/0.55: dimmed ink on paper drops under 4.5:1 below about 0.60. */
const FeaturedDate = styled.span`
    opacity: 0.65;
`;

const FeaturedTitle = styled.h2`
    margin: 0 0 12px;
    font: 700 clamp(24px, 3.4vw, 42px)/1.06 'Space Grotesk', sans-serif;
    letter-spacing: -0.04em;
    text-wrap: pretty;
`;

const FeaturedExcerpt = styled.p`
    margin: 0;
    font: 400 14.5px/1.6 'Space Grotesk', sans-serif;
    opacity: 0.75;
    max-width: 48ch;
    text-wrap: pretty;
`;

const FeaturedFoot = styled.span`
    font: 500 9.5px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.1em;
    opacity: 0.65;
`;

/* ---------------------------------------------------------------- grid -- */

const GridSection = styled.section`
    padding: 0 clamp(20px, 4vw, 56px) clamp(48px, 7vh, 86px);
`;

const GridHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 20px;
`;

const GridHeading = styled.h2`
    margin: 0;
    font: 700 clamp(26px, 3.4vw, 44px)/1 'Space Grotesk', sans-serif;
    letter-spacing: -0.04em;
`;

const GridCount = styled.span`
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.14em;
    color: ${PURPLE};
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
    gap: clamp(14px, 2vw, 22px);
`;

const Card = styled(Link)`
    text-decoration: none;
    color: ${INK};
    border: 2px solid ${INK};
    background: ${PAPER};
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 14px;
    min-height: 250px;
    transition: transform 0.18s ease, box-shadow 0.18s ease;

    &:hover,
    &:focus-visible {
        color: ${INK};
        transform: translate(-3px, -3px);
        box-shadow: 10px 10px 0 ${TEAL};
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

const Shape = styled.div<{ $accent: string; $clip: string }>`
    width: 44px;
    height: 44px;
    flex: none;
    background: ${({$accent}) => $accent};
    clip-path: ${({$clip}) => $clip};
`;

const CardDate = styled.div`
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.14em;
    opacity: 0.65;
    margin-bottom: 9px;
`;

const CardTitle = styled.h3`
    margin: 0 0 8px;
    font: 700 21px/1.18 'Space Grotesk', sans-serif;
    letter-spacing: -0.03em;
    text-wrap: pretty;
`;

const CardExcerpt = styled.p`
    margin: 0;
    font: 400 13px/1.5 'Space Grotesk', sans-serif;
    opacity: 0.7;
    text-wrap: pretty;
`;

const CardFoot = styled.span`
    font: 500 9.5px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.1em;
    opacity: 0.65;
`;

const EmptyNote = styled.p`
    margin: 0;
    font: 500 11px/1.6 'JetBrains Mono', monospace;
    letter-spacing: 0.14em;
    opacity: 0.65;
`;

/* --------------------------------------------------------------- data --- */

const MARQUEE_ITEMS = [
    "HOME ASSISTANT",
    "HUE",
    "RASPBERRY PI",
    "YAML AT MIDNIGHT",
    "MQTT",
    "CAT LITTER TELEMETRY",
    "GOAL LIGHTS",
];

const HERO_MARKS = marks(7, 16, [72, 54]);

const ACCENTS = [TEAL, PURPLE, YELLOW, INK];

const SHAPES = [
    "circle(50% at 50% 50%)",
    "polygon(50% 0, 100% 100%, 0 100%)",
    "none",
    "polygon(0 100%, 100% 0, 100% 100%)",
    "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)",
];

const FEATURED_SLUG_MATCH = "i-hired-a-dude-who-voices-nike-commercials";

const ALL = "ALL";

const INTRO_COPY =
    "Notes on making computers do the work: AI development workflows lately, and " +
    "before that, the years I wired up my house. Home Assistant, Hue, agent " +
    "pipelines, and one voice actor who reads my cat's litter box.";

/** Tags that show up on at least two posts, uppercased, in first-seen order. */
function filterTags(posts: Post[]): string[] {
    const counts = new Map<string, number>();
    posts.forEach((post) => {
        postTags(post).forEach((tag) => {
            counts.set(tag, (counts.get(tag) ?? 0) + 1);
        });
    });
    return Array.from(counts.entries())
        .filter(([, count]) => count >= 2)
        .map(([tag]) => tag);
}

export default function ClientBlogListing({posts}: { posts: Post[] }) {
    const all = useMemo(() => posts ?? [], [posts]);
    const [activeTag, setActiveTag] = useState<string>(ALL);

    const tags = useMemo(() => filterTags(all), [all]);

    const featured = useMemo(
        () => all.find((p) => p.slug.includes(FEATURED_SLUG_MATCH)) ?? all[0],
        [all]
    );

    const filtered = useMemo(
        () =>
            activeTag === ALL
                ? all
                : all.filter((post) => postTags(post).includes(activeTag)),
        [all, activeTag]
    );

    const rest = useMemo(
        () => filtered.filter((post) => !featured || post.slug !== featured.slug),
        [filtered, featured]
    );

    return (
        <>
            <GlobalStyle />
            <Nav page="blog" />

            <main id="main-content" tabIndex={-1}>
                <HeroSection>
                    <Slab aria-hidden="true" />

                    {HERO_MARKS.map((m, i) => (
                        <Confetti
                            key={i}
                            aria-hidden="true"
                            style={
                                {
                                    left: m.left,
                                    top: m.top,
                                    width: m.w,
                                    height: m.h,
                                    background: m.bg,
                                    transform: m.tf,
                                    animationDelay: m.delay,
                                    "--r": m.rot,
                                } as React.CSSProperties
                            }
                        />
                    ))}

                    <HeadlineWrap>
                        <Headline>
                            Making
                            <br />
                            computers
                            <br />
                            do the work
                        </Headline>
                    </HeadlineWrap>

                    <HeroRow>
                        <Intro>{INTRO_COPY}</Intro>
                        <HeroButtons>
                            <RssButton href="/feed.xml">RSS ↗</RssButton>
                            <BackButton href="/">← BACK TO WORK</BackButton>
                        </HeroButtons>
                    </HeroRow>
                </HeroSection>

                <Marquee items={MARQUEE_ITEMS} duration={30} bordered />

                {tags.length > 0 && (
                    <FilterSection aria-label="Filter posts by tag">
                        <FilterRow>
                            <FilterLabel>FILTER</FilterLabel>
                            {[ALL, ...tags].map((tag) => (
                                <Chip
                                    key={tag}
                                    type="button"
                                    $active={activeTag === tag}
                                    aria-pressed={activeTag === tag}
                                    onClick={() => setActiveTag(tag)}
                                >
                                    {tag}
                                </Chip>
                            ))}
                        </FilterRow>
                    </FilterSection>
                )}

                {featured && (
                    <FeaturedSection>
                        <FeaturedCard href={`/blog/${featured.slug}`}>
                            {featured.cover_image ? (
                                <FeaturedImage src={featured.cover_image} alt="" />
                            ) : (
                                <FeaturedMedia aria-hidden="true">
                                    <PlaceholderLabel>LEAD IMAGE</PlaceholderLabel>
                                </FeaturedMedia>
                            )}
                            <FeaturedBody>
                                <FeaturedMetaRow>
                                    <FeaturedFlag>MOST READ</FeaturedFlag>
                                    <FeaturedDate>{formatPostDate(featured)}</FeaturedDate>
                                </FeaturedMetaRow>
                                <div>
                                    <FeaturedTitle>{featured.title}</FeaturedTitle>
                                    <FeaturedExcerpt>{excerpt(featured, 180)}</FeaturedExcerpt>
                                </div>
                                <FeaturedFoot>
                                    {postMeta(featured)}
                                    <span aria-hidden="true"> →</span>
                                </FeaturedFoot>
                            </FeaturedBody>
                        </FeaturedCard>
                    </FeaturedSection>
                )}

                <GridSection>
                    <GridHeader>
                        <GridHeading>Everything else</GridHeading>
                        <GridCount>
                            {String(rest.length).padStart(2, "0")}{" "}
                            {rest.length === 1 ? "POST" : "POSTS"}
                        </GridCount>
                    </GridHeader>

                    {rest.length > 0 ? (
                        <Grid>
                            {rest.map((post, i) => (
                                <Card key={post.slug} href={`/blog/${post.slug}`}>
                                    <Shape
                                        aria-hidden="true"
                                        $accent={ACCENTS[i % ACCENTS.length]}
                                        $clip={SHAPES[i % SHAPES.length]}
                                    />
                                    <div>
                                        <CardDate>{formatPostDate(post)}</CardDate>
                                        <CardTitle>{post.title}</CardTitle>
                                        <CardExcerpt>{excerpt(post, 120)}</CardExcerpt>
                                    </div>
                                    <CardFoot>
                                        {postMeta(post)}
                                        <span aria-hidden="true"> →</span>
                                    </CardFoot>
                                </Card>
                            ))}
                        </Grid>
                    ) : (
                        <EmptyNote>NOTHING FILED HERE YET</EmptyNote>
                    )}
                </GridSection>
            </main>

            <Contact variant="blog" />
        </>
    );
}
