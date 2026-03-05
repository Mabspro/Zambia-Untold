# Texture Placeholder

Sprint 1 currently uses a procedural dark Earth material in `Globe.tsx` to avoid blocking on asset licensing and API setup.

Drop-in replacements when available:
- `earth-night.jpg`
- `earth-specular.jpg`

Both files can be loaded via `THREE.TextureLoader` and applied to the globe material.