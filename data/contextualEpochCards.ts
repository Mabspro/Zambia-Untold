/**
 * Contextual Epoch Cards — content when scrubber is between markers.
 * Build-time generated from MUSEUM_ENHANCEMENT_PLAN Appendix D.
 */

import { getZoneForYear, type DeepTimeZone } from "@/lib/deepTime";

export type ContextualCard = {
  title: string;
  body: string;
  zone: DeepTimeZone;
  /**
   * True for the CopperCloud / 2026 terminal frame.
   * Signals NarrativePanel to render a visually distinct closing treatment.
   */
  isFinale?: boolean;
};

const CARDS: Record<DeepTimeZone, ContextualCard> = {
  "DEEP EARTH": {
    zone: "DEEP EARTH",
    title: "The Substrate Forms",
    body: `4.5 to 2.5 billion years ago, the copper substrate crystallized beneath what would become Zambia. Hydrothermal activity in the Congo Craton deposited the ore bodies that would not be discovered by humans for another 4.5 billion years. Zambia's mineral wealth is not a colonial discovery — it is a geological event that predates complex life on Earth.`,
  },
  "ANCIENT LIFE": {
    zone: "ANCIENT LIFE",
    title: "Gondwana and the Copperbelt",
    body: `Between 540 million and 5 million years ago, the African Shield stabilized. The Copperbelt's 900-million-year-old ore deposits formed — the oldest economically significant copper on Earth. In the Cretaceous, the landmass that would become Zambia sat within Gondwana, covered by a shallow sea. The copper ore bodies forming deep underground would not be discovered by humans for another 89.9 million years.`,
  },
  "HOMINID RISE": {
    zone: "HOMINID RISE",
    title: "The Rift Valley and the Savanna",
    body: `Between 5 million and 476,000 years ago, the Great Rift Valley began forming. The Zambezi River system took shape. The African savanna emerged. Hominid ancestors spread across East and Southern Africa. Australopithecus walked upright. Zambia's corridor became a migration highway. The populations that would become the 73 ethnic groups began to take shape.`,
  },
  "ZAMBIA DEEP": {
    zone: "ZAMBIA DEEP",
    title: "The Deep Human Past",
    body: `From 476,000 years ago to the turn of the first millennium, Zambia was a stage for the emergence of human intelligence. The oldest engineered structure. The face of our ancestor. The first artist. Hunter-gatherers, then Bantu-speaking farmers. Iron Age smelting. The copper that would become currency was already in the ground, waiting.`,
  },
  "COPPER EMPIRE": {
    zone: "COPPER EMPIRE",
    title: "Copper as Currency",
    body: `Between 1000 and 1600 CE, communities at Kansanshi mined copper, standardized it, and shaped it into cross-ingots for long-distance trade. Ing'ombe Ilede flourished as a commercial hub on the Zambezi, connected to Swahili, Arab, and Portuguese networks. Zambia was not peripheral to global trade. Zambia was at the center of it.`,
  },
  "KINGDOM AGE": {
    zone: "KINGDOM AGE",
    title: "The Four Kingdoms",
    body: `Between 1600 and 1890, four major kingdoms dominated the region: the Chewa in the east, the Bemba in the northeast, the Lunda on the Luapula, and the Lozi on the upper Zambezi floodplains. Sacred kingships. Territorial boundaries. The Tonga belief in Nyami Nyami, the Zambezi River god, already ancient.`,
  },
  "COLONIAL WOUND": {
    zone: "COLONIAL WOUND",
    title: "Extraction and Resistance",
    body: `From 1890 to 1964, the British South Africa Company secured concessions. Northern Rhodesia was formed. The Copperbelt mines boomed on Zambian labor. Railways were built to move copper out, not to connect communities. Heavy taxation. Racial segregation. And yet — the Cha-cha-cha campaign would force Britain to the table.`,
  },
  "UNFINISHED SOVEREIGN": {
    zone: "UNFINISHED SOVEREIGN",
    title: "The Present Tense",
    body: `Since 1964, Zambia has navigated independence, economic crisis, and democratic transition. SI 68 of 2025 requires that sovereignty extend to who benefits from the ground — progressive Zambian ownership of mining procurement. The first complete aerial geophysical survey of the substrate is still running. The same fault system that made the copper is now being mapped for clean hydrogen.`,
  },
};

export function getContextualCardForYear(year: number): ContextualCard | null {
  if (year >= 2025) {
    return {
      zone: "UNFINISHED SOVEREIGN",
      title: "Substrate → Structure → Sovereignty",
      body: `900 million years ago: hydrothermal fluids deposited copper into the Katanga Supergroup above converging cratons.\n\n476,000 years ago: a human engineer worked the land above it.\n\n12th century: copper became currency.\n\n1964: the nation became sovereign.\n\n2025: SI 68 requires that sovereignty extend to who benefits from the ground.\n\n2026: the first complete aerial geophysical survey of the substrate is still running — and the same fault system that made the copper is now being mapped for clean hydrogen.\n\nCopperCloud is the infrastructure layer for the next chapter: turning substrate intelligence into sovereign value creation.`,
      isFinale: true,
    };
  }
  const zone = getZoneForYear(year);
  return CARDS[zone] ?? null;
}
