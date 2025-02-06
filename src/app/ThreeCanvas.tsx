// app/ThreeCanvas.tsx
"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import FloatingShape from "@/app/FloatingShape";
import FloatingShapesManager from "@/app/FloatingShapesManager";

/* ---------------------------------------------------
   A simple throttle for rotation updates.
   We accumulate delta time and only update when
   a threshold is reached (here, 0.05 seconds).
--------------------------------------------------- */
function useThrottledRotation(updateCallback: (delta: number) => void, threshold = 0.05) {
    const accumulator = useRef(0);
    useFrame((state, delta) => {
        accumulator.current += delta;
        if (accumulator.current >= threshold) {
            updateCallback(accumulator.current);
            accumulator.current = 0;
        }
    });
}

/* ---------------------------------------------------
   RotatingToonBox – A cube with combined outlines
--------------------------------------------------- */
function RotatingToonBox(props: any) {
    const groupRef = useRef<any>(null);
    const boxGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
    const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(boxGeometry), [boxGeometry]);

    // Throttle the rotation updates
    useThrottledRotation((dt) => {
        if (groupRef.current) {
            groupRef.current.rotation.x += dt;
            groupRef.current.rotation.y += dt;
        }
    }, 0.05);

    return (
        <group ref={groupRef} {...props}>
            {/* Thick background outline – scaled up more */}
            <mesh scale={[1.2, 1.2, 1.2]} geometry={boxGeometry} renderOrder={-1}>
                <meshBasicMaterial color="black" side={THREE.BackSide} />
            </mesh>
            {/* Main cube */}
            <mesh geometry={boxGeometry}>
                <meshToonMaterial color={props.color || "#eae564"} />
            </mesh>
            {/* Foreground outline using EdgesGeometry (scaled slightly up) */}
            <lineSegments scale={[1.05, 1.05, 1.05]} geometry={edgesGeometry}>
                <lineBasicMaterial color="black" linewidth={2} />
            </lineSegments>
        </group>
    );
}

/* ---------------------------------------------------
   RotatingToonTriangle – A triangle that rotates
--------------------------------------------------- */
function RotatingToonTriangle(props: any) {
    const groupRef = useRef<any>(null);
    const triangleGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry();
        // Define a simple triangle (3 vertices)
        const vertices = new Float32Array([
            0, 1, 0,    // top
            -1, -1, 0,  // bottom left
            1, -1, 0,   // bottom right
        ]);
        geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
        geometry.computeVertexNormals();
        return geometry;
    }, []);
    const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(triangleGeometry), [triangleGeometry]);

    useThrottledRotation((dt) => {
        if (groupRef.current) {
            groupRef.current.rotation.z += dt;
        }
    }, 0.05);

    return (
        <group ref={groupRef} {...props}>
            <mesh scale={[1.2, 1.2, 1.2]} geometry={triangleGeometry} renderOrder={-1}>
                <meshBasicMaterial color="black" side={THREE.BackSide} />
            </mesh>
            <mesh geometry={triangleGeometry}>
                <meshToonMaterial color={props.color || "#f76eec"} />
            </mesh>
            <lineSegments scale={[1.05, 1.05, 1.05]} geometry={edgesGeometry}>
                <lineBasicMaterial color="black" linewidth={2} />
            </lineSegments>
        </group>
    );
}

/* ---------------------------------------------------
   InteractiveToonSphere – A sphere that remains in place
   but rotates slightly based on mouse proximity.
   (No outline is rendered on the sphere.)
--------------------------------------------------- */
function InteractiveToonSphere(props: any) {
    const groupRef = useRef<any>(null);
    const sphereGeometry = useMemo(() => new THREE.SphereGeometry(0.75, 32, 32), []);
    const { mouse } = useThree();

    useFrame(() => {
        if (groupRef.current) {
            // Compute the distance of the mouse from the center in normalized coordinates.
            const distance = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y);
            const threshold = 0.5; // Only rotate if the mouse is within this distance
            if (distance < threshold) {
                // Target rotation based on mouse offset.
                const targetX = mouse.y * 0.5;
                const targetY = mouse.x * 0.5;
                // Smoothly interpolate the rotation.
                groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.1);
                groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.1);
            } else {
                // Gradually return to base rotation (0,0).
                groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.05);
                groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.05);
            }
        }
    });

    return (
        <group ref={groupRef} {...props}>
            <mesh geometry={sphereGeometry}>
                <meshToonMaterial color="#5ac3ff" />
            </mesh>
        </group>
    );
}

/* ---------------------------------------------------
   ThreeCanvas – Renders the 3D scene with scattered shapes.
--------------------------------------------------- */
export default function ThreeCanvas() {
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
            camera={{ position: [0, 0, 5], fov: 75 }}
        >
            <ambientLight intensity={2} />
            <FloatingShapesManager count={10} />
        </Canvas>
    );
}