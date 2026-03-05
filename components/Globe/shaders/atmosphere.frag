varying vec2 vUv;

void main() {
  float glow = smoothstep(0.9, 0.2, distance(vUv, vec2(0.5)));
  gl_FragColor = vec4(0.72, 0.45, 0.2, glow * 0.15);
}
