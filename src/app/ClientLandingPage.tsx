// app/ClientLandingPage.tsx
"use client";

import dynamic from "next/dynamic";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import Construction from "@/components/construction";

// Dynamically import ThreeCanvas with SSR disabled
const ThreeCanvas = dynamic(() => import("./ThreeCanvas"), { ssr: false });

// Example theme object (adjust colors as needed)
const theme = {
    accent: "#f76eec",
    text: "#231f20",
};

// 1) Global Style: define Montserrat + RetroBoldy
const GlobalStyle = createGlobalStyle`
  /* Import Montserrat from Google Fonts for body text */
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');

  /* Define RetroBoldy via @font-face. 
     This example includes WOFF, TTF, and OTF. 
     Adjust the file paths to match your public folder. */
  @font-face {
    font-family: 'RetroBoldy';
    src: url('/RetroBoldy-Regular.woff') format('woff'),
         url('/RetroBoldy-Regular.ttf') format('truetype'),
         url('/RetroBoldy-Regular.otf') format('opentype');
    font-weight: 400;
    font-style: normal;
  }

  body {
    margin: 0;
    background: white;
    color: #231f20;
    /* Use Montserrat for general body text */
    font-family: 'Montserrat', sans-serif;
  }

  /* Headings use RetroBoldy. 
     If that fails, fall back to Montserrat or sans-serif. */
  h1, h2, h3, h4, h5, h6 {
    font-family: 'RetroBoldy', 'Montserrat', sans-serif;
  }
`;

// 2) Container for the entire page
const Container = styled.div`
  position: relative;
  min-height: 100vh;
  background: url("/bg.png") no-repeat center center;
  background-size: cover;
  overflow: hidden;
  background-color: #1dd9c1;
`;

// 3) Main content area
const Content = styled.div`
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
`;

// 4) Neo-brutalist wrapper
const ContentWrapper = styled.div`
  background: rgba(255, 255, 255, 0.97);
  padding: 2rem;
  max-width: 80%;
  margin: 0 auto;
  border-radius: 0;
  box-shadow: 8px 8px 0 #000;
`;

// 5) Headline: uses RetroBoldy (via the global h1 rule above)
const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #231f20;
`;

// 6) Subtitle uses Montserrat by default
const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: #231f20;
`;

// 7) Button
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

// 8) SocialLinks container
const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

// 9) Individual social link
const SocialLink = styled.a`
  color: #231f20;
  text-decoration: none;
  font-size: 1.5rem;
  transition: color 0.3s;

  &:hover {
    color: #5ac3ff;
  }
`;

// 10) Main component
export default function ClientLandingPage() {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <Container>
                {/* Renders Three.js canvas behind content */}
                <ThreeCanvas />

                <Content>
                    {/*<Construction />*/}

                    <ContentWrapper>
                        <Title>Craig Midwinter</Title>
                        <Subtitle>Software Engineer • Podcast Host</Subtitle>

                        <Button href="/resume.pdf" target="_blank">
                            Resume
                        </Button>

                        <SocialLinks>
                            <SocialLink
                                href="https://github.com/craigjmidwinter"
                                target="_blank"
                            >
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
                    </ContentWrapper>
                </Content>
            </Container>
        </ThemeProvider>
    );
}
