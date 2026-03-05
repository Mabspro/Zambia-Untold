"use client";

import { useEffect, useMemo, useState } from "react";
import { DATA_ISSUE_EVENT, type DataIssueDetail } from "@/lib/dataIssues";

type DataIssue = DataIssueDetail & { id: string };

export function DataIssueBanner() {
  const [issues, setIssues] = useState<DataIssue[]>([]);

  useEffect(() => {
    const onIssue = (event: Event) => {
      const customEvent = event as CustomEvent<DataIssueDetail>;
      const detail = customEvent.detail;
      if (!detail) return;

      setIssues((prev) => {
        const id = `${detail.source}:${detail.message}`;
        if (prev.some((item) => item.id === id)) return prev;
        return [...prev, { ...detail, id }];
      });
    };

    window.addEventListener(DATA_ISSUE_EVENT, onIssue as EventListener);
    return () => window.removeEventListener(DATA_ISSUE_EVENT, onIssue as EventListener);
  }, []);

  const issueText = useMemo(
    () => issues.map((issue) => `${issue.source}: ${issue.message}`).join(" | "),
    [issues]
  );

  if (!issues.length) return null;

  return (
    <aside className="pointer-events-none absolute bottom-32 left-4 z-20 max-w-[min(90vw,720px)] rounded border border-[#ad3f31]/60 bg-[#2c110f]/90 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[#efb5ad] backdrop-blur md:bottom-40 md:left-7">
      Data Layer Warning: {issueText}
    </aside>
  );
}
