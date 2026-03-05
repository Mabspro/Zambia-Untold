import * as THREE from "three";
import { latLngToVector3 } from "./camera";

export type GeoJSONCoords = number[] | number[][] | number[][][];

export function polygonToGlobeLine(
  coordinates: number[][],
  radius: number
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (const [lng, lat] of coordinates) {
    points.push(latLngToVector3(lat, lng, radius));
  }
  return points;
}

type GeoFeature = { geometry: { type: string; coordinates: GeoJSONCoords } };

export function geoJsonToLinePoints(
  geojson: { type: string; features: GeoFeature[] },
  radius: number
): THREE.Vector3[] {
  const allPoints: THREE.Vector3[] = [];
  for (const feature of geojson.features) {
    const geom = feature.geometry;
    if (geom.type === "Polygon" && Array.isArray(geom.coordinates)) {
      const ring = geom.coordinates[0] as number[][];
      const pts = polygonToGlobeLine(ring, radius);
      allPoints.push(...pts);
    } else if (geom.type === "MultiPolygon" && Array.isArray(geom.coordinates)) {
      const polygons = geom.coordinates as unknown as number[][][][];
      for (const polygon of polygons) {
        const ring = polygon[0] as number[][];
        const pts = polygonToGlobeLine(ring, radius);
        allPoints.push(...pts);
      }
    }
  }
  return allPoints;
}

export const MARKER_TO_PROVINCE: Record<string, string> = {
  "kalambo-falls": "Northern",
  "kabwe-skull": "Central",
  "twin-rivers": "Lusaka",
  "ingombe-ilede": "Southern",
  "kansanshi": "North-Western",
  "lusaka-independence": "Lusaka",
};
