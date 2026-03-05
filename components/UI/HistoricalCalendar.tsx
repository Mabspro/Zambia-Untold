"use client";

import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getEventsForMonth,
  getEventsForDay,
  getNearestEvent,
  MONTH_NAMES,
  CATEGORY_META,
  type CalendarEvent,
  type CalendarCategory,
} from "@/data/calendarEvents";
import { ChevronDivider } from "./ChevronDivider";

type HistoricalCalendarProps = {
  onClose: () => void;
  onNavigateToCoordinate?: (lat: number, lng: number, markerId?: string) => void;
};

type ViewMode = "calendar" | "event" | "places";

/** Days in a month (non-leap year — close enough for display). */
function daysInMonth(month: number): number {
  return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] ?? 30;
}

/** Get the day of week (0=Sun) for the 1st of a month. */
function firstDayOfWeek(month: number, year: number): number {
  return new Date(year, month - 1, 1).getDay();
}

function CategoryBadge({ category }: { category: CalendarCategory }) {
  const meta = CATEGORY_META[category];
  return (
    <span
      className="inline-block rounded-sm px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em]"
      style={{
        backgroundColor: `${meta.color}18`,
        color: meta.color,
        border: `1px solid ${meta.color}35`,
      }}
    >
      {meta.label}
    </span>
  );
}

function EventCard({
  event,
  onNavigate,
  expanded = false,
  onExpand,
}: {
  event: CalendarEvent;
  onNavigate?: (lat: number, lng: number, markerId?: string) => void;
  expanded?: boolean;
  onExpand?: () => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="group rounded border border-copper/25 bg-bg/60 transition-colors hover:border-copper/45"
    >
      <button
        type="button"
        onClick={onExpand}
        className="w-full text-left px-4 py-3"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-[10px] text-copperSoft/80">
                {MONTH_NAMES[event.month - 1]?.slice(0, 3)} {event.day}
              </span>
              <CategoryBadge category={event.category} />
              {event.isNationalHoliday && (
                <span className="text-[9px] uppercase tracking-[0.1em] text-copper/80">
                  ★ Holiday
                </span>
              )}
            </div>
            <h3 className="font-display text-[15px] leading-snug text-text group-hover:text-copper transition-colors">
              {event.title}
            </h3>
          </div>
          <span className="mt-1 text-[10px] text-muted shrink-0">
            {expanded ? "▴" : "▾"}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              <p className="text-[13px] text-[#D0C1AD] leading-[1.7]">
                {event.description}
              </p>

              {event.globalContext && (
                <div className="rounded border border-copper/20 bg-copper/5 px-3 py-2.5">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-copperSoft mb-1">
                    Global Context
                  </p>
                  <p className="text-[12px] text-[#C9B89A] leading-relaxed italic">
                    {event.globalContext}
                  </p>
                </div>
              )}

              {event.placeToVisit && (
                <div className="rounded border border-[#5A9A7A]/30 bg-[#5A9A7A]/5 px-3 py-2.5">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[#5A9A7A] mb-1">
                    📍 Place to Visit
                  </p>
                  <p className="text-[13px] text-text font-display">
                    {event.placeToVisit.name}
                  </p>
                  <p className="text-[11px] text-[#B8A58F] leading-relaxed mt-1">
                    {event.placeToVisit.description}
                  </p>
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(
                          event.placeToVisit!.coordinates.lat,
                          event.placeToVisit!.coordinates.lng,
                          event.relatedMarkerId
                        );
                      }}
                      className="mt-2 rounded border border-[#5A9A7A]/40 px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-[#5A9A7A] hover:bg-[#5A9A7A]/10 transition-colors"
                    >
                      View on Globe →
                    </button>
                  )}
                </div>
              )}

              {event.year && (
                <p className="font-mono text-[10px] text-muted">
                  {event.year < 0
                    ? `${Math.abs(event.year).toLocaleString()} BC`
                    : `${event.year} AD`}
                  {event.epochZone && ` · ${event.epochZone}`}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export function HistoricalCalendar({
  onClose,
  onNavigateToCoordinate,
}: HistoricalCalendarProps) {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [categoryFilter, setCategoryFilter] = useState<CalendarCategory | null>(null);

  const monthEvents = useMemo(() => getEventsForMonth(selectedMonth), [selectedMonth]);
  
  const filteredEvents = useMemo(() => {
    let events = selectedDay
      ? getEventsForDay(selectedDay, selectedMonth)
      : monthEvents;
    if (categoryFilter) {
      events = events.filter((e) => e.category === categoryFilter);
    }
    return events;
  }, [selectedDay, selectedMonth, monthEvents, categoryFilter]);

  const todayEvent = useMemo(
    () => getNearestEvent(now.getDate(), now.getMonth() + 1),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Days that have events (for calendar dot indicators)
  const eventDays = useMemo(() => {
    const set = new Set<number>();
    monthEvents.forEach((e) => set.add(e.day));
    return set;
  }, [monthEvents]);

  // Holiday days
  const holidayDays = useMemo(() => {
    const set = new Set<number>();
    monthEvents.filter((e) => e.isNationalHoliday).forEach((e) => set.add(e.day));
    return set;
  }, [monthEvents]);

  const totalDays = daysInMonth(selectedMonth);
  const startDay = firstDayOfWeek(selectedMonth, now.getFullYear());

  // Categories present in this month's events (for filter)
  const availableCategories = useMemo(() => {
    const cats = new Set<CalendarCategory>();
    monthEvents.forEach((e) => cats.add(e.category));
    return [...cats].sort();
  }, [monthEvents]);

  const handleNavigate = useCallback(
    (lat: number, lng: number, markerId?: string) => {
      if (onNavigateToCoordinate) {
        onNavigateToCoordinate(lat, lng, markerId);
      }
    },
    [onNavigateToCoordinate]
  );

  return (
    <motion.aside
      initial={{ opacity: 0, x: "-10%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "-10%", transition: { duration: 0.3 } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-0 left-0 z-40 h-[70vh] w-full border-t border-copper/30 bg-panel/97 backdrop-blur-xl md:top-0 md:h-full md:w-[420px] md:max-w-[440px] md:border-r md:border-t-0 overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="shrink-0 border-b border-copper/20 px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-copperSoft">
              Zambia&apos;s Living Calendar
            </p>
            <h2 className="font-display text-xl text-text mt-1 tracking-wide">
              On This Day
            </h2>
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted mt-1">
              History · Ceremonies · Places · Folklore
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-copper/40 px-2 py-1 text-xs uppercase tracking-[0.16em] text-text hover:border-copper transition-colors"
          >
            Close
          </button>
        </div>

        {/* Today's highlight */}
        {todayEvent && viewMode === "calendar" && (
          <div className="rounded border border-copper/30 bg-copper/8 px-3 py-2.5 mb-4">
            <p className="text-[9px] uppercase tracking-[0.2em] text-copper mb-1">
              Today — {MONTH_NAMES[now.getMonth()]} {now.getDate()}
            </p>
            <p className="font-display text-[13px] text-text leading-snug">
              {todayEvent.title}
            </p>
          </div>
        )}

        {/* View mode tabs */}
        <div className="flex gap-1 border-b border-copper/15 pb-2">
          {(["calendar", "event", "places"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setViewMode(mode);
                if (mode === "calendar") {
                  setSelectedDay(null);
                  setCategoryFilter(null);
                }
              }}
              className={`px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] transition-colors rounded-sm ${
                viewMode === mode
                  ? "bg-copper/15 text-copper border border-copper/30"
                  : "text-muted hover:text-copperSoft border border-transparent"
              }`}
            >
              {mode === "calendar" ? "📅 Calendar" : mode === "event" ? "📜 Events" : "📍 Places"}
            </button>
          ))}
        </div>
      </div>

      {/* Month navigation */}
      <div className="shrink-0 flex items-center justify-between px-5 py-3 border-b border-copper/10">
        <button
          type="button"
          onClick={() => {
            setSelectedMonth((m) => (m === 1 ? 12 : m - 1));
            setSelectedDay(null);
            setExpandedEventId(null);
          }}
          className="text-copperSoft hover:text-copper text-sm px-2 transition-colors"
        >
          ◂
        </button>
        <h3 className="font-display text-[15px] tracking-[0.14em] text-text">
          {MONTH_NAMES[selectedMonth - 1]}
        </h3>
        <button
          type="button"
          onClick={() => {
            setSelectedMonth((m) => (m === 12 ? 1 : m + 1));
            setSelectedDay(null);
            setExpandedEventId(null);
          }}
          className="text-copperSoft hover:text-copper text-sm px-2 transition-colors"
        >
          ▸
        </button>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto calendar-scroll px-5 py-4">
        {viewMode === "calendar" && (
          <div className="space-y-4">
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div
                  key={`${d}-${i}`}
                  className="text-[9px] uppercase tracking-[0.12em] text-muted py-1"
                >
                  {d}
                </div>
              ))}
              {/* Empty cells before month starts */}
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-9" />
              ))}
              {/* Day cells */}
              {Array.from({ length: totalDays }).map((_, i) => {
                const day = i + 1;
                const hasEvent = eventDays.has(day);
                const isHoliday = holidayDays.has(day);
                const isSelected = selectedDay === day;
                const isToday =
                  day === now.getDate() &&
                  selectedMonth === now.getMonth() + 1;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      setSelectedDay(isSelected ? null : day);
                      setExpandedEventId(null);
                      if (hasEvent && !isSelected) setViewMode("event");
                    }}
                    className={`relative h-9 rounded-sm text-[12px] transition-all duration-200 ${
                      isSelected
                        ? "bg-copper/25 text-copper border border-copper/50 font-bold"
                        : isToday
                        ? "bg-copper/10 text-copperSoft border border-copper/25"
                        : hasEvent
                        ? "text-text hover:bg-copper/10 hover:text-copper"
                        : "text-muted/50 hover:text-muted"
                    }`}
                  >
                    {day}
                    {/* Event dot */}
                    {hasEvent && (
                      <span
                        className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full ${
                          isHoliday ? "bg-copper" : "bg-copperSoft/70"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <ChevronDivider />

            {/* Month summary */}
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.18em] text-copperSoft">
                {monthEvents.length} events in {MONTH_NAMES[selectedMonth - 1]}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {availableCategories.map((cat) => {
                  const isActive = categoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategoryFilter(isActive ? null : cat);
                        setViewMode("event");
                      }}
                      className={`transition-colors ${isActive ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
                    >
                      <CategoryBadge category={cat} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick list of month events */}
            <div className="space-y-2 mt-3">
              {monthEvents.slice(0, 5).map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => {
                    setSelectedDay(event.day);
                    setExpandedEventId(event.id);
                    setViewMode("event");
                  }}
                  className="w-full text-left rounded border border-copper/15 bg-bg/40 px-3 py-2 hover:border-copper/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-copperSoft/70 shrink-0 w-8">
                      {event.day}
                    </span>
                    <span className="text-[12px] text-text truncate">
                      {event.title}
                    </span>
                    {event.isNationalHoliday && (
                      <span className="text-[8px] text-copper shrink-0">★</span>
                    )}
                  </div>
                </button>
              ))}
              {monthEvents.length > 5 && (
                <button
                  type="button"
                  onClick={() => setViewMode("event")}
                  className="w-full text-center text-[10px] uppercase tracking-[0.14em] text-copperSoft hover:text-copper py-1 transition-colors"
                >
                  View all {monthEvents.length} events →
                </button>
              )}
            </div>
          </div>
        )}

        {viewMode === "event" && (
          <div className="space-y-3">
            {selectedDay && (
              <div className="flex items-center justify-between mb-2">
                <p className="font-display text-[14px] text-text">
                  {MONTH_NAMES[selectedMonth - 1]} {selectedDay}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDay(null);
                    setCategoryFilter(null);
                  }}
                  className="text-[10px] uppercase tracking-[0.14em] text-muted hover:text-copperSoft transition-colors"
                >
                  Show all
                </button>
              </div>
            )}

            {categoryFilter && (
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted">Filtered:</span>
                  <CategoryBadge category={categoryFilter} />
                </div>
                <button
                  type="button"
                  onClick={() => setCategoryFilter(null)}
                  className="text-[10px] text-muted hover:text-copperSoft transition-colors"
                >
                  Clear
                </button>
              </div>
            )}

            {filteredEvents.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-[13px] text-muted">
                  No events for this {selectedDay ? "day" : "selection"}.
                </p>
                <p className="text-[11px] text-muted/70 mt-1">
                  Try another date or clear filters.
                </p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onNavigate={handleNavigate}
                    expanded={expandedEventId === event.id}
                    onExpand={() =>
                      setExpandedEventId(
                        expandedEventId === event.id ? null : event.id
                      )
                    }
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        )}

        {viewMode === "places" && (
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-copperSoft mb-3">
              Historical Places to Visit in Zambia
            </p>
            {monthEvents
              .filter((e) => e.placeToVisit)
              .map((event) => (
                <motion.article
                  key={event.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded border border-[#5A9A7A]/25 bg-[#5A9A7A]/5 px-4 py-3"
                >
                  <p className="font-display text-[14px] text-text">
                    {event.placeToVisit!.name}
                  </p>
                  <p className="text-[11px] text-[#B8A58F] leading-relaxed mt-1.5">
                    {event.placeToVisit!.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <CategoryBadge category={event.category} />
                    {onNavigateToCoordinate && (
                      <button
                        type="button"
                        onClick={() =>
                          handleNavigate(
                            event.placeToVisit!.coordinates.lat,
                            event.placeToVisit!.coordinates.lng,
                            event.relatedMarkerId
                          )
                        }
                        className="text-[9px] uppercase tracking-[0.14em] text-[#5A9A7A] hover:text-[#7ABFA0] transition-colors"
                      >
                        View on Globe →
                      </button>
                    )}
                  </div>
                </motion.article>
              ))}
            {monthEvents.filter((e) => e.placeToVisit).length === 0 && (
              <p className="text-[12px] text-muted py-4 text-center">
                No places highlighted for {MONTH_NAMES[selectedMonth - 1]}. Try another month.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-copper/15 px-5 py-3 flex items-center justify-between">
        <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted/60">
          Zambia Untold · Living Calendar
        </p>
        <p className="font-mono text-[8px] text-copper/50">
          Isibalo
        </p>
      </div>
    </motion.aside>
  );
}
