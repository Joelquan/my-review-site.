"use client";

import { useState, useEffect } from "react";
import { Mic2, Trash2, Play } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import AudioGenerator from "@/components/admin/AudioGenerator";
import { getCollection, deleteDocument, Collections } from "@/lib/firebase/firestore";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import type { AudioFile } from "@/types";

export default function AudioPage() {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState<"generate" | "library">("generate");

  async function fetchAudio() {
    setLoading(true);
    try {
      const data = await getCollection<AudioFile>(Collections.AUDIO);
      setAudioFiles(data.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)));
    } catch {
      toast.error("Failed to load audio files");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (tab === "library") fetchAudio(); }, [tab]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this audio file?")) return;
    try {
      await deleteDocument(Collections.AUDIO, id);
      setAudioFiles((prev) => prev.filter((a) => a.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Audio Generator</h1>
        <p className="text-navy-400 text-sm">Convert scripts to professional audio using AI voice synthesis.</p>
      </div>

      <div className="flex gap-2 mb-6 bg-navy-800/60 p-1 rounded-2xl border border-white/10 w-fit">
        {(["generate", "library"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 capitalize ${
              tab === t
                ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                : "text-navy-400 hover:text-white"
            }`}
          >
            {t === "generate" ? "Generate" : "Audio Library"}
          </button>
        ))}
      </div>

      {tab === "generate" && <AudioGenerator />}

      {tab === "library" && (
        <div>
          {loading ? (
            <div className="text-center py-12 text-navy-400">Loading…</div>
          ) : audioFiles.length === 0 ? (
            <Card className="p-10 text-center">
              <Mic2 className="w-10 h-10 text-gold-500/20 mx-auto mb-3" />
              <p className="text-navy-400 text-sm">No audio files yet. Generate your first one.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {audioFiles.map((file) => (
                <Card key={file.id} className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-white font-semibold text-sm">{file.scriptTitle}</h3>
                        <Badge variant={file.status === "ready" ? "green" : file.status === "processing" ? "gold" : "red"}>
                          {file.status}
                        </Badge>
                        <Badge variant="navy">{file.voiceName}</Badge>
                        <Badge variant="outline">{file.provider}</Badge>
                      </div>
                      {file.storageUrl && file.status === "ready" && (
                        // eslint-disable-next-line jsx-a11y/media-has-caption
                        <audio controls src={file.storageUrl} className="w-full max-w-md mt-2 rounded-lg" style={{ height: "32px" }} />
                      )}
                      {file.createdAt && (
                        <p className="text-navy-500 text-xs mt-2">
                          {formatDate(file.createdAt.toDate(), { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="p-2 text-navy-400 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
