import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

// simple shuffle
function shuffle<T>(arr: T[]): T[] {
  return arr.sort(() => Math.random() - 0.5);
}

const clarifyResearchGoals = async (topic: string): Promise<string[]> => {
  // 👇 question dimensions like your screenshots
  const dimensions = shuffle([
    "specific aspects or subtopics of interest",
    "desired depth or complexity level",
    "intended use case or context",
    "preferred perspective or constraints",
    "practical challenges or concerns",
  ]).slice(0, 4);

  const prompt = `
You are helping a user refine a research topic.

Topic:
"${topic}"

For EACH of the following dimensions, generate ONE clear clarifying question.
Keep the tone neutral and generic, similar to academic or research intake forms.

Dimensions:
${dimensions.map((d, i) => `${i + 1}. ${d}`).join("\n")}

Rules:
- One question per dimension
- Natural wording (do not repeat sentence structure)
- No explanations
`;

  try {
    const { object } = await generateObject({
      model: openrouter("meta-llama/llama-3.1-8b-instruct"),
      temperature: 0.8, // allows wording variation
      prompt,
      schema: z.object({
        questions: z.array(z.string()).length(dimensions.length),
      }),
    });

    return shuffle(object.questions);
  } catch (error) {
    console.error("Error while generating questions:", error);
    return [];
  }
};

export async function POST(req: Request) {
  const { topic } = await req.json();

  const questions = await clarifyResearchGoals(topic);

  return NextResponse.json({
    success: true,
    questions,
  });
}
