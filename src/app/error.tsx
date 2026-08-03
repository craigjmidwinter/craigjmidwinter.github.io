"use client";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div
            style={{
                minHeight: "60vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                gap: 16,
                padding: "0 clamp(20px, 4vw, 56px)",
                background: "#fbfaf7",
                color: "#111",
                fontFamily: "'Space Grotesk', sans-serif",
            }}
        >
            <div
                style={{
                    font: "500 10px/1 'JetBrains Mono', monospace",
                    letterSpacing: "0.16em",
                    color: "#8e3d94",
                }}
            >
                SOMETHING BROKE
            </div>
            <h1
                style={{
                    margin: 0,
                    font: "700 clamp(30px, 5vw, 64px)/1 'Space Grotesk', sans-serif",
                    letterSpacing: "-0.04em",
                }}
            >
                That wasn&apos;t supposed to happen
            </h1>
            <p style={{margin: 0, font: "400 15px/1.6 'Space Grotesk', sans-serif", maxWidth: "52ch"}}>
                {error?.message || "Unknown error."}
            </p>
            <button
                onClick={reset}
                style={{
                    font: "500 10px/1 'JetBrains Mono', monospace",
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
        </div>
    );
}
