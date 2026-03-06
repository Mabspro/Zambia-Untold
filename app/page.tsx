"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
import { SovereigntyStack } from "@/components/UI/SovereigntyStack";
import { StoryCompass } from "@/components/UI/StoryCompass";
import { SpaceSignal } from "@/components/UI/SpaceSignal";
import { SpaceMissionBuilder } from "@/components/UI/SpaceMissionBuilder";
import { ModerationConsole } from "@/components/UI/ModerationConsole";
import { NkolosoCinematic } from "@/components/UI/NkolosoCinematic";
import { GuidedTourHints } from "@/components/UI/GuidedTourHints";
import { TerminalText } from "@/components/UI/TerminalText";
import { MissionPanel } from "@/components/UI/MissionPanel";
import { MissionBadgeOverlay } from "@/components/UI/MissionBadgeOverlay";
import { MARKERS } from "@/data/markers";
import { MISSIONS } from "@/lib/missions";
import { emitMissionEvent, onMissionEvent } from "@/lib/missionEvents";
import { DEEP_TIME_MAX, formatZoneForDisplay, getZoneForYear, type DeepTimeZone } from "@/lib/deepTime";
import {
  loadMuseumPassport,
  saveMuseumPassport,
  loadMissionProgress,
  saveMissionProgress,
  type MissionProgress,
} from "@/lib/museumPassport";
import { applyMissionEvent, getInitialMissionProgress } from "@/lib/missionProgress";
import { useViewportSafeLayout } from "@/lib/ui/safeLayout";

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
  space: true,
  earthObservation: true,
  liveSatellites: false,
  community: true,
};

const LOBBY_STORAGE_KEY = "zambia-untold:lobby-seen";
const REENTRY_PROMPT_KEY = "zambia-untold:reentry-prompt-shown";
const TOUR_STORAGE_KEY = "zambia-untold:guided-tour-seen";
const LOW_FI_STORAGE_KEY = "zambia-untold:low-fi-mode";
const LOW_FI_PROMPT_SEEN_KEY = "zambia-untold:low-fi-prompt-seen";
const LAYERS_STORAGE_KEY = "zambia-untold:layer-visibility";
const TOTAL_GALLERIES = 8;

type LobbyPhase = "preload" | "globe" | "thesis" | "ui" | "pulse" | "done";
type ActivePanel =
  | null
  | "calendar"
  | "folkTales"
  | "contribute"
  | "deepTime"
  | "villageSearch"
  | "spaceMission"
  | "moderation";

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
  /** Confirmation pin after Village Search fly-to. Auto-expires via FlyToPin onExpire. */
  const [flyToPin, setFlyToPin] = useState<{ lat: number; lng: number; placeName?: string } | null>(null);
  const [layersExpanded, setLayersExpanded] = useState(false);
  const [showNkolosoCinematic, setShowNkolosoCinematic] = useState(false);
  const [hasUserDraggedGlobe, setHasUserDraggedGlobe] = useState(false);
  const [hasUserMovedScrubber, setHasUserMovedScrubber] = useState(false);
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [guidedTourCompleted, setGuidedTourCompleted] = useState(false);
  const [thesisTypedDone, setThesisTypedDone] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [lowFiMode, setLowFiMode] = useState(false);
  const [showLowFiPrompt, setShowLowFiPrompt] = useState(false);
  const [missionProgress, setMissionProgress] = useState<MissionProgress>(() => getInitialMissionProgress());
  const [badgeOverlayMissionId, setBadgeOverlayMissionId] = useState<string | null>(null);
  const didBootRef = useRef(false);
  const headerCardRef = useRef<HTMLDivElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(210);
  const lobbyTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const missionXrayEmittedRef = useRef(false);
  const missionCopperEpochEmittedRef = useRef(false);
  const prevLayerRef = useRef<LayerVisibility>(DEFAULT_LAYERS);
  const prevPanelRef = useRef<ActivePanel>(null);
  const safe = useViewportSafeLayout();

  /**
   * openPanel — enforces one-panel-at-a-time rule at the state level.
   * Opening any overlay clears the narrative panel (selectedMarkerId).
   * Closing (panel = null) does not restore the marker — user must re-click.
   */
  const openPanel = useCallback((panel: ActivePanel) => {
    setActivePanel(panel);
    if (panel !== null) {
      setSelectedMarkerId(null);
      setContextualCardDismissed(true);
      setShowNkolosoCinematic(false);
    }
  }, [])
  useEffect(() => {
    const node = headerCardRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect?.height;
      if (next && Number.isFinite(next)) {
        setHeaderHeight(Math.ceil(next));
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [safe.width, safe.height]);

  const pushLobbyTimer = useCallback((id: ReturnType<typeof setTimeout>) => {
    lobbyTimersRef.current.push(id);
  }, []);
  const clearLobbyTimers = useCallback(() => {
    for (const id of lobbyTimersRef.current) {
      clearTimeout(id);
    }
    lobbyTimersRef.current = [];
  }, []);

  const playIntro = useCallback(() => {
    clearLobbyTimers();
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(LOBBY_STORAGE_KEY);
      window.sessionStorage.removeItem(TOUR_STORAGE_KEY);
    }
    setLobbyPhase("preload");
    setGuidedTourCompleted(false);
    setShowGuidedTour(false);
    setHasUserDraggedGlobe(false);
    setHasUserMovedScrubber(false);
    setThesisTypedDone(false);
    setActivePanel(null);
    setSelectedMarkerId(null);
    setContextualCardDismissed(true);
    setShowNkolosoCinematic(false);
    setReentryZone(null);
    setLayersExpanded(false);
  }, [clearLobbyTimers]);

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
    const hasSeenGuidedTour = !!window.sessionStorage.getItem(TOUR_STORAGE_KEY);
    const passport = loadMuseumPassport();
    const savedMissionProgress = loadMissionProgress();
    if (savedMissionProgress) setMissionProgress(savedMissionProgress);
    setGuidedTourCompleted(hasSeenGuidedTour);
    setLowFiMode(window.localStorage.getItem(LOW_FI_STORAGE_KEY) === "1");
    const savedLayersRaw = window.localStorage.getItem(LAYERS_STORAGE_KEY);
    if (savedLayersRaw) {
      try {
        const parsed = JSON.parse(savedLayersRaw) as Partial<LayerVisibility>;
        const hydratedLayers: LayerVisibility = { ...DEFAULT_LAYERS, ...parsed };
        prevLayerRef.current = hydratedLayers;
        setLayerVisibility(hydratedLayers);
      } catch {
        // Ignore malformed local data and keep defaults.
      }
    } else if (window.innerWidth >= 768) {
      // Desktop first-run default: keep satellites visible unless user opts out.
      const desktopLayers: LayerVisibility = { ...DEFAULT_LAYERS, liveSatellites: true };
      prevLayerRef.current = desktopLayers;
      setLayerVisibility(desktopLayers);
    }

    if (passport) {
      setScrubYear(passport.lastYear);
      setVisitedZones(passport.visitedZones);
      // Dismiss the Terminal Record contextual card for return visitors
      // so they see a clean globe on refresh
      setContextualCardDismissed(true);
      setShowNkolosoCinematic(false);
      if (!window.sessionStorage.getItem(REENTRY_PROMPT_KEY)) {
        setReentryZone(passport.lastZone);
        window.sessionStorage.setItem(REENTRY_PROMPT_KEY, "1");
      }
    }

    if (hasSeenLobby || passport) {
      setLobbyPhase("done");
    }
    didBootRef.current = true;
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const promptSeen = window.localStorage.getItem(LOW_FI_PROMPT_SEEN_KEY) === "1";
    const lowFiWasConfigured = window.localStorage.getItem(LOW_FI_STORAGE_KEY) !== null;
    if (window.innerWidth <= 430 && !promptSeen && !lowFiWasConfigured) {
      setShowLowFiPrompt(true);
    }
  }, []);
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("low-fi-mode", lowFiMode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOW_FI_STORAGE_KEY, lowFiMode ? "1" : "0");
    }
  }, [lowFiMode]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LAYERS_STORAGE_KEY, JSON.stringify(layerVisibility));
  }, [layerVisibility]);
  useEffect(() => {
    if (lobbyPhase !== "preload") return;
    const t = setTimeout(() => setLobbyPhase("globe"), 3800);
    pushLobbyTimer(t);
    return () => clearTimeout(t);
  }, [lobbyPhase, pushLobbyTimer]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (activePanel) {
          setActivePanel(null);
          setShowNkolosoCinematic(false);
        } else if (selectedMarkerId) {
          setSelectedMarkerId(null);
        } else {
          setContextualCardDismissed(true);
          setShowNkolosoCinematic(false);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedMarkerId, activePanel]);

  useEffect(() => {
    if (lobbyPhase !== "globe") return;

    const t = setTimeout(() => setLobbyPhase("thesis"), 2600);
    pushLobbyTimer(t);
    return () => clearTimeout(t);
  }, [lobbyPhase, pushLobbyTimer]);

  useEffect(() => {
    if (lobbyPhase !== "thesis") return;
    setThesisTypedDone(false);
  }, [lobbyPhase]);

  useEffect(() => {
    if (lobbyPhase !== "thesis" || !thesisTypedDone) return;

    const t = setTimeout(() => setLobbyPhase("ui"), 2000);
    pushLobbyTimer(t);
    return () => clearTimeout(t);
  }, [lobbyPhase, thesisTypedDone, pushLobbyTimer]);

  useEffect(() => {
    if (lobbyPhase !== "ui") return;

    const t = setTimeout(() => setLobbyPhase("pulse"), 1000);
    pushLobbyTimer(t);
    return () => clearTimeout(t);
  }, [lobbyPhase, pushLobbyTimer]);

  useEffect(() => {
    if (lobbyPhase !== "pulse") return;

    const t = setTimeout(() => {
      setLobbyPhase("done");
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(LOBBY_STORAGE_KEY, "1");
      }
    }, 1000);

    pushLobbyTimer(t);
    return () => clearTimeout(t);
  }, [lobbyPhase, pushLobbyTimer]);

  // Show interaction-driven guided tour when lobby is done and tour not yet seen
  useEffect(() => {
    if (lobbyPhase !== "done" || typeof window === "undefined") return;
    if (!window.sessionStorage.getItem(TOUR_STORAGE_KEY)) setShowGuidedTour(true);
  }, [lobbyPhase]);


  useEffect(() => {
    const off = onMissionEvent((eventName) => {
      setMissionProgress((prev) => {
        const { next, newlyCompletedMissionId } = applyMissionEvent(prev, eventName);
        if (newlyCompletedMissionId) setBadgeOverlayMissionId(newlyCompletedMissionId);
        saveMissionProgress(next);
        return next;
      });
    });

    return off;
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

  useEffect(() => {
    if (!selectedMarkerId) return;

    switch (selectedMarkerId) {
      case "kalambo-falls":
        emitMissionEvent("marker:kalambo-falls:opened");
        break;
      case "kabwe-skull":
        emitMissionEvent("marker:kabwe-skull:opened");
        break;
      case "kansanshi":
        emitMissionEvent("marker:kansanshi:opened");
        break;
      case "ingombe-ilede":
        emitMissionEvent("marker:ingombe-ilede:opened");
        break;
      case "lusaka-independence":
        emitMissionEvent("marker:lusaka-independence:opened");
        break;
      case "nkoloso-space-academy":
        emitMissionEvent("marker:nkoloso:opened");
        break;
      default:
        break;
    }
  }, [selectedMarkerId]);

  useEffect(() => {
    if (scrubYear < -10000 && !missionXrayEmittedRef.current) {
      missionXrayEmittedRef.current = true;
      emitMissionEvent("shader:xray:activated");
    }

    if (scrubYear >= 1000 && scrubYear <= 1600 && !missionCopperEpochEmittedRef.current) {
      missionCopperEpochEmittedRef.current = true;
      emitMissionEvent("epoch:copper-empire:visited");
    }
  }, [scrubYear]);

  useEffect(() => {
    const prev = prevLayerRef.current;

    if (prev.liveSatellites === false && layerVisibility.liveSatellites !== false) {
      emitMissionEvent("layer:satellites:activated");
    }

    if (prev.community === false && layerVisibility.community !== false) {
      emitMissionEvent("layer:community:activated");
    }

    prevLayerRef.current = layerVisibility;
  }, [layerVisibility]);

  useEffect(() => {
    if (prevPanelRef.current !== "contribute" && activePanel === "contribute") {
      emitMissionEvent("community:memory:opened");
    }
    prevPanelRef.current = activePanel;
  }, [activePanel]);

  const handleNavigateToCoordinate = (lat: number, lng: number, markerId?: string, placeName?: string) => {
    if (markerId) {
      const marker = MARKERS.find((m) => m.id === markerId);
      if (marker) {
        setSelectedMarkerId(marker.id);
        setScrubYear(marker.epoch);
        setContextualCardDismissed(false);
        setActivePanel(null);
        setShowNkolosoCinematic(false);
        return;
      }
    }
    // Fly to arbitrary coordinate (Village Search)
    setFlyToCoordinate({ lat, lng });
    // Drop a confirmation pin at the destination
    setFlyToPin({ lat, lng, placeName });
    // Reset flyToCoordinate after a tick so the same coordinate can be re-selected
    setTimeout(() => setFlyToCoordinate(null), 100);
    setActivePanel(null);
    setShowNkolosoCinematic(false);
  };

  const isDone = lobbyPhase === "done";
  const showUI = lobbyPhase === "ui" || isDone;
  const headerTop = safe.headerTop;
  const headerSideInset = safe.sideInset;
  const headerBottom = headerTop + headerHeight;
  const layersTop = headerBottom + 10;
  const layersContentMaxHeight = safe.isDesktop
    ? `calc(100vh - ${Math.max(layersTop + safe.bottomInset + 32, 180)}px)`
    : `calc(100vh - ${Math.max(layersTop + safe.actionBottom + 110, 220)}px)`;
  const layersPositionStyle = safe.isDesktop
    ? { top: layersTop, left: headerSideInset, width: 270 }
    : { top: layersTop, left: headerSideInset, right: headerSideInset };
  const guidedHeaderBottom = headerBottom + (layersExpanded ? 40 : 12);
  const hideMobileAuxOverlays = !safe.isDesktop && (layersExpanded || showGuidedTour);
  const mobileBottomInsetPx = safe.isDesktop ? safe.actionBottom : safe.actionBottom + 52;

  return (
    <main className="relative isolate h-full min-h-screen w-full max-w-full overflow-x-hidden overflow-y-hidden" style={{ backgroundColor: "#030405" }}>
      {(lobbyPhase === "preload" || lobbyPhase === "globe") && (
        <PreloadScreen visible={lobbyPhase === "preload"} />
      )}

      {/* Globe: full viewport, always centered.
          Use instant opacity for return visits (isDone on mount) to prevent
          the warm bg-bg from compositing through the canvas during a CSS
          transition. First-time visitors still get the smooth fade-in. */}
      <CanvasWrapper
        className={`${lobbyPhase === "preload" ? "opacity-0" : isDone ? "opacity-100" : "opacity-100 transition-opacity duration-700"} -translate-y-[2vh] md:translate-y-0`}
      >
        <Globe
          selectedMarker={selectedMarker}
          scrubYear={scrubYear}
          onMarkerSelect={(marker) => {
            setSelectedMarkerId(marker.id);
            setScrubYear(marker.epoch);
            setContextualCardDismissed(false);
            setActivePanel(null);
            setShowNkolosoCinematic(marker.id === "nkoloso-space-academy");
          }}
          layerVisibility={layerVisibility}
          showHUD={showUI}
          flyToCoordinate={flyToCoordinate}
          flyToPin={flyToPin}
          onFlyToPinExpire={() => setFlyToPin(null)}
          onUserInteract={() => setHasUserDraggedGlobe(true)}
          focusAfricaDuringLobby={lobbyPhase !== "done"}
          onCommunityMemoryOpen={() => emitMissionEvent("community:memory:opened")}
          lowFiMode={lowFiMode}
        />
      </CanvasWrapper>

            {/* Thesis line — terminal type-in, then hold 2s and fade as UI appears */}
      {(lobbyPhase === "thesis" || lobbyPhase === "ui") && (
        <div
          className="pointer-events-none absolute left-1/2 top-[56%] z-20 -translate-x-1/2 -translate-y-1/2 text-center transition-opacity duration-700 md:top-1/2"
          style={{
            opacity: lobbyPhase === "thesis" ? 1 : 0,
          }}
        >
          <div className="mx-auto inline-block max-w-[94vw] border border-copper/30 bg-[#0A0806]/65 px-3 py-2 backdrop-blur-sm md:max-w-[74vw] md:px-4 md:py-3">
            <TerminalText
              text="Before there were nations, there was a substrate."
              speed={45}
              color="#B87333"
              className="thesis-line mx-auto max-w-[92vw] font-mono text-[24px] leading-[1.3] tracking-[0.06em] md:max-w-[70vw] md:text-[36px]"
              onComplete={() => setThesisTypedDone(true)}
            />
          </div>
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

      {/* Header: Title + Time Navigation — single card to avoid stacked look */}
      <header
        className={`absolute z-30 flex flex-col items-center justify-center gap-0 transition-opacity duration-700 md:justify-start md:items-start md:px-0 ${showUI ? "opacity-100" : "opacity-0"}`}
        style={{
          top: headerTop,
          ...(safe.isDesktop
            ? { left: headerSideInset, right: "auto" }
            : { left: safe.sideInset, right: safe.sideInset }),
        }}
      >
        <div ref={headerCardRef} className="museum-card pointer-events-auto w-full max-w-[min(92vw,420px)] overflow-hidden rounded border border-copper/25 bg-bg/70 backdrop-blur-sm md:w-auto md:max-w-none">
          <div className={`text-center md:text-left ${safe.compact ? "px-3 py-2" : "px-4 py-2.5 md:px-4 md:py-3"}`}>
            <p className={`font-display tracking-[0.2em] text-copper ${safe.compact ? "text-lg" : "text-xl md:text-2xl lg:text-3xl"}`}>
              ZAMBIA UNTOLD
            </p>
            <p className={`uppercase tracking-[0.2em] text-muted ${safe.compact ? "mt-0.5 text-[11px]" : "mt-1 text-[11px] md:mt-1.5 md:text-xs lg:text-sm"}`}>
              The history you were never taught
            </p>
            <p className={`uppercase tracking-[0.18em] text-copperSoft/90 ${safe.compact ? "mt-1 text-[11px]" : "mt-1.5 text-[11px] md:mt-2 md:text-[11px]"}`}>
              Galleries Visited: {visitedZones.length}/{TOTAL_GALLERIES}
            </p>
            <p className={`font-mono uppercase tracking-[0.16em] text-muted/70 ${safe.compact ? "mt-0.5 text-[11px]" : "mt-1 text-[11px]"}`}>
              Stored locally · No external tracking
            </p>
            {isDone && (
              <button
                type="button"
                onClick={playIntro}
                className="pointer-events-auto mt-2 block w-full rounded border border-copper/20 bg-transparent py-1 text-[11px] uppercase tracking-[0.14em] text-copper/70 hover:border-copper/40 hover:text-copper/90 md:mt-2.5"
              >
                Play intro
              </button>
            )}
          </div>
          <div className="border-t border-copper/20 px-3 py-2 md:px-3 md:py-2">
            <TimeButtons
              embedded
              year={scrubYear}
              onYearChange={(year) => {
                setHasUserMovedScrubber(true);
                setScrubYear(year);
                setSelectedMarkerId(null);
                setContextualCardDismissed(false);
                setShowNkolosoCinematic(false);
              }}
            />
          </div>
        </div>
      </header>

      {/* Skip intro button — fixed at bottom so placement matches tour panel; label confirms latest bundle */}
      {lobbyPhase !== "done" && (
        <button
          type="button"
          onClick={() => {
            clearLobbyTimers();
            setLobbyPhase("done");
            if (typeof window !== "undefined") {
              window.sessionStorage.setItem(LOBBY_STORAGE_KEY, "1");
            }
          }}
          style={{
            bottom: `calc(env(safe-area-inset-bottom, 0px) + ${mobileBottomInsetPx}px)`,
            left: "50%",
            transform: "translateX(-50%)",
            top: "auto",
          }}
          className="fixed z-50 rounded border border-copper/35 bg-bg/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-copperSoft backdrop-blur hover:border-copper"
        >
          SKIP BRIEFING · BOTTOM
        </button>
      )}

      {/* Re-entry prompt — positioned below the header title card */}
      {reentryZone && isDone && (
        <aside className="absolute left-1/2 top-[6.5rem] z-30 w-[min(92vw,420px)] -translate-x-1/2 rounded border border-copper/35 bg-bg/90 px-4 py-3 text-center backdrop-blur md:left-[55%] md:top-[5.5rem] md:translate-x-0">
          <p className="font-display text-[12px] tracking-[0.18em] text-copperSoft">
            You left during {formatZoneForDisplay(reentryZone)}
          </p>
          <button
            type="button"
            onClick={() => setReentryZone(null)}
            className="mt-2 rounded border border-copper/30 px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-muted hover:text-text"
          >
            Dismiss
          </button>
        </aside>
      )}

      {showUI && (
        <div className="absolute right-3 top-3 z-40 md:right-6 md:top-6">
          <button
            type="button"
            onClick={() => setShowSettings((v) => !v)}
            className="min-h-11 min-w-11 rounded border border-copper/35 bg-bg/75 px-2 text-[11px] uppercase tracking-[0.14em] text-copperSoft backdrop-blur-sm hover:border-copper"
            aria-label="Settings"
          >
            ⚙
          </button>
          {showSettings && (
            <div className="mt-2 w-[min(92vw,340px)] border border-copper/30 bg-[#0A0806]/95 px-3 py-2">
              <label className="flex cursor-pointer items-start gap-2">
                <input
                  type="checkbox"
                  checked={lowFiMode}
                  onChange={(e) => setLowFiMode(e.target.checked)}
                  className="mt-0.5 h-4 w-4"
                />
                <span className="text-[11px] leading-relaxed text-copperSoft">
                  LOW-FI MODE — Optimized for slower devices and mobile data.
                </span>
              </label>
            </div>
          )}
        </div>
      )}
      {/* ══════════════════════════════════════════════════════
          ACTION BAR — Calendar, Folk Tales, Contribute buttons
          Positioned bottom-center, always visible when UI is active
          ══════════════════════════════════════════════════════ */}
      {showUI && (
        <nav
          style={{
            bottom: `calc(env(safe-area-inset-bottom, 0px) + ${mobileBottomInsetPx}px)`,
            ...(safe.isDesktop
              ? { left: "50%", transform: "translateX(-50%)", maxWidth: "min(92vw, 520px)" }
              : { left: safe.sideInset, right: safe.sideInset }),
          }}
          className="action-nav absolute z-30 flex items-center justify-center gap-1.5 overflow-x-auto whitespace-nowrap rounded-lg border border-copper/30 bg-bg/85 px-4 py-2.5 backdrop-blur-md shadow-glow md:justify-start"
        >
          {/* Breathing indicator — implies a living system */}
          <div className="mr-1 h-1.5 w-1.5 rounded-full bg-copper/60 animate-[breathing_3s_ease-in-out_infinite]" />

          {/* Deep Time */}
          <div className="group relative">
            <button
              type="button"
              onClick={() => openPanel(activePanel === "deepTime" ? null : "deepTime")}
              className={`action-nav-btn flex items-center gap-1 rounded px-2 py-1.5 text-[11px] uppercase tracking-[0.12em] transition-all duration-200 md:gap-1.5 md:px-3 md:py-2 md:text-[11px] md:tracking-[0.14em] ${
                activePanel === "deepTime"
                  ? "bg-copper/20 text-copper border border-copper/40 shadow-[0_0_8px_rgba(184,115,51,0.2)]"
                  : "text-copperSoft hover:text-copper hover:bg-copper/8 border border-transparent hover:border-copper/25 hover:shadow-[0_0_6px_rgba(184,115,51,0.15)]"
              }`}
            >
              <span className="text-sm">🪨</span>
              <span className="hidden sm:inline">Deep Time</span>
            </button>
            <span className="museum-tooltip absolute -top-16 left-1/2 w-[240px] -translate-x-1/2 border border-copper/30 bg-[#0A0806] px-2 py-1 text-[11px] leading-relaxed text-copperSoft whitespace-pre-line">
              {"Navigate from 4.5 billion BC\nto the present moment."}
            </span>
          </div>

          <div className="h-4 w-px bg-copper/15 md:h-5" />

          {/* Calendar */}
          <div className="group relative">
            <button
              type="button"
              onClick={() => openPanel(activePanel === "calendar" ? null : "calendar")}
              className={`action-nav-btn flex items-center gap-1 rounded px-2 py-1.5 text-[11px] uppercase tracking-[0.12em] transition-all duration-200 md:gap-1.5 md:px-3 md:py-2 md:text-[11px] md:tracking-[0.14em] ${
                activePanel === "calendar"
                  ? "bg-copper/20 text-copper border border-copper/40 shadow-[0_0_8px_rgba(184,115,51,0.2)]"
                  : "text-copperSoft hover:text-copper hover:bg-copper/8 border border-transparent hover:border-copper/25 hover:shadow-[0_0_6px_rgba(184,115,51,0.15)]"
              }`}
            >
              <span className="text-sm">📅</span>
              <span className="hidden sm:inline">Calendar</span>
            </button>
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-panel/95 border border-copper/20 px-2 py-0.5 text-[11px] text-muted/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Historical sequence
            </span>
          </div>

          {/* Inganji */}
          <div className="group relative">
            <button
              type="button"
              onClick={() => openPanel(activePanel === "folkTales" ? null : "folkTales")}
              className={`action-nav-btn flex items-center gap-1 rounded px-2 py-1.5 text-[11px] uppercase tracking-[0.12em] transition-all duration-200 md:gap-1.5 md:px-3 md:py-2 md:text-[11px] md:tracking-[0.14em] ${
                activePanel === "folkTales"
                  ? "bg-copper/20 text-copper border border-copper/40 shadow-[0_0_8px_rgba(184,115,51,0.2)]"
                  : "text-copperSoft hover:text-copper hover:bg-copper/8 border border-transparent hover:border-copper/25 hover:shadow-[0_0_6px_rgba(184,115,51,0.15)]"
              }`}
            >
              <span className="text-sm">🔥</span>
              <span className="hidden sm:inline">Inganji</span>
            </button>
            <span className="museum-tooltip absolute -top-16 left-1/2 w-[240px] -translate-x-1/2 border border-copper/30 bg-[#0A0806] px-2 py-1 text-[11px] leading-relaxed text-copperSoft whitespace-pre-line">
              {"Zambia's living mythology.\nStories older than writing."}
            </span>
          </div>

          {/* Village Search */}
          <div className="group relative">
            <button
              type="button"
              onClick={() => openPanel(activePanel === "villageSearch" ? null : "villageSearch")}
              className={`action-nav-btn flex items-center gap-1 rounded px-2 py-1.5 text-[11px] uppercase tracking-[0.12em] transition-all duration-200 md:gap-1.5 md:px-3 md:py-2 md:text-[11px] md:tracking-[0.14em] ${
                activePanel === "villageSearch"
                  ? "bg-copper/20 text-copper border border-copper/40 shadow-[0_0_8px_rgba(184,115,51,0.2)]"
                  : "text-copperSoft hover:text-copper hover:bg-copper/8 border border-transparent hover:border-copper/25 hover:shadow-[0_0_6px_rgba(184,115,51,0.15)]"
              }`}
            >
              <span className="text-sm">📍</span>
              <span className="hidden sm:inline">Search</span>
            </button>
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-panel/95 border border-copper/20 px-2 py-0.5 text-[11px] text-muted/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Find your village
            </span>
          </div>

          {/* Isibalo */}
          <div className="group relative">
            <button
              type="button"
              onClick={() => openPanel(activePanel === "contribute" ? null : "contribute")}
              className={`action-nav-btn flex items-center gap-1 rounded px-2 py-1.5 text-[11px] uppercase tracking-[0.12em] transition-all duration-200 md:gap-1.5 md:px-3 md:py-2 md:text-[11px] md:tracking-[0.14em] ${
                activePanel === "contribute"
                  ? "bg-copper/20 text-copper border border-copper/40 shadow-[0_0_8px_rgba(184,115,51,0.2)]"
                  : "text-copperSoft hover:text-copper hover:bg-copper/8 border border-transparent hover:border-copper/25 hover:shadow-[0_0_6px_rgba(184,115,51,0.15)]"
              }`}
            >
              <span className="text-sm">✦</span>
              <span className="hidden sm:inline">Isibalo</span>
            </button>
            <span className="museum-tooltip absolute -top-16 left-1/2 w-[260px] -translate-x-1/2 border border-copper/30 bg-[#0A0806] px-2 py-1 text-[11px] leading-relaxed text-copperSoft whitespace-pre-line">
              {"The community record.\nMemories the archive hasn't captured yet."}
            </span>
          </div>
          {/* Moderation */}
          <div className="group relative">
            <button
              type="button"
              onClick={() => openPanel(activePanel === "moderation" ? null : "moderation")}
              className={`action-nav-btn flex items-center gap-1 rounded px-2 py-1.5 text-[11px] uppercase tracking-[0.12em] transition-all duration-200 md:gap-1.5 md:px-3 md:py-2 md:text-[11px] md:tracking-[0.14em] ${
                activePanel === "moderation"
                  ? "bg-copper/20 text-copper border border-copper/40 shadow-[0_0_8px_rgba(184,115,51,0.2)]"
                  : "text-copperSoft hover:text-copper hover:bg-copper/8 border border-transparent hover:border-copper/25 hover:shadow-[0_0_6px_rgba(184,115,51,0.15)]"
              }`}
            >
              <span className="text-sm">🛡</span>
              <span className="hidden sm:inline">Review</span>
            </button>
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-panel/95 border border-copper/20 px-2 py-0.5 text-[11px] text-muted/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Moderation queue
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
          positionStyle={layersPositionStyle}
          contentMaxHeight={layersContentMaxHeight}
          visibility={layerVisibility}
          onVisibilityChange={setLayerVisibility}
          visitedZones={visitedZones}
          onExpandedChange={setLayersExpanded}
          onSelectMarker={(markerId) => {
            const marker = MARKERS.find((m) => m.id === markerId);
            if (!marker) return;
            setSelectedMarkerId(marker.id);
            setScrubYear(marker.epoch);
            setContextualCardDismissed(false);
            setActivePanel(null);
            setShowNkolosoCinematic(marker.id === "nkoloso-space-academy");
          }}
          onOpenSpaceMission={() => openPanel("spaceMission")}
          onEraSelect={(year) => {
            setHasUserMovedScrubber(true);
            setScrubYear(year);
            setSelectedMarkerId(null);
            setContextualCardDismissed(false);
            setShowNkolosoCinematic(false);
          }}
        />
      </div>

      {showUI && <DataIssueBanner />}
      {showUI && (
        <NkolosoCinematic
          active={showNkolosoCinematic}
          onDone={() => setShowNkolosoCinematic(false)}
        />
      )}
      {showUI && !hideMobileAuxOverlays && (
        <SpaceSignal
          enabled={layerVisibility.space !== false}
          earthObservationEnabled={layerVisibility.earthObservation !== false}
          liveSatellitesEnabled={layerVisibility.liveSatellites !== false}
          onOpenMissionBuilder={() => openPanel("spaceMission")}
          guidedTourActive={showGuidedTour}
        />
      )}

      {/* Sovereignty Stack — bottom-left, above LayersPanel, desktop only.
          Flips Governance/Value/Infrastructure state as scrubber moves through epochs.
          This is the argument, not decoration. */}
      {showUI && !layersExpanded && <SovereigntyStack year={scrubYear} />}

      {/* Story Compass — persistent "You Are Here" context indicator.
          Museum corner label aesthetic — a whisper, not a headline. */}
      {showUI && (
        <StoryCompass
          scrubYear={scrubYear}
          selectedMarker={selectedMarker}
          activePanel={activePanel}
        />
      )}

      {showUI && !hideMobileAuxOverlays && (
        <MissionPanel
          progress={missionProgress}
          startExpanded={!guidedTourCompleted}
          showPulseCue={guidedTourCompleted}
          onSetActiveMission={(missionId) => {
            setMissionProgress((prev) => {
              const next = { ...prev, lastActiveMission: missionId };
              saveMissionProgress(next);
              return next;
            });
          }}
        />
      )}

      <MissionBadgeOverlay
        visible={badgeOverlayMissionId !== null}
        badge={MISSIONS.find((m) => m.id === badgeOverlayMissionId)?.badge ?? ""}
        badgeLabel={MISSIONS.find((m) => m.id === badgeOverlayMissionId)?.badgeLabel ?? ""}
        unlockMessage={MISSIONS.find((m) => m.id === badgeOverlayMissionId)?.unlockMessage ?? ""}
        completedMissions={missionProgress.completedMissions.length}
        totalMissions={MISSIONS.length}
        onDone={() => setBadgeOverlayMissionId(null)}
      />

      {showUI && showLowFiPrompt && (
        <aside className="fixed inset-x-3 top-[22vh] z-50 border border-copper/35 bg-[#0A0806]/95 px-3 py-3 backdrop-blur md:hidden terminal-panel">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-copperSoft">Mobile detected</p>
          <p className="mt-2 text-[14px] leading-relaxed text-[#D8C9B4]">
            Enable Low-Fi mode for smoother performance on this device?
          </p>
          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              className="min-h-11 rounded border border-copper/35 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-copperSoft"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.localStorage.setItem(LOW_FI_PROMPT_SEEN_KEY, "1");
                }
                setLowFiMode(true);
                setShowLowFiPrompt(false);
              }}
            >
              Enable
            </button>
            <button
              type="button"
              className="min-h-11 rounded border border-copper/25 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-muted/80"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.localStorage.setItem(LOW_FI_PROMPT_SEEN_KEY, "1");
                }
                setShowLowFiPrompt(false);
              }}
            >
              Not now
            </button>
          </div>
        </aside>
      )}

      {/* Interaction-driven guided tour — first-time only, advances on globe drag / scrubber / marker click */}
      {showUI && (
        <GuidedTourHints
          active={showGuidedTour}
          onComplete={() => {
            if (typeof window !== "undefined") {
              window.sessionStorage.setItem(TOUR_STORAGE_KEY, "1");
            }
            setGuidedTourCompleted(true);
            setShowGuidedTour(false);
          }}
          userHasDraggedGlobe={hasUserDraggedGlobe}
          userHasMovedScrubber={hasUserMovedScrubber}
          hasSelectedMarker={selectedMarkerId !== null}
          layout={{
            width: safe.width,
            height: safe.height,
            isDesktop: safe.isDesktop,
            sideInset: safe.sideInset,
            topInset: safe.topInset,
            bottomInset: safe.bottomInset,
            headerBottom: guidedHeaderBottom,
            actionBottom: safe.actionBottom,
          }}
        />
      )}

      {/* Narrative Panel (right side) */}
      {showUI && !hideMobileAuxOverlays && (
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
            onNavigate={(lat, lng, placeName) =>
              handleNavigateToCoordinate(lat, lng, undefined, placeName)
            }
            onClose={() => setActivePanel(null)}
          />
        )}
        {activePanel === "spaceMission" && (
          <SpaceMissionBuilder
            key="spaceMission"
            onClose={() => setActivePanel(null)}
          />
        )}
        {activePanel === "moderation" && (
          <ModerationConsole
            key="moderation"
            onClose={() => setActivePanel(null)}
          />
        )}
        {activePanel === "contribute" && (
          <ContributionForm
            key="contribute"
            onClose={() => setActivePanel(null)}
            onSubmitted={() => emitMissionEvent("community:memory:submitted")}
          />
        )}
      </AnimatePresence>

      <p className="pointer-events-none absolute bottom-1 left-1/2 z-20 hidden -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.16em] text-copper/70 md:block">
        Sovereign Infrastructure · Powered by CopperCloud · Zambia
      </p>
    </main>
  );
}










































































































































