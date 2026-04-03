"use client";

type WhyThisSignalProps = {
  open: boolean;
  onToggle: () => void;
};

export function WhyThisSignal({ open, onToggle }: WhyThisSignalProps) {
  return (
    <div className="rounded border border-copper/20 bg-bg/40">
      <button
        type="button"
        onClick={onToggle}
        className="flex min-h-11 w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-[12px] uppercase tracking-[0.16em] text-copper/85 md:text-[13px]">
          Why am I seeing this?
        </span>
        <span className="font-mono text-[12px] text-muted/75" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="border-t border-copper/15 px-3.5 py-3">
          <p className="text-[12px] leading-relaxed text-muted/85 md:text-[13px]">
            Zambia Untold includes present-day signals because the current era is part of the archive,
            not outside it. The museum starts with deep time, then lets you step into the living country.
          </p>
        </div>
      )}
    </div>
  );
}
