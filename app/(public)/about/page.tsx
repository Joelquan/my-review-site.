import type { Metadata } from "next";
import { Radio, BookOpen, Heart, Zap, Globe, Mic2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Speaking Saints – our mission, vision, and heart for Christian broadcasting.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-950 to-navy-900">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(26,54,114,0.5),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(212,144,10,0.08),_transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-gold-500/30">
            <Radio className="w-8 h-8 text-navy-900" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            About{" "}
            <span className="bg-gradient-to-r from-gold-400 to-gold-300 bg-clip-text text-transparent">
              Speaking Saints
            </span>
          </h1>
          <p className="text-navy-200 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            A 24/7 AI-powered Christian audio platform built to bring the Word of God
            to every listener, every hour, every day.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-gold-400" />
              <span className="text-gold-400 text-sm font-semibold uppercase tracking-widest">Our Mission</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Proclaiming the Gospel,<br />Around the Clock
            </h2>
            <p className="text-navy-200 text-base leading-relaxed mb-4">
              Speaking Saints exists to make the timeless truth of scripture accessible to everyone —
              at every hour of the day. Whether it&apos;s 3 AM or 3 PM, a listener should be able to
              tune in and hear the Word of God spoken with clarity and conviction.
            </p>
            <p className="text-navy-200 text-base leading-relaxed">
              We believe that the Gospel has the power to transform lives, and that technology —
              used wisely — can extend the reach of that message far beyond the walls of any building.
            </p>
          </div>
          <Card className="p-8 bg-gradient-to-br from-navy-800/80 to-navy-900 border-gold-500/20">
            <blockquote className="text-white text-lg md:text-xl font-serif italic leading-relaxed mb-4">
              &ldquo;Go into all the world and preach the gospel to all creation.&rdquo;
            </blockquote>
            <cite className="not-italic text-gold-400 font-semibold text-sm">— Mark 16:15 (NIV)</cite>
          </Card>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 md:py-20 bg-navy-900/40 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-gold-400" />
              <span className="text-gold-400 text-sm font-semibold uppercase tracking-widest">Our Vision</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What We&apos;re Building
            </h2>
            <p className="text-navy-200 text-lg max-w-2xl mx-auto leading-relaxed">
              Speaking Saints is more than a radio station — it&apos;s a movement to fill the airways
              with scripture, hope, and the love of Jesus Christ.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Mic2,
                title: "AI-Generated Programming",
                body: "We use advanced AI to create scripture-grounded devotionals, teachings, and prayer content — reviewed to ensure biblical integrity.",
              },
              {
                icon: Radio,
                title: "24/7 Broadcast",
                body: "Our stream never goes dark. Morning, noon, and midnight — Speaking Saints is always on air with faith-filled programming.",
              },
              {
                icon: BookOpen,
                title: "Scripture-First Content",
                body: "Every program starts and ends with the Word of God. We don't replace scripture — we illuminate it.",
              },
              {
                icon: Heart,
                title: "Prayer & Community",
                body: "We take prayer requests seriously. Listeners are encouraged to submit prayer needs and we lift them up on air.",
              },
              {
                icon: Zap,
                title: "Modern Technology",
                body: "Built on cutting-edge infrastructure — fast, reliable streaming with real-time metadata and global reach.",
              },
              {
                icon: Globe,
                title: "Global Reach",
                body: "The Internet has no borders. Speaking Saints is accessible to any listener, anywhere in the world, at any time.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <Card key={title} hover className="p-6">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-gold-400" />
                </div>
                <h3 className="text-white font-bold mb-2">{title}</h3>
                <p className="text-navy-300 text-sm leading-relaxed">{body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What Speaking Saints Is */}
      <section className="py-16 md:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Speaking Saints Is
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 border-emerald-500/20 bg-emerald-500/5">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Speaking Saints IS
            </h3>
            <ul className="space-y-2 text-navy-200 text-sm">
              {[
                "A 24/7 faith-based audio streaming platform",
                "An AI-assisted content creation system for Christian radio",
                "A community-connected platform for prayer and testimony",
                "A modern, technology-driven approach to gospel broadcasting",
                "Accessible to anyone with an internet connection",
                "Committed to biblical accuracy and doctrinal soundness",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5 flex-shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 border-red-500/20 bg-red-500/5">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-red-400">✗</span> Speaking Saints Is NOT
            </h3>
            <ul className="space-y-2 text-navy-200 text-sm">
              {[
                "A replacement for church attendance or community worship",
                "A platform for divisive denominational debate",
                "A for-profit entertainment venture",
                "A source of theological speculation or unverified teaching",
                "A substitute for personal scripture reading and prayer",
                "Affiliated with any single denomination or church organization",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-navy-800 to-navy-950 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join the Speaking Saints Community</h2>
          <p className="text-navy-300 text-lg mb-8">
            Tune in, submit a prayer, share your testimony, or simply listen. Every soul is welcome.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/listen" className="btn-primary">
              <Radio className="w-5 h-5" /> Listen Now
            </Link>
            <Link href="/contact" className="btn-secondary">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
