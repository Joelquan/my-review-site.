export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { generateScript } from "@/lib/ai/scriptAgent";
import type { ScriptGeneratorInput } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ScriptGeneratorInput;

    if (!body.topic?.trim()) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    if (!body.tone) {
      return NextResponse.json({ error: "Tone is required" }, { status: 400 });
    }

    const result = await generateScript(body);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[generate-script]", err);
    const message = err instanceof Error ? err.message : "Script generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
