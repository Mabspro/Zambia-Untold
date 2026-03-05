/**
 * Simplified Zambezi River path (Zambia portion).
 * Source: -11.37, 24.31; flows through Barotseland, Victoria Falls, Kariba.
 * Reference: MUSEUM_ENHANCEMENT_PLAN.md 2.5 — Zambezi as persistent character.
 */

import { latLngToVector3 } from "@/lib/camera";
import * as THREE from "three";

const RADIUS = 1.0025;

/** Key points: source → Barotseland → Victoria Falls → Kariba → eastern border */
const ZAMBEZI_POINTS: [number, number][] = [
  [-11.37, 24.31],
  [-12.2, 24.0],
  [-13.5, 23.5],
  [-14.5, 23.2],
  [-15.2, 24.5],
  [-16.0, 25.2],
  [-17.0, 25.5],
  [-17.92, 25.86],
  [-17.5, 27.0],
  [-16.52, 28.8],
  [-15.9, 30.2],
  [-15.5, 30.8],
  [-15.0, 31.5],
];

export function getZambeziLinePoints(): THREE.Vector3[] {
  return ZAMBEZI_POINTS.map(([lat, lng]) => latLngToVector3(lat, lng, RADIUS));
}

export type ZambeziState = "proto" | "pleistocene" | "highway" | "dammed";

/**
 * Zambezi state by scrubber year.
 * Miocene: proto. Pleistocene: cycles. Kansanshi: highway. Colonial: dammed.
 */
export function getZambeziState(year: number): ZambeziState {
  if (year < -5_000_000) return "proto";
  if (year < -10000) return "pleistocene";
  if (year < 1890) return "highway";
  return "dammed";
}
