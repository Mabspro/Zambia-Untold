"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { latLngToVector3 } from "@/lib/camera";
import { lttbDownsample, type LTTBPoint } from "@/lib/lttb";

const COPPERBELT_CENTERS: [number, number][] = [
  [-12.08, 25.87],
  [-12.5, 25.8],
  [-12.8, 28.4],
];

const MAX_PARTICLES = 500;
const PULSE_DURATION = 4;
const RADIUS_SURFACE = 1.003;
const RADIUS_DEPTH = 0.992;

type KatangaFormationLayerProps = {
  scrubYear: number;
  visible?: boolean;
};

function generateCopperbeltPoints(): LTTBPoint<{ lat: number; lng: number }>[] {
  const raw: LTTBPoint<{ lat: number; lng: number }>[] = [];
  for (const [clat, clng] of COPPERBELT_CENTERS) {
    for (let i = 0; i < 250; i += 1) {
      const lat = clat + (Math.random() - 0.5) * 1.2;
      const lng = clng + (Math.random() - 0.5) * 1.5;
      raw.push({ x: lng, y: lat, payload: { lat, lng } });
    }
  }
  return lttbDownsample(raw, MAX_PARTICLES);
}

export function KatangaFormationLayer({
  scrubYear,
  visible = true,
}: KatangaFormationLayerProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const phaseRef = useRef(0);

  const isActive = scrubYear < -500_000_000;

  const geometry = useMemo(() => {
    const pts = generateCopperbeltPoints();
    const positions = new Float32Array(pts.length * 3);
    const alphas = new Float32Array(pts.length);

    pts.forEach((p, i) => {
      const pos = latLngToVector3(p.payload.lat, p.payload.lng, RADIUS_SURFACE);
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;
      alphas[i] = 0;
    });

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
    geom.computeBoundingSphere();

    return geom;
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const alphaAttr = geometry.getAttribute("alpha") as THREE.BufferAttribute;
    const alphas = alphaAttr.array as Float32Array;

    if (isActive) {
      phaseRef.current += delta / PULSE_DURATION;
      if (phaseRef.current > 1) phaseRef.current = 0;
    } else {
      phaseRef.current = 0;
    }

    const t = phaseRef.current;
    const risePhase = Math.min(1, t * 2);
    const holdPhase = t > 0.5 && t < 0.85 ? 1 : t >= 0.85 ? 1 - (t - 0.85) * 6.67 : 0;

    for (let i = 0; i < alphas.length; i += 1) {
      const noise = 0.7 + 0.3 * Math.sin(i * 0.1 + phaseRef.current * 20);
      alphas[i] = isActive ? risePhase * holdPhase * noise * 0.9 : 0;
    }

    alphaAttr.needsUpdate = true;
  });

  if (!visible || !isActive) return null;

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          attribute float alpha;
          varying float vAlpha;
          void main() {
            vAlpha = alpha;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = 3.0 * (1.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          void main() {
            float d = distance(gl_PointCoord, vec2(0.5));
            float shape = smoothstep(0.5, 0.1, d);
            vec3 copper = vec3(0.78, 0.53, 0.18);
            gl_FragColor = vec4(copper, vAlpha * shape);
          }
        `}
      />
    </points>
  );
}
