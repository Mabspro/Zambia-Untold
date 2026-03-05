/**
 * Deep-Time Geological Vignettes
 * ──────────────────────────────
 * "Global time, sovereign place."
 *
 * Each vignette juxtaposes a major geological era/period with Zambia's
 * specific role in that chapter. The design principle: we never show
 * generic dinosaur content. Every frame lands in a Zambian "so what" —
 * why this landscape is mineral-rich, why the plateau exists, why certain
 * basins hold groundwater or fossils.
 *
 * Structure follows the ICS hierarchy at the ERA level (not period),
 * with selected famous periods surfaced only when narratively useful.
 */

export type DeepTimeVignette = {
  id: string;
  /** Display order (geological, oldest first) */
  order: number;
  /** Era name for the visitor */
  era: string;
  /** Famous period name if narratively useful, else null */
  period: string | null;
  /** Year range for time scrubber matching */
  yearRange: [number, number];
  /** Title shown on the vignette card */
  title: string;
  /** Cinematic subtitle */
  subtitle: string;
  /** Global context: what was happening worldwide */
  globalContext: string;
  /** Zambia-specific context: where "Zambia" was, what it was like */
  zambiaContext: string;
  /** The "so what" — tie back to modern Zambia */
  soWhat: string;
  /** A deeper geological note for curious visitors */
  geologicalNote: string;
  /** Palette accent color for the vignette */
  accentColor: string;
  /** Globe focus coordinates (lat, lng) */
  focusCoordinates: { lat: number; lng: number };
  /** Estimated paleolatitude of "Zambia" in this era */
  paleolatitude: string;
  /** Key Zambian geological formations from this era */
  formations: string[];
  /** Modern Zambian consequences */
  modernConsequences: string[];
};

export const DEEP_TIME_VIGNETTES: DeepTimeVignette[] = [
  {
    id: "gondwana-assembly",
    order: 1,
    era: "Precambrian",
    period: "Neoproterozoic",
    yearRange: [-2500000000, -541000000],
    title: "Gondwana Assembly",
    subtitle: "When the continent was forged",
    globalContext:
      "Earth's earliest supercontinents were assembling and breaking apart. Rodinia fragmented, then Gondwana began to coalesce as tectonic plates collided. Oxygen was rising in the atmosphere, and the first complex multicellular life was just appearing after the Snowball Earth glaciations.",
    zambiaContext:
      "The rocks beneath Zambia today were being born. The Congo and Kalahari cratons — ancient cores of continental crust over 2 billion years old — were colliding and welding together along orogenic belts: the Zambezi Belt, the Lufilian Arc, and the Mozambique Belt. These collision zones crumpled and metamorphosed ancient seafloor sediments, creating the geological architecture that would define Zambia's mineral wealth forever.",
    soWhat:
      "The Lufilian Arc — the collision scar between the Congo and Kalahari cratons — is the Copperbelt. Every tonne of copper ever mined in Zambia was deposited in sedimentary basins along this ancient continental suture. The substrate precedes the nation by 900 million years.",
    geologicalNote:
      "The Katanga Supergroup sediments, deposited in rift basins during Neoproterozoic time (~880–600 Ma), host the stratiform copper-cobalt deposits of the Copperbelt. Hydrothermal fluids migrating through these sediments during the Lufilian Orogeny concentrated metals along specific stratigraphic horizons. This is not an accident of history — it is the fundamental geological event that made Zambia's economy possible.",
    accentColor: "#8B4513",
    focusCoordinates: { lat: -12.5, lng: 28.3 },
    paleolatitude: "~30°S, deep inside assembling Gondwana",
    formations: [
      "Katanga Supergroup",
      "Muva Supergroup",
      "Basement Complex gneisses",
      "Lufilian Arc fold belt",
    ],
    modernConsequences: [
      "The Copperbelt — 6% of global copper reserves",
      "Cobalt deposits critical for battery technology",
      "The geological reason Zambia's economy exists",
      "Groundwater aquifers in ancient sedimentary basins",
    ],
  },
  {
    id: "gondwana-ice-house",
    order: 2,
    era: "Late Paleozoic",
    period: "Carboniferous–Permian",
    yearRange: [-541000000, -252000000],
    title: "Gondwana Ice House",
    subtitle: "When Zambia froze near the South Pole",
    globalContext:
      "The supercontinent Gondwana drifted over the South Pole, triggering one of Earth's great ice ages. Massive glaciers covered southern Gondwana while tropical forests flourished near the equator, laying down the coal deposits that would fuel the Industrial Revolution in the Northern Hemisphere. The Permian ended with the greatest mass extinction in Earth's history — the 'Great Dying' that killed 90% of marine species.",
    zambiaContext:
      "The land that would become Zambia sat deep inside Gondwana, at roughly 60°S latitude — closer to the South Pole than Antarctica is today. Ice sheets advanced and retreated across the landscape. As the ice melted, vast shallow lakes and river systems formed in subsiding basins, depositing the Karoo sediments: sandstones, mudstones, and coal measures. The Luangwa and mid-Zambezi valleys were beginning their geological lives as rift basins.",
    soWhat:
      "The Karoo coal deposits in the Luangwa and Zambezi valleys are the frozen memory of this ice age. The rift basins that formed during Gondwana's glaciation are the same valleys that today hold Zambia's largest national parks — South Luangwa, Lower Zambezi. The landscape that tourists visit for safari was carved by ice 300 million years ago.",
    geologicalNote:
      "Glacial tillites (the Dwyka Formation equivalent) are found in the mid-Zambezi basin, proving ice sheets reached this far into the continent. The subsequent Karoo Supergroup — Ecca and Beaufort equivalents — records the transition from glacial to post-glacial environments. Coal seams at Maamba in the Zambezi valley are direct products of Permian swamp forests that colonized the warming landscape.",
    accentColor: "#4682B4",
    focusCoordinates: { lat: -15.5, lng: 28.3 },
    paleolatitude: "~60°S, deep southern Gondwana",
    formations: [
      "Karoo Supergroup",
      "Dwyka-equivalent tillites",
      "Ecca-equivalent coal measures",
      "Luangwa rift sediments",
    ],
    modernConsequences: [
      "Maamba coal mine — Zambia's coal reserves",
      "Luangwa Valley — carved by ancient rifting",
      "South Luangwa National Park's landscape geometry",
      "Groundwater in Karoo sandstone aquifers",
    ],
  },
  {
    id: "pangaea-mega-rivers",
    order: 3,
    era: "Mesozoic",
    period: "Jurassic–Cretaceous",
    yearRange: [-252000000, -66000000],
    title: "Pangaea Mega-Rivers",
    subtitle: "The ancestors of the Zambezi",
    globalContext:
      "Pangaea — the supercontinent that included all of Gondwana plus Laurasia — was breaking apart. The Atlantic Ocean was opening. Dinosaurs dominated every continent. Warm greenhouse climates meant no polar ice caps, and sea levels were far higher than today. Giant river systems drained the continental interiors.",
    zambiaContext:
      "Central Africa, including future Zambia, was part of the slowly fragmenting Gondwana. The climate was warm and seasonal, with vast floodplains and mega-river systems flowing northward through what is now the Congo–Zambezi watershed. Detrital zircon studies from Central African sediments reveal massive drainage networks — the ancestors of both the Congo and Zambezi river systems. Dinosaurs moved across these floodplains, though the fossil record in Zambia is sparse compared to Tanzania or South Africa.",
    soWhat:
      "These Jurassic and Cretaceous mega-rivers are the geological ancestors of the Zambezi. The drainage patterns established 150 million years ago — northward flow through the Congo basin, southward flow toward the Indian Ocean — are the same patterns that today underwrite Zambia's hydropower at Kariba and Kafue, and the logistics corridors that move copper to ports. The rivers remember what the nations forgot.",
    geologicalNote:
      "Provenance studies using detrital zircon populations in Central African sediments (e.g., Linol et al., 2016) reveal that during the Jurassic–Cretaceous, large rivers drained from southern Africa northward into the Congo basin and ultimately into the Tethys Ocean. The 'paleo-Congo' system was one of the largest drainage networks on Earth. The modern bifurcation of the Congo and Zambezi systems is a younger, Cenozoic development driven by plateau uplift.",
    accentColor: "#228B22",
    focusCoordinates: { lat: -13.0, lng: 28.5 },
    paleolatitude: "~35°S, drifting northward as Gondwana fragments",
    formations: [
      "Cretaceous-age sediments in Barotse basin",
      "Kalahari Group proto-sediments",
      "Pipe sandstones",
      "Residual laterite profiles",
    ],
    modernConsequences: [
      "The Zambezi drainage pattern — hydropower backbone",
      "Congo–Zambezi watershed divide",
      "Kalahari sand cover in Western Province",
      "Ancient river channels as groundwater conduits",
    ],
  },
  {
    id: "cretaceous-greenhouse",
    order: 4,
    era: "Late Mesozoic",
    period: "Late Cretaceous",
    yearRange: [-100000000, -66000000],
    title: "Cretaceous Greenhouse",
    subtitle: "Warm floodplains before the asteroid",
    globalContext:
      "The Late Cretaceous was one of the warmest periods in Earth history. No ice caps existed. Sea levels were 200+ meters higher than today. Africa was becoming recognizable as a separate continent, though still connected to South America via land bridges. Tyrannosaurus ruled North America; Spinosaurus hunted in North African rivers. Then, 66 million years ago, the Chicxulub asteroid ended it all.",
    zambiaContext:
      "The land of future Zambia was a warm, low-lying interior plateau covered in seasonal forests and crossed by broad, slow rivers. The Kalahari basin to the south was accumulating sediment. Laterite weathering profiles — deep red soils caused by intense tropical weathering — were forming across the landscape. These laterites locked in iron and aluminum, and in some cases concentrated residual minerals including manganese and bauxite. The area was quiet, green, and geologically stable — a contrast to the dramatic rifting happening along Africa's eastern margin.",
    soWhat:
      "The deep laterite soils of Zambia — the red earth that defines the landscape — are a direct product of Cretaceous tropical weathering. Every red road, every brick building, every farmer tilling laterite soil is working with material weathered under Cretaceous greenhouse conditions. The asteroid that killed the dinosaurs 66 million years ago paradoxically preserved these soil profiles by ending the biological processes that would have continued transforming them.",
    geologicalNote:
      "The African Surface — a regionally extensive peneplain with thick laterite profiles — is largely attributed to prolonged Cretaceous-to-Paleogene chemical weathering under warm, humid conditions. In Zambia, these weathering profiles reach 30–50 meters depth and are economically significant: they host residual mineral concentrations (e.g., manganese at Mansa) and form the parent material for most of Zambia's agricultural soils.",
    accentColor: "#CD853F",
    focusCoordinates: { lat: -14.0, lng: 28.0 },
    paleolatitude: "~25°S, recognizably 'African' position",
    formations: [
      "African Surface laterites",
      "Kalahari Group basal sediments",
      "Residual manganese deposits",
      "Deep weathering profiles (dambo landscapes)",
    ],
    modernConsequences: [
      "Zambia's red laterite soils — the basis of agriculture",
      "Dambo wetland landscapes across the plateau",
      "Manganese deposits at Mansa",
      "The 'red earth' that defines the national landscape",
    ],
  },
  {
    id: "zambezi-plateau-rise",
    order: 5,
    era: "Cenozoic",
    period: "Neogene–Quaternary",
    yearRange: [-66000000, -300000],
    title: "Rise of the Zambezi Plateau",
    subtitle: "When the landscape became Zambia",
    globalContext:
      "The Cenozoic saw the rise of mammals, then primates, then hominins. Africa collided with Eurasia, closing the Tethys Ocean and creating the Mediterranean. The East African Rift system began tearing the continent apart. Global cooling led to Antarctic ice sheets, then Northern Hemisphere glaciation. The world was becoming modern.",
    zambiaContext:
      "This is when Zambia's landscape took its modern form. The Central African Plateau uplifted by hundreds of meters, driven by deep mantle processes (the 'African Superswell'). This uplift reorganized the entire drainage system: the ancient northward-flowing rivers were captured and redirected. The Zambezi was born as a distinct river system, flowing eastward to the Indian Ocean instead of north to the Congo. Victoria Falls formed as the Zambezi cut down through basalt layers. The Bangweulu wetlands, Kafue Flats, and Barotse floodplain took shape. And on this newly elevated, well-watered plateau, the earliest stone tool makers appeared.",
    soWhat:
      "The plateau that is Zambia — the elevation that gives it its climate, its water, its arable land — is a Cenozoic creation. Victoria Falls is only about 2 million years old, younger than the human lineage. The Kafue Flats, which support millions of people and massive biodiversity, are a geological infant. The Kabwe skull — Homo heidelbergensis, 300,000 years old — was found on this plateau. Zambia's human story begins on a landscape that was still actively forming. The substrate and the people are intertwined from the very beginning.",
    geologicalNote:
      "The African Superswell — a broad topographic anomaly attributed to deep mantle upwelling — elevated the Central African Plateau by 500–1000 meters during the Neogene. This triggered river capture events: the upper Zambezi (originally Congo-ward) was captured by a headward-eroding Indian Ocean–directed stream, creating the modern Zambezi. Victoria Falls sits at the current knickpoint of this drainage reorganization, retreating upstream through Karoo basalts at ~1 km per 100,000 years. The Kabwe (Broken Hill) skull, found in 1921, remains one of the most important hominin fossils in Africa.",
    accentColor: "#DAA520",
    focusCoordinates: { lat: -15.4, lng: 28.3 },
    paleolatitude: "~15°S, essentially modern position",
    formations: [
      "Victoria Falls basalt gorges",
      "Kalahari Group sediments",
      "Bangweulu Basin lacustrine deposits",
      "Kabwe (Broken Hill) cave deposits",
    ],
    modernConsequences: [
      "Victoria Falls — geological infant, global wonder",
      "The Zambezi river system — Zambia's lifeline",
      "Kafue Flats — biodiversity and food security",
      "The Central African Plateau — Zambia's climate and water",
      "Kabwe skull — one of Africa's most important hominin fossils",
    ],
  },
];

/**
 * Get the vignette that matches a given scrub year.
 * Returns null if the year falls outside all vignette ranges.
 */
export function getVignetteForYear(year: number): DeepTimeVignette | null {
  for (const v of DEEP_TIME_VIGNETTES) {
    if (year >= v.yearRange[0] && year < v.yearRange[1]) {
      return v;
    }
  }
  return null;
}

/**
 * Get all vignettes in geological order (oldest first).
 */
export function getAllVignettes(): DeepTimeVignette[] {
  return [...DEEP_TIME_VIGNETTES].sort((a, b) => a.order - b.order);
}
