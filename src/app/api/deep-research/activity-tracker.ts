import { Activity, ResearchState } from "./types";

/**
 * Minimal interface for the AI data stream
 * (only what we actually use)
 */
type DataStream = {
  writeData: (data: unknown) => void;
};

export const createActivityTracker = (
  dataStream: DataStream,
  researchState: ResearchState
) => {
  return {
    add: (
      type: Activity["type"],
      status: Activity["status"],
      message: Activity["message"]
    ) => {
      dataStream.writeData({
        type: "activity",
        content: {
          type,
          status,
          message,
          timestamp: Date.now(),
          completedSteps: researchState.completedSteps,
          tokenUsed: researchState.tokenUsed,
        },
      });
    },
  };
};
