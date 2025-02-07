// app/FloatingShapesManager.tsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import FloatingShape, {
    FloatingShapeHandle,
    ShapeType,
} from "./FloatingShape";
import * as THREE from "three";

interface FloatingShapesManagerProps {
    count: number;
}

// Confetti interface (stores position, velocity, color, etc.)
interface ConfettiParticle {
    id: string;
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    lifetime: number; // seconds
    color: string;
}

export default function FloatingShapesManager({ count }: FloatingShapesManagerProps) {
    //
    // 1) SHAPE DEFS & REFS
    //
    const shapeRefs = useRef<React.RefObject<FloatingShapeHandle | null>[]>([]);

    if (shapeRefs.current.length !== count) {
        shapeRefs.current = Array.from({ length: count }, () =>
            React.createRef<FloatingShapeHandle | null>()
        );
    }

    // All possible shape types/colors
    const allTypes: ShapeType[] = ["box", "triangle", "sphere", "lightning"];
    const allColors = [
        "#f76eec",
        "#eae564",
        "#5ac3ff",
        // "#ede461",
        // "#ff9966",
        // "#66ff99"
    ];

    // Generate stable shape definitions so they don't flicker
    const [shapeDefinitions] = useState(() =>
        Array.from({ length: count }, () => {
            const t = allTypes[Math.floor(Math.random() * allTypes.length)];
            const c = allColors[Math.floor(Math.random() * allColors.length)];
            return { type: t, color: c };
        })
    );

    //
    // 2) CONFETTI STATE
    //
    const [confettiList, setConfettiList] = useState<ConfettiParticle[]>([]);

    //
    // 3) COLLISION DETECTION
    //
    const getRadius = (shape: FloatingShapeHandle) => {
        switch (shape.type) {
            case "sphere":
                return 0.8 * shape.scale;
            case "box":
                return 0.8 * shape.scale;
            case "triangle":
                return 0.75 * shape.scale;
            case "lightning":
                return 0.6 * shape.scale;
            case "star":
                return 0.8 * shape.scale;
            default:
                return 0.75 * shape.scale;
        }
    };

    useEffect(() => {
        const restitution = 0.9; // how bouncy shapes are

        const handleCollisions = () => {
            // Collect all shape data from refs
            const shapes = shapeRefs.current
                .map((r) => r.current)
                .filter((s) => s) as FloatingShapeHandle[];

            for (let i = 0; i < shapes.length; i++) {
                for (let j = i + 1; j < shapes.length; j++) {
                    const shapeA = shapes[i];
                    const shapeB = shapes[j];

                    const rA = getRadius(shapeA);
                    const rB = getRadius(shapeB);

                    const posA = shapeA.position;
                    const posB = shapeB.position;
                    const distance = posA.distanceTo(posB);

                    const sumR = rA + rB;

                    if (distance < sumR) {
                        // If they're at exactly the same position, nudge one
                        if (distance === 0) {
                            posA.x += 0.01;
                            continue;
                        }

                        // Collision normal
                        const collisionNormal = posB.clone().sub(posA).normalize();

                        // Overlap
                        const overlap = sumR - distance;
                        const halfOverlap = overlap * 0.5;

                        // Separate them
                        posA.addScaledVector(collisionNormal, -halfOverlap);
                        posB.addScaledVector(collisionNormal, halfOverlap);

                        // Reflect velocities
                        const dotA = shapeA.velocity.dot(collisionNormal);
                        const dotB = shapeB.velocity.dot(collisionNormal);

                        const newVelA = shapeA.velocity
                            .clone()
                            .sub(
                                collisionNormal.clone().multiplyScalar((1 + restitution) * dotA)
                            );
                        const newVelB = shapeB.velocity
                            .clone()
                            .sub(
                                collisionNormal.clone().multiplyScalar((1 + restitution) * dotB)
                            );

                        shapeA.velocity.copy(newVelA);
                        shapeB.velocity.copy(newVelB);

                        //
                        // Spawn confetti at the collision point
                        //
                        const collisionPoint = posA.clone().add(posB).multiplyScalar(0.5);
                        const newParticles: ConfettiParticle[] = [];

                        for (let k = 0; k < 10; k++) {
                            const dir = new THREE.Vector3(
                                Math.random() - 0.5,
                                Math.random() - 0.5,
                                Math.random() - 0.5
                            ).normalize();
                            const speed = 1 + Math.random() * 2;

                            // random color from palette
                            const confettiColor = allColors[Math.floor(Math.random() * allColors.length)];

                            newParticles.push({
                                id: crypto.randomUUID(),
                                position: collisionPoint.clone(),
                                velocity: dir.multiplyScalar(speed),
                                lifetime: 2, // 2 seconds
                                color: confettiColor,
                            });
                        }
                        setConfettiList((prev) => [...prev, ...newParticles]);
                    }
                }
            }
        };

        const interval = setInterval(handleCollisions, 50);
        return () => clearInterval(interval);
    }, [count]);

    //
    // 4) ANIMATE CONFETTI
    //
    useEffect(() => {
        let previousTime = performance.now();

        const animateConfetti = () => {
            const currentTime = performance.now();
            const delta = (currentTime - previousTime) / 1000;
            previousTime = currentTime;

            // Move confetti, reduce lifetime
            setConfettiList((prev) =>
                prev
                    .map((p) => {
                        const newPos = p.position.clone().add(p.velocity.clone().multiplyScalar(delta));
                        return {
                            ...p,
                            position: newPos,
                            lifetime: p.lifetime - delta,
                        };
                    })
                    .filter((p) => p.lifetime > 0)
            );

            requestAnimationFrame(animateConfetti);
        };

        animateConfetti();
    }, []);

    //
    // 5) RENDER
    //
    return (
        <>
            {/* Render stable shapes */}
            {shapeDefinitions.map((def, i) => (
                <FloatingShape
                    key={i}
                    ref={shapeRefs.current[i]}
                    type={def.type}
                    color={def.color}
                />
            ))}

            {/* Render confetti */}
            {confettiList.map((c) => (
                <mesh key={c.id} position={c.position}>
                    <boxGeometry args={[0.05, 0.05, 0.05]} />
                    <meshBasicMaterial color={c.color} />
                </mesh>
            ))}
        </>
    );
}