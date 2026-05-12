"use client";

import { useState } from "react";
import { Wand2, Copy, Save, RotateCcw } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import toast from "react-hot-toast";
import type { ScriptTone } from "@/types";

interface GeneratedScript {
  title: string;
  body: string;
  durationEstimate: number;
}

const TONES: { value: ScriptTone; label: string }[] = [
  { value: "uplifting",    label: "Uplifting" },
  { value: "reflective",   label: "Reflective" },
  { value: "instructional",label: "Instructional" },
  { value: "urgent",       label: "Urgent / Compelling" },
  { value: "devotional",   label: "Devotional" },
  { value: "celebratory",  label: "Celebratory" },
];

const DURATIONS = [
  { value: "2",  label: "~2 minutes" },
  { value: "3",  label: "~3 minutes" },
  { value: "5",  label: "~5 minutes" },
  { value: "10", label: "~10 minutes" },
];

export default function ScriptGenerator() {
  const [topic, setTopic]           = useState("");
  const [verse, setVerse]           = useState("");
  const [theme, setTheme]           = useState("");
  const [tone, setTone]             = useState<ScriptTone>("uplifting");
  const [duration, setDuration]     = useState("3");
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState<GeneratedScript | null>(null);
  const [saving, setSaving]         = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return toast.error("Topic is required");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, verseReference: verse, theme, tone, durationMinutes: Number(duration) }),
      });

      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? "Generation failed");
      }

      const data = await res.json() as GeneratedScript;
      setResult(data);
      toast.success("Script generated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate script");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!result) return;
    setSaving(true);
    try {
      const { createDocument, Collections } = await import("@/lib/firebase/firestore");
      await createDocument(Collections.SCRIPTS, {
        title: result.title,
        topic,
        verseReference: verse || null,
        theme: theme || null,
        tone,
        body: result.body,
        durationEstimate: result.durationEstimate,
        status: "draft",
      });
      toast.success("Script saved to library!");
    } catch {
      toast.error("Failed to save script");
    } finally {
      setSaving(false);
    }
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result.body);
    toast.success("Copied to clipboard");
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Input Form */}
      <Card className="p-6">
        <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-gold-400" /> Script Generator
        </h2>
        <form onSubmit={handleGenerate} className="space-y-4">
          <Input
            label="Topic *"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Finding peace in uncertainty"
            required
          />
          <Input
            label="Scripture Reference"
            value={verse}
            onChange={(e) => setVerse(e.target.value)}
            placeholder="e.g. Philippians 4:6-7"
          />
          <Input
            label="Theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="e.g. Anxiety, Trust, Hope"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Tone"
              value={tone}
              onChange={(e) => setTone(e.target.value as ScriptTone)}
              options={TONES}
            />
            <Select
              label="Duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              options={DURATIONS}
            />
          </div>
          <Button type="submit" loading={loading} className="w-full mt-2">
            <Wand2 className="w-4 h-4" />
            {loading ? "Generating…" : "Generate Script"}
          </Button>
        </form>
      </Card>

      {/* Generated Output */}
      <Card className="p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">Generated Script</h2>
          {result && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4" /> Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setResult(null)}>
                <RotateCcw className="w-4 h-4" /> Clear
              </Button>
              <Button size="sm" loading={saving} onClick={handleSave}>
                <Save className="w-4 h-4" /> Save
              </Button>
            </div>
          )}
        </div>

        {!result && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <Wand2 className="w-12 h-12 text-gold-500/20 mb-3" />
            <p className="text-navy-400 text-sm">
              Fill in the form and click &quot;Generate Script&quot; to create a Christian radio script.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-navy-300 text-sm">Generating your script…</p>
          </div>
        )}

        {result && (
          <div className="flex-1 overflow-y-auto">
            <h3 className="text-gold-400 font-semibold text-base mb-3">{result.title}</h3>
            <div className="mb-3 flex gap-4 text-xs text-navy-400">
              <span>Tone: {tone}</span>
              <span>Est. {Math.round(result.durationEstimate / 60)} min</span>
            </div>
            <Textarea
              value={result.body}
              onChange={(e) => setResult({ ...result, body: e.target.value })}
              rows={20}
              className="text-sm font-mono leading-relaxed"
            />
          </div>
        )}
      </Card>
    </div>
  );
}
