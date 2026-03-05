"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { stateFromYear } from "@/lib/sovereignty";

type SovereigntyStackHUDProps = {
  year: number;
};

export function SovereigntyStackHUD({ year }: SovereigntyStackHUDProps) {
  const groupRef = useRef<THREE.Group>(null);
  const state = stateFromYear(year);

  useFrame(({ camera }) => {
    if (!groupRef.current) return;
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    const right = new THREE.Vector3().crossVectors(camera.up, dir).normalize();
    const offset = right.multiplyScalar(0.55).add(camera.up.clone().multiplyScalar(0.3));
    groupRef.current.position.copy(camera.position).add(dir.multiplyScalar(0.1)).add(offset);
    groupRef.current.quaternion.copy(camera.quaternion);
  });

  return (
    <group ref={groupRef}>
      <Html
        transform
        center
        style={{
          width: 270,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <aside className="rounded border border-copper/35 bg-bg/95 p-3 text-[10px] uppercase tracking-[0.16em] text-text">
          <p className="mb-3 text-[9px] tracking-[0.22em] text-copperSoft">
            Sovereignty Stack
          </p>
          <div className="grid gap-2">
            <div className="border border-copper/25 bg-panel/70 px-2 py-2">
              <p className="text-[9px] text-muted">Governance Layer</p>
              <p className="mt-1 text-[10px] text-text">{state.governance}</p>
            </div>
            <div className="border border-copper/25 bg-panel/70 px-2 py-2">
              <p className="text-[9px] text-muted">Value Layer</p>
              <p className="mt-1 text-[10px] text-text">{state.value}</p>
            </div>
            <div className="border border-copper/25 bg-panel/70 px-2 py-2">
              <p className="text-[9px] text-muted">Infrastructure Layer</p>
              <p className="mt-1 text-[10px] text-text">{state.infrastructure}</p>
            </div>
          </div>
        </aside>
      </Html>
    </group>
  );
}
