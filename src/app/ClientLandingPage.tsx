"use client";

import React from "react";
import dynamic from "next/dynamic";
import styled, {createGlobalStyle, ThemeProvider} from "styled-components";
import {About} from "@/components/Landing/About";
import {Hero} from "../components/Landing/Hero";

const ThreeCanvas = dynamic(() => import("./ThreeCanvas"), { ssr: false });

const theme = {
    accent: "#f76eec",
    text: "#231f20",
};

const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');

    @font-face {
        font-family: 'Thunderstorm';
        src: url('/thunderstorm-signature-webfont.woff2') format('woff2'),
        url('/thunderstorm-signature-webfont.woff') format('woff'),
        url('/thunderstorm-signature-webfont.eot') format('embedded-opentype');
        font-weight: 400;
        font-style: normal;
    }

    body {
        margin: 0;
        background: white;
        color: #231f20;
        font-family: 'Montserrat', sans-serif;
        overflow-x: hidden;
    }

    h1, h2, h3, h4, h5, h6 {
        font-family: 'Thunderstorm', 'Montserrat', sans-serif;
        color: #f76eec;
        text-shadow: 2px 2px 0 #000;
        margin: 0;
        padding: 0;
        font-weight: normal;
    }

    h2 {
        font-size: 7rem;
        @media (max-width: 768px) {
            font-size: 2.5rem;
        }
    }

    h1 {
        font-size: 9rem;
        @media (max-width: 768px) {
            font-size: 3rem;
        }
    }
`;

const Container = styled.div`
    position: relative;
    overflow: hidden;
    background: url("/80s/1980s Fashion Patterns Vol 2_Tech Noir.jpg") repeat center center;
    background-color: #000;
`;


export default function ClientLandingPage() {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle/>
            <Container>
                <ThreeCanvas/>
                <Hero />
                <About/>
            </Container>
        </ThemeProvider>
    );
}
