"use client";

import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import Link from "next/link";
import styled, {createGlobalStyle} from "styled-components";
import {Nav} from "@/components/Jazz/Nav";
import {Marquee} from "@/components/Jazz/Marquee";
import {Contact} from "@/components/Jazz/Contact";
import {MARK_CLIP, marks} from "@/components/Jazz/marks";

/*
 * The nameplate page is built from the site's own design. The page-level pieces
 * (GlobalStyle, hero, buttons, filter chips, card) are the blog listing's
 * definitions (app/blog/ClientBlogListing.tsx), copied here because that file
 * keeps them private. Only the form inputs the site has never needed (textarea,
 * range sliders, file picker) get new CSS, and that CSS uses the same tokens.
 *
 * The tool itself (geometry, 3D preview, 3MF writer) is a separate GPL-3.0
 * program shipped as static files in public/nameplate-tool/. This page draws
 * every control and calls the tool's API.
 */

const TEAL = "#00a7a0";
/* Teal text on paper: the fill teal above is only 2.86:1 there. See README, "Colour pairings". */
const TEAL_ON_PAPER = "#007570";
const PURPLE = "#8e3d94";
const YELLOW = "#e9e64a";
const INK = "#111";
const PAPER = "#fbfaf7";

const TOOL_BASE = "/nameplate-tool/";
const TOOL_COMMIT = "e7ccaabb206dee88fc0ce03cc87821e78a47b356";
/* TODO(Craig, before merge): confirm the public repo URL once it is pushed. */
const TOOL_SOURCE = `https://github.com/craigjmidwinter/nameplate-generator/tree/${TOOL_COMMIT}`;

/* ------------------------------------------------------------ tool API -- */

type Mesh = { positions: Float64Array; indices: Uint32Array };
type Plate = {
    name: string;
    parts: { kind: string; mesh: Mesh }[];
    bbox: { minX: number; minY: number; maxX: number; maxY: number };
    bars: number;
    pieces: number;
};
type Params = Record<string, number | boolean | string>;
type Font = { charToGlyphIndex(ch: string): number };
type Preview = { show(plates: Plate[], o?: { fit?: boolean }): void; fit(): void; destroy(): void };
type ToolApi = {
    DEFAULT_PARAMS: Params;
    PART_COLORS: Record<string, string>;
    BUNDLED_FONTS: { id: string; label: string; file: string; credit: string; licence: string }[];
    loadFont(buf: ArrayBuffer): Font;
    buildBatch(font: Font, names: string[], params: Params): Plate[];
    parseNames(text: string): string[];
    write3MF(plates: Plate[]): Uint8Array;
    fileNameFor(name: string): string;
    createPreview(el: HTMLElement, o?: Record<string, unknown>): Preview;
    fontFileProblem(buf: ArrayBuffer): string | null;
    missingGlyphs(font: Font, names: string[]): string[];
};

/* ------------------------------------------------- blog: global styles -- */

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
    }

    html, body {
        /* clip (not hidden) so the sticky nav keeps working */
        overflow-x: clip;
        max-width: 100%;
    }

    body {
        margin: 0;
        background: ${PAPER};
        color: ${INK};
        font-family: 'Space Grotesk', sans-serif;
        -webkit-font-smoothing: antialiased;
    }

    a {
        color: ${INK};
    }

    a:hover {
        color: ${TEAL_ON_PAPER};
    }

    ::selection {
        background: ${YELLOW};
        color: ${INK};
    }

    :focus-visible {
        outline: 2px solid ${INK};
        outline-offset: 2px;
    }

    @keyframes jzmarq {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(-50%);
        }
    }

    @keyframes jzdrift {
        0%, 100% {
            transform: translateY(0) rotate(var(--r, 0deg));
        }
        50% {
            transform: translateY(-10px) rotate(calc(var(--r, 0deg) + 8deg));
        }
    }
`;

/* ---------------------------------------------------------- blog: hero -- */

const HeroSection = styled.section`
    position: relative;
    overflow: hidden;
    background: ${PAPER};
    padding-bottom: clamp(24px, 4vh, 48px);
`;

const Slab = styled.div`
    position: absolute;
    left: -10%;
    top: -26%;
    width: 130%;
    height: 66%;
    background: ${INK};
    transform: rotate(-9deg);
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
    padding: clamp(40px, 7vh, 84px) clamp(20px, 4vw, 56px) 0;
    mix-blend-mode: difference;
    color: #fff;
    pointer-events: none;
`;

const Headline = styled.h1`
    margin: 0;
    font: 700 clamp(40px, 7.6vw, 104px)/0.86 'Space Grotesk', sans-serif;
    letter-spacing: -0.05em;
    text-transform: uppercase;
`;

const HeroRow = styled.div`
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    padding: clamp(26px, 4vh, 52px) clamp(20px, 4vw, 56px) 0;
`;

const Intro = styled.p`
    margin: 0;
    max-width: 52ch;
    font: 400 15px/1.6 'Space Grotesk', sans-serif;
    background: ${PAPER};
    padding: 16px 18px;
    box-shadow: 10px 10px 0 ${TEAL};
    text-wrap: pretty;
`;

const HeroButtons = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
`;

/* ------------------------------------------------------- blog: buttons -- */

const buttonBase = `
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.12em;
    padding: 12px 15px;
    text-decoration: none;
    border: 2px solid transparent;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

/* The blog's RssButton (purple, white text: 6.47:1), as a link and as a button. */
const purpleButton = `
    ${buttonBase}
    background: ${PURPLE};
    color: #fff;
    cursor: pointer;

    &:hover,
    &:focus-visible {
        color: #fff;
        transform: translate(-2px, -2px);
        box-shadow: 4px 4px 0 ${INK};
    }

    &:disabled {
        opacity: 0.5;
        cursor: default;
        transform: none;
        box-shadow: none;
    }
`;

/* The blog's BackButton (ink outline). */
const outlineButton = `
    ${buttonBase}
    border-color: ${INK};
    background: transparent;
    color: ${INK};
    cursor: pointer;

    &:hover,
    &:focus-visible {
        color: ${INK};
        transform: translate(-2px, -2px);
        box-shadow: 4px 4px 0 ${INK};
    }
`;

const PurpleLink = styled.a`${purpleButton}`;
const PurpleButton = styled.button`${purpleButton}`;
const BackButton = styled(Link)`${outlineButton}`;
const OutlineButton = styled.button`${outlineButton}`;
/* A file picker that looks like the outline button (the input itself is visually hidden). */
const OutlineFileLabel = styled.label`
    ${outlineButton}
    display: inline-block;

    &:focus-within {
        transform: translate(-2px, -2px);
        box-shadow: 4px 4px 0 ${INK};
        outline: 2px solid ${INK};
        outline-offset: 2px;
    }
`;

/* --------------------------------------------------- blog: filter chips -- */

const FilterRow = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
`;

const FilterLabel = styled.span`
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.16em;
    color: ${PURPLE};
    margin-right: 6px;
`;

const Chip = styled.button<{ $active: boolean }>`
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.12em;
    padding: 11px 14px;
    border: 2px solid ${INK};
    background: ${({$active}) => ($active ? INK : "transparent")};
    color: ${({$active}) => ($active ? PAPER : INK)};
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover {
        transform: translate(-2px, -2px);
        box-shadow: 5px 5px 0 ${TEAL};
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

/* ---------------------------------------- blog: featured card + meta row -- */

const ToolSection = styled.section`
    padding: clamp(34px, 5vh, 60px) clamp(20px, 4vw, 56px) clamp(20px, 3vh, 32px);
    scroll-margin-top: 60px;
`;

/* FeaturedCard's frame (2px ink, paper, yellow block shadow), without the
   link hover since the tool is not a link. */
const ToolCard = styled.div`
    display: grid;
    grid-template-columns: minmax(300px, 380px) 1fr;
    border: 2px solid ${INK};
    background: ${PAPER};
    box-shadow: 14px 14px 0 ${YELLOW};

    @media (max-width: 860px) {
        grid-template-columns: 1fr;
    }
`;

const Controls = styled.div`
    padding: clamp(20px, 3vw, 28px);
    display: flex;
    flex-direction: column;
    gap: 22px;
    border-right: 2px solid ${INK};

    @media (max-width: 860px) {
        border-right: 0;
        border-top: 2px solid ${INK};
        order: 2;
    }
`;

/* FeaturedMedia: the striped placeholder background becomes the stage. */
const Stage = styled.div`
    position: relative;
    min-height: 420px;
    background: repeating-linear-gradient(135deg, #e3ded3 0 9px, #efeae0 9px 18px);
    display: flex;
    flex-direction: column;

    @media (max-width: 860px) {
        order: 1;
        min-height: 360px;
    }
`;

const Canvas = styled.div`
    position: relative;
    flex: 1;
    min-height: 260px;
    background: ${PAPER};
    margin: 12px;
    border: 2px solid ${INK};
`;

const StageBar = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 12px 12px;
`;

/* FeaturedMetaRow / FeaturedFlag from the blog card. */
const MetaRow = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    font: 500 10px/1.5 'JetBrains Mono', monospace;
    letter-spacing: 0.14em;
`;

const Flag = styled.span<{ $tone?: "ok" | "warn" }>`
    background: ${({$tone}) => ($tone === "warn" ? INK : YELLOW)};
    color: ${({$tone}) => ($tone === "warn" ? YELLOW : INK)};
    padding: 6px 8px;
`;

const Legend = styled.span`
    margin-right: 12px;
    white-space: nowrap;
`;

const Swatch = styled.i<{ $c: string }>`
    display: inline-block;
    width: 10px;
    height: 10px;
    border: 1px solid ${INK};
    background: ${({$c}) => $c};
    margin-right: 5px;
    vertical-align: -1px;
`;

/* FeaturedExcerpt (0.75 ink on paper stays above 4.5:1). */
const Note = styled.p`
    margin: 0;
    font: 400 13.5px/1.55 'Space Grotesk', sans-serif;
    opacity: 0.75;
    max-width: 48ch;
    text-wrap: pretty;
`;

const Summary = styled(Note)`
    padding: 0 12px 12px;
`;

const Group = styled.fieldset`
    border: 0;
    margin: 0;
    padding: 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;

    legend {
        padding: 0;
        margin-bottom: 10px;
    }
`;

/* ------------------------- new: form inputs the site had no style for -- */

const NamesInput = styled.textarea`
    width: 100%;
    min-height: 104px;
    resize: vertical;
    font: 700 14px/1.5 'JetBrains Mono', monospace;
    letter-spacing: 0.06em;
    padding: 10px 12px;
    border: 2px solid ${INK};
    border-radius: 0;
    background: ${PAPER};
    color: ${INK};
`;

const SliderRow = styled.label`
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2px 10px;
    align-items: center;
    font: 400 13.5px/1.4 'Space Grotesk', sans-serif;

    output {
        font: 500 10px/1 'JetBrains Mono', monospace;
        letter-spacing: 0.08em;
    }

    input {
        grid-column: 1 / -1;
        width: 100%;
        min-height: 32px;
        accent-color: ${PURPLE};
    }
`;

const VisuallyHidden = styled.input`
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    overflow: hidden;
`;

/* ---------------------------------------------------------------- notes -- */

const Notes = styled.section`
    padding: clamp(30px, 5vh, 56px) clamp(20px, 4vw, 56px) clamp(40px, 6vh, 72px);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 24px;

    p {
        margin: 10px 0 0;
        font: 400 14.5px/1.6 'Space Grotesk', sans-serif;
        max-width: 48ch;
    }

    a {
        text-decoration: underline;
    }
`;

const Fallback = styled.p`
    position: absolute;
    inset: 0;
    margin: 0;
    display: grid;
    place-items: center;
    font: 500 10px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.14em;
`;

/* ----------------------------------------------------------------- copy -- */

const MARQUEE_ITEMS = [
    "NAMEPLATES",
    "MULTI-COLOUR 3MF",
    "HOCKEY STICK",
    "ONE PIECE",
    "YOUR OWN FONT",
    "BAMBU STUDIO",
    "PRUSASLICER",
];

const HERO_MARKS = marks(11, 16, [72, 54]);

const INTRO_COPY =
    "Type one name per line, pick a font (or bring your own), and download a 3MF " +
    "with the base, letters and hockey stick as separate colours. It all runs in " +
    "your browser: names and font files never leave your computer.";

type Slider = { key: string; label: string; min: number; max: number; step: number; unit: string };

const SLIDERS: Slider[] = [
    {key: "capHeight", label: "Text size (cap height)", min: 5, max: 50, step: 0.5, unit: "mm"},
    {key: "offset", label: "Outline distance", min: 0.3, max: 6, step: 0.1, unit: "mm"},
    {key: "baseThickness", label: "Base thickness", min: 0.6, max: 8, step: 0.1, unit: "mm"},
    {key: "textHeight", label: "Letters above the base", min: 0.2, max: 5, step: 0.1, unit: "mm"},
];
const STICK_SLIDERS: Slider[] = [
    {key: "stickSize", label: "Stick size", min: 0.3, max: 3, step: 0.05, unit: "×"},
    {key: "stickHeightOffset", label: "Stick top below the base top", min: 0, max: 5, step: 0.1, unit: "mm"},
];

const fmt = (v: number, step: number) => v.toFixed(step < 0.1 ? 2 : 1);

function saveFile(bytes: Uint8Array, name: string) {
    const url = URL.createObjectURL(new Blob([bytes as BlobPart], {type: "model/3mf"}));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function SliderControl({s, value, onChange}: { s: Slider; value: number; onChange: (v: number) => void }) {
    return (
        <SliderRow>
            {s.label}
            <output>{fmt(value, s.step)} {s.unit}</output>
            <input type="range" min={s.min} max={s.max} step={s.step} value={value}
                   onChange={(e) => onChange(Number(e.target.value))}/>
        </SliderRow>
    );
}

/* ----------------------------------------------------------------- page -- */

export default function ClientNameplate() {
    const [api, setApi] = useState<ToolApi | null>(null);
    const [loadError, setLoadError] = useState(false);
    const [fonts, setFonts] = useState<Record<string, Font>>({});
    const [fontId, setFontId] = useState("graduate");
    const [ownFont, setOwnFont] = useState<{ id: string; name: string } | null>(null);
    const [fontMsg, setFontMsg] = useState<string | null>(null);
    const [namesText, setNamesText] = useState("ALEX\nJORDAN\nSAM");
    const [params, setParams] = useState<Params>({});
    const [plates, setPlates] = useState<Plate[]>([]);
    const [buildError, setBuildError] = useState<string | null>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const preview = useRef<Preview | null>(null);
    const needsFit = useRef(true);

    // Load the tool (a plain static file, not part of the Next bundle).
    useEffect(() => {
        let cancelled = false;
        import(/* webpackIgnore: true */ /* turbopackIgnore: true */ `${TOOL_BASE}app/nameplate-tool.js`)
            .then((mod: ToolApi) => {
                if (cancelled) return;
                setParams({...mod.DEFAULT_PARAMS});
                setApi(mod);
            })
            .catch(() => setLoadError(true));
        return () => {
            cancelled = true;
        };
    }, []);

    // Preview canvas.
    useEffect(() => {
        if (!api || !stageRef.current) return;
        preview.current = api.createPreview(stageRef.current, {background: PAPER, describedBy: "np-summary"});
        return () => {
            preview.current?.destroy();
            preview.current = null;
        };
    }, [api]);

    // Bundled fonts load on demand.
    useEffect(() => {
        if (!api || fonts[fontId]) return;
        const f = api.BUNDLED_FONTS.find((x) => x.id === fontId);
        if (!f) return;
        fetch(TOOL_BASE + f.file)
            .then((r) => {
                if (!r.ok) throw new Error(String(r.status));
                return r.arrayBuffer();
            })
            .then((buf) => setFonts((m) => ({...m, [fontId]: api.loadFont(buf)})))
            .catch((e) => setBuildError(`Font failed to load (${e.message}).`));
    }, [api, fontId, fonts]);

    const nameList = useMemo(() => (api ? api.parseNames(namesText) : []), [api, namesText]);
    const font = fonts[fontId];

    // Rebuild the plates (debounced) whenever an input changes.
    useEffect(() => {
        if (!api || !font) return;
        const t = setTimeout(() => {
            try {
                const built = api.buildBatch(font, nameList, params);
                setPlates(built);
                setBuildError(null);
                preview.current?.show(built, {fit: needsFit.current});
                needsFit.current = false;
            } catch (e) {
                setPlates([]);
                setBuildError(`Could not build: ${(e as Error).message}`);
            }
        }, 60);
        return () => clearTimeout(t);
    }, [api, font, nameList, params]);

    const set = useCallback((key: string, value: number | boolean | string) => {
        setParams((p) => ({...p, [key]: value}));
    }, []);

    const chooseFont = (id: string) => {
        needsFit.current = true;
        setFontId(id);
    };

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target;
        const file = input.files?.[0];
        if (!api || !file) return;
        try {
            const buf = await file.arrayBuffer();
            const problem = api.fontFileProblem(buf);
            if (problem) {
                setFontMsg(`Could not use ${file.name}: ${problem}.`);
                input.value = "";
                return;
            }
            const f = api.loadFont(buf);
            const id = `upload:${file.name}`;
            setFonts((m) => ({...m, [id]: f}));
            setOwnFont({id, name: file.name});
            setFontMsg(`Using ${file.name}. It stays in this browser.`);
            chooseFont(id);
        } catch {
            // The parser's own message is technical (and can echo raw bytes),
            // so say it plainly. The current font stays selected.
            setFontMsg(`Could not read ${file.name} as a font. It may be damaged or not a font file. Use a TTF or OTF file.`);
        }
        input.value = "";
    };

    const missing = api && font ? api.missingGlyphs(font, nameList) : [];
    const split = plates.filter((p) => p.pieces !== 1).map((p) => p.name);
    const bars = plates.reduce((n, p) => n + (p.bars || 0), 0);
    const stickOn = !!params.hockeyStick;
    const num = (key: string) => Number(params[key] ?? 0);

    const summary = plates.length
        ? `${plates.length} plate${plates.length > 1 ? "s" : ""}. ` +
          plates.slice(0, 13).map((p) => {
              const b = p.bbox;
              return `${p.name}: ${(b.maxX - b.minX).toFixed(1)} × ${(b.maxY - b.minY).toFixed(1)} mm`;
          }).join("; ") +
          `. Parts: base, letters${stickOn ? ", stick" : ""}.`
        : "No plates yet. Type at least one name.";

    const colors = api?.PART_COLORS ?? {};

    return (
        <>
            <GlobalStyle/>
            <Nav page="nameplate"/>

            <main id="main-content" tabIndex={-1}>
                <HeroSection>
                    <Slab aria-hidden="true"/>
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
                        <Headline>
                            Name
                            <br/>
                            plates
                        </Headline>
                    </HeadlineWrap>
                    <HeroRow>
                        <Intro>{INTRO_COPY}</Intro>
                        <HeroButtons>
                            <PurpleLink href="#tool">MAKE ONE ↓</PurpleLink>
                            <BackButton href="/">← BACK TO WORK</BackButton>
                        </HeroButtons>
                    </HeroRow>
                </HeroSection>

                <Marquee items={MARQUEE_ITEMS} duration={30} bordered/>

                <ToolSection id="tool" aria-label="Nameplate tool">
                    <ToolCard>
                        <Controls>
                            <Group>
                                <legend><FilterLabel>NAMES</FilterLabel></legend>
                                <NamesInput
                                    aria-label="Names, one per line"
                                    spellCheck={false}
                                    autoComplete="off"
                                    value={namesText}
                                    onChange={(e) => {
                                        needsFit.current = true;
                                        setNamesText(e.target.value);
                                    }}
                                />
                                <Note>One plate per line. Names stay in your browser.</Note>
                            </Group>

                            <Group>
                                <legend><FilterLabel>FONT</FilterLabel></legend>
                                <FilterRow>
                                    {(api?.BUNDLED_FONTS ?? []).map((f) => (
                                        <Chip key={f.id} type="button" $active={fontId === f.id}
                                              aria-pressed={fontId === f.id} onClick={() => chooseFont(f.id)}>
                                            {f.label.replace(/\s*\(.*\)/, "").toUpperCase()}
                                        </Chip>
                                    ))}
                                    {ownFont && (
                                        <Chip type="button" $active={fontId === ownFont.id}
                                              aria-pressed={fontId === ownFont.id}
                                              onClick={() => chooseFont(ownFont.id)}>
                                            {ownFont.name.toUpperCase()}
                                        </Chip>
                                    )}
                                </FilterRow>
                                <div>
                                    <OutlineFileLabel>
                                        USE YOUR OWN FONT (TTF / OTF)
                                        <VisuallyHidden type="file" accept=".ttf,.otf,font/ttf,font/otf"
                                                        onChange={onUpload} disabled={!api}/>
                                    </OutlineFileLabel>
                                </div>
                                <Note role="status">
                                    {fontMsg ?? "Your font is read in this browser and never uploaded."}
                                </Note>
                                <Note>Use only fonts whose licence lets you make and share prints with them.</Note>
                            </Group>

                            <Group>
                                <legend><FilterLabel>HOCKEY STICK</FilterLabel></legend>
                                <FilterRow>
                                    <Chip type="button" $active={stickOn} aria-pressed={stickOn}
                                          onClick={() => set("hockeyStick", true)}>ON</Chip>
                                    <Chip type="button" $active={!stickOn} aria-pressed={!stickOn}
                                          onClick={() => set("hockeyStick", false)}>OFF</Chip>
                                </FilterRow>
                                {stickOn && STICK_SLIDERS.map((s) => (
                                    <SliderControl key={s.key} s={s} value={num(s.key)}
                                                   onChange={(v) => set(s.key, v)}/>
                                ))}
                            </Group>

                            <Group>
                                <legend><FilterLabel>SIZE</FilterLabel></legend>
                                {SLIDERS.map((s) => (
                                    <SliderControl key={s.key} s={s} value={num(s.key)}
                                                   onChange={(v) => {
                                                       needsFit.current = s.key === "capHeight";
                                                       set(s.key, v);
                                                   }}/>
                                ))}
                            </Group>

                            <Group>
                                <legend><FilterLabel>OUTLINE</FilterLabel></legend>
                                <FilterRow>
                                    {["ROUND", "SQUARE", "MITER"].map((c) => (
                                        <Chip key={c} type="button" $active={params.cornerStyle === c}
                                              aria-pressed={params.cornerStyle === c}
                                              onClick={() => set("cornerStyle", c)}>{c}</Chip>
                                    ))}
                                </FilterRow>
                                <FilterRow>
                                    <Chip type="button" $active={!!params.fillHoles} aria-pressed={!!params.fillHoles}
                                          onClick={() => set("fillHoles", !params.fillHoles)}>FILL GAPS</Chip>
                                    <Chip type="button" $active={!!params.kerning} aria-pressed={!!params.kerning}
                                          onClick={() => set("kerning", !params.kerning)}>KERNING</Chip>
                                </FilterRow>
                            </Group>

                            <Group>
                                <legend><FilterLabel>DOWNLOAD</FilterLabel></legend>
                                <div>
                                    <PurpleButton type="button" disabled={!plates.length}
                                                  onClick={() => api && saveFile(api.write3MF(plates),
                                                      plates.length === 1 ? api.fileNameFor(plates[0].name) : "nameplates.3mf")}>
                                        DOWNLOAD ALL (ONE .3MF) ↓
                                    </PurpleButton>
                                </div>
                                <FilterRow>
                                    {plates.map((p, i) => (
                                        <Chip key={`${p.name}-${i}`} type="button" $active={false}
                                              onClick={() => api && saveFile(api.write3MF([p]), api.fileNameFor(p.name))}>
                                            {api ? api.fileNameFor(p.name).toUpperCase() : p.name}
                                        </Chip>
                                    ))}
                                </FilterRow>
                            </Group>
                        </Controls>

                        <Stage>
                            <Canvas ref={stageRef}>
                                {!api && (
                                    <Fallback role="status">
                                        {loadError ? "THE TOOL COULD NOT LOAD. RELOAD TO TRY AGAIN." : "LOADING THE TOOL…"}
                                    </Fallback>
                                )}
                            </Canvas>
                            <StageBar>
                                <MetaRow role="status" aria-live="polite">
                                    {buildError ? (
                                        <Flag $tone="warn">{buildError.toUpperCase()}</Flag>
                                    ) : split.length ? (
                                        <Flag $tone="warn">WARNING: {split.join(", ")} WOULD PRINT IN PIECES</Flag>
                                    ) : plates.length ? (
                                        <Flag>
                                            ONE PIECE EACH{bars ? ` · ${bars} JOINING BAR${bars > 1 ? "S" : ""}` : ""}
                                        </Flag>
                                    ) : null}
                                    {missing.length > 0 && (
                                        <Flag $tone="warn">NO {missing.join(" ")} IN THIS FONT</Flag>
                                    )}
                                    <span aria-hidden="true">
                                        {Object.entries(colors)
                                            .filter(([k]) => k !== "stick" || stickOn)
                                            .map(([k, c]) => (
                                                <Legend key={k}>
                                                    <Swatch $c={c}/>{k === "text" ? "LETTERS" : k.toUpperCase()}
                                                </Legend>
                                            ))}
                                    </span>
                                </MetaRow>
                                <OutlineButton type="button" onClick={() => preview.current?.fit()}>
                                    RESET VIEW
                                </OutlineButton>
                            </StageBar>
                            <Summary id="np-summary">{summary}</Summary>
                        </Stage>
                    </ToolCard>
                </ToolSection>

                <Notes>
                    <div>
                        <FilterLabel>ONE PIECE</FilterLabel>
                        <p>
                            Every plate prints as a single piece. Where letters stand apart, or a name has a
                            space, the tool adds a joining bar along the bottom of the letters.
                        </p>
                    </div>
                    <div>
                        <FilterLabel>PRINTING</FilterLabel>
                        <p>
                            Open the 3MF in Bambu Studio or PrusaSlicer. Each plate comes in as one object
                            with its base, letters and stick ready to colour.
                        </p>
                    </div>
                    <div>
                        <FilterLabel>SOURCE</FilterLabel>
                        <p>
                            The tool is free software (GPL-3.0). <a href={TOOL_SOURCE}>Source code</a>
                            {" · "}<a href={`${TOOL_BASE}BUILD-INFO.txt`}>build info</a>
                            {" · "}<a href={`${TOOL_BASE}THIRD-PARTY-NOTICES.md`}>third-party notices</a>
                            {" · "}<a href={`${TOOL_BASE}fonts/LICENSES.md`}>font licences</a>.
                        </p>
                    </div>
                </Notes>
            </main>

            <Contact variant="blog"/>
        </>
    );
}
