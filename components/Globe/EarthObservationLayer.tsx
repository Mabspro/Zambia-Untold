"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { latLngToVector3 } from "@/lib/camera";

type EarthObservationLayerProps = {
  active: boolean;
};

type EarthImageryPayload = {
  imageUrl: string;
};

/**
 * Probe Landsat 8 (NASA Earth Imagery API) first via the backend route.
 * If the backend returns 503 (missing NASA_API_KEY or upstream failure),
 * fall back to GIBS (MODIS) via /api/earth/imagery.
 */
async function fetchImageryUrl(): Promise<string | null> {
  const landsatRes = await fetch("/api/earth/imagery/landsat", { cache: "no-store" });
  if (landsatRes.ok) {
    const data = (await landsatRes.json()) as EarthImageryPayload;
    if (data.imageUrl) return data.imageUrl;
  }
  const gibsRes = await fetch("/api/earth/imagery", { cache: "no-store" });
  if (!gibsRes.ok) return null;
  const data = (await gibsRes.json()) as EarthImageryPayload;
  return data.imageUrl ?? null;
}

const ZAMBIA_CENTER = { lat: -13.2, lng: 27.9 };

export function EarthObservationLayer({ active }: EarthObservationLayerProps) {
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const imageryRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [imageryTexture, setImageryTexture] = useState<THREE.Texture | null>(null);

  const center = latLngToVector3(ZAMBIA_CENTER.lat, ZAMBIA_CENTER.lng, 1.028);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;

    const load = async () => {
      try {
        const imageUrl = await fetchImageryUrl();
        if (!imageUrl || cancelled) return;

        const loader = new THREE.TextureLoader();
        loader.crossOrigin = "anonymous";
        loader.load(
          imageUrl,
          (texture) => {
            if (cancelled) return;
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.needsUpdate = true;
            setImageryTexture(texture);
          },
          undefined,
          () => {
            // Keep pulse-only visualization if imagery fails to load.
          }
        );
      } catch {
        // Keep pulse-only visualization if network is unavailable.
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [active]);

  useFrame(({ clock }) => {
    if (!active) return;
    const t = clock.elapsedTime;
    const pulseA = 1 + ((t * 0.7) % 1) * 0.8;
    const pulseB = 1 + (((t * 0.7 + 0.5) % 1) * 0.8);

    if (ringARef.current) {
      ringARef.current.scale.setScalar(pulseA);
      const mat = ringARef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.22 * (1 - ((t * 0.7) % 1));
      ringARef.current.lookAt(camera.position);
    }

    if (ringBRef.current) {
      ringBRef.current.scale.setScalar(pulseB);
      const mat = ringBRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.18 * (1 - ((t * 0.7 + 0.5) % 1));
      ringBRef.current.lookAt(camera.position);
    }

    if (glowRef.current) {
      glowRef.current.lookAt(camera.position);
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.09 + Math.sin(t * 1.8) * 0.03;
    }

    if (imageryRef.current) {
      imageryRef.current.lookAt(camera.position);
      const mat = imageryRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.34 + Math.sin(t * 0.7) * 0.04;
    }
  });

  return (
    <group position={[center.x, center.y, center.z]} visible={active}>
      {imageryTexture && (
        <mesh ref={imageryRef}>
          <planeGeometry args={[0.18, 0.135]} />
          <meshBasicMaterial map={imageryTexture} transparent opacity={0.36} depthWrite={false} />
        </mesh>
      )}
      <mesh ref={glowRef}>
        <circleGeometry args={[0.05, 32]} />
        <meshBasicMaterial color="#4ba3d3" transparent opacity={0.1} depthWrite={false} />
      </mesh>
      <mesh ref={ringARef}>
        <ringGeometry args={[0.02, 0.026, 48]} />
        <meshBasicMaterial color="#8ecbf2" transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <mesh ref={ringBRef}>
        <ringGeometry args={[0.02, 0.026, 48]} />
        <meshBasicMaterial color="#8ecbf2" transparent opacity={0.16} depthWrite={false} />
      </mesh>
    </group>
  );
}
