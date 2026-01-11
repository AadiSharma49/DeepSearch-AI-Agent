import type { DataStreamWriter } from "ai";
import { createActivityTracker } from "./activity-tracker";
import { MAX_ITERATIONS } from "./constants";
import {
  analyzeFindings,
  generateReport,
  generateSearchQueries,
  processSearchResults,
  search,
} from "./research-functions";
import { ResearchState } from "./types";

export async function deepResearch(
  researchState: ResearchState,
  dataStream: DataStreamWriter
) {
  let iteration = 0;

  const activityTracker = createActivityTracker(dataStream, researchState);

  const initialQueries = await generateSearchQueries(
    researchState,
    activityTracker
  );

  let currentQueries = initialQueries.searchQueries;

  while (
    currentQueries &&
    currentQueries.length > 0 &&
    iteration < MAX_ITERATIONS
  ) {
    iteration++;

    const searchResults = await Promise.all(
      currentQueries.map((q) =>
        search(q, researchState, activityTracker)
      )
    );

    const allSearchResults = searchResults.flat();

    const newFindings = await processSearchResults(
      allSearchResults,
      researchState,
      activityTracker
    );

    researchState.findings.push(...newFindings);

    const analysis = await analyzeFindings(
      researchState,
      currentQueries,
      iteration,
      activityTracker
    );

    if (analysis.sufficient) break;

    currentQueries = analysis.queries;
  }

  const report = await generateReport(researchState, activityTracker);

  dataStream.writeData({
    type: "report",
    content: report,
  });
}
