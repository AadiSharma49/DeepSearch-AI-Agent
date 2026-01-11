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
  researchState: ResearchState,
  activityTracker: ActivityTracker
) {
  void researchState;

  activityTracker.add(
    "planning",
    "warning",
    "Research planning skipped (free mode)"
  );

  return { searchQueries: [] };
}

/* -------------------------------------------------
   FREE MODE: Search is skipped
-------------------------------------------------- */
export async function search(
  query: string,
  researchState: ResearchState,
  activityTracker: ActivityTracker
): Promise<SearchResult[]> {
  void query;
  void researchState;

  activityTracker.add(
    "search",
    "warning",
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
  searchResults: SearchResult[],
  researchState: ResearchState,
  activityTracker: ActivityTracker
): Promise<ResearchFindings[]> {
  void searchResults;
  void researchState;
  void activityTracker;

  return [];
}

/* -------------------------------------------------
   FREE MODE: Analysis is skipped
-------------------------------------------------- */
export async function analyzeFindings(
  researchState: ResearchState,
  currentQueries: string[],
  currentIteration: number,
  activityTracker: ActivityTracker
) {
  void researchState;
  void currentQueries;
  void currentIteration;

  activityTracker.add(
    "analyze",
    "warning",
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
