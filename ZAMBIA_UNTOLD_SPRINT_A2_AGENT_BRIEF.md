# ZAMBIA UNTOLD — Sprint A2 Agent Brief

**Sprint:** A2 — Globe Rendering & Mineral Layers  
**Duration:** 2–3 weeks  
**Reference:** `MUSEUM_ENHANCEMENT_PLAN.md` Appendix C, Appendix E (Layers 1–2), `MUSEUM_SPRINT_PLAN.md`

---

## Goal

Intelligence-agency aesthetic. Boundary scanline, atmosphere, epoch palettes, mineral layer foundations.

---

## Deliverables

| Task | Output | Spec Reference |
|------|--------|----------------|
| Boundary sovereign scanline | Dash-offset animation on Zambia boundary | Appendix C |
| Dynamic atmosphere | Opacity/thickness scale with camera distance; topo shadows below 500km | Appendix C |
| Epoch palette system | Globe tint by scrubber year. Colonial = cool gray-blue. 1964+ = copper return | Appendix A |
| Zambezi evolution layer | River state per epoch: Miocene (proto), Pleistocene (cycles), Kansanshi (highway), Colonial (dammed) | MUSEUM Plan 2.5 |
| In-geometry HUD | Sovereignty Stack rendered in R3F Canvas (Drei Html/Text), curved lens aesthetic | Appendix C |
| Mineral layer: Katanga formation | 900M BC hydrothermal pulse at Copperbelt coords. LTTB, max 500 particles | Appendix E |

---

## Success Criteria

- [ ] Boundary looks actively scanned, not static
- [ ] Zoom in: atmosphere adjusts, shadows appear
- [ ] Colonial epoch visually distinct
- [ ] Zambezi visible/implied across epochs
- [ ] Sovereignty Stack in WebGL, not DOM overlay

---

## Technical Notes

### Boundary Scanline
- Use `LineDashedMaterial` with animated `dashOffset`
- `computeLineDistances()` on BufferGeometry before render

### Epoch Palette (Appendix A)
| Epoch | Globe Tint | Overlay |
|-------|------------|---------|
| Deep Substrate | X-Ray copper (current) | None |
| Migration | Warm ochre 5% | — |
| Copper Empire | Amber 8% | — |
| Kingdom Age | Green 6% | — |
| Colonial | Blue-gray 12% | — |
| Sovereign | Copper return | — |

### Katanga Layer
- Copperbelt coords: Kansanshi (-12.08, 25.87), Sentinel (-12.5, 25.8), Mingomba (-12.8, 28.4)
- 3–5s loop: particles rise from depth → dissolve into static dots
- LTTB downsampling, max 500 particles

### Zambezi States (MUSEUM Plan 2.5)
| Epoch | Zambezi State |
|-------|---------------|
| Miocene | Proto-drainage; river doesn't exist yet |
| Pleistocene | Fills and empties with ice age cycles |
| Kansanshi epoch | Trade highway |
| Colonial | Dammed at Kariba |
