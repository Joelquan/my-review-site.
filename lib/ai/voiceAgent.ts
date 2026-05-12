import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export type OpenAIVoice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";

export const OPENAI_VOICES: { id: OpenAIVoice; label: string; description: string }[] = [
  { id: "alloy",   label: "Alloy",   description: "Neutral, balanced – great for devotionals" },
  { id: "echo",    label: "Echo",    description: "Clear masculine voice – ideal for teaching" },
  { id: "fable",   label: "Fable",   description: "Warm British accent – storytelling & scripture" },
  { id: "onyx",    label: "Onyx",    description: "Deep, authoritative – sermons & announcements" },
  { id: "nova",    label: "Nova",    description: "Friendly feminine – upbeat programming" },
  { id: "shimmer", label: "Shimmer", description: "Soft feminine – prayer & reflection" },
];

export async function generateAudioWithOpenAI(
  text: string,
  voice: OpenAIVoice = "fable"
): Promise<Buffer> {
  const openai = getOpenAI();
  const response = await openai.audio.speech.create({
    model: "tts-1-hd",
    voice,
    input: text,
    response_format: "mp3",
    speed: 0.95,
  });

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function generateAudioWithElevenLabs(
  text: string,
  voiceId: string
): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY not configured");

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.65, similarity_boost: 0.75, style: 0.3 },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs error: ${err}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
