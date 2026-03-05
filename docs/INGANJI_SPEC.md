# Inganji — Folk Tales & Mythology Layer Spec

**Document Status:** Design Spec / Implementation Brief  
**Version:** 1.0  
**Date:** March 2026  
**Reference:** `docs/ZAMBIA UNTOLD — Content Architecture  Community Layer, Folklore (Inganji), and Living Archive (Isibalo).md`, `Community-Context.md`, `MUSEUM_ENHANCEMENT_PLAN.md`

---

## Executive Summary

**Inganji** (Bemba/Nyanja: legend, story passed down) is the folk tales and mythology layer inside ZAMBIA UNTOLD. It presents curated, culturally reviewed stories — Nyami Nyami, Kuomboka, Chitimukulu, Makishi, and others — as illustrated story cards and flagship globe animations. Community-submitted folk tales via Isibalo appear as **Community Folk Tale** markers, distinct from editorial content.

**Full research catalog:** See `docs/ZAMBIA UNTOLD — Content Architecture  Community Layer, Folklore (Inganji), and Living Archive (Isibalo).md` (Content Architecture doc) for validated sources, coordinates, and production pipeline.

---

## Part 1 — Marker Type & Visual Hierarchy

**Canonical taxonomy:** `MUSEUM_ENHANCEMENT_PLAN.md` §2.4. Do not introduce new marker types without updating that table.

| Marker Type | Glyph | Color | Meaning |
|-------------|-------|-------|---------|
| Curated exhibit | Point/diamond | Copper (#B87333) | Evidence-based historical narrative |
| Folk tale (Inganji) | Spiral/flame | Warm amber (#D4943A) | Legend, story passed down |
| Community (Isibalo) | Soft circle | Pale amber (#E8C170) | Contributed memory, moderated |
| Geological substrate | Stone glyph | Stone/earth (#8B7355) | Deep time, mineral formation |

---

## Part 2 — Narrative Panel Tabs (Updated)

Each marker supports up to four tabs:

```
[STORY] [MYTHOLOGY] [EVIDENCE] [COMMUNITY]
```

- **STORY**: Historical narrative (existing)
- **MYTHOLOGY**: Folk tale or legend at this coordinate (new — Inganji)
- **EVIDENCE**: Academic citations (existing)
- **COMMUNITY**: Approved Isibalo contributions pinned here (new — Phase C)

---

## Part 3 — Folk Tale Catalog (from Content Architecture)

### Tier 1: Flagship Stories

| Story | Coordinate | Epoch | Format | Launch Order |
|-------|------------|-------|--------|--------------|
| **Nyami Nyami** | Kariba Dam 16.5°S, 28.9°E | Colonial Wound (1950s) | Animated globe sequence | 1 |
| **Kuomboka** | Mongu/Lealui → Limulunga ~15.3°S, 23.1°E | Kingdom Age | Animated globe sequence | 2 |
| **Chitimukulu** | Congo → Luapula → Kasama | Kingdom Age (1650–1800s) | Illustrated cards + path | 3 |

### Tier 2: Regional Depth

| Story | Coordinate | Epoch | Format |
|-------|------------|-------|--------|
| Makishi masquerade | Zambezi NW ~13.5°S, 23.0°E | Kingdom Age | Illustrated cards |
| Gule Wamkulu | Eastern Province ~13.6°S, 31.5°E | Kingdom Age | Illustrated cards |
| Tonga rain shrines | Gwembe Valley ~16.0°S, 28.5°E | Kingdom Age | Illustrated cards |
| Lamba copper spirits | Copperbelt ~12.9°S, 28.6°E | Copper Empire | Illustrated cards (overlays Kansanshi) |
| Leza/Lesa | Bemba region | Migration / Kingdom | Text + ambient |

### Tier 3: Urban & Living Mythology

| Story | Coordinate | Epoch |
|-------|------------|-------|
| Soli/Lenje (Chakwela Makumbi, Mooba) | Lusaka ~15.4°S, 28.3°E | Sovereign |
| Tokoloshe | Lusaka informal settlements | Sovereign |

---

## Part 4 — Data Schema (Scaffold)

```ts
type FolkTaleTier = "flagship" | "regional" | "urban" | "community";

type FolkTaleFormat = "illustrated_cards" | "globe_animation" | "text_ambient";

type FolkTaleMarker = {
  id: string;
  title: string;
  tradition: string;           // e.g. "Tonga", "Lozi", "Bemba"
  coordinates: { lat: number; lng: number; alt?: number };
  epoch: number;
  epochZone: DeepTimeZone;
  tier: FolkTaleTier;
  format: FolkTaleFormat;
  /** 4–6 panels for illustrated_cards */
  panels?: { image: string; caption: string }[];
  /** For path-based (e.g. Chitimukulu migration) */
  pathCoordinates?: { lat: number; lng: number }[];
  /** Cultural review status */
  culturallyReviewed: boolean;
  /** Source: editorial vs Isibalo submission */
  source: "editorial" | "community";
};
```

---

## Part 5 — Production Pipeline

| Step | Owner | Duration |
|------|-------|----------|
| Story research + synthesis | AI + human review | 2–3 hours |
| Cultural validation | Zambian community reviewer | 2–3 days |
| Illustration art direction | Human creative director | 1 hour |
| Illustration generation | AI (Midjourney / DALL-E 3) | 2–3 hours |
| Cultural review of illustrations | Zambian reviewer | 1–2 days |
| Integration into globe | Developer | 2–3 hours |

**Rate:** 2 illustrated, culturally reviewed cards per week. 8 per month.

---

## Part 6 — Launch Sequence (Content Architecture)

1. **Nyami Nyami** — highest shareability, bridges Colonial Wound to indigenous ecological knowledge
2. **Kuomboka** — most visually spectacular, Kingdom Age flagship
3. **Chitimukulu** — first animated path, establishes migration route pattern
4. **Makishi** — UNESCO pedigree, Northwestern Province
5. **Lamba copper spirits** — overlays Kansanshi, CopperCloud resonance

---

## Part 7 — Cross-References

| Topic | Doc |
|-------|-----|
| Full folk tale catalog, sources, coordinates | Content Architecture doc |
| Community → Inganji flow (Isibalo feeds folk tales) | `Community-Context.md` §2.5 |
| Marker taxonomy, Layers panel | `MUSEUM_ENHANCEMENT_PLAN.md` §2.4 |
| Sprint mapping | `MUSEUM_SPRINT_PLAN.md` C2 |
