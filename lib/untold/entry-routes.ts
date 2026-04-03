export type EntryRoute = "deep-time" | "live-zambia" | "archive";

export interface EntryRouteItem {
  id: EntryRoute;
  label: string;
  description: string;
}

export const ENTRY_ROUTE_ITEMS: EntryRouteItem[] = [
  {
    id: "deep-time",
    label: "Start with Deep Time",
    description: "Begin in geology, early settlement, and the long substrate of Zambia.",
  },
  {
    id: "live-zambia",
    label: "View Live Zambia",
    description: "Open the second lens to inspect present-day signals and observatory layers.",
  },
  {
    id: "archive",
    label: "Enter the Archive",
    description: "See the living archive, approved community memory, and add your own record.",
  },
];

export function isEntryRoute(value: string | null | undefined): value is EntryRoute {
  return value === "deep-time" || value === "live-zambia" || value === "archive";
}
