"use client";

import { ReactNode } from "react";

type CanvasWrapperProps = {
  children: ReactNode;
  className?: string;
};

export function CanvasWrapper({ children, className }: CanvasWrapperProps) {
  return (
    <div className={`fixed inset-0 z-0 h-full w-full ${className ?? ""}`}>
      {children}
    </div>
  );
}
