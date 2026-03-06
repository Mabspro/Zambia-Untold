"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type QueueStatus = "pending" | "rejected";
type QueueTarget = "community" | "mission";
type ReviewStatus = "approved" | "rejected" | "pending";

type CommunityQueueItem = {
  id: number;
  title: string;
  submissionType: string;
  epochZone: string;
  placeName: string;
  contributorName: string;
  moderationStatus: string;
  submittedAt: string;
};

type MissionQueueItem = {
  id: number;
  name: string;
  missionType: string;
  altitudeKm: number;
  inclinationDeg: number;
  moderationStatus: string;
  submittedAt: string;
};

type ModerationQueuePayload = {
  ok?: boolean;
  error?: string;
  count: number;
  items: CommunityQueueItem[] | MissionQueueItem[];
};

const TOKEN_KEY = "zambia-untold:moderation-token";

type ModerationConsoleProps = {
  onClose: () => void;
};

export function ModerationConsole({ onClose }: ModerationConsoleProps) {
  const [token, setToken] = useState("");
  const [tokenReady, setTokenReady] = useState(false);
  const [target, setTarget] = useState<QueueTarget>("community");
  const [status, setStatus] = useState<QueueStatus>("pending");
  const [items, setItems] = useState<Array<CommunityQueueItem | MissionQueueItem>>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(TOKEN_KEY);
      if (stored) {
        setToken(stored);
        setTokenReady(true);
      }
    } catch {
      // Ignore storage errors.
    }
  }, []);

  const loadQueue = useCallback(async () => {
    if (!tokenReady || !token.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/moderation/queue?target=${target}&status=${status}&limit=24`, {
        cache: "no-store",
        headers: {
          "x-moderation-token": token.trim(),
        },
      });

      const payload = (await res.json()) as ModerationQueuePayload;
      if (!res.ok || payload.ok === false) {
        setError(payload.error === "unauthorized" ? "Token invalid or missing." : "Could not load moderation queue.");
        setItems([]);
        return;
      }

      setItems(Array.isArray(payload.items) ? payload.items : []);
      setLastSync(new Date().toLocaleTimeString());
    } catch {
      setError("Network error while loading moderation queue.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [tokenReady, token, target, status]);

  useEffect(() => {
    void loadQueue();
  }, [loadQueue]);

  const persistToken = () => {
    const trimmed = token.trim();
    if (!trimmed) {
      setTokenReady(false);
      setError("Enter moderation token.");
      return;
    }
    try {
      window.sessionStorage.setItem(TOKEN_KEY, trimmed);
    } catch {
      // Session storage may be blocked; continue with in-memory token.
    }
    setToken(trimmed);
    setTokenReady(true);
    setError(null);
  };

  const clearToken = () => {
    try {
      window.sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      // Ignore storage errors.
    }
    setToken("");
    setTokenReady(false);
    setItems([]);
  };

  const updateStatus = async (id: number, nextStatus: ReviewStatus) => {
    if (!tokenReady || !token.trim()) {
      setError("Enter moderation token.");
      return;
    }

    setBusyId(id);
    setError(null);

    try {
      const res = await fetch("/api/moderation/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-moderation-token": token.trim(),
        },
        body: JSON.stringify({ target, id, status: nextStatus }),
      });

      const payload = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || payload.ok === false) {
        setError(payload.error === "unauthorized" ? "Token invalid or missing." : "Could not update moderation status.");
        return;
      }

      await loadQueue();
    } catch {
      setError("Network error while updating moderation status.");
    } finally {
      setBusyId(null);
    }
  };

  const queueTitle = useMemo(() => {
    const label = target === "community" ? "Isibalo" : "Missions";
    return `${label} ${status === "pending" ? "Pending" : "Rejected"}`;
  }, [status, target]);

  const isCommunity = target === "community";

  return (
    <motion.aside
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25 }}
      className="fixed bottom-0 left-0 right-0 z-40 h-[72vh] border-t border-copper/30 bg-panel/95 p-4 backdrop-blur-md md:left-auto md:top-0 md:h-full md:w-[36vw] md:max-w-[560px] md:border-l md:border-t-0 md:p-5"
    >
      <div className="flex h-full flex-col">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-[12px] uppercase tracking-[0.2em] text-copper">Moderation Console</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted">Token-gated review workflow</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-copper/35 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-text hover:border-copper"
          >
            Close
          </button>
        </div>

        <div className="rounded border border-copper/20 bg-bg/55 p-2.5">
          <label className="text-[9px] uppercase tracking-[0.14em] text-muted">Moderation token</label>
          <div className="mt-1 flex gap-1.5">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste token"
              className="w-full rounded border border-copper/20 bg-bg/70 px-2 py-1.5 font-mono text-[11px] text-text"
            />
            <button
              type="button"
              onClick={persistToken}
              className="rounded border border-copper/35 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-copperSoft hover:border-copper"
            >
              Unlock
            </button>
            <button
              type="button"
              onClick={clearToken}
              className="rounded border border-copper/25 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-muted hover:text-text"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTarget("community")}
            className={`rounded border px-2 py-1 text-[9px] uppercase tracking-[0.12em] ${
              target === "community" ? "border-copper/50 bg-copper/10 text-copper" : "border-copper/20 text-muted hover:text-text"
            }`}
          >
            Isibalo
          </button>
          <button
            type="button"
            onClick={() => setTarget("mission")}
            className={`rounded border px-2 py-1 text-[9px] uppercase tracking-[0.12em] ${
              target === "mission" ? "border-copper/50 bg-copper/10 text-copper" : "border-copper/20 text-muted hover:text-text"
            }`}
          >
            Missions
          </button>
          <div className="h-3 w-px bg-copper/20" />
          <button
            type="button"
            onClick={() => setStatus("pending")}
            className={`rounded border px-2 py-1 text-[9px] uppercase tracking-[0.12em] ${
              status === "pending" ? "border-copper/50 bg-copper/10 text-copper" : "border-copper/20 text-muted hover:text-text"
            }`}
          >
            Pending
          </button>
          <button
            type="button"
            onClick={() => setStatus("rejected")}
            className={`rounded border px-2 py-1 text-[9px] uppercase tracking-[0.12em] ${
              status === "rejected" ? "border-copper/50 bg-copper/10 text-copper" : "border-copper/20 text-muted hover:text-text"
            }`}
          >
            Rejected
          </button>
          <button
            type="button"
            onClick={() => void loadQueue()}
            className="ml-auto rounded border border-copper/25 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-muted hover:text-text"
          >
            Refresh
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between text-[9px] uppercase tracking-[0.12em] text-muted/70">
          <span>{queueTitle}</span>
          <span>{lastSync ? `Sync ${lastSync}` : "No sync yet"}</span>
        </div>

        {error && <p className="mt-2 text-[10px] text-[#efb5ad]">{error}</p>}

        <div className="mt-2 flex-1 space-y-2 overflow-y-auto pr-1">
          {loading && <p className="text-[10px] uppercase tracking-[0.12em] text-muted">Loading queue...</p>}

          {!loading && items.length === 0 && (
            <p className="text-[10px] uppercase tracking-[0.12em] text-muted">No records in this queue.</p>
          )}

          {items.map((item) => (
            <article key={item.id} className="rounded border border-copper/20 bg-bg/60 px-3 py-2">
              {isCommunity ? (
                <>
                  <p className="text-[12px] text-text">{(item as CommunityQueueItem).title}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted">
                    {(item as CommunityQueueItem).submissionType.replaceAll("_", " ")} · {(item as CommunityQueueItem).epochZone}
                  </p>
                  <p className="mt-1 text-[9px] text-muted/80">
                    {(item as CommunityQueueItem).placeName || "No place"} · {(item as CommunityQueueItem).contributorName}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[12px] text-text">{(item as MissionQueueItem).name}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted">
                    {(item as MissionQueueItem).missionType.replaceAll("-", " ")}
                  </p>
                  <p className="mt-1 text-[9px] text-muted/80">
                    {(item as MissionQueueItem).altitudeKm} km · {(item as MissionQueueItem).inclinationDeg}° inclination
                  </p>
                </>
              )}

              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-[8px] uppercase tracking-[0.1em] text-copper/60">
                  ID {(item as { id: number }).id} · {new Date((item as { submittedAt: string }).submittedAt).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => void updateStatus((item as { id: number }).id, "approved")}
                    disabled={busyId === (item as { id: number }).id}
                    className="rounded border border-copper/35 px-2 py-1 text-[8px] uppercase tracking-[0.1em] text-copperSoft hover:border-copper disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => void updateStatus((item as { id: number }).id, "rejected")}
                    disabled={busyId === (item as { id: number }).id}
                    className="rounded border border-copper/25 px-2 py-1 text-[8px] uppercase tracking-[0.1em] text-muted hover:text-text disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => void updateStatus((item as { id: number }).id, "pending")}
                    disabled={busyId === (item as { id: number }).id}
                    className="rounded border border-copper/20 px-2 py-1 text-[8px] uppercase tracking-[0.1em] text-muted hover:text-text disabled:opacity-50"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
