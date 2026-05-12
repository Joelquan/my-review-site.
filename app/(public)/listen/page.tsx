import type { Metadata } from "next";
import { Radio, Users, Wifi } from "lucide-react";
import AudioPlayer from "@/components/public/AudioPlayer";
import LiveIndicator from "@/components/public/LiveIndicator";
import Card from "@/components/ui/Card";
import { fetchNowPlaying } from "@/lib/streaming/azuracast";

export const metadata: Metadata = {
  title: "Listen Live",
  description: "Tune in to Speaking Saints 24/7 live Christian radio stream.",
};

export const revalidate = 15;

export default async function ListenPage() {
  const stream = await fetchNowPlaying().catch(() => null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-950 to-navy-900">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,144,10,0.08),_transparent_70%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <LiveIndicator
            isLive={stream?.isLive ?? true}
            listeners={stream?.listenersCount}
            className="justify-center mb-6"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Listen to{" "}
            <span className="bg-gradient-to-r from-gold-400 to-gold-300 bg-clip-text text-transparent">
              Speaking Saints
            </span>
          </h1>
          <p className="text-navy-200 text-lg md:text-xl mb-12 max-w-xl mx-auto">
            24/7 faith-based audio. Tune in from anywhere, on any device.
          </p>

          {/* Main Player */}
          <div className="max-w-lg mx-auto">
            <AudioPlayer streamMetadata={stream} className="mb-6" />
          </div>
        </div>
      </section>

      {/* Stream Details */}
      <section className="py-12 md:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-3">
              <Radio className="w-5 h-5 text-gold-400" />
            </div>
            <h3 className="text-white font-semibold mb-1">Station</h3>
            <p className="text-navy-300 text-sm">{stream?.stationName ?? "Speaking Saints"}</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-3">
              <Users className="w-5 h-5 text-gold-400" />
            </div>
            <h3 className="text-white font-semibold mb-1">Listeners</h3>
            <p className="text-navy-300 text-sm">
              {stream?.isLive
                ? `${stream.listenersCount.toLocaleString()} online now`
                : "Tune in to listen"}
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-3">
              <Wifi className="w-5 h-5 text-gold-400" />
            </div>
            <h3 className="text-white font-semibold mb-1">Quality</h3>
            <p className="text-navy-300 text-sm">MP3 128kbps</p>
          </Card>
        </div>

        {/* Now Playing Details */}
        {stream?.nowPlaying && (
          <Card className="p-6 md:p-8 bg-gradient-to-r from-navy-800/80 to-navy-900/80 border-gold-500/20">
            <h2 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              Now Playing
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-navy-400 mb-1">Program</p>
                <p className="text-white font-medium">{stream.nowPlaying.title}</p>
              </div>
              {stream.nowPlaying.artist && (
                <div>
                  <p className="text-navy-400 mb-1">Host / Artist</p>
                  <p className="text-white font-medium">{stream.nowPlaying.artist}</p>
                </div>
              )}
              {stream.nowPlaying.album && (
                <div>
                  <p className="text-navy-400 mb-1">Collection</p>
                  <p className="text-white font-medium">{stream.nowPlaying.album}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Stream Connection Instructions */}
        <div className="mt-10">
          <h2 className="text-white font-bold text-xl mb-4">Other Ways to Listen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Direct Stream URL", value: stream?.streamUrl ?? "Configure AzuraCast stream URL", mono: true },
              { label: "Format", value: "MP3 Audio Stream", mono: false },
              { label: "Compatible With", value: "VLC, iTunes, Winamp, any Icecast-compatible player", mono: false },
              { label: "Updates", value: "Program metadata refreshes every 15 seconds", mono: false },
            ].map(({ label, value, mono }) => (
              <Card key={label} className="p-4">
                <p className="text-navy-400 text-xs mb-1">{label}</p>
                <p className={`text-white text-sm ${mono ? "font-mono text-xs break-all" : ""}`}>{value}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
