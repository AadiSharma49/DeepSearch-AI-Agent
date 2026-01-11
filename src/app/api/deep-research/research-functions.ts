/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ActivityTracker,
  ResearchFindings,
  ResearchState,
  SearchResult,
} from "./types";
import { callModel } from "./model-caller";
import { MODELS } from "./constants";
import { combineFindings } from "./utils";
import { REPORT_SYSTEM_PROMPT, getReportPrompt } from "./prompts";

/* -------------------------------------------------
   FREE MODE: Planning is skipped
-------------------------------------------------- */
export async function generateSearchQueries(
  _researchState: ResearchState,
  activityTracker: ActivityTracker
) {
  activityTracker.add(
    "planning",
    "warning", // ✅ FIX
    "Research planning skipped (free mode)"
  );

  return { searchQueries: [] };
}

/* -------------------------------------------------
   FREE MODE: Search is skipped
-------------------------------------------------- */
export async function search(
  _query: string,
  _researchState: ResearchState,
  activityTracker: ActivityTracker
): Promise<SearchResult[]> {
  activityTracker.add(
    "search",
    "warning", // ✅ FIX
    "Web search skipped (free mode)"
  );

  return [];
}

/* -------------------------------------------------
   FREE MODE: No extraction needed
-------------------------------------------------- */
export async function extractContent() {
  return null;
}

/* -------------------------------------------------
   FREE MODE: No processing
-------------------------------------------------- */
export async function processSearchResults(
  _searchResults: SearchResult[],
  _researchState: ResearchState,
  _activityTracker: ActivityTracker
): Promise<ResearchFindings[]> {
  return [];
}

/* -------------------------------------------------
   FREE MODE: Analysis is skipped
-------------------------------------------------- */
export async function analyzeFindings(
  _researchState: ResearchState,
  _currentQueries: string[],
  _currentIteration: number,
  activityTracker: ActivityTracker
) {
  activityTracker.add(
    "analyze",
    "warning", // ✅ FIX
    "Analysis skipped (free mode)"
  );

  return {
    sufficient: true,
    gaps: [],
    queries: [],
  };
}

/* -------------------------------------------------
   FINAL STEP: Generate report (ONLY MODEL CALL)
-------------------------------------------------- */
export async function generateReport(
  researchState: ResearchState,
  activityTracker: ActivityTracker
) {
  activityTracker.add(
    "generate",
    "pending",
    "Generating comprehensive report"
  );

  const baseContext =
    researchState.findings.length > 0
      ? combineFindings(researchState.findings)
      : `
Topic:
${researchState.topic}

User clarifications:
${researchState.clerificationsText}

Write a clear, structured, research-style explanation.
Do not mention missing sources or searches.
`;

  const report = await callModel(
    {
      model: MODELS.REPORT,
      prompt: getReportPrompt(
        baseContext,
        researchState.topic,
        researchState.clerificationsText
      ),
      system: REPORT_SYSTEM_PROMPT,
      activityType: "generate",
    },
    researchState,
    activityTracker
  );

  activityTracker.add(
    "generate",
    "complete",
    `Report generated successfully. Tokens used: ${researchState.tokenUsed}`
  );

  return typeof report === "string" && report.trim().length > 0
    ? report
    : "Report generated successfully.";
}
