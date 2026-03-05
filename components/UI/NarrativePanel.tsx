"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Marker } from "@/data/markers";
import {
  NARRATIVES,
  type Narrative,
  type NarrativeBlock,
  type NarrativeSource,
} from "@/data/narratives";
import { getContextualCardForYear } from "@/data/contextualEpochCards";
import { ExportBriefButton } from "./ExportBriefButton";
import { ChevronDivider } from "./ChevronDivider";

type NarrativePanelProps = {
  marker: Marker | null;
  scrubYear: number;
  contextualCardDismissed?: boolean;
  onClose: () => void;
  onDismissContextualCard?: () => void;
};

type TabId = "story" | "mythology" | "evidence";

function NarrativeBlocks({ blocks }: { blocks: NarrativeBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        if (block.type === "paragraph") {
          return (
            <p key={i} className="font-body text-[15px] text-[#D8C9B4] leading-[1.7]">
              {block.content}
            </p>
          );
        }
        if (block.type === "image") {
          return (
            <figure key={i} className="my-5">
              <div className="relative aspect-video w-full overflow-hidden rounded border border-copper/30 bg-bg/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.src}
                  alt={block.alt ?? ""}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              {block.caption && (
                <figcaption className="font-citation mt-2 text-[11px] italic uppercase tracking-[0.14em] text-muted">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote
              key={i}
              className="font-citation border-l-2 border-copper/50 pl-4 italic text-[#E4D7C5]"
            >
              <p>{block.content}</p>
              {block.attribution && (
                <cite className="font-citation mt-2 block text-[11px] not-italic text-muted">
                  — {block.attribution}
                </cite>
              )}
            </blockquote>
          );
        }
        return null;
      })}
    </div>
  );
}

function HeroImage({ src }: { src: string }) {
  return (
    <div className="relative mb-5 aspect-video w-full overflow-hidden rounded border border-copper/30 bg-bg/50">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).parentElement?.parentElement?.remove();
        }}
      />
    </div>
  );
}

function SourceBadge({ label }: { label: string }) {
  return (
    <span className="rounded border border-copper/30 bg-bg/60 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[#d7c6b0]">
      {label}
    </span>
  );
}

function EvidenceList({ sources }: { sources: NarrativeSource[] }) {
  return (
    <div className="space-y-3">
      {sources.map((source, idx) => (
        <article
          key={`${source.url}-${idx}`}
          className="rounded border border-copper/25 bg-bg/55 p-3"
        >
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-[13px] leading-6 text-[#e6d6c3] underline decoration-copper/35 underline-offset-4 hover:text-text"
          >
            {source.label ?? source.url}
          </a>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {source.year && <SourceBadge label={`${source.year}`} />}
            {source.type && <SourceBadge label={source.type} />}
            {source.region && <SourceBadge label={source.region} />}
            {source.confidence && <SourceBadge label={`${source.confidence} confidence`} />}
          </div>
        </article>
      ))}
    </div>
  );
}

export function NarrativePanel({
  marker,
  scrubYear,
  contextualCardDismissed = false,
  onClose,
  onDismissContextualCard,
}: NarrativePanelProps) {
  const narrative = useMemo(
    () => (marker ? NARRATIVES[marker.id] : null),
    [marker]
  );
  const contextualCard = useMemo(
    () => (!marker ? getContextualCardForYear(scrubYear) : null),
    [marker, scrubYear]
  );
  const [activeTab, setActiveTab] = useState<TabId>("story");
  const showPanel = (marker && narrative) || (contextualCard && !contextualCardDismissed);

  return (
    <AnimatePresence>
      {showPanel && (
        <motion.aside
          initial={{ opacity: 0, x: "10%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "10%", transition: { duration: 0.3 } }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`fixed bottom-0 right-0 z-30 h-[56vh] w-full border-t bg-panel/95 p-5 backdrop-blur-md md:top-0 md:h-full md:w-[35vw] md:max-w-[540px] md:border-l md:border-t-0 md:p-7 block transition-colors duration-500 ${
            contextualCard?.isFinale
              ? "border-copper/65"
              : "border-copper/30"
          }`}
        >
          <div className="flex h-full flex-col">
            {marker && (
              <div
                className="absolute bottom-0 left-0 top-0 w-1"
                style={{ backgroundColor: marker.color }}
              />
            )}
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="border-b border-copper/15 pb-3">
                <p className="text-[11px] uppercase tracking-[0.22em] text-copperSoft">
                  {marker
                    ? marker.tag
                    : contextualCard?.isFinale
                    ? "TERMINAL RECORD"
                    : "CONTEXT"}
                </p>
                <p className="font-mono mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                  {marker ? marker.epochLabel : contextualCard?.zone ?? ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {marker && narrative && (
                  <ExportBriefButton marker={marker} narrative={narrative} />
                )}
                <button
                  type="button"
                  onClick={marker ? onClose : onDismissContextualCard ?? onClose}
                  className="rounded border border-copper/40 px-2 py-1 text-xs uppercase tracking-[0.16em] text-text hover:border-copper transition-colors duration-300"
                >
                  Close
                </button>
              </div>
            </div>

            {marker && narrative ? (
              <>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="font-display text-[1.8rem] leading-tight text-text md:text-[2.05rem]"
                >
                  {marker.headline}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="mt-3 border-l border-copper/35 pl-3 text-sm leading-relaxed text-[#B8A58F]"
                >
                  {marker.subhead}
                </motion.p>

                <div className="mt-4 flex gap-1 border-b border-copper/25 pb-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("story")}
                    className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors ${
                      activeTab === "story"
                        ? "border-b border-copper text-copperSoft"
                        : "text-muted hover:text-text"
                    }`}
                  >
                    Story
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("mythology")}
                    className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors ${
                      activeTab === "mythology"
                        ? "border-b border-copper text-copperSoft"
                        : "text-muted hover:text-text"
                    }`}
                  >
                    Mythology
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("evidence")}
                    className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors ${
                      activeTab === "evidence"
                        ? "border-b border-copper text-copperSoft"
                        : "text-muted hover:text-text"
                    }`}
                  >
                    Evidence
                  </button>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.6 }}
                  className="my-4"
                >
                  <ChevronDivider />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                  className="scrollbar-thin flex-1 overflow-y-auto pr-2"
                >
                  <AnimatePresence mode="wait">
                    {activeTab === "story" && (
                      <motion.div
                        key="story"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm"
                      >
                        {narrative.heroImage && (
                          <HeroImage src={narrative.heroImage} />
                        )}
                        {narrative.blocks ? (
                          <NarrativeBlocks blocks={narrative.blocks} />
                        ) : (
                          narrative.body.split("\n\n").map((paragraph) => (
                            <p key={paragraph} className="mb-4 text-[#D0C1AD] leading-7">
                              {paragraph}
                            </p>
                          ))
                        )}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          className="mt-4"
                        >
                          <p className="font-mono mb-1 text-[9px] uppercase tracking-[0.2em] text-muted">
                            Exhibition Statement
                          </p>
                          <div className="border border-copper/35 bg-bg/70 p-3 text-sm text-[#E4D7C5]">
                            {narrative.cta}
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                    {activeTab === "mythology" && (
                      <motion.div
                        key="mythology"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm"
                      >
                        <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-copperSoft">
                          Inganji · Folk Tales & Mythology
                        </p>
                        <div className="rounded border border-copper/20 bg-copper/5 px-3 py-4 text-center">
                          <p className="text-[13px] text-[#B8A58F] leading-relaxed">
                            Folk tale connections for this site are being prepared.
                          </p>
                          <p className="mt-2 text-[11px] text-muted">
                            Visit{" "}
                            <span className="text-copperSoft">🔥 Inganji</span>{" "}
                            in the action bar to explore oral traditions.
                          </p>
                        </div>
                      </motion.div>
                    )}
                    {activeTab === "evidence" && (
                      <motion.div
                        key="evidence"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm"
                      >
                        <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-copperSoft">
                          Citations & sources
                        </p>
                        {narrative.sources && narrative.sources.length > 0 ? (
                          <EvidenceList sources={narrative.sources} />
                        ) : (
                          <p className="text-[#B8A58F] leading-6">
                            No source metadata is attached to this exhibit yet.
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </>
            ) : contextualCard ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="scrollbar-thin flex-1 overflow-y-auto pr-2"
              >
                <h2
                  className={`font-display leading-tight ${
                    contextualCard.isFinale
                      ? "text-[1.9rem] text-copper md:text-[2.1rem]"
                      : "text-2xl text-text md:text-[2rem]"
                  }`}
                >
                  {contextualCard.title}
                </h2>
                <p className="font-mono mt-3 text-[11px] text-muted uppercase tracking-[0.18em]">
                  {contextualCard.zone}
                </p>
                <ChevronDivider />
                {contextualCard.isFinale ? (
                  <div className="space-y-2">
                    {contextualCard.body.split("\n\n").map((line, i) => {
                      const lines = contextualCard.body.split("\n\n");
                      const isLast = i === lines.length - 1;
                      return (
                        <div
                          key={i}
                          className={`pl-3 py-1 ${
                            isLast
                              ? "border-l-2 border-copper/75 mt-4"
                              : "border-l border-copper/30"
                          }`}
                        >
                          <p
                            className={`leading-7 ${
                              isLast
                                ? "text-[14px] text-copperSoft font-display italic"
                                : "text-[13px] text-[#D0C1AD]"
                            }`}
                          >
                            {line}
                          </p>
                        </div>
                      );
                    })}
                    <div className="mt-5 flex items-center justify-between border border-copper/50 bg-copper/5 px-3 py-2.5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper">
                        CopperCloud · Infrastructure Layer
                      </p>
                      <p className="font-mono text-[10px] text-copper/70">
                        2026 AD ▸
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-[15px] text-[#D8C9B4] leading-[1.7]">
                    {contextualCard.body.split("\n\n").map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : null}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
