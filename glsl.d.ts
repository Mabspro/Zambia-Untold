/**
 * TypeScript declarations for GLSL shader file imports.
 * Webpack is configured in next.config.mjs to load .vert/.frag/.glsl as raw strings.
 */
declare module "*.vert" {
  const content: string;
  export default content;
}

declare module "*.frag" {
  const content: string;
  export default content;
}

declare module "*.glsl" {
  const content: string;
  export default content;
}
