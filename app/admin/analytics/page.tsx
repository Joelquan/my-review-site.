"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Users, Clock, Radio } from "lucide-react";
import Card from "@/components/ui/Card";
import { useStream } from "@/hooks/useStream";
import { getCollection, Collections } from "@/lib/firebase/firestore";
import type { AnalyticsRecord } from "@/types";

export default function AnalyticsPage() {
  const { metadata: stream } = useStream();
  const [records, setRecords] = useState<AnalyticsRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCollection<AnalyticsRecord>(Collections.ANALYTICS)
      .then((data) => setRecords(data.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalListeners = records.reduce((sum, r) => sum + r.listenerCount, 0);
  const totalMinutes   = records.reduce((sum, r) => sum + r.totalStreamMinutes, 0);
  const peakListeners  = Math.max(...records.map((r) => r.peakListeners), 0);
  const avgListeners   = records.length > 0 ? Math.round(totalListeners / records.length) : 0;

  const STAT_CARDS = [
    { label: "Live Listeners",    value: stream?.listenersCount?.toString() ?? "—", icon: Radio,      sub: "Right now",              color: "text-red-400",    border: "border-red-500/20",    bg: "bg-red-500/10" },
    { label: "Peak Listeners",    value: peakListeners.toString(),                  icon: TrendingUp,  sub: "Last 30 days",           color: "text-gold-400",   border: "border-gold-500/20",   bg: "bg-gold-500/10" },
    { label: "Avg Daily Listeners",value: avgListeners.toString(),                  icon: Users,       sub: "Last 30 days",           color: "text-blue-400",   border: "border-blue-500/20",   bg: "bg-blue-500/10" },
    { label: "Total Stream Hours", value: `${Math.round(totalMinutes / 60)}h`,     icon: Clock,       sub: "Last 30 days",           color: "text-purple-400", border: "border-purple-500/20", bg: "bg-purple-500/10" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Analytics</h1>
        <p className="text-navy-400 text-sm">Listener counts, popular programs, and stream performance.</p>
      </div>

      {/* Live Stream Card */}
      <Card className="p-5 mb-6 flex items-center gap-5 bg-gradient-to-r from-navy-800/80 to-navy-900/80 border-red-500/20">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            {stream?.isLive && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            )}
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
          <span className="text-red-400 text-sm font-bold uppercase tracking-widest">Live</span>
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">
            {stream?.nowPlaying?.title ?? "Speaking Saints"}
          </p>
          <p className="text-navy-400 text-xs">{stream?.stationName}</p>
        </div>
        {stream?.isLive && (
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{stream.listenersCount}</p>
            <p className="text-navy-400 text-xs">listeners</p>
          </div>
        )}
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map(({ label, value, icon: Icon, sub, color, border, bg }) => (
          <Card key={label} className={`p-5 border ${border} ${bg}`}>
            <div className={`w-8 h-8 rounded-lg ${bg} border ${border} flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
            <p className="text-white text-xs font-medium">{label}</p>
            <p className="text-navy-500 text-xs mt-0.5">{sub}</p>
          </Card>
        ))}
      </div>

      {/* Recent Analytics Records */}
      <div>
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gold-400" /> Daily Listener History
        </h2>

        {loading ? (
          <div className="text-center py-8 text-navy-400">Loading analytics…</div>
        ) : records.length === 0 ? (
          <Card className="p-10 text-center">
            <BarChart3 className="w-10 h-10 text-gold-500/20 mx-auto mb-3" />
            <p className="text-navy-400 text-sm">No analytics data yet. Data will appear as listeners tune in.</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {records.map((r) => (
              <Card key={r.id} className="px-4 py-3 flex items-center gap-4">
                <span className="text-navy-400 text-sm font-mono w-28 flex-shrink-0">{r.date}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-gold-600 to-gold-400"
                      style={{ width: `${Math.min((r.listenerCount / Math.max(peakListeners, 1)) * 100, 100)}%`, minWidth: "4px", maxWidth: "200px" }}
                    />
                    <span className="text-white text-xs font-medium">{r.listenerCount} listeners</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-navy-300 text-xs">Peak: {r.peakListeners}</p>
                  <p className="text-navy-500 text-xs">{Math.round(r.totalStreamMinutes / 60)}h streamed</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
