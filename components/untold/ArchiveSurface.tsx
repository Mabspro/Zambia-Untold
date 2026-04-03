"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ContributionForm } from "@/components/UI/ContributionForm";

type ArchiveCommunityItem = {
  id: number;
  title: string;
  content: string;
  submissionType: string;
  placeName: string;
  latitude: number | null;
  longitude: number | null;
  province: string | null;
  epochZone: string;
  submittedAt: string;
};

type ArchiveMissionItem = {
  id: number;
  name: string;
  missionType: string;
  altitudeKm: number;
  inclinationDeg: number;
  submittedAt: string;
};

type ApprovedArchivePayload<TItem> = {
  generatedAt: string;
  sourceStatus: "live" | "fallback";
  source: string;
  count: number;
  items: TItem[];
};

type ArchiveView = "records" | "missions";

const RECORDS_PER_PAGE = 9;
const MISSIONS_PER_PAGE = 8;

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-ZM", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatLabel(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function getExcerpt(content: string): string {
  const normalized = content.replace(/\s+/g, " ").trim();
  if (normalized.length <= 200) return normalized;
  return `${normalized.slice(0, 197).trimEnd()}...`;
}

function SourceBadge({ status }: { status: "live" | "fallback" }) {
  return (
    <span
      className={`rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${
        status === "live"
          ? "border-copper/30 bg-copper/10 text-copperSoft"
          : "border-[#76d7ff]/30 bg-[#76d7ff]/10 text-[#bceeff]"
      }`}
    >
      {status === "live" ? "Live Source" : "Fallback Source"}
    </span>
  );
}

export function ArchiveSurface() {
  const [community, setCommunity] = useState<ApprovedArchivePayload<ArchiveCommunityItem> | null>(null);
  const [missions, setMissions] = useState<ApprovedArchivePayload<ArchiveMissionItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContribution, setShowContribution] = useState(false);
  const [activeView, setActiveView] = useState<ArchiveView>("records");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [epochFilter, setEpochFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [missionTypeFilter, setMissionTypeFilter] = useState("all");
  const [recordsPage, setRecordsPage] = useState(1);
  const [missionsPage, setMissionsPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [communityRes, missionRes] = await Promise.all([
          fetch("/api/community/approved?surface=archive", { cache: "no-store" }),
          fetch("/api/space/mission/approved", { cache: "no-store" }),
        ]);

        const [communityPayload, missionPayload] = await Promise.all([
          communityRes.ok
            ? (communityRes.json() as Promise<ApprovedArchivePayload<ArchiveCommunityItem>>)
            : Promise.resolve({
                generatedAt: new Date().toISOString(),
                sourceStatus: "fallback" as const,
                source: "local",
                count: 0,
                items: [],
              }),
          missionRes.ok
            ? (missionRes.json() as Promise<ApprovedArchivePayload<ArchiveMissionItem>>)
            : Promise.resolve({
                generatedAt: new Date().toISOString(),
                sourceStatus: "fallback" as const,
                source: "local",
                count: 0,
                items: [],
              }),
        ]);

        if (!cancelled) {
          setCommunity(communityPayload);
          setMissions(missionPayload);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setCommunity({
            generatedAt: new Date().toISOString(),
            sourceStatus: "fallback",
            source: "local",
            count: 0,
            items: [],
          });
          setMissions({
            generatedAt: new Date().toISOString(),
            sourceStatus: "fallback",
            source: "local",
            count: 0,
            items: [],
          });
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

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

  const provinceOptions = useMemo(
    () =>
      Array.from(
        new Set((community?.items ?? []).map((item) => item.province).filter((value): value is string => Boolean(value)))
      ).sort((a, b) => a.localeCompare(b)),
    [community]
  );

  const epochOptions = useMemo(
    () =>
      Array.from(new Set((community?.items ?? []).map((item) => item.epochZone))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [community]
  );

  const categoryOptions = useMemo(
    () =>
      Array.from(new Set((community?.items ?? []).map((item) => item.submissionType))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [community]
  );

  const missionTypeOptions = useMemo(
    () =>
      Array.from(new Set((missions?.items ?? []).map((item) => item.missionType))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [missions]
  );

  const filteredRecords = useMemo(() => {
    return (community?.items ?? []).filter((item) => {
      if (provinceFilter !== "all" && item.province !== provinceFilter) return false;
      if (epochFilter !== "all" && item.epochZone !== epochFilter) return false;
      if (categoryFilter !== "all" && item.submissionType !== categoryFilter) return false;
      return true;
    });
  }, [categoryFilter, community, epochFilter, provinceFilter]);

  const filteredMissions = useMemo(() => {
    return (missions?.items ?? []).filter((item) => {
      if (missionTypeFilter !== "all" && item.missionType !== missionTypeFilter) return false;
      return true;
    });
  }, [missionTypeFilter, missions]);

  const recordPageCount = Math.max(1, Math.ceil(filteredRecords.length / RECORDS_PER_PAGE));
  const missionPageCount = Math.max(1, Math.ceil(filteredMissions.length / MISSIONS_PER_PAGE));

  const pagedRecords = useMemo(() => {
    const start = (recordsPage - 1) * RECORDS_PER_PAGE;
    return filteredRecords.slice(start, start + RECORDS_PER_PAGE);
  }, [filteredRecords, recordsPage]);

  const pagedMissions = useMemo(() => {
    const start = (missionsPage - 1) * MISSIONS_PER_PAGE;
    return filteredMissions.slice(start, start + MISSIONS_PER_PAGE);
  }, [filteredMissions, missionsPage]);

  useEffect(() => {
    setRecordsPage(1);
  }, [provinceFilter, epochFilter, categoryFilter]);

  useEffect(() => {
    setMissionsPage(1);
  }, [missionTypeFilter]);

  const totalApproved = (community?.count ?? 0) + (missions?.count ?? 0);
  const archiveEmpty = !loading && totalApproved === 0;

  return (
    <>
      <main className="route-scroll-surface relative isolate min-h-screen bg-[#050608] text-[#eadbc4]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(184,115,51,0.12),_transparent_38%),linear-gradient(180deg,_rgba(6,7,9,0.92),_rgba(3,4,6,0.98))]" />
        <div className="relative mx-auto max-w-7xl px-4 py-5 md:px-8 md:py-10">
          <div className="flex flex-col gap-5 md:gap-8">
            <header className="rounded border border-copper/25 bg-[#0b0907]/82 px-4 py-4 backdrop-blur-md md:px-7 md:py-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="max-w-3xl">
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-copperSoft/80">
                    Isibalo Archive
                  </p>
                  <h1 className="mt-2 font-display text-4xl tracking-[0.16em] text-copper md:text-5xl">
                    Approved Memory, Read First
                  </h1>
                  <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#d8c9b4] md:text-[17px]">
                    The archive is where Zambia narrates itself from within: approved community memory,
                    mission ideas, and placed records that belong to the national story.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/"
                    className="min-h-11 rounded border border-copper/30 px-4 py-2 text-[12px] uppercase tracking-[0.14em] text-copperSoft transition-colors hover:border-copper hover:text-copper"
                  >
                    Return to Museum
                  </Link>
                  <SourceBadge status={community?.sourceStatus ?? "fallback"} />
                  <SourceBadge status={missions?.sourceStatus ?? "fallback"} />
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded border border-copper/18 bg-black/20 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-copper/75">Approved Isibalo</p>
                  <p className="mt-2 font-display text-3xl text-[#f0dfc3]">{community?.count ?? 0}</p>
                  <p className="mt-1 text-[12px] leading-6 text-muted">
                    Moderated records shown read-only before contribution.
                  </p>
                </div>
                <div className="rounded border border-copper/18 bg-black/20 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-copper/75">Approved Missions</p>
                  <p className="mt-2 font-display text-3xl text-[#f0dfc3]">{missions?.count ?? 0}</p>
                  <p className="mt-1 text-[12px] leading-6 text-muted">
                    Mission tracks stay visible as part of the living archive.
                  </p>
                </div>
                <div className="rounded border border-copper/18 bg-black/20 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-copper/75">Archive Promise</p>
                  <p className="mt-2 text-[14px] leading-7 text-[#d8c9b4]">
                    Browse first. Contribute second. Everything here is approved before it becomes public.
                  </p>
                </div>
              </div>
            </header>

            <section className="rounded border border-copper/22 bg-[#0b0907]/76 px-5 py-5 backdrop-blur-sm md:px-7 md:py-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="font-display text-[12px] uppercase tracking-[0.22em] text-copperSoft">
                    Browse the Record
                  </p>
                  <p className="mt-2 max-w-2xl text-[14px] leading-7 text-muted md:text-[15px]">
                    Use the filters to move through approved archive records and mission tracks
                    without leaving the museum narrative behind.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveView("records")}
                    className={`min-h-11 rounded border px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition-colors ${
                      activeView === "records"
                        ? "border-copper/45 bg-copper/12 text-copper"
                        : "border-copper/20 text-copperSoft hover:border-copper/35"
                    }`}
                  >
                    Isibalo Records
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView("missions")}
                    className={`min-h-11 rounded border px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition-colors ${
                      activeView === "missions"
                        ? "border-copper/45 bg-copper/12 text-copper"
                        : "border-copper/20 text-copperSoft hover:border-copper/35"
                    }`}
                  >
                    Mission Tracks
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="mt-6 rounded border border-copper/18 bg-black/15 px-4 py-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-copperSoft">
                    Loading approved archive surface...
                  </p>
                  <p className="mt-2 text-[14px] leading-7 text-muted">
                    Pulling approved records and mission tracks from the shared archive.
                  </p>
                </div>
              ) : archiveEmpty ? (
                <div className="mt-6 rounded border border-copper/18 bg-black/15 px-4 py-6">
                  <p className="font-display text-[18px] text-[#f0dfc3]">The public archive is still being seeded.</p>
                  <p className="mt-2 max-w-2xl text-[14px] leading-7 text-muted">
                    There are no approved public records yet. That is okay. This surface will open up as
                    moderated Isibalo contributions and mission tracks are approved.
                  </p>
                </div>
              ) : activeView === "records" ? (
                <>
                  <div className="mt-6 grid gap-3 md:grid-cols-4">
                    <label className="block">
                      <span className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-copperSoft">
                        Province
                      </span>
                      <select
                        value={provinceFilter}
                        onChange={(event) => setProvinceFilter(event.target.value)}
                        className="min-h-11 w-full rounded border border-copper/20 bg-black/20 px-3 text-[14px] text-text focus:border-copper/45 focus:outline-none"
                      >
                        <option value="all">All provinces</option>
                        {provinceOptions.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-copperSoft">
                        Epoch
                      </span>
                      <select
                        value={epochFilter}
                        onChange={(event) => setEpochFilter(event.target.value)}
                        className="min-h-11 w-full rounded border border-copper/20 bg-black/20 px-3 text-[14px] text-text focus:border-copper/45 focus:outline-none"
                      >
                        <option value="all">All eras</option>
                        {epochOptions.map((epoch) => (
                          <option key={epoch} value={epoch}>
                            {formatLabel(epoch)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-copperSoft">
                        Category
                      </span>
                      <select
                        value={categoryFilter}
                        onChange={(event) => setCategoryFilter(event.target.value)}
                        className="min-h-11 w-full rounded border border-copper/20 bg-black/20 px-3 text-[14px] text-text focus:border-copper/45 focus:outline-none"
                      >
                        <option value="all">All categories</option>
                        {categoryOptions.map((category) => (
                          <option key={category} value={category}>
                            {formatLabel(category)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="rounded border border-copper/14 bg-black/15 px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-copperSoft">Visible records</p>
                      <p className="mt-2 font-display text-3xl text-[#f0dfc3]">{filteredRecords.length}</p>
                    </div>
                  </div>

                  {filteredRecords.length === 0 ? (
                    <div className="mt-6 rounded border border-copper/18 bg-black/15 px-4 py-6">
                      <p className="font-display text-[18px] text-[#f0dfc3]">No approved records match this view.</p>
                      <p className="mt-2 text-[14px] leading-7 text-muted">
                        Try widening the province, era, or category filters to see the archive again.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mt-6 grid gap-4 lg:grid-cols-3">
                        {pagedRecords.map((item) => (
                          <article
                            key={item.id}
                            className="rounded border border-copper/18 bg-black/15 px-4 py-4 transition-colors hover:border-copper/30"
                          >
                            <div className="flex flex-wrap gap-2">
                              <span className="rounded border border-copper/18 bg-copper/6 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-copperSoft">
                                {formatLabel(item.submissionType)}
                              </span>
                              <span className="rounded border border-copper/18 bg-copper/6 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-copperSoft">
                                {formatLabel(item.epochZone)}
                              </span>
                            </div>
                            <h2 className="mt-3 font-display text-[22px] leading-8 text-[#f0dfc3]">
                              {item.title}
                            </h2>
                            <p className="mt-2 text-[14px] leading-7 text-[#d8c9b4]">
                              {getExcerpt(item.content)}
                            </p>
                            <div className="mt-4 space-y-1.5 text-[12px] uppercase tracking-[0.14em] text-muted">
                              <p>{item.placeName || "Place withheld"}{item.province ? ` · ${item.province}` : ""}</p>
                              <p>Approved record · {formatDate(item.submittedAt)}</p>
                            </div>
                          </article>
                        ))}
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-3">
                        <p className="text-[12px] uppercase tracking-[0.14em] text-muted">
                          Page {recordsPage} of {recordPageCount}
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setRecordsPage((page) => Math.max(1, page - 1))}
                            disabled={recordsPage === 1}
                            className="min-h-10 rounded border border-copper/20 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-copperSoft disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            Previous
                          </button>
                          <button
                            type="button"
                            onClick={() => setRecordsPage((page) => Math.min(recordPageCount, page + 1))}
                            disabled={recordsPage === recordPageCount}
                            className="min-h-10 rounded border border-copper/20 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-copperSoft disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="mt-6 grid gap-3 md:grid-cols-[minmax(0,280px)_1fr]">
                    <label className="block">
                      <span className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-copperSoft">
                        Mission type
                      </span>
                      <select
                        value={missionTypeFilter}
                        onChange={(event) => setMissionTypeFilter(event.target.value)}
                        className="min-h-11 w-full rounded border border-copper/20 bg-black/20 px-3 text-[14px] text-text focus:border-copper/45 focus:outline-none"
                      >
                        <option value="all">All mission types</option>
                        {missionTypeOptions.map((missionType) => (
                          <option key={missionType} value={missionType}>
                            {formatLabel(missionType)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="rounded border border-copper/14 bg-black/15 px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-copperSoft">Visible mission tracks</p>
                      <p className="mt-2 font-display text-3xl text-[#f0dfc3]">{filteredMissions.length}</p>
                    </div>
                  </div>

                  {filteredMissions.length === 0 ? (
                    <div className="mt-6 rounded border border-copper/18 bg-black/15 px-4 py-6">
                      <p className="font-display text-[18px] text-[#f0dfc3]">No approved mission tracks match this view.</p>
                      <p className="mt-2 text-[14px] leading-7 text-muted">
                        Try widening the mission type filter to restore the archive set.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mt-6 grid gap-4 lg:grid-cols-2">
                        {pagedMissions.map((item) => (
                          <article
                            key={item.id}
                            className="rounded border border-copper/18 bg-black/15 px-4 py-4 transition-colors hover:border-copper/30"
                          >
                            <div className="flex flex-wrap gap-2">
                              <span className="rounded border border-copper/18 bg-copper/6 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-copperSoft">
                                {formatLabel(item.missionType)}
                              </span>
                              <span className="rounded border border-copper/18 bg-copper/6 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-copperSoft">
                                Approved
                              </span>
                            </div>
                            <h2 className="mt-3 font-display text-[22px] leading-8 text-[#f0dfc3]">
                              {item.name}
                            </h2>
                            <div className="mt-3 grid gap-2 text-[13px] leading-7 text-[#d8c9b4] sm:grid-cols-2">
                              <p>Altitude: {Math.round(item.altitudeKm)} km</p>
                              <p>Inclination: {Math.round(item.inclinationDeg)}°</p>
                              <p className="sm:col-span-2">Submitted: {formatDate(item.submittedAt)}</p>
                            </div>
                          </article>
                        ))}
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-3">
                        <p className="text-[12px] uppercase tracking-[0.14em] text-muted">
                          Page {missionsPage} of {missionPageCount}
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setMissionsPage((page) => Math.max(1, page - 1))}
                            disabled={missionsPage === 1}
                            className="min-h-10 rounded border border-copper/20 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-copperSoft disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            Previous
                          </button>
                          <button
                            type="button"
                            onClick={() => setMissionsPage((page) => Math.min(missionPageCount, page + 1))}
                            disabled={missionsPage === missionPageCount}
                            className="min-h-10 rounded border border-copper/20 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-copperSoft disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </section>

            <section className="rounded border border-copper/22 bg-[#0b0907]/76 px-5 py-5 backdrop-blur-sm md:px-7 md:py-6">
              <p className="font-display text-[12px] uppercase tracking-[0.22em] text-copperSoft">
                Contribute After Browsing
              </p>
              <h2 className="mt-2 font-display text-3xl text-copper">Add Your Record Carefully</h2>
              <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#d8c9b4]">
                This archive is read-only on entry by design. After you have seen what already exists,
                you can add a memory, oral tradition, photograph, or family history for moderation review.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setShowContribution(true)}
                  className="min-h-11 rounded border border-copper/35 bg-copper/10 px-4 py-2 text-[12px] uppercase tracking-[0.16em] text-copper transition-colors hover:border-copper hover:bg-copper/15"
                >
                  Add a Record
                </button>
                <Link
                  href="/"
                  className="min-h-11 rounded border border-copper/20 px-4 py-2 text-[12px] uppercase tracking-[0.16em] text-copperSoft transition-colors hover:border-copper/35 hover:text-copper"
                >
                  Return to the Globe
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      {showContribution && <ContributionForm onClose={() => setShowContribution(false)} />}
    </>
  );
}
