import styled from "styled-components";
import {motion, useScroll, useTransform} from "framer-motion";
import React from "react";

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
const Subtitle = styled.p`
    font-size: 1.25rem;
    margin-bottom: 5rem;
    color: #231f20;
`;
const Button = styled.a`
    display: inline-block;
    background: ${(props) => props.theme.accent};
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

export function Hero() {
    const { scrollYProgress } = useScroll();

    // Index animations
    const slideOut = useTransform(scrollYProgress, [0, 0.3], ["0%", "100%"]);
    const fadeOut = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

    return <HeroSection>
        <HeroContent style={{x: slideOut, opacity: fadeOut}}>
            <h1>Craig Midwinter</h1>
            <Subtitle>Software Engineer • Podcast Host</Subtitle>
            <Button href="/resume.pdf" target="_blank">
                Résumé
            </Button>
            <SocialLinks>
                <SocialLink href="https://github.com/craigjmidwinter" target="_blank">
                    GitHub
                </SocialLink>
                <SocialLink
                    href="https://www.linkedin.com/in/craig-midwinter-b26193155/"
                    target="_blank"
                >
                    LinkedIn
                </SocialLink>
                <SocialLink href="https://bravooutsider.com/" target="_blank">
                    Podcast
                </SocialLink>
            </SocialLinks>
        </HeroContent>
    </HeroSection>;
}