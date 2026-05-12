"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, Trash2, Wand2, CheckCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Input, Select } from "@/components/ui/Input";
import { getCollection, createDocument, deleteDocument, Collections } from "@/lib/firebase/firestore";
import { formatTime, isCurrentTimeInSlot } from "@/lib/utils";
import toast from "react-hot-toast";
import type { ScheduleSlot, DayOfWeek } from "@/types";

const DAYS: DayOfWeek[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const REPEATS = [
  { value: "daily",  label: "Every Day" },
  { value: "weekly", label: "Weekly" },
  { value: "once",   label: "One Time" },
];

export default function SchedulePage() {
  const [slots, setSlots]       = useState<ScheduleSlot[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    title: "", dayOfWeek: "monday" as DayOfWeek,
    startTime: "08:00", endTime: "09:00", repeat: "daily" as ScheduleSlot["repeat"],
  });

  async function fetchSlots() {
    setLoading(true);
    try {
      const data = await getCollection<ScheduleSlot>(Collections.SCHEDULE);
      setSlots(data.sort((a, b) => a.startTime.localeCompare(b.startTime)));
    } catch {
      toast.error("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchSlots(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    try {
      const id = await createDocument(Collections.SCHEDULE, { ...form, isActive: true });
      const newSlot: ScheduleSlot = { id, ...form, isActive: true, createdAt: null as never };
      setSlots((prev) => [...prev, newSlot].sort((a, b) => a.startTime.localeCompare(b.startTime)));
      setShowForm(false);
      setForm({ title: "", dayOfWeek: "monday", startTime: "08:00", endTime: "09:00", repeat: "daily" });
      toast.success("Slot added!");
    } catch {
      toast.error("Failed to add slot");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this schedule slot?")) return;
    try {
      await deleteDocument(Collections.SCHEDULE, id);
      setSlots((prev) => prev.filter((s) => s.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  async function handleAutoGenerate() {
    setGenerating(true);
    try {
      const [episodes, scripts, audioFiles] = await Promise.all([
        getCollection(Collections.EPISODES),
        getCollection(Collections.SCRIPTS),
        getCollection(Collections.AUDIO),
      ]);

      const res = await fetch("/api/generate-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodes, scripts, audioFiles,
          date: new Date().toISOString().split("T")[0],
        }),
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json() as { slots: Omit<ScheduleSlot, "id" | "createdAt">[] };

      for (const slot of data.slots) {
        await createDocument(Collections.SCHEDULE, slot);
      }

      toast.success(`${data.slots.length} slots auto-generated!`);
      await fetchSlots();
    } catch {
      toast.error("Auto-generation failed");
    } finally {
      setGenerating(false);
    }
  }

  const todayDay = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  return (
    <div>
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Scheduler</h1>
          <p className="text-navy-400 text-sm">Assign broadcast times and manage the program schedule.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" loading={generating} onClick={handleAutoGenerate}>
            <Wand2 className="w-4 h-4" /> AI Schedule
          </Button>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4" /> Add Slot
          </Button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <Card className="p-5 mb-6 border-gold-500/20">
          <form onSubmit={handleAdd} className="space-y-4">
            <Input label="Program Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Morning Devotional" required />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Select label="Day" value={form.dayOfWeek} onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value as DayOfWeek })} options={DAYS.map((d) => ({ value: d, label: d.charAt(0).toUpperCase() + d.slice(1) }))} />
              <Input label="Start Time" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required />
              <Input label="End Time" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required />
              <Select label="Repeat" value={form.repeat} onChange={(e) => setForm({ ...form, repeat: e.target.value as ScheduleSlot["repeat"] })} options={REPEATS} />
            </div>
            <div className="flex gap-3">
              <Button type="submit"><CheckCircle className="w-4 h-4" /> Add</Button>
              <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Schedule by Day */}
      {loading ? (
        <div className="text-center py-12 text-navy-400">Loading schedule…</div>
      ) : (
        <div className="space-y-6">
          {[...DAYS.filter((d) => d === todayDay), ...DAYS.filter((d) => d !== todayDay)].map((day) => {
            const daySlots = slots.filter((s) => s.dayOfWeek === day || s.repeat === "daily");
            return (
              <div key={day}>
                <h2 className="text-white font-semibold text-sm mb-3 capitalize flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gold-400" />
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                  {day === todayDay && <Badge variant="gold">Today</Badge>}
                </h2>
                {daySlots.length === 0 ? (
                  <Card className="p-4 text-center text-navy-500 text-xs">No slots for this day</Card>
                ) : (
                  <div className="space-y-2">
                    {daySlots.map((slot) => {
                      const isCurrent = day === todayDay && isCurrentTimeInSlot(slot.startTime, slot.endTime);
                      return (
                        <Card
                          key={slot.id}
                          className={`px-4 py-3 flex items-center gap-3 ${isCurrent ? "border-gold-500/50 bg-gold-500/5" : ""}`}
                        >
                          <span className="text-xs font-mono text-navy-400 w-24 flex-shrink-0">
                            {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                          </span>
                          <span className={`flex-1 text-sm font-medium ${isCurrent ? "text-white" : "text-navy-200"}`}>
                            {slot.title}
                          </span>
                          <Badge variant={slot.repeat === "daily" ? "gold" : "navy"}>{slot.repeat}</Badge>
                          {isCurrent && <Badge variant="green">Live</Badge>}
                          <button onClick={() => handleDelete(slot.id)} className="text-navy-500 hover:text-red-400 transition-colors p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
