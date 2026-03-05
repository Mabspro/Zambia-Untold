/**
 * Zambia's Living Historical Calendar
 * ====================================
 * "On This Day in Zambia" — mapping the full year to Zambian history,
 * folk traditions, geological events, and global context.
 *
 * This is not a conventional calendar. It is a temporal atlas —
 * every date anchored to the deepest layers of Zambian identity.
 *
 * Architecture: Each month holds events tagged by category, epoch,
 * and optionally cross-referenced to globe coordinates and global parallels.
 */

import type { DeepTimeZone } from "@/lib/deepTime";

export type CalendarCategory =
  | "independence"
  | "archaeology"
  | "geology"
  | "trade"
  | "kingdom"
  | "colonial"
  | "liberation"
  | "culture"
  | "ecology"
  | "folklore"
  | "diplomacy"
  | "infrastructure"
  | "education"
  | "mining"
  | "music"
  | "sport"
  | "ceremony"
  | "astronomy";

export type CalendarEvent = {
  id: string;
  day: number;
  month: number; // 1-12
  title: string;
  description: string;
  year?: number;
  epochZone?: DeepTimeZone;
  category: CalendarCategory;
  coordinates?: { lat: number; lng: number };
  /** What was happening globally at the same time */
  globalContext?: string;
  /** Related marker ID on the globe */
  relatedMarkerId?: string;
  /** Source or attribution */
  source?: string;
  /** Whether this is a national holiday */
  isNationalHoliday?: boolean;
  /** Whether community-contributed */
  isCommunityContributed?: boolean;
  /** Place to visit related to this event */
  placeToVisit?: {
    name: string;
    description: string;
    coordinates: { lat: number; lng: number };
  };
};

export const CALENDAR_EVENTS: CalendarEvent[] = [
  // ═══════════════════════════════════════════════════════════════
  // JANUARY
  // ═══════════════════════════════════════════════════════════════
  {
    id: "jan-1-new-year",
    day: 1, month: 1,
    title: "New Year's Day",
    description: "Zambia begins another year of the unfinished sovereign story. Since 1964, each new year has carried the question: who benefits from the ground beneath our feet?",
    year: 2026,
    category: "independence",
    isNationalHoliday: true,
    epochZone: "UNFINISHED SOVEREIGN",
    globalContext: "While the world celebrates, Zambia's copper mines continue to operate — the same substrate that crystallized 900 million years ago.",
  },
  {
    id: "jan-8-kundalila",
    day: 8, month: 1,
    title: "Kundalila Falls — the Crying Dove",
    description: "Kundalila Falls in Serenje district drops 75 metres into a misty pool. Its name means 'crying dove' in Lala. The area holds some of the oldest evidence of human settlement in Central Africa.",
    category: "ecology",
    epochZone: "ZAMBIA DEEP",
    coordinates: { lat: -12.85, lng: 29.67 },
    placeToVisit: {
      name: "Kundalila Falls",
      description: "75m waterfall near Serenje. Swimming pool at the base. Sacred to the Lala people.",
      coordinates: { lat: -12.85, lng: 29.67 },
    },
  },
  {
    id: "jan-15-kasanka",
    day: 15, month: 1,
    title: "Kasanka Bat Migration Afterglow",
    description: "By mid-January, the world's largest mammal migration — up to 10 million straw-coloured fruit bats — is winding down at Kasanka National Park. Each bat travels from across the Congo Basin. No other place on Earth concentrates this many mammals in one location.",
    category: "ecology",
    epochZone: "UNFINISHED SOVEREIGN",
    coordinates: { lat: -12.55, lng: 29.22 },
    globalContext: "The Serengeti wildebeest migration (~2 million) is often called the world's greatest. Kasanka's bat congregation dwarfs it by 5x. Most textbooks don't mention it.",
    placeToVisit: {
      name: "Kasanka National Park",
      description: "Smallest national park in Zambia. Hosts the world's largest mammal migration (fruit bats, Oct–Dec). Community-managed conservation.",
      coordinates: { lat: -12.55, lng: 29.22 },
    },
  },
  {
    id: "jan-20-copper-discovery",
    day: 20, month: 1,
    title: "William Collier's Roan Antelope (1902)",
    description: "In 1902, American scout William Collier shot a roan antelope near Luanshya. The bullet hit copper ore beneath the surface. This accidental discovery accelerated colonial interest in the Copperbelt — but copper had been mined by indigenous communities for at least 800 years before.",
    year: 1902,
    category: "mining",
    epochZone: "COLONIAL WOUND",
    coordinates: { lat: -13.14, lng: 28.39 },
    globalContext: "In 1902, the British South Africa Company already held mineral concessions. The 'discovery' was a colonial reframing of indigenous knowledge.",
    relatedMarkerId: "kansanshi",
  },
  {
    id: "jan-25-nachikufu",
    day: 25, month: 1,
    title: "Nachikufu Cave — Rock Art of the BaTwa",
    description: "Nachikufu Cave near Mpika contains rock art dating back over 15,000 years. The BaTwa (San/Bushmen) left geometric patterns, animal figures, and handprints that represent one of the oldest continuous artistic traditions in Southern Africa.",
    category: "archaeology",
    epochZone: "ZAMBIA DEEP",
    coordinates: { lat: -12.18, lng: 31.08 },
    placeToVisit: {
      name: "Nachikufu Cave",
      description: "National monument near Mpika. 15,000-year-old rock art. Sacred site of the BaTwa people.",
      coordinates: { lat: -12.18, lng: 31.08 },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // FEBRUARY
  // ═══════════════════════════════════════════════════════════════
  {
    id: "feb-2-wetlands-day",
    day: 2, month: 2,
    title: "World Wetlands Day — Bangweulu, Zambia's Heart",
    description: "The Bangweulu Wetlands ('where the water meets the sky') cover over 15,000 km² and are home to the endemic black lechwe and the critically endangered shoebill stork. David Livingstone died here in 1873, but the wetlands had sustained the Bemba people for centuries before any European arrived.",
    category: "ecology",
    coordinates: { lat: -11.5, lng: 29.5 },
    epochZone: "KINGDOM AGE",
    globalContext: "Bangweulu is one of Africa's largest wetland systems. The shoebill stork, which lives here, is closer genetically to pelicans than to any stork.",
    placeToVisit: {
      name: "Bangweulu Wetlands",
      description: "15,000 km² wetland. Home to black lechwe, shoebill stork. Livingstone's final resting place. Accessible from Samfya.",
      coordinates: { lat: -11.5, lng: 29.5 },
    },
  },
  {
    id: "feb-14-kuomboka-preparation",
    day: 14, month: 2,
    title: "Kuomboka Preparations Begin",
    description: "As the Zambezi floods, the Litunga (Lozi King) begins preparations for Kuomboka — 'to get out of the water.' The royal barge Nalikwanda will carry the king from the floodplain capital Lealui to the dry-season capital Limulunga. This is one of the oldest surviving ceremonies in Africa.",
    category: "ceremony",
    epochZone: "KINGDOM AGE",
    coordinates: { lat: -15.3, lng: 23.1 },
    globalContext: "Kuomboka predates most European monarchic ceremonies still practiced today. The Lozi kingdom's dual-capital system is a sophisticated adaptation to seasonal flooding.",
    placeToVisit: {
      name: "Lealui / Limulunga — Kuomboka Route",
      description: "The Lozi floodplain. Attend Kuomboka (usually Feb–Apr). One of Africa's most spectacular ceremonies.",
      coordinates: { lat: -15.3, lng: 23.1 },
    },
  },
  {
    id: "feb-20-ingombe-ilede-trade",
    day: 20, month: 2,
    title: "Cross-Continental Trade at Ing'ombe Ilede",
    description: "Archaeological evidence shows that by the 14th century, traders at Ing'ombe Ilede on the Zambezi exchanged copper ingots, gold, ivory, and glass beads with Swahili, Arab, and Portuguese merchants. Zambia was not peripheral to world trade — it was a hub.",
    year: 1450,
    category: "trade",
    epochZone: "COPPER EMPIRE",
    coordinates: { lat: -16.6, lng: 27.7 },
    relatedMarkerId: "ingombe-ilede",
    globalContext: "While Florence was funding the Renaissance with banking, Zambia was funding trans-continental trade with copper currency.",
  },

  // ═══════════════════════════════════════════════════════════════
  // MARCH
  // ═══════════════════════════════════════════════════════════════
  {
    id: "mar-8-womens-day-zambia",
    day: 8, month: 3,
    title: "International Women's Day — Julia Chikamoneka",
    description: "Julia Chikamoneka (1910–1986) was one of the founding mothers of Zambian independence. She organized women across Northern Rhodesia, was repeatedly imprisoned by colonial authorities, and helped build the movement that became the United National Independence Party. She is the mother of Zambian political activism.",
    year: 1961,
    category: "liberation",
    epochZone: "COLONIAL WOUND",
    coordinates: { lat: -15.4, lng: 28.3 },
    relatedMarkerId: "lusaka-independence",
    globalContext: "While Rosa Parks refused to move in 1955, Julia Chikamoneka was already organizing mass civil disobedience in Northern Rhodesia.",
  },
  {
    id: "mar-12-youth-day",
    day: 12, month: 3,
    title: "Youth Day in Zambia",
    description: "Zambia's Youth Day commemorates the energy of young Zambians in the liberation struggle and in building the nation. Over 60% of Zambia's population is under 25 — the largest youth demographic in Southern Africa.",
    category: "independence",
    isNationalHoliday: true,
    epochZone: "UNFINISHED SOVEREIGN",
    globalContext: "Zambia has one of the youngest populations on Earth. The median age is 17.6 years — meaning half the country wasn't alive when the millennium turned.",
  },
  {
    id: "mar-18-livingstone-museum",
    day: 18, month: 3,
    title: "Livingstone Museum — Zambia's Oldest Museum",
    description: "The Livingstone Museum (est. 1934) is the oldest and largest museum in Zambia. It holds over 25,000 artefacts including Stone Age tools from Kalambo Falls, ethnographic collections from all 73 ethnic groups, and David Livingstone's personal effects. Most Zambian children have never visited.",
    category: "education",
    coordinates: { lat: -17.85, lng: 25.86 },
    epochZone: "UNFINISHED SOVEREIGN",
    placeToVisit: {
      name: "Livingstone Museum",
      description: "Zambia's oldest museum. Stone Age tools, 73 ethnic group collections. Mosi-oa-Tunya Road, Livingstone.",
      coordinates: { lat: -17.85, lng: 25.86 },
    },
  },
  {
    id: "mar-25-kalambo-woodwork",
    day: 25, month: 3,
    title: "The Oldest Engineered Structure — Kalambo Falls",
    description: "476,000 years ago, a hominin at Kalambo Falls interlocked two logs with a deliberate notch — the oldest engineered wooden structure ever discovered. This predates Homo sapiens. The discovery was confirmed by Nature in September 2023.",
    year: -476000,
    category: "archaeology",
    epochZone: "ZAMBIA DEEP",
    coordinates: { lat: -8.5967, lng: 31.2356 },
    relatedMarkerId: "kalambo-falls",
    globalContext: "The Great Pyramid of Giza was built in 2560 BC. Kalambo's structure predates it by 473,440 years.",
    placeToVisit: {
      name: "Kalambo Falls",
      description: "UNESCO World Heritage candidate. 221m waterfall — the second-highest uninterrupted fall in Africa. Archaeological site of global significance.",
      coordinates: { lat: -8.5967, lng: 31.2356 },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // APRIL
  // ═══════════════════════════════════════════════════════════════
  {
    id: "apr-1-kuomboka",
    day: 1, month: 4,
    title: "Kuomboka Ceremony (typical window)",
    description: "The Kuomboka ceremony takes place when the Zambezi floods reach the Lozi capital at Lealui. The Litunga boards the Nalikwanda (royal barge), accompanied by paddlers in traditional dress, and travels to Limulunga. The ceremony involves thousands of spectators, drumming that can be heard for kilometres, and represents over 300 years of continuous tradition.",
    category: "ceremony",
    epochZone: "KINGDOM AGE",
    coordinates: { lat: -15.3, lng: 23.1 },
    globalContext: "The Kuomboka is UNESCO Intangible Cultural Heritage. Only a handful of African ceremonies have been practiced continuously for over three centuries.",
  },
  {
    id: "apr-18-kabwe-found",
    day: 18, month: 4,
    title: "Broken Hill Skull Discovery (1921)",
    description: "On this approximate date in 1921, Tom Zwiglaar discovered the Broken Hill (Kabwe) skull — a 299,000-year-old Homo heidelbergensis cranium. It is one of the most complete pre-human fossils ever found. It was shipped to London and has never been returned.",
    year: 1921,
    category: "archaeology",
    epochZone: "COLONIAL WOUND",
    coordinates: { lat: -14.4469, lng: 28.4528 },
    relatedMarkerId: "kabwe-skull",
    globalContext: "The skull sits in the Natural History Museum in London. Zambia has formally requested its return. It remains one of the most significant repatriation cases in archaeology.",
  },
  {
    id: "apr-28-barotse-agreement",
    day: 28, month: 4,
    title: "Barotseland Agreement (1964)",
    description: "The Barotseland Agreement of 1964 was signed between the Litunga of the Lozi people and the Government of Northern Rhodesia (soon to be Zambia). It guaranteed Barotseland's internal self-governance in exchange for joining the new Republic. Its implementation remains one of Zambia's most complex constitutional questions.",
    year: 1964,
    category: "diplomacy",
    epochZone: "UNFINISHED SOVEREIGN",
    coordinates: { lat: -15.36, lng: 23.13 },
  },

  // ═══════════════════════════════════════════════════════════════
  // MAY
  // ═══════════════════════════════════════════════════════════════
  {
    id: "may-1-labour-day",
    day: 1, month: 5,
    title: "Labour Day — The Copperbelt Miners",
    description: "Zambia's Labour Day carries special resonance in the Copperbelt. In 1935, African miners at Mufulira and Nkana went on strike against colonial mining companies — one of the first organized labor actions in colonial Africa. 6 miners were killed. These strikes planted the seeds of the independence movement.",
    year: 1935,
    category: "liberation",
    isNationalHoliday: true,
    epochZone: "COLONIAL WOUND",
    coordinates: { lat: -12.54, lng: 28.24 },
    globalContext: "The 1935 Copperbelt strikes predated many organized labor movements across colonial Africa. The miners' demands were about dignity, not just wages.",
  },
  {
    id: "may-15-shiwa-ngandu",
    day: 15, month: 5,
    title: "Shiwa Ng'andu — The Africa House",
    description: "Shiwa Ng'andu ('Lake of the Royal Crocodile') is an English country house built in the bush of northern Zambia by Stewart Gore-Browne in the 1920s. This surreal colonial mansion, modelled on English estates, sits amid wild Africa — a monument to both colonial ambition and the complex entanglements of empire. Gore-Browne later became a champion of African independence.",
    category: "colonial",
    coordinates: { lat: -11.2, lng: 31.7 },
    epochZone: "COLONIAL WOUND",
    placeToVisit: {
      name: "Shiwa Ng'andu Estate",
      description: "Colonial manor house in the African bush. Guesthouse accommodation. Near Kasanka. One of the strangest buildings on the continent.",
      coordinates: { lat: -11.2, lng: 31.7 },
    },
  },
  {
    id: "may-25-africa-day",
    day: 25, month: 5,
    title: "Africa Day — Zambia's Pan-African Legacy",
    description: "Zambia under Kaunda was the frontline of Pan-African liberation. Lusaka hosted the ANC, SWAPO, ZANU, FRELIMO, and MPLA liberation movements. Zambia sacrificed economic stability to support the liberation of Southern Africa — hosting refugees, enduring Rhodesian and South African military raids, and maintaining sanctions at enormous cost.",
    year: 1964,
    category: "diplomacy",
    isNationalHoliday: true,
    epochZone: "UNFINISHED SOVEREIGN",
    coordinates: { lat: -15.4, lng: 28.3 },
    globalContext: "Zambia hosted more liberation movements than any other frontline state. The ANC's headquarters were in Lusaka from 1960 until 1990. Without Zambia, the timeline of Southern African liberation would have been very different.",
  },

  // ═══════════════════════════════════════════════════════════════
  // JUNE
  // ═══════════════════════════════════════════════════════════════
  {
    id: "jun-5-environment",
    day: 5, month: 6,
    title: "World Environment Day — South Luangwa",
    description: "South Luangwa National Park contains one of the densest concentrations of wildlife in Africa. The walking safari was invented here by Norman Carr in the 1950s. The Luangwa Valley has been called 'the valley of the leopard' — with the highest leopard density on the continent.",
    category: "ecology",
    coordinates: { lat: -13.1, lng: 31.55 },
    epochZone: "UNFINISHED SOVEREIGN",
    placeToVisit: {
      name: "South Luangwa National Park",
      description: "Birthplace of the walking safari. Exceptional leopard, elephant, and hippo populations. Mfuwe Gate. Best: May–October.",
      coordinates: { lat: -13.1, lng: 31.55 },
    },
    globalContext: "The walking safari — now a premium global tourism product — was born in Zambia. Norman Carr believed the future of conservation lay in community benefit, not exclusion.",
  },
  {
    id: "jun-17-lenshina",
    day: 17, month: 6,
    title: "Alice Lenshina and the Lumpa Church",
    description: "Alice Mulenga Lenshina (1920–1978) founded the Lumpa Church in Northern Province in 1953 — one of the largest independent African Christian movements. The church rejected witchcraft, colonial authority, and eventually clashed with both the colonial and post-independence governments. Over 700 people died in the Lumpa uprising of 1964. Lenshina remains one of the most complex figures in Zambian history.",
    year: 1953,
    category: "culture",
    epochZone: "COLONIAL WOUND",
    coordinates: { lat: -11.2, lng: 29.2 },
    globalContext: "The Lumpa Church was one of the largest genuinely indigenous Christian movements in colonial Africa. Lenshina's story challenges simple narratives of colonialism and independence.",
  },
  {
    id: "jun-24-mwata-kazembe",
    day: 24, month: 6,
    title: "Mutomboko Ceremony — The Lunda Victory Dance",
    description: "The Mutomboko is the annual ceremony of the Lunda people of Luapula Province, celebrating the arrival of Mwata Kazembe and his warriors. The ceremony features the dramatic victory dance of the paramount chief — a display of strength, tradition, and the memory of the Lunda migration from the Congo.",
    category: "ceremony",
    epochZone: "KINGDOM AGE",
    coordinates: { lat: -12.0, lng: 28.97 },
    placeToVisit: {
      name: "Mwansabombwe — Mutomboko Ceremony",
      description: "Annual Lunda ceremony near Mwansabombwe, Luapula Province. Usually late June/July. The chief's dance is unforgettable.",
      coordinates: { lat: -12.0, lng: 28.97 },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // JULY
  // ═══════════════════════════════════════════════════════════════
  {
    id: "jul-4-heroes-day",
    day: 4, month: 7,
    title: "Heroes' Day",
    description: "Zambia commemorates the heroes and heroines of the independence struggle. This includes Kenneth Kaunda, Harry Mwaanga Nkumbula, Simon Mwansa Kapwepwe, Julia Chikamoneka, Nakatindi Nganga, and thousands of unnamed Zambians who organized, marched, were imprisoned, and died for freedom.",
    category: "independence",
    isNationalHoliday: true,
    epochZone: "UNFINISHED SOVEREIGN",
    relatedMarkerId: "lusaka-independence",
  },
  {
    id: "jul-5-unity-day",
    day: 5, month: 7,
    title: "Unity Day",
    description: "Unity Day celebrates Zambia's 73 ethnic groups living together in one nation. 'One Zambia, One Nation' — Kenneth Kaunda's founding motto. In a continent where colonial borders often divided ethnic groups, Zambia's relative internal peace is not an accident. It was a choice, made repeatedly.",
    category: "independence",
    isNationalHoliday: true,
    epochZone: "UNFINISHED SOVEREIGN",
  },
  {
    id: "jul-14-victoria-falls",
    day: 14, month: 7,
    title: "Mosi-oa-Tunya — The Smoke That Thunders",
    description: "Victoria Falls (Mosi-oa-Tunya in Lozi/Tonga) is the largest sheet of falling water on Earth — 1,708 metres wide, 108 metres high. The falls were named by David Livingstone in 1855, but the Tonga and Lozi peoples had known them for centuries as 'The Smoke That Thunders.' The spray can be seen from 50 kilometres away.",
    category: "ecology",
    coordinates: { lat: -17.92, lng: 25.86 },
    epochZone: "ZAMBIA DEEP",
    globalContext: "Victoria Falls is wider than Niagara Falls and twice its height. It is one of the Seven Natural Wonders of the World. The geological formation dates to approximately 2 million years ago.",
    placeToVisit: {
      name: "Victoria Falls (Mosi-oa-Tunya)",
      description: "UNESCO World Heritage Site. The largest curtain of falling water on Earth. View from Zambian side (Livingstone) or bridge walkway. Best flow: Feb–May.",
      coordinates: { lat: -17.92, lng: 25.86 },
    },
  },
  {
    id: "jul-22-likumbi-lya-mize",
    day: 22, month: 7,
    title: "Likumbi Lya Mize — Day of Makishi",
    description: "The Luvale people of Northwestern Province celebrate Likumbi Lya Mize — the annual masquerade festival featuring Makishi dancers. The masked figures represent ancestral spirits and are part of the mukanda initiation tradition. UNESCO has declared Makishi an Intangible Cultural Heritage of Humanity.",
    category: "ceremony",
    epochZone: "KINGDOM AGE",
    coordinates: { lat: -13.5, lng: 23.0 },
    globalContext: "UNESCO recognized Makishi masquerade in 2005. The masks are carved from wood and represent specific spiritual figures — Chizaluke, Kayipu, Mupala — each with distinct meaning.",
  },

  // ═══════════════════════════════════════════════════════════════
  // AUGUST
  // ═══════════════════════════════════════════════════════════════
  {
    id: "aug-1-farmers-day",
    day: 1, month: 8,
    title: "Farmers' Day",
    description: "Zambia's agricultural sector employs over 50% of the population. Before colonialism, Zambian communities developed sophisticated farming systems — the Lozi's flood-recession agriculture in Barotseland, the chitemene (slash-and-burn) system of the Bemba, and the cattle-management systems of the Tonga. These were not primitive — they were ecologically calibrated.",
    category: "culture",
    isNationalHoliday: true,
    epochZone: "UNFINISHED SOVEREIGN",
    globalContext: "The chitemene system has been studied by ecologists as a sustainable long-rotation farming method. Colonial administrators dismissed it as 'destructive' — a judgment now being revised.",
  },
  {
    id: "aug-12-nsalu-cave",
    day: 12, month: 8,
    title: "Nsalu Cave Paintings",
    description: "Nsalu Cave in Serenje district contains white schematic rock art — geometrical patterns, circles, and lines — believed to be associated with rainmaking rituals. These paintings may be among the most recent rock art in Zambia, possibly created within the last 2,000 years by Late Stone Age communities.",
    category: "archaeology",
    epochZone: "ZAMBIA DEEP",
    coordinates: { lat: -12.67, lng: 30.42 },
    placeToVisit: {
      name: "Nsalu Cave",
      description: "White schematic rock art near Serenje. National monument. Rainmaking ritual site. Accessible by dirt road from the Great North Road.",
      coordinates: { lat: -12.67, lng: 30.42 },
    },
  },
  {
    id: "aug-20-tazara",
    day: 20, month: 8,
    title: "TAZARA Railway — China, Zambia, Tanzania",
    description: "The Tanzania-Zambia Railway (TAZARA), built between 1970–1975, was the longest railway in sub-Saharan Africa at 1,860 km. Funded by China when the West refused, it gave landlocked Zambia access to the port of Dar es Salaam — breaking dependence on white-ruled Rhodesia and South Africa for copper exports.",
    year: 1975,
    category: "infrastructure",
    epochZone: "UNFINISHED SOVEREIGN",
    coordinates: { lat: -8.9, lng: 31.9 },
    globalContext: "TAZARA was the largest foreign aid project in African history at the time. 25,000 Chinese workers helped build it. It remains a symbol of South-South cooperation.",
  },

  // ═══════════════════════════════════════════════════════════════
  // SEPTEMBER
  // ═══════════════════════════════════════════════════════════════
  {
    id: "sep-5-kalambo-nature",
    day: 5, month: 9,
    title: "Kalambo Discovery Published in Nature (2023)",
    description: "On September 20, 2023, the journal Nature published the discovery of the world's oldest known wooden structure at Kalambo Falls, Zambia — dated to 476,000 years ago. This rewrote the timeline of human engineering by hundreds of thousands of years. The builder was not Homo sapiens, but an earlier hominin species.",
    year: 2023,
    category: "archaeology",
    epochZone: "UNFINISHED SOVEREIGN",
    coordinates: { lat: -8.5967, lng: 31.2356 },
    relatedMarkerId: "kalambo-falls",
    globalContext: "The publication made global headlines but quickly faded from news cycles. Most Zambians still don't know about it.",
  },
  {
    id: "sep-14-zambezi-source",
    day: 14, month: 9,
    title: "The Source of the Zambezi",
    description: "The Zambezi River rises from a black marshy spring in Mwinilunga district, Northwestern Province, near the border with the Democratic Republic of Congo. From this modest source, it flows 2,574 km to the Indian Ocean — the fourth-longest river in Africa. It passes through or borders six countries, but it begins in Zambia.",
    category: "ecology",
    epochZone: "ZAMBIA DEEP",
    coordinates: { lat: -11.37, lng: 24.31 },
    placeToVisit: {
      name: "Source of the Zambezi",
      description: "Mwinilunga district, NW Province. Marked by a small monument. The beginning of the fourth-longest river in Africa.",
      coordinates: { lat: -11.37, lng: 24.31 },
    },
  },
  {
    id: "sep-22-twin-rivers-ochre",
    day: 22, month: 9,
    title: "Twin Rivers — The First Artist",
    description: "At Twin Rivers Kopje near Lusaka, archaeologists found evidence of red ochre being collected and deliberately processed 400,000 years ago. This is among the earliest evidence of symbolic behaviour in human evolutionary history — meaning, not survival. Art, not tool-making.",
    year: -400000,
    category: "archaeology",
    epochZone: "ZAMBIA DEEP",
    coordinates: { lat: -15.3, lng: 28.2 },
    relatedMarkerId: "twin-rivers",
    globalContext: "The Lascaux cave paintings in France (17,000 years old) are often cited as humanity's earliest art. Twin Rivers predates them by 383,000 years.",
  },

  // ═══════════════════════════════════════════════════════════════
  // OCTOBER
  // ═══════════════════════════════════════════════════════════════
  {
    id: "oct-18-prayer-day",
    day: 18, month: 10,
    title: "National Prayer Day",
    description: "Zambia is one of the few countries in the world with a constitutionally declared National Prayer Day. Frederick Chiluba declared Zambia a 'Christian nation' in 1991. The day is uniquely Zambian — a reflection of the deep intertwining of faith and national identity.",
    category: "culture",
    isNationalHoliday: true,
    epochZone: "UNFINISHED SOVEREIGN",
    globalContext: "Zambia is one of only a handful of countries worldwide that constitutionally declares itself a Christian nation and observes a national prayer day.",
  },
  {
    id: "oct-24-independence",
    day: 24, month: 10,
    title: "Independence Day — October 24, 1964",
    description: "At midnight on October 24, 1964, the Union Jack was lowered and the Zambian flag was raised. Kenneth Kaunda wept. 'One Zambia, One Nation.' The Cha-cha-cha campaign — a decentralized, nonviolent civil disobedience movement organized without smartphones or social media — had won. Zambia was free.",
    year: 1964,
    category: "independence",
    isNationalHoliday: true,
    epochZone: "UNFINISHED SOVEREIGN",
    coordinates: { lat: -15.4, lng: 28.3 },
    relatedMarkerId: "lusaka-independence",
    globalContext: "Zambia gained independence the same year as Malawi and Malta. It was the 35th African nation to gain independence. Within 10 years, it would become the frontline host for liberation movements across Southern Africa.",
    placeToVisit: {
      name: "Freedom Statue — Lusaka",
      description: "The Freedom Statue outside the National Assembly. Represents the breaking of colonial chains. Independence Avenue, Lusaka.",
      coordinates: { lat: -15.387, lng: 28.322 },
    },
  },
  {
    id: "oct-28-ncwala",
    day: 28, month: 10,
    title: "Nc'wala Ceremony — First Fruits of the Ngoni",
    description: "The Nc'wala is the first fruits ceremony of the Ngoni people of Eastern Province, presided over by Paramount Chief Mpezeni. The ceremony involves the chief tasting the first harvest of the season. The Ngoni migrated from Zululand (South Africa) in the 1830s and settled in what is now Chipata district — one of the longest migration stories in Southern African history.",
    category: "ceremony",
    epochZone: "KINGDOM AGE",
    coordinates: { lat: -13.63, lng: 32.65 },
    placeToVisit: {
      name: "Nc'wala Ceremony Ground — Chipata",
      description: "Annual Ngoni ceremony near Chipata, Eastern Province. Usually late February. Traditional dances, warrior displays.",
      coordinates: { lat: -13.63, lng: 32.65 },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // NOVEMBER
  // ═══════════════════════════════════════════════════════════════
  {
    id: "nov-1-bat-migration",
    day: 1, month: 11,
    title: "Kasanka Bat Migration Peak",
    description: "In early November, the straw-coloured fruit bat migration at Kasanka reaches its peak — up to 10 million bats roosting in a tiny mushitu (swamp forest) of just 2 hectares. At dusk, they leave in a column that darkens the sky. At dawn, they return. No other mammal congregation on Earth is this dense.",
    category: "ecology",
    coordinates: { lat: -12.55, lng: 29.22 },
    epochZone: "UNFINISHED SOVEREIGN",
    globalContext: "The Kasanka bat migration was unknown to science until 1980. It is now recognized as the world's largest mammal migration by headcount.",
  },
  {
    id: "nov-11-remembrance",
    day: 11, month: 11,
    title: "Remembrance Day — Zambian Soldiers in World Wars",
    description: "Over 3,500 Northern Rhodesian soldiers served in World War II — fighting in Burma, East Africa, and the Middle East. They returned to a country that still denied them basic rights. Many of these veterans later became the backbone of the independence movement. Their service is rarely mentioned in global WWII histories.",
    year: 1945,
    category: "colonial",
    epochZone: "COLONIAL WOUND",
    globalContext: "African soldiers in WWII numbered over 1 million across the continent. Their contributions are among the most systematically erased in global military history.",
  },
  {
    id: "nov-18-kafue-flats",
    day: 18, month: 11,
    title: "Kafue Flats — Zambia's Serengeti",
    description: "The Kafue Flats is one of the largest floodplain systems in Southern Africa. The Kafue lechwe — a species found nowhere else on Earth — lives here in herds of over 40,000. The flats are critical to Zambia's water cycle and support communities who have fished and farmed here for millennia.",
    category: "ecology",
    coordinates: { lat: -15.8, lng: 27.5 },
    epochZone: "UNFINISHED SOVEREIGN",
    placeToVisit: {
      name: "Kafue National Park / Blue Lagoon",
      description: "Largest national park in Zambia (22,400 km²). Endemic Kafue lechwe. Blue Lagoon National Park on the eastern Kafue Flats.",
      coordinates: { lat: -15.8, lng: 25.85 },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // DECEMBER
  // ═══════════════════════════════════════════════════════════════
  {
    id: "dec-1-world-aids",
    day: 1, month: 12,
    title: "World AIDS Day — Zambia's Response",
    description: "Zambia was one of the hardest-hit countries by the HIV/AIDS pandemic, with prevalence peaking at over 16% in the early 2000s. Through massive public health campaigns, community health workers, and programs like PEPFAR, Zambia reduced prevalence to approximately 11% by 2025. This is a story of resilience, not just suffering.",
    category: "culture",
    epochZone: "UNFINISHED SOVEREIGN",
    globalContext: "Zambia's HIV/AIDS response is studied worldwide as a model of community-based healthcare. The community health worker model pioneered here has been adopted across sub-Saharan Africa.",
  },
  {
    id: "dec-10-human-rights",
    day: 10, month: 12,
    title: "Human Rights Day — Kabwe Skull Repatriation Campaign",
    description: "The campaign to return the Broken Hill (Kabwe) skull from London's Natural History Museum is one of the most significant cultural repatriation cases in the world. The 299,000-year-old Homo heidelbergensis skull was removed during the colonial period. Zambia has formally requested its return. It has not been returned.",
    category: "diplomacy",
    epochZone: "UNFINISHED SOVEREIGN",
    relatedMarkerId: "kabwe-skull",
    coordinates: { lat: -14.4469, lng: 28.4528 },
    globalContext: "Greece seeks the Elgin Marbles. Nigeria seeks the Benin Bronzes. Zambia seeks the Kabwe Skull. These are all the same story: colonial extraction of cultural heritage.",
  },
  {
    id: "dec-25-christmas",
    day: 25, month: 12,
    title: "Christmas in Zambia",
    description: "Christmas in Zambia is celebrated with church services, community gatherings, and traditional foods — nsima with chicken, village beer, and roasted groundnuts. In rural areas, Christmas is often the one time of year when extended families reunite. The celebration blends Christian tradition with deep communal values that predate colonialism.",
    category: "culture",
    isNationalHoliday: true,
    epochZone: "UNFINISHED SOVEREIGN",
  },
  {
    id: "dec-31-kariba",
    day: 31, month: 12,
    title: "Kariba Dam Completion Anniversary (1959)",
    description: "Kariba Dam was completed in 1959, creating what was then the largest man-made lake in the world. 57,000 Tonga people were forcibly relocated. The dam powered the Copperbelt mines — extraction infrastructure built for colonial industry. The Tonga believed Nyami Nyami, the Zambezi River god, would destroy the dam. He hasn't. But the scars haven't healed either.",
    year: 1959,
    category: "infrastructure",
    epochZone: "COLONIAL WOUND",
    coordinates: { lat: -16.52, lng: 28.76 },
    relatedMarkerId: "kariba-dam",
    globalContext: "Kariba remains one of the largest dams in Africa. The displacement of the Tonga people is one of the largest forced relocations in Southern African history.",
  },
];

/**
 * Get events for a specific month.
 */
export function getEventsForMonth(month: number): CalendarEvent[] {
  return CALENDAR_EVENTS.filter((e) => e.month === month).sort((a, b) => a.day - b.day);
}

/**
 * Get today's events (or events for a specific day/month).
 */
export function getEventsForDay(day: number, month: number): CalendarEvent[] {
  return CALENDAR_EVENTS.filter((e) => e.day === day && e.month === month);
}

/**
 * Get the nearest event to today.
 */
export function getNearestEvent(day: number, month: number): CalendarEvent | null {
  const todayEvents = getEventsForDay(day, month);
  if (todayEvents.length > 0) return todayEvents[0];

  // Find the nearest upcoming event this month
  const monthEvents = getEventsForMonth(month);
  const upcoming = monthEvents.filter((e) => e.day >= day);
  if (upcoming.length > 0) return upcoming[0];

  // Wrap to the next month
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextMonthEvents = getEventsForMonth(nextMonth);
  return nextMonthEvents[0] ?? null;
}

/**
 * Get all national holidays.
 */
export function getNationalHolidays(): CalendarEvent[] {
  return CALENDAR_EVENTS.filter((e) => e.isNationalHoliday);
}

/**
 * Get events by category.
 */
export function getEventsByCategory(category: CalendarCategory): CalendarEvent[] {
  return CALENDAR_EVENTS.filter((e) => e.category === category);
}

/**
 * Get all unique places to visit from calendar events.
 */
export function getPlacesToVisit(): CalendarEvent[] {
  return CALENDAR_EVENTS.filter((e) => e.placeToVisit != null);
}

/**
 * Month names.
 */
export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Category display labels and colors.
 */
export const CATEGORY_META: Record<CalendarCategory, { label: string; color: string }> = {
  independence: { label: "Independence", color: "#B87333" },
  archaeology: { label: "Archaeology", color: "#D4862A" },
  geology: { label: "Geology", color: "#8B7355" },
  trade: { label: "Trade", color: "#C8851A" },
  kingdom: { label: "Kingdom", color: "#CC7722" },
  colonial: { label: "Colonial", color: "#3A4A5C" },
  liberation: { label: "Liberation", color: "#C41E3A" },
  culture: { label: "Culture", color: "#9A8B7A" },
  ecology: { label: "Ecology", color: "#5A9A7A" },
  folklore: { label: "Folklore", color: "#D4943A" },
  diplomacy: { label: "Diplomacy", color: "#A8D8EA" },
  infrastructure: { label: "Infrastructure", color: "#6B7D8A" },
  education: { label: "Education", color: "#B8A58F" },
  mining: { label: "Mining", color: "#B87333" },
  music: { label: "Music", color: "#D4943A" },
  sport: { label: "Sport", color: "#5A9A7A" },
  ceremony: { label: "Ceremony", color: "#CC7722" },
  astronomy: { label: "Astronomy", color: "#A8D8EA" },
};
