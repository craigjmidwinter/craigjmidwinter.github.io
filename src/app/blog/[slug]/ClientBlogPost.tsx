"use client";

import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type {Components} from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeUnwrapImages from "rehype-unwrap-images";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import styled, {createGlobalStyle, css} from "styled-components";
import {Post} from "@/service/blog";
import {Nav} from "@/components/Jazz/Nav";
import {Contact} from "@/components/Jazz/Contact";
import {MARK_CLIP, marks} from "@/components/Jazz/marks";
import {formatPostDate, postMeta, postTags} from "@/components/Jazz/postMeta";

/** Minimal shape the KEEP READING band needs from the following post. */
export interface NextPostLink {
    title: string;
    slug: string;
}

/*****************************************************************
 * MARKDOWN HELPERS (ported from the previous implementation)
 *****************************************************************/

/** Pulls a video id out of a youtube.com/youtu.be URL, or null when it is not one. */
function getYouTubeId(url?: string): string | null {
    if (!url) return null;
    try {
        const parsed = new URL(url);
        if (parsed.hostname.includes("youtube.com")) {
            return parsed.searchParams.get("v");
        }
        if (parsed.hostname.includes("youtu.be")) {
            return parsed.pathname.slice(1);
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Prism theme in the Jazz palette. Defined inline (rather than imported from
 * react-syntax-highlighter's bundled themes) so the code blocks match the dark
 * slab in the comp instead of dragging in a second colour language.
 */
const CODE_THEME: { [key: string]: React.CSSProperties } = {
    'code[class*="language-"]': {
        color: "#fbfaf7",
        background: "none",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "12.5px",
        lineHeight: 1.75,
        whiteSpace: "pre",
    },
    'pre[class*="language-"]': {
        color: "#fbfaf7",
        background: "none",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "12.5px",
        lineHeight: 1.75,
    },
    comment: {color: "rgba(251, 250, 247, 0.42)", fontStyle: "italic"},
    prolog: {color: "rgba(251, 250, 247, 0.42)"},
    doctype: {color: "rgba(251, 250, 247, 0.42)"},
    cdata: {color: "rgba(251, 250, 247, 0.42)"},
    punctuation: {color: "rgba(251, 250, 247, 0.55)"},
    property: {color: "#00a7a0"},
    tag: {color: "#00a7a0"},
    "attr-name": {color: "#00a7a0"},
    selector: {color: "#00a7a0"},
    key: {color: "#00a7a0"},
    string: {color: "#e9e64a"},
    "attr-value": {color: "#e9e64a"},
    char: {color: "#e9e64a"},
    inserted: {color: "#e9e64a"},
    number: {color: "#e39ce8"},
    boolean: {color: "#e39ce8"},
    constant: {color: "#e39ce8"},
    symbol: {color: "#e39ce8"},
    deleted: {color: "#e39ce8"},
    keyword: {color: "#e39ce8", fontWeight: 500},
    atrule: {color: "#e39ce8"},
    important: {color: "#e39ce8", fontWeight: 700},
    operator: {color: "rgba(251, 250, 247, 0.75)"},
    entity: {color: "rgba(251, 250, 247, 0.75)"},
    url: {color: "rgba(251, 250, 247, 0.75)"},
    variable: {color: "#fbfaf7"},
    function: {color: "#fbfaf7", fontWeight: 500},
    "class-name": {color: "#fbfaf7", fontWeight: 500},
    builtin: {color: "#fbfaf7"},
    namespace: {opacity: 0.7},
};

/*****************************************************************
 * GLOBAL
 *****************************************************************/

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

    @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
            scroll-behavior: auto !important;
        }
    }
`;

/*****************************************************************
 * HERO
 *****************************************************************/

const HERO_MARKS = marks(19, 10, [70, 46]);

/* The frozen home-automation era gets the archive banner; later posts don't.
   date_published may arrive as a string or a Date depending on YAML quoting. */
const ARCHIVE_CUTOFF_MS = Date.UTC(2019, 0, 1);

function isArchivePost(post: Post): boolean {
    const time = new Date(post.date_published).getTime();
    return Number.isFinite(time) && time < ARCHIVE_CUTOFF_MS;
}

const Hero = styled.section`
    position: relative;
    overflow: hidden;
    background: #111;
    color: #fbfaf7;
    padding: clamp(34px, 6vh, 72px) clamp(20px, 4vw, 56px) clamp(30px, 5vh, 58px);
`;

const Confetti = styled.div`
    position: absolute;
    clip-path: ${MARK_CLIP};
    opacity: 0.9;
    pointer-events: none;
`;

const HeroInner = styled.div`
    position: relative;
    max-width: 900px;
`;

const BackButton = styled(Link)`
    display: inline-block;
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.14em;
    color: #fbfaf7;
    text-decoration: none;
    border: 2px solid #fbfaf7;
    padding: 10px 13px;
    margin-bottom: clamp(20px, 4vh, 38px);
    transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;

    &:hover {
        background: #e9e64a;
        border-color: #e9e64a;
        color: #111;
    }

    &:focus-visible {
        outline: 2px solid #e9e64a;
        outline-offset: 3px;
    }
`;

const MetaRow = styled.div`
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.14em;
    margin-bottom: 16px;
`;

const MetaDate = styled.span`
    color: #00a7a0;
`;

const MetaDetail = styled.span`
    opacity: 0.55;
`;

const Title = styled.h1`
    margin: 0;
    font: 700 clamp(30px, 5.4vw, 72px)/0.98 'Space Grotesk', sans-serif;
    letter-spacing: -0.045em;
    text-wrap: pretty;
`;

/*****************************************************************
 * ARTICLE
 *****************************************************************/

const Article = styled.article`
    padding: clamp(34px, 6vh, 68px) clamp(20px, 4vw, 56px) clamp(20px, 3vh, 32px);
    max-width: 900px;

    p {
        margin: 0 0 20px;
        font: 400 16.5px/1.7 'Space Grotesk', sans-serif;
        max-width: 66ch;
        text-wrap: pretty;
    }

    /* first paragraph reads as the lede */

    & > p:first-of-type {
        margin: 0 0 26px;
        font: 400 clamp(18px, 2.1vw, 24px)/1.5 'Space Grotesk', sans-serif;
        letter-spacing: -0.015em;
        max-width: 34ch;
        border-left: 6px solid #00a7a0;
        padding-left: 18px;
    }

    h2 {
        margin: 38px 0 14px;
        font: 700 clamp(21px, 2.5vw, 30px)/1.15 'Space Grotesk', sans-serif;
        letter-spacing: -0.03em;
        display: inline-block;
        border-bottom: 6px solid #e9e64a;
        text-wrap: pretty;
    }

    h3 {
        margin: 30px 0 12px;
        font: 700 clamp(17px, 2vw, 22px)/1.25 'Space Grotesk', sans-serif;
        letter-spacing: -0.02em;
        text-wrap: pretty;
    }

    h4, h5, h6 {
        margin: 26px 0 10px;
        font: 500 11px/1.4 'JetBrains Mono', monospace;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        opacity: 0.6;
    }

    ul, ol {
        margin: 0 0 20px;
        padding-left: 22px;
        max-width: 66ch;
        font: 400 16.5px/1.7 'Space Grotesk', sans-serif;
    }

    li {
        margin-bottom: 8px;
    }

    li > p {
        margin: 0 0 8px;
        font: inherit;
    }

    strong {
        font-weight: 700;
    }

    em {
        font-style: italic;
    }

    hr {
        border: 0;
        border-top: 2px solid #111;
        margin: 34px 0;
        max-width: 66ch;
    }

    table {
        border-collapse: collapse;
        margin: 0 0 24px;
        display: block;
        overflow-x: auto;
        max-width: 100%;
    }

    th, td {
        border: 2px solid #111;
        padding: 9px 12px;
        text-align: left;
        font: 400 14px/1.5 'Space Grotesk', sans-serif;
    }

    th {
        background: #111;
        color: #fbfaf7;
        font: 500 10px/1.4 'JetBrains Mono', monospace;
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }

    blockquote {
        margin: 34px 0;
        padding: 24px 26px;
        background: #8e3d94;
        color: #fff;
        box-shadow: 12px 12px 0 #111;
        max-width: 52ch;
        font: 700 clamp(19px, 2.3vw, 27px)/1.25 'Space Grotesk', sans-serif;
        letter-spacing: -0.03em;
        text-wrap: pretty;
    }

    blockquote p {
        margin: 0;
        font: inherit;
        max-width: none;
    }

    blockquote p + p {
        margin-top: 14px;
    }

    blockquote a {
        color: #e9e64a;
    }
`;

const linkStyles = css`
    color: #00a7a0;
    text-decoration: none;
    border-bottom: 1px solid rgba(0, 167, 160, 0.35);

    &:hover {
        color: #00a7a0;
        text-decoration: underline;
    }

    &:focus-visible {
        outline: 2px solid #00a7a0;
        outline-offset: 2px;
    }
`;

const ExternalLink = styled.a`
    ${linkStyles}
`;

const InternalLink = styled(Link)`
    ${linkStyles}
`;

const InlineCode = styled.code`
    font: 400 0.92em/1.5 'JetBrains Mono', monospace;
    background: rgba(17, 17, 17, 0.06);
    border: 1px solid rgba(17, 17, 17, 0.2);
    padding: 1px 5px;
    word-break: break-word;
`;

const CodeBlock = styled.div`
    margin: 30px 0;
    border: 2px solid #111;
    background: #111;
    color: #fbfaf7;
    overflow: hidden;
`;

const CodeBar = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 14px;
    border-bottom: 2px solid rgba(251, 250, 247, 0.2);
    font: 500 9.5px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.14em;
`;

const CodeBarLabel = styled.span`
    color: #00a7a0;
`;

const CodeBarLang = styled.span`
    opacity: 0.5;
`;

const CodeBody = styled.div`
    overflow-x: auto;

    pre {
        margin: 0;
        padding: 18px 16px;
        font: 400 12.5px/1.75 'JetBrains Mono', monospace;
        background: transparent;
    }

    code {
        font: inherit;
        background: transparent;
    }
`;

const Figure = styled.figure`
    margin: 32px 0;
    max-width: 760px;

    img {
        display: block;
        width: 100%;
        height: auto;
        border: 2px solid #111;
        box-shadow: 12px 12px 0 #00a7a0;
        background: repeating-linear-gradient(135deg, #e3ded3 0 9px, #efeae0 9px 18px);
    }
`;

const Embed = styled.div`
    position: relative;
    aspect-ratio: 16 / 9;
    border: 2px solid #111;
    box-shadow: 12px 12px 0 #00a7a0;
    background: #111;

    iframe {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border: 0;
        display: block;
    }
`;

const Caption = styled.figcaption`
    margin-top: 12px;
    font: 400 11.5px/1.6 'JetBrains Mono', monospace;
    opacity: 0.6;
    max-width: 52ch;
`;

const ArchiveNote = styled.aside`
    margin: 40px 0 0;
    padding: 14px 16px;
    border: 2px solid #111;
    max-width: 66ch;
    font: 400 11.5px/1.7 'JetBrains Mono', monospace;
    opacity: 0.7;

    b {
        font-weight: 500;
        color: #8e3d94;
        letter-spacing: 0.12em;
    }

    a {
        color: #111;
        text-decoration: underline;
    }
`;

/*****************************************************************
 * FILED UNDER
 *****************************************************************/

const Filed = styled.section`
    padding: 0 clamp(20px, 4vw, 56px) clamp(48px, 7vh, 86px);
`;

const FiledInner = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    padding-top: 26px;
    border-top: 2px solid #111;
    max-width: 900px;
`;

const FiledLabel = styled.span`
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.14em;
    opacity: 0.5;
`;

const Tag = styled.span`
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.12em;
    padding: 9px 12px;
    border: 2px solid #111;
`;

/*****************************************************************
 * KEEP READING
 *****************************************************************/

const KeepReading = styled.section`
    position: relative;
    overflow: hidden;
    padding: clamp(40px, 6vh, 72px) clamp(20px, 4vw, 56px);
    background: #00a7a0;
    color: #fff;
`;

const Blob = styled.div`
    position: absolute;
    left: -40px;
    bottom: -60px;
    width: 210px;
    height: 210px;
    background: #8e3d94;
    border-radius: 50%;
    opacity: 0.6;
    pointer-events: none;
`;

const KeepInner = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    flex-wrap: wrap;
`;

const KeepLabel = styled.h2`
    margin: 0 0 12px;
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.16em;
    opacity: 0.85;
`;

const NextTitle = styled(Link)`
    display: block;
    font: 700 clamp(22px, 3.6vw, 46px)/1.04 'Space Grotesk', sans-serif;
    letter-spacing: -0.04em;
    color: #fff;
    text-decoration: none;
    max-width: 26ch;
    text-wrap: pretty;

    &:hover {
        color: #e9e64a;
    }

    &:focus-visible {
        outline: 2px solid #fff;
        outline-offset: 4px;
    }
`;

const IndexButton = styled(Link)`
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.12em;
    padding: 13px 17px;
    background: #fff;
    color: #111;
    text-decoration: none;
    transition: background 0.15s ease;

    &:hover {
        background: #e9e64a;
        color: #111;
    }

    &:focus-visible {
        outline: 2px solid #fff;
        outline-offset: 3px;
    }
`;

/*****************************************************************
 * COMPONENT
 *****************************************************************/

interface ClientBlogPostProps {
    post: Post;
    /** Post that follows this one in newest-first order (wraps to the newest). */
    nextPost?: NextPostLink | null;
}

export default function ClientBlogPost({post, nextPost}: ClientBlogPostProps) {
    const tags = postTags(post);

    const markdownComponents: Components = {
        // the styled code block brings its own container, so drop react-markdown's <pre>
        pre: ({children}) => <>{children}</>,

        code: ({className, children}) => {
            const raw = String(children ?? "");
            const match = /language-([\w+#-]+)/.exec(className ?? "");
            const lang = match ? match[1] : "";
            const isBlock = Boolean(match) || raw.includes("\n");

            if (!isBlock) {
                return <InlineCode>{children}</InlineCode>;
            }

            const label = lang ? lang.toUpperCase() : "CODE";
            const langLabel = lang ? lang.toUpperCase() : "TEXT";

            return (
                <CodeBlock>
                    <CodeBar>
                        <CodeBarLabel>{label}</CodeBarLabel>
                        {langLabel !== label && <CodeBarLang>{langLabel}</CodeBarLang>}
                    </CodeBar>
                    <CodeBody>
                        <SyntaxHighlighter
                            language={lang || "text"}
                            style={CODE_THEME}
                            PreTag="pre"
                            customStyle={{
                                margin: 0,
                                padding: "18px 16px",
                                background: "transparent",
                                border: 0,
                            }}
                        >
                            {raw.replace(/\n$/, "")}
                        </SyntaxHighlighter>
                    </CodeBody>
                </CodeBlock>
            );
        },

        img: ({src, alt}) => {
            const url = typeof src === "string" ? src : "";
            const youtubeId = getYouTubeId(url);
            const caption = alt ? <Caption>{alt}</Caption> : null;

            if (youtubeId) {
                return (
                    <Figure>
                        <Embed>
                            <iframe
                                src={`https://www.youtube.com/embed/${youtubeId}`}
                                title={alt || "Embedded video"}
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                loading="lazy"
                            />
                        </Embed>
                        {caption}
                    </Figure>
                );
            }

            return (
                <Figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={alt ?? ""} loading="lazy"/>
                    {caption}
                </Figure>
            );
        },

        // the post title is the page's only h1 — demote any heading the markdown declares
        h1: ({children}) => <h2>{children}</h2>,

        a: ({href, children}) => {
            const url = href ?? "";
            if (/^https?:\/\//i.test(url) || url.startsWith("//")) {
                return (
                    <ExternalLink href={url} target="_blank" rel="noopener noreferrer">
                        {children}
                    </ExternalLink>
                );
            }
            if (url.startsWith("/")) {
                // legacy posts link to each other with a trailing slash; this export does not use one
                const internal = url.length > 1 ? url.replace(/\/(?=$|[?#])/, "") : url;
                return <InternalLink href={internal}>{children}</InternalLink>;
            }
            return <ExternalLink href={url}>{children}</ExternalLink>;
        },
    };

    return (
        <>
            <GlobalStyle/>
            <Nav page="blog"/>

            <main>
                <Hero>
                    {HERO_MARKS.map((m, i) => (
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

                    <HeroInner>
                        <BackButton href="/blog">← ALL POSTS</BackButton>
                        <MetaRow>
                            <MetaDate>{formatPostDate(post)}</MetaDate>
                            <MetaDetail>{postMeta(post)}</MetaDetail>
                        </MetaRow>
                        <Title>{post.title}</Title>
                    </HeroInner>
                </Hero>

                <Article>
                    {post.cover_image && (
                        <Figure>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={post.cover_image} alt="" loading="lazy"/>
                        </Figure>
                    )}

                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeUnwrapImages]}
                        components={markdownComponents}
                    >
                        {post.content}
                    </ReactMarkdown>

                    {isArchivePost(post) && (
                        <ArchiveNote>
                            <b>ARCHIVE</b> — this post is kept as it was written. Some of it is out of
                            date and a few images have gone missing. Questions or corrections:{" "}
                            <a href="mailto:craig.j.midwinter@gmail.com">craig.j.midwinter@gmail.com</a>
                        </ArchiveNote>
                    )}
                </Article>

                {tags.length > 0 && (
                    <Filed>
                        <FiledInner>
                            <FiledLabel>FILED UNDER</FiledLabel>
                            {tags.map((tag) => (
                                <Tag key={tag}>{tag}</Tag>
                            ))}
                        </FiledInner>
                    </Filed>
                )}

                {nextPost && (
                    <KeepReading>
                        <Blob aria-hidden="true"/>
                        <KeepInner>
                            <div>
                                <KeepLabel>KEEP READING</KeepLabel>
                                <NextTitle href={`/blog/${nextPost.slug}`}>
                                    {nextPost.title}
                                </NextTitle>
                            </div>
                            <IndexButton href="/blog">INDEX ↗</IndexButton>
                        </KeepInner>
                    </KeepReading>
                )}
            </main>

            <Contact variant="blog"/>
        </>
    );
}
