import React from "react";
import styled from "styled-components";
import {MARK_CLIP, marks} from "./marks";

const Section = styled.section`
    position: relative;
    min-height: 88vh;
    overflow: hidden;
    background: #fbfaf7;
`;

/** The big rotated black wedge the headline knocks out of. */
const Slab = styled.div`
    position: absolute;
    left: -10%;
    top: -8%;
    width: 130%;
    height: 62%;
    background: #111;
    transform: rotate(-13deg);
    transform-origin: left bottom;
`;

const Confetti = styled.div`
    position: absolute;
    clip-path: ${MARK_CLIP};
    animation: jzdrift 11s ease-in-out infinite;
    will-change: transform;

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

const HeadlineWrap = styled.div`
    position: relative;
    padding: clamp(56px, 9vh, 110px) clamp(20px, 4vw, 56px) 0;
    mix-blend-mode: difference;
    color: #fff;
    pointer-events: none;
`;

const Headline = styled.h1`
    margin: 0;
    font: 700 clamp(44px, 8.4vw, 116px)/0.85 'Space Grotesk', sans-serif;
    letter-spacing: -0.05em;
    text-transform: uppercase;
`;

const Row = styled.div`
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: clamp(18px, 3vw, 34px);
    padding: clamp(30px, 5vh, 60px) clamp(20px, 4vw, 56px) clamp(40px, 7vh, 80px);
`;

const Card = styled.div`
    background: #fbfaf7;
    padding: 20px 22px;
    max-width: 380px;
    box-shadow: 10px 10px 0 #00a7a0;
`;

const Eyebrow = styled.div`
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.14em;
    color: #8e3d94;
    margin-bottom: 10px;
`;

const Intro = styled.p`
    margin: 0;
    font: 400 15px/1.55 'Space Grotesk', sans-serif;
    text-wrap: pretty;
`;

const Buttons = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 16px;
    flex-wrap: wrap;
`;

const Button = styled.a`
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.1em;
    padding: 12px 15px;
    text-decoration: none;
    border: 2px solid transparent;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover {
        transform: translate(-2px, -2px);
        box-shadow: 4px 4px 0 #111;
    }
`;

const PurpleButton = styled(Button)`
    background: #8e3d94;
    color: #fff;

    &:hover {
        color: #fff;
    }
`;

/* Ink, not white, on the teal fill: white on #00a7a0 measures 2.99:1, under the
   4.5:1 AA floor for text this size. Ink on the same teal is 6.33:1. */
const TealButton = styled(Button)`
    background: #00a7a0;
    color: #111;

    &:hover {
        color: #111;
    }
`;

const OutlineButton = styled(Button)`
    border-color: #111;
    color: #111;

    &:hover {
        color: #111;
    }
`;

const Portrait = styled.div`
    position: relative;
    width: 216px;
    height: 250px;
    background: #00a7a0;
    box-shadow: 10px 10px 0 #8e3d94;
    flex: none;
`;

/* Bust is a transparent cutout, bottom-anchored and taller than its tile so the
   head breaks out of the top of the frame while the shoulders stay inside it. */
const PortraitImage = styled.img`
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 275px;
    width: auto;
    display: block;
`;

const HERO_MARKS = marks(7, 38, [76, 58]);

export function Hero() {
    return (
        <Section id="top">
            <Slab aria-hidden="true" />

            {HERO_MARKS.map((m, i) => (
                <Confetti
                    key={i}
                    aria-hidden="true"
                    style={
                        {
                            left: m.left,
                            top: m.top,
                            width: m.w,
                            height: m.h,
                            background: m.bg,
                            transform: m.tf,
                            animationDelay: m.delay,
                            "--r": m.rot,
                        } as React.CSSProperties
                    }
                />
            ))}

            <HeadlineWrap>
                <Headline aria-label="Craig Midwinter: engineering leader, still shipping.">
                    Engineering
                    <br />
                    Leader,
                    <br />
                    Still
                    <br />
                    Shipping.
                </Headline>
            </HeadlineWrap>

            <Row>
                <Card>
                    <Eyebrow>LYNTRIS (FMR. HYPERGIANT) · WINNIPEG</Eyebrow>
                    <Intro>
                        Hi, I&apos;m Craig. I lead engineering teams and build the platforms under AI
                        products: model serving, agent pipelines, and the infrastructure that data
                        scientists actually use.
                    </Intro>
                    <Buttons>
                        <PurpleButton href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                            RÉSUMÉ ↗
                        </PurpleButton>
                        <TealButton
                            href="https://github.com/craigjmidwinter"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GITHUB ↗
                        </TealButton>
                        <OutlineButton
                            href="https://www.linkedin.com/in/craig-midwinter-b26193155/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            LINKEDIN ↗
                        </OutlineButton>
                    </Buttons>
                </Card>

                <Portrait>
                    <PortraitImage
                        src="/portrait.webp"
                        alt="Stylized 3D portrait of Craig Midwinter"
                        width={388}
                        height={540}
                    />
                </Portrait>
            </Row>
        </Section>
    );
}
