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
  imageAlt: string;
  shortDescription: string;
  contextNote: string;
  whyItMatters: string;
  sourceNote?: string | null;
  links: DiscoverPlaceLink[];
  featured: boolean;
}

function commonsFileUrl(fileName: string): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
}

function commonsFilePageUrl(fileName: string): string {
  return `https://commons.wikimedia.org/wiki/File:${fileName.replace(/ /g, "_")}`;
}

export const DISCOVER_PLACES: DiscoverPlace[] = [
  {
    id: "victoria-falls",
    slug: "victoria-falls",
    name: "Victoria Falls",
    altName: "Mosi-oa-Tunya",
    province: "Southern",
    categories: ["nature", "geological", "cultural"],
    coordinates: { lat: -17.92, lng: 25.86 },
    heroImage: commonsFileUrl("Victoria Falls, Zambia.jpg"),
    thumbnailImage: commonsFileUrl("Victoria Falls, Zambia.jpg"),
    imageAlt: "Victoria Falls seen from the Zambian side.",
    shortDescription: "The Smoke That Thunders is both a geological event and a sacred landscape.",
    contextNote:
      "Known globally as Victoria Falls but long named Mosi-oa-Tunya by the peoples who lived beside it, this is one of the clearest places where natural wonder and historical naming collide.",
    whyItMatters:
      "It is one of Zambia's most globally visible places, but it belongs here because it carries older names, deeper memory, and a geological story far older than empire.",
    sourceNote: "Wikimedia Commons image from the Zambian side.",
    links: [
      { label: "Image source", href: commonsFilePageUrl("Victoria Falls, Zambia.jpg"), kind: "reference" },
    ],
    featured: true,
  },
  {
    id: "south-luangwa",
    slug: "south-luangwa",
    name: "South Luangwa National Park",
    province: "Eastern",
    categories: ["nature"],
    coordinates: { lat: -13.1, lng: 31.55 },
    heroImage: commonsFileUrl("Leopard (South Luangwa National Park).jpg"),
    thumbnailImage: commonsFileUrl("Leopard (South Luangwa National Park).jpg"),
    imageAlt: "A leopard in South Luangwa National Park.",
    shortDescription:
      "A valley shaped by deep geological time and known today for leopard density, elephants, and river life.",
    contextNote:
      "South Luangwa is not only one of Africa's major wildlife systems; it is also the place where the walking safari became part of conservation history.",
    whyItMatters:
      "It turns Zambia's landscape into something legible at human scale: river, wildlife, geology, and a distinctly Zambian contribution to safari culture.",
    sourceNote: "Wikimedia Commons wildlife image from South Luangwa National Park.",
    links: [
      {
        label: "Image source",
        href: commonsFilePageUrl("Leopard (South Luangwa National Park).jpg"),
        kind: "reference",
      },
    ],
    featured: true,
  },
  {
    id: "kundalila-falls",
    slug: "kundalila-falls",
    name: "Kundalila Falls",
    province: "Central",
    categories: ["nature", "geological"],
    coordinates: { lat: -12.85, lng: 29.67 },
    heroImage: commonsFileUrl("Kundalila Falls, serenje Zambia 04.jpg"),
    thumbnailImage: commonsFileUrl("Kundalila Falls, serenje Zambia 04.jpg"),
    imageAlt: "Kundalila Falls near Serenje, Zambia.",
    shortDescription:
      "A 75-metre fall near Serenje whose Lala name, 'crying dove,' gives the place its emotional register.",
    contextNote:
      "Kundalila carries beauty, altitude, and local meaning at once. It feels exactly like the kind of place a national platform should restore to visibility.",
    whyItMatters:
      "It expands the story beyond the obvious icons and shows that Zambia's national memory also lives in places the standard travel circuit barely names.",
    sourceNote: "Wikimedia Commons image from Kundalila Falls.",
    links: [
      {
        label: "Image source",
        href: commonsFilePageUrl("Kundalila Falls, serenje Zambia 04.jpg"),
        kind: "reference",
      },
    ],
    featured: true,
  },
  {
    id: "bangweulu-wetlands",
    slug: "bangweulu-wetlands",
    name: "Bangweulu Wetlands",
    province: "Northern",
    categories: ["nature", "cultural"],
    coordinates: { lat: -11.5, lng: 29.5 },
    heroImage: commonsFileUrl("Bangweulu Swamps.jpg"),
    thumbnailImage: commonsFileUrl("Bangweulu Swamps.jpg"),
    imageAlt: "A wide view over the Bangweulu Wetlands in Zambia.",
    shortDescription: "'Where the water meets the sky' is less a slogan than an accurate description of the landscape.",
    contextNote:
      "Bangweulu is ecological scale made intimate: birds, floodplain, fishing, memory, and the long continuity of life around water.",
    whyItMatters:
      "It belongs in Zambia Untold because it is both a living ecological system and a place where the country's human and natural histories refuse to separate cleanly.",
    sourceNote: "Wikimedia Commons landscape photograph of the Bangweulu Swamps.",
    links: [
      { label: "Image source", href: commonsFilePageUrl("Bangweulu Swamps.jpg"), kind: "reference" },
    ],
    featured: true,
  },
  {
    id: "mwela-rock-paintings",
    slug: "mwela-rock-paintings",
    name: "Mwela Rock Paintings",
    province: "Northern",
    categories: ["heritage", "cultural"],
    coordinates: { lat: -10.23, lng: 31.13 },
    heroImage: commonsFileUrl("NsaluCave.jpg"),
    thumbnailImage: commonsFileUrl("NsaluCave.jpg"),
    imageAlt: "Representative Zambian cave-art imagery used for Mwela Rock Paintings.",
    shortDescription:
      "Ancient BaTwa rock art near Kasama, where circles, grids, and figures become a record of perception itself.",
    contextNote:
      "Mwela is central to the platform's visual language. It should feel less like a side-note and more like one of the roots of how Zambia sees and remembers.",
    whyItMatters:
      "It is one of the most important heritage sites for the project's own design grammar and for any honest account of artistic memory in Zambia.",
    sourceNote:
      "Representative Wikimedia Commons cave-art image from Zambia used while a direct Mwela file is still being confirmed.",
    links: [
      { label: "Image source", href: commonsFilePageUrl("NsaluCave.jpg"), kind: "reference" },
    ],
    featured: true,
  },
  {
    id: "nachikufu-cave",
    slug: "nachikufu-cave",
    name: "Nachikufu Cave",
    province: "Muchinga",
    categories: ["heritage", "cultural"],
    coordinates: { lat: -12.18, lng: 31.08 },
    heroImage: commonsFileUrl("NsaluCave.jpg"),
    thumbnailImage: commonsFileUrl("NsaluCave.jpg"),
    imageAlt: "Representative Zambian cave-art imagery used for Nachikufu Cave.",
    shortDescription:
      "A national monument near Mpika where BaTwa artistic memory reaches back over millennia.",
    contextNote:
      "Nachikufu sits inside Zambia's long continuity of cave art and deep human presence, even if the public image archive around it is still thin.",
    whyItMatters:
      "It belongs because the Discover route should carry places of historical depth, not only the sites that already circulate in tourism imagery.",
    sourceNote:
      "Representative Wikimedia Commons cave-art image from Zambia used while a direct Nachikufu file is still being confirmed.",
    links: [
      { label: "Image source", href: commonsFilePageUrl("NsaluCave.jpg"), kind: "reference" },
    ],
    featured: false,
  },
  {
    id: "kalambo-falls",
    slug: "kalambo-falls",
    name: "Kalambo Falls",
    province: "Northern",
    categories: ["geological", "heritage", "nature"],
    coordinates: { lat: -8.6, lng: 31.2 },
    heroImage: commonsFileUrl("Kalambo falls.jpg"),
    thumbnailImage: commonsFileUrl("Kalambo falls.jpg"),
    imageAlt: "Kalambo Falls in northern Zambia.",
    shortDescription:
      "A waterfall at the edge of the border and one of the most important human-engineering discoveries on Earth.",
    contextNote:
      "Kalambo matters not just for height or scenery, but because the 476,000-year-old wooden structure found there changed the timeline of intelligence and craft.",
    whyItMatters:
      "This is one of the few places where a visitor can stand near a global scientific rewrite and understand that Zambia sits inside the story of human ingenuity itself.",
    sourceNote: "Wikimedia Commons photograph of Kalambo Falls.",
    links: [
      { label: "Image source", href: commonsFilePageUrl("Kalambo falls.jpg"), kind: "reference" },
    ],
    featured: true,
  },
  {
    id: "kasanka-national-park",
    slug: "kasanka-national-park",
    name: "Kasanka National Park",
    province: "Central",
    categories: ["nature"],
    coordinates: { lat: -12.55, lng: 29.22 },
    heroImage: commonsFileUrl("Kasanka National Park Bat feast-2.jpg"),
    thumbnailImage: commonsFileUrl("Kasanka National Park Bat feast-2.jpg"),
    imageAlt: "Fruit bats gathering over Kasanka National Park.",
    shortDescription:
      "A small park with a planetary-scale event: millions of fruit bats crossing the sky in one season.",
    contextNote:
      "Kasanka is one of the cleanest examples of why Discover Zambia should include the under-taught. The world's largest mammal migration is here, not elsewhere.",
    whyItMatters:
      "It transforms Zambia from an abstract map into a place of living ecological singularity.",
    sourceNote: "Wikimedia Commons image from the Kasanka bat migration set.",
    links: [
      {
        label: "Image source",
        href: commonsFilePageUrl("Kasanka National Park Bat feast-2.jpg"),
        kind: "reference",
      },
    ],
    featured: true,
  },
  {
    id: "ingombe-ilede",
    slug: "ingombe-ilede",
    name: "Ing'ombe Ilede",
    province: "Southern",
    categories: ["heritage", "cultural"],
    coordinates: { lat: -16.6, lng: 27.7 },
    heroImage: commonsFileUrl("Ingombe.jpg"),
    thumbnailImage: commonsFileUrl("Ingombe.jpg"),
    imageAlt: "Illustration of the Ing'ombe Ilede trading post in Southern Zambia.",
    shortDescription:
      "A Zambezi trade site where copper, ivory, beads, and global exchange met centuries before colonial rule.",
    contextNote:
      "Ing'ombe Ilede should feel like a correction to the old idea that Zambia was outside the world's major trade systems.",
    whyItMatters:
      "It repositions Zambia as a historical connector rather than a peripheral recipient of history.",
    sourceNote: "Wikimedia Commons historical image of Ingombe Ilede.",
    links: [
      { label: "Image source", href: commonsFilePageUrl("Ingombe.jpg"), kind: "reference" },
    ],
    featured: false,
  },
  {
    id: "lealui-limulunga",
    slug: "lealui-limulunga",
    name: "Lealui / Limulunga Floodplain Route",
    province: "Western",
    categories: ["cultural", "nature"],
    coordinates: { lat: -15.3, lng: 23.1 },
    heroImage: commonsFileUrl("Kuomboka ceremony in Zambia 04.jpg"),
    thumbnailImage: commonsFileUrl("Kuomboka ceremony in Zambia 04.jpg"),
    imageAlt: "Kuomboka ceremony on the Barotse floodplain in Zambia.",
    shortDescription:
      "The Lozi floodplain route where a kingdom moves with the water rather than against it.",
    contextNote:
      "Kuomboka is one of the clearest examples of place, ceremony, hydrology, and governance woven together into one public event.",
    whyItMatters:
      "It makes clear that landscape in Zambia is not background; it shapes political form, ceremonial rhythm, and collective identity.",
    sourceNote: "Wikimedia Commons image from the Kuomboka ceremony in Western Province.",
    links: [
      {
        label: "Image source",
        href: commonsFilePageUrl("Kuomboka ceremony in Zambia 04.jpg"),
        kind: "reference",
      },
    ],
    featured: true,
  },
  {
    id: "mwansabombwe-mutomboko",
    slug: "mwansabombwe-mutomboko",
    name: "Mwansabombwe / Mutomboko",
    province: "Luapula",
    categories: ["cultural"],
    coordinates: { lat: -12.0, lng: 28.97 },
    heroImage: commonsFileUrl("Mutomboko.jpg"),
    thumbnailImage: commonsFileUrl("Mutomboko.jpg"),
    imageAlt: "People celebrating the Mutomboko festival in Luapula, Zambia.",
    shortDescription:
      "The Lunda victory dance made visible: not folklore as artifact, but history in motion.",
    contextNote:
      "Mutomboko belongs here because Discover Zambia should show ceremony as living public memory, not just archived heritage.",
    whyItMatters:
      "It gives the route a human rhythm: movement, cloth, gathering, and political memory still carried in public ritual.",
    sourceNote: "Wikimedia Commons image from the Mutomboko festival in Luapula.",
    links: [
      { label: "Image source", href: commonsFilePageUrl("Mutomboko.jpg"), kind: "reference" },
    ],
    featured: false,
  },
  {
    id: "nsalu-cave",
    slug: "nsalu-cave",
    name: "Nsalu Cave",
    province: "Central",
    categories: ["heritage", "cultural"],
    coordinates: { lat: -12.84, lng: 30.23 },
    heroImage: commonsFileUrl("NsaluCave.jpg"),
    thumbnailImage: commonsFileUrl("NsaluCave.jpg"),
    imageAlt: "A visitor viewing cave art in Nsalu Cave, Zambia.",
    shortDescription:
      "A rainmaking and rock-art site near Serenje, where abstraction carries ceremonial memory.",
    contextNote:
      "Nsalu's white schematic paintings widen the visual language beyond scenic photography and into symbol, ritual, and cultural practice.",
    whyItMatters:
      "It reinforces that Discover Zambia is about places with depth, not only places with spectacle.",
    sourceNote: "Wikimedia Commons image of cave art at Nsalu Cave.",
    links: [
      { label: "Image source", href: commonsFilePageUrl("NsaluCave.jpg"), kind: "reference" },
    ],
    featured: false,
  },
  {
    id: "lower-zambezi-national-park",
    slug: "lower-zambezi-national-park",
    name: "Lower Zambezi National Park",
    province: "Lusaka",
    categories: ["nature"],
    coordinates: { lat: -15.5, lng: 29.2 },
    heroImage: commonsFileUrl("Elephants crossing the Lower Zambezi.jpg"),
    thumbnailImage: commonsFileUrl("Elephants crossing the Lower Zambezi.jpg"),
    imageAlt: "Elephants crossing the Lower Zambezi in Zambia.",
    shortDescription:
      "A floodplain wilderness where the Zambezi defines the southern boundary and elephant corridors follow the water.",
    contextNote:
      "Lower Zambezi belongs in this route because it shows Zambia as river country: wildlife, escarpment, floodplain, and border all organized by one moving system.",
    whyItMatters:
      "It gives the Discover layer another place where ecology and national imagination meet without flattening the country into one famous landmark.",
    sourceNote: "Wikimedia Commons image of elephants crossing the Lower Zambezi.",
    links: [
      {
        label: "Image source",
        href: commonsFilePageUrl("Elephants crossing the Lower Zambezi.jpg"),
        kind: "reference",
      },
    ],
    featured: true,
  },
  {
    id: "kafue-flats",
    slug: "kafue-flats",
    name: "Kafue Flats",
    province: "Southern",
    categories: ["nature", "cultural"],
    coordinates: { lat: -15.8, lng: 27.0 },
    heroImage: commonsFileUrl("Kafue Flats, Zambia (MODIS 2021-04-05).jpg"),
    thumbnailImage: commonsFileUrl("Kafue Flats, Zambia (MODIS 2021-04-05).jpg"),
    imageAlt: "Satellite view of the Kafue Flats in Zambia.",
    shortDescription:
      "One of Africa's largest floodplains, shaped by the Kafue River's seasonal pulse and the lives of fishing communities who read its rhythms.",
    contextNote:
      "The Kafue Flats are best understood as a living pattern rather than a point on a map: water spread, grazing ground, fisheries, migration, and the knowledge required to stay in step with them.",
    whyItMatters:
      "It expands Discover Zambia beyond scenic overlooks and into a place where hydrology, livelihood, and collective timing are inseparable.",
    sourceNote: "Wikimedia Commons MODIS image showing the scale of the Kafue Flats floodplain.",
    links: [
      {
        label: "Image source",
        href: commonsFilePageUrl("Kafue Flats, Zambia (MODIS 2021-04-05).jpg"),
        kind: "reference",
      },
    ],
    featured: true,
  },
  {
    id: "shiwa-ngandu",
    slug: "shiwa-ngandu",
    name: "Shiwa Ng'andu",
    province: "Muchinga",
    categories: ["heritage", "cultural"],
    coordinates: { lat: -11.2, lng: 31.73 },
    heroImage: commonsFileUrl("HouseatShiwaNgandu.jpg"),
    thumbnailImage: commonsFileUrl("HouseatShiwaNgandu.jpg"),
    imageAlt: "The main house on the Shiwa Ng'andu estate in Zambia.",
    shortDescription:
      "An English manor house built in the Zambian bush in the 1920s, a strange colonial artifact now part of the country's texture.",
    contextNote:
      "Shiwa Ng'andu is not here because it is simple to admire. It is here because Zambia also contains inherited forms that do not fit cleanly, and understanding the country means facing them directly.",
    whyItMatters:
      "It gives the route an honest colonial layer: not a monument of pride, but a place whose persistence says something about how history settles into landscape.",
    sourceNote: "Wikimedia Commons image of the main house on the Shiwa Ng'andu estate.",
    links: [
      {
        label: "Image source",
        href: commonsFilePageUrl("HouseatShiwaNgandu.jpg"),
        kind: "reference",
      },
    ],
    featured: false,
  },
];

export const DISCOVER_CATEGORY_LABELS: Record<DiscoverCategory, string> = {
  nature: "Nature",
  heritage: "Heritage",
  cultural: "Cultural",
  geological: "Geological",
};
