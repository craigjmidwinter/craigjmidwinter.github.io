import styled from "styled-components";
import {motion, useScroll, useTransform} from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import React from "react";
import {generateZigZagPolygon} from "@/utils";

/**
 * Zig-zag top via clip-path.
 * You can tweak the polygon points for a different style/size of the zig-zag.
 */
const AboutSection = styled(motion.div)`
    min-height: 105vh;
    position: relative;
    padding: 0;
    background: url("/SVG/Asset 3.svg") repeat center center;
    background-size: 100%;

/* 
  Example zig-zag clip-path at the very top.
  This polygon repeats a pattern of going up and down along the top edge.
    or frequency of the zig-zag. 
  */
    clip-path: ${generateZigZagPolygon(40, 1)};

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

    const { scrollYProgress } = useScroll();
    // About section animations
    const teaseOpacity = useTransform(scrollYProgress, [0.3, 0.4], [1, 0]);
    const contentOpacity = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);
    const sectionOffset = useTransform(scrollYProgress, [0, 0.5], ["-10vh", "0vh"]);

    return <AboutSection style={{y: sectionOffset}}>
        <AboutTease style={{opacity: teaseOpacity}}>
            <h2>About Me</h2>
        </AboutTease>
        <AboutWrapper>
            <AboutContent style={{opacity: contentOpacity}}>
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
    </AboutSection>;
}