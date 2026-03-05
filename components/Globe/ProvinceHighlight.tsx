"use client";

import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { geoJsonToLinePoints, MARKER_TO_PROVINCE } from "@/lib/geo";
import { reportDataIssue } from "@/lib/dataIssues";

const RADIUS = 1.002;

type ProvinceHighlightProps = {
  activeMarkerId: string | null;
};

export function ProvinceHighlight({ activeMarkerId }: ProvinceHighlightProps) {
  const [provinces, setProvinces] = useState<
    Array<{ name: string; points: THREE.Vector3[] }>
  >([]);

  useEffect(() => {
    fetch("/data/zambia-provinces.geojson")
      .then((r) => r.json())
      .then((geojson) => {
        const features = geojson.features || [];
        const result = features.map((f: { properties: { NAME_1: string }; geometry: { type: string; coordinates: number[][][] } }) => {
          const pts = geoJsonToLinePoints(
            { type: "FeatureCollection", features: [{ geometry: f.geometry }] },
            RADIUS
          );
          return { name: f.properties.NAME_1, points: pts };
        });
        setProvinces(result);
      })
      .catch(() => {
        setProvinces([]);
        reportDataIssue({
          source: "ProvinceHighlight",
          message: "Failed to load province boundaries GeoJSON",
        });
      });
  }, []);

  const provinceName = activeMarkerId
    ? MARKER_TO_PROVINCE[activeMarkerId]
    : null;

  const activeProvince = useMemo(() => {
    if (!provinceName) return null;
    return provinces.find(
      (p) => p.name === provinceName || p.name.replace(/\s+/g, "-") === provinceName.replace(/\s+/g, "-")
    );
  }, [provinceName, provinces]);

  const geometry = useMemo(() => {
    if (!activeProvince || activeProvince.points.length < 2) return null;
    const positions = new Float32Array(activeProvince.points.length * 3);
    activeProvince.points.forEach((p, i) => {
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    });
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [activeProvince]);

  if (!geometry) return null;

  return (
    <lineLoop geometry={geometry}>
      <lineBasicMaterial
        color="#C8851A"
        transparent
        opacity={0.85}
      />
    </lineLoop>
  );
}
