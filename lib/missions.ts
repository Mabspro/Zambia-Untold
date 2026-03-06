export type MissionStep = {
  id: string;
  instruction: string;
  completionEvent: MissionEventName;
};

export type Mission = {
  id: string;
  title: string;
  description: string;
  badge: string;
  badgeLabel: string;
  steps: MissionStep[];
  unlockMessage: string;
};

import type { MissionEventName } from "@/lib/missionEvents";

export const MISSIONS: Mission[] = [
  {
    id: "substrate",
    title: "MISSION 01: THE SUBSTRATE",
    description: "Explore Zambia's geological origins.",
    badge: "⬡",
    badgeLabel: "GEOLOGICAL SURVEYOR",
    steps: [
      {
        id: "visit-kalambo",
        instruction: "Open the Kalambo Falls marker.",
        completionEvent: "marker:kalambo-falls:opened",
      },
      {
        id: "visit-kabwe",
        instruction: "Open the Kabwe marker.",
        completionEvent: "marker:kabwe-skull:opened",
      },
      {
        id: "xray-active",
        instruction: "Scrub to before 10,000 BC to activate\nthe geological substrate view.",
        completionEvent: "shader:xray:activated",
      },
    ],
    unlockMessage: "You have read the substrate.\n476,000 years before the first nation.",
  },
  {
    id: "copper-path",
    title: "MISSION 02: THE COPPER PATH",
    description: "Follow the trade routes that built an empire.",
    badge: "◈",
    badgeLabel: "TRADE NAVIGATOR",
    steps: [
      {
        id: "visit-kansanshi",
        instruction: "Open the Kansanshi copper marker.",
        completionEvent: "marker:kansanshi:opened",
      },
      {
        id: "visit-ingombe",
        instruction: "Open the Ing'ombe Ilede marker.",
        completionEvent: "marker:ingombe-ilede:opened",
      },
      {
        id: "copper-epoch",
        instruction: "Scrub through the Copper Empire epoch\n(1000-1600 CE).",
        completionEvent: "epoch:copper-empire:visited",
      },
    ],
    unlockMessage: "A 1,200-year monetary system.\nBuilt here before anyone was looking.",
  },
  {
    id: "sovereign-signal",
    title: "MISSION 03: THE SOVEREIGN SIGNAL",
    description: "Trace Zambia's reach from liberation to orbit.",
    badge: "◎",
    badgeLabel: "COSMIC CITIZEN",
    steps: [
      {
        id: "visit-lusaka",
        instruction: "Open the Lusaka independence marker.",
        completionEvent: "marker:lusaka-independence:opened",
      },
      {
        id: "activate-satellites",
        instruction: "Toggle the Live Satellites layer.",
        completionEvent: "layer:satellites:activated",
      },
      {
        id: "visit-nkoloso",
        instruction: "Find the Nkoloso Space Academy marker.",
        completionEvent: "marker:nkoloso:opened",
      },
    ],
    unlockMessage:
      "In 1964, a Zambian aimed for Mars.\nThe satellites above you are\neveryone else who got funded.",
  },
  {
    id: "living-archive",
    title: "MISSION 04: THE LIVING ARCHIVE",
    description: "Add your knowledge to the sovereign record.",
    badge: "⊕",
    badgeLabel: "KEEPER OF RECORD",
    steps: [
      {
        id: "read-community",
        instruction: "Toggle the Community Archive layer.",
        completionEvent: "layer:community:activated",
      },
      {
        id: "open-contribution",
        instruction: "Open a community memory.",
        completionEvent: "community:memory:opened",
      },
      {
        id: "submit-memory",
        instruction: "Submit a memory to the archive.\n(Or endorse an existing one.)",
        completionEvent: "community:memory:submitted",
      },
    ],
    unlockMessage: "The record grows.\nEvery memory added is\nsovereignty defended.",
  },
];
