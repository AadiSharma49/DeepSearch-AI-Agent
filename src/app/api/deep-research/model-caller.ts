import { generateObject, generateText } from "ai";
import { openrouter } from "./services";
import { ActivityTracker, ModelCallOptions, ResearchState } from "./types";

export async function callModel<T>(
  {
    model,
    prompt,
    system,
    schema,
    activityType = "generate",
  }: ModelCallOptions<T>,
  researchState: ResearchState,
  activityTracker: ActivityTracker
): Promise<T | string> {
  try {
    if (schema) {
      const { object, usage } = await generateObject({
        model: openrouter(model),
        prompt,
        system,
        schema,
      });

      researchState.tokenUsed += usage?.totalTokens ?? 0;
      researchState.completedSteps++;

      return object;
    } else {
      const { text, usage } = await generateText({
        model: openrouter(model),
        prompt,
        system,
      });

      researchState.tokenUsed += usage?.totalTokens ?? 0;
      researchState.completedSteps++;

      return text;
    }
  } catch (error) {
    activityTracker.add(
      activityType,
      "error",
      "Model call failed (free mode – no retries)"
    );

    throw error instanceof Error
      ? error
      : new Error("Unknown model error");
  }
}
