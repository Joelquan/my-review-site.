"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, BookOpen, Heart, MessageSquare, Star } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Input, Textarea, Select } from "@/components/ui/Input";
import toast from "react-hot-toast";
import {
  getCollection,
  createDocument,
  deleteDocument,
  Collections,
} from "@/lib/firebase/firestore";

type ContentType = "verses" | "devotionals" | "prayers" | "testimonies";

const TABS: { id: ContentType; label: string; icon: typeof BookOpen }[] = [
  { id: "verses",      label: "Verses",      icon: BookOpen },
  { id: "devotionals", label: "Devotionals", icon: Star },
  { id: "prayers",     label: "Prayers",     icon: Heart },
  { id: "testimonies", label: "Testimonies", icon: MessageSquare },
];

export default function ContentManager() {
  const [activeTab, setActiveTab] = useState<ContentType>("verses");
  const [items, setItems]         = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading]     = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [saving, setSaving]       = useState(false);
  const [form, setForm]           = useState<Record<string, string>>({});

  useEffect(() => {
    setLoading(true);
    setItems([]);
    getCollection(activeTab)
      .then((data) => setItems(data as Record<string, unknown>[]))
      .catch(() => toast.error("Failed to load content"))
      .finally(() => setLoading(false));
  }, [activeTab]);

  function handleFieldChange(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await createDocument(activeTab, form);
      toast.success("Saved!");
      setForm({});
      setShowForm(false);
      const fresh = await getCollection(activeTab);
      setItems(fresh as Record<string, unknown>[]);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    try {
      await deleteDocument(activeTab, id);
      setItems((prev) => prev.filter((item) => (item as { id: string }).id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  const renderForm = () => {
    if (activeTab === "verses") return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Reference" placeholder="John 3:16" value={form.reference ?? ""} onChange={(e) => handleFieldChange("reference", e.target.value)} />
          <Input label="Translation" placeholder="NIV" value={form.translation ?? ""} onChange={(e) => handleFieldChange("translation", e.target.value)} />
        </div>
        <Textarea label="Verse Text" rows={3} value={form.text ?? ""} onChange={(e) => handleFieldChange("text", e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Theme" placeholder="Faith" value={form.theme ?? ""} onChange={(e) => handleFieldChange("theme", e.target.value)} />
          <Input label="Date (YYYY-MM-DD)" placeholder="2025-01-01" value={form.date ?? ""} onChange={(e) => handleFieldChange("date", e.target.value)} />
        </div>
      </div>
    );

    if (activeTab === "devotionals") return (
      <div className="space-y-4">
        <Input label="Title" value={form.title ?? ""} onChange={(e) => handleFieldChange("title", e.target.value)} />
        <Textarea label="Body" rows={6} value={form.body ?? ""} onChange={(e) => handleFieldChange("body", e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Verse" placeholder="John 3:16" value={form.verse ?? ""} onChange={(e) => handleFieldChange("verse", e.target.value)} />
          <Input label="Theme" value={form.theme ?? ""} onChange={(e) => handleFieldChange("theme", e.target.value)} />
        </div>
      </div>
    );

    if (activeTab === "prayers") return (
      <div className="space-y-4">
        <Input label="Name (optional)" value={form.name ?? ""} onChange={(e) => handleFieldChange("name", e.target.value)} />
        <Textarea label="Prayer Request" rows={4} value={form.request ?? ""} onChange={(e) => handleFieldChange("request", e.target.value)} />
        <Select label="Status" value={form.status ?? "pending"} onChange={(e) => handleFieldChange("status", e.target.value)} options={[{ value: "pending", label: "Pending" }, { value: "prayed", label: "Prayed" }, { value: "archived", label: "Archived" }]} />
      </div>
    );

    if (activeTab === "testimonies") return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Name" value={form.name ?? ""} onChange={(e) => handleFieldChange("name", e.target.value)} />
          <Input label="Title" value={form.title ?? ""} onChange={(e) => handleFieldChange("title", e.target.value)} />
        </div>
        <Textarea label="Testimony" rows={6} value={form.body ?? ""} onChange={(e) => handleFieldChange("body", e.target.value)} />
      </div>
    );
  };

  const renderItem = (item: Record<string, unknown>) => {
    const id = item.id as string;
    const primary = (item.title ?? item.reference ?? item.name ?? item.request ?? "Untitled") as string;
    const secondary = (item.text ?? item.body ?? "") as string;
    const status = item.status as string | undefined;

    return (
      <Card key={id} className="p-4 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{primary}</p>
          {secondary && <p className="text-navy-400 text-xs mt-1 line-clamp-2">{secondary}</p>}
          {status && (
            <Badge variant={status === "prayed" ? "green" : status === "archived" ? "navy" : "gold"} className="mt-2">
              {status}
            </Badge>
          )}
        </div>
        <button
          onClick={() => handleDelete(id)}
          className="text-navy-500 hover:text-red-400 transition-colors p-1"
          aria-label="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </Card>
    );
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); setShowForm(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === id
                ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                : "bg-navy-800/60 text-navy-400 border border-white/5 hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-bold text-lg capitalize">{activeTab}</h2>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" /> Add New
        </Button>
      </div>

      {/* Add Form */}
      {showForm && (
        <Card className="p-5 mb-5 border-gold-500/20">
          {renderForm()}
          <div className="flex gap-3 mt-4">
            <Button loading={saving} onClick={handleSave}>
              <Plus className="w-4 h-4" /> Save
            </Button>
            <Button variant="ghost" onClick={() => { setShowForm(false); setForm({}); }}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div className="text-navy-400 text-sm py-8 text-center">Loading…</div>
      ) : items.length === 0 ? (
        <Card className="p-8 text-center text-navy-400 text-sm">
          No {activeTab} yet. Add your first one.
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => renderItem(item))}
        </div>
      )}
    </div>
  );
}
