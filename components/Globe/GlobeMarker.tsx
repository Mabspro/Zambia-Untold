"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Marker } from "@/data/markers";
import { latLngToVector3 } from "@/lib/camera";

type GlobeMarkerProps = {
  marker: Marker;
  active: boolean;
  onClick: (marker: Marker) => void;
};

export function GlobeMarker({ marker, active, onClick }: GlobeMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  // Persistent Vector3 for scale target — avoids a heap allocation every frame (TD-07).
  const scaleVec = useRef(new THREE.Vector3(1, 1, 1));
  const [hovered, setHovered] = useState(false);

  const position = useMemo(
    () =>
      latLngToVector3(marker.coordinates.lat, marker.coordinates.lng, 1.02).toArray(),
    [marker.coordinates.lat, marker.coordinates.lng]
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    
    // Organic heartbeat pulse (double beat pattern)
    const heartbeat = Math.exp(-15 * Math.pow((t * 1.2) % Math.PI - 0.2, 2)) * 0.25 + 
                      Math.exp(-20 * Math.pow((t * 1.2) % Math.PI - 0.6, 2)) * 0.1;
    
    // Inactive markers shrink significantly to maintain visual hierarchy
    const targetScale = active ? 1 + heartbeat : 0.45;
    const hoverScale = hovered ? 1.6 : 1;
    
    // Smooth easing into scales
    const finalScale = targetScale * hoverScale;
    scaleVec.current.setScalar(finalScale);
    meshRef.current.scale.lerp(scaleVec.current, 0.1);
  });

  // Marker taxonomy: geological = stone/earth tone, core = copper glow
  const layer = marker.layer ?? "core";
  const isGeological = layer === "geological";
  const displayColor = isGeological ? "#8B7355" : marker.color;

  return (
    <group
      position={position as [number, number, number]}
      onClick={(event) => {
        event.stopPropagation();
        onClick(marker);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* Outer Glow Halo — geological markers: subtler earth tone */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.022, 20, 20]} />
        <meshBasicMaterial
          color={displayColor}
          transparent
          opacity={active ? (isGeological ? 0.45 : 0.6) : (isGeological ? 0.18 : 0.25)}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
        {/* Core Solid Marker */}
        <mesh>
          <sphereGeometry args={[0.012, 14, 14]} />
          <meshStandardMaterial
            color={displayColor}
            emissive={displayColor}
            emissiveIntensity={active ? (isGeological ? 2.5 : 5) : (isGeological ? 1.2 : 2.2)}
            transparent
            opacity={active ? 1 : 0.7}
          />
        </mesh>
      </mesh>
    </group>
  );
}
