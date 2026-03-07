import * as THREE from "three";
import { latLngToVector3 } from "./camera";

export type GeoJSONCoords = number[] | number[][] | number[][][];
export type GeoJSONBBox = [number, number, number, number];

type PolygonRing = number[][];
type PolygonCoordinates = number[][][];
type MultiPolygonCoordinates = number[][][][];

type GeometryLike = {
  type: string;
  coordinates: GeoJSONCoords;
  bbox?: GeoJSONBBox;
};

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

type GeoFeature = { geometry: GeometryLike };

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

export function normalizeProvinceName(value: string): string {
  return value.trim().replace(/\s+/g, "-").toLowerCase();
}

function expandBBox(bbox: GeoJSONBBox, lng: number, lat: number): GeoJSONBBox {
  return [
    Math.min(bbox[0], lng),
    Math.min(bbox[1], lat),
    Math.max(bbox[2], lng),
    Math.max(bbox[3], lat),
  ];
}

function getRingSignedArea(ring: PolygonRing): number {
  let area = 0;

  for (let i = 0; i < ring.length - 1; i += 1) {
    const [lngA, latA] = ring[i];
    const [lngB, latB] = ring[i + 1];
    area += lngA * latB - lngB * latA;
  }

  return area / 2;
}

export function isRingClockwise(ring: PolygonRing): boolean {
  return getRingSignedArea(ring) < 0;
}

function getPolygonBBox(coordinates: PolygonCoordinates): GeoJSONBBox | null {
  if (!coordinates.length || !coordinates[0].length) return null;

  let bbox: GeoJSONBBox = [
    coordinates[0][0][0],
    coordinates[0][0][1],
    coordinates[0][0][0],
    coordinates[0][0][1],
  ];

  for (const ring of coordinates) {
    for (const [lng, lat] of ring) {
      bbox = expandBBox(bbox, lng, lat);
    }
  }

  return bbox;
}

export function getGeometryBBox(geometry: GeometryLike): GeoJSONBBox | null {
  if (geometry.bbox && geometry.bbox.length === 4) {
    return geometry.bbox;
  }

  if (geometry.type === "Polygon" && Array.isArray(geometry.coordinates)) {
    return getPolygonBBox(geometry.coordinates as PolygonCoordinates);
  }

  if (geometry.type === "MultiPolygon" && Array.isArray(geometry.coordinates)) {
    const polygons = geometry.coordinates as unknown as MultiPolygonCoordinates;
    let bbox: GeoJSONBBox | null = null;

    for (const polygon of polygons) {
      const polygonBBox = getPolygonBBox(polygon);
      if (!polygonBBox) continue;
      bbox = bbox
        ? [
            Math.min(bbox[0], polygonBBox[0]),
            Math.min(bbox[1], polygonBBox[1]),
            Math.max(bbox[2], polygonBBox[2]),
            Math.max(bbox[3], polygonBBox[3]),
          ]
        : polygonBBox;
    }

    return bbox;
  }

  return null;
}

export function bboxContainsLngLat(bbox: GeoJSONBBox, lng: number, lat: number): boolean {
  return lng >= bbox[0] && lng <= bbox[2] && lat >= bbox[1] && lat <= bbox[3];
}

function ringContainsLngLat(ring: PolygonRing, lng: number, lat: number): boolean {
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [lngA, latA] = ring[i];
    const [lngB, latB] = ring[j];
    const intersects =
      (latA > lat) !== (latB > lat) &&
      lng < ((lngB - lngA) * (lat - latA)) / ((latB - latA) || Number.EPSILON) + lngA;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

function polygonContainsLngLat(coordinates: PolygonCoordinates, lng: number, lat: number): boolean {
  if (!coordinates.length) return false;

  const [outerRing, ...holes] = coordinates;
  if (!ringContainsLngLat(outerRing, lng, lat)) return false;

  return !holes.some((hole) => ringContainsLngLat(hole, lng, lat));
}

export function geometryContainsLngLat(
  geometry: GeometryLike,
  lng: number,
  lat: number
): boolean {
  const bbox = getGeometryBBox(geometry);
  if (bbox && !bboxContainsLngLat(bbox, lng, lat)) {
    return false;
  }

  if (geometry.type === "Polygon" && Array.isArray(geometry.coordinates)) {
    return polygonContainsLngLat(geometry.coordinates as PolygonCoordinates, lng, lat);
  }

  if (geometry.type === "MultiPolygon" && Array.isArray(geometry.coordinates)) {
    return (geometry.coordinates as unknown as MultiPolygonCoordinates).some((polygon) =>
      polygonContainsLngLat(polygon, lng, lat)
    );
  }

  return false;
}

export function getGeometryWindingWarnings(geometry: GeometryLike): string[] {
  if (geometry.type !== "Polygon" && geometry.type !== "MultiPolygon") {
    return [];
  }

  const polygons = geometry.type === "Polygon"
    ? [geometry.coordinates as PolygonCoordinates]
    : (geometry.coordinates as unknown as MultiPolygonCoordinates);

  const warnings: string[] = [];

  polygons.forEach((polygon, polygonIndex) => {
    if (!polygon.length) return;

    const [outerRing, ...holes] = polygon;
    if (isRingClockwise(outerRing)) {
      warnings.push(`polygon ${polygonIndex + 1} exterior ring is clockwise`);
    }

    holes.forEach((hole, holeIndex) => {
      if (!isRingClockwise(hole)) {
        warnings.push(`polygon ${polygonIndex + 1} hole ${holeIndex + 1} is counterclockwise`);
      }
    });
  });

  return warnings;
}

export function getFeatureName(properties: Record<string, unknown> | null | undefined): string | null {
  if (!properties) return null;

  const candidates = [properties.NAME_1, properties.name, properties.NAME, properties.shapeName];
  const match = candidates.find((value) => typeof value === "string" && value.trim().length > 0);
  return typeof match === "string" ? match.trim() : null;
}

export const MARKER_TO_PROVINCE: Record<string, string> = {
  "kalambo-falls": "Northern",
  "kabwe-skull": "Central",
  "twin-rivers": "Central",
  "ingombe-ilede": "Southern",
  "kansanshi": "North-Western",
  "lusaka-independence": "Lusaka",
  "nkoloso-space-academy": "Lusaka",
  "katanga-substrate": "Copperbelt",
  "kariba-dam": "Southern",
  "copperbelt-railway": "Copperbelt",
};


