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

  return {
    governance: "Independent State",
    value: "Mixed/Contested",
    infrastructure: "Rebalancing National",
  };
}
