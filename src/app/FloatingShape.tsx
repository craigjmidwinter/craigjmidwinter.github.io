// app/FloatingShape.tsx
"use client";

import React, {
    useRef,
    useMemo,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";
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
    ({ type, color }, ref) => {
        const groupRef = useRef<THREE.Group>(null);

        // Generate random scale once
        const scale = useMemo(() => randomBetween(0.5, 1.5), []);

        // Create velocity vector
        const velocity = useMemo(() => new THREE.Vector3(), []);

        // Rotation + angular velocity
        const rotationRef = useRef(new THREE.Euler(0, 0, 0));
        const angularVelocityRef = useRef(
            new THREE.Vector3(
                randomBetween(-0.02, 0.02),
                randomBetween(-0.02, 0.02),
                randomBetween(-0.02, 0.02)
            )
        );

        // Store the shape type
        const shapeType = type;

        // Set initial position + velocity once on mount
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

            // Velocity: aim roughly toward center w/ randomness
            const direction = new THREE.Vector3(-x, -y, 0).normalize();
            direction.x += randomBetween(-0.25, 0.25);
            direction.y += randomBetween(-0.25, 0.25);
            direction.normalize();
            const speed = randomBetween(0.2, 0.7);
            velocity.copy(direction.multiplyScalar(speed));
        }, [velocity]);

        // Expose data to parent (FloatingShapesManager)
        useImperativeHandle(ref, () => ({
            position: groupRef.current ? groupRef.current.position : new THREE.Vector3(),
            velocity,
            scale,
            type: shapeType,
            rotation: rotationRef.current,
            angularVelocity: angularVelocityRef.current,
        }));

        // Animation: update position + rotation every ~frame
        useEffect(() => {
            const boundary = 10;

            const animate = (delta: number) => {
                // 1) Update position
                if (groupRef.current) {
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

                    // 2) Update rotation
                    rotationRef.current.x += angularVelocityRef.current.x * delta * 60;
                    rotationRef.current.y += angularVelocityRef.current.y * delta * 60;
                    rotationRef.current.z += angularVelocityRef.current.z * delta * 60;

                    groupRef.current.rotation.copy(rotationRef.current);
                }

                requestAnimationFrame(() => animate(0.016)); // ~60 fps
            };

            requestAnimationFrame(() => animate(0.016));
        }, [velocity]);

        //
        // Render shape based on type
        //
        if (shapeType === "box") {
            const boxGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
            const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(boxGeometry), [boxGeometry]);
            return (
                <group ref={groupRef} scale={[scale, scale, scale]}>
                    <mesh scale={[1.2, 1.2, 1.2]} geometry={boxGeometry} renderOrder={-1}>
                        <meshBasicMaterial color="black" side={THREE.BackSide} />
                    </mesh>
                    <mesh geometry={boxGeometry}>
                        <meshToonMaterial color={color} />
                    </mesh>
                    <lineSegments scale={[1.05, 1.05, 1.05]} geometry={edgesGeometry}>
                        <lineBasicMaterial color="black" linewidth={2} />
                    </lineSegments>
                </group>
            );
        } else if (shapeType === "triangle") {
            const triangleGeometry = useMemo(() => {
                const geometry = new THREE.BufferGeometry();
                const vertices = new Float32Array([0, 1, 0, -1, -1, 0, 1, -1, 0]);
                geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
                geometry.computeVertexNormals();
                return geometry;
            }, []);
            const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(triangleGeometry), [
                triangleGeometry,
            ]);
            return (
                <group ref={groupRef} scale={[scale, scale, scale]}>
                    <mesh scale={[1.2, 1.2, 1.2]} geometry={triangleGeometry} renderOrder={-1}>
                        <meshBasicMaterial color="black" side={THREE.BackSide} />
                    </mesh>
                    <mesh geometry={triangleGeometry}>
                        <meshToonMaterial color={color} />
                    </mesh>
                    <lineSegments scale={[1.05, 1.05, 1.05]} geometry={edgesGeometry}>
                        <lineBasicMaterial color="black" linewidth={2} />
                    </lineSegments>
                </group>
            );
        } else if (shapeType === "sphere") {
            const sphereGeometry = useMemo(() => new THREE.SphereGeometry(0.75, 32, 32), []);
            return (
                <group ref={groupRef} scale={[scale, scale, scale]}>
                    <mesh geometry={sphereGeometry}>
                        <meshToonMaterial color={color} />
                    </mesh>
                </group>
            );
        } else if (shapeType === "lightning") {
            // Simple zig-zag line
            const lightningGeometry = useMemo(() => {
                const geometry = new THREE.BufferGeometry();
                const vertices = new Float32Array([
                    0, 1, 0,
                    0.2, 0.7, 0,
                    -0.1, 0.4, 0,
                    0.15, 0.1, 0,
                    -0.05, -0.2, 0
                ]);
                geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
                return geometry;
            }, []);
            return (
                <group ref={groupRef} scale={[scale, scale, scale]}>
                    <line geometry={lightningGeometry}>
                        <lineBasicMaterial color={color} />
                    </line>
                </group>
            );
        } else if (shapeType === "star") {
            // 2D star shape
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
            const starGeometry = useMemo(() => new THREE.ShapeGeometry(starShape), [starShape]);
            return (
                <group ref={groupRef} scale={[scale, scale, scale]}>
                    <mesh geometry={starGeometry}>
                        <meshToonMaterial color={color} />
                    </mesh>
                </group>
            );
        }

        return null;
    }
);

export default FloatingShape;
