"use client";

/**
 * FlyToPin — temporary confirmation marker after a Village Search fly-to.
 *
 * When the globe camera flies to an arbitrary coordinate (e.g. "Kasama"),
 * this component drops a copper pin at that location with the place name.
 * Fades out after 10 seconds or on next user interaction via onExpire().
 *
 * Renders inside the R3F Canvas as a 3D marker + Drei Html label.
 * Sprint C0 · March 2026
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { latLngToVector3 } from "@/lib/camera";

type FlyToPinProps = {
  lat: number;
  lng: number;
  placeName?: string;
  onExpire?: () => void;
};

export function FlyToPin({ lat, lng, placeName, onExpire }: FlyToPinProps) {
  const ageRef = useRef(0);
  const meshRef = useRef<THREE.Mesh>(null);
  const position = latLngToVector3(lat, lng, 1.025).toArray() as [number, number, number];

  useFrame((_, delta) => {
    ageRef.current += delta;
    // Fade out between 8–10 seconds
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      if (ageRef.current > 8) {
        const fadeProgress = Math.max(0, 1 - (ageRef.current - 8) / 2);
        mat.opacity = fadeProgress * 0.9;
      }
    }
    // Call onExpire at 10 seconds
    if (ageRef.current > 10 && onExpire) {
      onExpire();
    }
  });

  return (
    <group position={position}>
      {/* Copper pin dot */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshBasicMaterial
          color="#B87333"
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </mesh>
      {/* Outer glow ring */}
      <mesh>
        <sphereGeometry args={[0.032, 12, 12]} />
        <meshBasicMaterial
          color="#B87333"
          transparent
          opacity={0.25}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Place name label */}
      {placeName && (
        <Html
          center
          distanceFactor={8}
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          <div
            style={{
              background: "rgba(3,4,5,0.88)",
              border: "1px solid rgba(184,115,51,0.4)",
              borderRadius: "3px",
              padding: "2px 7px",
              backdropFilter: "blur(4px)",
              whiteSpace: "nowrap",
            }}
          >
            <p
              style={{
                fontFamily: "Courier New, monospace",
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "#D4943A",
                margin: 0,
              }}
            >
              📍 {placeName}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}
