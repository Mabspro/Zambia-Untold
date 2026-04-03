import type { DiscoverPlace } from "@/data/discoverPlaces";
import { DiscoverPlaceCard } from "@/components/discover/DiscoverPlaceCard";

type DiscoverPlaceGridProps = {
  places: DiscoverPlace[];
  selectedId: string | null;
  onSelect: (placeId: string) => void;
};

export function DiscoverPlaceGrid({ places, selectedId, onSelect }: DiscoverPlaceGridProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {places.map((place) => (
        <DiscoverPlaceCard
          key={place.id}
          place={place}
          selected={selectedId === place.id}
          onSelect={() => onSelect(place.id)}
        />
      ))}
    </div>
  );
}
