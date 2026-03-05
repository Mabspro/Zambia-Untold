"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { latLngToVector3 } from "@/lib/camera";
import { lttbDownsample, type LTTBPoint } from "@/lib/lttb";

const LUSAKA_CENTER = { lat: -15.4167, lng: 28.2833 };
const MAX_PARTICLES = 2000;
const EXPANSION_SECONDS = 8;
const FADE_OUT_SECONDS = 2;

type FeatureCollection = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: { type: "LineString"; coordinates: number[][] };
  }>;
};

type ParticlePoint = {
  lat: number;
  lng: number;
  distNorm: number;
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function smoothStep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function LusakaParticleSwarm({ active }: { active: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const alphaArrayRef = useRef<Float32Array | null>(null);
  const distArrayRef = useRef<Float32Array | null>(null);

  const progressRef = useRef(0);
  const visibilityRef = useRef(0);

  const [particles, setParticles] = useState<ParticlePoint[]>([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const response = await fetch("/data/lusaka-roads.geojson");
      const geojson = (await response.json()) as FeatureCollection;

      const rawPoints: Array<LTTBPoint<ParticlePoint>> = [];
      let maxDistance = 0;
      let seq = 0;

      for (const feature of geojson.features) {
        if (feature.geometry.type !== "LineString") continue;
        for (const [lng, lat] of feature.geometry.coordinates) {
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
          const distance = haversineKm(LUSAKA_CENTER.lat, LUSAKA_CENTER.lng, lat, lng);
          maxDistance = Math.max(maxDistance, distance);
          rawPoints.push({
            x: lng + seq * 1e-7,
            y: lat,
            payload: { lat, lng, distNorm: distance },
          });
          seq += 1;
        }
      }

      if (rawPoints.length === 0) return;

      const downsampled = lttbDownsample(rawPoints, MAX_PARTICLES).map((point) => ({
        lat: point.payload.lat,
        lng: point.payload.lng,
        distNorm: point.payload.distNorm / Math.max(maxDistance, 1),
      }));

      if (mounted) setParticles(downsampled);
    };

    load().catch(() => {
      if (mounted) setParticles([]);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const geometry = useMemo(() => {
    const positions = new Float32Array(particles.length * 3);
    const colors = new Float32Array(particles.length * 3);
    const alphas = new Float32Array(particles.length);
    const distances = new Float32Array(particles.length);

    const near = new THREE.Color("#C41E3A");
    const far = new THREE.Color("#C8851A");

    particles.forEach((particle, index) => {
      const pos = latLngToVector3(particle.lat, particle.lng, 1.035);
      positions[index * 3] = pos.x;
      positions[index * 3 + 1] = pos.y;
      positions[index * 3 + 2] = pos.z;

      const color = near.clone().lerp(far, particle.distNorm);
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;

      distances[index] = particle.distNorm;
      alphas[index] = 0;
    });

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    buffer.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    buffer.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
    buffer.computeBoundingSphere();

    alphaArrayRef.current = alphas;
    distArrayRef.current = distances;

    return buffer;
  }, [particles]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !alphaArrayRef.current || !distArrayRef.current) return;
    const alpha = alphaArrayRef.current;
    const distances = distArrayRef.current;

    if (active) {
      visibilityRef.current = THREE.MathUtils.damp(visibilityRef.current, 1, 4.5, delta);
      progressRef.current = Math.min(1, progressRef.current + delta / EXPANSION_SECONDS);
    } else {
      visibilityRef.current = THREE.MathUtils.damp(
        visibilityRef.current,
        0,
        4 / FADE_OUT_SECONDS,
        delta
      );
      if (visibilityRef.current < 0.01) progressRef.current = 0;
    }

    const front = progressRef.current;
    for (let i = 0; i < alpha.length; i += 1) {
      const reveal = 1 - smoothStep(front, front + 0.07, distances[i]);
      alpha[i] = reveal * visibilityRef.current * 0.95;
    }

    const alphaAttribute = geometry.getAttribute("alpha") as THREE.BufferAttribute;
    alphaAttribute.needsUpdate = true;
  });

  if (!particles.length) return null;

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        transparent
        depthWrite={false}
        vertexColors
        blending={THREE.AdditiveBlending}
        vertexShader={`
          attribute float alpha;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vColor = color;
            vAlpha = alpha;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = 2.6 * (1.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            float d = distance(gl_PointCoord, vec2(0.5));
            float shape = smoothstep(0.52, 0.08, d);
            gl_FragColor = vec4(vColor, vAlpha * shape);
          }
        `}
      />
    </points>
  );
}
