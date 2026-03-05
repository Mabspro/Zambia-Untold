# Contributing to ZAMBIA UNTOLD

Thank you for contributing to The Atlas Museum. This guide explains how to add a new exhibit.

---

## Adding a New Exhibit

### 1. Add a marker in `data/markers.ts`

```ts
{
  id: "unique-slug",           // Used as key for narrative lookup
  epoch: -476000,              // Year (negative = BC)
  epochLabel: "476,000 BC",
  tag: "ARCHAEOLOGY",          // Uppercase category label
  coordinates: { lat: -8.5967, lng: 31.2356, alt: 800 },
  headline: "Short, punchy headline.",
  subhead: "Supporting line that expands the story.",
  color: "#B87333",
  accentHex: 0xb87333,
}
```

### 2. Add a narrative in `data/narratives.ts`

Create an entry keyed by the marker `id`:

```ts
"unique-slug": {
  body: `Your narrative text. Use paragraphs separated by blank lines.`,
  cta: "Call to action for the exhibition statement.",
  sources: [
    {
      label: "Source title",
      url: "https://...",
      year: 2023,
      confidence: "high",
      type: "academic",
      region: "Zambia",
    },
  ],
},
```

### 3. Add evidence sources

Each narrative should include at least one source. Use `sources: NarrativeSource[]`:

| Field | Purpose |
|-------|---------|
| `label` | Human-readable title (e.g. "Nature: Earliest known structural use of wood") |
| `url` | Link to source |
| `year` | Publication year (optional) |
| `confidence` | `"high"` \| `"medium"` \| `"disputed"` |
| `type` | `"academic"` \| `"archival"` \| `"oral"` \| `"media"` |
| `region` | `"Zambia"` \| `"Southern Africa"` \| `"Pan-African"` \| `"Global"` |

### 4. Optional: Add a visual layer

If the exhibit benefits from a globe layer (e.g. trade routes, mineral formation), add a component in `components/Globe/` and wire it in `Globe.tsx`. See `ZambeziLayer.tsx` or `KatangaFormationLayer.tsx` for patterns.

---

## Content Guidelines

- **Accuracy:** Prefer peer-reviewed or archival sources. Oral tradition is valid when labeled as such.
- **Sovereignty:** Center Zambian agency. Avoid colonial framing that treats Zambia as passive.
- **Evidence:** Every narrative should have at least one `NarrativeSource`. Academic claims require citations.
- **Tone:** Museum placard style — authoritative, accessible, not casual.

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The scrubber controls time; click markers to open exhibit panels.

---

## Before Submitting

- Run `npm run validate` (typecheck + lint + build)
- Ensure new markers appear at the correct epoch on the scrubber
- Verify Evidence tab shows sources correctly
