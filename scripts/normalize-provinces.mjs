#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const DEFAULT_INPUT = "public/data/zambia-provinces.geojson";
const DEFAULT_OUTPUT = "public/data/zambia-provinces.normalized.geojson";
const DEFAULT_PRECISION = 6;

function printUsage() {
  console.log([
    "Usage:",
    "  node scripts/normalize-provinces.mjs [--input <path>] [--output <path>] [--precision <digits>] [--write]",
    "",
    "Examples:",
    "  node scripts/normalize-provinces.mjs",
    "  node scripts/normalize-provinces.mjs --write",
    "  node scripts/normalize-provinces.mjs --input public/data/source.geojson --output public/data/normalized.geojson",
  ].join("\n"));
}

function parseArgs(argv) {
  const options = {
    input: DEFAULT_INPUT,
    output: DEFAULT_OUTPUT,
    precision: DEFAULT_PRECISION,
    write: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }
    if (arg === "--write") {
      options.write = true;
      continue;
    }
    if (arg === "--input") {
      options.input = argv[index + 1] ?? options.input;
      index += 1;
      continue;
    }
    if (arg === "--output") {
      options.output = argv[index + 1] ?? options.output;
      index += 1;
      continue;
    }
    if (arg === "--precision") {
      const next = Number(argv[index + 1]);
      if (!Number.isInteger(next) || next < 0 || next > 12) {
        throw new Error("--precision must be an integer between 0 and 12.");
      }
      options.precision = next;
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (options.write) {
    options.output = options.input;
  }

  return options;
}

function roundCoordinate(value, precision) {
  return Number(value.toFixed(precision));
}

function normalizeCoordinates(coords, precision) {
  if (!Array.isArray(coords)) {
    return coords;
  }

  if (coords.length > 0 && typeof coords[0] === "number") {
    return coords.map((value) => roundCoordinate(value, precision));
  }

  return coords.map((entry) => normalizeCoordinates(entry, precision));
}

function createEmptyBBox() {
  return [Infinity, Infinity, -Infinity, -Infinity];
}

function expandBBox(bbox, lng, lat) {
  bbox[0] = Math.min(bbox[0], lng);
  bbox[1] = Math.min(bbox[1], lat);
  bbox[2] = Math.max(bbox[2], lng);
  bbox[3] = Math.max(bbox[3], lat);
}

function bboxFromCoordinates(coords, bbox = createEmptyBBox()) {
  if (!Array.isArray(coords)) return bbox;

  if (coords.length > 0 && typeof coords[0] === "number") {
    expandBBox(bbox, coords[0], coords[1]);
    return bbox;
  }

  for (const entry of coords) {
    bboxFromCoordinates(entry, bbox);
  }

  return bbox;
}

function finalizeBBox(bbox, precision) {
  if (!Number.isFinite(bbox[0])) return null;
  return bbox.map((value) => Number(value.toFixed(precision)));
}

function getFeatureName(properties) {
  if (!properties || typeof properties !== "object") return null;
  const candidates = [properties.NAME_1, properties.name, properties.NAME, properties.shapeName];
  const match = candidates.find((value) => typeof value === "string" && value.trim().length > 0);
  return typeof match === "string" ? match.trim() : null;
}

function normalizeFeature(feature, precision, index, issues) {
  if (!feature || feature.type !== "Feature") {
    issues.push(`Feature ${index + 1}: non-Feature entry encountered.`);
    return feature;
  }

  if (!feature.geometry || typeof feature.geometry.type !== "string") {
    issues.push(`Feature ${index + 1}: missing geometry.`);
    return feature;
  }

  const normalizedGeometry = {
    ...feature.geometry,
    coordinates: normalizeCoordinates(feature.geometry.coordinates, precision),
  };

  const bbox = finalizeBBox(bboxFromCoordinates(normalizedGeometry.coordinates), precision);
  const featureName = getFeatureName(feature.properties);
  if (!featureName) {
    issues.push(`Feature ${index + 1}: missing supported province name property (NAME_1, name, NAME).`);
  }

  return {
    ...feature,
    geometry: normalizedGeometry,
    bbox: bbox ?? undefined,
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printUsage();
    return;
  }

  const inputPath = path.resolve(process.cwd(), options.input);
  const outputPath = path.resolve(process.cwd(), options.output);
  const raw = await fs.readFile(inputPath, "utf8");
  const geojson = JSON.parse(raw);

  if (!geojson || geojson.type !== "FeatureCollection" || !Array.isArray(geojson.features)) {
    throw new Error("Input must be a GeoJSON FeatureCollection.");
  }

  const issues = [];
  const normalizedFeatures = geojson.features.map((feature, index) =>
    normalizeFeature(feature, options.precision, index, issues)
  );

  const collectionBBox = finalizeBBox(
    normalizedFeatures.reduce((bbox, feature) => {
      if (Array.isArray(feature?.bbox) && feature.bbox.length === 4) {
        expandBBox(bbox, feature.bbox[0], feature.bbox[1]);
        expandBBox(bbox, feature.bbox[2], feature.bbox[3]);
      }
      return bbox;
    }, createEmptyBBox()),
    options.precision
  );

  const normalized = {
    ...geojson,
    features: normalizedFeatures,
    bbox: collectionBBox ?? undefined,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");

  console.log(`Normalized ${normalizedFeatures.length} features.`);
  console.log(`Input:  ${inputPath}`);
  console.log(`Output: ${outputPath}`);
  console.log(`Precision: ${options.precision} decimal places`);

  if (issues.length > 0) {
    console.warn("Warnings:");
    for (const issue of issues) {
      console.warn(`- ${issue}`);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

