import Link from "next/link";
import { Radio, Heart } from "lucide-react";

const LINKS = {
  Platform: [
    { href: "/listen",   label: "Listen Live" },
    { href: "/schedule", label: "Schedule" },
    { href: "/about",    label: "About Us" },
  ],
  Connect: [
    { href: "/contact",           label: "Contact" },
    { href: "/contact#prayer",    label: "Prayer Request" },
    { href: "/contact#testimony", label: "Share Testimony" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center">
                <Radio className="w-5 h-5 text-navy-900" />
              </div>
              <div>
                <span className="text-base font-bold text-white block leading-none">Speaking Saints</span>
                <span className="text-xs text-gold-400/70 uppercase tracking-widest">24/7 Faith Radio</span>
              </div>
            </Link>
            <p className="text-navy-300 text-sm leading-relaxed max-w-xs">
              An AI-powered, 24/7 Christian audio platform bringing scripture, devotionals, and faith-based programming to every listener.
            </p>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">{section}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-navy-300 hover:text-gold-400 text-sm transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-navy-400 text-sm">
            &copy; {new Date().getFullYear()} Speaking Saints. All rights reserved.
          </p>
          <p className="text-navy-500 text-xs flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400/60" /> for the Kingdom
          </p>
        </div>
      </div>
    </footer>
  );
}
