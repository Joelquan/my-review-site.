import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import ProgramSchedule from "@/components/public/ProgramSchedule";
import Card from "@/components/ui/Card";
import { getTodaySchedule } from "@/lib/firebase/firestore";
import { capitalize } from "@/lib/utils";
import type { ScheduleSlot } from "@/types";

export const metadata: Metadata = {
  title: "Schedule",
  description: "Browse the Speaking Saints 24/7 broadcast schedule.",
};

export const revalidate = 300;

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export default async function SchedulePage() {
  let slots: ScheduleSlot[] = [];
  try {
    slots = (await getTodaySchedule()) as ScheduleSlot[];
  } catch {
    slots = [];
  }

  const today = DAYS[new Date().getDay()];

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-950 to-navy-900">
      {/* Header */}
      <section className="py-16 md:py-20 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <CalendarDays className="w-6 h-6 text-gold-400" />
            <span className="text-gold-400 text-sm font-semibold uppercase tracking-widest">Program Guide</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Broadcast Schedule
          </h1>
          <p className="text-navy-200 text-lg max-w-2xl">
            Speaking Saints broadcasts 24 hours a day, 7 days a week. Below is today&apos;s programming schedule.
          </p>
        </div>
      </section>

      {/* Day Tabs */}
      <section className="py-12 md:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {DAYS.map((day) => (
            <div
              key={day}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                day === today
                  ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                  : "bg-navy-800/60 text-navy-400 border border-white/5"
              }`}
            >
              {capitalize(day)}
              {day === today && " (Today)"}
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white capitalize">
            {capitalize(today)}&apos;s Programming
          </h2>
          <p className="text-navy-400 text-sm mt-1">All times shown in your local timezone</p>
        </div>

        <ProgramSchedule slots={slots} showAll />

        {slots.length === 0 && (
          <Card className="p-8 text-center mt-4">
            <CalendarDays className="w-10 h-10 text-gold-500/40 mx-auto mb-3" />
            <p className="text-navy-300">Schedule is being set up. Check back soon.</p>
          </Card>
        )}

        {/* Programming Notes */}
        <Card className="mt-10 p-6 bg-gradient-to-r from-navy-800/50 to-navy-900/50 border-gold-500/20">
          <h3 className="text-white font-bold mb-3">About Our Programming</h3>
          <ul className="space-y-2 text-navy-300 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-gold-400 mt-0.5">•</span>
              All programming is faith-based, scripture-grounded, and family-friendly.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-400 mt-0.5">•</span>
              Programs are AI-generated and reviewed to ensure doctrinal integrity.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-400 mt-0.5">•</span>
              Schedule may vary. Live programming takes priority over recorded content.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-400 mt-0.5">•</span>
              Prayer segments air daily at 6:00 AM, 12:00 PM, and 9:00 PM.
            </li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
