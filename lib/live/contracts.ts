export type LiveLayerId =
  | "surface-water"
  | "fire-hotspots"
  | "vegetation-anomaly"
  | "eo-imagery"
  | "satellite-awareness"
  | "air-quality"
  | "geohazard";

export type LiveLayerContract = {
  id: LiveLayerId;
  label: string;
  domain: "water" | "fire" | "vegetation" | "imagery" | "space" | "air" | "geology";
  defaultEnabled: boolean;
  publicEntry: "observatory-card" | "map-layer" | "secondary-panel";
  updateCadence: "near-real-time" | "hourly" | "daily" | "weekly" | "monthly";
  bandwidth: "low" | "medium" | "high";
  sourceLabel: string;
  publicHeadline: string;
  operatorNotes: string;
  communitySchema: string;
};

export type LiveLayerHighlight = {
  id: string;
  title: string;
  summary: string;
  observedAt: string;
  lat?: number;
  lng?: number;
  severity?: "low" | "medium" | "high";
  tags?: string[];
};

export type LiveLayerSummary = {
  headline: string;
  status: string;
  detail: string;
  updatedAt: string;
};

export type LiveLayerDiagnostics = {
  stale: boolean;
  cacheTtlMs: number;
  coverage: string;
  upstream: string;
};

export type LiveLayerPayload = {
  layer: LiveLayerId;
  generatedAt: string;
  sourceStatus: "live" | "fallback";
  source: string;
  summary: LiveLayerSummary;
  highlights: LiveLayerHighlight[];
  diagnostics: LiveLayerDiagnostics;
};

export const LIVE_LAYER_CONTRACTS: Record<LiveLayerId, LiveLayerContract> = {
  "surface-water": {
    id: "surface-water",
    label: "Surface Water",
    domain: "water",
    defaultEnabled: false,
    publicEntry: "observatory-card",
    updateCadence: "daily",
    bandwidth: "medium",
    sourceLabel: "Digital Earth Africa / flood event fallback",
    publicHeadline: "Surface water now",
    operatorNotes: "Promote DE Africa WOfS as primary source when adapter lands. Current route is a transitional summary.",
    communitySchema: "water_observation",
  },
  "fire-hotspots": {
    id: "fire-hotspots",
    label: "Fire Hotspots",
    domain: "fire",
    defaultEnabled: false,
    publicEntry: "observatory-card",
    updateCadence: "near-real-time",
    bandwidth: "low",
    sourceLabel: "NASA fire event fallback",
    publicHeadline: "Active fire hotspots",
    operatorNotes: "Promote NASA FIRMS as primary source when authenticated adapter lands. Current route is a transitional summary.",
    communitySchema: "fire_observation",
  },
  "vegetation-anomaly": {
    id: "vegetation-anomaly",
    label: "Vegetation Anomaly",
    domain: "vegetation",
    defaultEnabled: false,
    publicEntry: "secondary-panel",
    updateCadence: "weekly",
    bandwidth: "medium",
    sourceLabel: "Digital Earth Africa NDVI anomalies",
    publicHeadline: "Greener than usual",
    operatorNotes: "Requires anomaly normalization and baseline version tracking.",
    communitySchema: "vegetation_observation",
  },
  "eo-imagery": {
    id: "eo-imagery",
    label: "Recent Imagery",
    domain: "imagery",
    defaultEnabled: false,
    publicEntry: "map-layer",
    updateCadence: "daily",
    bandwidth: "high",
    sourceLabel: "NASA GIBS",
    publicHeadline: "Recent imagery",
    operatorNotes: "Keep zoom-aware and low-bandwidth aware.",
    communitySchema: "imagery_observation",
  },
  "satellite-awareness": {
    id: "satellite-awareness",
    label: "Satellite Awareness",
    domain: "space",
    defaultEnabled: false,
    publicEntry: "map-layer",
    updateCadence: "near-real-time",
    bandwidth: "low",
    sourceLabel: "NORAD / CelesTrak",
    publicHeadline: "Satellites over or near Zambia now",
    operatorNotes: "Use one NORAD-derived truth model for HUD and globe.",
    communitySchema: "mission_proposal",
  },
  "air-quality": {
    id: "air-quality",
    label: "Air Quality",
    domain: "air",
    defaultEnabled: false,
    publicEntry: "secondary-panel",
    updateCadence: "hourly",
    bandwidth: "low",
    sourceLabel: "OpenAQ",
    publicHeadline: "Air quality reading",
    operatorNotes: "Ship publicly only if Zambia coverage is reliable.",
    communitySchema: "air_quality_observation",
  },
  geohazard: {
    id: "geohazard",
    label: "Geohazard",
    domain: "geology",
    defaultEnabled: false,
    publicEntry: "secondary-panel",
    updateCadence: "near-real-time",
    bandwidth: "low",
    sourceLabel: "USGS",
    publicHeadline: "Recent seismic activity",
    operatorNotes: "Keep subtle and geology-linked.",
    communitySchema: "felt_report",
  },
};
