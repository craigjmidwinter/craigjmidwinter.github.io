"use client";

import React from "react";
import Link from "next/link";
import styled, {createGlobalStyle} from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
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
`;

const Container = styled.main`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 22px;
    background: #fbfaf7;
    color: #111;
    padding: clamp(40px, 8vh, 96px) clamp(20px, 4vw, 56px);
`;

const Eyebrow = styled.div`
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.16em;
    color: #8e3d94;
`;

const Heading = styled.h1`
    margin: 0;
    font: 700 clamp(40px, 8vw, 108px)/0.9 'Space Grotesk', sans-serif;
    letter-spacing: -0.05em;
    max-width: 12ch;
`;

const Message = styled.p`
    margin: 0;
    font: 400 12.5px/1.7 'JetBrains Mono', monospace;
    max-width: 48ch;
    opacity: 0.65;
`;

const BackLink = styled(Link)`
    display: inline-block;
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.12em;
    padding: 13px 17px;
    border: 2px solid #111;
    color: #111;
    text-decoration: none;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover {
        color: #111;
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0 #00a7a0;
    }

    &:focus-visible {
        outline: 2px solid #111;
        outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;

        &:hover {
            transform: none;
        }
    }
`;

export default function NotFound() {
    return (
        <>
            <GlobalStyle/>
            <Container>
                <Eyebrow>404 · NOTHING AT THIS ADDRESS</Eyebrow>
                <Heading>NOT FILED HERE</Heading>
                <Message>
                    This post either moved, never existed, or got lost in one of the many
                    migrations this blog has survived.
                </Message>
                <BackLink href="/blog">← ALL POSTS</BackLink>
            </Container>
        </>
    );
}
