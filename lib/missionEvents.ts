export type MissionEventName =
  | "marker:kalambo-falls:opened"
  | "marker:kabwe-skull:opened"
  | "shader:xray:activated"
  | "marker:kansanshi:opened"
  | "marker:ingombe-ilede:opened"
  | "epoch:copper-empire:visited"
  | "marker:lusaka-independence:opened"
  | "layer:satellites:activated"
  | "marker:nkoloso:opened"
  | "layer:community:activated"
  | "community:memory:opened"
  | "community:memory:submitted";

type Listener = (event: MissionEventName) => void;

const listeners = new Set<Listener>();

export function emitMissionEvent(event: MissionEventName): void {
  for (const listener of listeners) {
    listener(event);
  }
}

export function onMissionEvent(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
