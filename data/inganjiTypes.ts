/**
 * Inganji — Folk Tales & Mythology layer types.
 * Scaffold for Phase C2. See docs/INGANJI_SPEC.md and Content Architecture doc.
 */

import type { DeepTimeZone } from "@/lib/deepTime";

export type FolkTaleTier = "flagship" | "regional" | "urban" | "community";

export type FolkTaleFormat = "illustrated_cards" | "globe_animation" | "text_ambient";

export type FolkTaleMarker = {
  id: string;
  title: string;
  tradition: string;
  coordinates: { lat: number; lng: number; alt?: number };
  epoch: number;
  epochZone: DeepTimeZone;
  tier: FolkTaleTier;
  format: FolkTaleFormat;
  panels?: { image: string; caption: string }[];
  pathCoordinates?: { lat: number; lng: number }[];
  culturallyReviewed: boolean;
  source: "editorial" | "community";
};

/**
 * Placeholder — no folk tale markers yet. Add when Phase C2 starts.
 * Launch sequence: Nyami Nyami → Kuomboka → Chitimukulu → Makishi → Lamba copper spirits.
 */
export const INGANJI_MARKERS: FolkTaleMarker[] = [];
