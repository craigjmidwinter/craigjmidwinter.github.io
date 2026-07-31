/**
 * Seeded confetti "marks" generator, ported verbatim from the design comp.
 *
 * The landing page is statically exported (`force-static`), so anything rendered
 * has to be identical on the server and on the client. A linear congruential
 * generator with a fixed seed gives us that determinism — no Math.random, no
 * Date.now, no useEffect needed.
 */

export interface Mark {
    /** CSS `left` offset, e.g. "12.4%" */
    left: string;
    /** CSS `top` offset, e.g. "48.1%" */
    top: string;
    /** width, e.g. "63px" */
    w: string;
    /** height, e.g. "14px" */
    h: string;
    /** background colour */
    bg: string;
    /** full transform string, e.g. "rotate(-12deg)" */
    tf: string;
    /** bare rotation for the `--r` custom property used by the drift keyframes, e.g. "-12deg" */
    rot: string;
    /** negative animation delay so the drift starts mid-cycle, e.g. "-4.2s" */
    delay: string;
}

/** Linear congruential PRNG (glibc constants), masked to 31 bits. */
function rnd(seed: number): () => number {
    let s = seed;
    return () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
}

/**
 * Build `n` confetti marks along a diagonal band.
 *
 * @param seed   PRNG seed — the same seed always yields the same marks.
 * @param n      number of marks to generate.
 * @param spread `[startTop, travel]` in percent: marks run from `startTop` down
 *               to `startTop - travel` as they move left to right.
 */
export function marks(seed: number, n: number, spread: [number, number]): Mark[] {
    const teal = "#00a7a0";
    const purple = "#8e3d94";
    const cols = [teal, teal, purple, purple, "#111", "#e9e64a"];

    const r = rnd(seed);
    const out: Mark[] = [];

    for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        const left = (t * 104 - 8 + (r() - 0.5) * 14).toFixed(1) + "%";
        const top = (spread[0] - t * spread[1] + (r() - 0.5) * 30).toFixed(1) + "%";
        const w = (18 + r() * 84).toFixed(0) + "px";
        const h = (8 + r() * 17).toFixed(0) + "px";
        const bg = cols[Math.floor(r() * cols.length)];
        const deg = (-58 + r() * 116).toFixed(0) + "deg";
        const delay = (-r() * 11).toFixed(1) + "s";

        out.push({left, top, w, h, bg, tf: `rotate(${deg})`, rot: deg, delay});
    }

    return out;
}

/** Shared confetti silhouette — a slightly crumpled parallelogram. */
export const MARK_CLIP = "polygon(2% 24%, 100% 0, 94% 84%, 0 100%)";
