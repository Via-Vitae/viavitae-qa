// axe-core configuration — WCAG 2.2 AA ruleset, 0 critical violations allowed.
export const axeConfig = {
  runOnly: {
    type: "tag" as const,
    values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"],
  },
  resultTypes: ["violations"] as const,
};

export const MAX_CRITICAL = 0;
export const MAX_SERIOUS = 0;
