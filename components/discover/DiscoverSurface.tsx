"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  DISCOVER_CATEGORY_LABELS,
  DISCOVER_PLACES,
  type DiscoverCategory,
  type DiscoverPlace,
} from "@/data/discoverPlaces";
import { DiscoverFilters } from "@/components/discover/DiscoverFilters";
import { DiscoverHero } from "@/components/discover/DiscoverHero";
import { DiscoverPlaceGrid } from "@/components/discover/DiscoverPlaceGrid";

function getSelectedPlace(places: DiscoverPlace[], selectedId: string | null): DiscoverPlace | null {
  if (!places.length) return null;
  return places.find((place) => place.id === selectedId) ?? places[0] ?? null;
}

export function DiscoverSurface() {
  const [province, setProvince] = useState("all");
  const [category, setCategory] = useState<DiscoverCategory | "all">("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(DISCOVER_PLACES[0]?.id ?? null);

  const provinceOptions = useMemo(
    () => Array.from(new Set(DISCOVER_PLACES.map((place) => place.province))).sort((a, b) => a.localeCompare(b)),
    []
  );

  const filteredPlaces = useMemo(() => {
    return DISCOVER_PLACES.filter((place) => {
      if (province !== "all" && place.province !== province) return false;
      if (category !== "all" && !place.categories.includes(category)) return false;
      if (featuredOnly && !place.featured) return false;
      return true;
    });
  }, [category, featuredOnly, province]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflowY = html.style.overflowY;
    const prevBodyOverflowY = body.style.overflowY;
    const prevHtmlHeight = html.style.height;
    const prevBodyHeight = body.style.height;

    html.style.overflowY = "auto";
    body.style.overflowY = "auto";
    html.style.height = "auto";
    body.style.height = "auto";
    html.classList.add("route-scroll-mode");
    body.classList.add("route-scroll-mode");

    return () => {
      html.style.overflowY = prevHtmlOverflowY;
      body.style.overflowY = prevBodyOverflowY;
      html.style.height = prevHtmlHeight;
      body.style.height = prevBodyHeight;
      html.classList.remove("route-scroll-mode");
      body.classList.remove("route-scroll-mode");
    };
  }, []);

  useEffect(() => {
    if (!filteredPlaces.length) {
      setSelectedId(null);
      return;
    }

    if (!filteredPlaces.some((place) => place.id === selectedId)) {
      setSelectedId(filteredPlaces[0]?.id ?? null);
    }
  }, [filteredPlaces, selectedId]);

  const selectedPlace = getSelectedPlace(filteredPlaces, selectedId);

  return (
    <main className="route-scroll-surface relative isolate min-h-screen bg-[#050608] text-[#eadbc4]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(184,115,51,0.12),_transparent_38%),linear-gradient(180deg,_rgba(6,7,9,0.92),_rgba(3,4,6,0.98))]" />
      <div className="relative mx-auto max-w-7xl px-4 py-5 md:px-8 md:py-10">
        <div className="flex flex-col gap-5 md:gap-8">
          <DiscoverHero
            totalPlaces={DISCOVER_PLACES.length}
            featuredPlaces={DISCOVER_PLACES.filter((place) => place.featured).length}
          />

          <DiscoverFilters
            provinceOptions={provinceOptions}
            province={province}
            category={category}
            featuredOnly={featuredOnly}
            onProvinceChange={setProvince}
            onCategoryChange={setCategory}
            onFeaturedOnlyChange={setFeaturedOnly}
          />

          <section className="rounded border border-copper/22 bg-[#0b0907]/76 px-4 py-4 backdrop-blur-sm md:px-7 md:py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-display text-[12px] uppercase tracking-[0.22em] text-copperSoft">
                  Curated Places
                </p>
                <p className="mt-2 max-w-2xl text-[14px] leading-7 text-muted md:text-[15px]">
                  These places are selected because they illuminate something larger about Zambia:
                  memory, ceremony, ecology, geology, trade, or inherited design language.
                </p>
              </div>
              <div className="hidden rounded border border-copper/14 bg-black/15 px-4 py-3 md:block">
                <p className="text-[11px] uppercase tracking-[0.16em] text-copperSoft">Visible places</p>
                <p className="mt-2 font-display text-3xl text-[#f0dfc3]">{filteredPlaces.length}</p>
              </div>
            </div>

            {filteredPlaces.length === 0 ? (
              <div className="mt-6 rounded border border-copper/18 bg-black/15 px-4 py-6">
                <p className="font-display text-[18px] text-[#f0dfc3]">No curated places match this view yet.</p>
                <p className="mt-2 text-[14px] leading-7 text-muted">
                  Try widening the province or category filters.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-5 md:mt-6">
                  <DiscoverPlaceGrid
                    places={filteredPlaces}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                  />
                </div>

                {selectedPlace ? (
                  <div className="mt-5 rounded border border-copper/20 bg-black/15 px-4 py-4 md:mt-8 md:px-5 md:py-5">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-3xl">
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-copperSoft/80">
                          Selected Place
                        </p>
                        <h2 className="mt-2 font-display text-3xl text-copper md:text-4xl">
                          {selectedPlace.name}
                        </h2>
                        {selectedPlace.altName ? (
                          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-copperSoft">
                            {selectedPlace.altName}
                          </p>
                        ) : null}
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded border border-copper/18 bg-copper/6 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-copperSoft">
                            {selectedPlace.province}
                          </span>
                          {selectedPlace.categories.map((item) => (
                            <span
                              key={item}
                              className="rounded border border-copper/18 bg-copper/6 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-copperSoft"
                            >
                              {DISCOVER_CATEGORY_LABELS[item]}
                            </span>
                          ))}
                        </div>
                        <p className="mt-4 text-[15px] leading-8 text-[#eadbc4]">
                          {selectedPlace.contextNote}
                        </p>
                        <p className="mt-4 text-[14px] leading-7 text-muted">
                          {selectedPlace.whyItMatters}
                        </p>
                        {selectedPlace.sourceNote ? (
                          <p className="mt-4 text-[12px] leading-6 text-muted/80">
                            {selectedPlace.sourceNote}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex w-full max-w-[340px] flex-col gap-3">
                        <Link
                          href={`/?fly=${selectedPlace.coordinates.lat},${selectedPlace.coordinates.lng}`}
                          className="min-h-11 rounded border border-copper/35 bg-copper/10 px-4 py-2 text-center text-[12px] uppercase tracking-[0.16em] text-copper transition-colors hover:border-copper hover:bg-copper/15"
                        >
                          Open in Globe
                        </Link>
                        {selectedPlace.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="min-h-11 rounded border border-copper/20 px-4 py-2 text-center text-[12px] uppercase tracking-[0.16em] text-copperSoft transition-colors hover:border-copper/35 hover:text-copper"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
