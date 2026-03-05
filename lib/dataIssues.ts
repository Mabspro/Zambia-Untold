export const DATA_ISSUE_EVENT = "atlas:data-issue";

export type DataIssueDetail = {
  source: string;
  message: string;
};

export function reportDataIssue(detail: DataIssueDetail) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent<DataIssueDetail>(DATA_ISSUE_EVENT, { detail }));
}
