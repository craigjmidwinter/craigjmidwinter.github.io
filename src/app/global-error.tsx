"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
        <body
            style={{
                margin: 0,
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                gap: 16,
                padding: "0 48px",
                background: "#fbfaf7",
                color: "#111",
                fontFamily: "sans-serif",
            }}
        >
        <div style={{fontSize: 11, letterSpacing: "0.16em", color: "#8e3d94", fontFamily: "monospace"}}>
            SOMETHING BROKE, BADLY
        </div>
        <h1 style={{margin: 0, fontSize: 48, letterSpacing: "-0.03em"}}>
            That really wasn&apos;t supposed to happen
        </h1>
        <p style={{margin: 0, maxWidth: "52ch"}}>{error?.message || "Unknown error."}</p>
        <button
            onClick={reset}
            style={{
                fontFamily: "monospace",
                fontSize: 11,
                letterSpacing: "0.12em",
                padding: "13px 17px",
                background: "#111",
                color: "#fbfaf7",
                border: "none",
                cursor: "pointer",
            }}
        >
            TRY AGAIN
        </button>
        </body>
        </html>
    );
}
