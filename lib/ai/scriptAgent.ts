import OpenAI from "openai";
import type { ScriptGeneratorInput, ScriptGeneratorOutput } from "@/types";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const TONE_INSTRUCTIONS: Record<string, string> = {
  uplifting:    "Use an encouraging, hopeful, and joyful tone that lifts the spirit.",
  reflective:   "Use a calm, meditative tone that invites inner reflection and prayer.",
  instructional: "Use a clear, teaching tone grounded in scripture and biblical truth.",
  urgent:       "Use a passionate, compelling tone that calls listeners to action.",
  devotional:   "Use a warm, intimate devotional tone as if speaking heart-to-heart.",
  celebratory:  "Use a joyful, praise-filled tone celebrating God's goodness.",
};

export async function generateScript(
  input: ScriptGeneratorInput
): Promise<ScriptGeneratorOutput> {
  const {
    topic,
    verseReference,
    theme,
    tone,
    durationMinutes = 3,
  } = input;

  const systemPrompt = `You are the voice of Speaking Saints, a 24/7 Christian audio platform.
Your role is to write natural, compelling Christian radio scripts that sound like a real radio host.
Write conversational, warm, scripture-grounded content. Avoid religious jargon or formulas.
${TONE_INSTRUCTIONS[tone] ?? ""}

STRUCTURE:
1. Opening hook (1-2 sentences that immediately engage the listener)
2. Scripture introduction (weave in the verse naturally)
3. Main message (2-4 paragraphs related to the topic and theme)
4. Application (how listeners can apply this today)
5. Closing prayer or call to action (15-30 seconds when spoken)

TARGET LENGTH: approximately ${durationMinutes} minutes when read aloud at a measured pace.
OUTPUT FORMAT: Return a JSON object with keys: "title" (string), "body" (string), "durationEstimate" (number in seconds).`;

  const userPrompt = `Write a Christian radio script with the following parameters:
Topic: ${topic}
${verseReference ? `Scripture Reference: ${verseReference}` : ""}
${theme ? `Theme: ${theme}` : ""}
Tone: ${tone}
Duration: ${durationMinutes} minutes`;

  const openai = getOpenAI();
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from OpenAI");

  const parsed = JSON.parse(content) as ScriptGeneratorOutput;
  return {
    title: parsed.title ?? `${topic} – Speaking Saints`,
    body: parsed.body ?? "",
    durationEstimate: parsed.durationEstimate ?? durationMinutes * 60,
  };
}
