"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Mic2,
  Calendar,
  BookOpen,
  BarChart3,
  Radio,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Overview",        icon: LayoutDashboard },
  { href: "/admin/content",   label: "Content",         icon: BookOpen },
  { href: "/admin/scripts",   label: "Script Generator",icon: FileText },
  { href: "/admin/audio",     label: "Audio Generator", icon: Mic2 },
  { href: "/admin/schedule",  label: "Scheduler",       icon: Calendar },
  { href: "/admin/episodes",  label: "Episodes",        icon: Radio },
  { href: "/admin/analytics", label: "Analytics",       icon: BarChart3 },
];

export default function AdminNav({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/admin/login");
  }

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center flex-shrink-0">
          <Radio className="w-4 h-4 text-navy-900" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-none">Speaking Saints</p>
          <p className="text-gold-400/70 text-xs mt-0.5">Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                active
                  ? "bg-gold-500/15 text-gold-400 border border-gold-500/25"
                  : "text-navy-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-gold-400" : "text-navy-400 group-hover:text-white")} />
              {label}
              {active && <ChevronRight className="w-3 h-3 ml-auto text-gold-400/50" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-navy-400 hover:text-white hover:bg-white/5 transition-all duration-200 mb-1"
        >
          <Radio className="w-4 h-4" />
          View Public Site
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-navy-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
