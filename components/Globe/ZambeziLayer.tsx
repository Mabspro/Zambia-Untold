"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getZambeziLinePoints, getZambeziState } from "@/data/zambeziPath";

const KARIBA_INDEX = 9;

type ZambeziLayerProps = {
  scrubYear: number;
  visible?: boolean;
};

export function ZambeziLayer({ scrubYear, visible = true }: ZambeziLayerProps) {
  const lineRef = useRef<THREE.Line>(null);
  const pulsePhase = useRef(0);

  const state = getZambeziState(scrubYear);

  const { fullGeometry, upperGeometry } = useMemo(() => {
    const pts = getZambeziLinePoints();
    const positions = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => {
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    });
    const full = new THREE.BufferGeometry();
    full.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const upperPts = pts.slice(0, KARIBA_INDEX + 1);
    const upperPos = new Float32Array(upperPts.length * 3);
    upperPts.forEach((p, i) => {
      upperPos[i * 3] = p.x;
      upperPos[i * 3 + 1] = p.y;
      upperPos[i * 3 + 2] = p.z;
    });
    const upper = new THREE.BufferGeometry();
    upper.setAttribute("position", new THREE.BufferAttribute(upperPos, 3));

    return { fullGeometry: full, upperGeometry: upper };
  }, []);

  const lineInstance = useMemo(() => {
    const geom = fullGeometry;
    const l = new THREE.Line(
      geom,
      new THREE.LineBasicMaterial({ color: "#5a9a7a", transparent: true, opacity: 0.7 })
    );
    l.computeLineDistances();
    return l;
  }, [fullGeometry]);

  useFrame((_, delta) => {
    if (!lineRef.current) return;
    const mat = lineRef.current.material as THREE.LineBasicMaterial;
    const geom = state === "dammed" ? upperGeometry : fullGeometry;
    if (lineRef.current.geometry !== geom) {
      lineRef.current.geometry = geom;
      lineRef.current.computeLineDistances();
    }
    mat.color.set(state === "dammed" ? "#6b7d8a" : "#5a9a7a");
    mat.opacity = state === "highway" ? 0.7 : state === "dammed" ? 0.5 : 0.5;
    if (state === "pleistocene") {
      pulsePhase.current += delta * 0.4;
      const t = (Math.sin(pulsePhase.current) + 1) / 2;
      mat.opacity = 0.3 + t * 0.4;
    }
  });

  if (!visible || state === "proto") return null;

  return <primitive ref={lineRef} object={lineInstance} />;
}
