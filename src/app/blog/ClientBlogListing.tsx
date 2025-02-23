"use client";

import React from "react";
import Link from "next/link";
import styled from "styled-components";
import Nav from "@/components/Nav";

const BackgroundVideo = styled.video`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    z-index: -2;
`;

const ListingContainer = styled.div`
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background: rgba(0, 0, 20, 0.9);
    border: 1px solid #0ff;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
    position: relative;
    font-family: 'Press Start 2P', 'Courier New', monospace;
    line-height: 1.6;
    color: #0ff;
`;

const PostList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 2rem 0;
    position: relative;
`;

const PostItem = styled.li`
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: rgba(0, 0, 30, 0.8);
    border: 1px solid #f0f;
    transition: all 0.3s ease;
    position: relative;
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);

    &:hover {
        background: rgba(0, 0, 40, 0.9);
        transform: translateX(10px);
        box-shadow: 5px 5px 0 rgba(255, 0, 255, 0.3);
    }

    a {
        color: #0ff;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: all 0.3s ease;

        &:hover {
            color: #f0f;
            text-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
        }
    }
`;

const HeroImage = styled.img`
    width: 120px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid rgba(0, 255, 255, 0.3);
`;

const Title = styled.h1`
    font-size: 2rem;
    text-align: center;
    text-transform: uppercase;
    margin-bottom: 2rem;
    background: linear-gradient(45deg, #0ff, #f0f);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
`;

const DateBadge = styled.span`
    display: inline-block;
    padding: 0.2rem 0.5rem;
    background: rgba(255, 0, 255, 0.1);
    border: 1px solid #f0f;
    margin-left: 1rem;
    font-size: 0.8em;
    color: #f0f;
`;

interface BlogPost {
    title: string;
    slug: string;
    date_published: string;
    cover_image?: string;
}

interface ClientBlogListingProps {
    posts: BlogPost[];
}

export default function ClientBlogListing({posts}: ClientBlogListingProps) {
    return (
        <>
            <BackgroundVideo autoPlay loop muted>
                <source src="/outrun-effect_4.webm" type="video/webm"/>
            </BackgroundVideo>
            <Nav/>

            <ListingContainer>
                <Title>{"Craig's Home Automation Blog Archive"}</Title>
                <PostList>
                    {posts.map((post) => {
                        const formattedDate = new Date(post.date_published)
                            .toISOString()
                            .split('T')[0];

                        return (
                            <PostItem key={post.slug}>
                                <Link href={`/blog/${post.slug}`}>
                                    {/* Hero Image */}
                                    {post.cover_image && (
                                        <HeroImage src={post.cover_image} alt={post.title}/>
                                    )}

                                    <div>
                                        {post.title}
                                        <DateBadge>{formattedDate}</DateBadge>
                                    </div>
                                </Link>
                            </PostItem>
                        );
                    })}
                </PostList>
            </ListingContainer>
        </>
    );
}
