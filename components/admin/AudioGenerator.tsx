"use client";

import { useState, useEffect } from "react";
import { Mic2, Play, Download, Save } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import toast from "react-hot-toast";
import { getCollection, Collections } from "@/lib/firebase/firestore";
import { OPENAI_VOICES } from "@/lib/ai/voiceAgent";
import type { Script, AudioFile } from "@/types";

const PROVIDERS = [
  { value: "openai",      label: "OpenAI TTS" },
  { value: "elevenlabs",  label: "ElevenLabs" },
];

export default function AudioGenerator() {
  const [scripts, setScripts]       = useState<Script[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [provider, setProvider]     = useState("openai");
  const [voiceId, setVoiceId]       = useState("fable");
  const [loading, setLoading]       = useState(false);
  const [audioUrl, setAudioUrl]     = useState<string | null>(null);
  const [saving, setSaving]         = useState(false);

  useEffect(() => {
    getCollection<Script>(Collections.SCRIPTS, [])
      .then((data) => setScripts(data.filter((s) => s.status !== "archived")))
      .catch(() => {});
  }, []);

  const selectedScript = scripts.find((s) => s.id === selectedId);

  async function handleGenerate() {
    if (!selectedScript) return toast.error("Select a script first");
    setLoading(true);
    setAudioUrl(null);

    try {
      const res = await fetch("/api/generate-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scriptId: selectedScript.id,
          text: selectedScript.body,
          voiceId,
          provider,
        }),
      });

      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? "Generation failed");
      }

      const data = await res.json() as { audioUrl: string };
      setAudioUrl(data.audioUrl);
      toast.success("Audio generated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate audio");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!audioUrl || !selectedScript) return;
    setSaving(true);
    try {
      const { createDocument, Collections: C } = await import("@/lib/firebase/firestore");
      const voiceName = OPENAI_VOICES.find((v) => v.id === voiceId)?.label ?? voiceId;
      await createDocument(C.AUDIO, {
        scriptId: selectedScript.id,
        scriptTitle: selectedScript.title,
        voiceId,
        voiceName,
        provider: provider as AudioFile["provider"],
        storageUrl: audioUrl,
        status: "ready",
      });
      toast.success("Saved to audio library!");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const scriptOptions = [
    { value: "", label: "— Select a script —" },
    ...scripts.map((s) => ({ value: s.id, label: s.title })),
  ];

  const voiceOptions = OPENAI_VOICES.map((v) => ({ value: v.id, label: `${v.label} – ${v.description}` }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Config */}
      <Card className="p-6 space-y-5">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          <Mic2 className="w-5 h-5 text-gold-400" /> Audio Generator
        </h2>

        <Select
          label="Select Script"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          options={scriptOptions}
        />

        {selectedScript && (
          <Card className="p-4 bg-navy-900/60">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white text-sm font-semibold">{selectedScript.title}</h3>
              <Badge variant="gold">{selectedScript.tone}</Badge>
            </div>
            <p className="text-navy-400 text-xs line-clamp-3">{selectedScript.body.slice(0, 200)}…</p>
          </Card>
        )}

        <Select
          label="Voice Provider"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          options={PROVIDERS}
        />

        {provider === "openai" && (
          <Select
            label="Voice"
            value={voiceId}
            onChange={(e) => setVoiceId(e.target.value)}
            options={voiceOptions}
          />
        )}

        {provider === "elevenlabs" && (
          <div>
            <label className="text-sm font-medium text-navy-200 block mb-1.5">ElevenLabs Voice ID</label>
            <input
              className="input-field"
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
              placeholder="Paste your ElevenLabs voice ID"
            />
          </div>
        )}

        <Button className="w-full" loading={loading} onClick={handleGenerate}>
          <Mic2 className="w-4 h-4" />
          {loading ? "Generating Audio…" : "Generate Audio"}
        </Button>
      </Card>

      {/* Output */}
      <Card className="p-6 flex flex-col">
        <h2 className="text-white font-bold text-lg mb-5">Generated Audio</h2>

        {!audioUrl && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <Mic2 className="w-12 h-12 text-gold-500/20 mb-3" />
            <p className="text-navy-400 text-sm">
              Select a script, choose a voice, and click &quot;Generate Audio&quot;.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-navy-300 text-sm">Synthesizing audio…</p>
            <p className="text-navy-500 text-xs">This may take 10–30 seconds</p>
          </div>
        )}

        {audioUrl && (
          <div className="flex-1">
            <p className="text-navy-300 text-sm mb-4">
              {selectedScript?.title ?? "Generated audio"}
            </p>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio controls src={audioUrl} className="w-full mb-6 rounded-xl" />
            <div className="flex gap-3">
              <a
                href={audioUrl}
                download={`${selectedScript?.title ?? "audio"}.mp3`}
                className="btn-secondary text-sm flex-1 justify-center"
              >
                <Download className="w-4 h-4" /> Download MP3
              </a>
              <Button size="sm" loading={saving} onClick={handleSave} className="flex-1">
                <Save className="w-4 h-4" /> Save to Library
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
