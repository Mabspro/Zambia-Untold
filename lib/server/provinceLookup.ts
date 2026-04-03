import fs from "node:fs";
import path from "node:path";

type GeoJSONBBox = [number, number, number, number];
type PolygonRing = number[][];
type PolygonCoordinates = number[][][];
type MultiPolygonCoordinates = number[][][][];

type GeometryLike = {
  type: string;
  coordinates: unknown;
  bbox?: GeoJSONBBox;
};

type ProvinceFeature = {
  properties?: Record<string, unknown>;
  geometry: GeometryLike;
};

type ProvinceCollection = {
  type: string;
  features: ProvinceFeature[];
};

let provinceFeaturesCache: ProvinceFeature[] | null = null;

function getFeatureName(properties: Record<string, unknown> | null | undefined): string | null {
  if (!properties) return null;

  const candidates = [properties.NAME_1, properties.name, properties.NAME, properties.shapeName];
  const match = candidates.find((value) => typeof value === "string" && value.trim().length > 0);
  return typeof match === "string" ? match : null;
}

function expandBBox(bbox: GeoJSONBBox, lng: number, lat: number): GeoJSONBBox {
  return [
    Math.min(bbox[0], lng),
    Math.min(bbox[1], lat),
    Math.max(bbox[2], lng),
    Math.max(bbox[3], lat),
  ];
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

function getGeometryBBox(geometry: GeometryLike): GeoJSONBBox | null {
  if (geometry.bbox && geometry.bbox.length === 4) {
    return geometry.bbox;
  }

  if (geometry.type === "Polygon" && Array.isArray(geometry.coordinates)) {
    return getPolygonBBox(geometry.coordinates as PolygonCoordinates);
  }

  if (geometry.type === "MultiPolygon" && Array.isArray(geometry.coordinates)) {
    const polygons = geometry.coordinates as MultiPolygonCoordinates;
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

function bboxContainsLngLat(bbox: GeoJSONBBox, lng: number, lat: number): boolean {
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

    if (intersects) inside = !inside;
  }

  return inside;
}

function polygonContainsLngLat(coordinates: PolygonCoordinates, lng: number, lat: number): boolean {
  if (!coordinates.length) return false;

  const [outerRing, ...holes] = coordinates;
  if (!ringContainsLngLat(outerRing, lng, lat)) return false;

  return !holes.some((hole) => ringContainsLngLat(hole, lng, lat));
}

function geometryContainsLngLat(geometry: GeometryLike, lng: number, lat: number): boolean {
  const bbox = getGeometryBBox(geometry);
  if (bbox && !bboxContainsLngLat(bbox, lng, lat)) {
    return false;
  }

  if (geometry.type === "Polygon" && Array.isArray(geometry.coordinates)) {
    return polygonContainsLngLat(geometry.coordinates as PolygonCoordinates, lng, lat);
  }

  if (geometry.type === "MultiPolygon" && Array.isArray(geometry.coordinates)) {
    return (geometry.coordinates as MultiPolygonCoordinates).some((polygon) =>
      polygonContainsLngLat(polygon, lng, lat)
    );
  }

  return false;
}

function loadProvinceFeatures(): ProvinceFeature[] {
  if (provinceFeaturesCache) return provinceFeaturesCache;

  try {
    const filePath = path.join(process.cwd(), "public", "data", "zambia-provinces.normalized.geojson");
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw) as ProvinceCollection;
    provinceFeaturesCache = parsed.features ?? [];
  } catch {
    provinceFeaturesCache = [];
  }

  return provinceFeaturesCache;
}

export function getProvinceForCoordinate(latitude: number | null, longitude: number | null): string | null {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  const province = loadProvinceFeatures().find((feature) =>
    geometryContainsLngLat(feature.geometry, Number(longitude), Number(latitude))
  );

  return getFeatureName(province?.properties) ?? null;
}
