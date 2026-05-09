"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

/** Translucent procedural “shield”—statutory opacity as a hollow veil around discourse */
export function ShieldVeil() {
  const outer = useRef<Mesh>(null);
  const inner = useRef<Mesh>(null);

  useFrame((_, dt) => {
    if (outer.current) outer.current.rotation.y += dt * 0.06;
    if (inner.current) inner.current.rotation.y -= dt * 0.04;
  });

  return (
    <group>
      <mesh ref={outer}>
        <icosahedronGeometry args={[3.35, 2]} />
        <meshStandardMaterial
          color="#4a6aa8"
          wireframe
          transparent
          opacity={0.14}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={inner}>
        <sphereGeometry args={[2.95, 48, 48]} />
        <meshStandardMaterial
          color="#223355"
          transparent
          opacity={0.06}
          depthWrite={false}
          roughness={1}
          metalness={0}
        />
      </mesh>
    </group>
  );
}
