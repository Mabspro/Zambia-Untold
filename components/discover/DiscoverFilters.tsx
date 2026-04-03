"use client";

import { DISCOVER_CATEGORY_LABELS, type DiscoverCategory } from "@/data/discoverPlaces";

type DiscoverFiltersProps = {
  provinceOptions: string[];
  province: string;
  category: DiscoverCategory | "all";
  featuredOnly: boolean;
  onProvinceChange: (value: string) => void;
  onCategoryChange: (value: DiscoverCategory | "all") => void;
  onFeaturedOnlyChange: (value: boolean) => void;
};

export function DiscoverFilters({
  provinceOptions,
  province,
  category,
  featuredOnly,
  onProvinceChange,
  onCategoryChange,
  onFeaturedOnlyChange,
}: DiscoverFiltersProps) {
  const categories = Object.entries(DISCOVER_CATEGORY_LABELS) as Array<[DiscoverCategory, string]>;

  return (
    <section className="rounded border border-copper/22 bg-[#0b0907]/76 px-4 py-4 backdrop-blur-sm md:px-7 md:py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-[12px] uppercase tracking-[0.22em] text-copperSoft">
            Filter the Country
          </p>
          <p className="mt-2 max-w-2xl text-[14px] leading-7 text-muted md:text-[15px]">
            Move through provinces and categories without flattening the places into a single tourism list.
          </p>
        </div>
        <label className="inline-flex items-center gap-3 self-start rounded border border-copper/20 px-3 py-2 md:px-4">
          <input
            type="checkbox"
            checked={featuredOnly}
            onChange={(event) => onFeaturedOnlyChange(event.target.checked)}
            className="h-4 w-4 rounded border-copper/45 bg-black/20 text-copper"
          />
          <span className="text-[11px] uppercase tracking-[0.16em] text-copperSoft">Featured only</span>
        </label>
      </div>

      <div className="mt-5 grid gap-3 md:mt-6 md:grid-cols-[minmax(0,260px)_1fr]">
        <label className="block">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-copperSoft">
            Province
          </span>
          <select
            value={province}
            onChange={(event) => onProvinceChange(event.target.value)}
            className="min-h-11 w-full rounded border border-copper/20 bg-black/20 px-3 text-[14px] text-text focus:border-copper/45 focus:outline-none"
          >
            <option value="all">All provinces</option>
            {provinceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div>
          <span className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-copperSoft">
            Category
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onCategoryChange("all")}
              className={`min-h-10 rounded border px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-colors ${
                category === "all"
                  ? "border-copper/45 bg-copper/12 text-copper"
                  : "border-copper/20 text-copperSoft hover:border-copper/35"
              }`}
            >
              All
            </button>
            {categories.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => onCategoryChange(value)}
                className={`min-h-10 rounded border px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-colors ${
                  category === value
                    ? "border-copper/45 bg-copper/12 text-copper"
                    : "border-copper/20 text-copperSoft hover:border-copper/35"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
