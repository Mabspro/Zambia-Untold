"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { geoJsonToLinePoints } from "@/lib/geo";
import { reportDataIssue } from "@/lib/dataIssues";

const RADIUS = 1.003;
const PULSE_DURATION = 0.5;
const DASH_SCAN_SPEED = 0.8;

type ZambiaBoundaryProps = {
  selectedMarker: boolean;
};

export function ZambiaBoundary({ selectedMarker }: ZambiaBoundaryProps) {
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  const lineRef = useRef<THREE.LineLoop>(null);
  const pulseProgress = useRef(0);
  const hasPulsed = useRef(false);

  useEffect(() => {
    fetch("/data/zambia-boundary.geojson")
      .then((r) => r.json())
      .then((geojson) => {
        const pts = geoJsonToLinePoints(geojson, RADIUS);
        setPoints(pts);
      })
      .catch(() => {
        setPoints([]);
        reportDataIssue({
          source: "ZambiaBoundary",
          message: "Failed to load country boundary GeoJSON",
        });
      });
  }, []);

  useEffect(() => {
    if (selectedMarker) {
      hasPulsed.current = false;
      pulseProgress.current = 0;
    }
  }, [selectedMarker]);

  useFrame((_, delta) => {
    if (!lineRef.current) return;
    const mat = lineRef.current.material as THREE.LineDashedMaterial;
    if (!selectedMarker) {
      mat.opacity = 0.9;
    } else {
      if (!hasPulsed.current) {
        pulseProgress.current += delta / PULSE_DURATION;
        if (pulseProgress.current >= 1) {
          hasPulsed.current = true;
          pulseProgress.current = 1;
        }
        const t = pulseProgress.current;
        const intensity =
          t <= 0.5 ? 1 + t * 2 : 1 + (1 - (t - 0.5) * 2);
        mat.opacity = Math.min(0.85 + 0.15 * intensity, 1);
      }
    }
    // Scanning effect via dashOffset
    // @ts-expect-error dashOffset exists on LineDashedMaterial
    mat.dashOffset -= delta * DASH_SCAN_SPEED;
  });

  const geometry = useMemo(() => {
    if (points.length < 2) return null;
    const positions = new Float32Array(points.length * 3);
    points.forEach((p, i) => {
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    });
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [points]);

  const setLineRef = (el: unknown) => {
    // @ts-expect-error bypass readonly ref typings for callback assignment
    lineRef.current = el as THREE.LineLoop | null;
    if (el && geometry) (el as THREE.LineLoop).computeLineDistances();
  };

  if (!geometry) return null;

  return (
    <lineLoop ref={setLineRef} geometry={geometry}>
      <lineDashedMaterial
        color="#B87333"
        transparent
        opacity={0.9}
        dashSize={0.012}
        gapSize={0.008}
      />
    </lineLoop>
  );
}
