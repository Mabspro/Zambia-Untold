"use client";

import { useEffect, useState } from "react";

export type ViewportSafeLayout = {
  width: number;
  height: number;
  isDesktop: boolean;
  compact: boolean;
  sideInset: number;
  topInset: number;
  bottomInset: number;
  headerTop: number;
  actionBottom: number;
};

function computeSafeLayout(width: number, height: number): ViewportSafeLayout {
  const isDesktop = width >= 768;
  const compact = height < 760;

  if (isDesktop) {
    return {
      width,
      height,
      isDesktop,
      compact,
      sideInset: 28,
      topInset: 24,
      bottomInset: 24,
      headerTop: 24,
      actionBottom: 28,
    };
  }

  return {
    width,
    height,
    isDesktop,
    compact,
    sideInset: 12,
    topInset: compact ? 8 : 12,
    bottomInset: compact ? 12 : 20,
    headerTop: compact ? 8 : 12,
    actionBottom: compact ? 10 : 18,
  };
}

export function useViewportSafeLayout(): ViewportSafeLayout {
  // Keep the first client render identical to SSR to prevent hydration mismatches.
  const [layout, setLayout] = useState<ViewportSafeLayout>(() => computeSafeLayout(1366, 768));

  useEffect(() => {
    const onResize = () => {
      setLayout(computeSafeLayout(window.innerWidth, window.innerHeight));
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return layout;
}


