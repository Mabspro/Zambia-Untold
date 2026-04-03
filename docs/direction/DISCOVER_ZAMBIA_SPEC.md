# Discover Zambia — Product Spec
_Drafted: 2026-04-03_

---

## Purpose

`Discover Zambia` is the place lens for Zambia Untold.

It is **not** a tourism widget, a booking engine, or a generic attractions list.
It is a curated way to encounter Zambia through places that carry geological, ecological, historical, and cultural depth.

The rule is simple:

> Show places as layers of meaning, not destinations with price tags.

If Zambia Untold holds the archive and the observatory, `Discover Zambia` holds the invitation:
*go there, see it, and understand why it matters.*

---

## Naming

Use **Discover Zambia**.

Do not label this layer:
- Tourism
- Travel
- Destinations
- Things to do

Those phrases collapse the platform into the language of booking sites.
This product should sound like Zambia Untold sounds: curious, dignified, and rooted.

---

## Role In The Platform

`Discover Zambia` supports three existing platform goals:

1. **Discovery**
   It gives first-time and returning visitors a lighter but still meaningful entry into place.

2. **Diaspora connection**
   It creates a direct emotional bridge: *fly to it, read it, recognize it, remember it*.

3. **Commercial possibility later**
   It can eventually host partner listings, guides, operators, and lodges without contaminating the editorial core.

This matters because Zambia Untold should be able to grow into tourism, education, diaspora engagement, and national branding **without becoming a tourism site**.

---

## Route Decision

Recommended implementation path:

- Primary surface: `/discover`
- Secondary future option: a `Places` panel on the globe in `deep-time` or `historical` mode

Why `/discover` first:

- it keeps the globe as hero on the homepage
- it avoids overloading the museum front door
- it gives place discovery enough breathing room for images, filters, and editorial framing
- it keeps the archive and observatory routes distinct

For the first build, choose the route-first model:

```txt
/           → museum / globe / orientation
/archive    → approved archive browsing
/discover   → curated place discovery
```

---

## Scope For Phase 1

Build a curated browse surface with:

- a list/grid of curated places
- place cards with image, short contextual description, province, category, and coordinates
- category filters
- province filters
- globe fly-to link or action
- clean outbound link field for official/reference follow-through

Out of scope for Phase 1:

- booking flows
- pricing
- operator dashboards
- reviews
- moderation tools
- user submissions
- map-first competition with the globe hero

---

## Experience Standard

Each place must feel like:

- a real place
- with historical or ecological weight
- in the voice of Zambia Untold

Every place card should answer:

1. What is this place?
2. Why does it matter in Zambia?
3. Where is it?
4. What can the user do next: fly there, read more, or go deeper elsewhere?

If a place cannot answer those, it is not ready for inclusion.

---

## Editorial Rules

### 1. Editorial before commercial

Curated place content is the main surface.
Commercial listings must always be visually and structurally separate.

### 2. Description length

Each curated place gets:

- `shortDescription`: 1 sentence
- `contextNote`: 1-2 sentences

This is not long-form editorial. The route should feel discoverable and scan-friendly.

### 3. Voice

Write in the Zambia Untold register:

- confident
- specific
- dignified
- never brochure-like

Avoid:

- “perfect getaway”
- “must-see destination”
- “hidden gem” unless used very carefully and rarely
- inflated superlatives without context

Prefer:

- “sacred to…”
- “one of the oldest…”
- “the place where…”
- “formed by…”
- “holds evidence of…”

### 4. Credibility

Every place should have a grounding reason for inclusion:

- ecological importance
- historical importance
- geological significance
- cultural or ceremonial significance
- under-taught national importance

---

## Categories

Start with these categories:

```ts
export type DiscoverCategory =
  | "nature"
  | "heritage"
  | "cultural"
  | "geological";
```

Category guidance:

- `nature`: wetlands, falls, parks, migrations, ecological systems
- `heritage`: archaeological, historical, or nationally significant built/recorded sites
- `cultural`: ceremonies, sacred landscapes, living traditions, artistic memory
- `geological`: substrate, escarpments, falls, basins, formations tied to deep time

Multi-category membership is allowed.

---

## Phase 1 Curation List

This is the starting editorial set. It intentionally mixes globally known places with nationally important places that are often under-shown.

### 1. Victoria Falls / Mosi-oa-Tunya

- Province: Southern
- Categories: `nature`, `geological`, `cultural`
- Coordinates: `-17.92, 25.86`
- Why it belongs:
  The largest curtain of falling water on Earth, but also a place with older names and deeper belonging than the colonial one.
- Short description:
  The Smoke That Thunders is both a geological event and a sacred landscape.

### 2. South Luangwa National Park

- Province: Eastern
- Categories: `nature`
- Coordinates: `-13.10, 31.55`
- Why it belongs:
  One of Africa’s great wildlife systems and the birthplace of the walking safari.
- Short description:
  A valley shaped by deep geological time and known today for leopard density, elephants, and river life.

### 3. Kundalila Falls

- Province: Central
- Categories: `nature`, `geological`
- Coordinates: `-12.85, 29.67`
- Why it belongs:
  Strong beauty, strong local meaning, and exactly the kind of place absent from generic global lists.
- Short description:
  A 75-metre fall near Serenje whose Lala name, “crying dove,” gives the place its emotional register.

### 4. Bangweulu Wetlands

- Province: Northern / Luapula edge context
- Categories: `nature`, `cultural`
- Coordinates: `-11.50, 29.50`
- Why it belongs:
  One of Africa’s major wetland systems and a place where ecological scale meets Zambian memory.
- Short description:
  “Where the water meets the sky” is less a slogan than an accurate description of the landscape.

### 5. Mwela Rock Paintings

- Province: Northern
- Categories: `heritage`, `cultural`
- Coordinates: `-10.23, 31.13`
- Why it belongs:
  Essential to the visual grammar of the platform and one of the most important rock-art concentrations in southern Africa.
- Short description:
  Ancient BaTwa rock art near Kasama, where circles, grids, and figures become a record of perception itself.

### 6. Nachikufu Cave

- Province: Muchinga
- Categories: `heritage`, `cultural`
- Coordinates: `-12.18, 31.08`
- Why it belongs:
  Rock art, sacred continuity, and deep human presence.
- Short description:
  A national monument near Mpika where BaTwa artistic memory reaches back over millennia.

### 7. Kalambo Falls

- Province: Northern
- Categories: `geological`, `heritage`, `nature`
- Coordinates: `-8.60, 31.20`
- Why it belongs:
  One of the most important places in the entire project due to the 476,000-year-old wooden structure.
- Short description:
  A waterfall at the edge of the border and one of the most important human-engineering discoveries on Earth.

### 8. Kasanka National Park

- Province: Central
- Categories: `nature`
- Coordinates: `-12.55, 29.22`
- Why it belongs:
  The world’s largest mammal migration is not a Zambian fact most people know.
- Short description:
  A small park with a planetary-scale event: millions of fruit bats crossing the sky in one season.

### 9. Ing’ombe Ilede

- Province: Southern
- Categories: `heritage`, `cultural`
- Coordinates: `-16.60, 27.70`
- Why it belongs:
  Proof that Zambia was part of long-distance trade worlds rather than peripheral to them.
- Short description:
  A Zambezi trade site where copper, ivory, beads, and global exchange met centuries before colonial rule.

### 10. Lealui / Limulunga Floodplain Route

- Province: Western
- Categories: `cultural`, `nature`
- Coordinates: `-15.30, 23.10`
- Why it belongs:
  Kuomboka is one of the strongest living ceremony-place connections in the country.
- Short description:
  The Lozi floodplain route where a kingdom moves with the water rather than against it.

### 11. Mwansabombwe / Mutomboko

- Province: Luapula
- Categories: `cultural`
- Coordinates: `-12.00, 28.97`
- Why it belongs:
  Ceremony as memory, movement, kingship, and public performance.
- Short description:
  The Lunda victory dance made visible: not folklore as artifact, but history in motion.

### 12. Nsalu Cave

- Province: Central
- Categories: `heritage`, `cultural`
- Coordinates: `-12.84, 30.23`
- Why it belongs:
  White schematic rock art with ritual context and a different visual register from Mwela.
- Short description:
  A rainmaking and rock-art site near Serenje, where abstraction carries ceremonial memory.

---

## Optional Phase 1.5 Additions

Add these after the first build if quality stays high:

- Lower Zambezi National Park
- Kafue Flats
- Shiwa Ng’andu
- Liuwa Plain
- Kabwe Skull / Broken Hill interpretive site context
- Samfya shoreline and lake systems
- Copperbelt industrial-heritage route

These should only land if the editorial standard remains strong.

---

## Data Model

```ts
export type DiscoverCategory =
  | "nature"
  | "heritage"
  | "cultural"
  | "geological";

export interface DiscoverPlaceLink {
  label: string;
  href: string;
  kind: "official" | "reference" | "partner";
}

export interface DiscoverPartner {
  name: string;
  label: string;
  href: string;
  badge: "Partner";
  category: "operator" | "lodge" | "guide";
}

export interface DiscoverPlace {
  id: string;
  slug: string;
  name: string;
  altName?: string | null;
  province: string;
  categories: DiscoverCategory[];
  coordinates: {
    lat: number;
    lng: number;
  };
  heroImage?: string | null;
  thumbnailImage?: string | null;
  shortDescription: string;
  contextNote: string;
  whyItMatters: string;
  sourceNote?: string | null;
  links: DiscoverPlaceLink[];
  partners?: DiscoverPartner[];
  featured: boolean;
}
```

### Implementation note

For Phase 1, these records can live in a local data file:

```txt
data/discoverPlaces.ts
```

No backend is required at first.

---

## UI Shape

Recommended route composition:

```txt
app/discover/page.tsx
components/discover/
  DiscoverHero.tsx
  DiscoverFilters.tsx
  DiscoverPlaceGrid.tsx
  DiscoverPlaceCard.tsx
  DiscoverPlaceDetail.tsx
lib/discover/
  categories.ts
  places.ts
```

### Route sections

1. **Hero**
   - title: `Discover Zambia`
   - one-paragraph framing
   - quick filter chips

2. **Filter rail**
   - province
   - category
   - featured/all

3. **Place grid**
   - cards with image, title, province, categories, short description

4. **Place detail panel or section**
   - longer context note
   - fly-to-globe action
   - outbound links

5. **Partner zone**
   - only if partner data exists
   - clearly labeled and visually separated

---

## Globe Connection

Every place should support:

- `Fly to place`
- optional `Open in globe`

The interaction model:

1. user selects a place in `/discover`
2. app stores the place selection
3. user can jump to `/` with a route state or query
4. homepage globe flies to the coordinates

This should feel like a bridge, not a second map product.

Do not build a map-heavy `/discover` page that competes with the homepage globe.

---

## Partner Layer (Later)

This is where monetization can enter, but only later and only carefully.

Partner content rules:

- it never appears above editorial content
- it must be labeled `Partner`
- it must be visually distinct from curated place content
- it must never overwrite the editorial description
- it must never determine inclusion in the curated list

Example later structure:

```txt
Curated place card
↓
Partner listings
  - guide
  - lodge
  - local operator
```

This keeps trust intact.

---

## Empty States And Honesty

If no places exist for a filter combination:

> No curated places match this view yet.
> Try widening the province or category filters.

If a place has no image yet:

- show a dignified placeholder
- never a broken image
- no generic beach/palm visual nonsense

If no partner data exists:

- show nothing
- do not show fake placeholders

---

## Why This Fits Zambia Untold

Because the platform is already about:

- where Zambia came from
- what Zambia is dealing with now
- where Zambia could go

`Discover Zambia` answers the adjacent but important question:

> Where, physically, can I go to feel the country more directly?

That makes it a natural fourth route after the core surfaces are stable, not a bolt-on.

---

## Build Order Recommendation

When implementation begins:

1. create `data/discoverPlaces.ts`
2. create `/discover`
3. build editorial cards and filters only
4. wire `fly to globe`
5. add partner layer only after traffic and trust justify it

Do not start with:

- booking
- partner monetization
- large API integrations
- user submissions

---

## One-Line Test

> Does this make Zambia feel more knowable without making the product feel like a travel site?

If yes, ship it.
If not, cut it.
