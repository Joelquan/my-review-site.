"use client";

import { useState, useEffect } from "react";
import { FileText, Trash2, CheckCircle, Archive } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ScriptGenerator from "@/components/admin/ScriptGenerator";
import { getCollection, updateDocument, deleteDocument, Collections } from "@/lib/firebase/firestore";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import type { Script } from "@/types";

export default function ScriptsPage() {
  const [scripts, setScripts]   = useState<Script[]>([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState<"generate" | "library">("generate");

  async function fetchScripts() {
    setLoading(true);
    try {
      const data = await getCollection<Script>(Collections.SCRIPTS);
      setScripts(data.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)));
    } catch {
      toast.error("Failed to load scripts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (tab === "library") fetchScripts(); }, [tab]);

  async function updateStatus(id: string, status: Script["status"]) {
    try {
      await updateDocument(Collections.SCRIPTS, id, { status });
      setScripts((prev) => prev.map((s) => s.id === id ? { ...s, status } : s));
      toast.success(`Script ${status}`);
    } catch {
      toast.error("Failed to update");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this script?")) return;
    try {
      await deleteDocument(Collections.SCRIPTS, id);
      setScripts((prev) => prev.filter((s) => s.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Script Generator</h1>
        <p className="text-navy-400 text-sm">Generate AI-powered Christian radio scripts and manage your script library.</p>
      </div>

      {/* Tabs */}
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
            {t === "generate" ? "Generate" : "Script Library"}
          </button>
        ))}
      </div>

      {tab === "generate" && <ScriptGenerator />}

      {tab === "library" && (
        <div>
          {loading ? (
            <div className="text-center py-12 text-navy-400">Loading scripts…</div>
          ) : scripts.length === 0 ? (
            <Card className="p-10 text-center">
              <FileText className="w-10 h-10 text-gold-500/20 mx-auto mb-3" />
              <p className="text-navy-400 text-sm">No scripts yet. Generate your first script.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {scripts.map((script) => (
                <Card key={script.id} className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-white font-semibold text-sm">{script.title}</h3>
                        <Badge variant={script.status === "approved" ? "green" : script.status === "archived" ? "navy" : "gold"}>
                          {script.status}
                        </Badge>
                        <Badge variant="outline">{script.tone}</Badge>
                      </div>
                      <p className="text-navy-400 text-xs mb-2 line-clamp-2">{script.body.slice(0, 180)}…</p>
                      <div className="flex gap-4 text-xs text-navy-500">
                        {script.verseReference && <span>📖 {script.verseReference}</span>}
                        {script.durationEstimate && <span>⏱ ~{Math.round(script.durationEstimate / 60)}m</span>}
                        {script.createdAt && <span>{formatDate(script.createdAt.toDate(), { month: "short", day: "numeric", year: "numeric" })}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {script.status !== "approved" && (
                        <button
                          onClick={() => updateStatus(script.id, "approved")}
                          className="p-2 text-navy-400 hover:text-green-400 transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {script.status !== "archived" && (
                        <button
                          onClick={() => updateStatus(script.id, "archived")}
                          className="p-2 text-navy-400 hover:text-yellow-400 transition-colors"
                          title="Archive"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(script.id)}
                        className="p-2 text-navy-400 hover:text-red-400 transition-colors"
                        title="Delete"
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
      )}
    </div>
  );
}
