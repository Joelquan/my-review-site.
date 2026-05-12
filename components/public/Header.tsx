"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/",         label: "Home" },
  { href: "/listen",   label: "Listen Live" },
  { href: "/schedule", label: "Schedule" },
  { href: "/about",    label: "About" },
  { href: "/contact",  label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-950/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center shadow-lg shadow-gold-500/30 group-hover:shadow-gold-500/50 transition-all duration-200">
              <Radio className="w-5 h-5 text-navy-900" />
            </div>
            <div>
              <span className="text-lg font-bold text-white leading-none block">
                Speaking Saints
              </span>
              <span className="text-xs text-gold-400/80 tracking-widest uppercase leading-none">
                24/7 Faith Radio
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "text-gold-400 bg-gold-500/10"
                    : "text-navy-200 hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/listen"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-gold-500/30 hover:scale-105 transition-all duration-200"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-navy-800 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-navy-800" />
              </span>
              Listen Live
            </Link>

            <button
              className="md:hidden p-2 text-navy-300 hover:text-white transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-navy-950/95 backdrop-blur-md border-t border-white/5 animate-fade-in">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                  pathname === link.href
                    ? "text-gold-400 bg-gold-500/10"
                    : "text-navy-200 hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/listen"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-semibold rounded-xl"
            >
              Listen Live
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
