export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Mail, Mic2, Heart, Shield, Radio } from "lucide-react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import AudioPlayer from "@/components/public/AudioPlayer";
import LiveIndicator from "@/components/public/LiveIndicator";
import DailyVerse from "@/components/public/DailyVerse";
import ProgramSchedule from "@/components/public/ProgramSchedule";
import Card from "@/components/ui/Card";
import { fetchNowPlaying } from "@/lib/streaming/azuracast";
import { getLatestEpisodes, getTodaysVerse, getTodaySchedule } from "@/lib/firebase/firestore";
import type { Episode, ScheduleSlot, Verse } from "@/types";

export const metadata = {
  title: "Speaking Saints – 24/7 Christian Audio Platform",
  description: "AI-powered 24/7 faith-based audio platform featuring scripture, devotionals, and Christian programming.",
};

async function getHomeData() {
  try {
    const [streamData, verse, episodes, schedule] = await Promise.allSettled([
      fetchNowPlaying(),
      getTodaysVerse(),
      getLatestEpisodes(6),
      getTodaySchedule(),
    ]);

    return {
      stream:   streamData.status === "fulfilled" ? streamData.value   : null,
      verse:    verse.status      === "fulfilled" ? verse.value as Verse        : null,
      episodes: episodes.status   === "fulfilled" ? episodes.value as Episode[] : [],
      schedule: schedule.status   === "fulfilled" ? schedule.value as ScheduleSlot[] : [],
    };
  } catch {
    return { stream: null, verse: null, episodes: [], schedule: [] };
  }
}

export default async function HomePage() {
  const { stream, verse, episodes, schedule } = await getHomeData();

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 md:pt-20">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,144,10,0.12),_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(26,54,114,0.4),_transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#e8a820 1px, transparent 1px), linear-gradient(to right, #e8a820 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="animate-slide-up">
                <LiveIndicator isLive={stream?.isLive ?? true} listeners={stream?.listenersCount} className="mb-6" />
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6">
                  Faith. Scripture.
                  <br />
                  <span className="bg-gradient-to-r from-gold-400 to-gold-300 bg-clip-text text-transparent">
                    On Air 24/7.
                  </span>
                </h1>
                <p className="text-navy-200 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
                  Speaking Saints is an AI-powered Christian audio platform bringing scripture, devotionals, and faith programming to every corner of the world.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/listen" className="btn-primary text-base">
                    <Radio className="w-5 h-5" /> Listen Live
                  </Link>
                  <Link href="/about" className="btn-secondary text-base">
                    Our Mission <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="animate-fade-in">
                <p className="text-xs text-navy-400 font-semibold uppercase tracking-widest mb-1">
                  {stream?.nowPlaying ? "Now Playing" : "Live Stream"}
                </p>
                <h2 className="text-white font-bold text-xl truncate mb-4">
                  {stream?.nowPlaying?.title ?? "Speaking Saints Live"}
                </h2>
                <AudioPlayer streamMetadata={stream} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Daily Verse + Prayer CTA ─────────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-navy-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <DailyVerse verse={verse} />
              </div>
              <Card className="p-6 flex flex-col justify-between bg-gradient-to-br from-gold-500/10 to-gold-600/5 border-gold-500/20">
                <div>
                  <Heart className="w-6 h-6 text-gold-400 mb-3" />
                  <h3 className="text-white font-bold text-lg mb-2">Share Your Prayer</h3>
                  <p className="text-navy-300 text-sm leading-relaxed">Submit a prayer request and let our community lift you up.</p>
                </div>
                <Link href="/contact#prayer" className="mt-4 btn-primary justify-center text-sm">
                  <Mail className="w-4 h-4" /> Send Prayer Request
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* ── Schedule ─────────────────────────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-navy-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="section-title">Today&apos;s Schedule</h2>
                <p className="section-subtitle">What&apos;s on air today</p>
              </div>
              <Link href="/schedule" className="text-gold-400 text-sm font-semibold hover:text-gold-300 flex items-center gap-1 transition-colors">
                Full Schedule <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <Suspense fallback={<div className="text-navy-400 text-sm">Loading schedule…</div>}>
              <ProgramSchedule slots={schedule} />
            </Suspense>
          </div>
        </section>

        {/* ── Latest Episodes ──────────────────────────────────────────────── */}
        {episodes.length > 0 && (
          <section className="py-16 md:py-20 bg-navy-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h2 className="section-title">Latest Episodes</h2>
                <p className="section-subtitle">Recent programming from Speaking Saints</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {episodes.map((ep) => (
                  <Card key={ep.id} hover as="article" className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Mic2 className="w-4 h-4 text-gold-400" />
                      <span className="text-xs text-gold-400 font-semibold uppercase tracking-wide">Episode</span>
                    </div>
                    <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">{ep.title}</h3>
                    {ep.description && <p className="text-navy-400 text-xs line-clamp-2">{ep.description}</p>}
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Feature Pillars ──────────────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-navy-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Radio,    title: "24/7 Live Stream",    body: "Round-the-clock faith-based programming so you can tune in any time, day or night." },
                { icon: BookOpen, title: "Scripture-First",     body: "Every program is grounded in the Word of God. Scripture drives every broadcast." },
                { icon: Shield,   title: "AI-Powered",          body: "Advanced AI generates authentic, spirit-led scripts and voices for a premium audio experience." },
              ].map(({ icon: Icon, title, body }) => (
                <Card key={title} className="p-6 text-center" hover>
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-gold-400" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                  <p className="text-navy-300 text-sm leading-relaxed">{body}</p>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/about" className="btn-secondary">
                Learn More About Us <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-navy-800 to-navy-950 border-t border-white/5">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to tune in?</h2>
            <p className="text-navy-300 text-lg mb-8">Join thousands of listeners experiencing faith-based audio programming around the clock.</p>
            <Link href="/listen" className="btn-primary text-lg">
              <Radio className="w-5 h-5" /> Start Listening Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
