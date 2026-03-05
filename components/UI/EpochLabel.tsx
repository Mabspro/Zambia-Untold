type EpochLabelProps = {
  label: string;
  leftPercent?: number;
};

export function EpochLabel({ label, leftPercent }: EpochLabelProps) {
  return (
    <div
      className="font-mono pointer-events-none absolute -top-10 left-0 z-50 min-w-[88px] rounded border border-copper/45 bg-bg/95 px-3 py-1.5 text-center text-[11px] font-medium tracking-[0.18em] text-copperSoft shadow-[0_0_20px_rgba(184,115,51,0.2)] backdrop-blur-sm transition-all duration-200"
      style={{
        left:
          leftPercent !== undefined
            ? `clamp(6%, ${leftPercent}%, 94%)`
            : "50%",
        transform: "translate(-50%, 0)",
      }}
    >
      {label}
    </div>
  );
}
