import type { LiveLayerId } from "@/lib/live/contracts";

export type LiveLayerRegistryEntry = {
  layer: LiveLayerId;
  endpoint: string;
  kind: "shared-payload" | "norad";
};

export const INTERNAL_LIVE_LAYER_REGISTRY: LiveLayerRegistryEntry[] = [
  { layer: "surface-water", endpoint: "/api/earth/water", kind: "shared-payload" },
  { layer: "fire-hotspots", endpoint: "/api/earth/fire", kind: "shared-payload" },
  { layer: "satellite-awareness", endpoint: "/api/space/norad", kind: "norad" },
];
