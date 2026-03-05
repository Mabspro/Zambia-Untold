"use client";

import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { CanvasWrapper } from "@/components/Layout/CanvasWrapper";
import { NarrativePanel } from "@/components/UI/NarrativePanel";
import { TimeButtons } from "@/components/UI/TimeButtons";
import { DataIssueBanner } from "@/components/UI/DataIssueBanner";
import { LayersPanel, type LayerVisibility } from "@/components/UI/LayersPanel";
import { PreloadScreen } from "@/components/UI/PreloadScreen";
import { HistoricalCalendar } from "@/components/UI/HistoricalCalendar";
import { FolkTalesPanel } from "@/components/UI/FolkTalesPanel";
import { ContributionForm } from "@/components/UI/ContributionForm";
import { DeepTimePanel } from "@/components/UI/DeepTimePanel";
import { VillageSearch } from "@/components/UI/VillageSearch";
import { MARKERS } from "@/data/markers";
import { DEEP_TIME_MAX, formatZoneForDisplay, getZoneForYear, type DeepTimeZone } from "@/lib/deepTime";
import { loadMuseumPassport, saveMuseumPassport } from "@/lib/museumPassport";

const Globe = dynamic(() => import("@/components/Globe/Globe").then((m) => m.Globe), {
  ssr: false,
  loading: () => (
    <div
      className="h-full w-full"
      style={{ background: "#030405" }}
      aria-hidden
    />
  ),
});

const DEFAULT_LAYERS: LayerVisibility = {
  boundary: true,
  province: true,
  particles: true,
  zambezi: true,
};

const LOBBY_STORAGE_KEY = "zambia-untold:lobby-seen";
const REENTRY_PROMPT_KEY = "zambia-untold:reentry-prompt-shown";
const TOTAL_GALLERIES = 8;

type LobbyPhase = "preload" | "globe" | "thesis" | "ui" | "pulse" | "done";
type ActivePanel = null | "calendar" | "folkTales" | "contribute" | "deepTime" | "villageSearch";

export default function HomePage() {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [scrubYear, setScrubYear] = useState<number>(DEEP_TIME_MAX);
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>(DEFAULT_LAYERS);
  const [lobbyPhase, setLobbyPhase] = useState<LobbyPhase>("preload");
  const [visitedZones, setVisitedZones] = useState<DeepTimeZone[]>([]);
  const [reentryZone, setReentryZone] = useState<DeepTimeZone | null>(null);
  // Start with contextual card dismissed for a clean landing page.
  // Cards appear when the user actively scrubs time or selects a marker.
  const [contextualCardDismissed, setContextualCardDismissed] = useState(true);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [flyToCoordinate, setFlyToCoordinate] = useState<{ lat: number; lng: number } | null>(null);
  const didBootRef = useRef(false);

  const selectedMarker = useMemo(
    () => MARKERS.find((m) => m.id === selectedMarkerId) ?? null,
    [selectedMarkerId]
  );

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = "/textures/earth-night.jpg";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
    const hasSeenLobby = !!window.sessionStorage.getItem(LOBBY_STORAGE_KEY);
    const passport = loadMuseumPassport();

    if (passport) {
      setScrubYear(passport.lastYear);
      setVisitedZones(passport.visitedZones);
      // Dismiss the Terminal Record contextual card for return visitors
      // so they see a clean globe on refresh
      setContextualCardDismissed(true);
      if (!window.sessionStorage.getItem(REENTRY_PROMPT_KEY)) {
        setReentryZone(passport.lastZone);
        window.sessionStorage.setItem(REENTRY_PROMPT_KEY, "1");
      }
    }

    if (hasSeenLobby || passport) {
      setLobbyPhase("done");
    }
    didBootRef.current = true;
  }, []);

  useEffect(() => {
    if (lobbyPhase !== "preload") return;
    const t = setTimeout(() => setLobbyPhase("globe"), 1500);
    return () => clearTimeout(t);
  }, [lobbyPhase]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (activePanel) {
          setActivePanel(null);
        } else if (selectedMarkerId) {
          setSelectedMarkerId(null);
        } else {
          setContextualCardDismissed(true);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedMarkerId, activePanel]);

  const lobbyTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (lobbyPhase !== "globe") return;

    const t1 = setTimeout(() => setLobbyPhase("thesis"), 1500);
    const t2 = setTimeout(() => setLobbyPhase("ui"), 3500);
    const t3 = setTimeout(() => setLobbyPhase("pulse"), 5500);
    const t4 = setTimeout(() => {
      setLobbyPhase("done");
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(LOBBY_STORAGE_KEY, "1");
      }
    }, 6500);

    lobbyTimersRef.current = [t1, t2, t3, t4];
  }, [lobbyPhase]);

  useEffect(() => {
    return () => {
      for (const id of lobbyTimersRef.current) {
        clearTimeout(id);
      }
    };
  }, []);

  useEffect(() => {
    if (!didBootRef.current) return;

    const zone = getZoneForYear(scrubYear);
    setVisitedZones((prev) => {
      if (prev.includes(zone)) return prev;
      return [...prev, zone];
    });

    const existing = loadMuseumPassport();
    const visitedMarkers = new Set(existing?.visitedMarkers ?? []);
    if (selectedMarkerId) {
      visitedMarkers.add(selectedMarkerId);
    }
    const zones = new Set(existing?.visitedZones ?? []);
    zones.add(zone);

    saveMuseumPassport({
      lastYear: scrubYear,
      lastZone: zone,
      visitedMarkers: [...visitedMarkers],
      visitedZones: [...zones],
      lastVisitedAt: new Date().toISOString(),
    });
  }, [scrubYear, selectedMarkerId]);

  const handleNavigateToCoordinate = (lat: number, lng: number, markerId?: string) => {
    if (markerId) {
      const marker = MARKERS.find((m) => m.id === markerId);
      if (marker) {
        setSelectedMarkerId(marker.id);
        setScrubYear(marker.epoch);
        setContextualCardDismissed(false);
        setActivePanel(null);
        return;
      }
    }
    // Fly to arbitrary coordinate (Village Search)
    setFlyToCoordinate({ lat, lng });
    // Reset after a tick so the same coordinate can be re-selected
    setTimeout(() => setFlyToCoordinate(null), 100);
    setActivePanel(null);
  };

  const isDone = lobbyPhase === "done";
  const showUI = lobbyPhase === "ui" || isDone;

  return (
    <main className="relative isolate h-screen w-screen overflow-hidden" style={{ backgroundColor: "#030405" }}>
      {lobbyPhase === "preload" && <PreloadScreen />}

      {/* Globe: full viewport, always centered.
          Use instant opacity for return visits (isDone on mount) to prevent
          the warm bg-bg from compositing through the canvas during a CSS
          transition. First-time visitors still get the smooth fade-in. */}
      <CanvasWrapper
        className={
          lobbyPhase === "preload"
            ? "opacity-0"
            : isDone
              ? "opacity-100"
              : "opacity-100 transition-opacity duration-700"
        }
      >
        <Globe
          selectedMarker={selectedMarker}
          scrubYear={scrubYear}
          onMarkerSelect={(marker) => {
            setSelectedMarkerId(marker.id);
            setScrubYear(marker.epoch);
            setContextualCardDismissed(false);
            setActivePanel(null);
          }}
          layerVisibility={layerVisibility}
          showHUD={showUI}
          flyToCoordinate={flyToCoordinate}
        />
      </CanvasWrapper>

      {/* Thesis line — fades in at 3s */}
      {(lobbyPhase === "thesis" || lobbyPhase === "ui" || lobbyPhase === "pulse") && (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-center transition-opacity duration-500"
          style={{
            opacity: lobbyPhase === "thesis" ? 1 : 0,
          }}
        >
          <p
            className="font-display text-lg tracking-[0.24em] text-copper transition-opacity duration-1000 md:text-xl"
            style={{
              textShadow: "0 0 24px rgba(0,0,0,0.9), 0 0 48px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            <em>Before there were nations, there was a substrate.</em>
          </p>
        </div>
      )}

      {/* Copper pulse */}
      {lobbyPhase === "pulse" && (
        <div
          className="pointer-events-none absolute inset-0 z-10 animate-[lobby-pulse_1s_ease-out_forwards]"
          style={{
            background: "radial-gradient(circle at center, rgba(184,115,51,0.25) 0%, transparent 60%)",
          }}
        />
      )}

      {/* Header: Title + Time Navigation */}
      <header
        className={`absolute left-0 right-0 top-3 z-20 flex flex-col items-center gap-2 px-3 transition-opacity duration-700 md:left-7 md:right-auto md:top-6 md:items-start md:px-0 ${
          showUI ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="pointer-events-none w-full max-w-[92vw] rounded border border-copper/25 bg-bg/70 px-4 py-2.5 text-center backdrop-blur-sm md:w-auto md:max-w-none md:px-4 md:py-3 md:text-left">
          <p className="font-display text-xl tracking-[0.2em] text-copper md:text-2xl lg:text-3xl">
            ZAMBIA UNTOLD
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted md:mt-1.5 md:text-xs lg:text-sm">
            The history you were never taught
          </p>
          <p className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-copperSoft/90 md:mt-2 md:text-[11px]">
            Galleries Visited: {visitedZones.length}/{TOTAL_GALLERIES}
          </p>
        </div>
        <TimeButtons
          year={scrubYear}
          onYearChange={(year) => {
            setScrubYear(year);
            setSelectedMarkerId(null);
            setContextualCardDismissed(false);
          }}
        />
      </header>

      {/* Skip intro button */}
      {lobbyPhase !== "done" && lobbyPhase !== "preload" && (
        <button
          type="button"
          onClick={() => setLobbyPhase("done")}
          className="absolute right-4 top-4 z-30 rounded border border-copper/35 bg-bg/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-copperSoft backdrop-blur hover:border-copper md:right-7 md:top-6"
        >
          Skip Intro
        </button>
      )}

      {/* Re-entry prompt */}
      {reentryZone && isDone && (
        <aside className="absolute left-1/2 top-4 z-30 w-[min(92vw,520px)] -translate-x-1/2 rounded border border-copper/35 bg-bg/90 px-4 py-3 text-center backdrop-blur md:top-6">
          <p className="font-display text-[12px] tracking-[0.18em] text-copperSoft">
            You left during {formatZoneForDisplay(reentryZone)}
          </p>
          <button
            type="button"
            onClick={() => setReentryZone(null)}
            className="mt-2 rounded border border-copper/30 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-muted hover:text-text"
          >
            Dismiss
          </button>
        </aside>
      )}

      {/* ══════════════════════════════════════════════════════
          ACTION BAR — Calendar, Folk Tales, Contribute buttons
          Positioned bottom-center, always visible when UI is active
          ══════════════════════════════════════════════════════ */}
      {showUI && (
        <nav
          className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2 flex items-center gap-1.5 rounded-lg border border-copper/30 bg-bg/85 px-4 py-2.5 backdrop-blur-md shadow-glow md:bottom-7"
        >
          {/* Breathing indicator — implies a living system */}
          <div className="mr-1 h-1.5 w-1.5 rounded-full bg-copper/60 animate-[breathing_3s_ease-in-out_infinite]" />

          {/* Deep Time */}
          <div className="group relative">
            <button
              type="button"
              onClick={() => setActivePanel(activePanel === "deepTime" ? null : "deepTime")}
              className={`flex items-center gap-1 rounded px-2 py-1.5 text-[10px] uppercase tracking-[0.12em] transition-all duration-200 md:gap-1.5 md:px-3 md:py-2 md:text-[11px] md:tracking-[0.14em] ${
                activePanel === "deepTime"
                  ? "bg-copper/20 text-copper border border-copper/40 shadow-[0_0_8px_rgba(184,115,51,0.2)]"
                  : "text-copperSoft hover:text-copper hover:bg-copper/8 border border-transparent hover:border-copper/25 hover:shadow-[0_0_6px_rgba(184,115,51,0.15)]"
              }`}
            >
              <span className="text-sm">🪨</span>
              <span className="hidden sm:inline">Deep Time</span>
            </button>
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-panel/95 border border-copper/20 px-2 py-0.5 text-[9px] text-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Geological epochs
            </span>
          </div>

          <div className="h-4 w-px bg-copper/15 md:h-5" />

          {/* Calendar */}
          <div className="group relative">
            <button
              type="button"
              onClick={() => setActivePanel(activePanel === "calendar" ? null : "calendar")}
              className={`flex items-center gap-1 rounded px-2 py-1.5 text-[10px] uppercase tracking-[0.12em] transition-all duration-200 md:gap-1.5 md:px-3 md:py-2 md:text-[11px] md:tracking-[0.14em] ${
                activePanel === "calendar"
                  ? "bg-copper/20 text-copper border border-copper/40 shadow-[0_0_8px_rgba(184,115,51,0.2)]"
                  : "text-copperSoft hover:text-copper hover:bg-copper/8 border border-transparent hover:border-copper/25 hover:shadow-[0_0_6px_rgba(184,115,51,0.15)]"
              }`}
            >
              <span className="text-sm">📅</span>
              <span className="hidden sm:inline">Calendar</span>
            </button>
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-panel/95 border border-copper/20 px-2 py-0.5 text-[9px] text-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Historical sequence
            </span>
          </div>

          {/* Inganji */}
          <div className="group relative">
            <button
              type="button"
              onClick={() => setActivePanel(activePanel === "folkTales" ? null : "folkTales")}
              className={`flex items-center gap-1 rounded px-2 py-1.5 text-[10px] uppercase tracking-[0.12em] transition-all duration-200 md:gap-1.5 md:px-3 md:py-2 md:text-[11px] md:tracking-[0.14em] ${
                activePanel === "folkTales"
                  ? "bg-copper/20 text-copper border border-copper/40 shadow-[0_0_8px_rgba(184,115,51,0.2)]"
                  : "text-copperSoft hover:text-copper hover:bg-copper/8 border border-transparent hover:border-copper/25 hover:shadow-[0_0_6px_rgba(184,115,51,0.15)]"
              }`}
            >
              <span className="text-sm">🔥</span>
              <span className="hidden sm:inline">Inganji</span>
            </button>
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-panel/95 border border-copper/20 px-2 py-0.5 text-[9px] text-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Folk tales &amp; oral tradition
            </span>
          </div>

          {/* Village Search */}
          <div className="group relative">
            <button
              type="button"
              onClick={() => setActivePanel(activePanel === "villageSearch" ? null : "villageSearch")}
              className={`flex items-center gap-1 rounded px-2 py-1.5 text-[10px] uppercase tracking-[0.12em] transition-all duration-200 md:gap-1.5 md:px-3 md:py-2 md:text-[11px] md:tracking-[0.14em] ${
                activePanel === "villageSearch"
                  ? "bg-copper/20 text-copper border border-copper/40 shadow-[0_0_8px_rgba(184,115,51,0.2)]"
                  : "text-copperSoft hover:text-copper hover:bg-copper/8 border border-transparent hover:border-copper/25 hover:shadow-[0_0_6px_rgba(184,115,51,0.15)]"
              }`}
            >
              <span className="text-sm">📍</span>
              <span className="hidden sm:inline">Search</span>
            </button>
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-panel/95 border border-copper/20 px-2 py-0.5 text-[9px] text-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Find your village
            </span>
          </div>

          {/* Isibalo */}
          <div className="group relative">
            <button
              type="button"
              onClick={() => setActivePanel(activePanel === "contribute" ? null : "contribute")}
              className={`flex items-center gap-1 rounded px-2 py-1.5 text-[10px] uppercase tracking-[0.12em] transition-all duration-200 md:gap-1.5 md:px-3 md:py-2 md:text-[11px] md:tracking-[0.14em] ${
                activePanel === "contribute"
                  ? "bg-copper/20 text-copper border border-copper/40 shadow-[0_0_8px_rgba(184,115,51,0.2)]"
                  : "text-copperSoft hover:text-copper hover:bg-copper/8 border border-transparent hover:border-copper/25 hover:shadow-[0_0_6px_rgba(184,115,51,0.15)]"
              }`}
            >
              <span className="text-sm">✦</span>
              <span className="hidden sm:inline">Isibalo</span>
            </button>
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-panel/95 border border-copper/20 px-2 py-0.5 text-[9px] text-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Community archive
            </span>
          </div>

          {/* Breathing indicator — right side */}
          <div className="ml-1 h-1.5 w-1.5 rounded-full bg-copper/60 animate-[breathing_3s_ease-in-out_infinite_1.5s]" />
        </nav>
      )}

      {/* Layers Panel */}
      <div
        className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-700 ${
          showUI ? "opacity-100" : "opacity-0"
        }`}
      >
        <LayersPanel
          visibility={layerVisibility}
          onVisibilityChange={setLayerVisibility}
          visitedZones={visitedZones}
        />
      </div>

      {showUI && <DataIssueBanner />}

      {/* Narrative Panel (right side) */}
      {showUI && (
        <NarrativePanel
          marker={selectedMarker}
          scrubYear={scrubYear}
          contextualCardDismissed={contextualCardDismissed}
          onClose={() => setSelectedMarkerId(null)}
          onDismissContextualCard={() => setContextualCardDismissed(true)}
        />
      )}

      {/* ══════════════════════════════════════════════════════
          OVERLAY PANELS — Calendar, Folk Tales, Contribution Form
          ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activePanel === "deepTime" && (
          <DeepTimePanel
            key="deepTime"
            scrubYear={scrubYear}
            onClose={() => setActivePanel(null)}
            onNavigateToCoordinate={handleNavigateToCoordinate}
          />
        )}
        {activePanel === "calendar" && (
          <HistoricalCalendar
            key="calendar"
            onClose={() => setActivePanel(null)}
            onNavigateToCoordinate={handleNavigateToCoordinate}
          />
        )}
        {activePanel === "folkTales" && (
          <FolkTalesPanel
            key="folkTales"
            onClose={() => setActivePanel(null)}
            onNavigateToCoordinate={handleNavigateToCoordinate}
          />
        )}
        {activePanel === "villageSearch" && (
          <VillageSearch
            key="villageSearch"
            onNavigate={(lat, lng) => handleNavigateToCoordinate(lat, lng)}
            onClose={() => setActivePanel(null)}
          />
        )}
        {activePanel === "contribute" && (
          <ContributionForm
            key="contribute"
            onClose={() => setActivePanel(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
