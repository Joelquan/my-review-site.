"use client";

import { useEffect, useState } from "react";
import { FileText, Mic2, Calendar, Radio, BookOpen, Heart, MessageSquare, Star, TrendingUp } from "lucide-react";
import Card from "@/components/ui/Card";
import { getCollection, Collections } from "@/lib/firebase/firestore";
import { useStream } from "@/hooks/useStream";

interface Counts {
  scripts: number;
  audio: number;
  schedule: number;
  episodes: number;
  verses: number;
  devotionals: number;
  prayers: number;
  testimonies: number;
}

export default function DashboardPage() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const { metadata: stream } = useStream();

  useEffect(() => {
    async function fetchCounts() {
      const results = await Promise.allSettled([
        getCollection(Collections.SCRIPTS),
        getCollection(Collections.AUDIO),
        getCollection(Collections.SCHEDULE),
        getCollection(Collections.EPISODES),
        getCollection(Collections.VERSES),
        getCollection(Collections.DEVOTIONALS),
        getCollection(Collections.PRAYERS),
        getCollection(Collections.TESTIMONIES),
      ]);

      setCounts({
        scripts:     results[0].status === "fulfilled" ? results[0].value.length : 0,
        audio:       results[1].status === "fulfilled" ? results[1].value.length : 0,
        schedule:    results[2].status === "fulfilled" ? results[2].value.length : 0,
        episodes:    results[3].status === "fulfilled" ? results[3].value.length : 0,
        verses:      results[4].status === "fulfilled" ? results[4].value.length : 0,
        devotionals: results[5].status === "fulfilled" ? results[5].value.length : 0,
        prayers:     results[6].status === "fulfilled" ? results[6].value.length : 0,
        testimonies: results[7].status === "fulfilled" ? results[7].value.length : 0,
      });
    }

    fetchCounts().catch(() => {});
  }, []);

  const STATS = [
    { label: "Scripts",         value: counts?.scripts,     icon: FileText,     color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20" },
    { label: "Audio Files",     value: counts?.audio,       icon: Mic2,         color: "text-purple-400",  bg: "bg-purple-500/10",  border: "border-purple-500/20" },
    { label: "Schedule Slots",  value: counts?.schedule,    icon: Calendar,     color: "text-green-400",   bg: "bg-green-500/10",   border: "border-green-500/20" },
    { label: "Episodes",        value: counts?.episodes,    icon: Radio,        color: "text-gold-400",    bg: "bg-gold-500/10",    border: "border-gold-500/20" },
    { label: "Verses",          value: counts?.verses,      icon: BookOpen,     color: "text-teal-400",    bg: "bg-teal-500/10",    border: "border-teal-500/20" },
    { label: "Devotionals",     value: counts?.devotionals, icon: Star,         color: "text-yellow-400",  bg: "bg-yellow-500/10",  border: "border-yellow-500/20" },
    { label: "Prayer Requests", value: counts?.prayers,     icon: Heart,        color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20" },
    { label: "Testimonies",     value: counts?.testimonies, icon: MessageSquare,color: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/20" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-navy-400 text-sm">Welcome to the Speaking Saints admin panel.</p>
      </div>

      {/* Stream Status */}
      <Card className="p-5 mb-6 flex items-center gap-5 bg-gradient-to-r from-navy-800/80 to-navy-900/80 border-gold-500/20">
        <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
          <Radio className="w-6 h-6 text-gold-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm">Live Stream</p>
          <p className="text-navy-400 text-xs mt-0.5">
            {stream?.nowPlaying?.title ?? "Speaking Saints Live"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {stream?.isLive ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="text-red-400 text-xs font-bold uppercase tracking-wide">On Air</span>
              {(stream?.listenersCount ?? 0) > 0 && (
                <span className="text-navy-400 text-xs ml-1">
                  · {stream?.listenersCount} listeners
                </span>
              )}
            </>
          ) : (
            <span className="text-navy-400 text-xs">Offline</span>
          )}
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ label, value, icon: Icon, color, bg, border }) => (
          <Card key={label} className={`p-5 border ${border} ${bg}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-xl ${bg} border ${border} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">
              {value === undefined ? (
                <span className="inline-block w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              ) : value}
            </p>
            <p className="text-navy-400 text-xs">{label}</p>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gold-400" /> Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: "/admin/scripts",  label: "Generate New Script",  icon: FileText,  desc: "Create AI-powered radio script" },
            { href: "/admin/audio",    label: "Generate Audio",        icon: Mic2,      desc: "Convert script to spoken audio" },
            { href: "/admin/schedule", label: "Manage Schedule",       icon: Calendar,  desc: "Set broadcast times" },
            { href: "/admin/episodes", label: "Manage Episodes",       icon: Radio,     desc: "Publish and edit episodes" },
            { href: "/admin/content",  label: "Add Verse",             icon: BookOpen,  desc: "Add today's scripture" },
            { href: "/admin/content",  label: "Review Prayers",        icon: Heart,     desc: "View pending prayer requests" },
          ].map(({ href, label, icon: Icon, desc }) => (
            <a
              key={label}
              href={href}
              className="card hover:border-gold-500/40 transition-all duration-200 p-4 flex items-center gap-4 group hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold-500/10"
            >
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0 group-hover:border-gold-500/40 transition-colors">
                <Icon className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{label}</p>
                <p className="text-navy-400 text-xs mt-0.5">{desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
