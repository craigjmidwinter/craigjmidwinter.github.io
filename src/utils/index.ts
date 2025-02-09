export const generateZigZagPolygon = (zigzagCount = 20, amplitudeVW = 2) => {
    // We'll move horizontally in percentages, but go vertically in vw units.
    // NOTE: Some browsers may have issues mixing % and vw in the same clip-path.
    const points: string[] = [];
    const step = 100 / (zigzagCount * 2); // each zigzag peak has 2 steps

    for (let i = 0; i <= zigzagCount * 2; i++) {
        const x = i * step;
        // For even indices, go "down" amplitudeVW; for odd, stay at 0
        // We'll represent amplitude in "vw"
        const y = i % 2 === 0 ? `${amplitudeVW}vw` : `0`;
        points.push(`${x}% ${y}`);
    }
    // Close the shape at the bottom
    points.push(`100% 100%`);
    points.push(`0 100%`);

    return `polygon(${points.join(", ")})`;
};