// app/ThreeCanvas.tsx
"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import FloatingShapesManager from "@/app/FloatingShapesManager";

export default function ThreeCanvas(): React.ReactElement {
    return (
        <Canvas
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 2,
            }}
            camera={{ position: [0, 0, 5] }}
        >
            <ambientLight intensity={2} />
            {/* Only render the floating shapes manager */}
            <FloatingShapesManager count={15} />
        </Canvas>
    );
}
