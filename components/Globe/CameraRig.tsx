"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import type { Marker } from "@/data/markers";
import { cameraFromMarker, quadraticArc, targetFromMarker } from "@/lib/camera";

type FlyToCoordinate = { lat: number; lng: number } | null;

type CameraRigProps = {
  selectedMarker: Marker | null;
  flyToCoordinate?: FlyToCoordinate;
  controlsRef: MutableRefObject<OrbitControlsType | null>;
};

const NKOLOSO_ID = "nkoloso-space-academy";

export function CameraRig({ selectedMarker, flyToCoordinate, controlsRef }: CameraRigProps) {
  const { camera } = useThree();

  const fromPos = useRef(new THREE.Vector3(0, 0, 3.2));
  const toPos = useRef(new THREE.Vector3(0, 0, 3.2));
  const fromTarget = useRef(new THREE.Vector3(0, 0, 0));
  const toTarget = useRef(new THREE.Vector3(0, 0, 0));
  const progress = useRef(1);
  const pendingMarkerRef = useRef<Marker | null>(null);
  const pendingCoordRef = useRef<{ lat: number; lng: number } | null>(null);

  const cinematicActiveRef = useRef(false);
  const cinematicStartRef = useRef(-1);
  const cinematicNearPosRef = useRef(new THREE.Vector3());
  const cinematicFarPosRef = useRef(new THREE.Vector3());
  const cinematicTargetRef = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!selectedMarker) {
      pendingMarkerRef.current = null;
      cinematicActiveRef.current = false;
      cinematicStartRef.current = -1;
      return;
    }
    pendingMarkerRef.current = selectedMarker;
  }, [selectedMarker]);

  useEffect(() => {
    if (!flyToCoordinate) {
      pendingCoordRef.current = null;
      return;
    }
    pendingCoordRef.current = { ...flyToCoordinate };
  }, [flyToCoordinate]);

  useFrame(({ clock }, delta) => {
    if (pendingMarkerRef.current && controlsRef.current) {
      const marker = pendingMarkerRef.current;
      pendingMarkerRef.current = null;

      fromPos.current.copy(camera.position);
      fromTarget.current.copy(controlsRef.current.target);

      const markerNear = cameraFromMarker(marker.coordinates.lat, marker.coordinates.lng, 1.95);
      const markerTarget = targetFromMarker(marker.coordinates.lat, marker.coordinates.lng, 1.02);

      toPos.current.copy(markerNear);
      toTarget.current.copy(markerTarget);
      progress.current = 0;

      if (marker.id === NKOLOSO_ID) {
        cinematicActiveRef.current = true;
        cinematicStartRef.current = -1;
        cinematicNearPosRef.current.copy(cameraFromMarker(marker.coordinates.lat, marker.coordinates.lng, 1.9));
        cinematicFarPosRef.current.copy(cameraFromMarker(marker.coordinates.lat, marker.coordinates.lng, 3.45));
        cinematicTargetRef.current.copy(markerTarget);
      } else {
        cinematicActiveRef.current = false;
      }
    }

    if (pendingCoordRef.current && controlsRef.current) {
      const { lat, lng } = pendingCoordRef.current;
      pendingCoordRef.current = null;

      fromPos.current.copy(camera.position);
      fromTarget.current.copy(controlsRef.current.target);
      toPos.current.copy(cameraFromMarker(lat, lng, 1.95));
      toTarget.current.copy(targetFromMarker(lat, lng, 1.02));
      progress.current = 0;
      cinematicActiveRef.current = false;
      cinematicStartRef.current = -1;
    }

    const controls = controlsRef.current;

    if (progress.current < 1) {
      if (controls) {
        controls.enabled = false;
        controls.autoRotate = false;
      }

      progress.current = Math.min(1, progress.current + delta / 2.5);
      const t = progress.current;
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const nextPos = quadraticArc(fromPos.current, toPos.current, eased);
      const nextTarget = fromTarget.current.clone().lerp(toTarget.current, eased);

      camera.position.copy(nextPos);
      if (controls) {
        controls.target.copy(nextTarget);
        controls.update();
      } else {
        camera.lookAt(nextTarget);
      }
      return;
    }

    if (!cinematicActiveRef.current || !controls) {
      if (controls) controls.enabled = true;
      return;
    }

    if (cinematicStartRef.current < 0) {
      cinematicStartRef.current = clock.elapsedTime;
    }

    controls.enabled = false;
    controls.autoRotate = false;

    const elapsed = clock.elapsedTime - cinematicStartRef.current;

    if (elapsed < 2.6) {
      camera.position.lerp(cinematicNearPosRef.current, 0.06);
      controls.target.lerp(cinematicTargetRef.current, 0.08);
    } else if (elapsed < 6.4) {
      const t = (elapsed - 2.6) / 3.8;
      const eased = t * t * (3 - 2 * t);
      const pos = cinematicNearPosRef.current.clone().lerp(cinematicFarPosRef.current, eased);
      camera.position.lerp(pos, 0.1);
      controls.target.lerp(cinematicTargetRef.current, 0.08);
    } else if (elapsed < 8.8) {
      const t = (elapsed - 6.4) / 2.4;
      const eased = t * t * (3 - 2 * t);
      const pos = cinematicFarPosRef.current.clone().lerp(cinematicNearPosRef.current, eased);
      camera.position.lerp(pos, 0.1);
      controls.target.lerp(cinematicTargetRef.current, 0.08);
    } else {
      cinematicActiveRef.current = false;
      cinematicStartRef.current = -1;
      controls.enabled = true;
    }

    controls.update();
  });

  return null;
}
