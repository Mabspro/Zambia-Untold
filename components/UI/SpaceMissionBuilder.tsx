"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type MissionType = "earth-observation" | "weather" | "communications";

type SpaceMission = {
  id: string;
  name: string;
  missionType: MissionType;
  altitudeKm: number;
  inclinationDeg: number;
  createdAt: string;
  storage?: "supabase" | "local-fallback";
};

const STORAGE_KEY = "zambia-untold:space-missions";

type SpaceMissionBuilderProps = {
  onClose: () => void;
};

export function SpaceMissionBuilder({ onClose }: SpaceMissionBuilderProps) {
  const [name, setName] = useState("");
  const [missionType, setMissionType] = useState<MissionType>("earth-observation");
  const [altitudeKm, setAltitudeKm] = useState(500);
  const [inclinationDeg, setInclinationDeg] = useState(52);
  const [missions, setMissions] = useState<SpaceMission[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as SpaceMission[];
      setMissions(Array.isArray(parsed) ? parsed.slice(0, 12) : []);
    } catch {
      setMissions([]);
    }
  }, []);

  const coverageHint = useMemo(() => {
    if (inclinationDeg < 18) return "Low Zambia coverage";
    if (inclinationDeg < 45) return "Partial Zambia coverage";
    return "Strong Zambia coverage";
  }, [inclinationDeg]);

  const submit = async () => {
    const trimmed = name.trim();
    if (trimmed.length < 3) {
      setSubmitError("Mission name must be at least 3 characters.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    let storageMode: "supabase" | "local-fallback" = "local-fallback";

    try {
      const res = await fetch("/api/space/mission/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmed,
          missionType,
          altitudeKm,
          inclinationDeg,
        }),
      });

      if (res.ok) {
        const payload = (await res.json()) as { storage?: "supabase" | "local-fallback" };
        if (payload.storage === "supabase") {
          storageMode = "supabase";
        }
      }
    } catch {
      storageMode = "local-fallback";
    }

    const mission: SpaceMission = {
      id: `${Date.now()}`,
      name: trimmed,
      missionType,
      altitudeKm,
      inclinationDeg,
      createdAt: new Date().toISOString(),
      storage: storageMode,
    };

    const next = [mission, ...missions].slice(0, 12);
    setMissions(next);

    if (storageMode === "local-fallback") {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        setSubmitError("Proposal saved in session only. Local device storage failed.");
      }
    }

    setName("");
    setSubmitting(false);
  };

  return (
    <motion.aside
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-40 h-[70vh] border-t border-copper/30 bg-panel/95 p-5 backdrop-blur-md md:left-auto md:top-0 md:h-full md:w-[34vw] md:max-w-[520px] md:border-l md:border-t-0"
    >
      <div className="flex h-full flex-col">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="font-display text-[12px] uppercase tracking-[0.2em] text-copper">Build Zambia&apos;s Satellite</p>
            <p className="mt-1 text-[11px] text-muted">Youth mission prototype · moderated archive path active</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-copper/35 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-text hover:border-copper"
          >
            Close
          </button>
        </div>

        <div className="space-y-2 rounded border border-copper/20 bg-bg/55 p-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Mission name"
            className="w-full rounded border border-copper/20 bg-bg/70 px-2 py-1.5 text-[12px] text-text"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={missionType}
              onChange={(e) => setMissionType(e.target.value as MissionType)}
              className="rounded border border-copper/20 bg-bg/70 px-2 py-1.5 text-[11px] uppercase text-text"
            >
              <option value="earth-observation">Earth Observation</option>
              <option value="weather">Weather</option>
              <option value="communications">Communications</option>
            </select>
            <div className="rounded border border-copper/20 bg-bg/70 px-2 py-1.5 text-[11px] text-copperSoft">
              {coverageHint}
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.14em] text-muted">Altitude (km): {altitudeKm}</label>
            <input
              type="range"
              min={350}
              max={1200}
              value={altitudeKm}
              onChange={(e) => setAltitudeKm(Number(e.target.value))}
              className="mt-1 w-full"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.14em] text-muted">Inclination (deg): {inclinationDeg}</label>
            <input
              type="range"
              min={0}
              max={98}
              value={inclinationDeg}
              onChange={(e) => setInclinationDeg(Number(e.target.value))}
              className="mt-1 w-full"
            />
          </div>
          <button
            type="button"
            onClick={() => void submit()}
            disabled={submitting}
            className="w-full rounded border border-copper/35 bg-copper/10 px-2 py-1.5 text-[11px] uppercase tracking-[0.14em] text-copperSoft hover:bg-copper/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Save Mission Proposal"}
          </button>
          {submitError && <p className="text-[10px] text-[#efb5ad]">{submitError}</p>}
        </div>

        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-muted">Recent Proposals</p>
          <div className="space-y-2">
            {missions.map((mission) => (
              <article key={mission.id} className="rounded border border-copper/20 bg-bg/60 px-3 py-2">
                <p className="text-[12px] text-text">{mission.name}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted">
                  {mission.missionType.replace("-", " ")} · {mission.altitudeKm} km · {mission.inclinationDeg}°
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-copper/60">
                  {mission.storage === "supabase" ? "Submitted to moderation queue" : "Saved on this device"}
                </p>
              </article>
            ))}
            {missions.length === 0 && <p className="text-[11px] text-muted">No mission proposals yet.</p>}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
