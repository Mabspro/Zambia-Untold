export type SovereigntyState = {
  governance: string;
  value: string;
  infrastructure: string;
};

export function stateFromYear(year: number): SovereigntyState {
  if (year < 1000) {
    return {
      governance: "Indigenous Systems",
      value: "Internal Networks",
      infrastructure: "Settlement & Survival",
    };
  }

  if (year < 1600) {
    return {
      governance: "Kingdom Trade Polities",
      value: "Regional Exchange",
      infrastructure: "Community + Trade",
    };
  }

  if (year < 1890) {
    return {
      governance: "Regional Kingdoms",
      value: "Mixed Internal/External",
      infrastructure: "Community-Led Corridors",
    };
  }

  if (year < 1964) {
    return {
      governance: "Colonial Rule",
      value: "External Extraction",
      infrastructure: "Extraction Corridors",
    };
  }

  // Kaunda one-party state (1972–1991 UNIP rule)
  if (year < 1991) {
    return {
      governance: "Independent / One-Party State",
      value: "Nationalized / Contested",
      infrastructure: "State-Led Development",
    };
  }

  // Multi-party democracy era (Chiluba → Lungu)
  if (year < 2021) {
    return {
      governance: "Multi-Party Democracy",
      value: "Market / Partial Rebalancing",
      infrastructure: "Mixed Public-Private",
    };
  }

  // Hichilema era — SI 68 local content legislation
  return {
    governance: "Independent State",
    value: "Mixed / SI 68 Era",
    infrastructure: "Rebalancing Sovereign",
  };
}
