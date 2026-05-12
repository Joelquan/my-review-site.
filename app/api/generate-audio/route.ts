export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { generateAudioWithOpenAI, generateAudioWithElevenLabs, type OpenAIVoice } from "@/lib/ai/voiceAgent";
import { uploadAudio } from "@/lib/firebase/storage";
import type { VoiceGeneratorInput } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as VoiceGeneratorInput;

    if (!body.text?.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!body.voiceId) {
      return NextResponse.json({ error: "Voice ID is required" }, { status: 400 });
    }

    const provider = body.provider ?? "openai";
    let audioBuffer: Buffer;

    if (provider === "openai") {
      audioBuffer = await generateAudioWithOpenAI(body.text, body.voiceId as OpenAIVoice);
    } else if (provider === "elevenlabs") {
      audioBuffer = await generateAudioWithElevenLabs(body.text, body.voiceId);
    } else {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }

    const filename = `${body.scriptId ?? "audio"}-${Date.now()}.mp3`;
    const audioUrl = await uploadAudio(audioBuffer, filename);

    return NextResponse.json({ audioUrl, filename });
  } catch (err) {
    console.error("[generate-audio]", err);
    const message = err instanceof Error ? err.message : "Audio generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
