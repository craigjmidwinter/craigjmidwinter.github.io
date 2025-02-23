"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import Nav from "@/components/Nav";
import {FiClipboard} from "react-icons/fi";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {synthwave84} from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import {Post} from "@/service/blog";
import rehypeUnwrapImages from "rehype-unwrap-images";

/*****************************************************************
 * DETECT YOUTUBE LINKS
 *****************************************************************/
function getYouTubeId(url?: string): string | null {
    if (!url) return null;
    try {
        const parsed = new URL(url);
        if (parsed.hostname.includes("youtube.com")) {
            return parsed.searchParams.get("v");
        }
        if (parsed.hostname.includes("youtu.be")) {
            return parsed.pathname.slice(1); // remove leading slash
        }
        return null;
    } catch (e) {
        console.error(e)
        return null;
    }
}

/*****************************************************************
 * STYLES
 *****************************************************************/

// Outrun background
const BackgroundVideo = styled.video`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    z-index: -2;
`;

// Terminal styling
const TerminalContainer = styled.div`
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background: #000;
    color: #0f0;
    font-family: 'IBM Plex Mono', monospace;
    line-height: 1.6;
    border: 2px solid #0f0;
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
    position: relative;
    overflow: hidden;
`;

// Banner about outdated info
const ArchiveBanner = styled.div`
    background: rgba(0, 0, 0, 0.7);
    color: #ff0;
    border: 1px solid #f0f;
    padding: 1rem;
    margin-bottom: 1rem;
    text-align: center;
    font-size: 0.85rem;
    line-height: 1.4;

    strong {
        color: #f0f;
    }
`;

// Post header
const PostHeader = styled.div`
    margin-bottom: 1rem;

    h1 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: #0f0;
    }

    p {
        color: #0f0;
        opacity: 0.9;
        margin: 0;
    }
`;

// Hero image for the top of the post
const HeroImage = styled.img`
    max-width: 100%;
    height: auto;
    border: 1px solid #0f0;
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
    margin-bottom: 1rem;
`;

// Code container for syntax highlighting + copy button
const CodeBlockContainer = styled.div`
    background: rgba(0, 255, 0, 0.1);
    padding: 1rem;
    border: 1px solid #0f0;
    position: relative;
    margin: 1.5rem 0;
`;

const CopyButton = styled.button`
    position: absolute;
    top: 5px;
    right: 5px;
    background: transparent;
    border: 1px solid #0f0;
    color: #0f0;
    padding: 0.3rem 0.5rem;
    cursor: pointer;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 5px;

    &:hover {
        background: #0f0;
        color: #000;
    }
`;

// Image in markdown - Fix hydration error
const ImageWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin: 1rem auto;
    text-align: center;

    img {
        max-width: 100%;
        height: auto;
        border: 1px solid #0f0;
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
    }
`;

// Container for embedded YouTube videos
const YouTubeEmbed = styled.div`
    display: flex;
    justify-content: center;
    margin: 1rem 0;

    iframe {
        width: 560px;
        height: 315px;
        border: 0;
    }
`;

/*****************************************************************
 * COMPONENT
 *****************************************************************/

export default function ClientBlogPost({post}: { post: Post }) {
    const formattedDate = new Date(post.date_published).toISOString().split("T")[0];

    // Copy code to clipboard
    const handleCopy = (text?: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text)
            .then(() => alert("Copied to clipboard!"))
            .catch((err) => console.error("Failed to copy:", err));
    };

    return (
        <>
            <BackgroundVideo autoPlay loop muted>
                <source src="/outrun-waves_1.webm" type="video/webm"/>
            </BackgroundVideo>

            <Nav/>

            <TerminalContainer>

                <PostHeader>
                    <p>{formattedDate}</p>
                    <h1>{post.title}</h1>
                    {post.cover_image && <HeroImage src={post.cover_image} alt={post.title}/>}
                </PostHeader>

                <ArchiveBanner>
                    <p>
                        <strong>Note:</strong> This blog is an archive. Some content may be out of date,
                        and images may be broken or missing. If you find an issue or have a question,
                        please email <strong>craig.j.midwinter@gmail.com</strong>.
                    </p>
                </ArchiveBanner>

                <ReactMarkdown
                    remarkPlugins={[remarkGfm]} // Add unwrap plugin
                    rehypePlugins={[rehypeUnwrapImages]}
                    components={{
                        code({className, children}) {
                            const match = /language-(\w+)/.exec(className || "");
                            return (
                                <CodeBlockContainer>
                                    <CopyButton onClick={() => handleCopy(String(children))}>
                                        <FiClipboard/> Copy
                                    </CopyButton>
                                    <SyntaxHighlighter style={synthwave84} language={match ? match[1] : "text"}
                                                       PreTag="div">
                                        {String(children).replace(/\n$/, "")}
                                    </SyntaxHighlighter>
                                </CodeBlockContainer>
                            );
                        },
                        img({alt, src}) {
                            const youtubeId = getYouTubeId(src);
                            return youtubeId ? (
                                <YouTubeEmbed>
                                    <iframe src={`https://www.youtube.com/embed/${youtubeId}`} allowFullScreen
                                            title={alt}/>
                                </YouTubeEmbed>
                            ) : (
                                <ImageWrapper>
                                    <img alt={alt || ""} src={src}/>
                                </ImageWrapper>
                            );
                        },
                    }}
                >
                    {post.content}
                </ReactMarkdown>
            </TerminalContainer>
        </>
    );
}