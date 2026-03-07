/** Block types for structured narrative content. Enables images, quotes, captions anywhere. */
export type NarrativeBlock =
  | { type: "paragraph"; content: string }
  | { type: "image"; src: string; caption?: string; alt?: string }
  | { type: "quote"; content: string; attribution?: string };

export type NarrativeSource = {
  url: string;
  year?: number;
  confidence?: "high" | "medium" | "disputed";
  type?: "academic" | "archival" | "oral" | "media";
  label?: string;
  region?: "Zambia" | "Southern Africa" | "Pan-African" | "Global";
};

export type Narrative = {
  /** Legacy: plain text body. Used when blocks is empty. */
  body: string;
  /** Structured content. When present, overrides body rendering. */
  blocks?: NarrativeBlock[];
  cta: string;
  /** Optional hero image above narrative (e.g. /images/markers/kalambo-falls.jpg) */
  heroImage?: string;
  /** Structured source metadata for the Evidence tab. */
  sources?: NarrativeSource[];
};

export const NARRATIVES: Record<string, Narrative> = {
  "kalambo-falls": {
    body: `476,000 years ago before our species even existed a hominin at Kalambo Falls picked up two logs, notched them together, and built something.

Not a tool. A structure. Interlocking timber, deliberately shaped.

Archaeologists confirmed this in 2023. The discovery rewrote the timeline of human engineering by hundreds of thousands of years.

The builder was likely Homo heidelbergensis, a predecessor to both Homo sapiens and Neanderthals.

And yet: they built.

That site, Kalambo Falls on Zambia's border with Tanzania, is a UNESCO World Heritage candidate and one of the most important archaeological locations on Earth.

Most Zambians have never heard of it. Most of the world has not either.

    That changes now.`,
    cta: "Share if you did not know this. Most people do not.",
    sources: [
      {
        label: "Nature: Earliest known structural use of wood at Kalambo Falls",
        url: "https://www.nature.com/articles/s41586-023-06557-9",
        year: 2023,
        confidence: "high",
        type: "academic",
        region: "Zambia",
      },
      {
        label: "Smithsonian coverage of Kalambo discovery",
        url: "https://www.smithsonianmag.com/smart-news/archaeologists-uncover-notched-logs-that-may-be-the-oldest-known-wooden-structure-180982942/",
        year: 2023,
        confidence: "medium",
        type: "media",
        region: "Global",
      },
    ],
  },
  "kabwe-skull": {
    body: `In 1921, a Swiss miner named Tom Zwiglaar was digging in Broken Hill, now Kabwe, Zambia, when he uncovered a skull.

It was 299,000 years old.

It belonged to Homo heidelbergensis, one of the most direct ancestors in our evolutionary chain.

The skull is among the most complete hominin fossils ever discovered.

The British colonial government sent it to London. It is still there at the Natural History Museum.

Zambia has never had it back.

This skull, found in Zambian soil, represents one of the most significant moments in the story of what it means to be human.

Until now, Zambia has not controlled that story.`,
    cta: "Drop a fire emoji if you think this belongs in Zambia.",
    sources: [
      {
        label: "Natural History Museum: Dating the Broken Hill Skull",
        url: "https://www.nhm.ac.uk/discover/news/2020/april/dating-the-broken-hill-skull--homo-heidelbergensis.html",
        year: 2020,
        confidence: "high",
        type: "archival",
        region: "Global",
      },
      {
        label: "Smithsonian Human Origins: Kabwe 1",
        url: "https://humanorigins.si.edu/evidence/human-fossils/fossils/kabwe-1",
        confidence: "high",
        type: "academic",
        region: "Zambia",
      },
    ],
  },
  "twin-rivers": {
    body: `At Twin Rivers Kopje near Lusaka, archaeologists found evidence of red ochre being collected and processed.

400,000 years ago.

This is among the earliest evidence of symbolic thought in human evolutionary history.

Not using a tool to eat. Not building shelter to survive. Collecting pigment for meaning, identity, and expression.

The emergence of symbolic consciousness eventually led to language, religion, art, and music.

That leap may have taken its first steps in Zambia.`,
    cta: "Which of these facts surprised you most? Share your answer.",
    sources: [
      {
        label: "Twin Rivers Kopje stratigraphy and artefacts",
        url: "https://www.researchgate.net/publication/222744127_The_Twin_Rivers_Kopje_Zambia_Stratigraphy_Fauna_and_Artefact_Assemblages_from_the_1954_and_1956_Excavations",
        year: 2000,
        confidence: "medium",
        type: "academic",
        region: "Zambia",
      },
      {
        label: "Prospecting for Meaning (GWU)",
        url: "https://cashp.columbian.gwu.edu/prospecting-meaning-archaeology-symbolism-mineral-exploration-zambia",
        confidence: "medium",
        type: "academic",
        region: "Zambia",
      },
    ],
  },
  "ingombe-ilede": {
    body: `Ing'ombe Ilede.

Between the 14th and 17th centuries, there was a thriving commercial city on the banks of the Zambezi River in what is now Zambia.

Elite burials at Ing'ombe Ilede contained copper cross-ingots, gold, ivory, and exotic glass beads tied to Indian Ocean trade networks.

This was not an isolated village. It was a node in a transcontinental supply chain linking the Zambian interior to the Swahili coast and beyond.

Zambia was not peripheral to global trade.

Zambia was in the center of it.`,
    cta: "Tag someone who needs to know about Ing'ombe Ilede.",
    sources: [
      {
        label: "Fagan, Phillipson & Daniels — Iron Age Cultures in Zambia Vol. 2: Dambwa, Ingombe Ilede and the Tonga (Chatto & Windus, 1969)",
        url: "https://www.cambridge.org/core/journals/journal-of-african-history/article/abs/iron-age-cultures-in-zambia/",
        year: 1969,
        confidence: "high",
        type: "academic",
        region: "Zambia",
      },
      {
        label: "Phillipson — The Early Iron Age in Zambia: Regional Variants and Some Tentative Conclusions (Journal of African History, 1968)",
        url: "https://www.jstor.org/stable/180024",
        year: 1968,
        confidence: "high",
        type: "academic",
        region: "Zambia",
      },
    ],
  },
  kansanshi: {
    body: `Kansanshi Mine in Zambia's Northwestern Province is one of Africa's largest copper mines today.

But by the 12th century, communities in the region were already mining copper, standardizing it, and shaping it into cross-ingots of specific sizes and weights for long-distance trade.

This was monetary innovation. Indigenous, sovereign, self-determined.

Colonial power later reframed copper extraction as a new discovery. The resource did not change.

The power structure did.

Zambia's relationship with copper is not a colonial story that started in the 1900s. It is a 1,200-year story.`,
    cta: "Share this with anyone building in Zambia. Context is infrastructure.",
    sources: [
      {
        label: "Zambia's history of copper production (Part 1)",
        url: "https://miningforzambia.com/zambias-history-of-copper-production-part-1/",
        confidence: "medium",
        type: "media",
        region: "Zambia",
      },
      {
        label: "Copper mining and path dependence in Zambia",
        url: "https://scielo.pt/pdf/cea/n41/1645-3794-cea-41-119.pdf",
        year: 2020,
        confidence: "high",
        type: "academic",
        region: "Zambia",
      },
    ],
  },
  "lusaka-independence": {
    body: `In 1961, Kenneth Kaunda and the United National Independence Party launched a campaign called Cha-cha-cha.

It organized boycotts of colonial stores, mine strikes, roadblocks, and mass civil disobedience across a territory the size of Texas, without smartphones or social media.

Women were central to the movement, including Julia Chikamoneka and Nakatindi Nganga.

The campaign worked. Britain came to the table. On October 24, 1964, Zambia was free.

This was a sophisticated nonviolent strategy with global significance, but it was never centered in the global curriculum.

Until now.`,
    cta: "October 24 is Zambia's Independence Day. Mark it this year.",
    sources: [
      {
        label: "Global Nonviolent Action Database: Zambia independence campaign",
        url: "https://nvdatabase.swarthmore.edu/content/zambians-campaign-independence-1944-1964",
        confidence: "high",
        type: "archival",
        region: "Zambia",
      },
      {
        label: "Women and the liberation struggle in Zambia",
        url: "https://dspace.unza.zm/server/api/core/bitstreams/0be55407-c396-45dc-9058-7ec2c7ebf8ef/content",
        confidence: "high",
        type: "academic",
        region: "Zambia",
      },
    ],
  },
  "katanga-substrate": {
    body: `900 million years ago, the landmass that would become Zambia did not exist as we know it.

Three ancient cratons — Kasai, Tanzania, and Zimbabwe-Kalahari — converged. Hydrothermal fluids circulated through the sediments of the Katanga Supergroup, depositing copper and cobalt.

The Copperbelt ore bodies crystallized. The same fault systems that would one day be mapped for clean hydrogen. The same substrate that would fund colonial extraction and post-independence sovereignty.

Zambia's mineral wealth is not a colonial discovery. It is a geological event that predates complex life on Earth.`,
    cta: "The substrate was always there. Who benefits from it is the question.",
    sources: [
      {
        label: "Mineral Context: Katanga Supergroup and Copperbelt formation",
        url: "https://www.britannica.com/place/Zambia",
        confidence: "high",
        type: "academic",
        region: "Southern Africa",
      },
      {
        label: "BGS World Geology: Precambrian Africa",
        url: "https://www.bgs.ac.uk/",
        confidence: "medium",
        type: "archival",
        region: "Global",
      },
    ],
  },
  "kariba-dam": {
    body: `Between 1955 and 1959, the Federation of Rhodesia and Nyasaland built Kariba Dam across the Zambezi.

57,000 Tonga people were displaced. The Tonga believed Nyami Nyami, the Zambezi River god, would resist — and floods during construction were attributed to his anger.

The dam was built to power the Copperbelt mines. Electricity flowed north to extraction. The displaced did not benefit. Colonial infrastructure served colonial industry.

Kariba remains one of Africa's largest dams. The question of who it was built for — and who paid the cost — is part of the unfinished sovereign story.`,
    cta: "Infrastructure without sovereignty is extraction by another name.",
    sources: [
      {
        label: "History of Zambia: Kariba and colonial development",
        url: "https://www.britannica.com/topic/history-of-Zambia",
        confidence: "medium",
        type: "archival",
        region: "Zambia",
      },
      {
        label: "Nyaminyami — Wikipedia (Tonga River Deity)",
        url: "https://en.wikipedia.org/wiki/Nyaminyami",
        confidence: "medium",
        type: "oral",
        region: "Zambia",
      },
    ],
  },
  "copperbelt-railway": {
    body: `The railways of the Copperbelt were not built to connect communities.

They were built to move copper from mine to port. From Northern Rhodesia to the Indian Ocean. Value flowed outward. The British South Africa Company secured concessions; the rails followed the ore.

Pre-colonial trade routes had run through the same corridors — copper ingots, ivory, gold. The geography did not change. The power structure did.

Today the same rail lines carry mineral exports. The question of who benefits from what moves on them is the question SI 68 of 2025 begins to answer.`,
    cta: "The corridor was always a highway. Who controls the toll is the story.",
    sources: [
      {
        label: "British South Africa Company and Northern Rhodesia railways",
        url: "https://www.britannica.com/topic/history-of-Zambia",
        confidence: "high",
        type: "archival",
        region: "Zambia",
      },
      {
        label: "Copper mining and path dependence in Zambia",
        url: "https://scielo.pt/pdf/cea/n41/1645-3794-cea-41-119.pdf",
        year: 2020,
        confidence: "high",
        type: "academic",
        region: "Zambia",
      },
    ],
  },
};
