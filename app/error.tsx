"use client";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6 text-text">
      <div className="w-full max-w-xl rounded border border-copper/35 bg-panel/90 p-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-copperSoft">
          Runtime Error
        </p>
        <h1 className="mt-2 font-display text-2xl text-text">
          The atlas encountered an unexpected failure.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#D0C1AD]">
          Try reloading this view. If the issue persists, check console logs and
          recent data or render changes.
        </p>
        <pre className="mt-4 max-h-40 overflow-auto border border-copper/20 bg-bg/70 p-3 text-xs text-muted">
          {error.message}
        </pre>
        <button
          type="button"
          onClick={reset}
          className="mt-5 rounded border border-copper/40 px-4 py-2 text-xs uppercase tracking-[0.16em] text-text transition-colors hover:border-copper"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
