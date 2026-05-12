"use client";

import { useState, useId } from "react";
import { Mail, Heart, MessageSquare, Send, CheckCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import toast from "react-hot-toast";

type Tab = "contact" | "prayer" | "testimony";

export default function ContactPage() {
  const [tab, setTab] = useState<Tab>("contact");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<Tab | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>, type: Tab) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type }),
      });

      if (!res.ok) throw new Error("Failed to send");

      setSent(type);
      form.reset();
      toast.success(
        type === "prayer"
          ? "Prayer request received. We are lifting you up."
          : type === "testimony"
          ? "Testimony received. Thank you for sharing!"
          : "Message sent. We will be in touch soon."
      );
    } catch {
      toast.error("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const TABS: { id: Tab; label: string; icon: typeof Mail }[] = [
    { id: "contact",   label: "Contact Us",    icon: Mail },
    { id: "prayer",    label: "Prayer Request", icon: Heart },
    { id: "testimony", label: "Testimony",      icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-950 to-navy-900">
      {/* Header */}
      <section className="py-16 md:py-20 border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Connect With Us
          </h1>
          <p className="text-navy-200 text-lg">
            We&apos;d love to hear from you. Send a message, submit a prayer request, or share your testimony.
          </p>
        </div>
      </section>

      {/* Tabs + Form */}
      <section className="py-12 md:py-16 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tab Switcher */}
        <div className="flex gap-2 mb-8 bg-navy-800/60 p-1 rounded-2xl border border-white/10">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setTab(id); setSent(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                tab === id
                  ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                  : "text-navy-300 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Sent Confirmation */}
        {sent === tab ? (
          <Card className="p-10 text-center border-emerald-500/30">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-white font-bold text-xl mb-2">
              {tab === "prayer" ? "Prayer Request Received" : tab === "testimony" ? "Testimony Submitted" : "Message Sent!"}
            </h3>
            <p className="text-navy-300 text-sm mb-6">
              {tab === "prayer"
                ? "We receive your request with open hands. You are being lifted in prayer."
                : tab === "testimony"
                ? "Thank you for sharing what God has done. Your testimony may encourage others."
                : "We have received your message and will respond shortly."}
            </p>
            <Button variant="secondary" onClick={() => setSent(null)}>
              Send Another
            </Button>
          </Card>
        ) : (
          <Card className="p-6 md:p-8">
            {/* Contact Form */}
            {tab === "contact" && (
              <form onSubmit={(e) => handleSubmit(e, "contact")} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input name="name" label="Your Name" placeholder="John Smith" required />
                  <Input name="email" type="email" label="Email Address" placeholder="you@example.com" required />
                </div>
                <Input name="subject" label="Subject" placeholder="What is this about?" />
                <Textarea name="message" label="Message" placeholder="Write your message here…" rows={6} required />
                <Button type="submit" loading={loading} className="w-full">
                  <Send className="w-4 h-4" /> Send Message
                </Button>
              </form>
            )}

            {/* Prayer Request Form */}
            {tab === "prayer" && (
              <form onSubmit={(e) => handleSubmit(e, "prayer")} className="space-y-5">
                <div className="p-4 bg-gold-500/5 border border-gold-500/20 rounded-xl mb-2">
                  <p className="text-navy-300 text-sm leading-relaxed">
                    <span className="text-gold-400 font-semibold">You are not alone.</span>{" "}
                    Every prayer request is read and prayed over. Share as much or as little as you feel led.
                  </p>
                </div>
                <Input name="name" label="Your Name (optional)" placeholder="First name or anonymous" />
                <Input name="email" type="email" label="Email (optional)" placeholder="For a personal response" />
                <Textarea
                  name="request"
                  label="Prayer Request"
                  placeholder="Share your prayer need here…"
                  rows={6}
                  required
                />
                <Button type="submit" loading={loading} className="w-full">
                  <Heart className="w-4 h-4" /> Submit Prayer Request
                </Button>
              </form>
            )}

            {/* Testimony Form */}
            {tab === "testimony" && (
              <form onSubmit={(e) => handleSubmit(e, "testimony")} className="space-y-5">
                <div className="p-4 bg-gold-500/5 border border-gold-500/20 rounded-xl mb-2">
                  <p className="text-navy-300 text-sm leading-relaxed">
                    <span className="text-gold-400 font-semibold">Share what God has done.</span>{" "}
                    Testimonies encourage others and glorify God. Your story matters.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input name="name" label="Your Name (optional)" placeholder="First name or anonymous" />
                  <Input name="title" label="Testimony Title" placeholder="Give it a short title" required />
                </div>
                <Textarea
                  name="body"
                  label="Your Testimony"
                  placeholder="Share what God has done in your life…"
                  rows={8}
                  required
                />
                <Button type="submit" loading={loading} className="w-full">
                  <MessageSquare className="w-4 h-4" /> Share Testimony
                </Button>
              </form>
            )}
          </Card>
        )}
      </section>
    </div>
  );
}
