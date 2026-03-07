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

type SafeAreaInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

function parseInset(value: string | null | undefined): number {
  if (!value) return 0;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function readSafeAreaInsets(): SafeAreaInsets {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  const styles = window.getComputedStyle(document.documentElement);
  return {
    top: parseInset(styles.getPropertyValue("--safe-area-top")),
    right: parseInset(styles.getPropertyValue("--safe-area-right")),
    bottom: parseInset(styles.getPropertyValue("--safe-area-bottom")),
    left: parseInset(styles.getPropertyValue("--safe-area-left")),
  };
}

function computeSafeLayout(width: number, height: number, insets: SafeAreaInsets): ViewportSafeLayout {
  const isDesktop = width >= 768;
  const compact = height < 760;

  if (isDesktop) {
    return {
      width,
      height,
      isDesktop,
      compact,
      sideInset: 28 + Math.max(insets.left, insets.right),
      topInset: 24 + insets.top,
      bottomInset: 24 + insets.bottom,
      headerTop: 24 + insets.top,
      actionBottom: 28 + insets.bottom,
    };
  }

  const baseSideInset = 12 + Math.max(insets.left, insets.right);
  const baseTopInset = (compact ? 8 : 12) + insets.top;
  const baseBottomInset = (compact ? 12 : 20) + insets.bottom;

  return {
    width,
    height,
    isDesktop,
    compact,
    sideInset: baseSideInset,
    topInset: baseTopInset,
    bottomInset: baseBottomInset,
    headerTop: baseTopInset,
    actionBottom: (compact ? 10 : 18) + insets.bottom,
  };
}

export function useViewportSafeLayout(): ViewportSafeLayout {
  const [layout, setLayout] = useState<ViewportSafeLayout>(() =>
    computeSafeLayout(1366, 768, { top: 0, right: 0, bottom: 0, left: 0 })
  );

  useEffect(() => {
    const onResize = () => {
      const viewport = window.visualViewport;
      const width = Math.round(viewport?.width ?? window.innerWidth);
      const height = Math.round(viewport?.height ?? window.innerHeight);
      setLayout(computeSafeLayout(width, height, readSafeAreaInsets()));
    };

    onResize();
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, []);

  return layout;
}
