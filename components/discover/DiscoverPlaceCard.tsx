"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DISCOVER_CATEGORY_LABELS, type DiscoverPlace } from "@/data/discoverPlaces";

type DiscoverPlaceCardProps = {
  place: DiscoverPlace;
  selected: boolean;
  onSelect: () => void;
};

function FlyLink({ place }: { place: DiscoverPlace }) {
  return (
    <Link
      href={`/?fly=${place.coordinates.lat},${place.coordinates.lng}`}
      className="min-h-10 rounded border border-copper/35 bg-copper/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-copper transition-colors hover:border-copper hover:bg-copper/15"
    >
      Fly to Globe
    </Link>
  );
}

export function DiscoverPlaceCard({ place, selected, onSelect }: DiscoverPlaceCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <article
      className={`overflow-hidden rounded border bg-black/15 transition-colors ${
        selected ? "border-copper/40" : "border-copper/18 hover:border-copper/28"
      }`}
    >
      <button type="button" onClick={onSelect} className="block w-full text-left">
        <div className="relative h-56 w-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(184,115,51,0.18),_transparent_48%),linear-gradient(180deg,_#15110d,_#090806)]">
          {place.heroImage && !imageError ? (
            <Image
              src={place.heroImage}
              alt={place.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full items-end justify-between bg-[linear-gradient(135deg,rgba(184,115,51,0.16),transparent_58%),radial-gradient(circle_at_20%_24%,rgba(184,115,51,0.24),transparent_22%)] p-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copperSoft/85">
                  Zambia Untold
                </p>
                <p className="mt-2 font-display text-2xl leading-8 text-copper">
                  {place.altName ?? place.name}
                </p>
              </div>
              <div className="grid h-14 w-14 grid-cols-3 gap-1 opacity-70">
                {Array.from({ length: 9 }).map((_, index) => (
                  <span key={index} className="rounded-full bg-copper/40" />
                ))}
              </div>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-12">
            <p className="font-display text-[1.55rem] leading-8 text-[#f0dfc3]">
              {place.name}
            </p>
            {place.altName ? (
              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-copperSoft">
                {place.altName}
              </p>
            ) : null}
          </div>
        </div>
      </button>

      <div className="px-4 py-4">
        <div className="flex flex-wrap gap-2">
          <span className="rounded border border-copper/18 bg-copper/6 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-copperSoft">
            {place.province}
          </span>
          {place.categories.map((category) => (
            <span
              key={category}
              className="rounded border border-copper/18 bg-copper/6 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-copperSoft"
            >
              {DISCOVER_CATEGORY_LABELS[category]}
            </span>
          ))}
        </div>

        <p className="mt-3 text-[14px] leading-7 text-[#d8c9b4]">{place.shortDescription}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <FlyLink place={place} />
          <button
            type="button"
            onClick={onSelect}
            className="min-h-10 rounded border border-copper/20 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-copperSoft transition-colors hover:border-copper/35 hover:text-copper"
          >
            Read Context
          </button>
        </div>
      </div>
    </article>
  );
}
