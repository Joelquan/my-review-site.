export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { generateDailySchedule } from "@/lib/ai/schedulerAgent";
import type { SchedulerInput } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as SchedulerInput;
    const result = await generateDailySchedule(body);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[generate-schedule]", err);
    return NextResponse.json({ error: "Schedule generation failed" }, { status: 500 });
  }
}
