"use client";

import { cn } from "@/lib/utils";

interface LiveIndicatorProps {
  isLive?: boolean;
  listeners?: number;
  className?: string;
}

export default function LiveIndicator({ isLive = true, listeners, className }: LiveIndicatorProps) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative flex h-2.5 w-2.5">
        {isLive && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2.5 w-2.5",
            isLive ? "bg-red-500" : "bg-navy-400"
          )}
        />
      </span>
      <span className="text-sm font-semibold tracking-wide uppercase">
        {isLive ? (
          <span className="text-red-400">Live</span>
        ) : (
          <span className="text-navy-400">Offline</span>
        )}
      </span>
      {isLive && listeners !== undefined && listeners > 0 && (
        <span className="text-xs text-navy-300">
          {listeners.toLocaleString()} {listeners === 1 ? "listener" : "listeners"}
        </span>
      )}
    </div>
  );
}
