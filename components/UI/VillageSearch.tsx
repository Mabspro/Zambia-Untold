"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type SearchResult = {
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  type: string;
};

type VillageSearchProps = {
  onNavigate: (lat: number, lng: number) => void;
  onClose: () => void;
};

async function searchZambia(query: string): Promise<SearchResult[]> {
  if (!query.trim() || query.length < 2) return [];

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )},Zambia&format=json&limit=8&addressdetails=1&countrycodes=zm`,
      {
        headers: {
          "User-Agent": "ZambiaUntold/1.0 (https://github.com/Mabspro/Zambia-Untold)",
        },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((r: any) => ({
      name: r.name || r.display_name.split(",")[0],
      displayName: r.display_name,
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
      type: r.type || "place",
    }));
  } catch {
    return [];
  }
}

function ResultItem({
  result,
  onSelect,
}: {
  result: SearchResult;
  onSelect: () => void;
}) {
  // Extract province from display name
  const parts = result.displayName.split(",").map((s: string) => s.trim());
  const province = parts.length > 2 ? parts[parts.length - 2] : "";

  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full text-left rounded border border-copper/15 bg-bg/40 px-3 py-2.5 hover:border-copper/35 hover:bg-copper/5 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-display text-[13px] text-text group-hover:text-copper transition-colors truncate">
            {result.name}
          </p>
          {province && (
            <p className="text-[10px] text-muted mt-0.5 truncate">
              {province}
            </p>
          )}
        </div>
        <div className="shrink-0 mt-0.5">
          <span className="text-[9px] uppercase tracking-[0.1em] text-copperSoft/60 group-hover:text-copperSoft transition-colors">
            View →
          </span>
        </div>
      </div>
      <p className="font-mono text-[9px] text-muted/50 mt-1">
        {result.lat.toFixed(4)}°, {result.lng.toFixed(4)}°
      </p>
    </button>
  );
}

export function VillageSearch({ onNavigate, onClose }: VillageSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<SearchResult | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    const res = await searchZambia(q);
    setResults(res);
    setSearched(true);
    setLoading(false);
  }, []);

  const handleInput = (value: string) => {
    setQuery(value);
    setSelectedPlace(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 400);
  };

  const handleSelect = (result: SearchResult) => {
    setSelectedPlace(result);
    onNavigate(result.lat, result.lng);
  };

  // Zambia-specific place suggestions
  const suggestions = [
    "Lusaka",
    "Livingstone",
    "Kabwe",
    "Kasama",
    "Solwezi",
    "Mongu",
    "Chipata",
    "Mansa",
    "Mpika",
    "Siavonga",
    "Mumbwa",
    "Samfya",
  ];

  return (
    <motion.aside
      initial={{ opacity: 0, y: "5%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "5%", transition: { duration: 0.25 } }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4 md:p-8"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.97 }}
        animate={{ scale: 1 }}
        className="relative z-10 w-full max-w-[480px] max-h-[85vh] overflow-hidden rounded-t-xl border border-copper/30 bg-panel/98 backdrop-blur-xl flex flex-col sm:rounded sm:max-h-[80vh]"
      >
        {/* Header */}
        <div className="shrink-0 border-b border-copper/20 px-5 pt-5 pb-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-copperSoft">
                Isibalo · See Your Village
              </p>
              <h2 className="font-display text-lg text-text mt-1">
                Find Your Place on the Globe
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-copper/40 px-2 py-1 text-xs uppercase tracking-[0.16em] text-text hover:border-copper transition-colors"
            >
              Close
            </button>
          </div>
          <p className="text-[11px] text-muted leading-relaxed">
            Search for any town, village, river, or landmark in Zambia.
            The globe will fly to your location.
          </p>
        </div>

        {/* Search input */}
        <div className="shrink-0 px-5 py-3 border-b border-copper/10">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleInput(e.target.value)}
              placeholder="e.g., Kasama, Bangweulu, Mfuwe"
              className="w-full rounded border border-copper/25 bg-bg/60 pl-3 pr-10 py-2.5 text-[14px] text-text placeholder:text-muted/50 focus:border-copper/50 focus:outline-none transition-colors"
            />
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-copper/30 border-t-copper" />
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2 village-scroll">
          <AnimatePresence mode="popLayout">
            {/* Selected place confirmation */}
            {selectedPlace && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded border border-copper/35 bg-copper/8 px-4 py-3 mb-3"
              >
                <p className="text-[9px] uppercase tracking-[0.2em] text-copper mb-1">
                  📍 Flying to
                </p>
                <p className="font-display text-[15px] text-text">
                  {selectedPlace.name}
                </p>
                <p className="font-mono text-[9px] text-muted mt-1">
                  {selectedPlace.lat.toFixed(4)}°S, {selectedPlace.lng.toFixed(4)}°E
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded border border-copper/40 px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-copper hover:bg-copper/10 transition-colors"
                  >
                    View on Globe
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPlace(null)}
                    className="rounded border border-copper/20 px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-muted hover:text-copperSoft transition-colors"
                  >
                    Search Again
                  </button>
                </div>
              </motion.div>
            )}

            {/* Search results */}
            {!selectedPlace && results.length > 0 && (
              <>
                <p className="text-[9px] uppercase tracking-[0.18em] text-copperSoft mb-1">
                  {results.length} places found
                </p>
                {results.map((r, i) => (
                  <motion.div
                    key={`${r.lat}-${r.lng}-${i}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <ResultItem
                      result={r}
                      onSelect={() => handleSelect(r)}
                    />
                  </motion.div>
                ))}
              </>
            )}

            {/* No results */}
            {!selectedPlace && searched && results.length === 0 && !loading && (
              <div className="py-6 text-center">
                <p className="text-[13px] text-muted">
                  No places found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-[11px] text-muted/70 mt-1">
                  Try a different spelling or a nearby town.
                </p>
              </div>
            )}

            {/* Suggestions (when no search yet) */}
            {!selectedPlace && !searched && (
              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] text-copperSoft mb-3">
                  Try searching for
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setQuery(s);
                        doSearch(s);
                      }}
                      className="rounded border border-copper/20 bg-bg/40 px-2.5 py-1.5 text-[11px] text-text/80 hover:border-copper/40 hover:text-copper transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="mt-5 rounded border border-copper/15 bg-copper/5 px-3 py-2.5">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-copperSoft mb-1">
                    ✦ Why This Matters
                  </p>
                  <p className="text-[11px] text-[#C9B89A] leading-relaxed italic">
                    Every place in Zambia sits on 900 million years of geological
                    history. Your village is not just a dot on a map — it&apos;s a
                    coordinate in deep time, where tectonic forces deposited copper,
                    where kingdoms rose, and where your family&apos;s story continues.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-copper/15 px-5 py-2.5 flex items-center justify-between">
          <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted/60">
            Powered by OpenStreetMap
          </p>
          <p className="font-mono text-[8px] text-copper/50">
            Zambia Untold
          </p>
        </div>
      </motion.div>
    </motion.aside>
  );
}
