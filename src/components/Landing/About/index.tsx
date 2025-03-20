import styled from "styled-components";
import { motion, useScroll, useTransform} from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import React, { useRef } from "react";
import { generateZigZagPolygon } from "@/utils";

const AboutSection = styled(motion.section)`
    min-height: 105vh;
    position: relative;
    padding: 0;
    background: url("/SVG/Asset 3.svg") repeat center center;
    background-size: 100%;
    clip-path: ${() => generateZigZagPolygon(40, 1)};
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
    z-index: 3 !important;
`;

const AboutTease = styled(motion.div)`
    position: absolute;
    width: 100%;
    text-align: center;
    font-size: 2rem;
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

export function About() {
    const aboutRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: aboutRef, offset: ["start end", "end start"] });

    // Adjust the animation offset based on scroll progress
    const sectionOffset = useTransform(scrollYProgress, [0, 0.5], ["-10vh", "0vh"]);
    const teaseOpacity = useTransform(scrollYProgress, [0.2, 0.35], [1, 0]);
    const contentOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);

    return (
        <AboutSection ref={aboutRef} style={{ y: sectionOffset }}>
            <AboutTease style={{ opacity: teaseOpacity }}>
                <h2>About Me</h2>
            </AboutTease>
            <AboutWrapper>
                <AboutContent style={{ opacity: contentOpacity }}>
                    <h2>About Me</h2>
                    <AboutText>
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                            {`
👋 Hi! I'm Craig!

I'm currently Director of Engineering at Hypergiant/Accelint. Prior to that, I've held various engineering roles, leading a variety of frontend and backend projects ranging from AI/ML model operations to command and control software for geospatial data.

As a leader, I believe that creating high-performing teams means building a foundation of trust and transparency. Creating space for risk-taking and learning from failure is key to fostering a culture of innovation and growth.

As an engineer, I love diving into complex problem domains. I've worked all over the stack but my heart lives in the backend—transforming data and getting my hands dirty with integrations and infrastructure.

In my spare time, I host a podcast called Bravo Outsider where we analyze The Real Housewives and other Bravo reality TV shows from an artistic lens.

📫 How to reach me: craig.j.midwinter@gmail.com
                            `}
                        </ReactMarkdown>
                    </AboutText>
                </AboutContent>
            </AboutWrapper>
        </AboutSection>
    );
}
