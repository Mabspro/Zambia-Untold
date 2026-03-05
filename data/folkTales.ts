/**
 * Inganji — Folk Tales & Mythology of Zambia
 * =============================================
 * Bemba/Nyanja: Inganji — legend, story passed down.
 *
 * These are not arguments. They are transmissions.
 * They carry meaning in a form that bypasses intellectual resistance
 * and lands in identity and emotion.
 */

import type { DeepTimeZone } from "@/lib/deepTime";

export type FolkTaleTier = "flagship" | "regional" | "urban";
export type FolkTaleFormat = "illustrated_cards" | "globe_animation" | "text_ambient";

export type FolkTale = {
  id: string;
  title: string;
  tradition: string;
  subtitle: string;
  coordinates: { lat: number; lng: number };
  epoch: number;
  epochZone: DeepTimeZone;
  tier: FolkTaleTier;
  format: FolkTaleFormat;
  body: string;
  /** The moral or transmission of the story */
  transmission: string;
  /** Related marker on the globe */
  relatedMarkerId?: string;
  /** Cultural review status */
  culturallyReviewed: boolean;
  /** Source */
  source: "editorial" | "community";
};

export const FOLK_TALES: FolkTale[] = [
  // ═══════════════════════════════════════════════════════════════
  // TIER 1 — FLAGSHIP
  // ═══════════════════════════════════════════════════════════════
  {
    id: "nyami-nyami",
    title: "Nyami Nyami — The Zambezi River God",
    tradition: "Tonga",
    subtitle: "The serpent who guards the Zambezi. The spirit the dam could not drown.",
    coordinates: { lat: -16.52, lng: 28.76 },
    epoch: 1955,
    epochZone: "COLONIAL WOUND",
    tier: "flagship",
    format: "globe_animation",
    body: `The Tonga people of the Zambezi Valley have known Nyami Nyami since before memory was written.

He is described as a serpent with the body of a snake and the head of a fish — enormous, ancient, dwelling in the deepest pools of the Zambezi River. He is not a demon. He is not a god in the Western sense. He is a guardian — the spirit of the river itself.

When the colonial Federation decided to build Kariba Dam in 1955, the Tonga elders warned that Nyami Nyami would not allow it. The engineers laughed.

In 1957, unprecedented floods destroyed the coffer dam and killed several workers. In 1958, even worse floods struck — the worst in recorded history. The Tonga said: "Nyami Nyami is angry. You have separated him from his wife, who lives downstream."

The dam was completed in 1959. 57,000 Tonga were forcibly relocated from their ancestral lands along the Zambezi. Many were moved to arid land far from the river that had sustained them for generations.

The Tonga still say Nyami Nyami is waiting. The dam wall has developed cracks over the decades. Engineers monitor them constantly. The Tonga know what the engineers are monitoring.

Today, Nyami Nyami is carved into walking sticks, pendants, and sculptures across Zambia. He is not folklore in the past tense. He is a living presence — the river's memory of what was done to it, and to the people who lived beside it.`,
    transmission: "The river remembers what was done. So do its people.",
    relatedMarkerId: "kariba-dam",
    culturallyReviewed: true,
    source: "editorial",
  },
  {
    id: "kuomboka",
    title: "Kuomboka — The Journey Out of Water",
    tradition: "Lozi",
    subtitle: "When the Zambezi floods, the king moves. He has done this for 300 years.",
    coordinates: { lat: -15.3, lng: 23.1 },
    epoch: 1700,
    epochZone: "KINGDOM AGE",
    tier: "flagship",
    format: "globe_animation",
    body: `Every year when the Zambezi floods the Barotse floodplain, the Litunga — the King of the Lozi — boards the Nalikwanda, the royal barge, and moves from his floodplain capital at Lealui to the dry-season capital at Limulunga.

This is Kuomboka. In Lozi, it means "to get out of the water."

The Nalikwanda is a massive barge, painted with black and white stripes, topped by a life-sized elephant figure. Dozens of paddlers in traditional dress row in perfect synchronization, their oars striking the water to the rhythm of the royal drums — the maoma — which can be heard for kilometres across the floodplain.

Thousands gather on the banks to watch. The journey takes hours. It is not just a relocation — it is a statement: the king reads the river, he moves with the water, not against it. The Lozi did not fight the flood. They choreographed their civilization around it.

The ceremony has been performed for over 300 years — predating most European monarchic ceremonies still practiced today. UNESCO has recognized it as Intangible Cultural Heritage of Humanity.

What makes Kuomboka extraordinary is not its antiquity alone. It is that the Lozi engineered a dual-capital system — two seats of government calibrated to the seasonal pulse of the Zambezi. This is not primitive. This is sophisticated climate adaptation, practiced centuries before the term existed.`,
    transmission: "A civilization that moves with the water, not against it, survives.",
    culturallyReviewed: true,
    source: "editorial",
  },
  {
    id: "chitimukulu",
    title: "Chitimukulu — The Great Tree That Fell",
    tradition: "Bemba",
    subtitle: "The origin story of the Bemba people. A migration from the Congo. A kingdom born from exile.",
    coordinates: { lat: -10.2, lng: 30.9 },
    epoch: 1700,
    epochZone: "KINGDOM AGE",
    tier: "flagship",
    format: "illustrated_cards",
    body: `The Bemba people — the largest ethnic group in Zambia — trace their origin to the Luba Kingdom in the Congo.

According to the oral tradition, the founders of the Bemba were princes of the Luba court — the sons of Mukulumpe and a woman named Mumbi Mukasa Liulu. They quarrelled with the Luba king and were forced to flee. Led by Chitimukulu ("the great tree"), they migrated south across the Luapula River into the land that is now northern Zambia.

The name Chitimukulu itself carries weight. "Chiti" means tree. "Mukulu" means great. The great tree. A leader so significant that his title — not his name — became the permanent title of every Bemba paramount chief that followed.

Along the migration route, the Bemba fought, negotiated, and absorbed other groups. They established a kingdom in the Chambeshi River valley, with Chitimukulu as paramount and a system of subordinate chiefs governing provinces. The Bemba system of governance was hierarchical, military, and adaptive.

The migration route from the Congo to Kasama is remembered in song, ceremony, and place names. The Ukusefya pa Ng'wena ceremony commemorates this journey every year — "coming out of the crocodile." The crocodile being the Luapula River they crossed.

This is not distant history. The current Chitimukulu still holds authority. The Bemba migration is lived, not just remembered.`,
    transmission: "A people exiled become a kingdom. The tree that falls plants a forest.",
    culturallyReviewed: true,
    source: "editorial",
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 2 — REGIONAL DEPTH
  // ═══════════════════════════════════════════════════════════════
  {
    id: "makishi",
    title: "Makishi — The Masked Ancestors Return",
    tradition: "Luvale / Northwestern",
    subtitle: "When boys become men, the ancestors dance. The masks are not costumes — they are presences.",
    coordinates: { lat: -13.5, lng: 23.0 },
    epoch: 1600,
    epochZone: "KINGDOM AGE",
    tier: "regional",
    format: "illustrated_cards",
    body: `Among the Luvale, Chokwe, Lunda, and Mbunda peoples of Northwestern Province, the Makishi masquerade is sacred.

The Makishi appear at the climax of the mukanda — the male initiation ceremony where boys are taken into seclusion in the bush, circumcised, and taught the knowledge they need to become men. When they emerge, the Makishi dance.

Each mask represents a specific spirit: Chizaluke (the wise elder), Kayipu (the clown), Mupala (the chief's spirit), Pwo (the ideal woman — danced by men). The masks are carved from wood, painted, and decorated with bark cloth, beads, and natural fibers.

The dancer is not performing. In the Luvale understanding, the dancer becomes the spirit. The mask is not a costume. It is a threshold.

UNESCO recognized the Makishi masquerade as an Intangible Cultural Heritage of Humanity in 2005. But the tradition far predates any international recognition. It belongs to the communities who created it, who dance it, who pass it on.

The Likumbi Lya Mize festival — "Day of the Makishi" — is held annually in Zambezi district. Thousands attend. The masks emerge from the bush at dawn. The drums have not stopped since the night before.`,
    transmission: "The ancestors are not gone. They return when they are needed.",
    culturallyReviewed: true,
    source: "editorial",
  },
  {
    id: "gule-wamkulu",
    title: "Gule Wamkulu — The Great Dance",
    tradition: "Chewa / Eastern",
    subtitle: "The secret society that dances death and rebirth. Masks that speak for the ancestors.",
    coordinates: { lat: -13.6, lng: 31.5 },
    epoch: 1600,
    epochZone: "KINGDOM AGE",
    tier: "regional",
    format: "illustrated_cards",
    body: `Gule Wamkulu — "the great dance" — is the secret society and masquerade tradition of the Chewa people of Eastern Province and neighbouring Malawi.

The dancers, called Nyau, wear elaborate costumes and masks representing spirits of the dead, wild animals, and moral archetypes. They appear at funerals, initiations, and installations of chiefs. Their dances are not entertainment. They are the voice of the ancestors speaking to the living.

The Nyau society is secret. Membership requires initiation. Women and uninitiated men are told that the dancers are spirits, not men — and in the Chewa worldview, this is not a lie. During the dance, the dancer is the spirit. The mask transforms.

The characters include Kasiya maliro (the spirit who stays after death), Chimkoko (the wild beast), and Maria (a colonial-era figure mocking European women). Through these characters, the Chewa process death, enforce social norms, mock power, and transmit wisdom.

UNESCO recognized Gule Wamkulu as a Masterpiece of the Oral and Intangible Heritage of Humanity in 2005. But the tradition is ancient — predating colonial contact by centuries.`,
    transmission: "The dead are not silent. They dance, and the living must listen.",
    culturallyReviewed: true,
    source: "editorial",
  },
  {
    id: "lamba-copper-spirits",
    title: "The Copper Spirits of the Lamba",
    tradition: "Lamba / Copperbelt",
    subtitle: "Before the mines, the Lamba knew the copper was alive. It had a spirit. It demanded respect.",
    coordinates: { lat: -12.9, lng: 28.6 },
    epoch: 1100,
    epochZone: "COPPER EMPIRE",
    tier: "regional",
    format: "text_ambient",
    body: `The Lamba people of the Copperbelt have a relationship with copper that predates colonialism by centuries.

In Lamba oral tradition, copper is not merely a mineral. It is inhabited. The deposits have spirits — the imipashi ya mukuba — that must be respected before mining. Before extracting copper, the Lamba performed rituals to seek permission from the earth spirits. Offerings were made. Songs were sung. The earth was asked, not taken.

This is not superstition. It is an ecological ethic embedded in spiritual language. The Lamba understood that extraction without reciprocity leads to depletion. That the ground gives, but it must also receive.

When the British South Africa Company arrived and began industrial mining in the 1920s, the Lamba watched their sacred relationship with the earth be replaced by machines, dynamite, and the logic of extraction. The spirits were not consulted. The earth was not asked.

The Lamba believe that the troubles of the Copperbelt — the environmental degradation, the pollution of rivers, the boom-and-bust cycles — are not merely economic. They are spiritual consequences of taking without asking.

Today, some Lamba communities still perform copper rituals. In a world now debating "ethical mining" and "corporate social responsibility," the Lamba were there first — millennia first.`,
    transmission: "The earth gives. But it must also receive. Take without asking, and you will learn why.",
    relatedMarkerId: "kansanshi",
    culturallyReviewed: true,
    source: "editorial",
  },
  {
    id: "tonga-rain-shrines",
    title: "The Rain Shrines of the Tonga",
    tradition: "Tonga / Southern",
    subtitle: "Before dams and irrigation, the Tonga spoke to the rain. The shrines still stand.",
    coordinates: { lat: -16.0, lng: 28.5 },
    epoch: 1400,
    epochZone: "KINGDOM AGE",
    tier: "regional",
    format: "text_ambient",
    body: `The Tonga people of the Gwembe Valley and surrounding areas maintained a network of rain shrines — sacred sites where communities gathered to pray for rain, give thanks for harvests, and maintain the relationship between humans and the weather.

The rain shrines were not temples. They were trees, rock formations, pools — natural features imbued with spiritual significance over generations. Each shrine had a custodian, often a woman, who maintained the site and led the rituals.

The rituals involved beer brewing, dancing, and the calling of the rain spirits. The process could take days. It was communal — the entire village participated. The rain was not commanded. It was invited.

When the Kariba Dam displaced 57,000 Tonga in the late 1950s, many rain shrines were submerged beneath Lake Kariba. The custodians were relocated to dry land far from their sacred sites. The relationship between the Tonga and their rain shrines was severed — not by drought, but by colonial infrastructure.

Some shrines survived above the waterline. Some custodians maintained their rituals in exile. Today, the Tonga rain shrine tradition exists in fragments — a living example of how colonial "development" destroyed not just landscapes, but cosmologies.`,
    transmission: "You cannot dam a river and expect the rain to forgive you.",
    culturallyReviewed: true,
    source: "editorial",
  },
  {
    id: "leza-supreme",
    title: "Leza — The One Who Does Not Deceive",
    tradition: "Bemba / Pan-Zambian",
    subtitle: "Long before Christianity arrived, Zambia already had a supreme being. His name was Leza.",
    coordinates: { lat: -11.0, lng: 29.0 },
    epoch: 1000,
    epochZone: "COPPER EMPIRE",
    tier: "regional",
    format: "text_ambient",
    body: `Across multiple Zambian ethnic groups — Bemba, Tonga, Ila, Kaonde, and others — the concept of a supreme creator deity existed long before the arrival of Christian missionaries.

His most common name is Leza (sometimes Lesa). Among the Bemba, Leza is "the one who does not deceive" — the creator of all things, the source of life and death, the bringer of rain and drought.

Leza is not a tribal god. He is understood across ethnic boundaries — a remarkable theological convergence among peoples who developed largely independently. The Ila called him "the besetting one" — the one who cannot be escaped.

A famous Ila parable tells of an old woman, bereaved by death after death in her family, who tried to climb to heaven to confront Leza and ask why he allowed such suffering. She stacked pots on top of each other to reach the sky. The pile collapsed. She never reached Leza. But she never stopped asking the question.

This is not primitive religion. This is theodicy — the philosophical problem of suffering — embedded in a folk tale that predates European philosophy's engagement with the same question by centuries.

When missionaries arrived in the 19th century, they were surprised to find that Zambian peoples already had a concept of a supreme being. They often used the name "Leza" as the translation for the Christian God — implicitly acknowledging what the Zambian peoples had always known.`,
    transmission: "Zambia did not need missionaries to find God. Leza was already here.",
    culturallyReviewed: true,
    source: "editorial",
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 3 — URBAN & LIVING
  // ═══════════════════════════════════════════════════════════════
  {
    id: "chakwela-makumbi",
    title: "Chakwela Makumbi — Climbing into the Clouds",
    tradition: "Soli / Lenje / Lusaka",
    subtitle: "The ceremony of the original people of Lusaka. Before the city, there was the rain dance.",
    coordinates: { lat: -15.2, lng: 28.5 },
    epoch: 1800,
    epochZone: "KINGDOM AGE",
    tier: "urban",
    format: "text_ambient",
    body: `Before Lusaka was a city, it was Soli and Lenje country. The original inhabitants of the Lusaka area practiced Chakwela Makumbi — "climbing into the clouds" — a rain-calling ceremony held at sacred hilltop sites.

The ceremony involved community gatherings, traditional beer, dancing, and prayers directed to the ancestral spirits who controlled the rains. The hilltops around what is now Lusaka were sacred — not real estate.

As Lusaka grew from a railway siding into a colonial capital and then a modern city, the Soli and Lenje were gradually marginalized. Their sacred sites were built over. Their ceremonies became harder to perform. The hills that once hosted Chakwela Makumbi now host cell towers and apartment blocks.

But the ceremony survives. Each year, Soli and Lenje communities gather to perform Chakwela Makumbi — now often at the edges of the city that consumed their land. It is simultaneously one of the most ancient and most modern things in Zambia: an indigenous rain ceremony performed within earshot of a capital city's traffic.`,
    transmission: "The city forgot the people who were here first. The rain remembers.",
    culturallyReviewed: true,
    source: "editorial",
  },
];

/**
 * Get folk tales for a specific tradition/ethnic group.
 */
export function getFolkTalesByTradition(tradition: string): FolkTale[] {
  return FOLK_TALES.filter((t) =>
    t.tradition.toLowerCase().includes(tradition.toLowerCase())
  );
}

/**
 * Get folk tales by tier.
 */
export function getFolkTalesByTier(tier: FolkTaleTier): FolkTale[] {
  return FOLK_TALES.filter((t) => t.tier === tier);
}

/**
 * Get all folk tale traditions (for filter UI).
 */
export function getAllTraditions(): string[] {
  const set = new Set(FOLK_TALES.map((t) => t.tradition));
  return [...set].sort();
}
