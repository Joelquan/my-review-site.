import { Clock } from "lucide-react";
import Card from "@/components/ui/Card";
import { formatTime, isCurrentTimeInSlot, cn } from "@/lib/utils";
import type { ScheduleSlot } from "@/types";

interface ProgramScheduleProps {
  slots: ScheduleSlot[];
  showAll?: boolean;
}

const SAMPLE_SLOTS: Partial<ScheduleSlot>[] = [
  { title: "Morning Prayer & Scripture",   startTime: "06:00", endTime: "07:00" },
  { title: "Daily Devotional",             startTime: "07:00", endTime: "08:00" },
  { title: "Faith & Life Teaching",        startTime: "08:00", endTime: "09:30" },
  { title: "Praise & Worship Hour",        startTime: "10:00", endTime: "11:30" },
  { title: "Midday Scripture Reflection",  startTime: "12:00", endTime: "12:30" },
  { title: "Afternoon Encouragement",      startTime: "14:00", endTime: "15:30" },
  { title: "Evening Devotional",           startTime: "18:00", endTime: "19:00" },
  { title: "Night Prayer",                 startTime: "21:00", endTime: "22:00" },
];

export default function ProgramSchedule({ slots, showAll = false }: ProgramScheduleProps) {
  const displaySlots = (slots.length > 0 ? slots : SAMPLE_SLOTS) as ScheduleSlot[];
  const visible = showAll ? displaySlots : displaySlots.slice(0, 5);

  return (
    <div className="space-y-2">
      {visible.map((slot, i) => {
        const isCurrent = isCurrentTimeInSlot(slot.startTime, slot.endTime);
        return (
          <Card
            key={slot.id ?? i}
            className={cn(
              "px-4 py-3 flex items-center gap-4 transition-all duration-200",
              isCurrent
                ? "border-gold-500/50 bg-gold-500/5 shadow-lg shadow-gold-500/10"
                : "hover:border-white/20"
            )}
          >
            <div className="flex-shrink-0 w-20 text-right">
              <span className={cn("text-xs font-semibold", isCurrent ? "text-gold-400" : "text-navy-400")}>
                {formatTime(slot.startTime)}
              </span>
            </div>
            <div className="w-px h-8 bg-white/10 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium truncate", isCurrent ? "text-white" : "text-navy-200")}>
                {slot.title}
              </p>
              {isCurrent && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gold-400" />
                  </span>
                  <span className="text-xs text-gold-400">On Air Now</span>
                </div>
              )}
            </div>
            <div className="flex-shrink-0">
              <span className="text-xs text-navy-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(slot.endTime)}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
