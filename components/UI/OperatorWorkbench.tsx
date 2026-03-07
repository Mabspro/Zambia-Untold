"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type OperatorDiagnosticsPayload = {
  ok?: boolean;
  error?: string;
  generatedAt: string;
  count: number;
  items: Array<{
    layer: string;
    label: string;
    endpoint: string;
    ok: boolean;
    sourceStatus: "live" | "fallback" | "error";
    generatedAt: string | null;
    headline: string;
    status: string;
    detail: string;
    coverage: string;
    upstream: string;
    stale: boolean;
    error?: string;
  }>;
};

type ModerationStatsPayload = {
  ok?: boolean;
  error?: string;
  generatedAt: string;
  sourceStatus: "live" | "fallback";
  source: string;
  community: { pending: number; rejected: number; approved: number };
  missions: { pending: number; rejected: number; approved: number };
};

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

type ReviewStatus = "approved" | "rejected" | "pending";
type QueueTarget = "community" | "mission";

const TOKEN_KEY = "zambia-untold:operator-token";

function buildHeaders(token: string) {
  return {
    "x-operator-token": token,
    "x-moderation-token": token,
    authorization: token ? `Bearer ${token}` : "",
  };
}

export function OperatorWorkbench() {
  const [token, setToken] = useState("");
  const [tokenReady, setTokenReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<OperatorDiagnosticsPayload | null>(null);
  const [stats, setStats] = useState<ModerationStatsPayload | null>(null);
  const [communityQueue, setCommunityQueue] = useState<CommunityQueueItem[]>([]);
  const [missionQueue, setMissionQueue] = useState<MissionQueueItem[]>([]);

  const commonHeaders = useMemo(() => buildHeaders(token.trim()), [token]);

  const load = useCallback(async (activeToken = token.trim()) => {
    if (!activeToken) {
      setError("Enter operator token.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const headers = buildHeaders(activeToken);
      const [diagnosticsRes, statsRes, communityRes, missionRes] = await Promise.all([
        fetch("/api/operator/live/diagnostics", { cache: "no-store", headers }),
        fetch("/api/moderation/stats", { cache: "no-store", headers }),
        fetch("/api/moderation/queue?target=community&status=pending&limit=12", { cache: "no-store", headers }),
        fetch("/api/moderation/queue?target=mission&status=pending&limit=12", { cache: "no-store", headers }),
      ]);

      const diagnosticsPayload = (await diagnosticsRes.json()) as OperatorDiagnosticsPayload;
      const statsPayload = (await statsRes.json()) as ModerationStatsPayload;
      const communityPayload = (await communityRes.json()) as ModerationQueuePayload;
      const missionPayload = (await missionRes.json()) as ModerationQueuePayload;

      if (!diagnosticsRes.ok || diagnosticsPayload.ok === false) {
        throw new Error(diagnosticsPayload.error === "unauthorized" ? "Token invalid or missing." : "Could not load operator diagnostics.");
      }
      if (!statsRes.ok || statsPayload.ok === false) {
        throw new Error(statsPayload.error === "unauthorized" ? "Token invalid or missing." : "Could not load moderation counts.");
      }
      if (!communityRes.ok || communityPayload.ok === false) {
        throw new Error(communityPayload.error === "unauthorized" ? "Token invalid or missing." : "Could not load community queue.");
      }
      if (!missionRes.ok || missionPayload.ok === false) {
        throw new Error(missionPayload.error === "unauthorized" ? "Token invalid or missing." : "Could not load mission queue.");
      }

      setDiagnostics(diagnosticsPayload);
      setStats(statsPayload);
      setCommunityQueue((communityPayload.items as CommunityQueueItem[]) ?? []);
      setMissionQueue((missionPayload.items as MissionQueueItem[]) ?? []);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Could not load operator data.");
      setDiagnostics(null);
      setStats(null);
      setCommunityQueue([]);
      setMissionQueue([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

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

  useEffect(() => {
    if (tokenReady && token.trim()) {
      void load(token.trim());
    }
  }, [load, token, tokenReady]);

  const unlock = () => {
    const trimmed = token.trim();
    if (!trimmed) {
      setTokenReady(false);
      setError("Enter operator token.");
      return;
    }
    try {
      window.sessionStorage.setItem(TOKEN_KEY, trimmed);
    } catch {
      // Ignore storage errors.
    }
    setToken(trimmed);
    setTokenReady(true);
    setError(null);
  };

  const clear = () => {
    try {
      window.sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      // Ignore storage errors.
    }
    setToken("");
    setTokenReady(false);
    setDiagnostics(null);
    setStats(null);
    setCommunityQueue([]);
    setMissionQueue([]);
    setActionMessage(null);
  };

  const reviewItem = async (target: QueueTarget, id: number, status: ReviewStatus) => {
    if (!tokenReady || !token.trim()) {
      setError("Enter operator token.");
      return;
    }

    const nextBusyKey = `${target}:${id}:${status}`;
    setBusyKey(nextBusyKey);
    setError(null);
    setActionMessage(null);

    try {
      const response = await fetch("/api/moderation/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...commonHeaders,
        },
        body: JSON.stringify({ target, id, status }),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || payload.ok === false) {
        throw new Error(payload.error === "unauthorized" ? "Token invalid or missing." : "Could not update moderation status.");
      }

      setActionMessage(`${target === "community" ? "Isibalo" : "Mission"} ${id} marked ${status}.`);
      await load(token.trim());
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Could not update moderation status.");
    } finally {
      setBusyKey(null);
    }
  };

  const renderReviewActions = (target: QueueTarget, id: number) => {
    const approveKey = `${target}:${id}:approved`;
    const rejectKey = `${target}:${id}:rejected`;
    const pendingKey = `${target}:${id}:pending`;
    const isBusy = busyKey?.startsWith(`${target}:${id}:`) ?? false;

    return (
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => void reviewItem(target, id, "approved")}
          disabled={isBusy}
          className="rounded border border-copper/35 px-2 py-1 text-[8px] uppercase tracking-[0.1em] text-copperSoft hover:border-copper disabled:opacity-50"
          aria-busy={busyKey === approveKey}
        >
          {busyKey === approveKey ? "Saving" : "Approve"}
        </button>
        <button
          type="button"
          onClick={() => void reviewItem(target, id, "rejected")}
          disabled={isBusy}
          className="rounded border border-[#efb5ad]/30 px-2 py-1 text-[8px] uppercase tracking-[0.1em] text-[#efb5ad] hover:border-[#efb5ad]/60 disabled:opacity-50"
          aria-busy={busyKey === rejectKey}
        >
          {busyKey === rejectKey ? "Saving" : "Reject"}
        </button>
        <button
          type="button"
          onClick={() => void reviewItem(target, id, "pending")}
          disabled={isBusy}
          className="rounded border border-copper/20 px-2 py-1 text-[8px] uppercase tracking-[0.1em] text-muted hover:text-text disabled:opacity-50"
          aria-busy={busyKey === pendingKey}
        >
          {busyKey === pendingKey ? "Saving" : "Reset"}
        </button>
      </div>
    );
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="rounded border border-copper/25 bg-[#0A0806]/92 p-4">
        <p className="font-display text-[12px] uppercase tracking-[0.2em] text-copper">Operator Access</p>
        <p className="mt-2 text-sm leading-relaxed text-[#d8c9b4]">
          Unified internal surface for live layer health, moderation counts, and pending submissions.
        </p>

        <label className="mt-4 block text-[10px] uppercase tracking-[0.14em] text-muted/80">Operator token</label>
        <div className="mt-2 flex gap-2">
          <input
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Paste token"
            className="w-full rounded border border-copper/20 bg-bg/70 px-3 py-2 font-mono text-[12px] text-text"
          />
          <button
            type="button"
            onClick={unlock}
            className="rounded border border-copper/35 px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-copperSoft hover:border-copper"
          >
            Unlock
          </button>
          <button
            type="button"
            onClick={clear}
            className="rounded border border-copper/25 px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-muted/80 hover:text-text"
          >
            Clear
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading || !tokenReady}
            className="rounded border border-copper/30 px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-copperSoft disabled:opacity-50"
          >
            {loading ? "Loading" : "Refresh"}
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-[#efb5ad]">{error}</p>}
        {actionMessage && <p className="mt-3 text-sm text-copperSoft">{actionMessage}</p>}

        {stats && (
          <div className="mt-5 space-y-3">
            <div className="rounded border border-copper/15 bg-bg/50 p-3">
              <p className="text-[11px] uppercase tracking-[0.14em] text-copperSoft">Community</p>
              <p className="mt-2 text-sm text-[#f3e5cf]">Pending: {stats.community.pending}</p>
              <p className="mt-1 text-sm text-muted/80">Rejected: {stats.community.rejected} · Approved: {stats.community.approved}</p>
            </div>
            <div className="rounded border border-copper/15 bg-bg/50 p-3">
              <p className="text-[11px] uppercase tracking-[0.14em] text-copperSoft">Missions</p>
              <p className="mt-2 text-sm text-[#f3e5cf]">Pending: {stats.missions.pending}</p>
              <p className="mt-1 text-sm text-muted/80">Rejected: {stats.missions.rejected} · Approved: {stats.missions.approved}</p>
            </div>
          </div>
        )}
      </aside>

      <section className="grid gap-5">
        <div className="grid gap-5 xl:grid-cols-3">
          {(diagnostics?.items ?? []).map((item) => (
            <article key={item.layer} className="rounded border border-copper/25 bg-[#0A0806]/92 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-[12px] uppercase tracking-[0.18em] text-copper">{item.label}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-muted/70">{item.sourceStatus}</p>
                </div>
                <span className={`rounded border px-2 py-1 text-[10px] uppercase tracking-[0.12em] ${item.ok ? "border-copper/30 text-copperSoft" : "border-[#efb5ad]/40 text-[#efb5ad]"}`}>
                  {item.ok ? (item.stale ? "stale" : "ok") : "error"}
                </span>
              </div>
              <p className="mt-3 text-sm text-[#f3e5cf]">{item.status}</p>
              <p className="mt-1 text-sm text-muted/80">{item.detail}</p>
              <div className="mt-3 border-t border-copper/15 pt-3 text-[11px] uppercase tracking-[0.12em] text-muted/75">
                <p>Coverage: {item.coverage}</p>
                <p className="mt-1">Upstream: {item.upstream}</p>
                <p className="mt-1">Updated: {item.generatedAt ? new Date(item.generatedAt).toLocaleString() : "n/a"}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <section className="rounded border border-copper/25 bg-[#0A0806]/92 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-display text-[12px] uppercase tracking-[0.18em] text-copper">Pending Isibalo</p>
              <span className="text-[11px] uppercase tracking-[0.12em] text-copperSoft">{communityQueue.length}</span>
            </div>
            <div className="mt-3 space-y-2">
              {communityQueue.length > 0 ? communityQueue.map((item) => (
                <article key={item.id} className="rounded border border-copper/15 bg-bg/50 px-3 py-2">
                  <p className="text-sm text-[#f3e5cf]">{item.title}</p>
                  <p className="mt-1 text-sm text-muted/80">{item.placeName || "No place"} · {item.contributorName}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-copperSoft/80">{item.submissionType} · {item.epochZone}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-[8px] uppercase tracking-[0.1em] text-copper/60">
                      ID {item.id} · {new Date(item.submittedAt).toLocaleDateString()}
                    </p>
                    {renderReviewActions("community", item.id)}
                  </div>
                </article>
              )) : <p className="text-sm text-muted/80">No pending community submissions.</p>}
            </div>
          </section>

          <section className="rounded border border-copper/25 bg-[#0A0806]/92 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-display text-[12px] uppercase tracking-[0.18em] text-copper">Pending Missions</p>
              <span className="text-[11px] uppercase tracking-[0.12em] text-copperSoft">{missionQueue.length}</span>
            </div>
            <div className="mt-3 space-y-2">
              {missionQueue.length > 0 ? missionQueue.map((item) => (
                <article key={item.id} className="rounded border border-copper/15 bg-bg/50 px-3 py-2">
                  <p className="text-sm text-[#f3e5cf]">{item.name}</p>
                  <p className="mt-1 text-sm text-muted/80">{item.altitudeKm} km · {item.inclinationDeg}° inclination</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-copperSoft/80">{item.missionType}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-[8px] uppercase tracking-[0.1em] text-copper/60">
                      ID {item.id} · {new Date(item.submittedAt).toLocaleDateString()}
                    </p>
                    {renderReviewActions("mission", item.id)}
                  </div>
                </article>
              )) : <p className="text-sm text-muted/80">No pending mission submissions.</p>}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
