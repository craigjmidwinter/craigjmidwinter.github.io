// Centralized theme constants — colors, breakpoints, and fonts

export const colors = {
    // Synthwave/cyberpunk palette
    cyan: "#0ff",
    magenta: "#f0f",
    yellow: "#ff0",
    red: "#f00",

    // 3D shape / confetti palette
    shapePink: "#f76eec",
    shapeYellow: "#eae564",
    shapeBlue: "#5ac3ff",

    // Print/paper palette (About, Podcast sections)
    ink: "#231f20",
    cardBg: "rgba(255, 255, 255, 0.9)",

    // Dark backgrounds (Nav, Blog)
    navBg: "rgba(0, 0, 20, 0.9)",
    blogCardBg: "rgba(0, 0, 30, 0.3)",
    blogOverlayBg: "rgba(0, 0, 30, 0.25)",
} as const;

export const breakpoints = {
    mobile: "768px",
} as const;

export const fonts = {
    retro: "'Press Start 2P', monospace",
    mono: "'IBM Plex Mono', monospace",
    display: "'Thunderstorm', sans-serif",
} as const;
