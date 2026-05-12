import OpenAI from "openai";
import type { Episode, Script, AudioFile, ScheduleSlot, DayOfWeek } from "@/types";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

interface SchedulerInput {
  episodes: Episode[];
  scripts: Script[];
  audioFiles: AudioFile[];
  date: string;
}

interface ScheduleProposal {
  slots: Omit<ScheduleSlot, "id" | "createdAt">[];
  notes: string;
}

const TIME_BLOCKS = [
  { label: "Early Morning (5am-8am)",  start: "05:00", end: "08:00", mood: "devotional, reflective" },
  { label: "Morning (8am-12pm)",       start: "08:00", end: "12:00", mood: "uplifting, instructional" },
  { label: "Afternoon (12pm-5pm)",     start: "12:00", end: "17:00", mood: "uplifting, celebratory" },
  { label: "Evening (5pm-9pm)",        start: "17:00", end: "21:00", mood: "devotional, reflective" },
  { label: "Night (9pm-12am)",         start: "21:00", end: "00:00", mood: "prayer, quiet" },
  { label: "Overnight (12am-5am)",     start: "00:00", end: "05:00", mood: "scripture, prayer" },
];

export async function generateDailySchedule(input: SchedulerInput): Promise<ScheduleProposal> {
  const { episodes, scripts, date } = input;
  const dayOfWeek = new Date(date).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase() as DayOfWeek;

  const availableContent = [
    ...episodes
      .filter((e) => e.status === "published")
      .map((e) => `[EPISODE] id:${e.id} title:"${e.title}" duration:${e.duration ?? 180}s`),
    ...scripts
      .filter((s) => s.status === "approved")
      .map((s) => `[SCRIPT] id:${s.id} title:"${s.title}" tone:${s.tone}`),
  ].join("\n");

  const prompt = `You are a Christian radio programming director for Speaking Saints.
Create a balanced daily broadcast schedule for ${date} (${dayOfWeek}).

Available content:
${availableContent || "No content available yet – use placeholder slots."}

Time blocks and appropriate moods:
${TIME_BLOCKS.map((b) => `- ${b.label}: ${b.mood}`).join("\n")}

Rules:
1. Schedule content every 30-60 minutes throughout the day.
2. Match content mood to the time block.
3. Include at least 2 scripture/devotional slots in morning hours.
4. Include a prayer segment around 6am, 12pm, and 9pm.
5. Repeat content as needed to fill a 24-hour schedule.

Return JSON: { "slots": [ { "title": string, "episodeId": string|null, "scriptId": string|null, "dayOfWeek": "${dayOfWeek}", "startTime": "HH:mm", "endTime": "HH:mm", "repeat": "daily"|"weekly"|"once", "isActive": true } ], "notes": string }`;

  const openai = getOpenAI();
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.4,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from scheduler agent");

  return JSON.parse(content) as ScheduleProposal;
}
