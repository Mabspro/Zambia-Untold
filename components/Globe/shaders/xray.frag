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
