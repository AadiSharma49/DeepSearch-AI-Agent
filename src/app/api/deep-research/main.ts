import { createActivityTracker } from "./activity-tracker";
import { MAX_ITERATIONS } from "./constants";
import {
  analyzeFindings,
  generateReport,
  generateSearchQueries,
  processSearchResults,
  search,
} from "./research-functions";
import { ResearchState, SearchResult } from "./types";

export async function deepResearch(
  researchState: ResearchState,
  dataStream: { writeData: (data: unknown) => void }
) {
  let iteration = 0;

  const activityTracker = createActivityTracker(dataStream, researchState);

  const initialQueries = await generateSearchQueries(
    researchState,
    activityTracker
  );

  let currentQueries = initialQueries.searchQueries;

  while (
    currentQueries.length > 0 &&
    iteration <= MAX_ITERATIONS
  ) {
    iteration++;

    const searchResults = currentQueries.map((query) =>
      search(query, researchState, activityTracker)
    );

    const responses = await Promise.allSettled(searchResults);

    const allSearchResults = responses
      .filter(
        (
          r
        ): r is PromiseFulfilledResult<SearchResult[]> =>
          r.status === "fulfilled" && r.value.length > 0
      )
      .map((r) => r.value)
      .flat();

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

    currentQueries = analysis.queries.filter(
      (q) => !currentQueries.includes(q)
    );
  }

  const report = await generateReport(
    researchState,
    activityTracker
  );

  dataStream.writeData({
    type: "report",
    content: report,
  });

  return initialQueries;
}
