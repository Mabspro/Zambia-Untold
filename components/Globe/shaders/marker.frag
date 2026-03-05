uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;

void main() {
  float d = distance(vUv, vec2(0.5));
  float pulse = 0.65 + 0.35 * sin(uTime * 2.0);
  float alpha = smoothstep(0.5, 0.1, d) * pulse;
  gl_FragColor = vec4(uColor, alpha);
}
