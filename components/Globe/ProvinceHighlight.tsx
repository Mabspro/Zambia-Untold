"use client";

import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { MARKERS } from "@/data/markers";
import {
  geoJsonToLinePoints,
  geometryContainsLngLat,
  getFeatureName,
  getGeometryBBox,
  getGeometryWindingWarnings,
  bboxContainsLngLat,
  MARKER_TO_PROVINCE,
  normalizeProvinceName,
  type GeoJSONBBox,
  type GeoJSONCoords,
} from "@/lib/geo";
import { reportDataIssue } from "@/lib/dataIssues";

const RADIUS = 1.002;

type ProvinceHighlightProps = {
  activeMarkerId: string | null;
};

type ProvinceGeometry = {
  type: string;
  coordinates: GeoJSONCoords;
  bbox?: GeoJSONBBox;
};

export function ProvinceHighlight({ activeMarkerId }: ProvinceHighlightProps) {
  const [provinces, setProvinces] = useState<
    Array<{ name: string; points: THREE.Vector3[]; geometry: ProvinceGeometry }>
  >([]);

  useEffect(() => {
    fetch("/data/zambia-provinces.geojson")
      .then((r) => r.json())
      .then((geojson) => {
        const features = geojson.features || [];
        const result = features.flatMap((feature: { properties?: Record<string, unknown>; geometry: ProvinceGeometry }) => {
          const name = getFeatureName(feature.properties);
          if (!name) {
            if (process.env.NODE_ENV !== "production") {
              reportDataIssue({
                source: "ProvinceHighlight",
                message: "Province feature missing supported name property (NAME_1, name, NAME)",
              });
              console.warn("[ProvinceHighlight] Province feature missing supported name property", feature.properties);
            }
            return [];
          }

          const pts = geoJsonToLinePoints(
            { type: "FeatureCollection", features: [{ geometry: feature.geometry }] },
            RADIUS
          );
          return [{ name, points: pts, geometry: feature.geometry }];
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

  useEffect(() => {
    if (process.env.NODE_ENV === "production" || provinces.length === 0) return;

    const available = new Map(provinces.map((province) => [normalizeProvinceName(province.name), province]));
    const missingMappings = Object.entries(MARKER_TO_PROVINCE).filter(([, provinceName]) => !available.has(normalizeProvinceName(provinceName)));

    if (missingMappings.length > 0) {
      const message = `Province mappings missing from loaded GeoJSON: ${missingMappings
        .map(([markerId, provinceName]) => `${markerId} -> ${provinceName}`)
        .join(", ")}`;

      reportDataIssue({
        source: "ProvinceHighlight",
        message,
      });

      console.warn(`[ProvinceHighlight] ${message}`);
    }

    const windingWarnings = provinces.flatMap((province) => {
      const warnings = getGeometryWindingWarnings(province.geometry);
      return warnings.map((warning) => `${province.name}: ${warning}`);
    });

    if (windingWarnings.length > 0) {
      const message = `Non-compliant GeoJSON winding order: ${windingWarnings.join(", ")}`;
      reportDataIssue({
        source: "ProvinceHighlight",
        message,
      });
      console.warn(`[ProvinceHighlight] ${message}`);
    }

    const geometryMismatches = MARKERS.flatMap((marker) => {
      const mappedProvinceName = MARKER_TO_PROVINCE[marker.id];
      if (!mappedProvinceName) return [];

      const province = available.get(normalizeProvinceName(mappedProvinceName));
      if (!province) return [];

      const bbox = getGeometryBBox(province.geometry);
      if (bbox && !bboxContainsLngLat(bbox, marker.coordinates.lng, marker.coordinates.lat)) {
        return [`${marker.id} @ ${mappedProvinceName} (outside bbox)`];
      }

      const containsMarker = geometryContainsLngLat(
        province.geometry,
        marker.coordinates.lng,
        marker.coordinates.lat
      );

      return containsMarker ? [] : [`${marker.id} @ ${mappedProvinceName}`];
    });

    if (geometryMismatches.length > 0) {
      const message = `Marker coordinates fall outside mapped province geometry: ${geometryMismatches.join(", ")}`;

      reportDataIssue({
        source: "ProvinceHighlight",
        message,
      });

      console.warn(`[ProvinceHighlight] ${message}`);
    }
  }, [provinces]);

  const provinceName = activeMarkerId
    ? MARKER_TO_PROVINCE[activeMarkerId]
    : null;

  const activeProvince = useMemo(() => {
    if (!provinceName) return null;
    const normalizedTarget = normalizeProvinceName(provinceName);
    return provinces.find((province) => normalizeProvinceName(province.name) === normalizedTarget);
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
