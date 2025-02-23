// components/Nav.tsx

"use client";

import Link from "next/link";
import styled, {keyframes} from "styled-components";
import React from "react";

const glitch = keyframes`
    0% {
        text-shadow: 2px 2px #0ff, -2px -2px #f0f;
    }
    25% {
        text-shadow: -2px 2px #0ff, 2px -2px #f0f;
    }
    50% {
        text-shadow: 2px -2px #0ff, -2px 2px #f0f;
    }
    75% {
        text-shadow: -2px -2px #0ff, 2px 2px #f0f;
    }
    100% {
        text-shadow: 2px 2px #0ff, -2px -2px #f0f;
    }
`;

const NavContainer = styled.nav`
    background: rgba(0, 0, 20, 0.9);
    padding: 1.5rem 2rem;
    border-bottom: 2px solid #0ff;
    box-shadow: 0 0 25px rgba(0, 255, 255, 0.3);
    position: relative;
    font-family: 'Press Start 2P', monospace;
    backdrop-filter: blur(5px);
`;

const NavList = styled.ul`
    list-style: none;
    display: flex;
    gap: 2rem;
    margin: 0;
    padding: 0;
    justify-content: center;
`;

const NavItem = styled.li`
    position: relative;

    a {
        color: #0ff;
        text-decoration: none;
        padding: 0.5rem 1rem;
        transition: all 0.3s ease;
        position: relative;

        &:hover {
            color: #f0f;
            animation: ${glitch} 0.3s infinite;

            &::before {
                content: ">";
                position: absolute;
                left: -1.2em;
                filter: drop-shadow(0 0 2px #f0f);
            }

            &::after {
                content: "_";
                margin-left: 0.5rem;
            }
        }
    }
`;

export default function Nav() {
    return (
        <NavContainer>
            <NavList>
                <NavItem>
                    <Link href="/blog">BLOG HOME</Link>
                </NavItem>
                <NavItem>
                    <Link href="/">ABOUT CRAIG</Link>
                </NavItem>
            </NavList>
        </NavContainer>
    );
}