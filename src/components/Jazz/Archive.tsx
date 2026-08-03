"use client";

import React from "react";
import Link from "next/link";
import styled from "styled-components";
import {Post} from "@/service/blog";

const Section = styled.section`
    padding: clamp(48px, 7vh, 86px) clamp(20px, 4vw, 56px);
    background: #fbfaf7;
    color: #111;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 22px;
`;

const Heading = styled.h2`
    margin: 0;
    font: 700 clamp(30px, 4vw, 54px)/1 'Space Grotesk', sans-serif;
    letter-spacing: -0.04em;
`;

const SideNote = styled.span`
    font: 400 12.5px/1.5 'JetBrains Mono', monospace;
    opacity: 0.6;
    max-width: 44ch;
`;

const Rows = styled.div`
    border-bottom: 2px solid #111;
`;

const Row = styled(Link)`
    display: grid;
    grid-template-columns: 74px 1fr auto;
    gap: 16px;
    align-items: baseline;
    padding: 15px 10px;
    margin: 0 -10px;
    border-top: 2px solid #111;
    text-decoration: none;
    color: #111;
    transition: background 0.12s ease;

    &:hover {
        background: #e9e64a;
        color: #111;
    }

    &:focus-visible {
        outline: 2px solid #111;
        outline-offset: 2px;
        background: #e9e64a;
    }
`;

const RowDate = styled.span`
    font: 500 10.5px/1 'JetBrains Mono', monospace;
    opacity: 0.5;
`;

const RowTitle = styled.span`
    font: 500 clamp(16px, 2vw, 22px)/1.3 'Space Grotesk', sans-serif;
    letter-spacing: -0.02em;
    text-wrap: pretty;
`;

const RowArrow = styled.span`
    font: 500 11px/1 'JetBrains Mono', monospace;
    color: #8e3d94;
`;

const AllPosts = styled(Link)`
    display: inline-block;
    margin-top: 20px;
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.12em;
    padding: 13px 17px;
    background: #111;
    color: #fbfaf7;
    text-decoration: none;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover {
        color: #fbfaf7;
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0 #8e3d94;
    }

    &:focus-visible {
        outline: 2px solid #111;
        outline-offset: 2px;
    }
`;

/**
 * Formats an ISO date string as YYYY.MM without touching the local timezone,
 * so the statically exported markup matches what the browser renders.
 */
function formatDate(value: string | undefined): string {
    if (!value) return "";
    const match = /^(\d{4})-(\d{2})/.exec(value);
    if (match) return `${match[1]}.${match[2]}`;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    return `${parsed.getUTCFullYear()}.${String(parsed.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function Archive({posts}: { posts: Post[] }) {
    const all = posts ?? [];
    const recent = all.slice(0, 6);
    const count = all.length;

    return (
        <Section id="archive">
            <Header>
                <Heading>Field notes</Heading>
                <SideNote>
                    Chronicling what works in my AI development flow. Before that, a home
                    automation blog, kept exactly as it was. {count} {count === 1 ? "post" : "posts"} in all.
                </SideNote>
            </Header>

            {recent.length > 0 && (
                <Rows>
                    {recent.map((post) => (
                        <Row key={post.slug} href={`/blog/${post.slug}`}>
                            <RowDate>{formatDate(post.date_published)}</RowDate>
                            <RowTitle>{post.title}</RowTitle>
                            <RowArrow aria-hidden="true">↗</RowArrow>
                        </Row>
                    ))}
                </Rows>
            )}

            {count > 0 && (
                <AllPosts href="/blog">
                    ALL {count} {count === 1 ? "POST" : "POSTS"} ↗
                </AllPosts>
            )}
        </Section>
    );
}
