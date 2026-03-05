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

export function CameraRig({ selectedMarker, flyToCoordinate, controlsRef }: CameraRigProps) {
  const { camera } = useThree();

  const fromPos = useRef(new THREE.Vector3(0, 0, 3.2));
  const toPos = useRef(new THREE.Vector3(0, 0, 3.2));
  const fromTarget = useRef(new THREE.Vector3(0, 0, 0));
  const toTarget = useRef(new THREE.Vector3(0, 0, 0));
  const progress = useRef(1);
  const pendingMarkerRef = useRef<Marker | null>(null);
  const pendingCoordRef = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!selectedMarker) {
      pendingMarkerRef.current = null;
      return;
    }
    pendingMarkerRef.current = selectedMarker;
  }, [selectedMarker]);

  // Handle flyToCoordinate (from Village Search)
  useEffect(() => {
    if (!flyToCoordinate) {
      pendingCoordRef.current = null;
      return;
    }
    pendingCoordRef.current = { ...flyToCoordinate };
  }, [flyToCoordinate]);

  useFrame((_, delta) => {
    // Start or interrupt flight when a new marker is selected
    if (pendingMarkerRef.current && controlsRef.current) {
      const marker = pendingMarkerRef.current;
      pendingMarkerRef.current = null;

      fromPos.current.copy(camera.position);
      fromTarget.current.copy(controlsRef.current.target);
      toPos.current.copy(
        cameraFromMarker(marker.coordinates.lat, marker.coordinates.lng, 1.95)
      );
      toTarget.current.copy(
        targetFromMarker(marker.coordinates.lat, marker.coordinates.lng, 1.02)
      );
      progress.current = 0;
    }

    // Start flight when flyToCoordinate is set (Village Search)
    if (pendingCoordRef.current && controlsRef.current) {
      const { lat, lng } = pendingCoordRef.current;
      pendingCoordRef.current = null;

      fromPos.current.copy(camera.position);
      fromTarget.current.copy(controlsRef.current.target);
      toPos.current.copy(cameraFromMarker(lat, lng, 1.95));
      toTarget.current.copy(targetFromMarker(lat, lng, 1.02));
      progress.current = 0;
    }

    if (progress.current >= 1) return;
    
    if (controlsRef.current) {
      controlsRef.current.enabled = false; // Disable user dragging while flying
      controlsRef.current.autoRotate = false; // Prevent autoRotate fighting the rig
    }

    progress.current = Math.min(1, progress.current + delta / 2.5);

    // Smoother, silkier ease function (easeInOut cubic/quart blend) for takeoff and landing
    const t = progress.current;
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const nextPos = quadraticArc(fromPos.current, toPos.current, eased);
    const nextTarget = fromTarget.current.clone().lerp(toTarget.current, eased);

    camera.position.copy(nextPos);
    if (controlsRef.current) {
      controlsRef.current.target.copy(nextTarget);
      controlsRef.current.update();
      if (t >= 1) {
        controlsRef.current.enabled = true; // Re-enable user dragging once landed
      }
    } else {
      camera.lookAt(nextTarget);
    }
  });

  return null;
}
