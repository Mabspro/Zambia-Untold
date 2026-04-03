"use client";

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Html, OrbitControls, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import { MARKERS, type Marker } from "@/data/markers";
import { isMarkerActive } from "@/lib/epoch";
import { getEpochPalette } from "@/lib/epochPalette";
import {
  AFRICA_CENTER,
  africaCenteredCameraPosition,
  latLngToVector3,
  targetFromMarker,
} from "@/lib/camera";
import { lttbDownsample, type LTTBPoint } from "@/lib/lttb";
import { GlobeMarker } from "./GlobeMarker";
import { CameraRig } from "./CameraRig";
import { FlyToPin } from "./FlyToPin";
import { LusakaParticleSwarm } from "./LusakaParticleSwarm";
import { ZambiaBoundary } from "./ZambiaBoundary";
import { ProvinceHighlight } from "./ProvinceHighlight";
import { ZambeziLayer } from "./ZambeziLayer";
import { KatangaFormationLayer } from "./KatangaFormationLayer";
import { EarthObservationLayer } from "./EarthObservationLayer";
import type { LayerVisibility } from "@/lib/types";
import XRAY_VERTEX from "./shaders/xray.vert";
import XRAY_FRAGMENT from "./shaders/xray.frag";

type GlobeProps = {
  selectedMarker: Marker | null;
  scrubYear: number;
  onMarkerSelect: (marker: Marker) => void;
  layerVisibility?: LayerVisibility;
  showHUD?: boolean;
  liveSatelliteScope?: "zambia" | "region";
  flyToCoordinate?: { lat: number; lng: number } | null;
  /** Temporary confirmation pin after Village Search fly-to. Auto-expires. */
  flyToPin?: { lat: number; lng: number; placeName?: string } | null;
  onFlyToPinExpire?: () => void;
  /** Called when user starts rotating/dragging the globe (e.g. for guided tour step 1). */
  onUserInteract?: () => void;
  /** During lobby, gently orient camera to Zambia/Africa before thesis. */
  focusAfricaDuringLobby?: boolean;
  /** Fires when a user opens a community archive point detail. */
  onCommunityMemoryOpen?: () => void;
  lowFiMode?: boolean;
};

type CityLightsProps = {
  xrayMixRef: MutableRefObject<number>;
};

function CityLights({ xrayMixRef }: CityLightsProps) {
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const geometry = useMemo(() => {
    const vertices: number[] = [];
    for (let i = 0; i < 260; i += 1) {
      const lat = -55 + Math.random() * 110;
      const lng = -180 + Math.random() * 360;
      const point = latLngToVector3(lat, lng, 1.009);
      vertices.push(point.x, point.y, point.z);
    }
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    return buffer;
  }, []);

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    const target = 0.7 * (1 - xrayMixRef.current);
    materialRef.current.opacity = THREE.MathUtils.damp(
      materialRef.current.opacity,
      target,
      5.5,
      delta
    );
  });

  return (
    <points geometry={geometry}>
      <pointsMaterial
        ref={materialRef}
        size={0.006}
        color="#C8851A"
        transparent
        opacity={0.7}
      />
    </points>
  );
}


type ISSOrbitTrackProps = {
  enabled: boolean;
};

function ISSOrbitTrack({ enabled }: ISSOrbitTrackProps) {
  const dotRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!dotRef.current || !enabled) return;
    const t = clock.elapsedTime * 0.22;
    const radius = 1.18;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    const y = Math.sin(t * 0.7) * 0.08;
    dotRef.current.position.set(x, y, z);
  });

  return (
    <group
      visible={enabled}
      rotation={[
        THREE.MathUtils.degToRad(51.6),
        THREE.MathUtils.degToRad(18),
        0,
      ]}
    >
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.18, 0.002, 8, 128]} />
        <meshBasicMaterial color="#d7dee8" transparent opacity={0.34} />
      </mesh>
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.012, 10, 10]} />
        <meshBasicMaterial color="#f5f7fa" />
      </mesh>
    </group>
  );
}


type LiveSatelliteSample = {
  name: string;
  latitude: number;
  longitude: number;
  altitudeKm: number;
};

function isSatelliteOverZambia(sample: LiveSatelliteSample) {
  return (
    sample.latitude >= -18.5 &&
    sample.latitude <= -8.1 &&
    sample.longitude >= 21.9 &&
    sample.longitude <= 33.7
  );
}

function isSatelliteNearZambia(sample: LiveSatelliteSample) {
  return (
    sample.latitude >= -25 &&
    sample.latitude <= 0 &&
    sample.longitude >= 12 &&
    sample.longitude <= 45
  );
}

type CommunityContributionSample = {
  id: number;
  title: string;
  placeName: string;
  latitude: number;
  longitude: number;
  epochZone: string;
};

type CommunityMissionSample = {
  id: number;
  name: string;
  missionType: string;
  altitudeKm: number;
  inclinationDeg: number;
};

type LiveSatelliteLayerProps = {
  active: boolean;
  satellites: LiveSatelliteSample[];
};

function getSatellitePhase(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % 10_000;
  }
  return (hash / 10_000) * Math.PI * 2;
}

function LiveSatelliteNode({
  sat,
  selectedNow,
  hoveredNow,
  onSelect,
  onHover,
  onHoverEnd,
}: {
  sat: LiveSatelliteSample;
  selectedNow: boolean;
  hoveredNow: boolean;
  onSelect: (sat: LiveSatelliteSample) => void;
  onHover: (name: string) => void;
  onHoverEnd: () => void;
}) {
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const phase = useMemo(() => getSatellitePhase(sat.name), [sat.name]);
  const radius = THREE.MathUtils.clamp(1 + sat.altitudeKm / 45000, 1.03, 1.26);
  const p = latLngToVector3(sat.latitude, sat.longitude, radius);
  const baseSize = selectedNow ? 0.0145 : hoveredNow ? 0.013 : 0.0115;

  useFrame(({ clock }) => {
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 2.8 + phase);
    const shimmer = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 6.5 + phase * 1.7);

    if (coreRef.current) {
      const coreMaterial = coreRef.current.material as THREE.MeshBasicMaterial;
      coreRef.current.scale.setScalar(1 + pulse * (selectedNow ? 0.34 : hoveredNow ? 0.25 : 0.18));
      coreMaterial.opacity = selectedNow ? 0.98 : hoveredNow ? 0.92 : 0.78 + shimmer * 0.18;
      coreMaterial.color.set(selectedNow ? "#f6feff" : hoveredNow ? "#bdf6ff" : "#6fe6ff");
    }

    if (haloRef.current) {
      const haloMaterial = haloRef.current.material as THREE.MeshBasicMaterial;
      haloRef.current.scale.setScalar(1.15 + pulse * (selectedNow ? 1.7 : 1.25));
      haloMaterial.opacity = selectedNow ? 0.3 + shimmer * 0.1 : hoveredNow ? 0.22 + shimmer * 0.08 : 0.12 + shimmer * 0.08;
    }

    if (pulseRef.current) {
      const pulseMaterial = pulseRef.current.material as THREE.MeshBasicMaterial;
      pulseRef.current.scale.setScalar(1.4 + pulse * (selectedNow ? 2.7 : 2.1));
      pulseMaterial.opacity = selectedNow ? 0.16 + shimmer * 0.05 : hoveredNow ? 0.12 + shimmer * 0.04 : 0.06 + shimmer * 0.03;
    }
  });

  return (
    <group position={[p.x, p.y, p.z]}>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[baseSize * 1.75, 12, 12]} />
        <meshBasicMaterial color="#2ed3ff" transparent opacity={0.1} depthWrite={false} />
      </mesh>
      <mesh ref={haloRef}>
        <sphereGeometry args={[baseSize * 1.28, 12, 12]} />
        <meshBasicMaterial color="#39d8ff" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      <mesh
        ref={coreRef}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(sat);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(sat.name);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHoverEnd();
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[baseSize, 14, 14]} />
        <meshBasicMaterial color="#6fe6ff" transparent opacity={0.84} />
      </mesh>
      {selectedNow && (
        <Html center distanceFactor={8}>
          <div className="rounded border border-[#39d8ff]/45 bg-[rgba(3,10,14,0.92)] px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-[#c8fbff] whitespace-nowrap shadow-[0_0_18px_rgba(57,216,255,0.18)]">
            {sat.name} · {Math.round(sat.altitudeKm)} km
          </div>
        </Html>
      )}
    </group>
  );
}

function LiveSatelliteLayer({ active, satellites }: LiveSatelliteLayerProps) {
  const [selected, setSelected] = useState<LiveSatelliteSample | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    if (!active) setSelected(null);
  }, [active]);

  useEffect(() => {
    if (!selected) return;

    const stillPresent = satellites.some((sat) => sat.name === selected.name);
    if (!stillPresent) {
      setSelected(null);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSelected(null);
    }, 4500);

    return () => window.clearTimeout(timeoutId);
  }, [satellites, selected]);

  if (!active || satellites.length === 0) return null;

  return (
    <group onPointerMissed={() => setSelected(null)}>
      {satellites.map((sat) => {
        const selectedNow = selected?.name === sat.name;
        const hoveredNow = hovered === sat.name;
        return (
          <LiveSatelliteNode
            key={`${sat.name}-${sat.latitude.toFixed(2)}-${sat.longitude.toFixed(2)}`}
            sat={sat}
            selectedNow={selectedNow}
            hoveredNow={hoveredNow}
            onSelect={setSelected}
            onHover={setHovered}
            onHoverEnd={() => setHovered(null)}
          />
        );
      })}
    </group>
  );
}
function CommunityContributionLayer({
  active,
  items,
  onOpen,
}: {
  active: boolean;
  items: CommunityContributionSample[];
  onOpen?: () => void;
}) {
  const { camera } = useThree();
  const [selected, setSelected] = useState<CommunityContributionSample | null>(null);
  const [lodTier, setLodTier] = useState(2);

  useFrame(() => {
    const dist = camera.position.length();
    const nextTier = dist > 4.2 ? 0 : dist > 3.1 ? 1 : 2;
    setLodTier((prev) => (prev === nextTier ? prev : nextTier));
  });

  useEffect(() => {
    if (!active) setSelected(null);
  }, [active]);

  if (!active || items.length === 0) return null;

  const cellSize = lodTier === 0 ? 2.2 : lodTier === 1 ? 1.3 : 0.7;
  const maxPoints = lodTier === 0 ? 36 : lodTier === 1 ? 72 : 120;
  const bucket = new Map<string, CommunityContributionSample>();
  for (const item of items) {
    const key = `${Math.round(item.latitude / cellSize)}:${Math.round(item.longitude / cellSize)}`;
    if (!bucket.has(key)) bucket.set(key, item);
    if (bucket.size >= maxPoints) break;
  }
  const visibleItems = [...bucket.values()];

  return (
    <group>
      {visibleItems.map((item) => {
        const p = latLngToVector3(item.latitude, item.longitude, 1.016);
        const selectedNow = selected?.id === item.id;
        return (
          <group key={`community-${item.id}`} position={[p.x, p.y, p.z]}>
            <mesh
              onClick={(event) => {
                event.stopPropagation();
                setSelected(item);
                onOpen?.();
              }}
              onPointerOver={() => {
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                document.body.style.cursor = "auto";
              }}
            >
              <sphereGeometry args={[selectedNow ? 0.011 : 0.009, 10, 10]} />
              <meshBasicMaterial color={selectedNow ? "#f8e8ca" : "#d08a3f"} transparent opacity={0.9} />
            </mesh>
            {selectedNow && (
              <Html center distanceFactor={8}>
                <div className="rounded border border-copper/35 bg-panel/90 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-copperSoft whitespace-nowrap">
                  {item.placeName || item.title}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

function CommunityMissionTrackLayer({
  active,
  missions,
}: {
  active: boolean;
  missions: CommunityMissionSample[];
}) {
  const { camera } = useThree();
  const [lodTier, setLodTier] = useState(2);

  useFrame(() => {
    const dist = camera.position.length();
    const nextTier = dist > 4.2 ? 0 : dist > 3.1 ? 1 : 2;
    setLodTier((prev) => (prev === nextTier ? prev : nextTier));
  });

  if (!active || missions.length === 0) return null;

  const trackCount = lodTier === 0 ? 6 : lodTier === 1 ? 10 : 16;
  const opacity = lodTier === 0 ? 0.18 : lodTier === 1 ? 0.23 : 0.28;

  return (
    <group>
      {missions.slice(0, trackCount).map((mission) => {
        const orbitRadius = THREE.MathUtils.clamp(1 + mission.altitudeKm / 46000, 1.06, 1.24);
        const yaw = ((mission.id * 23) % 360) * (Math.PI / 180);
        return (
          <group
            key={`mission-${mission.id}`}
            rotation={[THREE.MathUtils.degToRad(mission.inclinationDeg), yaw, 0]}
          >
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[orbitRadius, 0.0013, 6, 128]} />
              <meshBasicMaterial color="#b87333" transparent opacity={opacity} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
/**
 * DEFAULT_LAYERS for Scene — museum-first, no live observatory stack on load.
 * Space and EarthObservation off so no observatory APIs fire unless user opts in.
 * Single source of truth lives in app/page.tsx; this fallback matches that policy.
 * To restore: set NEXT_PUBLIC_EPOCH_OVERLAY=1
 */
const DEFAULT_LAYERS: LayerVisibility = {
  boundary: true,
  province: true,
  particles: true,
  zambezi: true,
  space: false,
  earthObservation: false,
  liveSatellites: false,
  community: false,
};

const ATMOSPHERE_NEAR = 1.3;
const ATMOSPHERE_FAR = 3.5;
// Reduced from 0.18/0.06 — the dark-amber atmosphere was muddying the earth
// texture at all zoom levels. Near-black keeps the edge-glow effect without
// washing out surface detail or competing with data layers.
const ATMOSPHERE_OPACITY_NEAR = 0.04;
const ATMOSPHERE_OPACITY_FAR = 0.012;

/** Epoch tint overlay — commented out for better contrast. Restore by uncommenting the mesh below. */
// const EPOCH_OVERLAY_ENABLED = process.env.NEXT_PUBLIC_EPOCH_OVERLAY === "1";

function Scene({
  selectedMarker,
  scrubYear,
  onMarkerSelect,
  layerVisibility = DEFAULT_LAYERS,
  showHUD = true,
  liveSatelliteScope = "zambia",
  flyToCoordinate,
  flyToPin,
  onFlyToPinExpire,
  onUserInteract,
  focusAfricaDuringLobby = false,
  onCommunityMemoryOpen,
  lowFiMode = false,
}: GlobeProps) {
  const { clock, gl, camera } = useThree();
  const globeRef = useRef<THREE.Group>(null);
  const baseMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const atmosphereRef = useRef<THREE.MeshBasicMaterial>(null);
  // const epochOverlayRef = useRef<THREE.MeshBasicMaterial>(null); // epoch overlay commented out
  const xrayMixRef = useRef(0);
  const transitionRef = useRef({
    from: 0,
    to: 0,
    startTime: -1,
  });
  const africaTargetRef = useRef(
    targetFromMarker(AFRICA_CENTER.lat, AFRICA_CENTER.lng, 1.02)
  );
  const africaCameraRef = useRef(africaCenteredCameraPosition(3.2));
  const snapActiveRef = useRef(false);
  const lobbyFocusDoneRef = useRef(false);
  const [liveSatellitePool, setLiveSatellitePool] = useState<LiveSatelliteSample[]>([]);
  const [approvedContributions, setApprovedContributions] = useState<CommunityContributionSample[]>([]);
  const [approvedMissions, setApprovedMissions] = useState<CommunityMissionSample[]>([]);


  const xrayEnabled = scrubYear < -10000;

  // Sprint 3A: OrbitControls + idle snap
  const controlsRef = useRef<OrbitControlsType>(null);
  const lastInteractionRef = useRef(0);

  const terrainStyle = useMemo(() => {
    const raw: LTTBPoint[] = [];
    for (let i = 0; i < 4096; i += 1) {
      const x = i / 4095;
      const y =
        0.5 +
        Math.sin(x * 38.0) * 0.22 +
        Math.sin(x * 95.0) * 0.11 +
        Math.sin(x * 205.0) * 0.04;
      raw.push({ x, y, payload: null });
    }

    // LTTB constraint for terrain profile simplification.
    const reduced = lttbDownsample(raw, 256);
    const mean = reduced.reduce((acc, p) => acc + p.y, 0) / reduced.length;
    const variance =
      reduced.reduce((acc, p) => acc + (p.y - mean) ** 2, 0) / reduced.length;
    const std = Math.sqrt(variance);

    return {
      frequency: THREE.MathUtils.clamp(1.7 + std * 6.5, 1.8, 3.0),
      bandDensity: THREE.MathUtils.clamp(2.6 + std * 9.5, 2.8, 5.0),
    };
  }, []);

  const xrayUniforms = useMemo(
    () => ({
      uDissolve: { value: 0 },
      uTerrainFreq: { value: 2.2 },
      uTerrainBand: { value: 3.2 },
    }),
    []
  );

  const xrayMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: XRAY_VERTEX,
      fragmentShader: XRAY_FRAGMENT,
      uniforms: xrayUniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
    });
  }, [xrayUniforms]);


  useEffect(() => {
    const el = gl.domElement;
    const onWheel = () => {
      lastInteractionRef.current = clock.getElapsedTime();
      snapActiveRef.current = false;
    };
    const onPointerDown = () => {
      lastInteractionRef.current = clock.getElapsedTime();
      snapActiveRef.current = false;
    };

    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
    };
  }, [gl, clock]);

  // Texture setup run synchronously to prevent dark flash or SRGB race condition
  const earthTexture = useLoader(THREE.TextureLoader, "/textures/earth-night.jpg");
  useMemo(() => {
    earthTexture.colorSpace = THREE.SRGBColorSpace;
    earthTexture.anisotropy = 8;
    earthTexture.needsUpdate = true;
  }, [earthTexture]);

  // Force material recompile once on mount so texture colorSpace takes effect
  useEffect(() => {
    if (baseMaterialRef.current) {
      baseMaterialRef.current.needsUpdate = true;
    }
  }, []);

  // `controlsEnabled` and `setControlsEnabled` have been fully abstracted to CameraRig
  // CameraRig natively governs lock/unlock during flight seamlessly per the 60fps WebGL loop


  useEffect(() => {
    const target = xrayEnabled ? 1 : 0;
    if (target === transitionRef.current.to) return;

    transitionRef.current = {
      from: xrayMixRef.current,
      to: target,
      startTime: -1,
    };
  }, [xrayEnabled]);

  useEffect(() => {
    if (layerVisibility.liveSatellites === false || layerVisibility.space === false) {
      setLiveSatellitePool([]);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/space/norad", { cache: "no-store" });
        if (!res.ok) return;
        const payload = (await res.json()) as {
          sample?: LiveSatelliteSample[];
        };
        if (cancelled) return;
        const sample = Array.isArray(payload.sample) ? payload.sample : [];
        setLiveSatellitePool(sample);
      } catch {
        // Keep prior sample while offline or during transient failures.
      }
    };

    load();
    const intervalId = setInterval(load, 60_000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [layerVisibility.liveSatellites, layerVisibility.space]);

  const liveSatellites = useMemo(() => {
    if (liveSatelliteScope === "region") {
      return liveSatellitePool.filter(isSatelliteNearZambia).slice(0, 60);
    }

    const overZambia = liveSatellitePool.filter(isSatelliteOverZambia);
    const nearby = liveSatellitePool.filter(
      (sample) => !isSatelliteOverZambia(sample) && isSatelliteNearZambia(sample)
    );

    if (overZambia.length > 0) {
      return [...overZambia.slice(0, 8), ...nearby.slice(0, 4)];
    }

    return nearby.slice(0, 8);
  }, [liveSatellitePool, liveSatelliteScope]);
  /**
   * Approved community memories load only when the archive community layer is active.
   * This keeps museum-first entry light and avoids public archive polling when hidden.
   */
  useEffect(() => {
    if (layerVisibility.community === false) {
      setApprovedContributions([]);
      return;
    }

    let cancelled = false;

    const loadApprovedCommunity = async () => {
      try {
        const communityRes = await fetch("/api/community/approved", { cache: "no-store" });
        if (!communityRes.ok || cancelled) return;

        const communityPayload = (await communityRes.json()) as {
          items?: CommunityContributionSample[];
        };

        if (cancelled) return;
        setApprovedContributions(Array.isArray(communityPayload.items) ? communityPayload.items.slice(0, 140) : []);
      } catch {
        // Keep prior approved community samples while offline.
      }
    };

    loadApprovedCommunity();
    const intervalId = setInterval(loadApprovedCommunity, 120_000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [layerVisibility.community]);

  /**
   * Approved community mission tracks belong to the space lens, not the archive layer.
   * They should only load when space is explicitly enabled.
   */
  useEffect(() => {
    if (layerVisibility.space === false) {
      setApprovedMissions([]);
      return;
    }

    let cancelled = false;

    const loadApprovedMissions = async () => {
      try {
        const missionRes = await fetch("/api/space/mission/approved", { cache: "no-store" });
        if (!missionRes.ok || cancelled) return;

        const missionPayload = (await missionRes.json()) as {
          items?: CommunityMissionSample[];
        };

        if (cancelled) return;
        setApprovedMissions(Array.isArray(missionPayload.items) ? missionPayload.items.slice(0, 48) : []);
      } catch {
        // Keep prior approved mission samples while offline.
      }
    };

    loadApprovedMissions();
    const intervalId = setInterval(loadApprovedMissions, 120_000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [layerVisibility.space]);
  useEffect(() => {
    if (!focusAfricaDuringLobby) {
      lobbyFocusDoneRef.current = false;
    }
  }, [focusAfricaDuringLobby]);

  useFrame((state, delta) => {
    const { camera } = state;
    const now = state.clock.elapsedTime;
    const controls = controlsRef.current;
    if (!controls) return;

    if (focusAfricaDuringLobby && !selectedMarker && !lobbyFocusDoneRef.current) {
      controls.autoRotate = false;
      const damp = 1 - Math.exp(-delta * 1.25);
      camera.position.lerp(africaCameraRef.current, damp);
      controls.target.lerp(africaTargetRef.current, damp);
      controls.update();

      const cameraSettled = camera.position.distanceTo(africaCameraRef.current) < 0.02;
      const targetSettled = controls.target.distanceTo(africaTargetRef.current) < 0.015;
      if (cameraSettled && targetSettled) {
        lobbyFocusDoneRef.current = true;
        lastInteractionRef.current = now;
      }
      return;
    }

    if (!selectedMarker) {
      if (lastInteractionRef.current === 0) lastInteractionRef.current = now;
      const idleTime = now - lastInteractionRef.current;

      if (!lowFiMode && idleTime > 8) {
        snapActiveRef.current = true;
      }

      if (snapActiveRef.current) {
        controls.autoRotate = false;
        const damp = 1 - Math.exp(-delta * 0.85);
        camera.position.lerp(africaCameraRef.current, damp);
        controls.target.lerp(africaTargetRef.current, damp);
        controls.update();

        const cameraSettled =
          camera.position.distanceTo(africaCameraRef.current) < 0.012;
        const targetSettled =
          controls.target.distanceTo(africaTargetRef.current) < 0.008;
        if (cameraSettled && targetSettled) {
          snapActiveRef.current = false;
          controls.autoRotate = !lowFiMode;
          lastInteractionRef.current = now;
        }
      }
    }
  });
  useFrame(({ clock }) => {
    const transition = transitionRef.current;
    if (transition.startTime < 0 && transition.from === transition.to) return;
    if (transition.startTime < 0) {
      transition.startTime = clock.elapsedTime;
    }

    const elapsed = clock.elapsedTime - transition.startTime;
    const t = THREE.MathUtils.clamp(elapsed / 1.2, 0, 1);
    const eased = t * t * (3 - 2 * t);
    xrayMixRef.current = THREE.MathUtils.lerp(transition.from, transition.to, eased);

    xrayUniforms.uDissolve.value = xrayMixRef.current;
    xrayUniforms.uTerrainFreq.value = terrainStyle.frequency;
    xrayUniforms.uTerrainBand.value = terrainStyle.bandDensity;

    if (baseMaterialRef.current) {
      baseMaterialRef.current.opacity = 1 - xrayMixRef.current * 0.9;
    }

    if (t >= 1) {
      transition.from = transition.to;
      transition.startTime = -1;
    }
  });

  useFrame(({ camera: cam }) => {
    const dist = cam.position.length();
    if (atmosphereRef.current) {
      const t = THREE.MathUtils.smoothstep(dist, ATMOSPHERE_NEAR, ATMOSPHERE_FAR);
      atmosphereRef.current.opacity = THREE.MathUtils.lerp(
        ATMOSPHERE_OPACITY_NEAR,
        ATMOSPHERE_OPACITY_FAR,
        t
      );
    }
    // Epoch overlay commented out for better contrast
    // const palette = getEpochPalette(scrubYear);
    // if (epochOverlayRef.current) {
    //   epochOverlayRef.current.color.set(palette.color);
    //   const raw = EPOCH_OVERLAY_ENABLED
    //     ? palette.opacity * (1 - xrayMixRef.current * 0.7)
    //     : 0;
    //   epochOverlayRef.current.opacity = Math.min(raw, 0.85);
    // }
  });

  return (
    <>
      <color attach="background" args={["#030405"]} />
      <ambientLight intensity={0.32} />
      <directionalLight position={[2.5, 1.5, 3]} intensity={0.75} color="#e8ecf4" />
      <directionalLight position={[-2, -1, -2]} intensity={0.08} color="#ffffff" />

      {/* Stars + Sparkles: render first (background) so they're visible in dev and prod */}
      <group renderOrder={-1}>
        <Stars radius={120} depth={40} count={lowFiMode ? 250 : 500} factor={3.5} saturation={0} fade />
        <Sparkles
          count={lowFiMode ? 0 : 22}
          scale={[2.5, 2.5, 2.5]}
          size={1.0}
          speed={0.05}
          color="#B87333"
          opacity={0.12}
        />
      </group>

      <OrbitControls
        ref={controlsRef}
        enabled={true} // CameraRig takes control of enabled during movement
        enableZoom
        enableRotate
        enablePan={false}
        minDistance={1.12}
        maxDistance={5}
        enableDamping
        dampingFactor={0.045}
        autoRotate={!lowFiMode && !selectedMarker && !focusAfricaDuringLobby} // Keep intro focus stable until Africa is centered
        autoRotateSpeed={0.15}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI - 0.15}
        onStart={() => {
          lastInteractionRef.current = clock.getElapsedTime();
          snapActiveRef.current = false;
          onUserInteract?.();
        }}
        onChange={() => {
          // Keep idle timer alive through damping settle — without this, the
          // snap could trigger while the globe is still coasting from a throw.
          lastInteractionRef.current = clock.getElapsedTime();
        }}
      />
      <group ref={globeRef}>
        {showHUD && layerVisibility.boundary !== false && (
          <ZambiaBoundary selectedMarker={!!selectedMarker} />
        )}
        {showHUD && layerVisibility.zambezi !== false && (
          <ZambeziLayer scrubYear={scrubYear} />
        )}
        {showHUD && <KatangaFormationLayer scrubYear={scrubYear} />}
        {showHUD && layerVisibility.province !== false && (
          <ProvinceHighlight activeMarkerId={selectedMarker?.id ?? null} />
        )}
        {showHUD && <EarthObservationLayer active={layerVisibility.earthObservation !== false} />}
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            ref={baseMaterialRef}
            map={earthTexture}
            emissiveMap={earthTexture}
            color="#c7d6de"
            emissive="#8ba8be"
            roughness={0.88}
            metalness={0.06}
            emissiveIntensity={0.78}
            transparent
            opacity={1}
          />
        </mesh>
        <mesh material={xrayMaterial}>
          <sphereGeometry args={[1.002, 64, 64]} />
        </mesh>
        {/* Epoch tint overlay — commented out for better contrast. Uncomment to restore. */}
        {/* <mesh>
          <sphereGeometry args={[1.025, 48, 48]} />
          <meshBasicMaterial
            ref={epochOverlayRef}
            color={getEpochPalette(scrubYear).color}
            transparent
            opacity={getEpochPalette(scrubYear).opacity}
            depthWrite={false}
          />
        </mesh> */}
        {/* Atmosphere haze — near-black so it darkens limb without warm tinting */}
        <mesh>
          <sphereGeometry args={[1.03, 48, 48]} />
          <meshBasicMaterial
            ref={atmosphereRef}
            color="#081525"
            transparent
            opacity={0.07}
          />
        </mesh>
        {showHUD && <CityLights xrayMixRef={xrayMixRef} />}
        <ISSOrbitTrack enabled={showHUD && layerVisibility.space !== false} />
        <LiveSatelliteLayer
          active={showHUD && layerVisibility.space !== false && layerVisibility.liveSatellites !== false}
          satellites={liveSatellites}
        />
        <CommunityMissionTrackLayer
          active={showHUD && layerVisibility.space !== false}
          missions={approvedMissions}
        />
        <CommunityContributionLayer
          active={showHUD && layerVisibility.community !== false}
          items={approvedContributions}
          onOpen={onCommunityMemoryOpen}
        />
        {showHUD && layerVisibility.particles !== false && (
          <LusakaParticleSwarm active={selectedMarker?.id === "lusaka-independence"} density={lowFiMode ? 0.25 : 1} />
        )}
        {showHUD && MARKERS.map((marker) => (
          <GlobeMarker
            key={marker.id}
            marker={marker}
            active={isMarkerActive(marker.epoch, scrubYear)}
            onClick={onMarkerSelect}
          />
        ))}
      </group>

      {/* Village Search fly-to confirmation pin — auto-expires after 10s */}
      {flyToPin && (
        <FlyToPin
          key={`${flyToPin.lat}-${flyToPin.lng}`}
          lat={flyToPin.lat}
          lng={flyToPin.lng}
          placeName={flyToPin.placeName}
          onExpire={onFlyToPinExpire}
        />
      )}
      {/* SovereigntyStackHUD removed from 3D scene — it was positioned 0.1
          units in front of the camera with a dark-brown bg, acting as a
          full-viewport tint. Sovereignty data now shown in the UI layer. */}
      <CameraRig selectedMarker={selectedMarker} flyToCoordinate={flyToCoordinate} controlsRef={controlsRef} />
    </>
  );
}


function useResponsiveViewport(baseFov: number, baseDistance: number): { fov: number; distance: number } {
  const [viewport, setViewport] = useState({ fov: baseFov, distance: baseDistance });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      if (w < 480) {
        setViewport({ fov: h < 760 ? 60 : 58, distance: h < 760 ? 3.28 : 3.18 });
        return;
      }

      if (w < 768) {
        setViewport({ fov: h < 760 ? 52 : 50, distance: h < 760 ? 3.18 : 3.08 });
        return;
      }

      setViewport({ fov: baseFov, distance: baseDistance });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [baseFov, baseDistance]);

  return viewport;
}

export function Globe({
  selectedMarker,
  scrubYear,
  onMarkerSelect,
  layerVisibility,
  showHUD = true,
  liveSatelliteScope = "zambia",
  flyToCoordinate,
  flyToPin,
  onFlyToPinExpire,
  onUserInteract,
  focusAfricaDuringLobby = false,
  onCommunityMemoryOpen,
  lowFiMode = false,
}: GlobeProps) {
  const { fov, distance } = useResponsiveViewport(42, 3.2);
  const initialCamera = useMemo(() => africaCenteredCameraPosition(distance), [distance]);

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.9,
        outputColorSpace: THREE.SRGBColorSpace,
      } as any}
      onCreated={({ gl: renderer }) => {
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.9;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
      }}
      camera={{
        position: [initialCamera.x, initialCamera.y, initialCamera.z],
        fov,
      }}
    >
      <Scene
        selectedMarker={selectedMarker}
        scrubYear={scrubYear}
        onMarkerSelect={onMarkerSelect}
        layerVisibility={layerVisibility}
        showHUD={showHUD}
        liveSatelliteScope={liveSatelliteScope}
        flyToCoordinate={flyToCoordinate}
        flyToPin={flyToPin}
        onFlyToPinExpire={onFlyToPinExpire}
        onUserInteract={onUserInteract}
        focusAfricaDuringLobby={focusAfricaDuringLobby}
        onCommunityMemoryOpen={onCommunityMemoryOpen}
        lowFiMode={lowFiMode}
      />
    </Canvas>
  );
}











































