import { createDataStreamResponse } from "ai";
import { ResearchState } from "./types";
import { deepResearch } from "./main";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("Messages array is missing");
    }

    const lastMessageContent = messages[messages.length - 1]?.content;
    if (typeof lastMessageContent !== "string") {
      throw new Error("Invalid message content");
    }

    const parsed = JSON.parse(lastMessageContent);

    const topic = parsed.topic;
    const clarifications = parsed.clarifications ?? [];

    if (!topic) {
      throw new Error("Topic is missing");
    }

    return createDataStreamResponse({
      execute: async (dataStream) => {
        const researchState: ResearchState = {
          topic,
          completedSteps: 0,
          tokenUsed: 0,
          findings: [],
          processedUrl: new Set(),
          clerificationsText: JSON.stringify(clarifications),
        };

        await deepResearch(researchState, dataStream);
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Invalid request format",
      }),
      { status: 200 }
    );
  }
}
