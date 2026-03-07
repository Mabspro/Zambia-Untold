export type MarkerLayer = "core" | "geological" | "community" | "folklore";

export type Marker = {
  id: string;
  epoch: number;
  epochLabel: string;
  tag: string;
  coordinates: { lat: number; lng: number; alt: number };
  headline: string;
  subhead: string;
  color: string;
  accentHex: number;
  /** Marker taxonomy: core (copper), geological (stone), community (amber), folklore (spiral) */
  layer?: MarkerLayer;
};

export const MARKERS: Marker[] = [
  {
    id: "kalambo-falls",
    epoch: -476000,
    epochLabel: "476,000 BC",
    tag: "ARCHAEOLOGY",
    coordinates: { lat: -8.6067, lng: 31.2256, alt: 800 },
    headline: "Before the Pyramid. Before the Wheel. Before Homo Sapiens.",
    subhead:
      "The oldest engineered structure in human history isn't in Egypt. It's in Zambia.",
    color: "#B87333",
    accentHex: 0xb87333,
  },
  {
    id: "kabwe-skull",
    epoch: -299000,
    epochLabel: "299,000 BC",
    tag: "PALEOANTHROPOLOGY",
    coordinates: { lat: -14.4469, lng: 28.4528, alt: 1200 },
    headline:
      "The Face of Our Ancestor Was Found in Zambia. And Then Forgotten.",
    subhead:
      "One of the most complete pre-human skulls ever found. Still in London.",
    color: "#C97B3A",
    accentHex: 0xc97b3a,
  },
  {
    id: "twin-rivers",
    epoch: -400000,
    epochLabel: "400,000 BC",
    tag: "HUMAN CONSCIOUSNESS",
    coordinates: { lat: -15.3, lng: 28.2, alt: 1280 },
    headline: "The First Artist Lived in Zambia. 400,000 Years Ago.",
    subhead:
      "Before cave paintings in France. A hominin here collected red ochre and made meaning.",
    color: "#D4862A",
    accentHex: 0xd4862a,
  },
  {
    id: "ingombe-ilede",
    epoch: 1450,
    epochLabel: "14th-17th Century",
    tag: "MEDIEVAL TRADE",
    coordinates: { lat: -16.6, lng: 27.7, alt: 500 },
    headline:
      "While Europe Had the Dark Ages, Zambia Had a Global Trade City.",
    subhead:
      "A commercial hub on the Zambezi connected to Arab, Swahili, and Portuguese networks.",
    color: "#C8851A",
    accentHex: 0xc8851a,
  },
  {
    id: "kansanshi",
    epoch: 1150,
    epochLabel: "12th Century",
    tag: "ECONOMIC HISTORY",
    coordinates: { lat: -12.0833, lng: 25.8667, alt: 1350 },
    headline: "Zambia Invented Copper Currency in the 12th Century.",
    subhead: "Then was told it had no economy.",
    color: "#B87333",
    accentHex: 0xb87333,
  },
  {
    id: "lusaka-independence",
    epoch: 1961,
    epochLabel: "1961-1964",
    tag: "LIBERATION",
    coordinates: { lat: -15.4167, lng: 28.2833, alt: 1280 },
    headline:
      "The Nonviolent Revolution That Freed a Nation and the World Never Heard of It.",
    subhead:
      "Cha-cha-cha: a decentralized civil disobedience campaign that forced Britain to negotiate.",
    color: "#C8851A",
    accentHex: 0xc8851a,
  },
  {
    id: "nkoloso-space-academy",
    epoch: 1964,
    epochLabel: "1964",
    tag: "SPACE SOVEREIGNTY",
    coordinates: { lat: -15.416, lng: 28.283, alt: 1280 },
    headline: "Nkoloso Declared Zambia Would Reach Mars.",
    subhead:
      "At independence, Edward Mukuka Nkoloso built a space academy in Lusaka and challenged colonial limits on African scientific ambition.",
    color: "#3FA060",
    accentHex: 0x3fa060,
    layer: "core",
  },
  // Geology & colonial infrastructure (A4 content expansion)
  {
    id: "katanga-substrate",
    epoch: -900_000_000,
    epochLabel: "900 Million BC",
    tag: "GEOLOGICAL SUBSTRATE",
    coordinates: { lat: -12.56, lng: 28.44, alt: 1200 },
    headline: "The Copper Substrate Crystallizes.",
    subhead:
      "Hydrothermal fluids deposit copper into the Katanga Supergroup above three converging cratons. Zambia's ore bodies form before complex life exists on Earth.",
    color: "#8B7355",
    accentHex: 0x8b7355,
    layer: "geological",
  },
  {
    id: "kariba-dam",
    epoch: 1955,
    epochLabel: "1955-1959",
    tag: "COLONIAL INFRASTRUCTURE",
    coordinates: { lat: -16.52, lng: 28.76, alt: 500 },
    headline: "Kariba Dam: The Zambezi Tamed for Colonial Power.",
    subhead:
      "The Tonga believed Nyami Nyami, the river god, would resist. 57,000 people were displaced. The dam powered the Copperbelt — extraction infrastructure, not development.",
    color: "#B87333",
    accentHex: 0xb87333,
    layer: "core",
  },
  {
    id: "copperbelt-railway",
    epoch: 1909,
    epochLabel: "1900s",
    tag: "EXTRACTION CORRIDOR",
    coordinates: { lat: -12.8, lng: 28.2, alt: 1200 },
    headline: "The Railways That Moved Copper Out, Not Communities In.",
    subhead:
      "Colonial rail built to connect mines to ports. Value flowed outward. The same corridors that carried pre-colonial trade now carried extraction.",
    color: "#9A8B7A",
    accentHex: 0x9a8b7a,
    layer: "core",
  },
];
