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

  // Marker taxonomy: geological = warm amber, core = vivid red-orange
  const layer = marker.layer ?? "core";
  const isGeological = layer === "geological";
  // High-contrast colors that pop against the dark globe
  const coreColor = "#FF3B30";      // Vivid red for core markers
  const geoColor = "#FF8C00";       // Deep orange for geological
  const displayColor = isGeological ? geoColor : coreColor;

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
      {/* Outer Glow Halo — large, bright, unmissable */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.038, 20, 20]} />
        <meshBasicMaterial
          color={displayColor}
          transparent
          opacity={active ? 0.7 : 0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
        {/* Core Solid Marker — bright, solid center */}
        <mesh>
          <sphereGeometry args={[0.018, 16, 16]} />
          <meshStandardMaterial
            color={displayColor}
            emissive={displayColor}
            emissiveIntensity={active ? 8 : 3.5}
            transparent
            opacity={active ? 1 : 0.85}
          />
        </mesh>
      </mesh>
    </group>
  );
}
