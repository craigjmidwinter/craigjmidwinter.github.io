"use client";

import React from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { motion, useScroll, useTransform } from "framer-motion";

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
    background: url("/bg-2.svg") repeat center center;
    background-size: 350%;
    background-color: #1dd9c1;
`;

const HeroSection = styled(motion.div)`
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    text-align: center;
`;

const HeroContent = styled(motion.div)`
    background: rgba(255, 255, 255, 0.97);
    padding: 2rem;
    box-shadow: 8px 8px 0 #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 80%;
    position: relative;
    z-index: 2;

    @media (max-width: 768px) {
        width: 90%;
        padding: 1.5rem;
    }
`;

const AboutSection = styled(motion.div)`
    min-height: 100vh;
    position: relative;
    background: white;
    padding: 0;
    //background: url("/memphis2.svg") repeat center center;
    //background-size: 350%;
`;

const AboutWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    padding: 0 2rem;
    box-sizing: border-box;
    z-index: 3;
`;

const AboutContent = styled(motion.div)`
    max-width: 900px;
    margin: 0 auto;
    opacity: 0;
    position: relative;
    //background: rgba(255, 255, 255, 0.97);
    //padding: 2rem;
    //box-shadow: 8px 8px 0 #000;
`;

const AboutTease = styled(motion.div)`
    position: absolute;
    width: 100%;
    text-align: center;
    font-size: 2rem;
`;

const Subtitle = styled.p`
    font-size: 1.25rem;
    margin-bottom: 5rem;
    color: #231f20;
`;

const Button = styled.a`
    display: inline-block;
    background: ${props => props.theme.accent};
    color: #fff;
    padding: 1rem 2rem;
    border-radius: 50px;
    text-decoration: none;
    margin: 0.5rem;
    transition: background 0.3s;

    &:hover {
        background: #ede461;
    }
`;

const SocialLinks = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
`;

const SocialLink = styled.a`
    text-decoration: none;
    font-size: 1.5rem;
    transition: color 0.3s;
    color: #231f20;

    &:hover {
        color: #5ac3ff;
    }
`;

const AboutText = styled.div`
    font-size: 1.1rem;
    line-height: 1.5;
    color: #231f20;
    max-width: 800px;
    margin: 2rem auto 0;

    @media (max-width: 768px) {
        font-size: 1rem;
        max-width: 90%;
    }
`;

export default function ClientLandingPage() {
    const { scrollYProgress } = useScroll();

    // Hero animations
    const slideOut = useTransform(scrollYProgress, [0, 0.3], ["0%", "100%"]);
    const fadeOut = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

    // About section animations
    const teaseOpacity = useTransform(scrollYProgress, [0.3, 0.4], [1, 0]);
    const contentOpacity = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);
    const sectionOffset = useTransform(scrollYProgress, [0, 0.5], ["-10vh", "0vh"]);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <Container>
                <ThreeCanvas />

                <HeroSection>
                    <HeroContent style={{ x: slideOut, opacity: fadeOut }}>
                        <h1>Craig Midwinter</h1>
                        <Subtitle>Software Engineer • Podcast Host</Subtitle>
                        <Button href="/resume.pdf" target="_blank">Résumé</Button>
                        <SocialLinks>
                            <SocialLink href="https://github.com/craigjmidwinter" target="_blank">GitHub</SocialLink>
                            <SocialLink href="https://www.linkedin.com/in/craig-midwinter-b26193155/" target="_blank">LinkedIn</SocialLink>
                            <SocialLink href="https://bravooutsider.com/" target="_blank">Podcast</SocialLink>
                        </SocialLinks>
                    </HeroContent>
                </HeroSection>

                <AboutSection style={{ y: sectionOffset }}>
                    <AboutTease style={{ opacity: teaseOpacity }}>
                        <h2>About Me</h2>
                    </AboutTease>
                    <AboutWrapper>

                        <AboutContent style={{ opacity: contentOpacity, zIndex: 1000 }}>
                            <h2>About Me</h2>
                            <AboutText>
                                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                    {`
👋 Hi! I'm Craig!

I'm currently Director of Engineering at Hypergiant/Accelint. Prior to that I've held various of engineering roles, leading a variety both frontend and backend projects ranging from building tools for Model Operations in the AI/ML space, to command and control software geared towards visualizing and acting upon geospatial data.
                                     
As a leader I believe that creating high-performing teams means building a foundation of trust and transparency. Creating space for risk-taking and learning from failure is key to fostering a culture of innovation and growth.
                                      
As an engineer, I love diving into complex problem domains. I've worked all over the stack but my heart lives in the backend transforming data and getting my hands dirty with integrations and infrastructure.

In my spare time I host a podcast called Bravo Outsider where we look at The Real Housewives and other Bravo reality TV shows from an artistic lens.

📫 How to reach me: craig.j.midwinter@gmail.com
`}
                                </ReactMarkdown>
                            </AboutText>
                        </AboutContent>
                    </AboutWrapper>
                </AboutSection>
            </Container>
        </ThemeProvider>
    );
}