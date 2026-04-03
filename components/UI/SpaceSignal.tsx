"use client";

import { useEffect, useState } from "react";

type SpaceSignalPayload = {
  generatedAt: string;
  sourceStatus: "live" | "fallback";
  iss: {
    latitude: number;
    longitude: number;
    altitudeKm: number;
    velocityKmh: number;
    overheadZambia: boolean;
  };
  earthMarsDistanceKm: number;
  satellitesOverZambiaEstimate: number;
};

type NoradPayload = {
  generatedAt: string;
  sourceStatus: "live" | "fallback";
  source: string;
  counts: {
    totalParsed: number;
    analyzed: number;
    propagated: number;
    overZambiaNow: number;
    nearZambiaNow: number;
  };
  sample: Array<{ name: string; latitude: number; longitude: number; altitudeKm: number }>;
};

type EarthObservationPayload = {
  generatedAt: string;
  sourceStatus: "live" | "fallback";
  source: string;
  count: number;
  events: Array<{ id: string; title: string; categories: string[]; latestDate: string }>;
};

type ApprovedListPayload = {
  generatedAt: string;
  sourceStatus: "live" | "fallback";
  source: string;
  count: number;
  items: unknown[];
};

function isSatelliteOverZambia(sample: { latitude: number; longitude: number }) {
  return (
    sample.latitude >= -18.5 &&
    sample.latitude <= -8.1 &&
    sample.longitude >= 21.9 &&
    sample.longitude <= 33.7
  );
}

function isSatelliteNearZambia(sample: { latitude: number; longitude: number }) {
  return (
    sample.latitude >= -25 &&
    sample.latitude <= 0 &&
    sample.longitude >= 12 &&
    sample.longitude <= 45
  );
}

type SpaceSignalProps = {
  enabled: boolean;
  earthObservationEnabled: boolean;
  liveSatellitesEnabled?: boolean;
  satelliteScope?: "zambia" | "region";
  onEnableLiveSatellites?: () => void;
  onToggleSatelliteScope?: () => void;
  onOpenMissionBuilder?: () => void;
  onEnterArchive?: () => void;
  guidedTourActive?: boolean;
};

export function SpaceSignal({
  enabled,
  earthObservationEnabled,
  liveSatellitesEnabled = false,
  satelliteScope = "zambia",
  onOpenMissionBuilder,
  onEnableLiveSatellites,
  onToggleSatelliteScope,
  onEnterArchive,
  guidedTourActive,
}: SpaceSignalProps) {
  const [data, setData] = useState<SpaceSignalPayload | null>(null);
  const [norad, setNorad] = useState<NoradPayload | null>(null);
  const [earth, setEarth] = useState<EarthObservationPayload | null>(null);
  const [approvedCommunity, setApprovedCommunity] = useState<ApprovedListPayload | null>(null);
  const [approvedMissions, setApprovedMissions] = useState<ApprovedListPayload | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const load = async () => {
      try {
        const [liveRes, noradRes, earthRes, approvedCommunityRes, approvedMissionsRes] = await Promise.all([
          fetch("/api/space/live", { cache: "no-store" }),
          fetch("/api/space/norad", { cache: "no-store" }),
          earthObservationEnabled
            ? fetch("/api/earth/observation", { cache: "no-store" })
            : Promise.resolve(new Response(null, { status: 204 })),
          fetch("/api/community/approved", { cache: "no-store" }),
          fetch("/api/space/mission/approved", { cache: "no-store" }),
        ]);

        if (liveRes.ok) {
          const payload = (await liveRes.json()) as SpaceSignalPayload;
          if (!cancelled) setData(payload);
        }
        if (noradRes.ok) {
          const payload = (await noradRes.json()) as NoradPayload;
          if (!cancelled) setNorad(payload);
        }
        if (earthRes.status !== 204 && earthRes.ok) {
          const payload = (await earthRes.json()) as EarthObservationPayload;
          if (!cancelled) setEarth(payload);
        }
        if (approvedCommunityRes.ok) {
          const payload = (await approvedCommunityRes.json()) as ApprovedListPayload;
          if (!cancelled) setApprovedCommunity(payload);
        }
        if (approvedMissionsRes.ok) {
          const payload = (await approvedMissionsRes.json()) as ApprovedListPayload;
          if (!cancelled) setApprovedMissions(payload);
        }
      } catch {
        // Keep prior payload if fetch fails.
      }
    };

    load();
    const id = setInterval(load, 60000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [enabled, earthObservationEnabled]);

  if (!enabled) return null;

  const overNow = norad?.sample.filter(isSatelliteOverZambia).slice(0, 3) ?? [];
  const regionalNow = norad?.sample.filter(isSatelliteNearZambia).slice(0, 8) ?? [];
  const earthEvents = earth?.events.slice(0, 3) ?? [];
  const archiveCount = (approvedCommunity?.count ?? 0) + (approvedMissions?.count ?? 0);
  const loading = !data;

  return (
    <>
      <aside className="pointer-events-auto absolute right-4 top-[6.5rem] z-20 hidden w-[min(460px,38vw)] border border-copper/30 bg-bg/85 px-4 py-3 backdrop-blur-md md:block">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-[12px] uppercase tracking-[0.18em] text-copperSoft">Space Signal</p>
            <p className="mt-1 text-[13px] leading-relaxed text-[#d9ccb8]">
              Live Zambia is active. Inspect the sky, build a mission, or move into the archive.
            </p>
          </div>
          <span className="rounded border border-[#76d7ff]/35 bg-[#76d7ff]/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#bceeff]">
            Present Lens
          </span>
        </div>
        {loading ? (
          <div className="mt-3 rounded border border-copper/20 bg-panel/45 px-3 py-3">
            <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-copper/80">
              Activating live feeds...
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-muted/80">
              Zambia observatory layers are on. Pulling satellite tracks and live signal records now.
            </p>
          </div>
        ) : (
          <>
            <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.12em] text-muted/75">
              ISS {data.iss.overheadZambia ? "Over Zambia" : "Not Over Zambia"}
            </p>

            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[12px] text-text/75">
              <span>Alt: {Math.round(data.iss.altitudeKm)} km</span>
              <span>Vel: {Math.round(data.iss.velocityKmh)} km/h</span>
              <span>Mars gap: {Math.round(data.earthMarsDistanceKm).toLocaleString()} km</span>
              <span>Pass est.: {data.satellitesOverZambiaEstimate}</span>
            </div>

            <p className="mt-2 text-[11px] uppercase tracking-[0.1em] text-muted/75">
              Orbital: CelesTrak/NORAD + wheretheiss.at · Compute: CopperCloud
            </p>

            {norad && (
              <div className="mt-3 border border-copper/20 bg-panel/55 px-3 py-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.14em] text-copper/85">
                      Live Satellites · Over Zambia Now: {norad.counts.overZambiaNow}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-muted/65">
                      Near region now: {norad.counts.nearZambiaNow}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleSatelliteScope}
                    className="min-h-10 shrink-0 rounded border border-[#39d8ff]/30 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-[#bceeff] hover:bg-[#39d8ff]/10"
                  >
                    {satelliteScope === "region" ? "Focus Zambia" : "Expand Region"}
                  </button>
                </div>
                <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-muted/65">
                  Source: {norad.sourceStatus === "live" ? "CelesTrak/NORAD propagated sample" : "Fallback orbital model"}
                </p>
                {liveSatellitesEnabled && (satelliteScope === "region" ? regionalNow.length > 0 : overNow.length > 0) ? (
                  <div className="mt-2 space-y-1">
                    {(satelliteScope === "region" ? regionalNow : overNow).map((sat) => (
                      <p key={`${sat.name}-${sat.latitude.toFixed(2)}-${sat.longitude.toFixed(2)}`} className="text-[12px] text-muted/80">
                        {sat.name} · {Math.round(sat.altitudeKm)} km
                      </p>
                    ))}
                  </div>
                ) : liveSatellitesEnabled ? (
                  <p className="mt-2 text-[12px] text-muted/80">
                    {satelliteScope === "region"
                      ? "No tracked satellite in the expanded regional window this minute."
                      : "No tracked satellite directly overhead this minute."}
                  </p>
                ) : (
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-[12px] leading-relaxed text-muted/80">
                      Enable Live Satellites layer to inspect overhead objects.
                    </p>
                    <button
                      type="button"
                      onClick={onEnableLiveSatellites}
                      className="min-h-10 shrink-0 rounded border border-copper/30 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-copper/85 hover:bg-copper/10"
                    >
                      Enable
                    </button>
                  </div>
                )}
              </div>
            )}

            {(approvedCommunity || approvedMissions) && (
              <div className="mt-3 border border-copper/20 bg-panel/55 px-3 py-2.5">
                <p className="text-[12px] uppercase tracking-[0.14em] text-copper/80">Living Archive · Approved</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-muted/65">
                  Source: Supabase approved archive records
                </p>
                <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[12px] text-muted/80">
                  <span>Isibalo: {approvedCommunity?.count ?? 0}</span>
                  <span>Missions: {approvedMissions?.count ?? 0}</span>
                </div>
              </div>
            )}

            {earthObservationEnabled && earth && (
              <div className="mt-3 border border-copper/20 bg-panel/55 px-3 py-2.5">
                <p className="text-[12px] uppercase tracking-[0.14em] text-copper/85">
                  Earth Observation · Open Events in Zambia Region: {earth.count}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-muted/65">
                  Source: {earth.sourceStatus === "live" ? earth.source : "Fallback earth observation feed"}
                </p>
                {earthEvents.length > 0 ? (
                  <div className="mt-2 space-y-1">
                    {earthEvents.map((event) => (
                      <p key={event.id} className="text-[12px] leading-relaxed text-muted/85">
                        {event.title}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-[12px] text-muted/80">No open remote-sensed events reported now.</p>
                )}
              </div>
            )}
          </>
        )}

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted/75">
            {loading
              ? "Initializing live observatory"
              : `${data.sourceStatus === "live" ? "Live feed" : "Fallback model"} · Updated ${new Date(data.generatedAt).toLocaleTimeString()}`}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onEnterArchive}
              className="min-h-10 rounded border border-copper/25 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-muted/80 hover:border-copper/35 hover:text-text"
            >
              Enter Archive
            </button>
            <button
              type="button"
              onClick={onOpenMissionBuilder}
              className="min-h-10 rounded border border-copper/30 px-3 py-1.5 text-[12px] uppercase tracking-[0.12em] text-copperSoft hover:border-copper"
            >
              Build Mission
            </button>
          </div>
        </div>
      </aside>

      {!(guidedTourActive === true) && (
        <aside className="pointer-events-auto fixed bottom-[8.8rem] left-3 right-3 z-20 border border-copper/20 bg-bg/72 px-3 py-2.5 backdrop-blur-sm md:hidden">
          {!mobileExpanded ? (
            <div className="flex items-center justify-between gap-2">
              <p className="font-display text-[12px] uppercase tracking-[0.16em] text-copperSoft">Space Signal</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted/75">
                  {loading ? "Activating" : `Sat over ZM: ${norad?.counts.overZambiaNow ?? 0}`}
                </p>
                <button
                  type="button"
                  onClick={() => setMobileExpanded(true)}
                  className="min-h-11 rounded border border-copper/25 px-3 py-1.5 text-[12px] uppercase tracking-[0.12em] text-copperSoft/90"
                >
                  Open
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-[12px] uppercase tracking-[0.16em] text-copperSoft">Space Signal</p>
                <button
                  type="button"
                  onClick={() => setMobileExpanded(false)}
                  className="min-h-11 rounded border border-copper/25 px-3 py-1.5 text-[12px] uppercase tracking-[0.12em] text-muted/80"
                >
                  Close
                </button>
              </div>
              {loading ? (
                <p className="mt-2 text-[12px] leading-relaxed text-muted/80">
                  Pulling live signal data and orbital tracks now.
                </p>
              ) : (
                <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[12px] text-text/80">
                  <span>ISS: {data.iss.overheadZambia ? "Overhead" : "Not overhead"}</span>
                  <span>{satelliteScope === "region" ? "Near region" : "Sat over ZM"}: {satelliteScope === "region" ? norad?.counts.nearZambiaNow ?? 0 : norad?.counts.overZambiaNow ?? 0}</span>
                  <span>Mars: {Math.round(data.earthMarsDistanceKm / 1_000_000)}M km</span>
                  <span>Archive: {archiveCount}</span>
                </div>
              )}
              <p className="mt-2 text-[11px] uppercase tracking-[0.1em] text-muted/65">
                {loading
                  ? "Observatory feed loading"
                  : "ISS: wheretheiss.at · Sats: CelesTrak/NORAD · EO: NASA feeds"}
              </p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted/75">
                  {loading ? "Loading" : data.sourceStatus === "live" ? "Live" : "Fallback"}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onEnterArchive}
                    className="min-h-11 rounded border border-copper/25 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-muted/80 hover:border-copper/50 hover:text-text"
                  >
                    Archive
                  </button>
                  <button
                    type="button"
                    onClick={onOpenMissionBuilder}
                    className="min-h-11 rounded border border-copper/25 px-3 py-1.5 text-[12px] uppercase tracking-[0.12em] text-copperSoft/90 hover:border-copper/70"
                  >
                    Mission
                  </button>
                </div>
              </div>
            </>
          )}
        </aside>
      )}
    </>
  );
}
