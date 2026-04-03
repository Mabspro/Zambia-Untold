import Link from "next/link";

type DiscoverHeroProps = {
  totalPlaces: number;
  featuredPlaces: number;
};

export function DiscoverHero({ totalPlaces, featuredPlaces }: DiscoverHeroProps) {
  return (
    <header className="rounded border border-copper/25 bg-[#0b0907]/84 px-5 py-5 backdrop-blur-md md:px-7 md:py-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-copperSoft/80">
            Discover Zambia
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-[0.16em] text-copper md:text-5xl">
            Places With Depth
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#d8c9b4] md:text-[17px]">
            Curated places across Zambia: sacred landscapes, wetlands, caves, ceremonies, falls,
            trade sites, and parks that carry more than scenery. This route is about encounter, not
            itinerary.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="min-h-11 rounded border border-copper/30 px-4 py-2 text-[12px] uppercase tracking-[0.14em] text-copperSoft transition-colors hover:border-copper hover:text-copper"
          >
            Return to Museum
          </Link>
          <Link
            href="/archive"
            className="min-h-11 rounded border border-copper/20 px-4 py-2 text-[12px] uppercase tracking-[0.14em] text-copperSoft transition-colors hover:border-copper/35 hover:text-copper"
          >
            Open Archive
          </Link>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded border border-copper/18 bg-black/20 px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-copper/75">Curated Places</p>
          <p className="mt-2 font-display text-3xl text-[#f0dfc3]">{totalPlaces}</p>
          <p className="mt-1 text-[12px] leading-6 text-muted">
            Selected for ecological, cultural, historical, or geological weight.
          </p>
        </div>
        <div className="rounded border border-copper/18 bg-black/20 px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-copper/75">Featured Places</p>
          <p className="mt-2 font-display text-3xl text-[#f0dfc3]">{featuredPlaces}</p>
          <p className="mt-1 text-[12px] leading-6 text-muted">
            A first-cut path for visitors who want the strongest starting set.
          </p>
        </div>
        <div className="rounded border border-copper/18 bg-black/20 px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-copper/75">Route Discipline</p>
          <p className="mt-2 text-[14px] leading-7 text-[#d8c9b4]">
            Browse the place first. Fly to the globe second. The editorial layer stays separate from
            booking and partner logic.
          </p>
        </div>
      </div>
    </header>
  );
}
