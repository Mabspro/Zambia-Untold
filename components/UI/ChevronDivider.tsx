"use client";

/**
 * Mwela-inspired chevron / nested diamond section divider.
 * Reference: Appearance-Context.md — Luangwa Valley geometric rock art.
 */

export function ChevronDivider() {
  return (
    <div className="my-5 flex items-center justify-center gap-1 py-1" aria-hidden>
      <svg
        width="48"
        height="8"
        viewBox="0 0 48 8"
        fill="none"
        className="text-copper/40"
      >
        <path
          d="M2 4L6 1L10 4L6 7L2 4Z M14 4L18 1L22 4L18 7L14 4Z M26 4L30 1L34 4L30 7L26 4Z M38 4L42 1L46 4L42 7L38 4Z"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
        />
      </svg>
    </div>
  );
}
