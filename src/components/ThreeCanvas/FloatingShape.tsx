// app/FloatingShape.tsx
"use client";

import React, {forwardRef, ReactElement, useEffect, useImperativeHandle, useMemo, useRef,} from "react";
import * as THREE from "three";

export type ShapeType = "box" | "triangle" | "sphere" | "lightning" | "star";

export interface FloatingShapeHandle {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    scale: number;
    type: ShapeType;
    rotation: THREE.Euler;
    angularVelocity: THREE.Vector3;
}

interface FloatingShapeProps {
    type: ShapeType;
    color: string;
}

function randomBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

const FloatingShape = forwardRef<FloatingShapeHandle, FloatingShapeProps>(
    ({type, color}, ref) => {
        const groupRef = useRef<THREE.Group>(null);

        // 1. Generate random scale once
        const scale = useMemo(() => randomBetween(0.5, 1.5), []);

        // 2. Create velocity vector
        const velocity = useMemo(() => new THREE.Vector3(), []);

        // 3. Rotation + angular velocity
        const rotationRef = useRef(new THREE.Euler(0, 0, 0));
        const angularVelocityRef = useRef(
            new THREE.Vector3(
                randomBetween(-0.02, 0.02),
                randomBetween(-0.02, 0.02),
                randomBetween(-0.02, 0.02)
            )
        );

        // 4. Unconditionally define all geometries via useMemo
        //    (so they are created in the same order every render)

        // Box + Edges
        const boxGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
        const boxEdgesGeometry = useMemo(
            () => new THREE.EdgesGeometry(boxGeometry),
            [boxGeometry]
        );

        // Triangle + Edges
        const triangleGeometry = useMemo(() => {
            const geometry = new THREE.BufferGeometry();
            const vertices = new Float32Array([
                0, 1, 0,
                -1, -1, 0,
                1, -1, 0,
            ]);
            geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
            geometry.computeVertexNormals();
            return geometry;
        }, []);
        const triangleEdgesGeometry = useMemo(
            () => new THREE.EdgesGeometry(triangleGeometry),
            [triangleGeometry]
        );

        // Sphere
        const sphereGeometry = useMemo(
            () => new THREE.SphereGeometry(0.75, 32, 32),
            []
        );

        // Lightning (line geometry)

        // Star (2D shape geometry)
        const starShape = useMemo(() => {
            const shape = new THREE.Shape();
            shape.moveTo(0, 1);
            shape.lineTo(0.2, 0.3);
            shape.lineTo(1, 0.3);
            shape.lineTo(0.3, -0.1);
            shape.lineTo(0.6, -0.8);
            shape.lineTo(0, -0.4);
            shape.lineTo(-0.6, -0.8);
            shape.lineTo(-0.3, -0.1);
            shape.lineTo(-1, 0.3);
            shape.lineTo(-0.2, 0.3);
            shape.closePath();
            return shape;
        }, []);
        const starGeometry = useMemo(
            () => new THREE.ShapeGeometry(starShape),
            [starShape]
        );

        // 5. Set initial position & velocity once on mount
        useEffect(() => {
            const boundary = 10;
            const spawnOffset = 1;
            let x = 0,
                y = 0;
            const edge = Math.floor(Math.random() * 4);

            if (edge === 0) {
                y = boundary + spawnOffset;
                x = randomBetween(-boundary, boundary);
            } else if (edge === 1) {
                y = -boundary - spawnOffset;
                x = randomBetween(-boundary, boundary);
            } else if (edge === 2) {
                x = -boundary - spawnOffset;
                y = randomBetween(-boundary, boundary);
            } else {
                x = boundary + spawnOffset;
                y = randomBetween(-boundary, boundary);
            }

            if (groupRef.current) {
                groupRef.current.position.set(x, y, 0);
            }

            // Aim velocity roughly toward center with randomness
            const direction = new THREE.Vector3(-x, -y, 0).normalize();
            direction.x += randomBetween(-0.25, 0.25);
            direction.y += randomBetween(-0.25, 0.25);
            direction.normalize();
            const speed = randomBetween(0.2, 0.7);
            velocity.copy(direction.multiplyScalar(speed));
        }, [velocity]);

        // 6. Expose data to parent (FloatingShapesManager)
        useImperativeHandle(ref, () => ({
            position: groupRef.current ? groupRef.current.position : new THREE.Vector3(),
            velocity,
            scale,
            type,
            rotation: rotationRef.current,
            angularVelocity: angularVelocityRef.current,
        }));

        // 7. Animation: position & rotation updates
        useEffect(() => {
            const boundary = 10;

            const animate = (delta: number) => {
                if (groupRef.current) {
                    // Move the shape
                    groupRef.current.position.add(velocity.clone().multiplyScalar(delta));
                    const pos = groupRef.current.position;

                    // Respawn if off-screen
                    if (Math.abs(pos.x) > boundary + 2 || Math.abs(pos.y) > boundary + 2) {
                        let x = 0,
                            y = 0;
                        const spawnOffset = 1;
                        const edge = Math.floor(Math.random() * 4);
                        if (edge === 0) {
                            y = boundary + spawnOffset;
                            x = randomBetween(-boundary, boundary);
                        } else if (edge === 1) {
                            y = -boundary - spawnOffset;
                            x = randomBetween(-boundary, boundary);
                        } else if (edge === 2) {
                            x = -boundary - spawnOffset;
                            y = randomBetween(-boundary, boundary);
                        } else {
                            x = boundary + spawnOffset;
                            y = randomBetween(-boundary, boundary);
                        }
                        pos.set(x, y, 0);

                        // New velocity
                        const direction = new THREE.Vector3(-x, -y, 0).normalize();
                        direction.x += randomBetween(-0.25, 0.25);
                        direction.y += randomBetween(-0.25, 0.25);
                        direction.normalize();
                        const speed = randomBetween(0.2, 0.7);
                        velocity.copy(direction.multiplyScalar(speed));
                    }

                    // Rotate the shape
                    rotationRef.current.x += angularVelocityRef.current.x * delta * 60;
                    rotationRef.current.y += angularVelocityRef.current.y * delta * 60;
                    rotationRef.current.z += angularVelocityRef.current.z * delta * 60;

                    groupRef.current.rotation.copy(rotationRef.current);
                }

                // ~60 FPS
                requestAnimationFrame(() => animate(0.016));
            };

            requestAnimationFrame(() => animate(0.016));
        }, [velocity]);

        // 8. Conditionally decide which geometry to render
        let shapeContent: ReactElement | null = null;

        if (type === "box") {
            shapeContent = (
                <>
                    <mesh scale={[1.2, 1.2, 1.2]} geometry={boxGeometry} renderOrder={-1}>
                        <meshBasicMaterial color="black" side={THREE.BackSide}/>
                    </mesh>
                    <mesh geometry={boxGeometry}>
                        <meshToonMaterial color={color}/>
                    </mesh>
                    <lineSegments scale={[1.05, 1.05, 1.05]} geometry={boxEdgesGeometry}>
                        <lineBasicMaterial color="black" linewidth={2}/>
                    </lineSegments>
                </>
            );
        } else if (type === "triangle") {
            shapeContent = (
                <>
                    <mesh
                        scale={[1.2, 1.2, 1.2]}
                        geometry={triangleGeometry}
                        renderOrder={-1}
                    >
                        <meshBasicMaterial color="black" side={THREE.BackSide}/>
                    </mesh>
                    <mesh geometry={triangleGeometry}>
                        <meshToonMaterial color={color}/>
                    </mesh>
                    <lineSegments
                        scale={[1.05, 1.05, 1.05]}
                        geometry={triangleEdgesGeometry}
                    >
                        <lineBasicMaterial color="black" linewidth={2}/>
                    </lineSegments>
                </>
            );
        } else if (type === "sphere") {
            shapeContent = (
                <mesh geometry={sphereGeometry}>
                    <meshToonMaterial color={color}/>
                </mesh>
            );

        } else if (type === "star") {
            shapeContent = (
                <mesh geometry={starGeometry}>
                    <meshToonMaterial color={color}/>
                </mesh>
            );
        }

        // 9. Return a single group with the chosen shape
        return (
            <group ref={groupRef} scale={[scale, scale, scale]}>
                {shapeContent}
            </group>
        );
    }
);

// Fix ESLint "Component definition is missing display name"
FloatingShape.displayName = "FloatingShape";

export default FloatingShape;
