# 🇿🇲 ZAMBIA UNTOLD

**The history you were never taught.**

An interactive 3D globe experience cataloguing Zambia's deep history — from 900 million years of geological formation through kingdoms, colonialism, and sovereignty. A living archive where community stories, folk tales, and historical events are mapped onto the planet.

> *"Before there were nations, there was a substrate."*

---

## ✨ Features

### 🌍 Interactive Globe
- **Three.js / React Three Fiber** powered 3D Earth with crisp satellite textures
- **Responsive FOV** — globe sizes correctly on mobile, tablet, and desktop
- **CameraRig** with smooth fly-to animations when selecting markers
- **Auto-rotate** with Africa-centered idle snap
- **Data overlays**: Zambia boundary, province highlights, Zambezi river evolution, Katanga formation

### 📅 Historical Calendar (Zambia's Living Calendar)
- **41 events** across all 12 months — ceremonies, independence milestones, geological discoveries
- **Category filtering**: ceremonies, politics, archaeology, nature, culture, geology
- **"On This Day"** feature highlights nearby events
- **Places to Visit** — each event links to a physical location with globe navigation
- **Global Context** — situates each event in world history

### 🔥 Inganji (Folk Tales & Mythology)
- **9 flagship folk tales**: Nyami Nyami, Kuomboka, Chitimukulu, Makishi, Gule Wamkulu, and more
- **Tradition filtering** by ethnic group (Tonga, Lozi, Bemba, Lunda, Chewa, Lamba)
- **Tier system**: Flagship, Regional, Urban & Living
- **Cultural review** badges for validated content

### 📍 Village Search ("See Your Village From Space")
- **Nominatim geocoding** — search any town, village, river, or landmark in Zambia
- **Fly-to navigation** — globe camera flies to selected location
- **Curated suggestions**: Lusaka, Livingstone, Kabwe, Kasama, Solwezi, Mongu, and more
- **Debounced search** with loading states and province display

### ✦ Isibalo (Community Contributions)
- **Submit memories**, oral traditions, family histories, folk tales, photographs
- **Epoch tagging** — place your story in deep time (476K BC → Present)
- **Location tagging** with place names
- **Creative Commons Attribution** consent
- **localStorage persistence** (Supabase integration planned)

### 🪨 Deep Time Panel
- **9 geological epochs** from Pre-Geological through Unfinished Sovereign
- **Retractible/minimizable** — collapse to a slim pill, expand back to full panel
- **Global context** + **Zambia context** for each epoch
- **"So What"** sections connecting geology to modern Zambia
- **Formations, paleolatitude, and modern consequences** for each era

### 🏛️ Museum Passport
- **Progress tracking** — visited zones, markers, galleries
- **Return visitor awareness** — remembers your last era on reload
- **Clean landing** — no clutter on refresh, just the globe

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| 3D Engine | Three.js + React Three Fiber |
| Animation | Framer Motion |
| Styling | Tailwind CSS (custom copper/ochre palette) |
| State | React hooks + localStorage passport |
| Geocoding | Nominatim (OpenStreetMap) |
| Fonts | Display, body, mono, citation system |

---

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/Mabspro/Zambia-Untold.git
cd Zambia-Untold

# Install dependencies
npm install

# Run development server
npm run dev

# Open
http://localhost:3000
```

---

## 📊 Content Inventory

| Content Type | Count | Coverage |
|-------------|-------|---------|
| Calendar Events | 41 | All 12 months |
| Folk Tales | 9 | 6 ethnic traditions |
| Globe Markers | 9 | Deep Time → Sovereign |
| Deep Time Vignettes | 9 | Pre-Geological → Present |
| Narrative Entries | 9 | Per-marker detail panels |

---

## 🗺️ Roadmap (Sprint B1)

See [`ZAMBIA_UNTOLD_SPRINT_B1_INTEGRATION_BRIEF.md`](./ZAMBIA_UNTOLD_SPRINT_B1_INTEGRATION_BRIEF.md) for the full integration plan:

- **Google Photorealistic 3D Tiles** — Museum ↔ Live Earth toggle
- **Digital Earth Africa** satellite layers (Sentinel-2, water, NDVI)
- **NGDR geospatial overlays** (chiefdom boundaries, national parks)
- **Seasonal real-time events** (Kuomboka floods, fire season, rainy greening)
- **NASA FIRMS** fire hotspot integration

---

## 🧭 Philosophy

> *"Global tools, Zambian vantage point, Zambian data partnerships."*

Every integration passes the sovereignty test: *Does this make a Zambian child see their country as a place with depth, texture, and living systems?*

The data is global. The vantage point is Zambian. The stories are sovereign.

---

## 📄 License

Creative Commons Attribution — community contributions displayed under CC-BY.

---

*Zambia Untold · Isibalo · The Living Archive*
