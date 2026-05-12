"use client";

import { useState, useEffect } from "react";
import { Radio, Plus, Trash2, Eye, EyeOff, Edit3 } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Input, Textarea, Select } from "@/components/ui/Input";
import {
  getCollection,
  createDocument,
  updateDocument,
  deleteDocument,
  Collections,
} from "@/lib/firebase/firestore";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import type { Episode, AudioFile } from "@/types";

export default function EpisodesPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", host: "", theme: "", audioId: "",
    verse: "", verseReference: "", status: "draft" as Episode["status"],
  });

  useEffect(() => {
    Promise.all([
      getCollection<Episode>(Collections.EPISODES),
      getCollection<AudioFile>(Collections.AUDIO),
    ])
      .then(([eps, audio]) => {
        setEpisodes(eps.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)));
        setAudioFiles(audio.filter((a) => a.status === "ready"));
      })
      .catch(() => toast.error("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const audioFile = audioFiles.find((a) => a.id === form.audioId);
      const data: Partial<Episode> = {
        ...form,
        audioUrl: audioFile?.storageUrl,
        publishedAt: form.status === "published" ? null as never : undefined,
      };

      const id = await createDocument(Collections.EPISODES, data as Record<string, unknown>);
      const newEp: Episode = { id, ...data, createdAt: null as never, updatedAt: null as never } as Episode;
      setEpisodes((prev) => [newEp, ...prev]);
      setShowForm(false);
      setForm({ title: "", description: "", host: "", theme: "", audioId: "", verse: "", verseReference: "", status: "draft" });
      toast.success("Episode created!");
    } catch {
      toast.error("Failed to save episode");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(ep: Episode) {
    const newStatus = ep.status === "published" ? "draft" : "published";
    try {
      await updateDocument(Collections.EPISODES, ep.id, { status: newStatus });
      setEpisodes((prev) => prev.map((e) => e.id === ep.id ? { ...e, status: newStatus } : e));
      toast.success(`Episode ${newStatus}`);
    } catch {
      toast.error("Failed to update");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this episode?")) return;
    try {
      await deleteDocument(Collections.EPISODES, id);
      setEpisodes((prev) => prev.filter((e) => e.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  const audioOptions = [
    { value: "", label: "— No audio file —" },
    ...audioFiles.map((a) => ({ value: a.id, label: `${a.scriptTitle} (${a.voiceName})` })),
  ];

  return (
    <div>
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Episodes</h1>
          <p className="text-navy-400 text-sm">Manage, publish, and edit your programming episodes.</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" /> New Episode
        </Button>
      </div>

      {/* New Episode Form */}
      {showForm && (
        <Card className="p-6 mb-6 border-gold-500/20">
          <h2 className="text-white font-bold text-lg mb-4">New Episode</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <Input label="Host" value={form.host} onChange={(e) => setForm({ ...form, host: e.target.value })} placeholder="Speaking Saints" />
            </div>
            <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Theme" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} />
              <Input label="Verse Reference" value={form.verseReference} onChange={(e) => setForm({ ...form, verseReference: e.target.value })} placeholder="John 3:16" />
              <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Episode["status"] })} options={[{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }]} />
            </div>
            <Select label="Audio File" value={form.audioId} onChange={(e) => setForm({ ...form, audioId: e.target.value })} options={audioOptions} />
            <div className="flex gap-3">
              <Button type="submit" loading={saving}>Create Episode</Button>
              <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Episodes List */}
      {loading ? (
        <div className="text-center py-12 text-navy-400">Loading episodes…</div>
      ) : episodes.length === 0 ? (
        <Card className="p-10 text-center">
          <Radio className="w-10 h-10 text-gold-500/20 mx-auto mb-3" />
          <p className="text-navy-400 text-sm">No episodes yet. Create your first episode.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {episodes.map((ep) => (
            <Card key={ep.id} className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-white font-semibold text-sm">{ep.title}</h3>
                    <Badge variant={ep.status === "published" ? "green" : ep.status === "archived" ? "navy" : "gold"}>
                      {ep.status}
                    </Badge>
                  </div>
                  {ep.description && (
                    <p className="text-navy-400 text-xs mb-2 line-clamp-2">{ep.description}</p>
                  )}
                  <div className="flex gap-4 text-xs text-navy-500 flex-wrap">
                    {ep.host && <span>Host: {ep.host}</span>}
                    {ep.theme && <span>Theme: {ep.theme}</span>}
                    {ep.verseReference && <span>📖 {ep.verseReference}</span>}
                    {ep.createdAt && <span>{formatDate(ep.createdAt.toDate(), { month: "short", day: "numeric" })}</span>}
                  </div>
                  {ep.audioUrl && (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <audio controls src={ep.audioUrl} className="w-full max-w-xs mt-2 rounded" style={{ height: "28px" }} />
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => togglePublish(ep)}
                    className={`p-2 transition-colors ${ep.status === "published" ? "text-green-400 hover:text-yellow-400" : "text-navy-400 hover:text-green-400"}`}
                    title={ep.status === "published" ? "Unpublish" : "Publish"}
                  >
                    {ep.status === "published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(ep.id)}
                    className="p-2 text-navy-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
