import * as THREE from "three";

export function latLngToVector3(
  lat: number,
  lng: number,
  radius: number
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

export function targetFromMarker(lat: number, lng: number, radius = 1.02) {
  return latLngToVector3(lat, lng, radius);
}

export function cameraFromMarker(
  lat: number,
  lng: number,
  distance = 2.1
): THREE.Vector3 {
  const target = targetFromMarker(lat, lng, 1.03);
  const normal = target.clone().normalize();
  const tilt = new THREE.Vector3(0, 0.2, 0).projectOnPlane(normal).normalize();

  return target
    .clone()
    .add(normal.multiplyScalar(distance))
    .add(tilt.multiplyScalar(0.18));
}

export const AFRICA_CENTER = { lat: -15, lng: 28 };

export function africaCenteredCameraPosition(distance = 3.2): THREE.Vector3 {
  return latLngToVector3(AFRICA_CENTER.lat, AFRICA_CENTER.lng, distance);
}

export function quadraticArc(
  start: THREE.Vector3,
  end: THREE.Vector3,
  t: number
): THREE.Vector3 {
  const control = start
    .clone()
    .add(end)
    .multiplyScalar(0.5)
    .normalize()
    .multiplyScalar(Math.max(start.length(), end.length()) * 1.25);

  const oneMinusT = 1 - t;
  return start
    .clone()
    .multiplyScalar(oneMinusT * oneMinusT)
    .add(control.multiplyScalar(2 * oneMinusT * t))
    .add(end.clone().multiplyScalar(t * t));
}
