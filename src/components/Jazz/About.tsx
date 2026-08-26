"use client";

import styled from "styled-components";

const INK = "#111";
const PAPER = "#fbfaf7";
const TEAL = "#00a7a0";
/* Purple is mid-luminance like the teal: the #8e3d94 fill purple is 6.20:1 on
   paper but only 2.92:1 on this section's ink background. This is the same hue
   lifted toward white until it clears AA on ink (5.53:1). This section is ink,
   so it is the only purple used here. See README, "Colour pairings". */
const PURPLE_ON_INK = "#b077b4";

const PARAGRAPHS: string[] = [
    "I'm a Director of Engineering at Lyntris (formerly Hypergiant / Accelint), where I've led an engineering organization of ~50 people across multiple product lines. Before that I was the lead engineer on Hyperdrive, a Kubernetes-native MLOps platform that spun off into an enterprise product.",
    "I'm a leader who still ships. Lately that means AI infrastructure: agent pipeline tooling, model packaging and serving, and on-device ML inference in a commercial desktop product.",
    "As a leader, I believe high-performing teams are built on trust and transparency. Creating space for risk-taking and learning from failure is how you get a culture of innovation and growth.",
];

interface Stop {
    years: string;
    company: string;
    role: string;
    stack: string;
    current?: boolean;
}

const TIMELINE: Stop[] = [
    {
        years: "2019 — now",
        company: "Lyntris (formerly Hypergiant / Accelint)",
        role: "Lead Software Engineer → Director of Engineering",
        stack: "node · react · go · python · k8s · terraform",
        current: true,
    },
    {
        years: "2015 — 2019",
        company: "Pepper",
        role: "Back-end developer, high-traffic deal communities",
        stack: "php (laravel) · mysql · redis · elasticsearch",
    },
    {
        years: "2007 — 2015",
        company: "Shaw Communications",
        role: "Predictive dialer coordinator, master control, community TV producer",
        stack: "js · php · mysql · visual foxpro (really)",
    },
];

const ALSO: string[] = [
    "Thistle Curling Club board of executives, 2015–2023",
    "The Week Thus Far — created, wrote and produced a late-night comedy show that aired across Manitoba, 2011–2014",
];

const Section = styled.section`
    background: ${INK};
    color: ${PAPER};
    padding: clamp(48px, 7vh, 86px) clamp(20px, 4vw, 56px);
    position: relative;
    overflow: hidden;
`;

const Ring = styled.div`
    position: absolute;
    right: -60px;
    top: -40px;
    width: 280px;
    height: 280px;
    border: 2px solid ${TEAL};
    border-radius: 50%;
    opacity: 0.5;
    pointer-events: none;
`;

const Grid = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: clamp(24px, 4vw, 60px);
`;

const Heading = styled.h2`
    margin: 0 0 18px;
    font: 700 clamp(30px, 4vw, 54px) / 1 "Space Grotesk", sans-serif;
    letter-spacing: -0.04em;
`;

const Paragraph = styled.p<{ $dim?: boolean }>`
    margin: 0 0 14px;
    font: 400 15.5px / 1.65 "Space Grotesk", sans-serif;
    max-width: 46ch;
    text-wrap: pretty;
    opacity: ${({ $dim }) => ($dim ? 0.8 : 1)};

    &:last-child {
        margin-bottom: 0;
    }
`;

const Label = styled.h3<{ $color: string }>`
    margin: 0 0 16px;
    font: 500 10px / 1 "JetBrains Mono", monospace;
    letter-spacing: 0.16em;
    color: ${({ $color }) => $color};
`;

const AlsoLabel = styled(Label)`
    margin: 24px 0 12px;
`;

const Timeline = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
`;

const Row = styled.li`
    display: grid;
    grid-template-columns: 96px 1fr;
    gap: 14px;
    padding: 14px 0;
    border-top: 1px solid rgba(251, 250, 247, 0.22);
`;

const Years = styled.span<{ $current?: boolean }>`
    font: 500 11px / 1.5 "JetBrains Mono", monospace;
    color: ${({ $current }) => ($current ? TEAL : "inherit")};
    opacity: ${({ $current }) => ($current ? 1 : 0.55)};
`;

const Company = styled.div`
    font: 500 16px / 1.3 "Space Grotesk", sans-serif;
`;

const Detail = styled.div`
    font: 400 11.5px / 1.5 "JetBrains Mono", monospace;
    opacity: 0.6;
`;

const AlsoList = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    font: 400 12.5px / 1.7 "JetBrains Mono", monospace;
    opacity: 0.7;
`;

export function About() {
    return (
        <Section id="about">
            <Ring aria-hidden="true" />
            <Grid>
                <div>
                    <Heading>About</Heading>
                    {PARAGRAPHS.map((text, i) => (
                        <Paragraph key={i} $dim={i > 0}>
                            {text}
                        </Paragraph>
                    ))}
                </div>
                <div>
                    <Label $color={TEAL}>WHERE I&apos;VE BEEN</Label>
                    <Timeline>
                        {TIMELINE.map((stop) => (
                            <Row key={stop.company}>
                                <Years $current={stop.current}>{stop.years}</Years>
                                <div>
                                    <Company>{stop.company}</Company>
                                    <Detail>{stop.role}</Detail>
                                    <Detail>{stop.stack}</Detail>
                                </div>
                            </Row>
                        ))}
                    </Timeline>
                    <AlsoLabel $color={PURPLE_ON_INK}>ALSO</AlsoLabel>
                    <AlsoList>
                        {ALSO.map((line) => (
                            <li key={line}>{line}</li>
                        ))}
                    </AlsoList>
                </div>
            </Grid>
        </Section>
    );
}
