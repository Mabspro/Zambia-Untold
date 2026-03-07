# Province Normalization

Use `scripts/normalize-provinces.mjs` to prepare a province GeoJSON before shipping it into the museum client.

What it does:
- rounds coordinates to a configurable precision (default `6` decimal places)
- injects a feature-level `bbox`
- injects a collection-level `bbox`
- warns when a feature is missing a supported province name property (`NAME_1`, `name`, `NAME`)

What it does not do:
- reproject non-WGS84 data
- repair winding order
- simplify geometry topology

## Commands

Preview into a separate file:

```bash
npm run normalize:provinces
```

Overwrite the source file in place:

```bash
npm run normalize:provinces -- --write
```

Use a custom source and output path:

```bash
npm run normalize:provinces -- --input public/data/source.geojson --output public/data/zambia-provinces.normalized.geojson
```

Change precision:

```bash
npm run normalize:provinces -- --precision 5
```

## Expected source shape

- GeoJSON `FeatureCollection`
- province name available in one of:
  - `properties.NAME_1`
  - `properties.name`
  - `properties.NAME`
  - `properties.shapeName`

## Workflow

1. Normalize the incoming province file.
2. Replace [zambia-provinces.geojson](/C:/Users/mabsp/zambia-untold/public/data/zambia-provinces.geojson).
3. Load the app in development.
4. Let [ProvinceHighlight.tsx](/C:/Users/mabsp/zambia-untold/components/Globe/ProvinceHighlight.tsx) surface any name or geometry mismatches.

