"use client";

import Link from "next/link";
import styled from "styled-components";

const Container = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #000014;
    color: #0ff;
    font-family: 'Press Start 2P', monospace;
    text-align: center;
    gap: 2rem;
    padding: 2rem;
`;

const Code = styled.h1`
    font-size: 6rem;
    margin: 0;
    text-shadow: 4px 4px #f0f, -4px -4px #ff0;
`;

const Message = styled.p`
    font-size: 0.9rem;
    color: #f0f;
    line-height: 2;
`;

const BackLink = styled(Link)`
    color: #0ff;
    text-decoration: none;
    border: 2px solid #0ff;
    padding: 0.75rem 1.5rem;
    font-size: 0.7rem;
    transition: all 0.2s ease;

    &:hover {
        background: #0ff;
        color: #000;
    }
`;

export default function NotFound() {
    return (
        <Container>
            <Code>404</Code>
            <Message>POST NOT FOUND</Message>
            <BackLink href="/blog">← BACK TO BLOG</BackLink>
        </Container>
    );
}
