"use client";

import styled, {keyframes} from "styled-components";
import {motion} from "framer-motion";
import React from "react";
import Link from "next/link";
import {Post} from "@/service/blog";

const BlogContainer = styled.div`
    min-height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
`;

const BackgroundVideo = styled.video`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
`;

const BlogContent = styled(motion.div)`
    max-width: 1200px;
    width: 90%;
    padding: 4rem 2rem;
    background: rgba(0, 0, 30, 0.25);
    backdrop-filter: blur(15px);
    border: 2px solid rgba(0, 255, 255, 0.4);
    border-radius: 10px;
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
    z-index: 3;
    position: relative;
    clip-path: polygon(0% 12%, 4% 0%, 96% 0%, 100% 12%, 100% 100%, 0% 100%);
`;

// Modified titleGlitch animation
const titleGlitch = keyframes`
    0%, 96% {
        font-family: 'Thunderstorm', sans-serif;
        text-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
        clip-path: inset(0 0 0 0);
    }
    97% {
        font-family: 'Press Start 2P', monospace;
        text-shadow: 2px 2px #0ff, -2px -2px #f0f, 3px -3px #ff0;
        clip-path: inset(20% 0 30% 0);
    }
    98% {
        font-family: 'Press Start 2P', monospace;
        text-shadow: -2px 2px #f0f, 2px -2px #0ff, -3px -3px #f00;
        clip-path: inset(10% 0 40% 0);
    }
    99% {
        font-family: 'Press Start 2P', monospace;
        text-shadow: 2px -2px #ff0, -2px 2px #0ff, 3px 3px #f0f;
        clip-path: inset(30% 0 10% 0);
    }
    100% {
        font-family: 'Press Start 2P', monospace;
        text-shadow: -2px -2px #f00, 2px 2px #0ff, -3px 3px #ff0;
        clip-path: inset(0 0 0 0);
    }
`;

// Updated GlitchTitle component
const GlitchTitle = styled.h2`
    text-align: center;
    margin-bottom: 3rem;
    font-size: 8rem;
    position: relative;
    animation: ${titleGlitch} 10s infinite;
    font-family: 'Thunderstorm', sans-serif;
    color: #fff;

    &::before,
    &::after {
        content: "Blog";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
    }

    &:hover {
        animation: ${titleGlitch} 0.8s infinite;

        &::before {
            opacity: 0.5;
            animation: glitch-clip 0.3s infinite;
        }

        &::after {
            opacity: 0.3;
            animation: glitch-clip 0.3s infinite reverse;
        }
    }

    &::after {
        content: "";
        display: block;
        width: 120px;
        height: 3px;
        background: linear-gradient(90deg, #0ff, #f0f, #ff0);
        margin: 1.5rem auto;
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
    }

    @keyframes glitch-clip {
        0% {
            clip-path: inset(10% 0 30% 0)
        }
        20% {
            clip-path: inset(5% 0 40% 0)
        }
        40% {
            clip-path: inset(25% 0 15% 0)
        }
        60% {
            clip-path: inset(10% 0 30% 0)
        }
        80% {
            clip-path: inset(35% 0 5% 0)
        }
        100% {
            clip-path: inset(10% 0 30% 0)
        }
    }
`;

const BlogDescription = styled.p`
    font-size: 1.2rem;
    color: #ccc;
    max-width: 800px;
    margin: 0 auto 2rem;
    font-family: "IBM Plex Mono", monospace;
`;

const CarouselWrapper = styled.div`
    width: 100%;
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;
`;

const Carousel = styled(motion.div)`
    display: flex;
    overflow-x: auto;
    padding: 1rem;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    gap: 1rem;
    width: 90%;
    justify-content: center;
    scroll-behavior: smooth;
    scrollbar-width: none; /* Hide scrollbar */

    &::-webkit-scrollbar {
        display: none;
    }
`;

const PostCard = styled(motion.div)`
    min-width: 300px;
    max-width: 350px;
    background: rgba(0, 0, 30, 0.3);
    padding: 1.5rem;
    border: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 8px;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
    scroll-snap-align: center;

    &:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 30px rgba(0, 255, 255, 0.2);
        border-color: #f0f;
    }

    a {
        text-decoration: none;
        color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
`;

const CoverImage = styled.img`
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid rgba(0, 255, 255, 0.3);
`;

const PostTitle = styled.h4`
    font-family: "Press Start 2P", monospace;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    color: #0ff;
    text-align: center;
`;

const PostDate = styled.p`
    font-family: "IBM Plex Mono", monospace;
    color: #f0f;
    font-size: 0.9rem;
    opacity: 0.8;
`;

const ViewAllButton = styled(Link)`
    display: inline-block;
    margin-top: 2rem;
    padding: 0.8rem 1.5rem;
    font-family: "Press Start 2P", monospace;
    text-transform: uppercase;
    text-decoration: none;
    color: #000;
    background: linear-gradient(90deg, #0ff, #f0f);
    border: 2px solid #0ff;
    border-radius: 5px;
    transition: all 0.3s ease;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);

    &:hover {
        background: linear-gradient(90deg, #f0f, #0ff);
        border-color: #f0f;
        transform: scale(1.05);
    }
`;

export function Blog({posts}: { posts: Post[] }) {
    return (
        <BlogContainer>
            <BackgroundVideo autoPlay loop muted playsInline>
                <source src="/outrun-effect_4.webm" type="video/webm"/>
            </BackgroundVideo>

            <BlogContent>
                <GlitchTitle>Blog</GlitchTitle>
                <BlogDescription>
                    {"I used to run a home automation blog. Here's an archive of the posts I've written"}
                </BlogDescription>

                <CarouselWrapper>
                    <Carousel>
                        {posts.map(post => (
                            <PostCard key={post.slug}>
                                <Link href={`/blog/${post.slug}`}>
                                    {post.cover_image && <CoverImage src={post.cover_image} alt={post.title}/>}
                                    <PostTitle>{post.title}</PostTitle>
                                    <PostDate>{new Date(post.date_published).toISOString().split("T")[0]}</PostDate>
                                </Link>
                            </PostCard>
                        ))}
                    </Carousel>
                </CarouselWrapper>

                <ViewAllButton href="/blog">View All Posts</ViewAllButton>
            </BlogContent>
        </BlogContainer>
    );
}