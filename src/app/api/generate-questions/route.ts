import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

// shuffle helper
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const clarifyResearchGoals = async (topic: string): Promise<string[]> => {
  // Question dimensions (random selection)
  const dimensions = shuffle([
    "specific aspects or subtopics of interest",
    "desired depth or complexity level",
    "intended use case or context",
    "preferred perspective or constraints",
    "practical challenges or concerns",
    "tools, technologies, or platforms involved",
  ]).slice(0, 4);

  const prompt = `
You are an AI assistant helping refine a research topic.

Topic:
"${topic}"

TASK:
Generate ONE clear clarifying question for EACH dimension below.

Dimensions:
${dimensions.map((d, i) => `${i + 1}. ${d}`).join("\n")}

RULES:
- One question per dimension
- Natural, non-repetitive wording
- No explanations
- No extra text
- RETURN ONLY VALID JSON

OUTPUT FORMAT (STRICT):
{
  "questions": ["...", "...", "...", "..."]
}
`;

  try {
    const { object } = await generateObject({
      model: openrouter("meta-llama/llama-3.1-8b-instruct"),
      temperature: 0.4, // ✅ safe randomness
      prompt,
      schema: z.object({
        questions: z.array(z.string()).length(dimensions.length),
      }),
    });

    // shuffle final order for more variation
    return shuffle(object.questions);
  } catch (error) {
    console.error("Question generation failed:", error);

    // ✅ fallback (never break UI)
    return [
      `What specific part of "${topic}" are you most interested in?`,
      `What is your main goal for researching "${topic}"?`,
      `Who is the intended audience for this research?`,
      `Are there any constraints or assumptions to consider?`,
    ];
  }
};

export async function POST(req: Request) {
  const { topic } = await req.json();

  if (!topic || typeof topic !== "string") {
    return NextResponse.json(
      { success: false, error: "Invalid topic" },
      { status: 400 }
    );
  }

  const questions = await clarifyResearchGoals(topic);

  return NextResponse.json({
    success: true,
    questions,
  });
}
