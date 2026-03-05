"use client";

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, Sparkles, Stars } from "@react-three/drei";
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
import { LusakaParticleSwarm } from "./LusakaParticleSwarm";
import { ZambiaBoundary } from "./ZambiaBoundary";
import { ProvinceHighlight } from "./ProvinceHighlight";
import { ZambeziLayer } from "./ZambeziLayer";
import { SovereigntyStackHUD } from "./SovereigntyStackHUD";
import { KatangaFormationLayer } from "./KatangaFormationLayer";
import type { LayerVisibility } from "@/lib/types";

type GlobeProps = {
  selectedMarker: Marker | null;
  scrubYear: number;
  onMarkerSelect: (marker: Marker) => void;
  layerVisibility?: LayerVisibility;
  showHUD?: boolean;
  flyToCoordinate?: { lat: number; lng: number } | null;
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

const XRAY_VERTEX = `
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const XRAY_FRAGMENT = `
  uniform float uDissolve;
  uniform float uTerrainFreq;
  uniform float uTerrainBand;
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  void main() {
    vec3 darkBase = vec3(0.04, 0.05, 0.06);
    vec3 copper = vec3(0.78, 0.53, 0.18);
    vec3 worldScaled = vWorldPosition * uTerrainFreq;
    float terrainField = abs(
      (sin(worldScaled.x * 1.25) + sin(worldScaled.y * 1.1) + sin(worldScaled.z * 1.4)) * 0.333
    );
    float contour = smoothstep(0.25, 0.9, terrainField * uTerrainBand);
    float slope = 1.0 - abs(dot(vWorldNormal, vec3(0.0, 1.0, 0.0)));
    float relief = max(contour, slope * 0.6);
    float dissolveNoise = abs(
      sin(vWorldPosition.x * 11.1 + vWorldPosition.y * 8.7 + vWorldPosition.z * 9.3)
    );
    float dissolveMask = smoothstep(dissolveNoise - 0.16, dissolveNoise + 0.16, uDissolve);
    vec3 color = mix(darkBase, copper, relief);
    float opacity = dissolveMask * uDissolve;
    gl_FragColor = vec4(color, opacity);
  }
`;

const DEFAULT_LAYERS: LayerVisibility = {
  boundary: true,
  province: true,
  particles: true,
  zambezi: true,
};

const ATMOSPHERE_NEAR = 1.3;
const ATMOSPHERE_FAR = 3.5;
// Reduced from 0.18/0.06 — the dark-amber atmosphere was muddying the earth
// texture at all zoom levels. Near-black keeps the edge-glow effect without
// washing out surface detail or competing with data layers.
const ATMOSPHERE_OPACITY_NEAR = 0.07;
const ATMOSPHERE_OPACITY_FAR = 0.015;

/** Epoch tint overlay — commented out for better contrast. Restore by uncommenting the mesh below. */
// const EPOCH_OVERLAY_ENABLED = process.env.NEXT_PUBLIC_EPOCH_OVERLAY === "1";

function Scene({
  selectedMarker,
  scrubYear,
  onMarkerSelect,
  layerVisibility = DEFAULT_LAYERS,
  showHUD = true,
  flyToCoordinate,
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

  useFrame((state, delta) => {
    const { camera } = state;
    const now = state.clock.elapsedTime;
    const controls = controlsRef.current;
    if (!controls) return;

    // Idle snap to Africa: after 15s with no marker and no interaction.
    if (!selectedMarker) {
      if (lastInteractionRef.current === 0) lastInteractionRef.current = now;
      const idleTime = now - lastInteractionRef.current;

      // Extend to 15s so the autoRotate has time to spin freely
      if (idleTime > 15) {
        snapActiveRef.current = true;
      }

      if (snapActiveRef.current) {
        // Pause autoRotate so it doesn't fight the lerp-back path.
        controls.autoRotate = false;
        // Lower damp for a softer, cinematic drift back to origin
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
          controls.autoRotate = true; // Resume gentle drift once settled
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
      <ambientLight intensity={0.28} />
      <directionalLight position={[2.5, 1.5, 3]} intensity={0.95} color="#e8ecf4" />
      <directionalLight position={[-2, -1, -2]} intensity={0.15} color="#ffffff" />

      <Stars radius={120} depth={40} count={900} factor={3} saturation={0} fade />
      <Sparkles
        count={50}
        scale={[2.5, 2.5, 2.5]}
        size={2}
        speed={0.08}
        color="#B87333"
        opacity={0.18}
      />

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
        autoRotate={!selectedMarker} // Only autoRotate if no marker is active
        autoRotateSpeed={0.35}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI - 0.15}
        onStart={() => {
          lastInteractionRef.current = clock.getElapsedTime();
          snapActiveRef.current = false;
        }}
        onChange={() => {
          // Keep idle timer alive through damping settle — without this, the
          // snap could trigger while the globe is still coasting from a throw.
          lastInteractionRef.current = clock.getElapsedTime();
        }}
      />
      <group ref={globeRef}>
        {layerVisibility.boundary !== false && (
          <ZambiaBoundary selectedMarker={!!selectedMarker} />
        )}
        {layerVisibility.zambezi !== false && (
          <ZambeziLayer scrubYear={scrubYear} />
        )}
        <KatangaFormationLayer scrubYear={scrubYear} />
        {layerVisibility.province !== false && (
          <ProvinceHighlight activeMarkerId={selectedMarker?.id ?? null} />
        )}
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            ref={baseMaterialRef}
            map={earthTexture}
            emissiveMap={earthTexture}
            color="#ffffff"
            emissive="#ffffff"
            roughness={0.9}
            metalness={0.06}
            emissiveIntensity={1.05}
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
            color="#050d18"
            transparent
            opacity={0.07}
          />
        </mesh>
        <CityLights xrayMixRef={xrayMixRef} />
        {layerVisibility.particles !== false && (
          <LusakaParticleSwarm active={selectedMarker?.id === "lusaka-independence"} />
        )}
        {MARKERS.map((marker) => (
          <GlobeMarker
            key={marker.id}
            marker={marker}
            active={isMarkerActive(marker.epoch, scrubYear)}
            onClick={onMarkerSelect}
          />
        ))}
      </group>

      {/* SovereigntyStackHUD removed from 3D scene — it was positioned 0.1
          units in front of the camera with a dark-brown bg, acting as a
          full-viewport tint. Sovereignty data now shown in the UI layer. */}
      <CameraRig selectedMarker={selectedMarker} flyToCoordinate={flyToCoordinate} controlsRef={controlsRef} />
    </>
  );
}

const INITIAL_CAMERA = africaCenteredCameraPosition(3.2);

/** Responsive FOV: wider on mobile so the globe appears smaller and fits the screen */
function useResponsiveFov(baseFov: number): number {
  const [fov, setFov] = useState(baseFov);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      // Mobile: wider FOV to shrink the globe with margins; tablet: moderate; desktop: base
      if (w < 480) setFov(68);
      else if (w < 768) setFov(55);
      else setFov(baseFov);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [baseFov]);
  return fov;
}

export function Globe({
  selectedMarker,
  scrubYear,
  onMarkerSelect,
  layerVisibility,
  showHUD = true,
  flyToCoordinate,
}: GlobeProps) {
  const fov = useResponsiveFov(42);

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
        outputColorSpace: THREE.SRGBColorSpace,
      } as any}
      onCreated={({ gl: renderer }) => {
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
      }}
      camera={{
        position: [INITIAL_CAMERA.x, INITIAL_CAMERA.y, INITIAL_CAMERA.z],
        fov,
      }}
    >
      <Scene
        selectedMarker={selectedMarker}
        scrubYear={scrubYear}
        onMarkerSelect={onMarkerSelect}
        layerVisibility={layerVisibility}
        showHUD={showHUD}
        flyToCoordinate={flyToCoordinate}
      />
    </Canvas>
  );
}
