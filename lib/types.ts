export type LayerVisibility = {
  boundary: boolean;
  province: boolean;
  particles: boolean;
  zambezi?: boolean;
  space?: boolean;
  earthObservation?: boolean;
  liveSatellites?: boolean;
  community?: boolean;
};

export type {
  LiveLayerContract,
  LiveLayerDiagnostics,
  LiveLayerHighlight,
  LiveLayerId,
  LiveLayerPayload,
  LiveLayerSummary,
} from "@/lib/live/contracts";

export { LIVE_LAYER_CONTRACTS } from "@/lib/live/contracts";
